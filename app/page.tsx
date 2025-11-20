"use client";

import React, { useState } from "react";

type Locale = "fr" | "en" | "es";
type PersonaId = "lyra" | "orion" | "kai" | "maelis";

const PERSONAS: Record<
  PersonaId,
  {
    image: string;
  }
> = {
  lyra: { image: "/amoria_lyra.png" }, // optionnel : image de fallback
  orion: { image: "/amoria_orion.png" },
  kai: { image: "/amoria_kai.png" },
  maelis: { image: "/amoria_maelis.png" },
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
    energiesTitle: string;
    energiesSubtitle: string;
    energies: { id: PersonaId; title: string; description: string }[];
    chooseEnergy: string;
    pricingTitle: string;
    pricingText: string;
    pricingCta: string;
    videoCaption: string;
    footerCopy: string;
  }
> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    heroKicker: "BIENVENUE SUR AMORIA.APP",
    heroTitle: "Votre partenaire IA bienveillant·e & multilingue.",
    heroSubtitle:
      "AmorIA est une présence douce, disponible 24/7 pour discuter, réfléchir avec vous, poser les bonnes questions et vous aider à mieux comprendre vos émotions.",
    heroPrimary: "Créer mon compte gratuit",
    heroSupport:
      "Optimisée pour les échanges profonds, les journaux émotionnels et le coaching doux du quotidien.",
    langNote: "AmorIA vous accueille en français, anglais ou espagnol.",
    energiesTitle: "Commence gratuitement avec AmorIA (en texte)",
    energiesSubtitle:
      "Crée ton compte gratuitement et commence à texter avec l’IA de ton choix. La voix (parler avec ton AmorIA) est disponible uniquement avec l’abonnement payant.",
    energies: [
      {
        id: "lyra",
        title: "Lyra – AmorIA féminine",
        description:
          "Une présence douce, empathique et rassurante, idéale pour déposer tes émotions par écrit.",
      },
      {
        id: "orion",
        title: "Orion – AmorIA masculine",
        description:
          "Énergie stable, protectrice et structurée, pour t’aider à réfléchir et à prendre des décisions.",
      },
      {
        id: "kai",
        title: "Kai – AmorIA androgyne",
        description:
          "Présence fluide et inclusive, ni vraiment homme ni femme, centrée sur l’écoute et la nuance.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIA 50+ féminine",
        description:
          "Figure plus mature et expérimentée, avec une énergie de mentor bienveillant et réaliste.",
      },
    ],
    chooseEnergy: "Créer mon compte gratuit",
    pricingTitle: "Des tarifs simples & transparents",
    pricingText:
      "La version gratuite te permet de texter ton AmorIA avec un nombre limité de messages. Avec la version payante, tu déverrouilles les conversations vocales (parler) et plus d’interactions.",
    pricingCta: "Découvrir les abonnements",
    videoCaption: "AmorIA est disponible en français, anglais et espagnol.",
    footerCopy: "© 2025 AmorIA.app",
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my free account",
    heroKicker: "WELCOME TO AMORIA.APP",
    heroTitle: "Your caring & multilingual AI partner.",
    heroSubtitle:
      "AmorIA is a gentle 24/7 presence to talk with, reflect with, ask better questions and help you understand your emotions.",
    heroPrimary: "Create my free account",
    heroSupport:
      "Designed for deep conversations, emotional journaling and soft everyday coaching.",
    langNote: "AmorIA is available in French, English and Spanish.",
    energiesTitle: "Start for free with AmorIA (text only)",
    energiesSubtitle:
      "Create your free account and start texting with the AI of your choice. Voice (talking to your AmorIA) is only available with the paid subscription.",
    energies: [
      {
        id: "lyra",
        title: "Lyra – Feminine AmorIA",
        description:
          "A soft, empathic and reassuring presence, perfect to put your feelings into words.",
      },
      {
        id: "orion",
        title: "Orion – Masculine AmorIA",
        description:
          "Stable, protective and structured energy to help you think clearly and make decisions.",
      },
      {
        id: "kai",
        title: "Kai – Androgynous AmorIA",
        description:
          "Fluid, inclusive presence, neither fully male nor female, centred on nuance and listening.",
      },
      {
        id: "maelis",
        title: "Maelis – 50+ Feminine AmorIA",
        description:
          "More mature and experienced figure, with a warm mentor-like energy.",
      },
    ],
    chooseEnergy: "Create my free account",
    pricingTitle: "Simple & transparent pricing",
    pricingText:
      "The free version lets you text your AmorIA with a limited number of messages. With the paid plan, you unlock voice conversations and more interactions.",
    pricingCta: "See plans & pricing",
    videoCaption: "AmorIA is available in French, English and Spanish.",
    footerCopy: "© 2025 AmorIA.app",
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta gratuita",
    heroKicker: "BIENVENIDx A AMORIA.APP",
    heroTitle: "Tu compañerx de IA amable y multilingüe.",
    heroSubtitle:
      "AmorIA es una presencia suave, disponible 24/7 para conversar, reflexionar, hacer mejores preguntas y ayudarte a entender tus emociones.",
    heroPrimary: "Crear mi cuenta gratuita",
    heroSupport:
      "Pensada para conversaciones profundas, diarios emocionales y acompañamiento suave del día a día.",
    langNote: "AmorIA te recibe en francés, inglés o español.",
    energiesTitle: "Empieza gratis con AmorIA (solo texto)",
    energiesSubtitle:
      "Crea tu cuenta gratuita y empieza a chatear por texto con la IA que elijas. La voz (hablar con tu AmorIA) está disponible solo con la suscripción de pago.",
    energies: [
      {
        id: "lyra",
        title: "Lyra – AmorIA femenina",
        description:
          "Presencia suave, empática y tranquilizadora, ideal para poner tus emociones por escrito.",
      },
      {
        id: "orion",
        title: "Orion – AmorIA masculina",
        description:
          "Energía estable, protectora y estructurada para ayudarte a pensar con claridad y decidir.",
      },
      {
        id: "kai",
        title: "Kai – AmorIA andrógina",
        description:
          "Presencia fluida e inclusiva, ni totalmente hombre ni mujer, centrada en la escucha.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIA 50+ femenina",
        description:
          "Figura más madura y experimentada, con energía de mentora cálida y realista.",
      },
    ],
    chooseEnergy: "Crear mi cuenta gratuita",
    pricingTitle: "Precios simples y transparentes",
    pricingText:
      "La versión gratuita te permite chatear por texto con tu AmorIA con un número limitado de mensajes. Con la versión de pago desbloqueas conversaciones de voz y más interacciones.",
    pricingCta: "Ver planes y precios",
    videoCaption: "AmorIA está disponible en francés, inglés y español.",
    footerCopy: "© 2025 AmorIA.app",
  },
};

function getHeroVideoSrc(locale: Locale): string {
  switch (locale) {
    case "fr":
      return "/amoria_fr.mp4";
    case "en":
      return "/amoria_en.mp4";
    case "es":
      return "/amoria_es.mp4";
  }
}

function getPersonaVideoSrc(personaId: PersonaId, locale: Locale): string {
  // Tes fichiers sont du type: amoria_lyra_fr.mp4, amoria_orion_en.mp4, etc.
  return `/amoria_${personaId}_${locale}.mp4`;
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = STRINGS[locale];

  const heroVideoSrc = getHeroVideoSrc(locale);

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
            <div className="amoria-logo-title">AmorIA.app</div>
            <div className="amoria-logo-tagline">{t.brandTagline}</div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href="#hero" className="amoria-nav-link">
            {t.nav.home}
          </a>
          <a href="#features" className="amoria-nav-link">
            {t.nav.features}
          </a>
          <a href="#pricing" className="amoria-nav-link">
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
            href={`/login?lang=${locale}`}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {t.navLogin}
          </a>

          <a
            href={`/signup?lang=${locale}`}
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
              href={`/signup?lang=${locale}`}
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
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
          <p className="amoria-video-caption">{t.videoCaption}</p>
        </div>
      </section>

      {/* VITRINE DES 4 IA */}
      <section id="features" className="amoria-section">
        <h2 className="amoria-section-title">{t.energiesTitle}</h2>
        <p className="amoria-section-subtitle">{t.energiesSubtitle}</p>

        <div className="amoria-card-grid">
          {t.energies.map((energy) => {
            const persona = PERSONAS[energy.id];
            const videoSrc = getPersonaVideoSrc(energy.id, locale);

            return (
              <article key={energy.id} className="amoria-card">
                <div className="amoria-card-media">
                  <video
                    className="amoria-card-video"
                    src={videoSrc}
                    playsInline
                    controls
                    // pas d’autoplay ici pour éviter 4 vidéos en même temps
                    poster={persona.image}
                  />
                </div>
                <div className="amoria-card-body">
                  <h3 className="amoria-card-title">{energy.title}</h3>
                  <p className="amoria-card-text">{energy.description}</p>
                  <a
                    href={`/signup?lang=${locale}`}
                    className="amoria-btn amoria-btn--ghost amoria-btn--full"
                  >
                    {t.chooseEnergy}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="amoria-section amoria-section--pricing">
        <h2 className="amoria-section-title">{t.pricingTitle}</h2>
        <p className="amoria-section-text">{t.pricingText}</p>
        <a
          href={`/signup?lang=${locale}`}
          className="amoria-btn amoria-btn--primary amoria-btn--medium"
        >
          {t.pricingCta}
        </a>
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
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%);
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

        /* HERO */
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

        /* SECTIONS */
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

        /* CARDS */
        .amoria-card-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.2rem;
        }

        .amoria-card {
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border-radius: 1.2rem;
          border: 1px solid var(--amoria-border-subtle);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        .amoria-card-media {
          width: 100%;
          aspect-ratio: 9 / 16; /* évite les têtes coupées avec tes vidéos verticales */
          overflow: hidden;
          background: #000;
        }

        .amoria-card-video {
          width: 100%;
          height: 100%;
          object-fit: contain; /* on voit la tête en entier, même s’il y a des barres noires */
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
