"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

type PlanCode = "free" | "chat" | "plus" | "unlimited";

type PricingPlan = {
  id: string;
  code: PlanCode; // ✅ important pour checkout/webhook
  name: string;
  price: number | null; // ✅ ex: 0, 9.99, 19.99, 39.99
  ai_limit: number | null;
  message_limit: number | null;
  stripe_price_id: string | null;
  has_voice: boolean | null;
  voice_limit: number | null;
};

function detectLocaleFromUrl(searchParams: URLSearchParams): Locale {
  const lang = (searchParams.get("lang") || "").toLowerCase();
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

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = useMemo(
    () => detectLocaleFromUrl(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // Charger les plans depuis Supabase
  useEffect(() => {
    let cancelled = false;

    const loadPlans = async () => {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase
        .from("pricing_plans")
        .select(
          "id,code,name,price,ai_limit,message_limit,stripe_price_id,has_voice,voice_limit"
        )
        .order("price", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error(error);
        setError("Impossible de charger les forfaits. Réessaie plus tard.");
        setPlans([]);
      } else {
        setPlans((data as PricingPlan[]) ?? []);
      }

      setLoading(false);
    };

    loadPlans();
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * ✅ Modif clé:
   * - on n’envoie PLUS user_id au serveur (pas fiable / modifiable)
   * - /api/checkout doit récupérer le user côté serveur (cookies/session)
   */
  const handleSubscribe = async (plan: PricingPlan) => {
    const isFree = plan.code === "free" || plan.price === 0;

    // Free => pas de Stripe
    if (isFree) {
      router.push(`/create-amoria?lang=${locale}&plan=free`);
      return;
    }

    try {
      setError(null);
      setLoadingPlanId(plan.id);

      // Si pas connecté → login (avec retour plan)
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push(`/login?lang=${locale}&plan=${plan.code}`);
        return;
      }

      // ✅ Appel checkout : on envoie seulement le code du plan
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.code,   // ✅ plan_code (server -> stripe price)
          lang: locale,      // optionnel, pratique pour success_url
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("checkout error:", body);
        setError("Erreur lors de la création de la session de paiement.");
        return;
      }

      const body = (await res.json()) as { url?: string };
      if (!body.url) {
        setError("Réponse inattendue de l’API de paiement.");
        return;
      }

      window.location.href = body.url;
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Réessaie plus tard.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  const title =
    locale === "en"
      ? "Choose your AmorIAI plan"
      : locale === "es"
      ? "Elige tu plan AmorIAI"
      : "Choisis ton forfait AmorIAI";

  const subtitle =
    locale === "en"
      ? "Same core AI on every plan. You pay for message volume, number of AmorIAI, and voice."
      : locale === "es"
      ? "La misma IA base en todos los planes. Pagas por mensajes, número de AmorIAI y voz."
      : "Tous les forfaits utilisent la même IA de base. Tu payes en fonction de la quantité de messages, du nombre d’AmorIAI personnalisés et de la voix.";

  const loadingText =
    locale === "en"
      ? "Loading plans…"
      : locale === "es"
      ? "Cargando planes…"
      : "Chargement des forfaits…";

  return (
    <main style={{ padding: "3rem 1.5rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          textAlign: "center",
          maxWidth: "640px",
          margin: "0 auto 2.5rem",
          opacity: 0.8,
        }}
      >
        {subtitle}
      </p>

      {loading && <p style={{ textAlign: "center" }}>{loadingText}</p>}

      {error && (
        <p style={{ textAlign: "center", color: "#e11d48", marginBottom: "1rem" }}>
          {error}
        </p>
      )}

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
              ? locale === "en"
                ? "Free"
                : locale === "es"
                ? "Gratis"
                : "Gratuit"
              : `${formatUsd(locale, plan.price ?? 0)} USD${suffix(locale)}`;

            const hasVoice = !!plan.has_voice;

            const voiceText = hasVoice
              ? plan.voice_limit && plan.voice_limit > 0
                ? locale === "en"
                  ? `Voice replies included (~${plan.voice_limit} / month)`
                  : locale === "es"
                  ? `Voz incluida (~${plan.voice_limit} / mes)`
                  : `Conversations vocales limitées (~${plan.voice_limit} échanges / mois)`
                : locale === "en"
                ? "Voice included (fair use)"
                : locale === "es"
                ? "Voz incluida (uso razonable)"
                : "Conversations vocales incluses (usage équitable)"
              : locale === "en"
              ? "No voice on this plan"
              : locale === "es"
              ? "Sin voz en este plan"
              : "Pas de voix dans ce forfait";

            const messagesText =
              plan.message_limit && plan.message_limit >= 10000
                ? locale === "en"
                  ? "Text messages: unlimited (fair use)"
                  : locale === "es"
                  ? "Mensajes de texto: ilimitados (uso razonable)"
                  : "Messages texte illimités (usage équitable)"
                : plan.message_limit
                ? locale === "en"
                  ? `${plan.message_limit} text messages / month`
                  : locale === "es"
                  ? `${plan.message_limit} mensajes / mes`
                  : `${plan.message_limit} messages texte / mois`
                : locale === "en"
                ? "Text messages (limit not set)"
                : locale === "es"
                ? "Mensajes de texto (límite no definido)"
                : "Messages texte (limite non définie)";

            const aisText =
              plan.ai_limit && plan.ai_limit > 0
                ? locale === "en"
                  ? `Up to ${plan.ai_limit} AmorIAI`
                  : locale === "es"
                  ? `Hasta ${plan.ai_limit} AmorIAI`
                  : `Jusqu’à ${plan.ai_limit} AmorIA personnalisés`
                : locale === "en"
                ? "1 AmorIAI"
                : locale === "es"
                ? "1 AmorIAI"
                : "1 AmorIA personnalisé";

            const btnLabel = isFree
              ? locale === "en"
                ? "Included with your account"
                : locale === "es"
                ? "Incluido con tu cuenta"
                : "Inclus avec ton compte"
              : loadingPlanId === plan.id
              ? locale === "en"
                ? "Redirecting to Stripe…"
                : locale === "es"
                ? "Redirigiendo a Stripe…"
                : "Redirection vers Stripe…"
              : locale === "en"
              ? "Choose this plan"
              : locale === "es"
              ? "Elegir este plan"
              : "Choisir ce forfait";

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
                    {locale === "en"
                      ? "Billed monthly, cancel anytime."
                      : locale === "es"
                      ? "Facturación mensual, cancela cuando quieras."
                      : "Facturé mensuellement, résiliable en tout temps."}
                  </p>
                )}

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", fontSize: "0.95rem" }}>
                  <li style={{ marginBottom: "0.4rem" }}>• {aisText}</li>
                  <li style={{ marginBottom: "0.4rem" }}>• {messagesText}</li>
                  <li style={{ marginBottom: "0.4rem" }}>• {voiceText}</li>
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlanId === plan.id || isFree}
                  style={{
                    width: "100%",
                    borderRadius: "999px",
                    border: "none",
                    padding: "0.75rem 1rem",
                    fontWeight: 600,
                    cursor: isFree ? "default" : "pointer",
                    fontSize: "0.95rem",
                    background: isFree
                      ? "rgba(148, 163, 184, 0.2)"
                      : "linear-gradient(90deg, #ec4899, #6366f1)",
                    color: "white",
                    opacity: loadingPlanId === plan.id ? 0.7 : 1,
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
