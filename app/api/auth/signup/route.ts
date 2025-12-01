import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// On lit les IDs venant des variables d'environnement Vercel
const PLAN_CONFIG: Record<
  "chat" | "plus" | "unlimited",
  { priceId?: string; pricingPlanId?: string }
> = {
  chat: {
    priceId: process.env.STRIPE_PRICE_CHAT,
    pricingPlanId: process.env.PRICING_PLAN_CHAT_ID,
  },
  plus: {
    priceId: process.env.STRIPE_PRICE_PLUS,
    pricingPlanId: process.env.PRICING_PLAN_PLUS_ID,
  },
  unlimited: {
    priceId: process.env.STRIPE_PRICE_UNLIMITED,
    pricingPlanId: process.env.PRICING_PLAN_UNLIMITED_ID,
  },
};

export async function POST(req: Request) {
  try {
    const { plan, user_id } = (await req.json()) as {
      plan?: "chat" | "plus" | "unlimited";
      user_id?: string;
    };

    if (!plan || !user_id) {
      return NextResponse.json(
        { error: "Plan ou user_id manquant" },
        { status: 400 }
      );
    }

    const cfg = PLAN_CONFIG[plan];

    if (!cfg?.priceId || !cfg?.pricingPlanId) {
      return NextResponse.json(
        { error: "Plan invalide côté serveur" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: cfg.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup`,

      metadata: {
        user_id,                 // id Supabase de l’utilisateur
        pricing_plan_id: cfg.pricingPlanId, // UUID pricing_plans
        plan_code: plan,         // juste informatif
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe signup error:", err);
    return NextResponse.json(
      { error: "Erreur serveur Stripe" },
      { status: 500 }
    );
  }
}
