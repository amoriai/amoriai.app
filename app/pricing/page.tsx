"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";

type Plan = {
  id: "free" | "plus" | "ultimate";
  name: string;
  price: string;
  priceSub: string;
  badge?: string;
  highlight?: boolean;
  cta: string;
  messages: string;
  voice: string;
  memory: string;
  ais: string;
  extras: string[];
};

const STRINGS: Record<
  Locale,
  {
    brandTagline: string;
    nav: { home: string; features: string; pricing: string };
    navLogin: string;
    navSignup: string;
    titleKicker: string;
    title: string;
    subtitle: string;
    billingNote: string;
    planLabelFree: string;
    planLabelPlus: string;
    planLabelUltimate: string;
    planBadgePopular: string;
    planBadgeBest: string;
    planCtaChoose: string;
    planCtaStart: string;
    planFreePrice: string;
    planFreePriceSub: string;
    planPlusPrice: string;
    planPlusPriceSub: string;
    planUltimatePrice: string;
    planUltimatePriceSub: string;
    freeMessages: string;
    freeVoice: string;
    freeMemory: string;
    freeAis: string;
    freeExtras: string[];
    plusMessages: string;
    plusVoice: string;
    plusMemory: string;
    plusAis: string;
    plusExtras: string[];
    ultimateMessages: string;
    ultimateVoice: string;
    ultimateMemory: string;
    ultimateAis: string;
    ultimateExtras: string[];
    faqTitle: string;
    faqQ1: string;
    faqA1: string;
    faqQ2: string;
    faqA2: string;
    faqQ3: string;
    faqA3: string;
    footerCopy: string;
  }
> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    titleKicker: "TARIFS AMORIA.APP",
    title: "Commence gratuitement. Passe à la voix quand tu es prêt·e.",
    subtitle:
      "Teste ton AmorIA gratuitement en texte, puis débloque la voix, la mémoire et plus d’interactions avec les plans payants.",
    billingNote: "Prix en USD, facturation mensuelle. Tu peux annuler à tout moment.",
    planLabelFree: "Plan Découverte",
    planLabelPlus: "Plan Voix Premium",
    planLabelUltimate: "Plan Illimité",
    planBadgePopular: "Le plus populaire",
    planBadgeBest: "Meilleure expérience",
    planCtaChoose: "Choisir ce forfait",
    planCtaStart: "Commencer gratuitement",
    planFreePrice: "0 $",
    planFreePriceSub: "pour toujours",
    planPlusPrice: "19,99 $",
    planPlusPriceSub: "par mois",
    planUltimatePrice: "39,99 $",
    planUltimatePriceSub: "par mois",
    freeMessages: "20 messages / jour (texte seulement)",
    freeVoice: "Aucune voix (texte uniquement)",
    freeMemory: "Aucune mémoire : chaque session repart de zéro",
    freeAis: "1 AmorIA personnalisée (texte)",
    freeExtras: [
      "FR / EN / ES en texte",
      "Idéal pour tester l’ambiance avant de t’abonner",
      "Aucun moyen de paiement requis pour commencer",
    ],
    plusMessages: "Jusqu’à 600 interactions / mois (texte + voix)",
    plusVoice: "Voix AmoriA débloquée (FR / EN / ES)",
    plusMemory: "Mémoire des conversations récentes avec ton AmorIA",
    plusAis: "Jusqu’à 3 AmorIA différentes dans ton compte",
    plusExtras: [
      "Accès prioritaire aux nouveautés (voix, émotions, journal)",
      "Paramètres plus fins de personnalité pour tes AmorIA",
      "Support standard par courriel",
    ],
    ultimateMessages: "Messages texte illimités",
    ultimateVoice: "Voix illimitée (usage personnel raisonnable)",
    ultimateMemory: "Mémoire étendue pour chaque AmorIA",
    ultimateAis: "Jusqu’à 10 AmorIA dans ton compte",
    ultimateExtras: [
      "Accès en priorité aux nouvelles fonctionnalités",
      "Idéal si tu parles souvent à ton AmorIA chaque jour",
      "Support prioritaire par courriel",
    ],
    faqTitle: "Questions fréquentes",
    faqQ1: "Le plan gratuit est-il vraiment gratuit ?",
    faqA1:
      "Oui. Tu peux créer ton AmorIA, lui parler par texte (20 messages par jour) et tester l’ambiance sans carte de crédit. La voix et la mémoire sont réservées aux plans payants.",
    faqQ2: "Que se passe-t-il quand je change de langue ?",
    faqA2:
      "L’interface suit la langue que tu as choisie sur la page d’accueil. Ton AmorIA pourra parler et écrire en français, anglais ou espagnol selon tes préférences.",
    faqQ3: "Puis-je changer de forfait plus tard ?",
    faqA3:
      "Oui, tu peux passer du gratuit au Premium ou à l’Illimité, ou revenir à un plan inférieur. Le changement prendra effet à la période de facturation suivante.",
    footerCopy: "© 2025 AmoriA.app • Tarifs susceptibles d’être ajustés",
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my free account",
    titleKicker: "AMORIA.APP PRICING",
    title: "Start free. Upgrade to voice when it feels right.",
    subtitle:
      "Try your AmorIA in text for free, then unlock voice, memory and more interactions with the paid plans.",
    billingNote: "Prices in USD, billed monthly. You can cancel anytime.",
    planLabelFree: "Discovery plan",
    planLabelPlus: "Voice Premium plan",
    planLabelUltimate: "Unlimited plan",
    planBadgePopular: "Most popular",
    planBadgeBest: "Best experience",
    planCtaChoose: "Choose this plan",
    planCtaStart: "Start for free",
    planFreePrice: "$0",
    planFreePriceSub: "forever",
    planPlusPrice: "$19.99",
    planPlusPriceSub: "per month",
    planUltimatePrice: "$39.99",
    planUltimatePriceSub: "per month",
    freeMessages: "20 messages / day (text only)",
    freeVoice: "No voice (text only)",
    freeMemory: "No memory: each session starts fresh",
    freeAis: "1 custom AmorIA (text)",
    freeExtras: [
      "FR / EN / ES in text",
      "Perfect to test the vibe before subscribing",
      "No payment method required to start",
    ],
    plusMessages: "Up to 600 interactions / month (text + voice)",
    plusVoice: "AmoriA voice unlocked (FR / EN / ES)",
    plusMemory: "Conversation memory for your AmorIA",
    plusAis: "Up to 3 different AmorIAs in your account",
    plusExtras: [
      "Priority access to new features (voice, journaling, emotions)",
      "More detailed personality settings for your AmorIA",
      "Standard email support",
    ],
    ultimateMessages: "Unlimited text messages",
    ultimateVoice: "Unlimited voice (fair personal use)",
    ultimateMemory: "Extended memory for each AmorIA",
    ultimateAis: "Up to 10 AmorIAs in your account",
    ultimateExtras: [
      "Top priority for upcoming features",
      "Ideal if you talk to your AmorIA every day",
      "Priority email support",
    ],
    faqTitle: "Frequently asked questions",
    faqQ1: "Is the free plan really free?",
    faqA1:
      "Yes. You can create your AmorIA, talk by text (20 messages per day) and feel the experience without any credit card. Voice and memory are reserved for paid plans.",
    faqQ2: "What happens when I change language?",
    faqA2:
      "The interface follows the language you selected on the homepage. Your AmorIA can speak and write in French, English or Spanish depending on your preferences.",
    faqQ3: "Can I change plans later?",
    faqA3:
      "Yes, you can move from Free to Premium or Unlimited, or downgrade to a lower plan. Changes take effect on the next billing period.",
    footerCopy: "© 2025 AmoriA.app • Prices subject to change",
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta gratuita",
    titleKicker: "PRECIOS DE AMORIA.APP",
    title: "Empieza gratis. Pasa a voz cuando te sientas listx.",
    subtitle:
      "Prueba tu AmorIA por texto de forma gratuita y luego desbloquea voz, memoria y más interacciones con los planes de pago.",
    billingNote: "Precios en USD, facturación mensual. Puedes cancelar cuando quieras.",
    planLabelFree: "Plan Descubrimiento",
    planLabelPlus: "Plan Voz Premium",
    planLabelUltimate: "Plan Ilimitado",
    planBadgePopular: "El más popular",
    planBadgeBest: "Mejor experiencia",
    planCtaChoose: "Elegir este plan",
    planCtaStart: "Empezar gratis",
    planFreePrice: "0 US$",
    planFreePriceSub: "para siempre",
    planPlusPrice: "19,99 US$",
    planPlusPriceSub: "al mes",
    planUltimatePrice: "39,99 US$",
    planUltimatePriceSub: "al mes",
    freeMessages: "20 mensajes / día (solo texto)",
    freeVoice: "Sin voz (solo texto)",
    freeMemory: "Sin memoria: cada sesión empieza desde cero",
    freeAis: "1 AmorIA personalizada (texto)",
    freeExtras: [
      "FR / EN / ES por texto",
      "Ideal para probar la experiencia antes de suscribirte",
      "No necesitas tarjeta para empezar",
    ],
    plusMessages: "Hasta 600 interacciones / mes (texto + voz)",
    plusVoice: "Voz de AmoriA desbloqueada (FR / EN / ES)",
    plusMemory: "Memoria de conversación para tu AmorIA",
    plusAis: "Hasta 3 AmorIA diferentes en tu cuenta",
    plusExtras: [
      "Acceso prioritario a nuevas funciones (voz, diario, emociones)",
      "Ajustes más finos de personalidad para tu AmorIA",
      "Soporte estándar por correo",
    ],
    ultimateMessages: "Mensajes de texto ilimitados",
    ultimateVoice: "Voz ilimitada (uso personal razonable)",
    ultimateMemory: "Memoria ampliada para cada AmorIA",
    ultimateAis: "Hasta 10 AmorIA en tu cuenta",
    ultimateExtras: [
      "Acceso prioritario a todas las novedades",
      "Ideal si hablas con tu AmorIA todos los días",
      "Soporte prioritario por correo",
    ],
    faqTitle: "Preguntas frecuentes",
    faqQ1: "¿El plan gratuito es realmente gratuito?",
    faqA1:
      "Sí. Puedes crear tu AmorIA, hablar por texto (20 mensajes al día) y sentir la experiencia sin tarjeta. La voz y la memoria se reservan para los planes de pago.",
    faqQ2: "¿Qué pasa cuando cambio de idioma?",
    faqA2:
      "La interfaz sigue el idioma que elegiste en la página principal. Tu AmorIA puede hablar y escribir en francés, inglés o español según tus preferencias.",
    faqQ3: "¿Puedo cambiar de plan más adelante?",
    faqA3:
      "Sí, puedes pasar de Gratis a Premium o Ilimitado, o bajar a un plan inferior. El cambio se aplica en el siguiente período de facturación.",
    footerCopy: "© 2025 AmoriA.app • Precios sujetos a cambios",
  },
};

export default function PricingPage() {
  const searchParams = useSearchParams();
  const langParam = (searchParams.get("lang") || "fr") as Locale;
  const locale: Locale = ["fr", "en", "es"].includes(langParam)
    ? langParam
    : "fr";

  const t = STRINGS[locale];

  const plans: Plan[] = [
    {
      id: "free",
      name: t.planLabelFree,
      price: t.planFreePrice,
      priceSub: t.planFreePriceSub,
      cta: t.planCtaStart,
      messages: t.freeMessages,
      voice: t.freeVoice,
      memory: t.freeMemory,
      ais: t.freeAis,
      extras: t.freeExtras,
    },
    {
      id: "plus",
      name: t.planLabelPlus,
      price: t.planPlusPrice,
      priceSub: t.planPlusPriceSub,
      badge: t.planBadgePopular,
      highlight: true,
      cta: t.planCtaChoose,
      messages: t.plusMessages,
      voice: t.plusVoice,
      memory: t.plusMemory,
      ais: t.plusAis,
      extras: t.plusExtras,
    },
    {
      id: "ultimate",
      name: t.planLabelUltimate,
      price: t.planUltimatePrice,
      priceSub: t.planUltimatePriceSub,
      badge: t.planBadgeBest,
      cta: t.planCtaChoose,
      messages: t.ultimateMessages,
      voice: t.ultimateVoice,
      memory: t.ultimateMemory,
      ais: t.ultimateAis,
      extras: t.ultimateExtras,
    },
  ];

  const buildUrl = (path: string) => {
    const prefix = path.startsWith("/") ? path : `/${path}`;
    return `${prefix}?lang=${locale}`;
  };

  return (
    <main className="amoria-root">
      {/* HEADER (même style que la vitrine, sans bouton de langue) */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <div className="amoria-logo-mark">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmorIA.app logo"
              className="amoria-logo-img"
            />
          </div>

          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmoriA.app</div>
            <div className="amoria-logo-tagline">{t.brandTagline}</div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={buildUrl("")} className="amoria-nav-link">
            {t.nav.home}
          </a>
          <a href={buildUrl("#features")} className="amoria-nav-link">
            {t.nav.features}
          </a>
          <a href={buildUrl("pricing")} className="amoria-nav-link amoria-nav-link--active">
            {t.nav.pricing}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <a
            href={buildUrl("login")}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {t.navLogin}
          </a>

          <a
            href={buildUrl("signup")}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {t.navSignup}
          </a>
        </div>
      </header>

      {/* PRICING HERO */}
      <section className="amoria-pricing-hero">
        <p className="amoria-hero-kicker">{t.titleKicker}</p>
        <h1 className="amoria-pricing-title">{t.title}</h1>
        <p className="amoria-pricing-subtitle">{t.subtitle}</p>
        <p className="amoria-pricing-note">{t.billingNote}</p>
      </section>

      {/* PLANS GRID */}
      <section className="amoria-pricing-section">
        <div className="amoria-plan-grid">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={
                "amoria-plan-card" +
                (plan.highlight ? " amoria-plan-card--highlight" : "")
              }
            >
              {plan.badge && (
                <div className="amoria-plan-badge">{plan.badge}</div>
              )}

              <h2 className="amoria-plan-name">{plan.name}</h2>

              <div className="amoria-plan-price-row">
                <span className="amoria-plan-price">{plan.price}</span>
                <span className="amoria-plan-price-sub">
                  {plan.priceSub}
                </span>
              </div>

              <ul className="amoria-plan-main-list">
                <li>{plan.messages}</li>
                <li>{plan.voice}</li>
                <li>{plan.memory}</li>
                <li>{plan.ais}</li>
              </ul>

              <ul className="amoria-plan-extra-list">
                {plan.extras.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <a
                href={buildUrl(`signup?plan=${plan.id}`)}
                className={
                  "amoria-btn amoria-btn--full " +
                  (plan.highlight
                    ? "amoria-btn--primary"
                    : "amoria-btn--ghost")
                }
              >
                {plan.id === "free" ? t.planCtaStart : t.planCtaChoose}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ SIMPLIFIÉE */}
      <section className="amoria-faq-section">
        <h2 className="amoria-section-title">{t.faqTitle}</h2>
        <div className="amoria-faq-grid">
          <div className="amoria-faq-item">
            <h3>{t.faqQ1}</h3>
            <p>{t.faqA1}</p>
          </div>
          <div className="amoria-faq-item">
            <h3>{t.faqQ2}</h3>
            <p>{t.faqA2}</p>
          </div>
          <div className="amoria-faq-item">
            <h3>{t.faqQ3}</h3>
            <p>{t.faqA3}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="amoria-footer">
        <span>{t.footerCopy}</span>
      </footer>

      {/* STYLES */}
      <style jsx global>{`
        :root {
          --amoria-bg: #020617;
          --amoria-bg-elevated: #02081f;
          --amoria-border-subtle: rgba(148, 163, 184, 0.35);
          --amoria-text-main: #e5e7eb;
          --amoria-text-muted: #9ca3af;
          --amoria-accent: #fb37ff;
          --amoria-accent-2: #ff6b9c;
          --amoria-accent-soft: rgba(251, 55, 255, 0.12);
        }

        body {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          background: radial-gradient(
            circle at top,
            #020617 0,
            #020617 40%,
            #000 100%
          );
          color: var(--amoria-text-main);
        }

        .amoria-root {
          min-height: 100vh;
          background: radial-gradient(
            circle at top left,
            #111827 0,
            #020617 55%,
            #000 100%
          );
          color: var(--amoria-text-main);
          padding-bottom: 3rem;
        }

        /* HEADER */
        .amoria-header {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(16px);
          background: linear-gradient(
            to bottom,
            rgba(15, 23, 42, 0.92),
            rgba(15, 23, 42, 0.75),
            transparent
          );
        }

        .amoria-header-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .amoria-logo-mark {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 0, #fde68a, #f97316);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-logo-img {
          width: 110%;
          height: 110%;
          object-fit: contain;
        }

        .amoria-logo-text {
          display: flex;
          flex-direction: column;
        }

        .amoria-logo-title {
          font-weight: 600;
          font-size: 0.96rem;
        }

        .amoria-logo-tagline {
          font-size: 0.72rem;
          color: var(--amoria-text-muted);
        }

        .amoria-nav {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .amoria-nav-link {
          font-size: 0.82rem;
          color: var(--amoria-text-muted);
          text-decoration: none;
          padding-bottom: 0.1rem;
          border-bottom: 1px solid transparent;
        }

        .amoria-nav-link:hover {
          color: #f9fafb;
          border-color: rgba(148, 163, 184, 0.7);
        }

        .amoria-nav-link--active {
          color: #f9fafb;
          border-color: rgba(251, 55, 255, 0.8);
        }

        .amoria-nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .amoria-nav-btn {
          border-radius: 999px;
          padding: 0.4rem 0.9rem;
          font-size: 0.78rem;
          border: 1px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-nav-btn--primary {
          background: linear-gradient(
            135deg,
            var(--amoria-accent),
            var(--amoria-accent-2)
          );
          color: #f9fafb;
        }

        .amoria-nav-btn--ghost {
          background: transparent;
          border-color: rgba(148, 163, 184, 0.5);
          color: var(--amoria-text-main);
        }

        /* PRICING HERO */
        .amoria-pricing-hero {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 1.75rem;
        }

        .amoria-hero-kicker {
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a5b4fc;
        }

        .amoria-pricing-title {
          margin-top: 0.5rem;
          font-size: clamp(1.9rem, 3vw, 2.3rem);
          line-height: 1.15;
          font-weight: 700;
        }

        .amoria-pricing-subtitle {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          max-width: 34rem;
        }

        .amoria-pricing-note {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        /* PLAN GRID */
        .amoria-pricing-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-plan-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.4rem;
        }

        .amoria-plan-card {
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border-radius: 1.2rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 1rem 1rem 1.2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.8);
        }

        .amoria-plan-card--highlight {
          border-color: var(--amoria-accent);
          box-shadow: 0 24px 60px rgba(251, 55, 255, 0.35);
          transform: translateY(-4px);
        }

        .amoria-plan-badge {
          position: absolute;
          top: 0.85rem;
          right: 1rem;
          font-size: 0.7rem;
          padding: 0.15rem 0.6rem;
          border-radius: 999px;
          background: var(--amoria-accent-soft);
          color: #f9fafb;
          border: 1px solid rgba(251, 55, 255, 0.7);
        }

        .amoria-plan-name {
          font-size: 1rem;
          margin-bottom: 0.4rem;
        }

        .amoria-plan-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: 0.6rem;
        }

        .amoria-plan-price {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .amoria-plan-price-sub {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        .amoria-plan-main-list,
        .amoria-plan-extra-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .amoria-plan-main-list li {
          font-size: 0.82rem;
          margin-bottom: 0.35rem;
        }

        .amoria-plan-extra-list {
          margin-top: 0.6rem;
          margin-bottom: 0.9rem;
        }

        .amoria-plan-extra-list li {
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          margin-bottom: 0.3rem;
        }

        /* BUTTONS */
        .amoria-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          font-size: 0.86rem;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.7rem 1.2rem;
        }

        .amoria-btn--primary {
          background: linear-gradient(
            135deg,
            var(--amoria-accent),
            var(--amoria-accent-2)
          );
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-btn--ghost {
          border-color: rgba(148, 163, 184, 0.45);
          background: rgba(15, 23, 42, 0.9);
          color: var(--amoria-text-main);
        }

        .amoria-btn--full {
          width: 100%;
        }

        /* FAQ */
        .amoria-faq-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-section-title {
          font-size: 1.25rem;
          margin-bottom: 0.8rem;
        }

        .amoria-faq-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.2rem;
        }

        .amoria-faq-item h3 {
          font-size: 0.95rem;
          margin-bottom: 0.3rem;
        }

        .amoria-faq-item p {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
          line-height: 1.5;
        }

        /* FOOTER */
        .amoria-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          text-align: center;
        }

        /* RESPONSIVE */
        @media (max-width: 960px) {
          .amoria-header {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.6rem 1rem;
          }

          .amoria-nav {
            display: none;
          }

          .amoria-pricing-hero {
            padding-inline: 1rem;
          }

          .amoria-pricing-section {
            padding-inline: 1rem;
          }

          .amoria-plan-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-faq-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 640px) {
          .amoria-header {
            padding-inline: 1rem;
          }

          .amoria-footer {
            padding-inline: 1rem;
          }

          .amoria-nav-right a.amoria-nav-btn--ghost {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
