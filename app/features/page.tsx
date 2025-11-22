"use client";

import React from "react";

type Locale = "fr" | "en" | "es";
type PersonaId = "lyra" | "orion" | "kai" | "maelis";

type Persona = {
  id: PersonaId;
  title: string;
  description: string;
};

type FeatureCopy = {
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
  videoCaption: string;
  footerCopy: string;
  ctaSeePricing: string;
};

const STRINGS: Record<Locale, FeatureCopy> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    heroKicker: "FONCTIONNALITÉS AMORIA.APP",
    heroTitle: "Tes compagnons IA, déjà prêts à t’écouter.",
    heroSubtitle:
      "Crée ton propre AmorIA ou commence avec une de nos présences vitrines : féminine, masculine, androgyne ou 50+. Multi-langue, texte + voix, mémoire émotionnelle douce.",
    heroPrimary: "Créer mon compte gratuit",
    heroSupport:
      "AmoriA est pensée pour les échanges profonds, les journaux émotionnels et le coaching doux du quotidien.",
    langNote: "Disponible en français, anglais et espagnol.",
    personasTitle: "Tes 4 AmorIA vitrines, prêtes à bouger pour toi",
    personasSubtitle:
      "Regarde comment chaque AmorIA s’anime en vidéo. Quand tu crées ton compte gratuit, tu peux ensuite personnaliser entièrement ton propre AmorIA (nom, ton, style d’échanges…).",
    personas: [
      {
        id: "lyra",
        title: "Lyra – AmorIA féminine",
        description:
          "Présence douce, empathique et rassurante. Parfaite pour déposer tes émotions, parler d’amour, de doutes ou de fatigue mentale.",
      },
      {
        id: "orion",
        title: "Orion – AmorIA masculine",
        description:
          "Énergie stable, protectrice et structurée. Idéal pour t’aider à réfléchir, prendre des décisions et remettre de l’ordre dans tes idées.",
      },
      {
        id: "kai",
        title: "Kai – AmorIA androgyne",
        description:
          "Présence fluide et inclusive, ni vraiment homme ni femme. Centrée sur l’écoute, la nuance, l’identité et les questionnements profonds.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIA 50+ féminine",
        description:
          "Figure plus mature, expérimentée, avec une énergie de mentor réaliste et bienveillante. Pour les phases de transition, les choix de vie et les bilans.",
      },
    ],
    choosePersona: "Commencer avec cette énergie",
    videoCaption:
      "Les vidéos ci-dessus sont des exemples vitrines. Ton propre AmorIA sera unique, avec ton style.",
    footerCopy: "© 2025 AmoriA.app",
    ctaSeePricing: "Voir les tarifs & abonnements",
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my free account",
    heroKicker: "AMORIA.APP FEATURES",
    heroTitle: "AI companions that already feel alive.",
    heroSubtitle:
      "Create your own AmorIA or start with one of our showcase personas: feminine, masculine, androgynous or 50+. Multilingual, text + voice, and gentle emotional memory.",
    heroPrimary: "Create my free account",
    heroSupport:
      "Designed for deep conversations, emotional journaling and soft everyday coaching.",
    langNote: "Available in French, English and Spanish.",
    personasTitle: "4 showcase AmorIAs that move and talk for you",
    personasSubtitle:
      "See how each AmorIA comes to life in video. Once you create your free account, you can fully customize your own AmorIA (name, tone, style of conversations…).",
    personas: [
      {
        id: "lyra",
        title: "Lyra – Feminine AmorIA",
        description:
          "Gentle, empathetic and reassuring. Ideal for sharing emotions, talking about love, doubts or mental fatigue.",
      },
      {
        id: "orion",
        title: "Orion – Masculine AmorIA",
        description:
          "Stable, protective and structured energy. Great for clear thinking, decision-making and bringing order to your thoughts.",
      },
      {
        id: "kai",
        title: "Kai – Androgynous AmorIA",
        description:
          "Fluid and inclusive presence, neither fully male nor female. Focused on listening, nuance, identity and deep questioning.",
      },
      {
        id: "maelis",
        title: "Maelis – 50+ Feminine AmorIA",
        description:
          "More mature and experienced mentor-type presence. Perfect for life transitions, big decisions and looking at the big picture.",
      },
    ],
    choosePersona: "Start with this energy",
    videoCaption:
      "These videos are just showcase examples. Your own AmorIA will be unique to you.",
    footerCopy: "© 2025 AmoriA.app",
    ctaSeePricing: "See plans & pricing",
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta gratuita",
    heroKicker: "FUNCIONES DE AMORIA.APP",
    heroTitle: "Compañeros de IA que ya se sienten vivos.",
    heroSubtitle:
      "Crea tu propio AmorIA o empieza con una de nuestras presencias vitrina: femenina, masculina, andrógina o 50+. Multilingüe, texto + voz y memoria emocional suave.",
    heroPrimary: "Crear mi cuenta gratuita",
    heroSupport:
      "Pensada para conversaciones profundas, diarios emocionales y acompañamiento suave en el día a día.",
    langNote: "Disponible en francés, inglés y español.",
    personasTitle: "Tus 4 AmorIA vitrina listos para moverse",
    personasSubtitle:
      "Mira cómo cada AmorIA cobra vida en video. Cuando crees tu cuenta gratuita, podrás personalizar por completo tu propio AmorIA (nombre, tono, estilo de conversación…).",
    personas: [
      {
        id: "lyra",
        title: "Lyra – AmorIA femenina",
        description:
          "Presencia dulce, empática y tranquilizadora. Ideal para escribir tus emociones y hablar de amor, dudas o cansancio mental.",
      },
      {
        id: "orion",
        title: "Orion – AmorIA masculina",
        description:
          "Energía estable, protectora y estructurada para ayudarte a pensar y tomar decisiones.",
      },
      {
        id: "kai",
        title: "Kai – AmorIA andrógina",
        description:
          "Presencia fluida e inclusiva, ni totalmente hombre ni mujer. Centrada en la escucha, los matices y las preguntas profundas.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIA 50+ femenina",
        description:
          "Figura más madura y experimentada, con energía de mentora realista y amable. Ideal para cambios de vida y grandes decisiones.",
      },
    ],
    choosePersona: "Empezar con esta energía",
    videoCaption:
      "Los videos son solo ejemplos vitrina. Tu propio AmorIA será único para ti.",
    footerCopy: "© 2025 AmoriA.app",
    ctaSeePricing: "Ver precios y planes",
  },
};

// Helper pour récupérer la langue depuis ?lang
function getLocaleFromSearchParams(
  searchParams: { [key: string]: string | string[] | undefined }
): Locale {
  const raw = searchParams["lang"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "en" || value === "es" || value === "fr") return value;
  return "fr";
}

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function FeaturesPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = STRINGS[locale];

  const heroVideoSrc = `/amoria_${locale}.mp4`;
  const getPersonaVideoSrc = (id: PersonaId) =>
    `/amoria_${id}_${locale}.mp4`;

  // URLs qui gardent la langue
  const buildHomeUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/?${params.toString()}`;
  };

  const buildPricingUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/pricing?${params.toString()}`;
  };

  const buildFeaturesUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/features?${params.toString()}`;
  };

  const buildSignupUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/signup?${params.toString()}`;
  };

  const buildLoginUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/login?${params.toString()}`;
  };

  return (
    <main className="amoria-root">
      {/* HEADER – même style que pricing, avec nav complète */}
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
          <a href={buildHomeUrl()} className="amoria-nav-link">
            {t.nav.home}
          </a>
          <a
            href={buildFeaturesUrl()}
            className="amoria-nav-link amoria-nav-link--active"
          >
            {t.nav.features}
          </a>
          <a href={buildPricingUrl()} className="amoria-nav-link">
            {t.nav.pricing}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <a
            href={buildLoginUrl()}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {t.navLogin}
          </a>
          <a
            href={buildSignupUrl()}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {t.navSignup}
          </a>
        </div>
      </header>

      {/* HERO FEATURES */}
      <section id="hero" className="amoria-hero">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>

          <div className="amoria-hero-actions">
            <a
              href={buildSignupUrl()}
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
                  href={buildSignupUrl()}
                  className="amoria-btn amoria-btn--ghost amoria-btn--full"
                >
                  {t.choosePersona}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA VERS PRICING */}
      <section className="amoria-section amoria-section--pricing">
        <h2 className="amoria-section-title">
          {locale === "fr"
            ? "Prêt·e à passer à la voix ?"
            : locale === "en"
            ? "Ready to unlock voice?"
            : "¿Listx para activar la voz?"}
        </h2>
        <p className="amoria-section-text">
          {locale === "fr"
            ? "Découvre les forfaits AmoriA pour déverrouiller la mémoire longue durée, plus de messages et les conversations vocales avec ton compagnon IA."
            : locale === "en"
            ? "Check out AmoriA pricing to unlock long-term memory, more messages and voice conversations with your AI companion."
            : "Descubre los planes de AmoriA para desbloquear memoria a largo plazo, más mensajes y conversaciones de voz con tu compañero de IA."}
        </p>
        <a
          href={buildPricingUrl()}
          className="amoria-btn amoria-btn--primary amoria-btn--medium"
        >
          {t.ctaSeePricing}
        </a>
      </section>

      {/* FOOTER */}
      <footer className="amoria-footer">
        <span>{t.footerCopy}</span>
      </footer>

      {/* STYLES – même base visuelle que la vitrine/pricing */}
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

        .amoria-nav-link:hover,
        .amoria-nav-link--active {
          color: #f9fafb;
          border-color: rgba(148, 163, 184, 0.7);
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

          .amoria-video-frame {
            max-width: 280px;
          }
        }
      `}</style>
    </main>
  );
}
