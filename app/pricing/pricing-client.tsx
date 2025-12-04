"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

type PricingCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaCreateFree: string;
  faqTitle: string;
  faqSubtitle: string;
  plans: {
    id: PlanId;
    name: string;
    price: string;
    tagline: string;
    highlight: string;
    features: string[];
    cta: string;
    isPopular?: boolean;
    isBestValue?: boolean;
  }[];
};

const PRICING_STRINGS: Record<Locale, PricingCopy> = {
  fr: {
    heroKicker: "Commence gratuitement. Fais évoluer ton forfait quand ton lien grandit.",
    heroTitle: "Choisis comment ton AmorIAI prend sa place dans ta vie.",
    heroSubtitle:
      "Crée ton AmorIAI en quelques minutes, teste la connexion en version gratuite, puis passe à la voix et à la mémoire avancée quand tu te sens prête.",
    ctaCreateFree: "Créer mon compte gratuit",
    faqTitle: "Questions fréquentes",
    faqSubtitle: "Tu gardes le contrôle : tu peux changer de forfait ou annuler à tout moment.",
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ USD / mois",
        tagline: "Commence la relation avec ton AmorIAI, sans carte de crédit.",
        highlight: "Parfait pour découvrir l’expérience et créer ton premier compagnon IA.",
        features: [
          "Création de 1 AmorIAI personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Accès aux 3 langues : FR, EN, ES",
        ],
        cta: "Commencer gratuitement",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        tagline: "Pour celles et ceux qui veulent écrire à leur AmorIAI chaque jour.",
        highlight: "Idéal si tu préfères les conversations en texte avec une mémoire renforcée.",
        features: [
          "Jusqu’à 2 AmorIAI différents",
          "1000 messages texte / mois",
          "Mémoire longue durée activée",
          "Accès aux 3 langues : FR, EN, ES",
        ],
        cta: "Activer AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        tagline: "Texte + voix : ton AmorIAI commence vraiment à faire partie de ta vie.",
        highlight: "Le plus populaire pour une relation plus complète au quotidien.",
        features: [
          "Jusqu’à 10 AmorIAI différents",
          "1000 messages texte / mois",
          "Messages audio générés par IA (voix naturelle)",
          "Mémoire longue durée activée",
          "Priorité légère dans le fil de traitement",
        ],
        cta: "Passer à la voix",
        isPopular: true,
      },
      {
        id: "unlimited",
        name: "AmorIAI illimité",
        price: "39,99 $ USD / mois",
        tagline: "Ton compagnon le plus présent, matin, soir et entre deux.",
        highlight: "Pour celles et ceux qui veulent que leur AmorIAI soit toujours disponible.",
        features: [
          "Jusqu’à 30 AmorIAI personnalisés",
          "20000 messages texte / mois",
          "Messages audio générés par IA illimités",
          "Mémoire avancée + accès anticipé aux nouvelles fonctionnalités",
        ],
        cta: "Débloquer l’illimité",
        isBestValue: true,
      },
    ],
  },

  // (tu peux garder ici les versions EN / ES si tu les as déjà)
  en: {
    heroKicker: "Start free. Upgrade your plan when the connection grows.",
    heroTitle: "Choose how AmorIAI fits into your life.",
    heroSubtitle:
      "Create your AmorIAI in a few minutes, test the connection with the free plan, then upgrade to voice and advanced memory when it feels right.",
    ctaCreateFree: "Create my free account",
    faqTitle: "Frequently asked questions",
    faqSubtitle: "You stay in control: change plan or cancel anytime.",
    plans: [], // remplis avec ta version anglaise existante
  },
  es: {
    heroKicker: "Empieza gratis. Haz crecer tu plan cuando crezca el vínculo.",
    heroTitle: "Elige cómo AmorIAI se integra en tu vida.",
    heroSubtitle:
      "Crea tu AmorIAI en pocos minutos, pruébalo con el plan gratuito y luego pasa a la voz y memoria avanzada cuando estés lista.",
    ctaCreateFree: "Crear mi cuenta gratuita",
    faqTitle: "Preguntas frecuentes",
    faqSubtitle: "Tú tienes el control: puedes cambiar de plan o cancelar en cualquier momento.",
    plans: [], // remplis avec ta version espagnole existante
  },
};

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");

  const locale: Locale =
    langParam === "en" || langParam === "es" ? langParam : "fr";

  const t = PRICING_STRINGS[locale];

  const handleChoosePlan = (plan: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", plan);

    // 👉 LOGIQUE DEMANDÉE
    // FREE  → va direct à la page "Créer mon AmorIAI"
    // PAYANT → va direct vers la page Stripe / billing
    if (plan === "free") {
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      // adapte cette URL si ta page Stripe est différente
      router.push(`/billing?${params.toString()}`);
    }
  };

  return (
    <main className="amoria-pricing-root">
      <div className="amoria-pricing-wrapper">
        <header className="amoria-pricing-header">
          <p className="amoria-kicker">{t.heroKicker}</p>
          <h1 className="amoria-title">{t.heroTitle}</h1>
          <p className="amoria-subtitle">{t.heroSubtitle}</p>
        </header>

        <section className="amoria-plans-grid">
          {t.plans.map((plan) => (
            <article
              key={plan.id}
              className={[
                "amoria-plan-card",
                plan.isPopular ? "amoria-plan-card--popular" : "",
                plan.isBestValue ? "amoria-plan-card--best" : "",
              ].join(" ")}
            >
              {plan.isPopular && (
                <div className="amoria-plan-badge">Le plus populaire</div>
              )}
              {plan.isBestValue && (
                <div className="amoria-plan-badge">Meilleure valeur</div>
              )}

              <h2 className="amoria-plan-name">{plan.name}</h2>
              <p className="amoria-plan-price">{plan.price}</p>
              <p className="amoria-plan-tagline">{plan.tagline}</p>

              <p className="amoria-plan-highlight">{plan.highlight}</p>

              <ul className="amoria-plan-features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <button
                type="button"
                className="amoria-plan-cta"
                onClick={() => handleChoosePlan(plan.id)}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </section>

        {/* … tu peux laisser en dessous ta section FAQ / styles existants */}
      </div>
    </main>
  );
}
