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

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const finalizeAuth = async () => {
      const lang = normalizeLocale(searchParams.get("lang"));
      const plan: PlanId = "free"; // plan de départ

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
        // 2) Vérifier si une subscription active existe déjà
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

      // 5) Redirection finale : TOUJOURS /my-amoria
      const params = new URLSearchParams();
      params.set("lang", lang);
      params.set("plan", plan);

      router.replace(`/my-amoria?${params.toString()}`);
    };

    void finalizeAuth();
  }, [router, searchParams]);

  const lang = normalizeLocale(searchParams.get("lang"));

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {LOADING_TEXT[lang]}
    </div>
  );
}
