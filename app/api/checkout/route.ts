import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

type PlanId = "chat" | "plus" | "unlimited";

// Env
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

// Supabase service role (IMPORTANT: côté serveur seulement)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Table
const PLANS_TABLE = "pricing_plans";

// Stripe init
const stripe =
  stripeSecretKey !== ""
    ? new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" })
    : null;

// Supabase server client (service role)
const supabaseServer =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

export async function POST(req: Request) {
  try {
    const { plan, user_id } = (await req.json()) as {
      plan?: PlanId;
      user_id?: string;
    };

    // 1) Validation
    if (!plan || !["chat", "plus", "unlimited"].includes(plan)) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id manquant pour la session Stripe." },
        { status: 400 }
      );
    }

    // 2) Vérifier config Stripe + URL
    if (!stripe) {
      console.error("Stripe non initialisé : STRIPE_SECRET_KEY manquante");
      return NextResponse.json(
        { error: "Configuration Stripe manquante côté serveur." },
        { status: 500 }
      );
    }

    if (!siteUrl) {
      console.error("NEXT_PUBLIC_SITE_URL manquante");
      return NextResponse.json(
        { error: "Configuration siteUrl manquante côté serveur." },
        { status: 500 }
      );
    }

    // 3) Vérifier config Supabase server
    if (!supabaseServer) {
      console.error(
        "Supabase server non initialisé : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquante"
      );
      return NextResponse.json(
        { error: "Configuration Supabase manquante côté serveur." },
        { status: 500 }
      );
    }

    // 4) Charger le stripe_price_id depuis Supabase
    const { data: planRow, error: planErr } = await supabaseServer
      .from(PLANS_TABLE)
      .select("code, stripe_price_id, is_active")
      .eq("code", plan)
      .single();

    if (planErr) {
      console.error("Supabase fetch pricing_plans error:", planErr);
      return NextResponse.json(
        { error: "Impossible de récupérer le plan (Supabase)." },
        { status: 500 }
      );
    }

    if (!planRow?.stripe_price_id) {
      console.error("stripe_price_id manquant pour le plan :", plan, planRow);
      return NextResponse.json(
        { error: "Aucun price Stripe configuré pour ce plan." },
        { status: 500 }
      );
    }

    if (planRow?.is_active === false) {
      return NextResponse.json(
        { error: "Ce plan est désactivé pour le moment." },
        { status: 400 }
      );
    }

    // 5) Créer la session checkout Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planRow.stripe_price_id, quantity: 1 }],
      success_url: `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment/cancel`,
      metadata: {
        user_id,
        plan_code: plan,
      },
    });

    if (!session.url) {
      console.error("Stripe a créé la session, mais sans URL :", session.id);
      return NextResponse.json(
        { error: "Impossible de générer l’URL de paiement Stripe." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du checkout." },
      { status: 500 }
    );
  }
}
