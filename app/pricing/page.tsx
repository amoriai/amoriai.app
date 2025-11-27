"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

const STRINGS: Record<
  Locale,
  {
    heroTitle: string;
    heroSubtitle: string;
    startFree: string;
    simplePricing: string;
    note: string;
    choosePlan: string;
    plans: {
      id: PlanId;
      name: string;
      price: string;
      perMonth: string;
      description: string;
      button: string;
      badge?: string;
      bullets: string[];
    }[];
  }
> = {
  fr: {
    heroTitle: "Choisis le rythme qui convient à ton AmorIAI.",
    heroSubtitle:
      "Commence gratuitement, crée ton AmorIAI personnalisé, puis passe à la voix quand tu es prête.",
    startFree: "Créer mon compte gratuit",
    simplePricing: "Des tarifs simples & transparents",
    note: "Tu peux changer de forfait ou annuler à tout moment. Les prix sont en dollars américains (USD).",
    choosePlan: "Choisir ce forfait",
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $",
        perMonth: "/ mois",
        description: "Créer ton AmorIAI gratuitement.",
        button: "Choisir ce forfait",
        bullets: [
          "Idéal pour tester AmorIAI sans carte de crédit.",
          "Création de 1 AmorIAI personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $",
        perMonth: "/ mois",
        description: "Texte tous les jours, sans voix.",
        button: "Choisir ce forfait",
        bullets: [
          "Pour discuter chaque jour avec ton AmorIAI en texte, avec vraie mémoire, mais sans appels vocaux.",
          "Jusqu’à 2 AmorIAI différents",
          "400 messages texte / mois",
          "Mémoire longue durée active",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $",
        perMonth: "/ mois",
        description: "Texte + voix avec limites confortables.",
        button: "Choisir ce forfait",
        badge: "Le plus choisi",
        bullets: [
          "Parfait si tu veux parler régulièrement avec ton AmorIAI, sans te ruiner chaque mois.",
          "Jusqu’à 10 AmorIAI différents",
          "600 messages texte / mois",
          "100 échanges vocaux / mois",
          "Mémoire longue durée active",
          "Priorité légère dans le file de traitement",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI illimité",
        price: "39,99 $",
        perMonth: "/ mois",
        description: "Ton compagnon IA très présent au quotidien.",
        button: "Choisir ce forfait",
        bullets: [
          "Pour celles et ceux qui veulent que leur AmorIAI fasse vraiment partie du quotidien.",
          "Jusqu’à 30 AmorIAI personnalisés",
          "10 000 messages texte / mois",
          "300 échanges vocaux / mois",
          "Mémoire profonde + contexte étendu",
          "Accès anticipé aux nouvelles fonctionnalités",
        ],
      },
    ],
  },
  en: {
    heroTitle: "Choose the pace that fits your AmorIAI.",
    heroSubtitle:
      "Start for free, create your personalized AmorIAI, then upgrade to voice when you’re ready.",
    startFree: "Create my free account",
    simplePricing: "Simple & transparent pricing",
    note: "You can change or cancel your plan at any time. Prices are in USD.",
    choosePlan: "Choose this plan",
    plans: [], // tu pourras compléter EN/ES plus tard si tu veux
  },
  es: {
    heroTitle: "Elige el ritmo que encaja con tu AmorIAI.",
    heroSubtitle:
      "Empieza gratis, crea tu AmorIAI personalizado y pasa a la voz cuando estés lista.",
    startFree: "Crear mi cuenta gratis",
    simplePricing: "Tarifas simples y transparentes",
    note: "Puedes cambiar o cancelar tu plan en cualquier momento. Los precios están en USD.",
    choosePlan: "Elegir este plan",
    plans: [],
  },
};

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = (searchParams.get("lang") || "fr") as Locale;
  const from = searchParams.get("from") || "landing"; // "signup" ou "landing"
  const t = STRINGS[locale];

  const plans =
    t.plans.length > 0 ? t.plans : STRINGS.fr.plans; // fallback FR si EN/ES pas remplis

  const handleChoosePlan = (planId: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", planId);

    // 👉 Si on vient de /signup → l’utilisateur a déjà un compte
    //    → on l’envoie vers create-amoria (gratuit) ou payment (payant)
    if (from === "signup") {
      if (planId === "free") {
        router.push(`/create-amoria?${params.toString()}`);
      } else {
        router.push(`/payment?${params.toString()}`);
      }
      return;
    }

    // 👉 Sinon (landing, page marketing) → on envoie vers /signup
    router.push(`/signup?${params.toString()}`);
  };

  const handleStartFree = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);

    if (from === "signup") {
      // Si quelqu’un clique sur “Créer mon compte gratuit” alors qu’il vient déjà de signup,
      // on peut l’envoyer directement vers le plan gratuit.
      params.set("plan", "free");
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      // Sinon : créer le compte en premier
      params.set("plan", "free");
      router.push(`/signup?${params.toString()}`);
    }
  };

  return (
    <main className="amoria-pricing-root">
      <div className="amoria-pricing-container">
        <header className="amoria-pricing-header">
          <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
          <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>
          <button
            type="button"
            className="amoria-pricing-cta"
            onClick={handleStartFree}
          >
            {t.startFree}
          </button>
        </header>

        <section className="amoria-pricing-section">
          <h2 className="amoria-pricing-simple">{t.simplePricing}</h2>
          <p className="amoria-pricing-note">{t.note}</p>

          <div className="amoria-pricing-grid">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`amoria-pricing-card ${
                  plan.badge ? "amoria-pricing-card-highlight" : ""
                }`}
              >
                {plan.badge && (
                  <div className="amoria-pricing-badge">{plan.badge}</div>
                )}
                <h3 className="amoria-pricing-name">{plan.name}</h3>
                <p className="amoria-pricing-price">
                  <span>{plan.price}</span> <span>{plan.perMonth}</span>
                </p>
                <p className="amoria-pricing-desc">{plan.description}</p>
                <ul className="amoria-pricing-list">
                  {plan.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="amoria-pricing-btn"
                  onClick={() => handleChoosePlan(plan.id)}
                >
                  {plan.button}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        .amoria-pricing-root {
          min-height: 100vh;
          padding: 3rem 1.5rem 4rem;
          background: radial-gradient(circle at top, #020617 0, #000 100%);
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .amoria-pricing-container {
          width: 100%;
          max-width: 1120px;
        }

        .amoria-pricing-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .amoria-pricing-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.95rem;
          color: #9ca3af;
          max-width: 560px;
          margin: 0 auto 1.2rem;
        }

        .amoria-pricing-cta {
          border: none;
          border-radius: 999px;
          padding: 0.8rem 1.6rem;
          font-size: 0.95rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-pricing-section {
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          padding: 1.8rem 1.9rem 2.1rem;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.8);
        }

        .amoria-pricing-simple {
          text-align: center;
          font-size: 1.2rem;
          margin-bottom: 0.3rem;
        }

        .amoria-pricing-note {
          text-align: center;
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 1.5rem;
        }

        .amoria-pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .amoria-pricing-card {
          border-radius: 1.2rem;
          padding: 1.2rem 1.1rem 1.3rem;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.5);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-size: 0.85rem;
        }

        .amoria-pricing-card-highlight {
          border-color: rgba(251, 113, 133, 0.8);
          box-shadow: 0 0 0 1px rgba(251, 113, 133, 0.5);
        }

        .amoria-pricing-badge {
          position: absolute;
          top: 0.85rem;
          right: 0.9rem;
          font-size: 0.7rem;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          background: rgba(251, 113, 133, 0.18);
          color: #fecaca;
          border: 1px solid rgba(252, 165, 165, 0.7);
        }

        .amoria-pricing-name {
          font-size: 0.95rem;
          margin-bottom: 0.1rem;
        }

        .amoria-pricing-price {
          font-size: 1rem;
          font-weight: 600;
        }

        .amoria-pricing-price span:last-child {
          font-size: 0.78rem;
          color: #9ca3af;
          margin-left: 0.15rem;
        }

        .amoria-pricing-desc {
          font-size: 0.8rem;
          color: #d1d5db;
          margin-bottom: 0.3rem;
        }

        .amoria-pricing-list {
          list-style: none;
          padding-left: 0;
          margin: 0 0 0.7rem;
          font-size: 0.78rem;
          color: #9ca3af;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .amoria-pricing-btn {
          margin-top: auto;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.6rem 1.1rem;
          font-size: 0.83rem;
          cursor: pointer;
          background: linear-gradient(135deg, #111827, #111827);
          color: #f9fafb;
        }

        @media (max-width: 1024px) {
          .amoria-pricing-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .amoria-pricing-section {
            padding-inline: 1.1rem;
          }
          .amoria-pricing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
