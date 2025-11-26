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
  apiVersion: "2023-10-16",
});

type PlanId = "free" | "chat" | "plus" | "unlimited";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as { plan?: PlanId } | null;

    const plan = body?.plan;

    if (!plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 });
    }

    // langue récupérée depuis l’URL de l’API : /api/checkout?lang=fr
    const url = new URL(req.url);
    const rawLang = url.searchParams.get("lang");
    const lang =
      rawLang === "en" || rawLang === "es" || rawLang === "fr"
        ? rawLang
        : "fr";

    // 🔹 Forfait gratuit : pas de Stripe, on renvoie direct vers create-amoria
    if (plan === "free") {
      const redirectUrl = `${siteUrl}/create-amoria?plan=free&lang=${lang}`;
      return NextResponse.json({ url: redirectUrl }, { status: 200 });
    }

    // 🔹 Autres forfaits : on choisit le bon price_id
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
      success_url: `${siteUrl}/create-amoria?plan=${plan}&lang=${lang}`,
      cancel_url: `${siteUrl}/pricing?lang=${lang}`,
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
