"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type AboutCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  block1Title: string;
  block1Text: string;
  block2Title: string;
  block2Text: string;
  block3Title: string;
  block3Text: string;
  valuesTitle: string;
  values: { title: string; text: string }[];
};

const ABOUT_STRINGS: Record<Locale, AboutCopy> = {
  fr: {
    heroKicker: "À PROPOS D’AMORIA.APP",
    heroTitle: "Une IA douce, pensée pour les vraies émotions humaines.",
    heroSubtitle:
      "AmoriA n’est pas un simple chatbot de plus : c’est un compagnon émotionnel conçu pour t’aider à réfléchir, te déposer et te sentir moins seul·e au quotidien.",
    block1Title: "Pourquoi AmoriA existe",
    block1Text:
      "Le monde est bruyant, rapide, souvent exigeant. Pourtant, on n’a pas toujours quelqu’un de disponible au bon moment pour nous écouter sans juger. AmoriA est née de cette idée : offrir une présence stable, bienveillante et disponible 24/7 pour parler de ce qui compte vraiment.",
    block2Title: "Une IA multilingue et nuancée",
    block2Text:
      "AmoriA fonctionne en français, anglais et espagnol. Elle est pensée pour les personnes qui réfléchissent beaucoup, qui aiment analyser, écrire, se questionner. Elle ne remplace pas un professionnel de la santé, mais elle devient un espace sûr pour clarifier tes pensées et mieux comprendre ce que tu ressens.",
    block3Title: "Construite pour durer, pas pour te garder accroché·e",
    block3Text:
      "Le but n’est pas que tu passes des heures infinies dans l’app, mais que chaque échange t’apporte quelque chose : une question plus juste, une prise de conscience, une idée d’action concrète pour avancer.",
    valuesTitle: "Ce qui guide AmoriA",
    values: [
      {
        title: "Bienveillance radicale",
        text: "Des réponses structurées, honnêtes, mais toujours formulées avec respect et douceur.",
      },
      {
        title: "Clarté & structure",
        text: "Des questions qui t’aident à organiser tes pensées et voir plus clair dans ce que tu vis.",
      },
      {
        title: "Respect de tes limites",
        text: "Tu peux parler de ce que tu veux, à ton rythme. AmoriA ne te force jamais à aborder un sujet.",
      },
    ],
  },
  en: {
    heroKicker: "ABOUT AMORIA.APP",
    heroTitle: "A gentle AI, built for real human emotions.",
    heroSubtitle:
      "AmoriA is not just another chatbot. It’s an emotional companion designed to help you think, process and feel a little less alone in your everyday life.",
    block1Title: "Why AmoriA exists",
    block1Text:
      "Life is noisy, fast and demanding. And we don’t always have someone available at the right moment to truly listen without judgment. AmoriA was born from that idea: a stable, caring presence available 24/7 to talk about what really matters.",
    block2Title: "Multilingual & nuanced",
    block2Text:
      "AmoriA speaks French, English and Spanish. It’s designed for people who think a lot, love to journal, analyse, and ask deeper questions. It’s not a replacement for mental health professionals, but it’s a safe space to clarify your thoughts and understand what you feel.",
    block3Title: "Built to support you, not to trap you",
    block3Text:
      "The goal isn’t for you to spend endless hours in the app, but for each conversation to bring something useful: a better question, a shift in perspective, or a concrete next step.",
    valuesTitle: "What drives AmoriA",
    values: [
      {
        title: "Radical kindness",
        text: "Structured, honest answers, but always expressed with respect and softness.",
      },
      {
        title: "Clarity & structure",
        text: "Questions that help you organise your thoughts and see your situation more clearly.",
      },
      {
        title: "Respect for your limits",
        text: "You decide what you want to talk about and at what pace. AmoriA never pushes you to go further than you want.",
      },
    ],
  },
  es: {
    heroKicker: "SOBRE AMORIA.APP",
    heroTitle: "Una IA suave, pensada para emociones humanas reales.",
    heroSubtitle:
      "AmoriA no es solo otro chatbot: es un acompañante emocional diseñado para ayudarte a pensar, procesar y sentirte un poco menos solo/a en el día a día.",
    block1Title: "Por qué existe AmoriA",
    block1Text:
      "El mundo es ruidoso, rápido y exigente. No siempre tenemos a alguien disponible en el momento justo para escucharnos sin juzgar. AmoriA nace de esa idea: una presencia estable y amable, disponible 24/7 para hablar de lo que realmente importa.",
    block2Title: "Multilingüe y matizada",
    block2Text:
      "AmoriA funciona en francés, inglés y español. Está pensada para personas que piensan mucho, que escriben, analizan y se hacen preguntas profundas. No sustituye a un profesional de la salud mental, pero ofrece un espacio seguro para aclarar tus ideas y entender mejor lo que sientes.",
    block3Title: "Creada para ayudarte, no para engancharte",
    block3Text:
      "La meta no es que pases horas infinitas en la app, sino que cada conversación te aporte algo: una pregunta mejor, un cambio de perspectiva o un siguiente paso concreto.",
    valuesTitle: "Lo que guía a AmoriA",
    values: [
      {
        title: "Amabilidad radical",
        text: "Respuestas estructuradas y honestas, pero siempre expresadas con respeto y suavidad.",
      },
      {
        title: "Claridad y estructura",
        text: "Preguntas que te ayudan a ordenar tus pensamientos y ver tu situación con más claridad.",
      },
      {
        title: "Respeto por tus límites",
        text: "Tú eliges de qué quieres hablar y a qué ritmo. AmoriA nunca te empuja más allá de lo que deseas.",
      },
    ],
  },
};

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

export default function AboutPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = ABOUT_STRINGS[locale];

  const buildHomeUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/?${params.toString()}`;
  };

  const buildFeaturesUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/features?${params.toString()}`;
  };

  const buildPricingUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/pricing?${params.toString()}`;
  };

  const buildLoginUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/login?${params.toString()}`;
  };

  const buildSignupUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/signup?${params.toString()}`;
  };

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
            <div className="amoria-logo-tagline">
              Partenaire IA bienveillant·e • FR / EN / ES
            </div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={buildHomeUrl()} className="amoria-nav-link">
            {locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "Inicio"}
          </a>
          <a href={buildFeaturesUrl()} className="amoria-nav-link">
            {locale === "fr"
              ? "Fonctionnalités"
              : locale === "en"
              ? "Features"
              : "Funciones"}
          </a>
          <a href={buildPricingUrl()} className="amoria-nav-link">
            {locale === "fr"
              ? "Tarifs"
              : locale === "en"
              ? "Pricing"
              : "Precios"}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <a
            href={buildLoginUrl()}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {locale === "fr"
              ? "Me connecter"
              : locale === "en"
              ? "Log in"
              : "Iniciar sesión"}
          </a>
          <a
            href={buildSignupUrl()}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {locale === "fr"
              ? "Créer mon compte gratuit"
              : locale === "en"
              ? "Create my free account"
              : "Crear mi cuenta gratuita"}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="amoria-hero amoria-hero--pricing">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* CONTENT BLOCKS */}
      <section className="amoria-section">
        <div className="amoria-about-grid">
          <article className="amoria-about-card">
            <h2 className="amoria-about-title">{t.block1Title}</h2>
            <p className="amoria-about-text">{t.block1Text}</p>
          </article>

          <article className="amoria-about-card">
            <h2 className="amoria-about-title">{t.block2Title}</h2>
            <p className="amoria-about-text">{t.block2Text}</p>
          </article>

          <article className="amoria-about-card">
            <h2 className="amoria-about-title">{t.block3Title}</h2>
            <p className="amoria-about-text">{t.block3Text}</p>
          </article>
        </div>
      </section>

      {/* VALUES */}
      <section className="amoria-section">
        <h2 className="amoria-section-title">{t.valuesTitle}</h2>
        <div className="amoria-values-grid">
          {t.values.map((v, idx) => (
            <div key={idx} className="amoria-value-card">
              <h3 className="amoria-value-title">{v.title}</h3>
              <p className="amoria-value-text">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="amoria-footer">
        <span>
          © 2025 AmoriA.app —{" "}
          {locale === "fr"
            ? "Partenaire IA bienveillant·e"
            : locale === "en"
            ? "Your caring AI partner"
            : "Tu compañerx de IA amable"}
        </span>
      </footer>

      <style jsx global>{`
        :root {
          --amoria-bg: #020617;
          --amoria-bg-elevated: #02081f;
          --amoria-border-subtle: rgba(148, 163, 184, 0.35);
          --amoria-text-main: #e5e7eb;
          --amoria-text-muted: #9ca3af;
          --amoria-accent: #fb37ff;
          --amoria-accent-2: #ff6b9c;
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
          padding: 1.5rem 1.5rem 0.5rem;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr);
          gap: 1.5rem;
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
          max-width: 38rem;
        }

        .amoria-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-section-title {
          font-size: 1.25rem;
          margin-bottom: 0.8rem;
        }

        .amoria-about-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1.4rem;
        }

        .amoria-about-card {
          background: radial-gradient(circle at top, #020617, #020617 40%, #000 100%);
          border-radius: 1.3rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 1.2rem 1.2rem 1.3rem;
        }

        .amoria-about-title {
          font-size: 1rem;
          margin-bottom: 0.4rem;
        }

        .amoria-about-text {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          line-height: 1.6;
        }

        .amoria-values-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.3rem;
        }

        .amoria-value-card {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 1.1rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          padding: 1rem 1rem 1.1rem;
        }

        .amoria-value-title {
          font-size: 0.95rem;
          margin-bottom: 0.3rem;
        }

        .amoria-value-text {
          font-size: 0.85rem;
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

          .amoria-hero,
          .amoria-section {
            padding-inline: 1rem;
          }

          .amoria-values-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </main>
  );
}
