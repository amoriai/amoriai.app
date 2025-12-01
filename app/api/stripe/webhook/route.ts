import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Supabase admin (service key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  if (!sig) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

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
    // Quand un abonnement est payé
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.user_id;
      const planKey = session.metadata?.pricing_plan_id as
        | "free"
        | "chat"
        | "plus"
        | "unlimited"
        | undefined;

      if (!userId || !planKey) {
        console.warn("Webhook: userId ou planKey manquant");
      } else {
        // On mappe la clé interne sur le nom de ton tableau pricing_plans
        let planName: string;
        switch (planKey) {
          case "chat":
            planName = "AmoriA Chat";
            break;
          case "plus":
            planName = "AmoriA Plus";
            break;
          case "unlimited":
            planName = "AmoriA Illimité";
            break;
          case "free":
          default:
            planName = "AmoriA Découverte";
            break;
        }

        // On va chercher la ligne correspondante dans pricing_plans
        const { data: plan, error: planError } = await supabaseAdmin
          .from("pricing_plans")
          .select("id")
          .eq("name", planName)
          .maybeSingle();

        if (planError || !plan) {
          console.error("Webhook: plan introuvable", planError);
        } else {
          // On met les anciens abonnements à current = false
          await supabaseAdmin
            .from("user_subscriptions")
            .update({ current: false })
            .eq("user_id", userId);

          // On enregistre / met à jour l'abonnement courant
          await supabaseAdmin
            .from("user_subscriptions")
            .upsert(
              {
                user_id: userId,
                pricing_plan_id: plan.id,
                stripe_customer_id: String(session.customer ?? ""),
                stripe_subscription_id: String(session.subscription ?? ""),
                current: true,
              },
              { onConflict: "user_id" }
            );
        }
      }
    }

    // Tu pourras ajouter ici d’autres types d’événements (annulation, etc.)

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return new NextResponse("Webhook internal error", { status: 500 });
  }
}
