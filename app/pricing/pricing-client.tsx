"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  badge?: string;
};

type Labels = {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  billingNote: string;
  simplePricing: string;
  usdNote: string;
  choosePlanCta: string;
  backToPricing: string;
  plans: Plan[];
};

const LABELS: Record<Locale, Labels> = {
  fr: {
    heroTitle: "Choisis le rythme qui convient à ton AmorIAI.",
    heroSubtitle:
      "Commence gratuitement, crée ton AmorIAI personnalisé, puis passe à la voix quand tu es prête. Les plans payants débloquent la mémoire longue durée, plus de messages et les conversations vocales.",
    heroCta: "Créer mon compte gratuit",
    billingNote:
      "Facturation sécurisée via Stripe · Annulation en tout temps depuis ton compte · Aucun frais caché",
    simplePricing: "Des tarifs simples & transparents",
    usdNote:
      "Tu peux changer de forfait ou annuler à tout moment. Les prix sont en dollars américains (USD).",
    choosePlanCta: "Choisir ce forfait",
    backToPricing: "Retour aux tarifs",
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ USD / mois",
        tagline: "Crée ton AmorIAI gratuitement.",
        features: [
          "Idéal pour tester AmorIAI et créer ton premier compagnon IA, sans carte de crédit.",
          "Création de 1 AmorIAI personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        tagline: "Texte tous les jours, sans voix.",
        features: [
          "Pour discuter chaque jour avec ton AmorIAI en texte, avec une vraie mémoire, mais sans appels vocaux.",
          "Jusqu’à 2 AmorIAI différents",
          "400 messages texte / mois",
          "Mémoire longue durée activée",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        tagline: "Texte + voix avec limites confortables.",
        features: [
          "Parfait si tu veux parler régulièrement avec ton AmorIAI sans te ruiner chaque mois.",
          "Jusqu’à 10 AmorIAI différents",
          "600 messages texte / mois",
          "100 échanges vocaux / mois",
          "Mémoire longue durée active",
          "Priorité légère dans le fil de traitement",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI illimité",
        price: "39,99 $ USD / mois",
        tagline: "Ton compagnon IA très présent au quotidien.",
        features: [
          "Pour celles et ceux qui veulent que leur AmorIAI fasse vraiment partie du quotidien, avec un volume très élevé de messages et d’échanges vocaux.",
          "Jusqu’à 30 AmorIAI personnalisés",
          "10 000 messages texte / mois",
          "300 échanges vocaux / mois",
          "Mémoire profonde + contexte étendu pour des échanges ultra personnalisés",
          "Priorité maximale et accès anticipé aux nouvelles fonctionnalités",
        ],
      },
    ],
  },
  en: {
    heroTitle: "Choose the rhythm that fits your AmorIAI.",
    heroSubtitle:
      "Start for free, create your personalized AmorIAI, then upgrade to voice when you're ready. Paid plans unlock long-term memory, more messages, and voice conversations.",
    heroCta: "Create my free account",
    billingNote:
      "Secure billing via Stripe · Cancel anytime from your account · No hidden fees",
    simplePricing: "Simple & transparent pricing",
    usdNote:
      "You can change or cancel your plan anytime. Prices are in US dollars (USD).",
    choosePlanCta: "Choose this plan",
    backToPricing: "Back to pricing",
    plans: [
      {
        id: "free",
        name: "Discovery",
        price: "$0 USD / month",
        tagline: "Create your AmorIAI for free.",
        features: [
          "Ideal to test AmorIAI and create your first AI companion, no credit card required.",
          "Create 1 personalized AmorIAI",
          "200 text messages / month",
          "No voice conversations (text only)",
          "Access to 3 languages: FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "$9.99 USD / month",
        tagline: "Text every day, no voice.",
        features: [
          "Perfect to chat daily with your AmorIAI via text, with real memory but no voice calls.",
          "Up to 2 different AmorIAI",
          "400 text messages / month",
          "Long-term memory enabled",
          "Access to 3 languages: FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "$19.99 USD / month",
        tagline: "Text + voice with comfortable limits.",
        features: [
          "Great if you want to talk regularly with your AmorIAI without breaking the bank.",
          "Up to 10 AmorIAI",
          "600 text messages / month",
          "100 voice exchanges / month",
          "Long-term memory enabled",
          "Light priority in processing queue",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI Unlimited",
        price: "$39.99 USD / month",
        tagline: "Your AI companion deeply present in your daily life.",
        features: [
          "For those who want AmorIAI to really be part of everyday life, with very high message and voice limits.",
          "Up to 30 personalized AmorIAI",
          "10 000 text messages / month",
          "300 voice exchanges / month",
          "Deep memory + extended context for ultra-personalized conversations",
          "Maximum priority and early access to new features",
        ],
      },
    ],
  },
  es: {
    heroTitle: "Elige el ritmo que mejor va con tu AmorIAI.",
    heroSubtitle:
      "Empieza gratis, crea tu AmorIAI personalizado y luego pasa a la voz cuando estés listo. Los planes de pago desbloquean memoria a largo plazo, más mensajes y conversaciones de voz.",
    heroCta: "Crear mi cuenta gratis",
    billingNote:
      "Facturación segura con Stripe · Cancelación en cualquier momento desde tu cuenta · Sin cargos ocultos",
    simplePricing: "Tarifas simples y transparentes",
    usdNote:
      "Puedes cambiar o cancelar tu plan en cualquier momento. Los precios están en dólares estadounidenses (USD).",
    choosePlanCta: "Elegir este plan",
    backToPricing: "Volver a tarifas",
    plans: [
      {
        id: "free",
        name: "Descubrimiento",
        price: "0 $ USD / mes",
        tagline: "Crea tu AmorIAI gratis.",
        features: [
          "Ideal para probar AmorIAI y crear tu primer compañero IA, sin tarjeta de crédito.",
          "Creación de 1 AmorIAI personalizado",
          "200 mensajes de texto / mes",
          "Sin conversaciones de voz (solo texto)",
          "Acceso a 3 idiomas: FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mes",
        tagline: "Texto todos los días, sin voz.",
        features: [
          "Perfecto para chatear cada día con tu AmorIAI por texto, con memoria real pero sin llamadas de voz.",
          "Hasta 2 AmorIAI diferentes",
          "400 mensajes de texto / mes",
          "Memoria a largo plazo activada",
          "Acceso a 3 idiomas: FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mes",
        tagline: "Texto + voz con límites cómodos.",
        features: [
          "Ideal si quieres hablar regularmente con tu AmorIAI sin gastar demasiado.",
          "Hasta 10 AmorIAI diferentes",
          "600 mensajes de texto / mes",
          "100 intercambios de voz / mes",
          "Memoria a largo plazo activada",
          "Prioridad ligera en la cola de procesamiento",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI Ilimitado",
        price: "39,99 $ USD / mes",
        tagline: "Tu compañero IA muy presente en tu día a día.",
        features: [
          "Para quienes quieren que AmorIAI forme realmente parte de la vida cotidiana, con límites muy altos.",
          "Hasta 30 AmorIAI personalizados",
          "10 000 mensajes de texto / mes",
          "300 intercambios de voz / mes",
          "Memoria profunda + contexto ampliado para conversaciones muy personalizadas",
          "Prioridad máxima y acceso anticipado a nuevas funciones",
        ],
      },
    ],
  },
};

export default function PricingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") || "fr") as Locale;
  const t = LABELS[localeParam];

  // Sélection d’un plan (free → création, payant → paiement)
  const handleChoosePlan = (plan: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);
    params.set("plan", plan);

    if (plan === "free") {
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      router.push(`/payment?${params.toString()}`);
    }
  };

  // Gros bouton hero = équivalent de "choisir le plan gratuit"
  const handleHeroCta = () => {
    handleChoosePlan("free");
  };

  return (
    <main className="amoria-pricing-root">
      <section className="amoria-pricing-hero">
        <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>

        <button className="amoria-pricing-hero-btn" onClick={handleHeroCta}>
          {t.heroCta}
        </button>

        <p className="amoria-pricing-billing-note">{t.billingNote}</p>
      </section>

      <section className="amoria-pricing-section">
        <h2 className="amoria-pricing-section-title">{t.simplePricing}</h2>
        <p className="amoria-pricing-section-note">{t.usdNote}</p>

        <div className="amoria-pricing-grid">
          {t.plans.map((plan) => (
            <article
              key={plan.id}
              className={`amoria-pricing-card ${
                plan.id === "plus" ? "amoria-pricing-card--highlight" : ""
              }`}
            >
              <header className="amoria-pricing-card-header">
                <h3 className="amoria-pricing-card-name">{plan.name}</h3>
                <p className="amoria-pricing-card-price">{plan.price}</p>
                <p className="amoria-pricing-card-tagline">
                  {plan.tagline}
                </p>
              </header>

              <ul className="amoria-pricing-card-features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <button
                className="amoria-pricing-card-btn"
                onClick={() => handleChoosePlan(plan.id)}
              >
                {t.choosePlanCta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .amoria-pricing-root {
          min-height: 100vh;
          padding: 3rem 1.5rem 4rem;
          background: radial-gradient(circle at top, #020617 0, #000 60%);
          color: #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
        }

        .amoria-pricing-hero {
          max-width: 960px;
          text-align: center;
        }

        .amoria-pricing-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.95rem;
          color: #9ca3af;
          margin-bottom: 1.3rem;
        }

        .amoria-pricing-hero-btn {
          border: none;
          border-radius: 999px;
          padding: 0.8rem 1.8rem;
          font-size: 0.95rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
          margin-bottom: 0.9rem;
        }

        .amoria-pricing-billing-note {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-pricing-section {
          max-width: 1100px;
          width: 100%;
        }

        .amoria-pricing-section-title {
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }

        .amoria-pricing-section-note {
          text-align: center;
          font-size: 0.82rem;
          color: #9ca3af;
          margin-bottom: 1.6rem;
        }

        .amoria-pricing-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.2rem;
        }

        @media (min-width: 900px) {
          .amoria-pricing-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        .amoria-pricing-card {
          border-radius: 1.5rem;
          padding: 1.4rem 1.1rem 1.3rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #020617
          );
          border: 1px solid rgba(148, 163, 184, 0.45);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 260px;
        }

        .amoria-pricing-card--highlight {
          border-color: #fb37ff;
          box-shadow: 0 20px 40px rgba(251, 55, 255, 0.18);
        }

        .amoria-pricing-card-header {
          margin-bottom: 0.9rem;
        }

        .amoria-pricing-card-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .amoria-pricing-card-price {
          font-size: 0.92rem;
          font-weight: 500;
          margin-bottom: 0.35rem;
        }

        .amoria-pricing-card-tagline {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-pricing-card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          font-size: 0.78rem;
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .amoria-pricing-card-btn {
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1.2rem;
          font-size: 0.85rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
          width: 100%;
        }
      `}</style>
    </main>
  );
          }
