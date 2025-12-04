import { NextResponse } from "next/server";
import Stripe from "stripe";

type PlanId = "chat" | "plus" | "unlimited";

// ⚠️ On lit les env, mais SANS throw ici
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

// On instancie Stripe uniquement si on a une clé
const stripe =
  stripeSecretKey !== ""
    ? new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
      })
    : null;

// Mapping plan → priceId Stripe
const PLAN_CONFIG: Record<PlanId, { priceId?: string }> = {
  chat: {
    priceId: process.env.STRIPE_PRICE_CHAT,
  },
  plus: {
    priceId: process.env.STRIPE_PRICE_PLUS,
  },
  unlimited: {
    priceId: process.env.STRIPE_PRICE_UNLIMITED,
  },
};

export async function POST(req: Request) {
  try {
    const { plan, user_id } = (await req.json()) as {
      plan?: PlanId;
      user_id?: string;
    };

    // 1) Validation plan / user
    if (!plan || !["chat", "plus", "unlimited"].includes(plan)) {
      return NextResponse.json(
        { error: "Plan invalide." },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id manquant pour la session Stripe." },
        { status: 400 }
      );
    }

    // 2) Vérifier la config Stripe
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

    const cfg = PLAN_CONFIG[plan];

    if (!cfg || !cfg.priceId) {
      console.error("Price ID manquant pour le plan :", plan);
      return NextResponse.json(
        { error: "Aucun price Stripe configuré pour ce plan." },
        { status: 500 }
      );
    }

    // 3) Créer la session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: cfg.priceId,
          quantity: 1,
        },
      ],
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
