// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

type PlanId = "chat" | "plus" | "unlimited";
const PLANS_TABLE = "pricing_plans";

const isPlan = (v: unknown): v is PlanId =>
  v === "chat" || v === "plus" || v === "unlimited";

const cleanUrl = (url: string) => (url.endsWith("/") ? url.slice(0, -1) : url);

// ENV
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
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

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe non configuré (STRIPE_SECRET_KEY manquante)." },
        { status: 500 }
      );
    }
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin non configuré (URL/Service Role manquants)." },
        { status: 500 }
      );
    }
    if (!SITE_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SITE_URL manquante." },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      plan?: unknown;
      lang?: unknown;
    };

    const plan = body.plan;
    const lang = typeof body.lang === "string" ? body.lang : "";

    if (!isPlan(plan)) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }

    // Auth via cookies
    const supabase = createRouteHandlerClient({ cookies });
    const { data: userData, error: userErr } = await supabase.auth.getUser();

    if (userErr || !userData?.user) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié." },
        { status: 401 }
      );
    }

    const user_id = userData.user.id;

    // Fetch stripe_price_id from pricing_plans
    const { data: planRow, error: planErr } = await supabaseAdmin
      .from(PLANS_TABLE)
      .select("stripe_price_id")
      .eq("code", plan)
      .maybeSingle();

    if (planErr) {
      return NextResponse.json(
        { error: `Supabase: ${planErr.message}` },
        { status: 500 }
      );
    }

    if (!planRow?.stripe_price_id) {
      return NextResponse.json(
        { error: `stripe_price_id manquant pour le plan "${plan}".` },
        { status: 500 }
      );
    }

    const site = cleanUrl(SITE_URL);

    const successUrl =
      `${site}/stripe/return?session_id={CHECKOUT_SESSION_ID}` +
      (lang ? `&lang=${encodeURIComponent(lang)}` : "");

    const cancelUrl =
      `${site}/payment/cancel` +
      (lang ? `?lang=${encodeURIComponent(lang)}` : "");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planRow.stripe_price_id, quantity: 1 }],

      success_url: successUrl,
      cancel_url: cancelUrl,

      client_reference_id: user_id,

      metadata: { user_id, plan },
      subscription_data: { metadata: { user_id, plan } },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Session Stripe sans URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    console.error("[checkout] ERROR:", err);
    const msg = err instanceof Error ? err.message : "Erreur serveur checkout.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
