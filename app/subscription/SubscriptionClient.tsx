"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanCode = "free" | "chat" | "plus" | "unlimited";

type PricingPlan = {
  id: string;
  code: PlanCode;
  name: string;
  price: number | null; // 0, 9.99, 19.99...
  ai_limit: number | null;
  message_limit: number | null;
  stripe_price_id: string | null;
  has_voice: boolean | null;
  voice_limit: number | null;
};

function isLocale(v: string | null): v is Locale {
  return v === "fr" || v === "en" || v === "es";
}
function isPlanCode(v: unknown): v is PlanCode {
  return v === "free" || v === "chat" || v === "plus" || v === "unlimited";
}

function detectLocaleFromUrl(params: URLSearchParams): Locale {
  const lang = (params.get("lang") || "").toLowerCase();
  if (lang === "fr" || lang === "en" || lang === "es") return lang;
  return "fr";
}

function formatUsd(locale: Locale, amount: number): string {
  const localeTag = locale === "fr" ? "fr-CA" : locale === "es" ? "es-ES" : "en-US";
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function suffix(locale: Locale): string {
  if (locale === "fr") return " / mois";
  if (locale === "es") return " / mes";
  return " / month";
}

function copyFor(locale: Locale) {
  const isEn = locale === "en";
  const isEs = locale === "es";

  return {
    title: isEn ? "Choose your AmorIAI plan" : isEs ? "Elige tu plan AmorIAI" : "Choisis ton forfait AmorIAI",

    subtitle: isEn
      ? "Same core AI on every plan. You pay for message volume, number of AmorIAI, and voice."
      : isEs
      ? "La misma IA base en todos los planes. Pagas por mensajes, número de AmorIAI y voz."
      : "Tous les forfaits utilisent la même IA de base. Tu payes en fonction de la quantité de messages, du nombre d’AmorIAI personnalisés et de la voix.",

    loading: isEn ? "Loading plans…" : isEs ? "Cargando planes…" : "Chargement des forfaits…",

    loadError: isEn
      ? "Unable to load plans. Please try again later."
      : isEs
      ? "No se pueden cargar los planes. Inténtalo más tarde."
      : "Impossible de charger les forfaits. Réessaie plus tard.",

    checkoutError: isEn
      ? "Could not create the payment session."
      : isEs
      ? "Error al crear la sesión de pago."
      : "Erreur lors de la création de la session de paiement.",

    unexpected: isEn
      ? "Unexpected payment API response."
      : isEs
      ? "Respuesta inesperada de la API de pago."
      : "Réponse inattendue de l’API de paiement.",

    generic: isEn ? "Something went wrong. Please try again."
      : isEs ? "Ocurrió un error. Inténtalo de nuevo."
      : "Une erreur est survenue. Réessaie plus tard.",

    billed: isEn ? "Billed monthly, cancel anytime."
      : isEs ? "Facturación mensual, cancela cuando quieras."
      : "Facturé mensuellement, résiliable en tout temps.",

    freeLabel: isEn ? "Free" : isEs ? "Gratis" : "Gratuit",
    freeBtn: isEn ? "Start for free" : isEs ? "Empezar gratis" : "Commencer gratuitement",
    chooseBtn: isEn ? "Choose this plan" : isEs ? "Elegir este plan" : "Choisir ce forfait",
    stripeBtn: isEn ? "Redirecting to Stripe…" : isEs ? "Redirigiendo a Stripe…" : "Redirection vers Stripe…",

    upToAi: (n: number) =>
      isEn ? `Up to ${n} AmorIAI` : isEs ? `Hasta ${n} AmorIAI` : `Jusqu’à ${n} AmorIA personnalisés`,

    oneAi: isEn ? "1 AmorIAI" : isEs ? "1 AmorIAI" : "1 AmorIA personnalisé",

    msgUnlimited: isEn ? "Text messages: unlimited (fair use)" : isEs ? "Mensajes de texto: ilimitados (uso razonable)" : "Messages texte illimités (usage équitable)",
    msgPerMonth: (n: number) =>
      isEn ? `${n} text messages / month` : isEs ? `${n} mensajes / mes` : `${n} messages texte / mois`,
    msgNotSet: isEn ? "Text messages (limit not set)" : isEs ? "Mensajes de texto (límite no definido)" : "Messages texte (limite non définie)",

    voiceNone: isEn ? "No voice on this plan" : isEs ? "Sin voz en este plan" : "Pas de voix dans ce forfait",
    voiceFair: isEn ? "Voice included (fair use)" : isEs ? "Voz incluida (uso razonable)" : "Conversations vocales incluses (usage équitable)",
    voiceLimited: (n: number) =>
      isEn ? `Voice replies included (~${n} / month)` : isEs ? `Voz incluida (~${n} / mes)` : `Conversations vocales limitées (~${n} échanges / mois)`,
  };
}

export default function SubscriptionPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // locale depuis URL
  const locale = useMemo(() => detectLocaleFromUrl(new URLSearchParams(sp.toString())), [sp]);
  const copy = useMemo(() => copyFor(locale), [locale]);

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // Load plans from Supabase
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase
        .from("pricing_plans")
        .select("id,code,name,price,ai_limit,message_limit,stripe_price_id,has_voice,voice_limit")
        .order("price", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("pricing_plans load error:", error);
        setError(copy.loadError);
        setPlans([]);
        setLoading(false);
        return;
      }

      const cleaned: PricingPlan[] = Array.isArray(data)
        ? (data as any[])
            .filter(Boolean)
            .filter((p) => p && typeof p.id === "string" && isPlanCode(p.code))
            .map((p) => ({
              id: String(p.id),
              code: p.code as PlanCode,
              name: typeof p.name === "string" && p.name.trim() ? p.name : String(p.code),
              price: typeof p.price === "number" ? p.price : p.price == null ? null : Number(p.price),
              ai_limit: typeof p.ai_limit === "number" ? p.ai_limit : p.ai_limit == null ? null : Number(p.ai_limit),
              message_limit:
                typeof p.message_limit === "number"
                  ? p.message_limit
                  : p.message_limit == null
                  ? null
                  : Number(p.message_limit),
              stripe_price_id: typeof p.stripe_price_id === "string" ? p.stripe_price_id : null,
              has_voice: typeof p.has_voice === "boolean" ? p.has_voice : !!p.has_voice,
              voice_limit:
                typeof p.voice_limit === "number" ? p.voice_limit : p.voice_limit == null ? null : Number(p.voice_limit),
            }))
        : [];

      // Bonus: ensure stable order (Free first, then by price)
      const orderRank = (c: PlanCode) => (c === "free" ? 0 : c === "chat" ? 1 : c === "plus" ? 2 : 3);
      cleaned.sort((a, b) => {
        const ra = orderRank(a.code);
        const rb = orderRank(b.code);
        if (ra !== rb) return ra - rb;
        const pa = a.price ?? 0;
        const pb = b.price ?? 0;
        return pa - pb;
      });

      setPlans(cleaned);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [copy.loadError]);

  const goto = (path: string, params?: Record<string, string>) => {
    const qs = new URLSearchParams();
    qs.set("lang", locale);
    if (params) {
      for (const [k, v] of Object.entries(params)) qs.set(k, v);
    }
    router.push(`${path}?${qs.toString()}`);
  };

  const handleSubscribe = async (plan: PricingPlan) => {
    const isFree = plan.code === "free" || plan.price === 0;

    setError(null);
    setLoadingPlanId(plan.id);

    try {
      // FREE -> direct create
      if (isFree) {
        goto("/create-amoria", { plan: "free" });
        return;
      }

      // must be logged in for paid checkout
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) console.error("getUser error:", userErr);

      if (!userData?.user) {
        // login, then come back
        goto("/login", { plan: plan.code, return: "subscription" });
        return;
      }

      // server uses cookies session; send { plan, lang }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.code, lang: locale }),
      });

      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

      if (!res.ok) {
        console.error("checkout error:", res.status, json);
        setError(typeof json?.error === "string" ? json.error : copy.checkoutError);
        return;
      }

      if (!json.url || typeof json.url !== "string") {
        console.error("checkout missing url:", json);
        setError(copy.unexpected);
        return;
      }

      window.location.href = json.url;
    } catch (e) {
      console.error("handleSubscribe error:", e);
      setError(copy.generic);
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <main style={{ padding: "3rem 1.5rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "1rem", textAlign: "center" }}>
        {copy.title}
      </h1>

      <p style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 2.5rem", opacity: 0.8 }}>
        {copy.subtitle}
      </p>

      {loading && <p style={{ textAlign: "center" }}>{copy.loading}</p>}

      {error && <p style={{ textAlign: "center", color: "#e11d48", marginBottom: "1rem" }}>{error}</p>}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {plans.map((plan) => {
            const isFree = plan.code === "free" || plan.price === 0;

            const priceLabel = isFree
              ? copy.freeLabel
              : `${formatUsd(locale, plan.price ?? 0)} USD${suffix(locale)}`;

            const voiceText = plan.has_voice
              ? plan.voice_limit && plan.voice_limit > 0
                ? copy.voiceLimited(plan.voice_limit)
                : copy.voiceFair
              : copy.voiceNone;

            const messagesText =
              plan.message_limit && plan.message_limit >= 10000
                ? copy.msgUnlimited
                : plan.message_limit
                ? copy.msgPerMonth(plan.message_limit)
                : copy.msgNotSet;

            const aisText =
              plan.ai_limit && plan.ai_limit > 0 ? copy.upToAi(plan.ai_limit) : copy.oneAi;

            const isBusy = loadingPlanId === plan.id;
            const btnLabel = isFree ? copy.freeBtn : isBusy ? copy.stripeBtn : copy.chooseBtn;

            return (
              <div
                key={plan.id}
                style={{
                  borderRadius: "18px",
                  padding: "1.75rem 1.5rem",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.45)",
                  background:
                    "radial-gradient(circle at top left, rgba(236,72,153,0.13), transparent 55%), radial-gradient(circle at bottom right, rgba(59,130,246,0.16), #020617)",
                  color: "white",
                  backdropFilter: "blur(20px)",
                }}
              >
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.6rem" }}>
                  {plan.name}
                </h2>

                <p style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  {priceLabel}
                </p>

                {!isFree && (
                  <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1rem" }}>
                    {copy.billed}
                  </p>
                )}

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", fontSize: "0.95rem" }}>
                  <li style={{ marginBottom: "0.4rem" }}>• {aisText}</li>
                  <li style={{ marginBottom: "0.4rem" }}>• {messagesText}</li>
                  <li style={{ marginBottom: "0.4rem" }}>• {voiceText}</li>
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isBusy}
                  style={{
                    width: "100%",
                    borderRadius: "999px",
                    border: "none",
                    padding: "0.75rem 1rem",
                    fontWeight: 600,
                    cursor: isBusy ? "default" : "pointer",
                    fontSize: "0.95rem",
                    background: isFree
                      ? "rgba(148, 163, 184, 0.2)"
                      : "linear-gradient(90deg, #ec4899, #6366f1)",
                    color: "white",
                    opacity: isBusy ? 0.7 : 1,
                  }}
                >
                  {btnLabel}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
