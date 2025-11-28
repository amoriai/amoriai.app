"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export const dynamic = "force-dynamic";
export const runtime = "edge";

type Locale = "fr" | "en" | "es";
type PaidPlanId = "chat" | "plus" | "unlimited";

const VALID_PLANS: PaidPlanId[] = ["chat", "plus", "unlimited"];

const PLAN_TITLES: Record<Locale, Record<PaidPlanId, string>> = {
  fr: {
    chat: "AmorIAI Chat",
    plus: "AmorIAI Plus",
    unlimited: "AmorIAI illimité",
  },
  en: {
    chat: "AmorIAI Chat",
    plus: "AmorIAI Plus",
    unlimited: "AmorIAI Unlimited",
  },
  es: {
    chat: "AmorIAI Chat",
    plus: "AmorIAI Plus",
    unlimited: "AmorIAI Ilimitado",
  },
};

const PLAN_PRICES: Record<Locale, Record<PaidPlanId, string>> = {
  fr: {
    chat: "9,99 $ USD / mois",
    plus: "19,99 $ USD / mois",
    unlimited: "39,99 $ USD / mois",
  },
  en: {
    chat: "$9.99 USD / month",
    plus: "$19.99 USD / month",
    unlimited: "$39.99 USD / month",
  },
  es: {
    chat: "9,99 $ USD / mes",
    plus: "19,99 $ USD / mes",
    unlimited: "39,99 $ USD / mes",
  },
};

const COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    cta: string;
    loading: string;
    backToPricing: string;
    errorGeneric: string;
    selectedPlanLabel: string;
    includedLabel: string;
    stripeNote: string;
  }
> = {
  fr: {
    title: "Finaliser mon abonnement",
    subtitle:
      "Ton compte AmorIAI est créé. Il ne reste plus qu’à confirmer ton paiement pour activer ton abonnement.",
    cta: "Confirmer et payer avec Stripe",
    loading: "Redirection vers Stripe…",
    backToPricing: "Retour aux tarifs",
    errorGeneric:
      "Une erreur est survenue lors de la préparation du paiement. Merci de réessayer.",
    selectedPlanLabel: "Forfait sélectionné",
    includedLabel: "Ce qui est inclus dans ce forfait :",
    stripeNote: "Paiement sécurisé via Stripe · Annulation possible à tout moment",
  },
  en: {
    title: "Complete your subscription",
    subtitle:
      "Your AmorIAI account is created. Confirm your payment to activate your subscription.",
    cta: "Confirm and pay with Stripe",
    loading: "Redirecting to Stripe…",
    backToPricing: "Back to pricing",
    errorGeneric:
      "Something went wrong while preparing the payment. Please try again.",
    selectedPlanLabel: "Selected plan",
    includedLabel: "What’s included in this plan:",
    stripeNote: "Secure payment with Stripe · Cancel anytime",
  },
  es: {
    title: "Finalizar mi suscripción",
    subtitle:
      "Tu cuenta AmorIAI ya está creada. Solo falta confirmar el pago para activar tu suscripción.",
    cta: "Confirmar y pagar con Stripe",
    loading: "Redirigiendo a Stripe…",
    backToPricing: "Volver a los planes",
    errorGeneric:
      "Se produjo un error al preparar el pago. Inténtalo de nuevo.",
    selectedPlanLabel: "Plan seleccionado",
    includedLabel: "Lo que incluye este plan:",
    stripeNote:
      "Pago seguro con Stripe · Cancelación posible en cualquier momento",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = normalizeLocale(searchParams.get("lang"));
  const t = COPY[locale];

  const rawPlan = searchParams.get("plan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Gérer les cas où le plan n’est pas correct
  useEffect(() => {
    // Pas de plan → retour direct vers /pricing
    if (!rawPlan) {
      const params = new URLSearchParams();
      params.set("lang", locale);
      router.replace(`/pricing?${params.toString()}`);
      return;
    }

    // Si jamais "free" arrive ici → on l’envoie vers /create-amoria
    if (rawPlan === "free") {
      const params = new URLSearchParams();
      params.set("lang", locale);
      params.set("plan", "free");
      router.replace(`/create-amoria?${params.toString()}`);
      return;
    }

    // Plan invalide → retour aux tarifs
    if (!VALID_PLANS.includes(rawPlan as PaidPlanId)) {
      const params = new URLSearchParams();
      params.set("lang", locale);
      router.replace(`/pricing?${params.toString()}`);
    }
  }, [rawPlan, locale, router]);

  // Pendant les redirections, on ne rend rien
  if (!rawPlan || rawPlan === "free" || !VALID_PLANS.includes(rawPlan as PaidPlanId)) {
    return null;
  }

  const planKey = rawPlan as PaidPlanId;
  const planTitle = PLAN_TITLES[locale][planKey];
  const planPrice = PLAN_PRICES[locale][planKey];

  const handleBackToPricing = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/pricing?${params.toString()}`);
  };

  const handleCheckout = async () => {
    try {
      setError(null);
      setLoading(true);

      // 2) Vérifier que l’utilisateur est connecté Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        // Pas connecté → on renvoie au signup avec le plan en mémoire
        const params = new URLSearchParams();
        params.set("lang", locale);
        params.set("plan", planKey);
        router.push(`/signup?${params.toString()}`);
        setLoading(false);
        return;
      }

      // 3) Créer la session Stripe via /api/checkout
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planKey,
          user_id: userData.user.id,
        }),
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

  return (
    <main className="amoria-payment-root">
      <div className="amoria-payment-wrapper">
        <div className="amoria-payment-card">
          <header className="amoria-payment-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIAI"
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
            <p className="amoria-payment-included-label">{t.includedLabel}</p>
            <ul>
              <li>Accès 24/7 à AmorIAI</li>
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
              {loading ? t.loading : t.cta}
            </button>
            <button
              type="button"
              onClick={handleBackToPricing}
              disabled={loading}
              className="amoria-payment-secondary"
            >
              {t.backToPricing}
            </button>
          </div>

          <p className="amoria-payment-stripe-note">{t.stripeNote}</p>
        </div>
      </div>

      <style jsx global>{`
        .amoria-payment-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #000 100%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
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

        .amoria-payment-stripe-note {
          margin-top: 0.8rem;
          font-size: 0.75rem;
          color: #9ca3af;
          text-align: center;
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
