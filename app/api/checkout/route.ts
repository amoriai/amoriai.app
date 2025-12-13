// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type PlanId = "chat" | "plus" | "unlimited";

const PLANS_TABLE = "pricing_plans";

// ENV
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const siteUrlRaw = process.env.NEXT_PUBLIC_SITE_URL || "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Helpers
function isPlan(v: unknown): v is PlanId {
  return v === "chat" || v === "plus" || v === "unlimited";
}

function cleanSiteUrl(url: string): string {
  // Enlève le slash final pour éviter //payment/...
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

// Stripe
const stripe =
  stripeSecretKey !== ""
    ? new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" })
    : null;

// Supabase (service role) — serveur seulement
const supabaseServer =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

export async function POST(req: Request) {
  try {
    // 1) Parse body
    const body = (await req.json().catch(() => ({}))) as {
      plan?: unknown;
      user_id?: unknown;
    };

    const plan = body.plan;
    const user_id = body.user_id;

    // 2) Validation
    if (!isPlan(plan)) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }

    if (!user_id || typeof user_id !== "string") {
      return NextResponse.json(
        { error: "user_id manquant pour la session Stripe." },
        { status: 400 }
      );
    }

    // 3) Vérifier config
    if (!stripe) {
      console.error("Stripe non initialisé : STRIPE_SECRET_KEY manquante");
      return NextResponse.json(
        { error: "Configuration Stripe manquante côté serveur." },
        { status: 500 }
      );
    }

    if (!siteUrlRaw) {
      console.error("NEXT_PUBLIC_SITE_URL manquante");
      return NextResponse.json(
        { error: "Configuration siteUrl manquante côté serveur." },
        { status: 500 }
      );
    }

    if (!supabaseServer) {
      console.error(
        "Supabase server non initialisé : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquante"
      );
      return NextResponse.json(
        { error: "Configuration Supabase manquante côté serveur." },
        { status: 500 }
      );
    }

    const siteUrl = cleanSiteUrl(siteUrlRaw);

    // 4) Lire le stripe_price_id dans Supabase
    // IMPORTANT: le champ doit être pricing_plans.code = "chat"|"plus"|"unlimited"
    const { data: planRow, error: planErr } = await supabaseServer
      .from(PLANS_TABLE)
      .select("code, stripe_price_id")
      .eq("code", plan)
      .maybeSingle();

    if (planErr) {
      console.error("Supabase fetch pricing_plans error:", planErr);
      return NextResponse.json(
        { error: `Impossible de récupérer le plan (Supabase): ${planErr.message}` },
        { status: 500 }
      );
    }

    if (!planRow) {
      return NextResponse.json(
        { error: `Plan introuvable (code=${plan}). Vérifie pricing_plans.code.` },
        { status: 400 }
      );
    }

    if (!planRow.stripe_price_id) {
      console.error("stripe_price_id manquant pour le plan :", plan, planRow);
      return NextResponse.json(
        { error: `Aucun price Stripe configuré pour le plan ${plan}.` },
        { status: 500 }
      );
    }

    // 5) Créer la session Stripe Checkout (subscription)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planRow.stripe_price_id, quantity: 1 }],
      success_url: `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment/cancel`,
      metadata: {
        user_id,
        plan_code: plan, // IMPORTANT: utilisé par ton webhook
      },
    });

    if (!session.url) {
      console.error("Stripe a créé la session, mais sans URL :", session.id);
      return NextResponse.json(
        { error: "Impossible de générer l’URL de paiement Stripe." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    // Logs détaillés Stripe (super important pour diagnostiquer)
    console.error("Stripe checkout error (détails):", {
      message: err?.message,
      type: err?.type,
      code: err?.code,
      statusCode: err?.statusCode,
      raw: err?.raw,
    });

    return NextResponse.json(
      { error: err?.message ?? "Erreur serveur lors de la création du checkout." },
      { status: 500 }
    );
  }
}
