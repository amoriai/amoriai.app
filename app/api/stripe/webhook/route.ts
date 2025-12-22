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

const stripe =
  STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" }) : null;

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

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

export async function POST(req: Request) {
  // Basic env checks (safe)
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

        const userId = session.metadata?.user_id || null;
        const planCode = (session.metadata?.plan as PlanCode | undefined) || undefined;

        if (!userId || !planCode) {
          console.warn("Webhook: missing session metadata", session.metadata);
          return new NextResponse("Missing metadata", { status: 200 });
        }

        const pricing_plan_id = await planIdFromCode(planCode);
        if (!pricing_plan_id) {
          console.error("Webhook: plan code not found in pricing_plans", planCode);
          return new NextResponse("Plan not found", { status: 200 });
        }

        const payload = {
          user_id: userId,
          pricing_plan_id,
          stripe_customer_id: session.customer ? String(session.customer) : null,
          stripe_subscription_id: session.subscription ? String(session.subscription) : null,
          status: "active",
          current: true,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabaseAdmin
          .from("user_subscriptions")
          .upsert(payload, { onConflict: "user_id" });

        if (error) console.error("Webhook upsert error:", error);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const userId = (sub.metadata?.user_id as string | undefined) || undefined;
        if (!userId) {
          console.warn("Webhook: missing subscription metadata.user_id", sub.metadata);
          return new NextResponse("Missing user_id", { status: 200 });
        }

        const priceId = sub.items?.data?.[0]?.price?.id;
        const pricing_plan_id = await planIdFromStripePriceId(priceId);

        const status = sub.status || (event.type === "customer.subscription.deleted" ? "canceled" : "unknown");
        const isCurrent = status === "active";

        const payload: any = {
          user_id: userId,
          stripe_customer_id: sub.customer ? String(sub.customer) : null,
          stripe_subscription_id: sub.id,
          status,
          current: event.type === "customer.subscription.deleted" ? false : isCurrent,
          updated_at: new Date().toISOString(),
        };

        if (pricing_plan_id) payload.pricing_plan_id = pricing_plan_id;

        const { error } = await supabaseAdmin
          .from("user_subscriptions")
          .upsert(payload, { onConflict: "user_id" });

        if (error) console.error("Webhook subscription upsert error:", error);
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
