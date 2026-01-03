// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

type PlanId = "chat" | "plus" | "unlimited";
type Locale = "fr" | "en" | "es";

const PLANS_TABLE = "pricing_plans";

// ---------- Helpers ----------
function isPlan(v: unknown): v is PlanId {
  return v === "chat" || v === "plus" || v === "unlimited";
}

function isLocale(v: unknown): v is Locale {
  return v === "fr" || v === "en" || v === "es";
}

function cleanUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

// ---------- ENV ----------
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Stripe client (server)
const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

// Supabase admin (service role)
const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

// ---------- Route ----------
export async function POST(req: Request) {
  try {
    // Sanity checks
    if (!stripe) return jsonError("Stripe non configuré: STRIPE_SECRET_KEY manquante.", 500);
    if (!supabaseAdmin) {
      return jsonError(
        "Supabase admin non configuré: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquante.",
        500
      );
    }
    if (!SITE_URL) return jsonError("NEXT_PUBLIC_SITE_URL manquante.", 500);

    // Body
    const body = (await req.json().catch(() => ({}))) as {
      plan?: unknown;
      lang?: unknown;
    };

    const plan = body.plan;
    const lang: Locale = isLocale(body.lang) ? body.lang : "fr";

    if (!isPlan(plan)) return jsonError("Plan invalide.", 400);

    // Auth via cookies (user must be logged in)
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();

    if (userErr || !userData?.user) {
      return jsonError("Utilisateur non authentifié.", 401);
    }

    const user_id = userData.user.id;

    // Get Stripe price for this plan from DB
    const { data: planRow, error: planErr } = await supabaseAdmin
      .from(PLANS_TABLE)
      .select("stripe_price_id")
      .eq("code", plan)
      .maybeSingle();

    if (planErr) return jsonError(`Supabase pricing_plans: ${planErr.message}`, 500);

    const priceId = planRow?.stripe_price_id as string | null | undefined;
    if (!priceId) return jsonError(`stripe_price_id manquant pour le plan "${plan}".`, 500);

    const site = cleanUrl(SITE_URL);

    // Stripe redirects (ces routes doivent exister)
    const successUrl =
      `${site}/stripe/return?lang=${encodeURIComponent(lang)}` +
      `&session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl =
      `${site}/pricing?lang=${encodeURIComponent(lang)}` +
      `&canceled=1`;

    // Create Checkout Session (subscription)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      // ✅ plus fiable: force la création d'un customer Stripe
      customer_creation: "always",

      line_items: [{ price: priceId, quantity: 1 }],

      success_url: successUrl,
      cancel_url: cancelUrl,

      // Link user <-> Stripe
      client_reference_id: user_id,

      metadata: {
        user_id,
        plan,
        lang,
      },

      subscription_data: {
        // ✅ essai gratuit 3 jours (pas de débit immédiat)
        trial_period_days: 3,
        metadata: {
          user_id,
          plan,
          lang,
        },
      },

      // (optionnel mais souvent utile)
      payment_method_collection: "always",
    });

    if (!session.url) return jsonError("Session Stripe créée, mais URL manquante.", 500);

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    console.error("[checkout] ERROR:", err);
    const msg = err instanceof Error ? err.message : "Erreur serveur checkout.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
        }
