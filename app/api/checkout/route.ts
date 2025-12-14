// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type PlanId = "chat" | "plus" | "unlimited";
const PLANS_TABLE = "pricing_plans";

// --- Helpers ---
const isPlan = (v: unknown): v is PlanId =>
  v === "chat" || v === "plus" || v === "unlimited";

const cleanUrl = (url: string) => (url.endsWith("/") ? url.slice(0, -1) : url);

// --- Env checks (fail fast, messages explicites) ---
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!STRIPE_SECRET_KEY) {
  console.error("[checkout] STRIPE_SECRET_KEY manquante");
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("[checkout] SUPABASE URL / SERVICE_ROLE manquants");
}
if (!SITE_URL) {
  console.error("[checkout] NEXT_PUBLIC_SITE_URL manquante");
}

const stripe =
  STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" }) : null;

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe non configuré (clé manquante)." }, { status: 500 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin non configuré (URL/Service Role)." },
        { status: 500 }
      );
    }
    if (!SITE_URL) {
      return NextResponse.json({ error: "SITE_URL manquante." }, { status: 500 });
    }

    // Parse corps de requête, même si ce n’est pas du JSON valide
    let bodyRaw = "";
    try {
      bodyRaw = await req.text();
    } catch {
      // ignore
    }
    let body: any = {};
    try {
      body = bodyRaw ? JSON.parse(bodyRaw) : {};
    } catch {
      return NextResponse.json(
        { error: "Corps de requête invalide (JSON attendu).", raw: bodyRaw },
        { status: 400 }
      );
    }

    const plan = body?.plan as unknown;
    const lang = typeof body?.lang === "string" ? body.lang : "";
    const user_id = typeof body?.user_id === "string" ? body.user_id : "";

    if (!isPlan(plan)) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }
    if (!user_id) {
      return NextResponse.json({ error: "Utilisateur non authentifié." }, { status: 401 });
    }

    // Récupère le price Stripe depuis la table
    const { data: planRow, error: planErr } = await supabaseAdmin
      .from(PLANS_TABLE)
      .select("stripe_price_id")
      .eq("code", plan)
      .maybeSingle();

    if (planErr) {
      return NextResponse.json({ error: `Supabase: ${planErr.message}` }, { status: 500 });
    }
    if (!planRow?.stripe_price_id) {
      return NextResponse.json(
        { error: `stripe_price_id manquant pour le plan "${plan}".` },
        { status: 500 }
      );
    }

    const site = cleanUrl(SITE_URL);
    const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : "";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // payment_method_types est implicite pour "card" en 2023-10-16, mais on le laisse pour clarté
      payment_method_types: ["card"],
      line_items: [{ price: planRow.stripe_price_id, quantity: 1 }],
      success_url: `${site}/stripe/return?session_id={CHECKOUT_SESSION_ID}${langParam}`,
      cancel_url: `${site}/payment/cancel${lang ? `?lang=${encodeURIComponent(lang)}` : ""}`,
      client_reference_id: user_id,
      metadata: { user_id, plan },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Session Stripe sans URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("[checkout] ERROR:", err);
    // On renvoie toujours une chaîne claire pour ton console.log côté client
    return NextResponse.json(
      { error: err?.message ?? "Erreur serveur checkout." },
      { status: 500 }
    );
  }
  }
