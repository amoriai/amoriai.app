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

function normalizePlan(raw: string | null): PlanId {
  if (raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited") return raw;
  return "free";
}

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lang = normalizeLocale(searchParams.get("lang"));
  const plan = normalizePlan(searchParams.get("plan"));

  useEffect(() => {
    let cancelled = false;

    const goLogin = () => {
      const params = new URLSearchParams();
      params.set("lang", lang);
      router.replace(`/login?${params.toString()}`);
    };

    const goCreate = () => {
      const params = new URLSearchParams();
      params.set("lang", lang);
      params.set("plan", plan);
      router.replace(`/create-amoria?${params.toString()}`);
    };

    const goSubscription = () => {
      const params = new URLSearchParams();
      params.set("lang", lang);
      params.set("plan", plan);
      router.replace(`/subscription?${params.toString()}`);
    };

    const finalizeAuth = async () => {
      try {
        const code = searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Erreur exchangeCodeForSession:", error);
            if (!cancelled) goLogin();
            return;
          }
        }

        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        const user = sessionData.session?.user;

        if (sessionErr || !user) {
          console.error("Aucune session après callback:", sessionErr);
          if (!cancelled) goLogin();
          return;
        }

        if (plan !== "free") {
          if (!cancelled) goSubscription();
          return;
        }

        const { data: currentSub, error: subErr } = await supabase
          .from("user_subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        if (subErr) console.error("Erreur lecture user_subscriptions:", subErr);

        if (!currentSub?.id) {
          const { data: freePlan, error: planErr } = await supabase
            .from("pricing_plans")
            .select("id")
            .eq("code", "free")
            .maybeSingle();

          if (planErr) console.error("Erreur lecture pricing_plans:", planErr);

          if (freePlan?.id) {
            const { error: insertErr } = await supabase.from("user_subscriptions").insert({
              user_id: user.id,
              pricing_plan_id: freePlan.id,
              current: true,
              stripe_customer_id: null,
              subscription_id: null,
            });

            if (insertErr) console.error("Erreur insert user_subscriptions:", insertErr);
          }
        }

        if (!cancelled) goCreate();
      } catch (err) {
        console.error("Erreur finalizeAuth:", err);
        if (!cancelled) goLogin();
      }
    };

    void finalizeAuth();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams, lang, plan]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {LOADING_TEXT[lang]}
    </div>
  );
}
