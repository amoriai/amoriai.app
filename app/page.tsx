"use client";

import React, { useState, useEffect } from "react";

type Locale = "fr" | "en" | "es";
type PersonaId = "lyra" | "orion" | "kai" | "maelis";

type Persona = {
  id: PersonaId;
  title: string;
  description: string;
};

const STRINGS: Record<
  Locale,
  {
    brandTagline: string;
    nav: { home: string; features: string; pricing: string };
    navLogin: string;
    navSignup: string;
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    heroPrimary: string;
    heroSupport: string;
    langNote: string;
    personasTitle: string;
    personasSubtitle: string;
    personas: Persona[];
    choosePersona: string;
    pricingTitle: string;
    pricingText: string;
    pricingCta: string;
    videoCaption: string;
    footerCopy: string;
    footerLinks: {
      legal: string;
      privacy: string;
      terms: string;
      contact: string;
      about: string;
    };
  }
> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    heroKicker: "BIENVENUE SUR AMORIAI.APP",
    heroTitle: "Une présence bienveillante pour parler, réfléchir et avancer.",
    heroSubtitle:
      "AmorIAI est une présence douce, disponible 24/7 pour discuter, réfléchir avec vous, poser les bonnes questions et vous aider à mieux comprendre vos émotions.",
    heroPrimary: "Créer mon compte gratuit",
    heroSupport:
      "Optimisée pour les échanges profonds, les journaux émotionnels et le coaching doux du quotidien.",
    langNote: "AmorIAI vous accueille en français, anglais ou espagnol.",
    personasTitle: "Commence gratuitement avec AmorIAI (en texte)",
    personasSubtitle:
      "Crée ton compte gratuitement et commence à texter avec l’IA de ton choix. La voix (parler avec ton AmorIAI) est disponible uniquement avec l’abonnement payant.",
    personas: [
      {
        id: "lyra",
        title: "Lyra – AmorIAI féminine",
        description:
          "Une présence douce, empathique et rassurante, idéale pour déposer tes émotions par écrit.",
      },
      {
        id: "orion",
        title: "Orion – AmorIAI masculine",
        description:
          "Énergie stable, protectrice et structurée, pour t’aider à réfléchir et à prendre des décisions.",
      },
      {
        id: "kai",
        title: "Kai – AmorIAI androgyne",
        description:
          "Présence fluide et inclusive, ni vraiment homme ni femme, centrée sur l’écoute et la nuance.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIAI 50+ féminine",
        description:
          "Figure plus mature et expérimentée, avec une énergie de mentor bienveillant et réaliste.",
      },
    ],
    choosePersona: "Créer mon compte gratuit",
    pricingTitle: "Des tarifs simples & transparents",
    pricingText:
      "La version gratuite te permet de texter ton AmorIAI avec un nombre limité de messages. Avec la version payante, tu déverrouilles les conversations vocales (parler) et plus d’interactions.",
    pricingCta: "Découvrir les abonnements",
    videoCaption: "AmorIAI est disponible en français, anglais et espagnol.",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: {
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      terms: "Conditions d’utilisation",
      contact: "Contact",
      about: "À propos",
    },
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my free account",
    heroKicker: "WELCOME TO AMORIAI.APP",
    heroTitle: "Your caring & multilingual AI partner.",
    heroSubtitle:
      "AmorIAI is a gentle 24/7 presence to talk with, reflect with, ask better questions and help you understand your emotions.",
    heroPrimary: "Create my free account",
    heroSupport:
      "Designed for deep conversations, emotional journaling and soft everyday coaching.",
    langNote: "AmorIAI is available in French, English and Spanish.",
    personasTitle: "Start for free with AmorIAI (text only)",
    personasSubtitle:
      "Create your free account and start texting with the AI of your choice. Voice (talking to your AmorIAI) is only available with the paid subscription.",
    personas: [
      {
        id: "lyra",
        title: "Lyra – Feminine AmorIAI",
        description:
          "A gentle, empathetic and reassuring presence, perfect for writing down your emotions.",
      },
      {
        id: "orion",
        title: "Orion – Masculine AmorIAI",
        description:
          "Stable, protective and structured energy to help you think clearly and make decisions.",
      },
      {
        id: "kai",
        title: "Kai – Androgynous AmorIAI",
        description:
          "A fluid and inclusive presence, neither fully male nor female, focused on listening and nuance.",
      },
      {
        id: "maelis",
        title: "Maelis – 50+ Feminine AmorIAI",
        description:
          "A more mature, experienced figure with the energy of a caring and realistic mentor.",
      },
    ],
    choosePersona: "Create my free account",
    pricingTitle: "Simple & transparent pricing",
    pricingText:
      "The free version lets you text your AmorIAI with a limited number of messages. With the paid plan, you unlock voice conversations and more interactions.",
    pricingCta: "See plans & pricing",
    videoCaption: "AmorIAI is available in French, English and Spanish.",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: {
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms of use",
      contact: "Contact",
      about: "About",
    },
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta gratuita",
    heroKicker: "BIENVENIDx A AMORIAI.APP",
    heroTitle: "Tu compañerx de IA amable y multilingüe.",
    heroSubtitle:
      "AmorIAI es una presencia suave, disponible 24/7 para conversar contigo, reflexionar, hacer mejores preguntas y ayudarte a entender tus emociones.",
    heroPrimary: "Crear mi cuenta gratuita",
    heroSupport:
      "Pensada para conversaciones profundas, diarios emocionales y acompañamiento suave del día a día.",
    langNote: "AmorIAI te recibe en francés, inglés o español.",
    personasTitle: "Empieza gratis con AmorIAI (solo texto)",
    personasSubtitle:
      "Crea tu cuenta gratuita y empieza a chatear por texto con la IA que elijas. La voz (hablar con tu AmorIAI) está disponible solo con la suscripción de pago.",
    personas: [
      {
        id: "lyra",
        title: "Lyra – AmorIAI femenina",
        description:
          "Presencia dulce, empática y tranquilizadora, ideal para escribir tus emociones.",
      },
      {
        id: "orion",
        title: "Orion – AmorIAI masculina",
        description:
          "Energía estable, protectora y estructurada para ayudarte a pensar y tomar decisiones.",
      },
      {
        id: "kai",
        title: "Kai – AmorIAI andrógina",
        description:
          "Presencia fluida e inclusiva, ni totalmente hombre ni mujer, centrada en la escucha y el matiz.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIAI 50+ femenina",
        description:
          "Figura más madura y experimentada, con energía de mentora amable y realista.",
      },
    ],
    choosePersona: "Crear mi cuenta gratuita",
    pricingTitle: "Precios simples y transparentes",
    pricingText:
      "La versión gratuita te permite chatear por texto con tu AmorIAI con un número limitado de mensajes. Con la versión de pago desbloqueas conversaciones de voz y más interacciones.",
    pricingCta: "Ver planes y precios",
    videoCaption: "AmorIAI está disponible en francés, inglés y español.",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: {
      legal: "Aviso legal",
      privacy: "Política de privacidad",
      terms: "Términos de uso",
      contact: "Contacto",
      about: "Acerca de",
    },
  },
};

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "fr";

  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get("lang");
  if (fromParam === "fr" || fromParam === "en" || fromParam === "es") {
    return fromParam;
  }

  const navLang = navigator.language.toLowerCase();
  if (navLang.startsWith("fr")) return "fr";
  if (navLang.startsWith("es")) return "es";
  return "en";
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    const initial = detectInitialLocale();
    setLocale(initial);

    const params = new URLSearchParams(window.location.search);
    params.set("lang", initial);
    const newUrl = window.location.pathname + "?" + params.toString();
    window.history.replaceState(null, "", newUrl);
  }, []);

  const t = STRINGS[locale];

  const heroVideoSrc = `/amoria_${locale}.mp4`;
  const getPersonaVideoSrc = (id: PersonaId) =>
    `/amoria_${id}_${locale}.mp4`;

  const withLang = (path: string) => `${path}?lang=${locale}`;

  const handleLocaleChange = (code: Locale) => {
    setLocale(code);
    const params = new URLSearchParams(window.location.search);
    params.set("lang", code);
    const newUrl = window.location.pathname + "?" + params.toString();
    window.history.replaceState(null, "", newUrl);
  };

  return (
    <main className="amoria-root">
      {/* HEADER */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIAI.app"
            className="amoria-logo-full"
          />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmorIAI.app</div>
            <div className="amoria-logo-tagline">{t.brandTagline}</div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href="#hero" className="amoria-nav-link">
            {t.nav.home}
          </a>
          <a href={withLang("/features")} className="amoria-nav-link">
            {t.nav.features}
          </a>
          <a href={withLang("/pricing")} className="amoria-nav-link">
            {t.nav.pricing}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <div className="amoria-lang-switch">
            {(["fr", "en", "es"] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLocaleChange(code)}
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
            href={withLang("/login")}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {t.navLogin}
          </a>

          <a
            href={withLang("/signup")}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {t.navSignup}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="amoria-hero">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>

          <div className="amoria-hero-actions">
            <a
              href={withLang("/signup")}
              className="amoria-btn amoria-btn--primary amoria-btn--big"
            >
              {t.heroPrimary}
            </a>
          </div>

          <p className="amoria-hero-support">{t.heroSupport}</p>
          <p className="amoria-hero-note">{t.langNote}</p>
        </div>

        <div className="amoria-hero-right">
          <div className="amoria-video-frame">
            <video
              className="amoria-video"
              src={heroVideoSrc}
              controls
              playsInline
            />
          </div>
          <p className="amoria-video-caption">{t.videoCaption}</p>
        </div>
      </section>

      {/* PERSONAS / VITRINE */}
      <section id="features" className="amoria-section">
        <h2 className="amoria-section-title">{t.personasTitle}</h2>
        <p className="amoria-section-subtitle">{t.personasSubtitle}</p>

        <div className="amoria-card-grid">
          {t.personas.map((persona) => (
            <article key={persona.id} className="amoria-card">
              <div className="amoria-card-media">
                <video
                  className="amoria-card-video"
                  src={getPersonaVideoSrc(persona.id)}
                  controls
                  playsInline
                />
              </div>
              <div className="amoria-card-body">
                <h3 className="amoria-card-title">{persona.title}</h3>
                <p className="amoria-card-text">{persona.description}</p>
                <a
                  href={withLang("/signup")}
                  className="amoria-btn amoria-btn--ghost amoria-btn--full"
                >
                  {t.choosePersona}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section id="pricing" className="amoria-section amoria-section--pricing">
        <h2 className="amoria-section-title">{t.pricingTitle}</h2>
        <p className="amoria-section-text">{t.pricingText}</p>
        <a
          href={withLang("/pricing")}
          className="amoria-btn amoria-btn--primary amoria-btn--medium"
        >
          {t.pricingCta}
        </a>
      </section>

      {/* FOOTER */}
      <footer className="amoria-footer">
        <div className="amoria-footer-top">
          <span>{t.footerCopy}</span>
        </div>
        <div className="amoria-footer-links">
          <a href={withLang("/legal")} className="amoria-footer-link">
            {t.footerLinks.legal}
          </a>
          <a href={withLang("/legal/privacy")} className="amoria-footer-link">
            {t.footerLinks.privacy}
          </a>
          <a href={withLang("/legal/terms")} className="amoria-footer-link">
            {t.footerLinks.terms}
          </a>
          <a href={withLang("/contact")} className="amoria-footer-link">
            {t.footerLinks.contact}
          </a>
          <a href={withLang("/about")} className="amoria-footer-link">
            {t.footerLinks.about}
          </a>
        </div>
      </footer>

      {/* STYLES (inchangés) */}
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

        .amoria-logo-full {
          height: 36px;
          width: auto;
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

        .amoria-hero {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 2.5rem;
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
          gap: 2.5rem;
          align-items: center;
        }

        .amoria-hero-left {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .amoria-hero-kicker {
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a5b4fc;
        }

        .amoria-hero-title {
          font-size: clamp(1.9rem, 3vw, 2.3rem);
          line-height: 1.1;
          font-weight: 700;
        }

        .amoria-hero-subtitle {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--amoria-text-muted);
          max-width: 32rem;
        }

        .amoria-hero-actions {
          margin-top: 0.6rem;
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .amoria-hero-support {
          margin-top: 0.4rem;
          font-size: 0.82rem;
          color: var(--amoria-text-muted);
        }

        .amoria-hero-note {
          margin-top: 0.2rem;
          font-size: 0.8rem;
          color: #e5e7eb;
        }

        .amoria-hero-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }

        .amoria-video-frame {
          border-radius: 1.6rem;
          padding: 0.22rem;
          background: linear-gradient(135deg, #f97316, #fb37ff, #38bdf8);
          max-width: 340px;
          width: 100%;
        }

        .amoria-video {
          width: 100%;
          display: block;
          border-radius: 1.45rem;
          background: #020617;
        }

        .amoria-video-caption {
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

        .amoria-btn--ghost {
          padding: 0.7rem 1.2rem;
          border-color: rgba(148, 163, 184, 0.45);
          background: rgba(15, 23, 42, 0.9);
          color: var(--amoria-text-main);
        }

        .amoria-btn--full {
          width: 100%;
        }

        .amoria-btn--big {
          padding-inline: 1.9rem;
          padding-block: 0.85rem;
          font-size: 1rem;
        }

        .amoria-btn--medium {
          padding-inline: 1.4rem;
          padding-block: 0.7rem;
        }

        .amoria-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-section-title {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .amoria-section-subtitle {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          max-width: 40rem;
          margin-bottom: 1.4rem;
        }

        .amoria-section--pricing {
          text-align: center;
        }

        .amoria-section-text {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          max-width: 32rem;
          margin: 0 auto 1.3rem;
        }

        .amoria-card-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.2rem;
        }

        .amoria-card {
          background: radial-gradient(circle at top, #020617, #020617 40%, #000 100%);
          border-radius: 1.2rem;
          border: 1px solid var(--amoria-border-subtle);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        .amoria-card-media {
          width: 100%;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-bottom: 1px solid rgba(15, 23, 42, 0.9);
          background: #020617;
        }

        .amoria-card-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .amoria-card-body {
          padding: 0.9rem 0.95rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .amoria-card-title {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .amoria-card-text {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
          flex: 1;
        }

        .amoria-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          text-align: center;
        }

        .amoria-footer-top {
          margin-bottom: 0.4rem;
        }

        .amoria-footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.8rem;
        }

        .amoria-footer-link {
          color: var(--amoria-text-muted);
          text-decoration: none;
          font-size: 0.78rem;
        }

        .amoria-footer-link:hover {
          color: #e5e7eb;
          text-decoration: underline;
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

          .amoria-hero {
            grid-template-columns: minmax(0, 1fr);
            padding-top: 1rem;
          }

          .amoria-hero-right {
            order: -1;
          }

          .amoria-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .amoria-header {
            padding-inline: 1rem;
          }

          .amoria-hero,
          .amoria-section {
            padding-inline: 1rem;
          }

          .amoria-card-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-nav-right a.amoria-nav-btn--ghost {
            display: none;
          }

          .amoria-video-frame {
            max-width: 280px;
          }
        }
      `}</style>
    </main>
  );
}
