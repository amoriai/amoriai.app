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
    return { locale: "fr", plan: "free" };
  }

  const sp = new URLSearchParams(window.location.search);
  const lang = sp.get("lang");
  const rawPlan = sp.get("plan");

  const locale: Locale =
    lang === "en" || lang === "es" || lang === "fr" ? lang : "fr";

  const plan: PlanId =
    rawPlan === "chat" || rawPlan === "plus" || rawPlan === "unlimited"
      ? rawPlan
      : "free";

  return { locale, plan };
}

const COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    planFree: string;
    planChat: string;
    planPlus: string;
    planUnlimited: string;
    cta: string;
  }
> = {
  fr: {
    title: "Crée ton premier AmorIA",
    subtitle:
      "Ton compte est créé. Il ne reste qu’à personnaliser ton compagnon IA.",
    planFree: "Forfait Découverte (gratuit)",
    planChat: "Forfait AmorIA Chat",
    planPlus: "Forfait AmorIA Plus",
    planUnlimited: "Forfait AmorIA Illimité",
    cta: "Commencer la création",
  },
  en: {
    title: "Create your first AmorIA",
    subtitle:
      "Your account is ready. Now you can personalize your AI companion.",
    planFree: "Discovery plan (free)",
    planChat: "AmorIA Chat plan",
    planPlus: "AmorIA Plus plan",
    planUnlimited: "AmorIA Unlimited plan",
    cta: "Start creating",
  },
  es: {
    title: "Crea tu primer AmorIA",
    subtitle:
      "Tu cuenta está lista. Ahora puedes personalizar tu compañero IA.",
    planFree: "Plan Descubrimiento (gratis)",
    planChat: "Plan AmorIA Chat",
    planPlus: "Plan AmorIA Plus",
    planUnlimited: "Plan AmorIA Ilimitado",
    cta: "Empezar la creación",
  },
};

export default function CreateAmoriaPage() {
  const [state, setState] = useState<PageState | null>(null);

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
    plan === "free"
      ? t.planFree
      : plan === "chat"
      ? t.planChat
      : plan === "plus"
      ? t.planPlus
      : t.planUnlimited;

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

          <p style={{ fontSize: "0.9rem", color: "#e5e7eb", marginTop: "0.5rem" }}>
            (Ici tu pourras plus tard choisir l’avatar, la voix, la
            personnalité, etc.)
          </p>

          <button
            type="button"
            className="amoria-auth-submit"
            style={{ marginTop: "1.2rem" }}
          >
            {t.cta}
          </button>
        </div>
      </div>
    </main>
  );
}
