import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type PlanId = "chat" | "plus" | "unlimited";
const PLANS_TABLE = "pricing_plans";

/* ✅ AUCUN await ici */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function cleanUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, lang, user_id } = body;

    if (!plan || !user_id) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const { data: planRow, error } = await supabase
      .from(PLANS_TABLE)
      .select("stripe_price_id")
      .eq("code", plan)
      .single();

    if (error || !planRow?.stripe_price_id) {
      return NextResponse.json(
        { error: "Stripe price not found" },
        { status: 500 }
      );
    }

    const siteUrl = cleanUrl(process.env.NEXT_PUBLIC_SITE_URL!);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: planRow.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/stripe/return?session_id={CHECKOUT_SESSION_ID}&lang=${lang}`,
      cancel_url: `${siteUrl}/pricing?lang=${lang}`,
      client_reference_id: user_id,
      metadata: { user_id, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
