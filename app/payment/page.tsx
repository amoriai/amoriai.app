"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function getLocale(searchParams: URLSearchParams): Locale {
  const raw = searchParams.get("lang");
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function getPlan(searchParams: URLSearchParams): PlanId {
  const raw = searchParams.get("plan");
  if (raw === "chat" || raw === "plus" || raw === "unlimited" || raw === "free") {
    return raw;
  }
  return "free";
}

const LABELS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    payButton: string;
    backButton: string;
    freeInfo: string;
  }
> = {
  fr: {
    title: "Finaliser ton abonnement",
    subtitle:
      "Complète ton paiement sécurisé avec Stripe pour activer ton forfait AmorIA.",
    payButton: "Procéder au paiement sécurisé",
    backButton: "Revenir aux forfaits",
    freeInfo:
      "Tu as choisi le forfait Découverte gratuit. Aucun paiement n’est requis.",
  },
  en: {
    title: "Complete your subscription",
    subtitle:
      "Finish your secure payment with Stripe to activate your AmorIA plan.",
    payButton: "Proceed to secure payment",
    backButton: "Back to pricing",
    freeInfo:
      "You selected the free Discovery plan. No payment is required.",
  },
  es: {
    title: "Finalizar tu suscripción",
    subtitle:
      "Completa tu pago seguro con Stripe para activar tu plan AmorIA.",
    payButton: "Ir al pago seguro",
    backButton: "Volver a los planes",
    freeInfo:
      "Elegiste el plan Descubrimiento gratuito. No se requiere pago.",
  },
};

const PLAN_TEXT: Record<
  Locale,
  Record<PlanId, { name: string; description: string }>
> = {
  fr: {
    free: {
      name: "Découverte (gratuit)",
      description:
        "Création de 1 AmorIA, 200 messages texte / mois, accès FR / EN / ES.",
    },
    chat: {
      name: "AmorIA Chat – 9,99 $ / mois",
      description:
        "Jusqu’à 2 AmoriA, 400 messages texte / mois, mémoire longue durée.",
    },
    plus: {
      name: "AmorIA Plus – 19,99 $ / mois",
      description:
        "Jusqu’à 3 AmoriA, plus de messages, options avancées de personnalisation.",
    },
    unlimited: {
      name: "AmorIA Illimité – 39,99 $ / mois",
      description:
        "AmoriA illimités, messages généreux, priorité et nouvelles fonctions.",
    },
  },
  en: {
    free: {
      name: "Discovery (free)",
      description:
        "Create 1 AmorIA, 200 text messages / month, FR / EN / ES access.",
    },
    chat: {
      name: "AmorIA Chat – $9.99 / month",
      description:
        "Up to 2 AmorIA, 400 text messages / month, long-term memory.",
    },
    plus: {
      name: "AmorIA Plus – $19.99 / month",
      description:
        "Up to 3 AmorIA, more messages, advanced customization.",
    },
    unlimited: {
      name: "AmorIA Unlimited – $39.99 / month",
      description:
        "Unlimited AmorIA, generous messages, priority and new features.",
    },
  },
  es: {
    free: {
      name: "Descubrimiento (gratis)",
      description:
        "Crea 1 AmorIA, 200 mensajes de texto / mes, acceso FR / EN / ES.",
    },
    chat: {
      name: "AmorIA Chat – 9,99 $ / mes",
      description:
        "Hasta 2 AmorIA, 400 mensajes / mes, memoria a largo plazo.",
    },
    plus: {
      name: "AmorIA Plus – 19,99 $ / mes",
      description:
        "Hasta 3 AmorIA, más mensajes, personalización avanzada.",
    },
    unlimited: {
      name: "AmorIA Ilimitado – 39,99 $ / mes",
      description:
        "AmorIA ilimitados, muchos mensajes, prioridad y nuevas funciones.",
    },
  },
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sécurité : si pour une raison X searchParams est null → on renvoie vers /tarifs
  if (!searchParams) {
    if (typeof window !== "undefined") {
      router.replace("/pricing");
    }
    return null;
  }

  const locale = getLocale(searchParams);
  const plan = getPlan(searchParams);

  const t = LABELS[locale];
  const planText = PLAN_TEXT[locale][plan];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }), // on envoie juste le planId
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Checkout error");
      }

      const data = await res.json();

      // Stripe renvoie une URL de session : on y envoie l’utilisateur
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Missing Stripe URL.");
      }
    } catch (e: any) {
      setError(e.message || "Erreur de paiement.");
      setLoading(false);
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/pricing?${params.toString()}`);
  };

  // Si c’est le plan gratuit et qu’on arrive ici par erreur → on envoie vers create-amoria
  if (plan === "free") {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      params.set("lang", locale);
      params.set("plan", "free");
      router.replace(`/create-amoria?${params.toString()}`);
    }
    return null;
  }

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
            {planText.name}
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#e5e7eb",
              marginBottom: "0.9rem",
            }}
          >
            {planText.description}
          </p>

          {error && <p className="amoria-auth-error">{error}</p>}

          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="amoria-auth-submit"
          >
            {loading ? "…" : t.payButton}
          </button>

          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="amoria-auth-google"
            style={{ marginTop: "0.7rem" }}
          >
            {t.backButton}
          </button>
        </div>
      </div>
    </main>
  );
}
