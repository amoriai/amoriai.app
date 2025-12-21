// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// ✅ ENV (validation propre, pas de "!")
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
if (!STRIPE_WEBHOOK_SECRET) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
if (!SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// 🔒 Tes plans Stripe payants (free ne passe pas par Stripe)
type PlanCode = "chat" | "plus" | "unlimited";

export async function POST(req: Request) {
  // 1) Signature Stripe
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing Stripe signature", { status: 400 });

  // 2) Raw body obligatoire
  const rawBody = await req.text();

  // 3) Vérification signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err?.message);
    return new NextResponse(`Webhook Error: ${err?.message}`, { status: 400 });
  }

  try {
    // ✅ On traite au minimum: completed + update + deleted
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // ✅ IMPORTANT: ton /api/checkout envoie metadata: { user_id, plan }
        const userId = session.metadata?.user_id || null;
        const planCode = (session.metadata?.plan as PlanCode | undefined) || undefined;

        if (!userId || !planCode) {
          console.warn("Webhook: metadata manquante", session.metadata);
          return new NextResponse("Missing metadata", { status: 200 });
        }

        // 1) Récupérer pricing_plan_id depuis pricing_plans.code
        const { data: planRow, error: planErr } = await supabaseAdmin
          .from("pricing_plans")
          .select("id")
          .eq("code", planCode)
          .maybeSingle();

        if (planErr || !planRow?.id) {
          console.error("Webhook: plan introuvable", planCode, planErr);
          return new NextResponse("Plan not found", { status: 200 });
        }

        // 2) ✅ Modèle SIMPLE: 1 ligne par user_id (onConflict user_id)
        //    -> pas besoin de "current=false" avant, pas besoin d'historique
        const payload = {
          user_id: userId,
          pricing_plan_id: planRow.id,
          stripe_customer_id: session.customer ? String(session.customer) : null,
          stripe_subscription_id: session.subscription ? String(session.subscription) : null,
          status: "active",
          updated_at: new Date().toISOString(),
        };

        const { error: upsertErr } = await supabaseAdmin
          .from("user_subscriptions")
          .upsert(payload, { onConflict: "user_id" });

        if (upsertErr) {
          console.error("Webhook: upsert error", upsertErr);
        }

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        // On récupère user_id depuis metadata de la subscription (tu l’ajoutes dans /api/checkout)
        const userId = (sub.metadata?.user_id as string | undefined) || undefined;
        const planCode = (sub.metadata?.plan as PlanCode | undefined) || undefined;

        // Si pas de userId, on ne peut pas relier (mais on répond 200 pour Stripe)
        if (!userId) {
          console.warn("Webhook: subscription metadata user_id manquante", sub.metadata);
          return new NextResponse("Missing subscription user_id", { status: 200 });
        }

        // status Stripe: active, canceled, unpaid, past_due, etc.
        const status = sub.status || (event.type === "customer.subscription.deleted" ? "canceled" : "unknown");

        // (optionnel) remettre pricing_plan_id si on a plan metadata
        let pricing_plan_id: string | null = null;
        if (planCode) {
          const { data: planRow, error: planErr } = await supabaseAdmin
            .from("pricing_plans")
            .select("id")
            .eq("code", planCode)
            .maybeSingle();

          if (!planErr && planRow?.id) pricing_plan_id = planRow.id;
        }

        const payload: any = {
          user_id: userId,
          stripe_customer_id: sub.customer ? String(sub.customer) : null,
          stripe_subscription_id: sub.id,
          status,
          updated_at: new Date().toISOString(),
        };

        if (pricing_plan_id) payload.pricing_plan_id = pricing_plan_id;

        const { error: upsertErr } = await supabaseAdmin
          .from("user_subscriptions")
          .upsert(payload, { onConflict: "user_id" });

        if (upsertErr) console.error("Webhook: subscription upsert error", upsertErr);

        break;
      }

      default:
        // On ignore le reste
        break;
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook handler error:", err);
    return new NextResponse("Webhook internal error", { status: 500 });
  }
}
