"use client";

import React, { useEffect, useState } from "react";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

type PageState = {
  locale: Locale;
  plan: PlanId;
};

function readQueryFromWindow(): PageState {
  if (typeof window === "undefined") {
    return { locale: "fr", plan: "chat" };
  }

  const sp = new URLSearchParams(window.location.search);
  const lang = sp.get("lang");
  const rawPlan = sp.get("plan");

  const locale: Locale =
    lang === "en" || lang === "es" || lang === "fr" ? lang : "fr";

  const plan: PlanId =
    rawPlan === "chat" || rawPlan === "plus" || rawPlan === "unlimited"
      ? rawPlan
      : "chat"; // ici on force un plan payant par défaut

  return { locale, plan };
}

const COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    chat: string;
    plus: string;
    unlimited: string;
    cta: string;
    error: string;
  }
> = {
  fr: {
    title: "Paiement sécurisé",
    subtitle:
      "Tu es à une étape de débloquer toutes les fonctionnalités d’AmorIA.",
    chat: "AmorIA Chat – 9,99 $ / mois",
    plus: "AmorIA Plus – 19,99 $ / mois",
    unlimited: "AmorIA Illimité – 39,99 $ / mois",
    cta: "Payer et activer mon forfait",
    error:
      "Une erreur est survenue pendant la création de la session de paiement.",
  },
  en: {
    title: "Secure payment",
    subtitle:
      "You’re one step away from unlocking all AmorIA features.",
    chat: "AmorIA Chat – $9.99 / month",
    plus: "AmorIA Plus – $19.99 / month",
    unlimited: "AmorIA Unlimited – $39.99 / month",
    cta: "Pay and activate my plan",
    error:
      "An error occurred while creating the checkout session.",
  },
  es: {
    title: "Pago seguro",
    subtitle:
      "Estás a un paso de desbloquear todas las funciones de AmorIA.",
    chat: "AmorIA Chat – 9,99 $ / mes",
    plus: "AmorIA Plus – 19,99 $ / mes",
    unlimited: "AmorIA Ilimitado – 39,99 $ / mes",
    cta: "Pagar y activar mi plan",
    error:
      "Se ha producido un error al crear la sesión de pago.",
  },
};

export default function PaymentPage() {
  const [state, setState] = useState<PageState | null>(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    setState(readQueryFromWindow());
  }, []);

  if (!state) {
    return (
      <main className="amoria-root amoria-auth-root">
        <p style={{ color: "#e5e7eb" }}>Chargement…</p>
      </main>
    );
  }

  const { locale, plan } = state;
  const t = COPY[locale];

  const planLabel =
    plan === "chat" ? t.chat : plan === "plus" ? t.plus : t.unlimited;

  const handlePay = async () => {
    setLoading(true);
    setErrMsg(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: plan, locale }),
      });

      if (!res.ok) {
        setErrMsg(t.error);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        setErrMsg(t.error);
        setLoading(false);
      }
    } catch (e) {
      setErrMsg(t.error);
      setLoading(false);
    }
  };

  return (
    <main className="amoria-root amoria-auth-root">
      <div className="amoria-auth-wrapper">
        <div className="amoria-auth-card">
          <div className="amoria-auth-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIA"
              className="amoria-auth-logo"
            />
            <div>
              <h1 className="amoria-auth-title">{t.title}</h1>
              <p className="amoria-auth-subtitle">{t.subtitle}</p>
            </div>
          </div>

          <div className="amoria-auth-plan-badge">
            {planLabel}
          </div>

          {errMsg && (
            <p className="amoria-auth-error" style={{ marginTop: "0.8rem" }}>
              {errMsg}
            </p>
          )}

          <button
            type="button"
            className="amoria-auth-submit"
            style={{ marginTop: "1.2rem" }}
            disabled={loading}
            onClick={handlePay}
          >
            {loading ? "…" : t.cta}
          </button>
        </div>
      </div>
    </main>
  );
}
