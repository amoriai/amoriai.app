"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function getLocale(sp: URLSearchParams | null): Locale {
  const raw = sp?.get("lang");
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function getSelectedPlan(sp: URLSearchParams | null): PlanId {
  const raw = sp?.get("plan");
  if (raw === "chat" || raw === "plus" || raw === "unlimited") return raw;
  return "free";
}

const PLAN_LABELS: Record<
  Locale,
  Record<
    PlanId,
    { title: string; description: string; priceLabel: string }
  >
> = {
  fr: {
    free: {
      title: "Découverte (gratuit)",
      description:
        "Tu ne devrais normalement pas arriver ici pour le plan gratuit.",
      priceLabel: "0 $ / mois",
    },
    chat: {
      title: "AmorIA Chat",
      description:
        "Forfait texte uniquement, sans voix. Paiement mensuel, résiliable en tout temps.",
      priceLabel: "9,99 $ / mois",
    },
    plus: {
      title: "AmorIA Plus",
      description:
        "Plus de messages et fonctionnalités avancées. Paiement mensuel, résiliable en tout temps.",
      priceLabel: "19,99 $ / mois",
    },
    unlimited: {
      title: "AmorIA Illimité",
      description:
        "Ton compagnon IA ultra présent au quotidien. Accès maximal au chat et à la voix.",
      priceLabel: "39,99 $ / mois",
    },
  },
  en: {
    free: {
      title: "Discovery (free)",
      description: "You normally shouldn’t be here for the free plan.",
      priceLabel: "$0 / month",
    },
    chat: {
      title: "AmorIA Chat",
      description:
        "Text-only plan, no voice. Monthly billing, cancel anytime.",
      priceLabel: "$9.99 / month",
    },
    plus: {
      title: "AmorIA Plus",
      description:
        "More messages and advanced features. Monthly billing, cancel anytime.",
      priceLabel: "$19.99 / month",
    },
    unlimited: {
      title: "AmorIA Unlimited",
      description:
        "Your AI companion very present every day. Maximum access to chat and voice.",
      priceLabel: "$39.99 / month",
    },
  },
  es: {
    free: {
      title: "Descubrimiento (gratis)",
      description:
        "Normalmente no deberías llegar aquí para el plan gratuito.",
      priceLabel: "0 $ / mes",
    },
    chat: {
      title: "AmorIA Chat",
      description:
        "Plan solo texto, sin voz. Pago mensual, cancela cuando quieras.",
      priceLabel: "9,99 $ / mes",
    },
    plus: {
      title: "AmorIA Plus",
      description:
        "Más mensajes y funciones avanzadas. Pago mensual, cancela cuando quieras.",
      priceLabel: "19,99 $ / mes",
    },
    unlimited: {
      title: "AmorIA Ilimitado",
      description:
        "Tu compañero IA muy presente cada día. Acceso máximo al chat y a la voz.",
      priceLabel: "39,99 $ / mes",
    },
  },
};

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    payButton: string;
    paying: string;
    errorGeneric: string;
  }
> = {
  fr: {
    title: "Paiement sécurisé",
    subtitle:
      "Tu vas être redirigé·e vers Stripe pour finaliser ton abonnement AmorIA.",
    payButton: "Passer au paiement sécurisé",
    paying: "Redirection vers Stripe…",
    errorGeneric:
      "Une erreur est survenue pendant la création du paiement.",
  },
  en: {
    title: "Secure payment",
    subtitle:
      "You will be redirected to Stripe to complete your AmorIA subscription.",
    payButton: "Go to secure payment",
    paying: "Redirecting to Stripe…",
    errorGeneric:
      "An error occurred while creating the payment session.",
  },
  es: {
    title: "Pago seguro",
    subtitle:
      "Vas a ser redirigido a Stripe para finalizar tu suscripción AmorIA.",
    payButton: "Ir al pago seguro",
    paying: "Redirigiendo a Stripe…",
    errorGeneric:
      "Se ha producido un error al crear la sesión de pago.",
  },
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const locale = getLocale(searchParams ?? null);
  const plan = getSelectedPlan(searchParams ?? null);

  const t = STRINGS[locale];
  const planInfo = PLAN_LABELS[locale][plan];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (plan === "free") {
      // Normalement on ne paie pas pour le plan gratuit
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan }),
      });

      if (!res.ok) {
        throw new Error("Bad response from /api/checkout");
      }

      const data = await res.json();

      if (!data?.url) {
        throw new Error("Missing Stripe URL in response");
      }

      // On envoie vers Stripe
      window.location.href = data.url as string;
    } catch (err: any) {
      console.error(err);
      setError(t.errorGeneric);
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
            {planInfo.title} • {planInfo.priceLabel}
          </div>

          <p className="amoria-auth-subtitle">
            {planInfo.description}
          </p>

          {error && (
            <p className="amoria-auth-error" style={{ marginTop: "0.8rem" }}>
              {error}
            </p>
          )}

          {plan === "free" ? (
            <p className="amoria-auth-subtitle" style={{ marginTop: "1rem" }}>
              Ce plan est gratuit : normalement, les utilisateurs y arrivent
              directement depuis la création de compte sans passer par Stripe.
            </p>
          ) : (
            <button
              type="button"
              className="amoria-auth-submit"
              disabled={loading}
              onClick={handleCheckout}
            >
              {loading ? t.paying : t.payButton}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
