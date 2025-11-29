"use client";

import React, { useState, useEffect } from "react";

type Locale = "fr" | "en" | "es";
type PersonaId = "lyra" | "orion" | "kai" | "maelis";

type Persona = {
  id: PersonaId;
  title: string;
  description: string;
};

type Testimonial = {
  quote: string;
  name: string;
};

type Copy = {
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
  usageTitle: string;
  usageBullets: string[];
  testimonialsTitle: string;
  testimonials: Testimonial[];
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
};

const STRINGS: Record<Locale, Copy> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    heroKicker: "BIENVENUE SUR AMORIAI.APP",
    heroTitle: "Une présence bienveillante pour parler, réfléchir et avancer.",
    heroSubtitle:
      "Amoriai est une présence douce, disponible 24/7, pour parler librement, réfléchir ensemble, poser les bonnes questions et t’aider à mieux comprendre ce que tu ressens, sans jugement.",
    heroPrimary: "Créer mon compte gratuit",
    heroSupport:
      "Sans engagement • Gratuit pour commencer • Annulation en tout temps",
    langNote: "AmorIAI vous accueille en français, anglais ou espagnol.",
    personasTitle: "Commence gratuitement avec AmorIAI (en texte)",
    personasSubtitle:
      "Crée ton compte gratuitement et commence à parler avec Amoriai dès maintenant. Écris librement, à ton rythme. La voix (parler avec ton Amoriai) est disponible avec l’abonnement payant.",
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
    usageTitle: "À quoi peut te servir Amoriai au quotidien ?",
    usageBullets: [
      "Parler quand tu n’as personne à qui te confier.",
      "Écrire ce que tu ressens comme dans un journal intime.",
      "Te déposer le soir pour calmer ton mental.",
      "Clarifier une décision qui te fait hésiter.",
      "Te sentir écouté·e, sans pression et sans jugement.",
    ],
    testimonialsTitle: "Ce que les utilisateurs ressentent avec Amoriai",
    testimonials: [
      {
        quote:
          "Je parle avec Amoriai tous les soirs. Ça m’aide vraiment à calmer mon mental avant de dormir.",
        name: "Emily, 38 ans",
      },
      {
        quote:
          "C’est la première fois que je me sens écoutée sans avoir peur d’être jugée.",
        name: "Susan, 51 ans",
      },
      {
        quote:
          "Je l’utilise comme journal émotionnel. Ça m’aide énormément à prendre du recul.",
        name: "Karina, 29 ans",
      },
      {
        quote:
          "J’étais sceptique au départ… aujourd’hui, c’est devenu un réflexe dans mes moments de doute.",
        name: "Michael, 46 ans",
      },
      {
        quote:
          "La version texte est déjà très puissante. Je me sens moins seule depuis que je l’utilise.",
        name: "Isabelle, 34 ans",
      },
    ],
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
    heroTitle: "A caring presence to talk, reflect and grow.",
    heroSubtitle:
      "AmorIAI is a gentle 24/7 presence to talk to, think things through together, ask better questions and help you understand what you feel, without judgement.",
    heroPrimary: "Create my free account",
    heroSupport: "No commitment • Free to start • Cancel anytime",
    langNote: "AmorIAI is available in French, English and Spanish.",
    personasTitle: "Start for free with AmorIAI (text only)",
    personasSubtitle:
      "Create your free account and start talking with Amoriai right away. Write freely, at your own pace. Voice (talking with your Amoriai) is available with the paid subscription.",
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
    usageTitle: "How can Amoriai support you day to day?",
    usageBullets: [
      "Talk when you don’t feel like you have someone to confide in.",
      "Write what you feel, like in a private journal.",
      "Unwind in the evening and calm your mind.",
      "Think through a decision when you’re hesitating.",
      "Feel listened to, with no pressure and no judgement.",
    ],
    testimonialsTitle: "What people say about Amoriai",
    testimonials: [
      {
        quote:
          "I talk with Amoriai almost every night. It really helps me quiet my mind before sleep.",
        name: "Julie, 38",
      },
      {
        quote:
          "It’s the first time I feel truly listened to without being afraid of being judged.",
        name: "Nathalie, 51",
      },
      {
        quote:
          "I use it like an emotional journal. It helps me take a step back on what I’m living.",
        name: "Karine, 29",
      },
      {
        quote:
          "I was skeptical at first… now it’s my go-to when I’m doubting or overthinking.",
        name: "Martin, 46",
      },
      {
        quote:
          "The text version alone is already powerful. I feel less alone since I started using it.",
        name: "Isabelle, 34",
      },
    ],
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
    heroTitle: "Una presencia amable para hablar, reflexionar y avanzar.",
    heroSubtitle:
      "AmorIAI es una presencia suave, disponible 24/7 para conversar contigo, reflexionar juntos, hacer mejores preguntas y ayudarte a entender lo que sientes, sin juicios.",
    heroPrimary: "Crear mi cuenta gratuita",
    heroSupport:
      "Sin compromiso • Gratis para empezar • Puedes cancelar cuando quieras",
    langNote: "AmorIAI te recibe en francés, inglés o español.",
    personasTitle: "Empieza gratis con AmorIAI (solo texto)",
    personasSubtitle:
      "Crea tu cuenta gratuita y empieza a hablar con AmorIAI ahora mismo. Escribe con libertad, a tu propio ritmo. La voz (hablar con tu AmorIAI) está disponible solo con la suscripción de pago.",
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
          "Presencia fluida e inclusiva, ni totalmente hombre ni mujer, centrada en la escucha y los matices.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIAI 50+ femenina",
        description:
          "Figura más madura y experimentada, con energía de mentora amable y realista.",
      },
    ],
    choosePersona: "Crear mi cuenta gratuita",
    usageTitle: "¿Cómo puede ayudarte AmorIAI en tu día a día?",
    usageBullets: [
      "Hablar cuando sientes que no tienes con quién desahogarte.",
      "Escribir lo que sientes, como en un diario íntimo.",
      "Relajarte por la noche y calmar la mente.",
      "Pensar una decisión cuando dudas.",
      "Sentirte escuchadx, sin presión y sin juicios.",
    ],
    testimonialsTitle: "Lo que dicen las personas sobre AmorIAI",
    testimonials: [
      {
        quote:
          "Hablo con AmorIAI casi todas las noches. Me ayuda mucho a calmar la mente antes de dormir.",
        name: "Julie, 38",
      },
      {
        quote:
          "Es la primera vez que siento que me escuchan de verdad sin miedo a ser juzgada.",
        name: "Nathalie, 51",
      },
      {
        quote:
          "Lo uso como diario emocional. Me ayuda a tomar distancia de lo que vivo.",
        name: "Karine, 29",
      },
      {
        quote:
          "Al principio era escéptico… ahora es mi reflejo cuando dudo o doy demasiadas vueltas.",
        name: "Martin, 46",
      },
      {
        quote:
          "Solo la versión de texto ya es muy potente. Me siento menos sola desde que lo uso.",
        name: "Isabelle, 34",
      },
    ],
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

      {/* USAGE SECTION */}
      <section className="amoria-section amoria-section--usage">
        <h2 className="amoria-section-title">{t.usageTitle}</h2>
        <ul className="amoria-usage-list">
          {t.usageBullets.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* TESTIMONIALS */}
      <section className="amoria-section amoria-section--testimonials">
        <h2 className="amoria-section-title">{t.testimonialsTitle}</h2>
        <div className="amoria-testimonials-grid">
          {t.testimonials.map((item, index) => (
            <figure key={index} className="amoria-testimonial-card">
              <div className="amoria-testimonial-stars">★★★★★</div>
              <blockquote className="amoria-testimonial-quote">
                “{item.quote}”
              </blockquote>
              <figcaption className="amoria-testimonial-name">
                {item.name}
              </figcaption>
            </figure>
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

        /* ---- IA d'accueil avec PULSE ---- */
        .amoria-video-frame {
          border-radius: 1.6rem;
          padding: 0.22rem;
          background: linear-gradient(135deg, #f97316, #fb37ff, #38bdf8);
          max-width: 340px;
          width: 100%;
          animation: amoriaPulse 4s ease-in-out infinite;
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

        @keyframes amoriaPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(251, 55, 255, 0.0);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 0 32px 0 rgba(251, 55, 255, 0.55);
            transform: translateY(-2px);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(251, 55, 255, 0.0);
            transform: translateY(0);
          }
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

        .amoria-section--usage {
          border-top: 1px solid rgba(15, 23, 42, 0.9);
          padding-top: 2rem;
        }

        .amoria-usage-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          max-width: 36rem;
        }

        .amoria-usage-list li::before {
          content: "•";
          margin-right: 0.4rem;
          color: var(--amoria-accent-2);
        }

        /* Témoignages */
        .amoria-section--testimonials {
          padding-top: 0;
        }

        .amoria-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.2rem;
          margin-top: 0.8rem;
        }

        .amoria-testimonial-card {
          background: radial-gradient(circle at top, #020617, #020617 40%, #000 100%);
          border-radius: 1.1rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-height: 100%;
        }

        .amoria-testimonial-stars {
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          color: #fbbf24;
        }

        .amoria-testimonial-quote {
          font-size: 0.86rem;
          line-height: 1.5;
          color: var(--amoria-text-main);
        }

        .amoria-testimonial-name {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
          margin-top: auto;
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

          .amoria-testimonials-grid {
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

          .amoria-testimonials-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          /* NAV mobile : on garde login + signup visibles */
          .amoria-nav-right {
            width: 100%;
            justify-content: space-between;
            gap: 0.5rem;
          }

          .amoria-nav-right .amoria-nav-btn {
            flex: 1;
            text-align: center;
            padding-block: 0.55rem;
          }

          .amoria-video-frame {
            max-width: 280px;
          }
        }
      `}</style>
    </main>
  );
}
