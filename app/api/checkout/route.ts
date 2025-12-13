import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type PlanId = "chat" | "plus" | "unlimited";
const PLANS_TABLE = "pricing_plans";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const siteUrlRaw = process.env.NEXT_PUBLIC_SITE_URL || "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function isPlan(v: unknown): v is PlanId {
  return v === "chat" || v === "plus" || v === "unlimited";
}
function cleanSiteUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

const stripe =
  stripeSecretKey !== ""
    ? new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" })
    : null;

const supabaseServer =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
    : null;

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY manquante." }, { status: 500 });
    }
    if (!siteUrlRaw) {
      return NextResponse.json({ error: "NEXT_PUBLIC_SITE_URL manquante." }, { status: 500 });
    }
    if (!supabaseServer) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL manquantes." },
        { status: 500 }
      );
    }

    const siteUrl = cleanSiteUrl(siteUrlRaw);

    const body = (await req.json().catch(() => ({}))) as {
      plan?: unknown;
      lang?: unknown;
      user_id?: unknown;
    };

    const plan = body.plan;
    const lang = typeof body.lang === "string" ? body.lang : "";
    const userId = typeof body.user_id === "string" ? body.user_id : "";

    if (!isPlan(plan)) return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    if (!userId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    const { data: planRow, error: planErr } = await supabaseServer
      .from(PLANS_TABLE)
      .select("code, stripe_price_id")
      .eq("code", plan)
      .maybeSingle();

    if (planErr) {
      return NextResponse.json({ error: `Supabase: ${planErr.message}` }, { status: 500 });
    }
    if (!planRow?.stripe_price_id) {
      return NextResponse.json({ error: `stripe_price_id manquant pour ${plan}.` }, { status: 500 });
    }

    const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : "";
    const successUrl = `${siteUrl}/stripe/return?session_id={CHECKOUT_SESSION_ID}${langParam}`;
    const cancelUrl = `${siteUrl}/payment/cancel${lang ? `?lang=${encodeURIComponent(lang)}` : ""}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planRow.stripe_price_id, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { user_id: userId, plan_code: plan },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Session Stripe sans URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Erreur serveur checkout." },
      { status: 500 }
    );
  }
}
