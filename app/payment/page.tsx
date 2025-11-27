"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "edge";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

const PLAN_TITLES: Record<Locale, Record<PlanId, string>> = {
  fr: {
    free: "Découverte (gratuit)",
    chat: "AmorIAI Chat",
    plus: "AmorIAI Plus",
    unlimited: "AmorIAI Illimité",
  },
  en: {
    free: "Discovery (free)",
    chat: "AmorIAI Chat",
    plus: "AmorIAI Plus",
    unlimited: "AmorIAI Unlimited",
  },
  es: {
    free: "Descubrimiento (gratis)",
    chat: "AmorIAI Chat",
    plus: "AmorIAI Plus",
    unlimited: "AmorIAI Ilimitado",
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
    missingPlan: string;
  }
> = {
  fr: {
    title: "Finaliser mon abonnement",
    subtitle:
      "Ton compte AmorIAI est créé. Il ne reste plus qu’à confirmer ton paiement pour activer ton abonnement.",
    payButton: "Confirmer et payer avec Stripe",
    loading: "Redirection vers Stripe…",
    backToPricing: "Retour aux tarifs",
    errorGeneric:
      "Une erreur est survenue pendant la création de la session de paiement. Réessaie dans quelques instants.",
    included: "Ce qui est inclus dans ce forfait :",
    selectedPlanLabel: "Forfait sélectionné",
    missingPlan:
      "Aucun forfait payant n’a été sélectionné. Retourne à la page des tarifs pour choisir un plan.",
  },
  en: {
    title: "Complete your subscription",
    subtitle:
      "Your AmorIAI account is created. Confirm your payment to activate your subscription.",
    payButton: "Confirm and pay with Stripe",
    loading: "Redirecting to Stripe…",
    backToPricing: "Back to pricing",
    errorGeneric:
      "Something went wrong while creating the checkout session. Please try again.",
    included: "What’s included in this plan:",
    selectedPlanLabel: "Selected plan",
    missingPlan:
      "No paid plan was selected. Go back to the pricing page to choose a plan.",
  },
  es: {
    title: "Finalizar mi suscripción",
    subtitle:
      "Tu cuenta AmorIAI está creada. Solo falta confirmar el pago para activar tu suscripción.",
    payButton: "Confirmar y pagar con Stripe",
    loading: "Redirigiendo a Stripe…",
    backToPricing: "Volver a los planes",
    errorGeneric:
      "Se produjo un error al crear la sesión de pago. Inténtalo de nuevo.",
    included: "Lo que incluye este plan:",
    selectedPlanLabel: "Plan seleccionado",
    missingPlan:
      "No se ha seleccionado ningún plan de pago. Vuelve a la página de tarifas para elegir un plan.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get("lang"));
  const rawPlan = searchParams.get("plan") as PlanId | null;
  const t = COPY[locale];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInvalid = !rawPlan || rawPlan === "free";

  const planKey: PlanId = rawPlan && !isInvalid ? rawPlan : "chat"; // valeur par défaut pour l’affichage
  const planTitle = PLAN_TITLES[locale][planKey];
  const planPrice = PLAN_PRICES[locale][planKey];

  const handleCheckout = async () => {
    if (isInvalid) return;

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: rawPlan }),
      });

      if (!res.ok) throw new Error(t.errorGeneric);

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
    <main className="amoria-payment-root">
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

          {isInvalid ? (
            <>
              <section className="amoria-payment-missing">
                <p>{t.missingPlan}</p>
              </section>
              <div className="amoria-payment-actions">
                <button
                  type="button"
                  onClick={handleBack}
                  className="amoria-payment-secondary"
                >
                  {t.backToPricing}
                </button>
              </div>
            </>
          ) : (
            <>
              <section className="amoria-payment-plan">
                <p className="amoria-payment-plan-label">
                  {t.selectedPlanLabel}
                </p>
                <h2 className="amoria-payment-plan-title">{planTitle}</h2>
                <p className="amoria-payment-plan-price">{planPrice}</p>
              </section>

              <section className="amoria-payment-included">
                <p className="amoria-payment-included-label">{t.included}</p>
                <ul>
                  <li>Accès 24/7 à AmorIAI</li>
                  <li>
                    Volume de messages adapté à un usage quotidien (fair use)
                  </li>
                  <li>Historique de conversation sauvegardé</li>
                  <li>Support par courriel en cas de question technique</li>
                </ul>
              </section>

              {error && (
                <p className="amoria-payment-error">{error}</p>
              )}

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
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .amoria-payment-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #000 60%);
          color: #e5e7eb;
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

        .amoria-payment-missing {
          margin-top: 0.4rem;
          font-size: 0.9rem;
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
