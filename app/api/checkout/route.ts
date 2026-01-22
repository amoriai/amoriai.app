// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ Ajout du "daypass24h"
type PlanId = "chat" | "plus" | "unlimited" | "daypass24h";
type Locale = "fr" | "en" | "es";

const PLANS_TABLE = "pricing_plans";

// ✅ Ton price Stripe pour 24h
const DAYPASS_24H_PRICE_ID = "price_1SsPPSQctELy6iN1ODu4qD4r";

// =======================================================
// Helpers
// =======================================================
function isPlan(v: unknown): v is PlanId {
  return v === "chat" || v === "plus" || v === "unlimited" || v === "daypass24h";
}

function isLocale(v: unknown): v is Locale {
  return v === "fr" || v === "en" || v === "es";
}

function cleanUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

// =======================================================
// ENV
// =======================================================
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

// =======================================================
// Route
// =======================================================
export async function POST(req: Request) {
  try {
    // Sanity checks
    if (!stripe) return jsonError("Stripe non configuré: STRIPE_SECRET_KEY manquante.", 500);
    if (!supabaseAdmin) {
      return jsonError(
        "Supabase admin non configuré: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquante.",
        500
      );
    }
    if (!SITE_URL) return jsonError("NEXT_PUBLIC_SITE_URL manquante.", 500);

    // Body
    const body = (await req.json().catch(() => ({}))) as {
      plan?: unknown;
      lang?: unknown;
    };

    if (!isPlan(body.plan)) return jsonError("Plan invalide.", 400);

    const plan: PlanId = body.plan;
    const lang: Locale = isLocale(body.lang) ? body.lang : "fr";

    // Auth (user logged in)
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();
    if (userErr || !userData?.user) return jsonError("Utilisateur non authentifié.", 401);

    const user_id = userData.user.id;
    const user_email = userData.user.email ?? null;

    const site = cleanUrl(SITE_URL);

    // URLs
    // Tu peux ajuster ces pages si tu veux un écran success dédié au daypass
    const successUrl =
      `${site}/my-amoria?lang=${encodeURIComponent(lang)}` +
      `&session_id={CHECKOUT_SESSION_ID}&paid=1`;
    const cancelUrl = `${site}/pricing?lang=${encodeURIComponent(lang)}&canceled=1`;

    // =======================================================
    // ✅ CAS 1: DAYPASS 24H (one-time payment)
    // =======================================================
    if (plan === "daypass24h") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: DAYPASS_24H_PRICE_ID, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,

        client_reference_id: user_id,
        ...(user_email ? { customer_email: user_email } : {}),

        metadata: {
          user_id,
          plan: "daypass24h",
          lang,
        },
      });

      if (!session.url) return jsonError("Session Stripe créée, mais URL manquante.", 500);
      return NextResponse.json({ url: session.url, session_id: session.id }, { status: 200 });
    }

    // =======================================================
    // ✅ CAS 2: SUBSCRIPTIONS (chat/plus/unlimited)
    // =======================================================

    // Anti-doublon : si déjà active/trialing, on évite de recréer un checkout subscription
    try {
      const { data: existingSub, error: existingErr } = await supabaseAdmin
        .from("user_subscriptions")
        .select("stripe_status, stripe_price_id")
        .eq("user_id", user_id)
        .in("stripe_status", ["active", "trialing"])
        .maybeSingle();

      if (!existingErr && existingSub?.stripe_status) {
        const alreadyUrl = `${site}/my-amoria?lang=${encodeURIComponent(lang)}&already_subscribed=1`;
        return NextResponse.json({ url: alreadyUrl, session_id: null }, { status: 200 });
      }
    } catch {
      // ignore
    }

    // Get Stripe price from DB for subscriptions
    const { data: planRow, error: planErr } = await supabaseAdmin
      .from(PLANS_TABLE)
      .select("stripe_price_id")
      .eq("code", plan)
      .maybeSingle();

    if (planErr) return jsonError(`Supabase pricing_plans: ${planErr.message}`, 500);

    const priceId = (planRow?.stripe_price_id as string | null) ?? null;
    if (!priceId) return jsonError(`stripe_price_id manquant pour le plan "${plan}".`, 500);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],

      success_url: successUrl,
      cancel_url: cancelUrl,

      client_reference_id: user_id,
      ...(user_email ? { customer_email: user_email } : {}),

      metadata: {
        user_id,
        plan,
        lang,
      },

      subscription_data: {
        metadata: {
          user_id,
          plan,
          lang,
        },
      },

      payment_method_collection: "always",
    });

    if (!session.url) return jsonError("Session Stripe créée, mais URL manquante.", 500);

    return NextResponse.json({ url: session.url, session_id: session.id }, { status: 200 });
  } catch (err: unknown) {
    console.error("[checkout] ERROR:", err);
    const msg = err instanceof Error ? err.message : "Erreur serveur checkout.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
