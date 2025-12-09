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

  // Langue et plan récupérés une seule fois
  const lang = normalizeLocale(searchParams.get("lang"));
  const plan: PlanId = "free";

  useEffect(() => {
    const finalizeAuth = async () => {
      // 1) Vérifier la session Supabase
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        const params = new URLSearchParams();
        params.set("lang", lang);
        params.set("plan", plan);
        router.replace(`/signup?${params.toString()}`);
        return;
      }

      const user = data.session.user;

      try {
        // 2) Vérifier s’il existe déjà une subscription "current"
        const { data: existingSub, error: subError } = await supabase
          .from("user_subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        if (subError) {
          console.error("Erreur lecture user_subscriptions:", subError);
        }

        // 3) Créer automatiquement le plan free si absent
        if (!existingSub) {
          const { data: pricingPlan, error: pricingError } = await supabase
            .from("pricing_plans")
            .select("id")
            .eq("code", plan)
            .maybeSingle();

          if (pricingError) {
            console.error("Erreur pricing_plans:", pricingError);
          }

          if (pricingPlan?.id) {
            const { error: insertError } = await supabase
              .from("user_subscriptions")
              .insert({
                user_id: user.id,
                pricing_plan_id: pricingPlan.id,
                current: true,
              });

            if (insertError) {
              console.error(
                "Erreur insert user_subscriptions:",
                insertError
              );
            }
          }
        }
      } catch (err) {
        console.error("Erreur finalizeAuth:", err);
      }

      // 4) ✅ Redirection FINALE vers la création de l’IA
      const params = new URLSearchParams();
      params.set("lang", lang);
      params.set("plan", plan);

      router.replace(`/create-amoria?${params.toString()}`);
    };

    void finalizeAuth();
  }, [router, lang, plan]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {LOADING_TEXT[lang]}
    </div>
  );
}
