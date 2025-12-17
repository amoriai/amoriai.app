"use client";

import { useEffect, useMemo, useRef } from "react";
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

function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/")) return null; // seulement interne
  if (raw.startsWith("//")) return null; // évite protocole-like
  return raw;
}

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ anti double-run (important en dev / StrictMode)
  const didRunRef = useRef(false);

  const { lang, plan, code, returnTo } = useMemo(() => {
    return {
      lang: normalizeLocale(searchParams.get("lang")),
      plan: normalizePlan(searchParams.get("plan")),
      code: searchParams.get("code"),
      returnTo: safeReturnTo(searchParams.get("returnTo")),
    };
  }, [searchParams]);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    let cancelled = false;

    const goLogin = () => {
      const p = new URLSearchParams();
      p.set("lang", lang);
      router.replace(`/login?${p.toString()}`);
    };

    const goCreate = () => {
      const p = new URLSearchParams();
      p.set("lang", lang);
      p.set("plan", plan);
      router.replace(`/create-amoria?${p.toString()}`);
    };

    const goSubscription = () => {
      const p = new URLSearchParams();
      p.set("lang", lang);
      p.set("plan", plan);
      router.replace(`/subscription?${p.toString()}`);
    };

    const goChat = (iaId: string) => {
      const p = new URLSearchParams();
      p.set("lang", lang);
      p.set("iaId", iaId);
      router.replace(`/chat?${p.toString()}`);
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
        // 1) échange le code => session (si présent)
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

        // 3) priorité returnTo (si tu l’utilises depuis login)
        if (returnTo) {
          if (!cancelled) router.replace(returnTo);
          return;
        }

        // 4) si plan payant -> subscription
        if (plan !== "free") {
          if (!cancelled) goSubscription();
          return;
        }

        // 5) s’assurer qu’un sub free current existe
        await ensureFreeSubscription(user.id);

        // 6) direct chat si IA existe sinon create
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
    <main className="cb">
      <div className="cbCard">
        <div className="cbLoader" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <p className="cbText">{LOADING_TEXT[lang]}</p>
        <p className="cbSub">
          {lang === "en"
            ? "Please wait a moment."
            : lang === "es"
            ? "Espera un momento."
            : "Une seconde…"}
        </p>
      </div>

      <style jsx>{`
        .cb {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px 16px;
          color: rgba(226, 232, 240, 0.92);
          background: radial-gradient(1100px 700px at 50% -10%, rgba(251, 55, 255, 0.22), transparent 60%),
            radial-gradient(900px 700px at 90% 10%, rgba(56, 189, 248, 0.16), transparent 55%),
            radial-gradient(950px 700px at 10% 25%, rgba(249, 115, 22, 0.12), transparent 60%),
            linear-gradient(180deg, #020617, #000);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji",
            "Segoe UI Emoji";
        }

        .cbCard {
          width: min(520px, 92vw);
          border-radius: 24px;
          padding: 20px 18px 18px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(2, 6, 23, 0.55);
          box-shadow: 0 26px 90px rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          display: grid;
          gap: 10px;
          justify-items: center;
          text-align: center;
        }

        .cbLoader {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          padding: 14px 18px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(2, 6, 23, 0.55);
          box-shadow: 0 16px 60px rgba(15, 23, 42, 0.9);
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(226, 232, 240, 0.85);
          animation: cbDot 900ms ease-in-out infinite;
        }
        .dot:nth-child(2) {
          animation-delay: 120ms;
        }
        .dot:nth-child(3) {
          animation-delay: 240ms;
        }

        .cbText {
          margin: 0;
          font-size: 0.98rem;
          font-weight: 650;
          letter-spacing: 0.02em;
        }

        .cbSub {
          margin: 0;
          font-size: 0.86rem;
          color: rgba(148, 163, 184, 0.9);
        }

        @keyframes cbDot {
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
