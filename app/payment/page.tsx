"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

const PLAN_TITLES: Record<Locale, Record<PlanId, string>> = {
  fr: {
    free: "Découverte (gratuit)",
    chat: "AmorIA Chat",
    plus: "AmorIA Plus",
    unlimited: "AmorIA Illimité",
  },
  en: {
    free: "Discovery (free)",
    chat: "AmorIA Chat",
    plus: "AmorIA Plus",
    unlimited: "AmorIA Unlimited",
  },
  es: {
    free: "Descubrimiento (gratis)",
    chat: "AmorIA Chat",
    plus: "AmorIA Plus",
    unlimited: "AmorIA Ilimitado",
  },
};

const PLAN_PRICES: Record<Locale, Record<PlanId, string>> = {
  fr: {
    free: "0 $ / mois",
    chat: "9,99 $ / mois",
    plus: "19,99 $ / mois",
    unlimited: "39,99 $ / mois",
  },
  en: {
    free: "$0 / month",
    chat: "$9.99 / month",
    plus: "$19.99 / month",
    unlimited: "$39.99 / month",
  },
  es: {
    free: "0 $ / mes",
    chat: "9,99 $ / mes",
    plus: "19,99 $ / mes",
    unlimited: "39,99 $ / mes",
  },
};

const COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    payButton: string;
    loading: string;
    backToPricing: string;
    errorGeneric: string;
    included: string;
    selectedPlanLabel: string;
  }
> = {
  fr: {
    title: "Finaliser mon abonnement",
    subtitle:
      "Ton compte AmorIA est créé. Il ne reste plus qu’à confirmer ton paiement pour activer ton abonnement.",
    payButton: "Confirmer et payer avec Stripe",
    loading: "Redirection vers Stripe…",
    backToPricing: "Retour aux tarifs",
    errorGeneric:
      "Une erreur est survenue pendant la création de la session de paiement. Réessaie dans quelques instants.",
    included: "Ce qui est inclus dans ce forfait :",
    selectedPlanLabel: "Forfait sélectionné",
  },
  en: {
    title: "Complete your subscription",
    subtitle:
      "Your AmorIA account is created. Confirm your payment to activate your subscription.",
    payButton: "Confirm and pay with Stripe",
    loading: "Redirecting to Stripe…",
    backToPricing: "Back to pricing",
    errorGeneric:
      "Something went wrong while creating the checkout session. Please try again.",
    included: "What’s included in this plan:",
    selectedPlanLabel: "Selected plan",
  },
  es: {
    title: "Finalizar mi suscripción",
    subtitle:
      "Tu cuenta AmorIA está creada. Solo falta confirmar el pago para activar tu suscripción.",
    payButton: "Confirmar y pagar con Stripe",
    loading: "Redirigiendo a Stripe…",
    backToPricing: "Volver a los planes",
    errorGeneric:
      "Se produjo un error al crear la sesión de pago. Inténtalo de nuevo.",
    included: "Lo que incluye este plan:",
    selectedPlanLabel: "Plan seleccionado",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (raw === "chat" || raw === "plus" || raw === "unlimited" || raw === "free") {
    return raw;
  }
  return "free";
}

export default function PaymentPage() {
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("fr");
  const [plan, setPlan] = useState<PlanId>("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On lit les query params côté client (plus de useSearchParams → plus d’erreur de prerender)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawPlan = params.get("plan");
    const rawLang = params.get("lang");
    const loc = normalizeLocale(rawLang);
    const pl = normalizePlan(rawPlan);

    setLocale(loc);
    setPlan(pl);

    // Plan gratuit → on ne passe PAS par Stripe, on envoie direct vers la création d’AmorIA
    if (pl === "free") {
      const qp = new URLSearchParams();
      qp.set("plan", pl);
      qp.set("lang", loc);
      router.replace(`/create-amoria?${qp.toString()}`);
    }
  }, [router]);

  const t = COPY[locale];
  const planTitle = PLAN_TITLES[locale][plan];
  const planPrice = PLAN_PRICES[locale][plan];

  const handleCheckout = async () => {
    if (plan === "free") return; // sécurité

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        throw new Error(t.errorGeneric);
      }

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(t.errorGeneric);
      }
    } catch (err: any) {
      setError(err?.message || t.errorGeneric);
      setLoading(false);
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/pricing?${params.toString()}`);
  };

  // Si on est en train de rediriger le gratuit, on peut afficher un petit écran neutre
  if (plan === "free") {
    return (
      <main className="amoria-root amoria-payment-root">
        <div className="amoria-payment-wrapper">
          <div className="amoria-payment-card">
            <p style={{ color: "#e5e7eb", fontSize: "0.9rem" }}>
              Redirection vers la création de ton AmorIA…
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="amoria-root amoria-payment-root">
      <div className="amoria-payment-wrapper">
        <div className="amoria-payment-card">
          <header className="amoria-payment-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmorIA logo"
              className="amoria-payment-logo"
            />
            <div>
              <h1 className="amoria-payment-title">{t.title}</h1>
              <p className="amoria-payment-subtitle">{t.subtitle}</p>
            </div>
          </header>

          <section className="amoria-payment-plan">
            <p className="amoria-payment-plan-label">{t.selectedPlanLabel}</p>
            <h2 className="amoria-payment-plan-title">{planTitle}</h2>
            <p className="amoria-payment-plan-price">{planPrice}</p>
          </section>

          <section className="amoria-payment-included">
            <p className="amoria-payment-included-label">{t.included}</p>
            <ul>
              <li>Accès 24/7 à AmorIA</li>
              <li>Volume de messages adapté à un usage quotidien (fair use)</li>
              <li>Historique de conversation sauvegardé</li>
              <li>Support par courriel en cas de question technique</li>
            </ul>
          </section>

          {error && <p className="amoria-payment-error">{error}</p>}

          <div className="amoria-payment-actions">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="amoria-payment-primary"
            >
              {loading ? t.loading : t.payButton}
            </button>
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="amoria-payment-secondary"
            >
              {t.backToPricing}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
