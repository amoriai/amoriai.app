import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PlanCode = "free" | "chat" | "plus" | "unlimited";

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  if (!sig) return new NextResponse("Missing Stripe signature", { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.user_id;
      const planCode = session.metadata?.plan_code as PlanCode | undefined;

      if (!userId || !planCode) {
        console.warn("Webhook: user_id ou plan_code manquant", session.metadata);
        return new NextResponse("Missing metadata", { status: 200 });
      }

      // Cherche le plan par code (stable)
      const { data: plan, error: planError } = await supabaseAdmin
        .from("pricing_plans")
        .select("id")
        .eq("code", planCode)
        .maybeSingle();

      if (planError || !plan) {
        console.error("Webhook: plan introuvable pour code =", planCode, planError);
        return new NextResponse("Plan not found", { status: 200 });
      }

      // Met les anciens abonnements à current=false
      await supabaseAdmin
        .from("user_subscriptions")
        .update({ current: false })
        .eq("user_id", userId);

      // Upsert abonnement courant (nécessite user_id UNIQUE)
      const { error: upsertError } = await supabaseAdmin
        .from("user_subscriptions")
        .upsert(
          {
            user_id: userId,
            pricing_plan_id: plan.id,
            stripe_customer_id: session.customer ? String(session.customer) : null,
            stripe_subscription_id: session.subscription ? String(session.subscription) : null,
            current: true,
          },
          { onConflict: "user_id" }
        );

      if (upsertError) {
        console.error("Webhook: upsert error", upsertError);
      }
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return new NextResponse("Webhook internal error", { status: 500 });
  }
}
