"use client";

import React, { useState } from "react";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    brandTagline: string;
    nav: { home: string; features: string; pricing: string };
    navLogin: string;
    navSignup: string;
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    note: string;
    tiers: {
      id: string;
      name: string;
      price: string;
      period: string;
      highlight?: boolean;
      description: string;
      bullets: string[];
      cta: string;
      bestFor: string;
    }[];
    faqTitle: string;
    faq: { q: string; a: string }[];
    footerCopy: string;
  }
> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    heroBadge: "Tarifs AmorIA",
    heroTitle: "Des tarifs simples, pensés pour jaser avec ton AmorIA.",
    heroSubtitle:
      "Commence gratuitement en texte, puis passe à l’abonnement voix seulement si tu en as vraiment envie. Aucun engagement, tu peux annuler en tout temps.",
    note: "La version gratuite est parfaite pour tester l’expérience. L’abonnement ajoute la voix (parler avec ton AmorIA) et plus d’interactions chaque mois.",
    tiers: [
      {
        id: "free",
        name: "Gratuit – Découverte",
        price: "0 $",
        period: "/mois",
        description: "Idéal pour tester AmorIA tranquillement, sans carte de crédit.",
        bullets: [
          "Création d’un compte AmorIA gratuite",
          "Messages texte avec un quota mensuel limité",
          "Accès aux 4 personnalités d’IA (féminine, masculine, androgyne, 50+)",
          "Sauvegarde de base de tes conversations",
        ],
        cta: "Créer mon compte gratuit",
        bestFor: "Pour essayer sans pression.",
      },
      {
        id: "plus",
        name: "Voix & émotions",
        price: "X,99 $",
        period: "/mois",
        highlight: true,
        description:
          "Parfait si tu veux vraiment parler avec ton AmorIA, comme avec un ami disponible 24/7.",
        bullets: [
          "Tout ce qui est inclus dans la version gratuite",
          "Conversations vocales avec ton AmorIA (voix)",
          "Plus de messages texte chaque mois",
          "Priorité pour les futures mises à jour & nouvelles personnalités",
        ],
        cta: "Passer à la voix",
        bestFor: "Pour celles et ceux qui veulent une vraie présence vocale.",
      },
      {
        id: "pro",
        name: "Intensif",
        price: "Y,99 $",
        period: "/mois",
        description:
          "Pour les personnes qui écrivent ou parlent à leur AmorIA tous les jours.",
        bullets: [
          "Tout ce qui est inclus dans Voix & émotions",
          "Quota encore plus élevé en texte + voix",
          "Support prioritaire",
          "Pensé pour un usage quotidien intensif",
        ],
        cta: "Choisir Intensif",
        bestFor: "Pour un lien régulier, presque tous les jours.",
      },
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Est-ce que je peux commencer gratuitement ?",
        a: "Oui. Tu peux créer ton compte, choisir ton AmorIA et commencer à échanger par texte sans rien payer. Tu upgraderas seulement si tu veux la voix ou plus d’échanges.",
      },
      {
        q: "Puis-je annuler mon abonnement ?",
        a: "Oui, tu peux annuler en tout temps. L’accès à ton compte et à ton AmorIA reste actif jusqu’à la fin de la période déjà payée.",
      },
      {
        q: "La voix est-elle disponible dans les 3 langues ?",
        a: "L’objectif est de proposer l’expérience en français, anglais et espagnol. Selon la version, certaines voix peuvent arriver progressivement, mais ton interface reste disponible dans les 3 langues.",
      },
    ],
    footerCopy: "© 2025 AmoriA.app",
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my free account",
    heroBadge: "AmorIA Pricing",
    heroTitle: "Simple plans to talk with your AmorIA.",
    heroSubtitle:
      "Start free with text messages, then upgrade to voice only if it really helps you. No commitment, cancel anytime.",
    note: "The free plan is perfect to try the experience. Paid plans unlock voice and more monthly interactions.",
    tiers: [
      {
        id: "free",
        name: "Free – Discovery",
        price: "$0",
        period: "/month",
        description: "Ideal to try AmorIA slowly, with no credit card.",
        bullets: [
          "Free AmorIA account",
          "Limited monthly text messages",
          "Access to the 4 AI personalities",
          "Basic conversation history",
        ],
        cta: "Create my free account",
        bestFor: "To try without pressure.",
      },
      {
        id: "plus",
        name: "Voice & emotions",
        price: "$X.99",
        period: "/month",
        highlight: true,
        description:
          "Perfect if you truly want to talk with your AmorIA, like a friend available 24/7.",
        bullets: [
          "Everything in Free",
          "Voice conversations with your AmorIA",
          "More monthly text messages",
          "Priority for future updates & new personalities",
        ],
        cta: "Upgrade to voice",
        bestFor: "For those who want a vocal presence.",
      },
      {
        id: "pro",
        name: "Intensive",
        price: "$Y.99",
        period: "/month",
        description: "For people who text or talk to AmorIA almost every day.",
        bullets: [
          "Everything in Voice & emotions",
          "Even higher text + voice quota",
          "Priority support",
          "Designed for daily, intensive use",
        ],
        cta: "Choose Intensive",
        bestFor: "For a regular, almost daily bond.",
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "Can I start for free?",
        a: "Yes. You can create your account, pick an AmorIA and start texting for free. You only upgrade if you want voice or more interactions.",
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes. You can cancel anytime. You keep access to your AmorIA until the end of your current billing period.",
      },
      {
        q: "Is voice available in all 3 languages?",
        a: "The goal is to provide the experience in French, English and Spanish. Depending on the version, some voices may arrive progressively, but the interface stays available in all 3.",
      },
    ],
    footerCopy: "© 2025 AmoriA.app",
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta gratuita",
    heroBadge: "Precios de AmorIA",
    heroTitle: "Planes simples para hablar con tu AmorIA.",
    heroSubtitle:
      "Empieza gratis con mensajes de texto y pasa a la voz solo si de verdad te ayuda. Sin compromiso, puedes cancelar cuando quieras.",
    note: "El plan gratuito es perfecto para probar. Los planes de pago desbloquean la voz y más interacciones mensuales.",
    tiers: [
      {
        id: "free",
        name: "Gratis – Descubrimiento",
        price: "0 $",
        period: "/mes",
        description:
          "Ideal para probar AmorIA con calma, sin tarjeta de crédito.",
        bullets: [
          "Cuenta AmorIA gratuita",
          "Mensajes de texto mensuales limitados",
          "Acceso a las 4 personalidades de IA",
          "Historial básico de conversaciones",
        ],
        cta: "Crear mi cuenta gratuita",
        bestFor: "Para probar sin presión.",
      },
      {
        id: "plus",
        name: "Voz & emociones",
        price: "X,99 $",
        period: "/mes",
        highlight: true,
        description:
          "Perfecto si quieres hablar realmente con tu AmorIA, como con un amigo disponible 24/7.",
        bullets: [
          "Todo lo incluido en Gratis",
          "Conversaciones de voz con tu AmorIA",
          "Más mensajes de texto al mes",
          "Prioridad en futuras actualizaciones y nuevas personalidades",
        ],
        cta: "Pasar a voz",
        bestFor: "Para quienes quieren una presencia vocal real.",
      },
      {
        id: "pro",
        name: "Intensivo",
        price: "Y,99 $",
        period: "/mes",
        description:
          "Para personas que escriben o hablan con su AmorIA casi todos los días.",
        bullets: [
          "Todo lo incluido en Voz & emociones",
          "Cuota aún mayor de texto + voz",
          "Soporte prioritario",
          "Pensado para un uso diario intensivo",
        ],
        cta: "Elegir Intensivo",
        bestFor: "Para un vínculo casi diario.",
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        q: "¿Puedo empezar gratis?",
        a: "Sí. Puedes crear tu cuenta, elegir tu AmorIA y empezar a chatear por texto gratis. Solo pasas al plan de pago si quieres voz o más interacciones.",
      },
      {
        q: "¿Puedo cancelar mi suscripción?",
        a: "Sí. Puedes cancelar cuando quieras. Mantienes el acceso a tu AmorIA hasta el final del período ya pagado.",
      },
      {
        q: "¿La voz está disponible en los 3 idiomas?",
        a: "El objetivo es ofrecer la experiencia en francés, inglés y español. Algunas voces pueden llegar progresivamente, pero la interfaz queda disponible en los 3 idiomas.",
      },
    ],
    footerCopy: "© 2025 AmoriA.app",
  },
};

export default function PricingPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = STRINGS[locale];

  return (
    <main className="amoria-root">
      {/* HEADER */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <div className="amoria-logo-mark">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIA.app"
              className="amoria-logo-img"
            />
          </div>
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmoriA.app</div>
            <div className="amoria-logo-tagline">{t.brandTagline}</div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href="/" className="amoria-nav-link">
            {t.nav.home}
          </a>
          <a href="/#features" className="amoria-nav-link">
            {t.nav.features}
          </a>
          <a href="/pricing" className="amoria-nav-link amoria-nav-link--active">
            {t.nav.pricing}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <div className="amoria-lang-switch">
            {(["fr", "en", "es"] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={
                  "amoria-lang-pill" +
                  (locale === code ? " amoria-lang-pill--active" : "")
                }
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href="/login"
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {t.navLogin}
          </a>
          <a
            href="/signup"
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {t.navSignup}
          </a>
        </div>
      </header>

      {/* HERO / INTRO */}
      <section className="amoria-section amoria-section--hero">
        <div className="amoria-pricing-hero">
          <span className="amoria-pill">{t.heroBadge}</span>
          <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
          <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>
          <p className="amoria-pricing-note">{t.note}</p>
        </div>
      </section>

      {/* TIERS */}
      <section className="amoria-section amoria-section--pricing">
        <div className="amoria-pricing-grid">
          {t.tiers.map((tier) => (
            <article
              key={tier.id}
              className={
                "amoria-tier-card" +
                (tier.highlight ? " amoria-tier-card--highlight" : "")
              }
            >
              {tier.highlight && (
                <div className="amoria-tier-badge">
                  {locale === "fr"
                    ? "Le plus populaire"
                    : locale === "en"
                    ? "Most popular"
                    : "Más elegido"}
                </div>
              )}
              <h2 className="amoria-tier-name">{tier.name}</h2>
              <p className="amoria-tier-price">
                <span className="amoria-tier-price-main">{tier.price}</span>
                <span className="amoria-tier-price-period">{tier.period}</span>
              </p>
              <p className="amoria-tier-description">{tier.description}</p>

              <ul className="amoria-tier-list">
                {tier.bullets.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <a
                href="/signup"
                className="amoria-btn amoria-btn--primary amoria-btn--full"
              >
                {tier.cta}
              </a>

              <p className="amoria-tier-bestfor">{tier.bestFor}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="amoria-section amoria-section--faq">
        <h2 className="amoria-section-title">{t.faqTitle}</h2>
        <div className="amoria-faq-grid">
          {t.faq.map((item, idx) => (
            <div key={idx} className="amoria-faq-item">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="amoria-footer">
        <span>{t.footerCopy}</span>
      </footer>

      {/* STYLES (on reprend le même style que la home pour que ça match) */}
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
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Helvetica Neue", Arial, sans-serif;
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%);
          color: var(--amoria-text-main);
        }

        .amoria-root {
          min-height: 100vh;
          background: radial-gradient(circle at top left, #111827 0, #020617 55%, #000 100%);
          color: var(--amoria-text-main);
          padding-bottom: 3rem;
        }

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
          border-color: rgba(248, 113, 181, 0.9);
        }

        .amoria-nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .amoria-lang-switch {
          display: flex;
          gap: 0.25rem;
          background: rgba(15, 23, 42, 0.9);
          padding: 0.18rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.4);
        }

        .amoria-lang-pill {
          border-radius: 999px;
          border: none;
          padding: 0.15rem 0.48rem;
          font-size: 0.72rem;
          background: transparent;
          color: var(--amoria-text-muted);
          cursor: pointer;
        }

        .amoria-lang-pill--active {
          background: #0f172a;
          color: #f9fafb;
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

        .amoria-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-section--hero {
          padding-top: 1.5rem;
        }

        .amoria-pricing-hero {
          max-width: 640px;
        }

        .amoria-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.5);
          font-size: 0.75rem;
          color: var(--amoria-text-muted);
          margin-bottom: 0.7rem;
          background: rgba(15, 23, 42, 0.85);
        }

        .amoria-pricing-title {
          font-size: clamp(1.8rem, 3vw, 2.2rem);
          margin-bottom: 0.5rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.94rem;
          color: var(--amoria-text-muted);
          line-height: 1.6;
          margin-bottom: 0.6rem;
        }

        .amoria-pricing-note {
          font-size: 0.85rem;
          color: #e5e7eb;
        }

        .amoria-section--pricing {
          text-align: left;
        }

        .amoria-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.3rem;
        }

        .amoria-tier-card {
          background: radial-gradient(circle at top, #020617, #020617 50%, #000 100%);
          border-radius: 1.3rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 1.1rem 1.1rem 1.3rem;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .amoria-tier-card--highlight {
          border-color: rgba(251, 113, 133, 0.9);
          box-shadow: 0 18px 45px rgba(248, 113, 113, 0.35);
        }

        .amoria-tier-badge {
          position: absolute;
          top: 0.9rem;
          right: 1rem;
          font-size: 0.7rem;
          padding: 0.18rem 0.55rem;
          border-radius: 999px;
          background: linear-gradient(
            135deg,
            var(--amoria-accent),
            var(--amoria-accent-2)
          );
          color: #f9fafb;
        }

        .amoria-tier-name {
          font-size: 1rem;
          margin-right: 4rem;
        }

        .amoria-tier-price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .amoria-tier-price-main {
          font-size: 1.4rem;
          font-weight: 700;
        }

        .amoria-tier-price-period {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        .amoria-tier-description {
          font-size: 0.85rem;
          color: var(--amoria-text-muted);
        }

        .amoria-tier-list {
          list-style: none;
          padding-left: 0;
          margin: 0.4rem 0 0.8rem;
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        .amoria-tier-list li {
          margin-bottom: 0.3rem;
          position: relative;
          padding-left: 1.1rem;
        }

        .amoria-tier-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          top: 0;
          color: #a5b4fc;
        }

        .amoria-tier-bestfor {
          margin-top: 0.6rem;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
        }

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
        }

        .amoria-btn--primary {
          padding: 0.7rem 1.3rem;
          background: linear-gradient(
            135deg,
            var(--amoria-accent),
            var(--amoria-accent-2)
          );
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-btn--full {
          width: 100%;
        }

        .amoria-section--faq .amoria-section-title {
          margin-bottom: 0.8rem;
        }

        .amoria-faq-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.2rem;
        }

        .amoria-faq-item {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 1rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 0.9rem 1rem;
          font-size: 0.82rem;
        }

        .amoria-faq-item h3 {
          margin-top: 0;
          margin-bottom: 0.4rem;
          font-size: 0.9rem;
        }

        .amoria-faq-item p {
          margin: 0;
          color: var(--amoria-text-muted);
        }

        .amoria-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          text-align: center;
        }

        @media (max-width: 960px) {
          .amoria-header {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.6rem 1rem;
          }

          .amoria-nav {
            display: none;
          }

          .amoria-pricing-grid {
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

          .amoria-section {
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
