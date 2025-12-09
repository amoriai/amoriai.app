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
  // par défaut on reste sur "free" si rien n'est passé
  const plan: PlanId = (searchParams.get("plan") as PlanId) || "free";

  useEffect(() => {
    const finalizeAuth = async () => {
      // 0) Supabase renvoie un ?code=... dans l’URL → on doit l’échanger
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("Erreur exchangeCodeForSession:", exchangeError);
          // si on n’arrive pas à créer une session, on renvoie vers le login
          const p = new URLSearchParams();
          p.set("lang", lang);
          router.replace(`/login?${p.toString()}`);
          return;
        }
      }

      // 1) Maintenant on lit la session
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        const p = new URLSearchParams();
        p.set("lang", lang);
        router.replace(`/login?${p.toString()}`);
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

      // 4) Redirection finale vers la création d’AmorIAI
      const p = new URLSearchParams();
      p.set("lang", lang);
      p.set("plan", plan);
      router.replace(`/create-amoria?${p.toString()}`);
    };

    void finalizeAuth();
  }, [router, searchParams, lang, plan]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {LOADING_TEXT[lang]}
    </div>
  );
}
