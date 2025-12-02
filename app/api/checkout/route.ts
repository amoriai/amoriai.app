import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL; // ex. https://amoriai.app

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.");
}
if (!siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is not defined in environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

type PlanId = "chat" | "plus" | "unlimited";

// 🔗 Mapping entre TON code et les prices Stripe (UNIQUEMENT les priceId)
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

    // 1) Validation de base
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

    // 2) Récupérer la config du plan
    const cfg = PLAN_CONFIG[plan];

    if (!cfg || !cfg.priceId) {
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
        user_id,          // id Supabase de l'utilisateur
        plan_code: plan,  // "chat" | "plus" | "unlimited"
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Impossible de générer l’URL de paiement Stripe." },
        { status: 500 }
      );
    }

    // 4) Retourner l’URL au frontend
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du checkout." },
      { status: 500 }
    );
  }
}
