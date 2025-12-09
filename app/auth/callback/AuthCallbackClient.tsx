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

  const lang = normalizeLocale(searchParams.get("lang"));
  const plan: PlanId = "free";

  useEffect(() => {
    const finalizeAuth = async () => {
      try {
        // 1) Récupérer les tokens dans l'URL (query OU hash)
        let access_token = searchParams.get("access_token");
        let refresh_token = searchParams.get("refresh_token");

        if (typeof window !== "undefined" && (!access_token || !refresh_token)) {
          const hash = window.location.hash; // ex: #access_token=...&refresh_token=...
          if (hash && hash.startsWith("#")) {
            const hashParams = new URLSearchParams(hash.slice(1));
            access_token = access_token || hashParams.get("access_token");
            refresh_token = refresh_token || hashParams.get("refresh_token");
          }
        }

        // 2) Si on a les deux tokens → créer la session Supabase
        if (access_token && refresh_token) {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (setSessionError) {
            console.error("Erreur setSession:", setSessionError);
          }
        }

        // 3) Récupérer le user
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Erreur getUser:", userError);
        }

        const user = userData?.user;

        // 4) Créer la subscription free si nécessaire
        if (user) {
          try {
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
            console.error("Erreur durant la création de la subscription:", err);
          }
        } else {
          console.warn("Pas de user après callback (confirmation email)");
        }

        // 5) Redirection finale vers la création de l’IA
        const params = new URLSearchParams();
        params.set("lang", lang);
        params.set("plan", plan);

        router.replace(`/create-amoria?${params.toString()}`);
      } catch (err) {
        console.error("Erreur finalizeAuth globale:", err);

        // En cas de gros problème, fallback sur login
        const fallbackParams = new URLSearchParams();
        fallbackParams.set("lang", lang);
        router.replace(`/login?${fallbackParams.toString()}`);
      }
    };

    void finalizeAuth();
  }, [router, searchParams, lang, plan]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {LOADING_TEXT[lang]}
    </div>
  );
}
