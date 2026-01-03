// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type PlanCode = "chat" | "plus" | "unlimited";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!STRIPE_SECRET_KEY) console.warn("⚠️ STRIPE_SECRET_KEY missing");
if (!STRIPE_WEBHOOK_SECRET) console.warn("⚠️ STRIPE_WEBHOOK_SECRET missing");
if (!SUPABASE_URL) console.warn("⚠️ NEXT_PUBLIC_SUPABASE_URL missing");
if (!SUPABASE_SERVICE_ROLE_KEY) console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY missing");

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

// ---------- Helpers ----------
async function planIdFromCode(planCode: PlanCode) {
  const { data, error } = await supabaseAdmin!
    .from("pricing_plans")
    .select("id")
    .eq("code", planCode)
    .maybeSingle();

  if (error || !data?.id) return null;
  return data.id as string;
}

async function planIdFromStripePriceId(priceId: string | null | undefined) {
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

function unixToIso(ts: number | null | undefined) {
  if (!ts) return null;
  return new Date(ts * 1000).toISOString();
}

/**
 * Upsert subscription state into user_subscriptions
 */
async function upsertFromSubscription(sub: Stripe.Subscription, eventType: string) {
  const customerId = sub.customer ? String(sub.customer) : null;

  let userId: string | null =
    (sub.metadata?.user_id as string | undefined) ?? null;

  if (!userId && customerId) {
    userId = await userIdFromStripeCustomerId(customerId);
  }

  if (!userId) {
    console.warn("Webhook: cannot resolve user_id for subscription", {
      subId: sub.id,
      customerId,
      metadata: sub.metadata,
    });
    return;
  }

  const priceId = sub.items?.data?.[0]?.price?.id ?? null;
  const pricing_plan_id = await planIdFromStripePriceId(priceId);

  // ✅ ton champ DB s'appelle stripe_status (pas status)
  const stripe_status =
    sub.status ||
    (eventType === "customer.subscription.deleted" ? "canceled" : "unknown");

  const isCurrent = stripe_status === "active" || stripe_status === "trialing";
  const current = eventType === "customer.subscription.deleted" ? false : isCurrent;

  // ✅ dates Stripe
  const current_period_end = unixToIso(sub.current_period_end);
  const canceled_at =
    eventType === "customer.subscription.deleted"
      ? new Date().toISOString()
      : unixToIso(sub.canceled_at);

  const payload: Record<string, any> = {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,

    // ✅ nouvelles colonnes
    stripe_price_id: priceId,
    stripe_status,
    current_period_end,
    canceled_at,

    current,
    updated_at: new Date().toISOString(),
  };

  if (pricing_plan_id) payload.pricing_plan_id = pricing_plan_id;

  const { error } = await supabaseAdmin!
    .from("user_subscriptions")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    console.error("Webhook subscription upsert error:", error, payload);
  }
}

// ---------- Webhook handler ----------
export async function POST(req: Request) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET || !supabaseAdmin) {
    return new NextResponse("Webhook not configured", { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing Stripe signature", { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err?.message);
    return new NextResponse(`Webhook Error: ${err?.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = (session.metadata?.user_id as string | undefined) ?? null;
        const planCode = (session.metadata?.plan as PlanCode | undefined) ?? null;

        if (!userId) {
          console.warn("Webhook: missing session.metadata.user_id", session.metadata);
          break;
        }

        // ✅ IMPORTANT: récupérer line_items + price via un retrieve expand
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items.data.price"],
        });

        const priceId =
          (fullSession.line_items?.data?.[0]?.price as Stripe.Price | undefined)?.id ??
          null;

        const pricing_plan_id = planCode ? await planIdFromCode(planCode) : null;

        const payload: Record<string, any> = {
          user_id: userId,
          stripe_customer_id: fullSession.customer ? String(fullSession.customer) : null,
          stripe_subscription_id: fullSession.subscription ? String(fullSession.subscription) : null,

          // ✅ nouvelles colonnes
          stripe_checkout_session_id: fullSession.id,
          stripe_price_id: priceId,

          updated_at: new Date().toISOString(),
        };

        if (pricing_plan_id) payload.pricing_plan_id = pricing_plan_id;

        const { error } = await supabaseAdmin
          .from("user_subscriptions")
          .upsert(payload, { onConflict: "user_id" });

        if (error) console.error("Webhook checkout upsert error:", error, payload);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertFromSubscription(sub, event.type);
        break;
      }

      default:
        break;
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook handler error:", err);
    return new NextResponse("Webhook internal error", { status: 500 });
  }
}
