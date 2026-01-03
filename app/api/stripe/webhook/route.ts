// app/api/stripe/webhook/route.ts
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlanCode = "chat" | "plus" | "unlimited";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Stripe + Supabase admin
const stripe =
  STRIPE_SECRET_KEY
    ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
    : null;

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

// --------------------
// Utils
// --------------------
function unixToIso(ts: number | null | undefined) {
  if (!ts) return null;
  return new Date(ts * 1000).toISOString();
}

function isActiveLike(status?: string | null) {
  const s = (status ?? "").toLowerCase();
  return s === "active" || s === "trialing";
}

async function planIdFromCode(code: PlanCode) {
  const { data, error } = await supabaseAdmin!
    .from("pricing_plans")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (error || !data?.id) return null;
  return data.id as string;
}

async function planIdFromStripePriceId(priceId: string | null) {
  if (!priceId) return null;

  const { data, error } = await supabaseAdmin!
    .from("pricing_plans")
    .select("id")
    .eq("stripe_price_id", priceId)
    .maybeSingle();

  if (error || !data?.id) return null;
  return data.id as string;
}

async function userIdFromStripeCustomerId(customerId: string) {
  const { data, error } = await supabaseAdmin!
    .from("user_subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) return null;
  return (data?.user_id as string | null) ?? null;
}

async function upsertUserSub(payload: Record<string, unknown>) {
  const { error } = await supabaseAdmin!
    .from("user_subscriptions")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    console.error("❌ Supabase upsert user_subscriptions error:", error, payload);
  }
}

// --------------------
// Handlers
// --------------------
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // On s'attend à ce que /api/checkout ait mis metadata.user_id et metadata.plan
  const userId = (session.metadata?.user_id as string | undefined) ?? null;
  const plan = (session.metadata?.plan as PlanCode | undefined) ?? null;

  if (!userId) {
    console.warn("⚠️ checkout.session.completed sans metadata.user_id", {
      sessionId: session.id,
      metadata: session.metadata,
    });
    return;
  }

  // Récupérer le priceId de façon fiable:
  // -> lister les line items de la session
  let priceId: string | null = null;
  try {
    const lineItems = await stripe!.checkout.sessions.listLineItems(session.id, { limit: 1 });
    const li = lineItems.data?.[0];

    if (li?.price && typeof li.price === "object") {
      priceId = li.price.id;
    }
  } catch (e) {
    console.error("❌ listLineItems failed", { sessionId: session.id, err: (e as any)?.message });
  }

  const stripeCustomerId = session.customer ? String(session.customer) : null;
  const stripeSubscriptionId = session.subscription ? String(session.subscription) : null;

  // Plan ID: priorité au code (si tu l'envoies), sinon mapping via priceId
  const pricingPlanId =
    plan ? await planIdFromCode(plan) : await planIdFromStripePriceId(priceId);

  if (!pricingPlanId) {
    console.warn("⚠️ pricing_plan_id introuvable (checkout)", {
      sessionId: session.id,
      plan,
      priceId,
    });
  }

  // IMPORTANT:
  // On upsert au minimum stripe_customer_id ici,
  // pour que les events subscription.* puissent retrouver user_id via customerId.
  await upsertUserSub({
    user_id: userId,
    pricing_plan_id: pricingPlanId ?? null,

    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    stripe_checkout_session_id: session.id,
    stripe_price_id: priceId,

    // Ne force pas current ici; le statut réel vient de subscription.*
    updated_at: new Date().toISOString(),
  });
}

async function handleSubscriptionEvent(sub: Stripe.Subscription, eventType: string) {
  const customerId = sub.customer ? String(sub.customer) : null;

  // 1) si tu as mis metadata.user_id sur la subscription (optionnel)
  let userId = (sub.metadata?.user_id as string | undefined) ?? null;

  // 2) fallback via stripe_customer_id stocké dans user_subscriptions
  if (!userId && customerId) {
    userId = await userIdFromStripeCustomerId(customerId);
  }

  if (!userId) {
    console.warn("⚠️ Impossible de résoudre user_id pour subscription", {
      subId: sub.id,
      customerId,
      eventType,
      metadata: sub.metadata,
    });
    return;
  }

  const priceId = sub.items?.data?.[0]?.price?.id ?? null;
  const pricingPlanId = await planIdFromStripePriceId(priceId);

  if (!pricingPlanId) {
    console.warn("⚠️ pricing_plan_id introuvable (subscription)", {
      subId: sub.id,
      priceId,
      eventType,
    });
  }

  const stripeStatus =
    sub.status ||
    (eventType === "customer.subscription.deleted" ? "canceled" : "unknown");

  const current =
    eventType === "customer.subscription.deleted" ? false : isActiveLike(stripeStatus);

  const currentPeriodEnd = unixToIso(sub.current_period_end);
  const canceledAt =
    eventType === "customer.subscription.deleted"
      ? new Date().toISOString()
      : unixToIso(sub.canceled_at);

  await upsertUserSub({
    user_id: userId,
    pricing_plan_id: pricingPlanId ?? null,

    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    stripe_price_id: priceId,

    stripe_status: stripeStatus,
    current_period_end: currentPeriodEnd,
    canceled_at: canceledAt,

    current,
    updated_at: new Date().toISOString(),
  });
}

// --------------------
// Route
// --------------------
export async function POST(req: Request) {
  // Check config
  if (!stripe || !STRIPE_WEBHOOK_SECRET || !supabaseAdmin) {
    console.error("❌ Webhook not configured", {
      stripe: !!stripe,
      webhookSecret: !!STRIPE_WEBHOOK_SECRET,
      supabaseAdmin: !!supabaseAdmin,
    });
    return new NextResponse("Webhook not configured", { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing Stripe signature", { status: 400 });

  // App Router: req.text() = raw body OK pour la signature
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    const msg = e?.message ?? "Invalid signature";
    console.error("❌ Webhook signature error:", msg);
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionEvent(sub, event.type);
        break;
      }

      default: {
        // Si tu veux diagnostiquer, décommente:
        // console.log("Unhandled event:", event.type);
        break;
      }
    }

    return new NextResponse("ok", { status: 200 });
  } catch (e: any) {
    const msg = e?.message ?? "Webhook handler error";
    console.error("❌ Webhook handler error:", msg, { type: event.type });
    return new NextResponse("Webhook internal error", { status: 500 });
  }
}
