import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const { plan, user_id } = await req.json();

  const PRICE_MAP: any = {
    chat: process.env.STRIPE_PRICE_CHAT,
    plus: process.env.STRIPE_PRICE_PLUS,
    unlimited: process.env.STRIPE_PRICE_UNLIMITED,
  };

  const priceId = PRICE_MAP[plan];

  if (!priceId) {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: { user_id },
  });

  return NextResponse.json({ url: session.url });
}
