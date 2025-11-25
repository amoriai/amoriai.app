// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const priceChat = process.env.STRIPE_PRICE_CHAT;
const pricePlus = process.env.STRIPE_PRICE_PLUS;
const priceUnlimited = process.env.STRIPE_PRICE_UNLIMITED;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
if (!siteUrl) {
  throw new Error("Missing NEXT_PUBLIC_SITE_URL");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan } = body as { plan?: "chat" | "plus" | "unlimited" };

    if (!plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 });
    }

    let priceId: string | undefined;

    if (plan === "chat") priceId = priceChat;
    if (plan === "plus") priceId = pricePlus;
    if (plan === "unlimited") priceId = priceUnlimited;

    if (!priceId) {
      return NextResponse.json(
        { error: "No Stripe price configured for this plan" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // tu peux mettre un trial period plus tard si tu veux
      success_url: `${siteUrl}/payment/success?plan=${plan}`,
      cancel_url: `${siteUrl}/payment/cancel?plan=${plan}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}
