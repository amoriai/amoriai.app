"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

const LOADING_TEXT: Record<Locale, string> = {
  fr: "Connexion en cours…",
  en: "Signing you in…",
  es: "Iniciando sesión…",
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

  // ✅ Capture une fois (évite que useSearchParams retrigger l'effet)
  const { lang, plan, code } = useMemo(() => {
    const lang = normalizeLocale(searchParams.get("lang"));
    const plan = normalizePlan(searchParams.get("plan"));
    const code = searchParams.get("code");
    return { lang, plan, code };
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const nav = (path: string, extra?: Record<string, string>) => {
      const params = new URLSearchParams();
      params.set("lang", lang);
      if (extra) Object.entries(extra).forEach(([k, v]) => params.set(k, v));
      router.replace(`${path}?${params.toString()}`);
    };

    const goLogin = () => nav("/login");
    const goCreate = () => nav("/create-amoria", { plan });
    const goSubscription = () => nav("/subscription", { plan });

    const finalizeAuth = async () => {
      try {
        // 1) Exchange code -> session (si présent)
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("exchangeCodeForSession error:", error);
            if (!cancelled) goLogin();
            return;
          }
        }

        // 2) Vérifie user
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        const user = userData?.user;

        if (userErr || !user) {
          console.error("No user after callback:", userErr);
          if (!cancelled) goLogin();
          return;
        }

        // 3) Si l’utilisateur revenait d’un plan payant → subscription
        if (plan !== "free") {
          if (!cancelled) goSubscription();
          return;
        }

        // 4) S’assure que FREE existe dans user_subscriptions
        const { data: currentSub, error: subErr } = await supabase
          .from("user_subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        if (subErr) console.error("user_subscriptions read error:", subErr);

        if (!currentSub?.id) {
          const { data: freePlan, error: planErr } = await supabase
            .from("pricing_plans")
            .select("id")
            .eq("code", "free")
            .maybeSingle();

          if (planErr) console.error("pricing_plans read error:", planErr);

          if (freePlan?.id) {
            const { error: insertErr } = await supabase.from("user_subscriptions").insert({
              user_id: user.id,
              pricing_plan_id: freePlan.id,
              current: true,
              stripe_customer_id: null,
              subscription_id: null,
            });

            if (insertErr) console.error("user_subscriptions insert error:", insertErr);
          }
        }

        // 5) Continue
        if (!cancelled) goCreate();
      } catch (err) {
        console.error("finalizeAuth error:", err);
        if (!cancelled) goLogin();
      }
    };

    void finalizeAuth();

    return () => {
      cancelled = true;
    };
  }, [router, lang, plan, code]);

  return (
    <main className="shell" aria-busy="true" aria-live="polite">
      <div className="loader">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <p className="text">{LOADING_TEXT[lang]}</p>

      <style jsx>{`
        .shell {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px 16px;
          color: rgba(226, 232, 240, 0.92);
          background: radial-gradient(1200px 800px at 50% -10%, rgba(251, 55, 255, 0.25), transparent 60%),
            radial-gradient(900px 700px at 90% 10%, rgba(56, 189, 248, 0.22), transparent 55%),
            radial-gradient(1000px 900px at 10% 25%, rgba(249, 115, 22, 0.14), transparent 60%),
            linear-gradient(180deg, #020617, #000);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji",
            "Segoe UI Emoji";
        }
        .loader {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          padding: 14px 18px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(2, 6, 23, 0.55);
          box-shadow: 0 16px 60px rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(226, 232, 240, 0.85);
          animation: dot 900ms ease-in-out infinite;
        }
        .dot:nth-child(2) {
          animation-delay: 120ms;
        }
        .dot:nth-child(3) {
          animation-delay: 240ms;
        }
        .text {
          margin-top: 14px;
          font-size: 0.9rem;
          color: rgba(148, 163, 184, 0.9);
          text-align: center;
        }
        @keyframes dot {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.45;
          }
          50% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
