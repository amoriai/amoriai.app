"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

const LOADING_TEXT: Record<Locale, string> = {
  fr: "Connexion en cours...",
  en: "Signing you in...",
  es: "Iniciando sesión...",
};

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const finalizeAuth = async () => {
      const langParam = (searchParams.get("lang") as Locale) || "fr";
      const lang: Locale =
        langParam === "fr" || langParam === "en" || langParam === "es"
          ? langParam
          : "fr";

      // On force toujours le plan de départ à "free" après Google
      const plan: PlanId = "free";

      // 1) Vérifier la session Supabase
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        // Pas de session → retour au signup
        const params = new URLSearchParams();
        params.set("lang", lang);
        params.set("plan", plan);

        router.replace(`/signup?${params.toString()}`);
        return;
      }

      const user = data.session.user;

      try {
        // 2) Vérifier si l'utilisateur a déjà une subscription active
        const { data: existingSub, error: subError } = await supabase
          .from("user_subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        if (subError) {
          console.error("Erreur lecture user_subscriptions:", subError);
        }

        if (!existingSub) {
          // 3) Récupérer le plan "free"
          const { data: pricingPlan, error: pricingError } = await supabase
            .from("pricing_plans")
            .select("id")
            .eq("code", plan)
            .maybeSingle();

          if (pricingError) {
            console.error("Erreur pricing_plans (free):", pricingError);
          }

          if (pricingPlan?.id) {
            // 4) Créer la subscription free si elle n'existe pas
            const { error: insertError } = await supabase
              .from("user_subscriptions")
              .insert({
                user_id: user.id,
                pricing_plan_id: pricingPlan.id,
                current: true,
              });

            if (insertError) {
              console.error(
                "Erreur insert user_subscriptions (free):",
                insertError
              );
            }
          }
        }
      } catch (err) {
        console.error("Erreur dans finalizeAuth:", err);
      }

      // 5) Redirection finale : CRÉATION DE L’AMORIAI, PAS LES PLANS
      const params = new URLSearchParams();
      params.set("lang", lang);
      params.set("plan", plan);

      router.replace(`/create-amoria?${params.toString()}`);
    };

    finalizeAuth();
  }, [router, searchParams]);

  const langParam = (searchParams.get("lang") as Locale) || "fr";
  const lang: Locale =
    langParam === "fr" || langParam === "en" || langParam === "es"
      ? langParam
      : "fr";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {LOADING_TEXT[lang]}
    </div>
  );
}
