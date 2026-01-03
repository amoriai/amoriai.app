// app/api/stripe/sync/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

function isActiveStatus(status?: string | null) {
  const s = (status ?? "").toLowerCase();
  return s === "active" || s === "trialing";
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

export async function POST(req: Request) {
  try {
    if (!stripe) return jsonError("STRIPE_SECRET_KEY manquante.", 500);
    if (!supabaseAdmin) return jsonError("Supabase admin non configuré.", 500);

    // ✅ user connecté obligatoire (sécurité)
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();
    if (userErr || !userData?.user) return jsonError("Non authentifié.", 401);

    const user_id = userData.user.id;

    const body = (await req.json().catch(() => ({}))) as { session_id?: string };
    const session_id = (body.session_id ?? "").trim();
    if (!session_id) return jsonError("session_id manquant.", 400);

    // Récupère session + line_items + subscription
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "subscription"],
    });

    const customerId = session.customer ? String(session.customer) : null;
    const subscriptionId = session.subscription ? String(session.subscription) : null;

    const li = (session.line_items?.data?.[0] as any) ?? null;
    const price = li?.price as string | Stripe.Price | undefined;
    const priceId = typeof price === "string" ? price : price?.id ?? null;

    let stripe_status: string | null = null;
    let current = false;

    const subObj = session.subscription as Stripe.Subscription | null;
    if (subObj?.status) {
      stripe_status = subObj.status;
      current = isActiveStatus(subObj.status);
    }

    const pricing_plan_id = await planIdFromStripePriceId(priceId);

    const payload: Record<string, any> = {
      user_id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_checkout_session_id: session.id,
      stripe_price_id: priceId,
      stripe_status,
      current,
      updated_at: new Date().toISOString(),
    };

    if (pricing_plan_id) payload.pricing_plan_id = pricing_plan_id;

    const { error } = await supabaseAdmin
      .from("user_subscriptions")
      .upsert(payload, { onConflict: "user_id" });

    if (error) return jsonError(`Supabase upsert error: ${error.message}`, 500);

    return NextResponse.json({ ok: true, current, stripe_status, pricing_plan_id }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "sync error" },
      { status: 500 }
    );
  }
}
