"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

type PlanId = "chat" | "plus" | "unlimited";

const LABELS: Record<
  PlanId,
  { fr: string; en: string; es: string }
> = {
  chat: {
    fr: "AmorIA Chat – 9,99 $ / mois",
    en: "AmorIA Chat – $9.99 / month",
    es: "AmorIA Chat – 9,99 US$ / mes",
  },
  plus: {
    fr: "AmorIA Plus – 19,99 $ / mois",
    en: "AmorIA Plus – $19.99 / month",
    es: "AmorIA Plus – 19,99 US$ / mes",
  },
  unlimited: {
    fr: "AmorIA Illimité – 39,99 $ / mois",
    en: "AmorIA Unlimited – $39.99 / month",
    es: "AmorIA Ilimitado – 39,99 US$ / mes",
  },
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const lang = (searchParams?.get("lang") ??
    "fr") as "fr" | "en" | "es";
  const plan = (searchParams?.get("plan") ??
    "chat") as PlanId;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const label = LABELS[plan][lang];

  const payLabel =
    lang === "fr"
      ? "Procéder au paiement sécurisé"
      : lang === "en"
      ? "Proceed to secure payment"
      : "Proceder al pago seguro";

  const textTitle =
    lang === "fr"
      ? "Finaliser mon abonnement"
      : lang === "en"
      ? "Complete my subscription"
      : "Finalizar mi suscripción";

  const textIntro =
    lang === "fr"
      ? "Tu vas être redirigé·e vers Stripe pour un paiement sécurisé. Ton abonnement sera renouvelé chaque mois, et tu pourras l’annuler à tout moment."
      : lang === "en"
      ? "You’ll be redirected to Stripe for a secure payment. Your subscription renews monthly and you can cancel anytime."
      : "Serás redirigido a Stripe para un pago seguro. Tu suscripción se renovará cada mes y podrás cancelarla en cualquier momento.";

  const handlePay = async () => {
    try {
      setLoading(true);
      setErr(null);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error || "Erreur lors de la création du paiement"
        );
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL Stripe manquante");
      }
    } catch (e: any) {
      console.error(e);
      setErr(e.message || "Erreur de paiement");
      setLoading(false);
    }
  };

  return (
    <main className="amoria-root">
      <section className="amoria-hero">
        <div className="amoria-hero-left">
          <h1 className="amoria-hero-title">{textTitle}</h1>
          <p className="amoria-hero-subtitle">{textIntro}</p>

          <div className="amoria-pricing-card">
            <p>
              <strong>{label}</strong>
            </p>
          </div>

          {err && <p className="amoria-error-text">{err}</p>}

          <button
            onClick={handlePay}
            disabled={loading}
            className="amoria-btn amoria-btn--primary amoria-btn--big"
          >
            {loading ? "..." : payLabel}
          </button>
        </div>
      </section>
    </main>
  );
}
