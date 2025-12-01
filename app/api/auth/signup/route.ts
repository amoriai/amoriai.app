import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Mapping ENTRE ton plan interne et Stripe
const PRICE_MAP: Record<string, string | undefined> = {
  chat: process.env.STRIPE_PRICE_CHAT,
  plus: process.env.STRIPE_PRICE_PLUS,
  unlimited: process.env.STRIPE_PRICE_UNLIMITED,
};

export async function POST(req: Request) {
  try {
    const { plan, user_id } = await req.json();

    if (!plan || !user_id) {
      return NextResponse.json(
        { error: "Plan ou user_id manquant" },
        { status: 400 }
      );
    }

    const priceId = PRICE_MAP[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: "Plan invalide" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup`,

      // ✅ CE QUE LE WEBHOOK VA UTILISER
      metadata: {
        user_id,              // id Supabase
        pricing_plan_id: plan // "chat" | "plus" | "unlimited"
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
