// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

type PlanId = "chat" | "plus" | "unlimited";
const PLANS_TABLE = "pricing_plans";

/* ===========================
   ENV
=========================== */
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const siteUrlRaw = process.env.NEXT_PUBLIC_SITE_URL || "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/* ===========================
   HELPERS
=========================== */
function isPlan(v: unknown): v is PlanId {
  return v === "chat" || v === "plus" || v === "unlimited";
}
function cleanSiteUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/* ===========================
   STRIPE INIT
=========================== */
const stripe =
  stripeSecretKey
    ? new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" })
    : null;

/* ===========================
   SUPABASE SERVICE ROLE (server-only)
=========================== */
const supabaseServer =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

export async function POST(req: Request) {
  try {
    // 0) config
    if (!stripe) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY manquante." },
        { status: 500 }
      );
    }
    if (!siteUrlRaw) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SITE_URL manquante." },
        { status: 500 }
      );
    }
    if (!supabaseServer) {
      return NextResponse.json(
        { error: "Supabase server (service role) non configuré." },
        { status: 500 }
      );
    }

    const siteUrl = cleanSiteUrl(siteUrlRaw);

    // 1) body
    const body = (await req.json().catch(() => ({}))) as {
      plan?: unknown;
      lang?: unknown;
    };

    const plan = body.plan;
    const lang = typeof body.lang === "string" ? body.lang : "";

    if (!isPlan(plan)) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }

    // 2) ✅ AUTH SERVER via cookies Supabase
    // IMPORTANT: on passe une fonction qui retourne le cookieStore
    const supabaseAuth = createRouteHandlerClient({
      cookies: () => cookies(),
    });

    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();

    if (userErr) {
      console.error("getUser error:", userErr);
      return NextResponse.json(
        { error: "Non authentifié (cookie session absent/invalid)." },
        { status: 401 }
      );
    }

    const userId = userData?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié (pas de userId)." },
        { status: 401 }
      );
    }

    // 3) get stripe_price_id
    const { data: planRow, error: planErr } = await supabaseServer
      .from(PLANS_TABLE)
      .select("code, stripe_price_id")
      .eq("code", plan)
      .maybeSingle();

    if (planErr) {
      console.error("pricing_plans fetch error:", planErr);
      return NextResponse.json(
        { error: "Erreur Supabase en lisant pricing_plans." },
        { status: 500 }
      );
    }

    if (!planRow?.stripe_price_id) {
      return NextResponse.json(
        { error: `stripe_price_id manquant pour ${plan}.` },
        { status: 500 }
      );
    }

    // 4) urls
    const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : "";
    const successUrl = `${siteUrl}/stripe/return?session_id={CHECKOUT_SESSION_ID}${langParam}`;
    const cancelUrl = `${siteUrl}/payment/cancel${
      lang ? `?lang=${encodeURIComponent(lang)}` : ""
    }`;

    // 5) create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: planRow.stripe_price_id, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { user_id: userId, plan_code: plan },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe session créée mais sans URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("checkout error:", err?.message);
    return NextResponse.json(
      { error: err?.message ?? "Erreur serveur checkout." },
      { status: 500 }
    );
  }
}
