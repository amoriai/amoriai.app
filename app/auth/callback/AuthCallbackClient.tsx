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
      const plan: PlanId = "free"; ✅

      // ✅ On vérifie que la session est bien créée
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        const params = new URLSearchParams();
        params.set("lang", lang);
        router.replace(`/signup?${params.toString()}`);
        return;
      }

      const user = data.session.user;

      try {
        const { data: existingSub } = await supabase
          .from("user_subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        if (!existingSub) {
          const { data: pricingPlan } = await supabase
            .from("pricing_plans")
            .select("id")
            .eq("code", plan)
            .maybeSingle();

          if (pricingPlan?.id) {
            await supabase.from("user_subscriptions").insert({
              user_id: user.id,
              pricing_plan_id: pricingPlan.id,
              current: true,
            });
          }
        }
      } catch (err) {
        console.error("Erreur finalizeAuth:", err);
      }

      // ✅✅✅ REDIRECTION FINALE CORRECTE
      const params = new URLSearchParams();
      params.set("lang", lang);
      params.set("plan", plan);

      ✅ router.replace(`/create-amoria?${params.toString()}`);
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
