"use client";

import { useEffect, useMemo } from "react";
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

function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  // ✅ sécurité: seulement des chemins internes
  if (!raw.startsWith("/")) return null;
  // évite quelques cas bizarres
  if (raw.startsWith("//")) return null;
  return raw;
}

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { lang, plan, code, returnTo } = useMemo(() => {
    const lang = normalizeLocale(searchParams.get("lang"));
    const plan = normalizePlan(searchParams.get("plan"));
    const code = searchParams.get("code");
    const returnTo = safeReturnTo(searchParams.get("returnTo"));
    return { lang, plan, code, returnTo };
  }, [searchParams]);

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

    const goChat = (iaId: string) => {
      const params = new URLSearchParams();
      params.set("lang", lang);
      params.set("iaId", iaId);
      router.replace(`/chat?${params.toString()}`);
    };

    const ensureFreeSubscription = async (userId: string) => {
      const { data: currentSub, error: subErr } = await supabase
        .from("user_subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("current", true)
        .maybeSingle();

      if (subErr) console.error("Erreur lecture user_subscriptions:", subErr);
      if (currentSub?.id) return;

      const { data: freePlan, error: planErr } = await supabase
        .from("pricing_plans")
        .select("id")
        .eq("code", "free")
        .maybeSingle();

      if (planErr) console.error("Erreur lecture pricing_plans:", planErr);

      if (freePlan?.id) {
        const { error: insertErr } = await supabase.from("user_subscriptions").insert({
          user_id: userId,
          pricing_plan_id: freePlan.id,
          current: true,
          stripe_customer_id: null,
          subscription_id: null,
        });

        if (insertErr) console.error("Erreur insert user_subscriptions:", insertErr);
      }
    };

    const fetchLatestAmoriaId = async (userId: string): Promise<string | null> => {
      const { data, error } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .eq("is_archived", false)
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) console.error("Erreur lecture user_amoria:", error);
      return data?.id ?? null;
    };

    const finalizeAuth = async () => {
      try {
        // 1) échange le code => session
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Erreur exchangeCodeForSession:", error);
            if (!cancelled) goLogin();
            return;
          }
        }

        // 2) vérifie session
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        const user = sessionData.session?.user;

        if (sessionErr || !user) {
          console.error("Aucune session après callback:", sessionErr);
          if (!cancelled) goLogin();
          return;
        }

        // ✅ 3) priorité à returnTo (pour éliminer les écrans noirs / détours)
        if (returnTo) {
          if (!cancelled) router.replace(returnTo);
          return;
        }

        // 4) si l’utilisateur venait d’un plan payant -> page subscription
        if (plan !== "free") {
          if (!cancelled) goSubscription();
          return;
        }

        // 5) s’assurer qu’il a un sub free current (si rien)
        await ensureFreeSubscription(user.id);

        // 6) redirect “direct chat” si déjà un AmorIA, sinon create-amoria
        const lastIaId = await fetchLatestAmoriaId(user.id);
        if (!cancelled) {
          if (lastIaId) goChat(lastIaId);
          else goCreate();
        }
      } catch (err) {
        console.error("Erreur finalizeAuth:", err);
        if (!cancelled) goLogin();
      }
    };

    void finalizeAuth();

    return () => {
      cancelled = true;
    };
  }, [router, lang, plan, code, returnTo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {LOADING_TEXT[lang]}
    </div>
  );
}
