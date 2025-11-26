"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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
    labelSelected: string;
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
    labelSelected: "Forfait sélectionné",
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
    labelSelected: "Selected plan",
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
    labelSelected: "Plan seleccionado",
  },
};

/**
 * Liste des avantages par plan, traduite dans chaque langue.
 * (on ne parle plus de « messages illimités », mais d’un usage confortable / fair use)
 */
const PLAN_FEATURES: Record<Locale, Record<PlanId, string[]>> = {
  fr: {
    free: [
      "Accès par texte à AmorIA (mode découverte, volume limité)",
      "Accès à l’espace de conversation de base",
      "Possibilité de passer à un plan supérieur à tout moment",
    ],
    chat: [
      "Accès 24/7 à AmorIA par texte",
      "Volume de messages adapté à un usage quotidien (fair use)",
      "Historique de conversation sauvegardé",
      "Support par courriel en cas de question technique",
    ],
    plus: [
      "Tout ce qui est inclus dans AmorIA Chat",
      "Accès prioritaire aux réponses d’AmorIA (moins d’attente)",
      "Accès à des modules supplémentaires (coaching, journaling, etc.)",
      "Minutes d’appels vocaux IA chaque mois (fair use)",
    ],
    unlimited: [
      "Tout ce qui est inclus dans AmorIA Plus",
      "Usage intensif de messages et d’appels (fair use)",
      "Priorité maximale dans la file d’attente",
      "Accès anticipé aux nouvelles fonctionnalités et expériences",
    ],
  },
  en: {
    free: [
      "Text access to AmorIA (discovery mode, limited volume)",
      "Access to the basic chat space",
      "Upgrade to a higher plan anytime",
    ],
    chat: [
      "24/7 text access to AmorIA",
      "Message volume designed for everyday use (fair use)",
      "Conversation history saved",
      "Email support for technical questions",
    ],
    plus: [
      "Everything included in AmorIA Chat",
      "Priority responses from AmorIA (reduced waiting time)",
      "Access to extra modules (coaching, journaling, etc.)",
      "Monthly AI voice call minutes (fair use)",
    ],
    unlimited: [
      "Everything included in AmorIA Plus",
      "Intensive use of messages and calls (fair use)",
      "Highest priority in the queue",
      "Early access to new features and experiences",
    ],
  },
  es: {
    free: [
      "Acceso por texto a AmorIA (modo descubrimiento, volumen limitado)",
      "Acceso al espacio de conversación básico",
      "Posibilidad de pasar a un plan superior en cualquier momento",
    ],
    chat: [
      "Acceso 24/7 a AmorIA por texto",
      "Volumen de mensajes pensado para un uso diario (fair use)",
      "Historial de conversación guardado",
      "Soporte por correo electrónico para dudas técnicas",
    ],
    plus: [
      "Todo lo incluido en AmorIA Chat",
      "Respuestas prioritarias de AmorIA (menos espera)",
      "Acceso a módulos extra (coaching, journaling, etc.)",
      "Minutos de llamadas de voz con IA cada mes (fair use)",
    ],
    unlimited: [
      "Todo lo incluido en AmorIA Plus",
      "Uso intensivo de mensajes y llamadas (fair use)",
      "Prioridad máxima en la cola",
      "Acceso anticipado a nuevas funciones y experiencias",
    ],
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (raw === "chat" || raw === "plus" || raw === "unlimited" || raw === "free")
    return raw;
  return "chat";
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get("lang"));
  const plan = normalizePlan(searchParams.get("plan"));

  const t = COPY[locale];
  const planTitle = PLAN_TITLES[locale][plan];
  const planPrice = PLAN_PRICES[locale][plan];
  const features = PLAN_FEATURES[locale][plan];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si on arrive ici avec le plan gratuit, on redirige vers create-amoria
  if (typeof window !== "undefined" && plan === "free") {
    const params = new URLSearchParams();
    params.set("plan", plan);
    params.set("lang", locale);
    router.replace(`/create-amoria?${params.toString()}`);
    return null;
  }

  const handleCheckout = async () => {
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
            <p className="amoria-payment-plan-label">
              {t.labelSelected}
            </p>
            <h2 className="amoria-payment-plan-title">{planTitle}</h2>
            <p className="amoria-payment-plan-price">{planPrice}</p>
          </section>

          <section className="amoria-payment-included">
            <p className="amoria-payment-included-label">{t.included}</p>
            <ul>
              {features.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
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

      <style jsx global>{`
        .amoria-payment-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .amoria-payment-wrapper {
          max-width: 640px;
          width: 100%;
        }

        .amoria-payment-card {
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1.8rem 1.7rem 1.6rem;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.9);
        }

        .amoria-payment-header {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: 1.4rem;
        }

        .amoria-payment-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }

        .amoria-payment-title {
          font-size: 1.3rem;
          margin: 0 0 0.2rem;
        }

        .amoria-payment-subtitle {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amoria-payment-plan {
          border-radius: 1rem;
          padding: 0.9rem 1rem;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.6);
          margin-bottom: 1rem;
        }

        .amoria-payment-plan-label {
          font-size: 0.8rem;
          color: #9ca3af;
          margin: 0 0 0.2rem;
        }

        .amoria-payment-plan-title {
          margin: 0;
          font-size: 1.05rem;
        }

        .amoria-payment-plan-price {
          margin: 0.1rem 0 0;
          font-size: 0.9rem;
          color: #e5e7eb;
        }

        .amoria-payment-included {
          margin-top: 0.6rem;
          margin-bottom: 0.8rem;
        }

        .amoria-payment-included-label {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 0.3rem;
        }

        .amoria-payment-included ul {
          padding-left: 1.2rem;
          margin: 0;
          font-size: 0.82rem;
          color: #e5e7eb;
        }

        .amoria-payment-error {
          margin: 0.5rem 0 0.3rem;
          padding: 0.5rem 0.7rem;
          border-radius: 0.6rem;
          background: rgba(248, 113, 113, 0.12);
          color: #fecaca;
          font-size: 0.78rem;
        }

        .amoria-payment-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.9rem;
        }

        .amoria-payment-primary {
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-payment-secondary {
          width: 100%;
          border-radius: 999px;
          padding: 0.65rem 1rem;
          font-size: 0.86rem;
          cursor: pointer;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
        }

        @media (max-width: 640px) {
          .amoria-payment-card {
            padding-inline: 1.1rem;
          }
        }
      `}</style>
    </main>
  );
}
