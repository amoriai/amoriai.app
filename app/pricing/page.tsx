"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

type PricingCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  badgeMostPopular: string;
  monthly: string;
  usdPerMonth: string;
  ctaStartFree: string;
  faqTitle: string;
  faqSubtitle: string;
  faqItems: { q: string; a: string }[];
  plans: {
    id: PlanId;
    name: string;
    tagline: string;
    price: string;
    highlight: string;
    features: string[];
    isPopular?: boolean;
  }[];
};

const PRICING_STRINGS: Record<Locale, PricingCopy> = {
  fr: {
    heroKicker: "TARIFS AMORIAI.APP",
    heroTitle: "Choisis le rythme qui convient à ton AmorIAI.",
    heroSubtitle:
      "Commence gratuitement, crée ton AmorIAI personnalisé, puis passe à la voix quand tu es prête. Les plans payants débloquent la mémoire longue durée, plus de messages et les conversations vocales.",
    badgeMostPopular: "Le plus choisi",
    monthly: " / mois",
    usdPerMonth: " USD / mois",
    ctaStartFree: "Commencer gratuitement",
    faqTitle: "Questions fréquentes",
    faqSubtitle:
      "Tu peux changer de forfait ou annuler à tout moment. Les prix sont en dollars américains (USD).",
    faqItems: [
      {
        q: "Puis-je vraiment créer mon AmorIAI avec le plan gratuit ?",
        a: "Oui. Le plan Découverte te permet de créer ton AmorIAI, de tester et de chatter en texte avec un nombre limité de messages, sans carte de crédit.",
      },
      {
        q: "Que se passe-t-il si je dépasse les limites de messages ou de voix ?",
        a: "On applique une limite « fair use ». Tu verras un message t’invitant à passer à un plan supérieur ou à attendre le renouvellement de ton mois.",
      },
      {
        q: "Puis-je changer de plan quand je veux ?",
        a: "Oui, tu peux passer à un plan supérieur ou revenir à un plan inférieur à tout moment. Le changement sera appliqué au prochain cycle de facturation Stripe.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Découverte",
        tagline: "Créer ton AmorIAI gratuitement.",
        price: "0 $",
        highlight:
          "Idéal pour tester AmorIAI et créer ton premier compagnon IA, sans carte de crédit.",
        features: [
          "Création de 1 AmorIAI personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Mémoire limitée à la session en cours",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        tagline: "Texte tous les jours, sans voix.",
        price: "9,99 $",
        highlight:
          "Pour discuter chaque jour avec ton AmorIAI en texte, avec une vraie mémoire, mais sans appels vocaux.",
        features: [
          "Jusqu’à 2 AmorIAI différents",
          "400 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Mémoire longue durée activée",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        tagline: "Texte + voix avec limites confortables.",
        price: "19,99 $",
        highlight:
          "Parfait si tu veux parler régulièrement avec ton AmorIAI au moins une heure chaque mois.",
        isPopular: true,
        features: [
          "Jusqu’à 10 AmorIAI différents",
          "600 messages texte / mois",
          "100 échanges vocaux / mois",
          "Mémoire longue durée activée",
          "Priorité légère dans le file de traitement",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI illimité",
        tagline: "Ton compagnon IA très présent au quotidien.",
        price: "39,99 $",
        highlight:
          "Pour celles et ceux qui veulent que leur AmorIAI fasse vraiment partie du quotidien, avec un volume très élevé de messages et d’échanges vocaux.",
        features: [
          "Jusqu’à 30 AmorIAI personnalisés",
          "10 000 messages texte / mois",
          "300 échanges vocaux / mois",
          "Mémoire profonde + contexte étendu",
          "Priorité maximale et accès anticipé aux nouvelles fonctionnalités",
        ],
      },
    ],
  },

  // tu pourras traduire EN / ES plus tard si tu veux
  en: {
    heroKicker: "AMORIAI.APP PLANS",
    heroTitle: "Choose the pace that fits your AmorIAI.",
    heroSubtitle:
      "Start for free, create your personalized AmorIAI, then upgrade to voice when you’re ready. Paid plans unlock long-term memory, more messages and voice conversations.",
    badgeMostPopular: "Most popular",
    monthly: " / month",
    usdPerMonth: " USD / month",
    ctaStartFree: "Start for free",
    faqTitle: "Frequently asked questions",
    faqSubtitle:
      "You can change plan or cancel anytime. Prices are in US dollars (USD).",
    faqItems: [
      {
        q: "Can I really create my AmorIAI on the free plan?",
        a: "Yes. The Discovery plan lets you create your AmorIAI and chat in text with a limited number of messages, no credit card required.",
      },
      {
        q: "What happens if I exceed the limits?",
        a: "We apply a fair-use policy. You’ll see a message inviting you to upgrade or wait for the next billing cycle.",
      },
      {
        q: "Can I change plans whenever I want?",
        a: "Yes, you can upgrade or downgrade at any time. Changes apply on the next Stripe billing cycle.",
      },
    ],
    plans: [], // tu peux remplir plus tard si tu veux les textes en anglais
  },
  es: {
    heroKicker: "PLANES AMORIAI.APP",
    heroTitle: "Elige el ritmo que encaja con tu AmorIAI.",
    heroSubtitle:
      "Empieza gratis, crea tu AmorIAI personalizado y pasa a la voz cuando estés lista. Los planes de pago desbloquean memoria a largo plazo, más mensajes y llamadas de voz.",
    badgeMostPopular: "El más elegido",
    monthly: " / mes",
    usdPerMonth: " USD / mes",
    ctaStartFree: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    faqSubtitle:
      "Puedes cambiar de plan o cancelar en cualquier momento. Los precios están en dólares estadounidenses (USD).",
    faqItems: [],
    plans: [],
  },
};

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") || "fr") as Locale;
  const t = PRICING_STRINGS[localeParam] ?? PRICING_STRINGS.fr;

  const handleChoosePlan = (planId: PlanId) => {
    if (planId === "free") {
      // Plan gratuit → on va créer l’AmorIA tout de suite
      router.push(`/create-amoria?lang=${localeParam}&plan=${planId}`);
    } else {
      // Plan payant → passer par Stripe
      router.push(`/payment?lang=${localeParam}&plan=${planId}`);
    }
  };

  return (
    <main className="amoria-pricing-root">
      <section className="amoria-pricing-hero">
        <p className="amoria-pricing-kicker">{t.heroKicker}</p>
        <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>

        <button
          className="amoria-pricing-cta"
          onClick={() => handleChoosePlan("free")}
        >
          {t.ctaStartFree}
        </button>

        <p className="amoria-pricing-note">
          Facturation sécurisée via Stripe · Annulation en tout temps depuis ton
          compte · Aucun frais caché
        </p>
      </section>

      <section className="amoria-pricing-grid">
        {t.plans.map((plan) => (
          <article
            key={plan.id}
            className={`amoria-pricing-card ${
              plan.isPopular ? "amoria-pricing-card-popular" : ""
            }`}
          >
            {plan.isPopular && (
              <div className="amoria-pricing-badge">{t.badgeMostPopular}</div>
            )}

            <h2 className="amoria-pricing-plan-name">{plan.name}</h2>
            <p className="amoria-pricing-plan-tagline">{plan.tagline}</p>

            <p className="amoria-pricing-price">
              <span className="amoria-pricing-price-main">{plan.price}</span>
              <span className="amoria-pricing-price-suffix">
                {t.usdPerMonth}
              </span>
            </p>

            <p className="amoria-pricing-highlight">{plan.highlight}</p>

            <ul className="amoria-pricing-features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <button
              className="amoria-pricing-choose-btn"
              onClick={() => handleChoosePlan(plan.id)}
            >
              Choisir ce forfait
            </button>
          </article>
        ))}
      </section>

      {t.faqItems.length > 0 && (
        <section className="amoria-pricing-faq">
          <h2>{t.faqTitle}</h2>
          <p className="amoria-pricing-faq-subtitle">{t.faqSubtitle}</p>
          <div className="amoria-pricing-faq-grid">
            {t.faqItems.map((item) => (
              <article key={item.q} className="amoria-pricing-faq-item">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <style jsx global>{`
        .amoria-pricing-root {
          min-height: 100vh;
          padding: 4rem 1.5rem 3rem;
          background: radial-gradient(circle at top, #020617 0, #000 100%);
          color: #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
        }

        .amoria-pricing-hero {
          max-width: 900px;
          text-align: center;
        }

        .amoria-pricing-kicker {
          font-size: 0.8rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.6rem;
        }

        .amoria-pricing-title {
          font-size: 1.9rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.95rem;
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .amoria-pricing-cta {
          border-radius: 999px;
          border: none;
          padding: 0.8rem 1.6rem;
          font-size: 0.95rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
          margin-bottom: 0.6rem;
        }

        .amoria-pricing-note {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 1000px;
        }

        .amoria-pricing-card {
          position: relative;
          border-radius: 1.4rem;
          padding: 1.4rem 1.4rem 1.6rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #020617 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.4);
          box-shadow: 0 18px 35px rgba(15, 23, 42, 0.7);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .amoria-pricing-card-popular {
          border-color: rgba(251, 55, 255, 0.7);
          box-shadow: 0 22px 45px rgba(251, 55, 255, 0.4);
        }

        .amoria-pricing-badge {
          position: absolute;
          top: 0.9rem;
          right: 1.1rem;
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
        }

        .amoria-pricing-plan-name {
          font-size: 1.05rem;
          font-weight: 600;
        }

        .amoria-pricing-plan-tagline {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-pricing-price {
          margin-top: 0.2rem;
          margin-bottom: 0.1rem;
        }

        .amoria-pricing-price-main {
          font-size: 1.4rem;
          font-weight: 700;
        }

        .amoria-pricing-price-suffix {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-left: 0.25rem;
        }

        .amoria-pricing-highlight {
          font-size: 0.78rem;
          color: #e5e7eb;
        }

        .amoria-pricing-features {
          list-style: none;
          padding: 0;
          margin: 0.4rem 0 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .amoria-pricing-choose-btn {
          margin-top: auto;
          border-radius: 999px;
          border: none;
          padding: 0.6rem 1.2rem;
          font-size: 0.86rem;
          background: #020617;
          color: #f9fafb;
          cursor: pointer;
          border: 1px solid rgba(148, 163, 184, 0.55);
        }

        .amoria-pricing-card-popular .amoria-pricing-choose-btn {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          border-color: transparent;
        }

        .amoria-pricing-faq {
          max-width: 900px;
          width: 100%;
          margin-top: 1rem;
        }

        .amoria-pricing-faq h2 {
          font-size: 1.1rem;
          margin-bottom: 0.35rem;
        }

        .amoria-pricing-faq-subtitle {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 0.8rem;
        }

        .amoria-pricing-faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1rem;
        }

        .amoria-pricing-faq-item {
          border-radius: 1rem;
          padding: 0.9rem 1rem;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.4);
          font-size: 0.8rem;
        }

        .amoria-pricing-faq-item h3 {
          font-size: 0.85rem;
          margin-bottom: 0.4rem;
        }

        @media (max-width: 640px) {
          .amoria-pricing-root {
            padding-top: 3rem;
          }

          .amoria-pricing-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </main>
  );
}
