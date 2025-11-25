"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

// 🔎 Lis les paramètres de l’URL, avec sécurité côté serveur
function getLocaleFromSearchParams(): Locale {
  if (typeof window === "undefined") return "fr";
  const searchParams = new URLSearchParams(window.location.search);
  const raw = searchParams.get("lang");
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function getSelectedPlan(): PlanId {
  if (typeof window === "undefined") return "free";
  const searchParams = new URLSearchParams(window.location.search);
  const raw = searchParams.get("plan");
  if (raw === "chat" || raw === "plus" || raw === "unlimited") return raw;
  return "free";
}

// 🏷️ Texte par plan
const PLAN_TEXT: Record<
  Locale,
  Record<
    PlanId,
    {
      title: string;
      description: string;
      priceLabel: string;
      cta: string;
    }
  >
> = {
  fr: {
    free: {
      title: "Forfait Découverte (gratuit)",
      description:
        "Tu peux commencer avec AmorIA gratuitement, puis passer à un forfait payant plus tard.",
      priceLabel: "0 $ / mois",
      cta: "Continuer gratuitement",
    },
    chat: {
      title: "AmorIA Chat",
      description:
        "Messages texte illimités avec ton compagnon IA, sans voix. Idéal pour discuter chaque jour.",
      priceLabel: "9,99 $ / mois",
      cta: "Procéder au paiement",
    },
    plus: {
      title: "AmorIA Plus",
      description:
        "Messages texte + voix, plus de mémoire et des fonctionnalités avancées.",
      priceLabel: "19,99 $ / mois",
      cta: "Procéder au paiement",
    },
    unlimited: {
      title: "AmorIA Illimité",
      description:
        "Usage intensif d’AmorIA : texte + voix, mémoire longue durée et accès prioritaire.",
      priceLabel: "39,99 $ / mois",
      cta: "Procéder au paiement",
    },
  },
  en: {
    free: {
      title: "Discovery plan (free)",
      description:
        "Start using AmorIA for free and upgrade to a paid plan later.",
      priceLabel: "$0 / month",
      cta: "Continue for free",
    },
    chat: {
      title: "AmorIA Chat",
      description:
        "Unlimited text messages with your AI companion, no voice. Perfect for daily chatting.",
      priceLabel: "$9.99 / month",
      cta: "Proceed to payment",
    },
    plus: {
      title: "AmorIA Plus",
      description:
        "Text + voice, more memory and advanced features for deeper conversations.",
      priceLabel: "$19.99 / month",
      cta: "Proceed to payment",
    },
    unlimited: {
      title: "AmorIA Unlimited",
      description:
        "Intensive AmorIA usage: text + voice, long-term memory and priority access.",
      priceLabel: "$39.99 / month",
      cta: "Proceed to payment",
    },
  },
  es: {
    free: {
      title: "Plan Descubrimiento (gratis)",
      description:
        "Empieza con AmorIA gratis y pasa a un plan de pago más adelante.",
      priceLabel: "0 $ / mes",
      cta: "Continuar gratis",
    },
    chat: {
      title: "AmorIA Chat",
      description:
        "Mensajes de texto ilimitados con tu compañero IA, sin voz. Ideal para charlar cada día.",
      priceLabel: "9,99 $ / mes",
      cta: "Ir al pago",
    },
    plus: {
      title: "AmorIA Plus",
      description:
        "Texto + voz, más memoria y funciones avanzadas para conversaciones profundas.",
      priceLabel: "19,99 $ / mes",
      cta: "Ir al pago",
    },
    unlimited: {
      title: "AmorIA Ilimitado",
      description:
        "Uso intensivo de AmorIA: texto + voz, memoria a largo plazo y acceso prioritario.",
      priceLabel: "39,99 $ / mes",
      cta: "Ir al pago",
    },
  },
};

const STRINGS: Record<
  Locale,
  {
    pageTitle: string;
    pageSubtitle: string;
    backToPricing: string;
    processing: string;
    errorGeneric: string;
  }
> = {
  fr: {
    pageTitle: "Confirmer ton abonnement",
    pageSubtitle:
      "Vérifie ton forfait puis procède au paiement sécurisé avec Stripe.",
    backToPricing: "Retour aux forfaits",
    processing: "Traitement en cours…",
    errorGeneric:
      "Une erreur est survenue pendant la préparation du paiement. Réessaie plus tard.",
  },
  en: {
    pageTitle: "Confirm your subscription",
    pageSubtitle:
      "Check your plan and proceed to secure payment with Stripe.",
    backToPricing: "Back to pricing",
    processing: "Processing…",
    errorGeneric:
      "Something went wrong while preparing your payment. Please try again later.",
  },
  es: {
    pageTitle: "Confirmar tu suscripción",
    pageSubtitle:
      "Verifica tu plan y procede al pago seguro con Stripe.",
    backToPricing: "Volver a los planes",
    processing: "Procesando…",
    errorGeneric:
      "Ha ocurrido un error al preparar el pago. Inténtalo de nuevo más tarde.",
  },
};

export default function PaymentPage() {
  const locale = getLocaleFromSearchParams();
  const plan = getSelectedPlan();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const texts = STRINGS[locale];
  const planText = PLAN_TEXT[locale][plan];

  const handleConfirm = async () => {
    setError(null);

    // 🎁 Plan gratuit : pas de Stripe → on renvoie vers l’accueil (tu pourras changer plus tard)
    if (plan === "free") {
      router.push("/?lang=" + locale);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan, lang: locale }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error("Checkout error:", body);
        throw new Error("Checkout failed");
      }

      const data = await res.json();

      if (data?.url) {
        // 🔁 Redirection vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("Missing checkout URL");
      }
    } catch (e) {
      console.error(e);
      setError(texts.errorGeneric);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/?lang=" + locale);
  };

  return (
    <main className="amoria-payment-root">
      <div className="amoria-payment-card">
        <header className="amoria-payment-header">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIA"
            className="amoria-payment-logo"
          />
          <div>
            <h1>{texts.pageTitle}</h1>
            <p>{texts.pageSubtitle}</p>
          </div>
        </header>

        <section className="amoria-payment-plan">
          <h2>{planText.title}</h2>
          <p className="amoria-payment-price">{planText.priceLabel}</p>
          <p className="amoria-payment-description">
            {planText.description}
          </p>
        </section>

        {error && <p className="amoria-payment-error">{error}</p>}

        <div className="amoria-payment-actions">
          <button
            type="button"
            className="amoria-payment-secondary"
            onClick={handleBack}
            disabled={loading}
          >
            {texts.backToPricing}
          </button>

          <button
            type="button"
            className="amoria-payment-primary"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? texts.processing : planText.cta}
          </button>
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

        .amoria-payment-card {
          max-width: 540px;
          width: 100%;
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1.8rem 1.7rem 1.6rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
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

        .amoria-payment-header h1 {
          margin: 0 0 0.2rem;
          font-size: 1.25rem;
        }

        .amoria-payment-header p {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amoria-payment-plan h2 {
          margin: 0 0 0.3rem;
          font-size: 1.05rem;
        }

        .amoria-payment-price {
          margin: 0 0 0.3rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #f9fafb;
        }

        .amoria-payment-description {
          margin: 0 0 1rem;
          font-size: 0.88rem;
          color: #cbd5f5;
        }

        .amoria-payment-error {
          margin: 0 0 0.8rem;
          padding: 0.55rem 0.7rem;
          border-radius: 0.6rem;
          background: rgba(248, 113, 113, 0.12);
          color: #fecaca;
          font-size: 0.78rem;
        }

        .amoria-payment-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
        }

        .amoria-payment-secondary {
          border-radius: 999px;
          padding: 0.6rem 1.1rem;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: transparent;
          color: #e5e7eb;
          font-size: 0.86rem;
          cursor: pointer;
        }

        .amoria-payment-primary {
          border-radius: 999px;
          padding: 0.6rem 1.2rem;
          border: none;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
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

