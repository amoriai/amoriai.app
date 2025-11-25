"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "chat" | "plus" | "unlimited" | "free";

function getLocale(sp: URLSearchParams): Locale {
  const raw = sp.get("lang");
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function getPlan(sp: URLSearchParams): PlanId {
  const raw = sp.get("plan");
  if (raw === "chat" || raw === "plus" || raw === "unlimited") return raw;
  return "free";
}

const LABELS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    payNow: string;
    freeInfo: string;
    backHome: string;
    error: string;
  }
> = {
  fr: {
    title: "Finaliser ton abonnement",
    subtitle:
      "Tu vas être redirigé vers Stripe pour sécuriser ton paiement. Une fois terminé, tu reviendras automatiquement sur AmorIA.app.",
    payNow: "Passer au paiement sécurisé",
    freeInfo:
      "Ce plan est gratuit. Aucun paiement n’est nécessaire. Tu peux directement commencer avec ton AmorIA.",
    backHome: "Retour à l’accueil",
    error:
      "Une erreur est survenue pendant la création de la session de paiement. Réessaie dans quelques instants.",
  },
  en: {
    title: "Complete your subscription",
    subtitle:
      "You will be redirected to Stripe for secure payment. Once done, you’ll come back automatically to AmorIA.app.",
    payNow: "Go to secure payment",
    freeInfo:
      "This plan is free. No payment is required. You can start with your AmorIA right away.",
    backHome: "Back to home",
    error:
      "An error occurred while creating the payment session. Please try again in a moment.",
  },
  es: {
    title: "Finaliza tu suscripción",
    subtitle:
      "Serás redirigido a Stripe para realizar el pago de forma segura. Después volverás automáticamente a AmorIA.app.",
    payNow: "Ir al pago seguro",
    freeInfo:
      "Este plan es gratis. No necesitas pagar. Puedes empezar con tu AmorIA ahora mismo.",
    backHome: "Volver al inicio",
    error:
      "Se produjo un error al crear la sesión de pago. Inténtalo de nuevo en unos instantes.",
  },
};

const PLAN_NAMES: Record<PlanId, string> = {
  free: "Découverte (gratuit)",
  chat: "AmorIA Chat – 9,99 $ / mois",
  plus: "AmorIA Plus – 19,99 $ / mois",
  unlimited: "AmorIA Illimité – 39,99 $ / mois",
};

function InnerPaymentPage() {
  const searchParams = useSearchParams();
  if (!searchParams) return null;

  const locale = getLocale(searchParams);
  const plan = getPlan(searchParams);

  const t = LABELS[locale];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setError(null);

    if (plan === "free") {
      // Pas de paiement pour le gratuit → on peut juste renvoyer à l’accueil
      window.location.href = "/";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        throw new Error("Checkout API error");
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Missing Stripe URL");
      }
    } catch (e) {
      console.error(e);
      setError(t.error);
      setLoading(false);
    }
  };

  const titlePlan = PLAN_NAMES[plan];

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
            {titlePlan}
          </div>

          {plan === "free" && (
            <>
              <p className="amoria-auth-subtitle" style={{ marginBottom: "1rem" }}>
                {t.freeInfo}
              </p>
              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="amoria-auth-submit"
              >
                {t.backHome}
              </button>
            </>
          )}

          {plan !== "free" && (
            <>
              {error && <p className="amoria-auth-error">{error}</p>}

              <button
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="amoria-auth-submit"
              >
                {loading ? "…" : t.payNow}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <InnerPaymentPage />
    </Suspense>
  );
}
