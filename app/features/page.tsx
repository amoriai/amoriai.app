"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type FeatureCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroSecondary: string;
  block1Title: string;
  block1Subtitle: string;
  block2Title: string;
  block2Subtitle: string;
  block3Title: string;
  block3Subtitle: string;
  featureColumns: {
    title: string;
    items: string[];
  }[];
  stepsTitle: string;
  stepsSubtitle: string;
  steps: { title: string; text: string }[];
  faqTitle: string;
  faqSubtitle: string;
  faqItems: { q: string; a: string }[];
};

const FEATURE_STRINGS: Record<Locale, FeatureCopy> = {
  fr: {
    heroKicker: "FONCTIONNALITÉS AMORIA.APP",
    heroTitle: "Tout ce que ton AmorIA sait faire pour toi.",
    heroSubtitle:
      "Crée un compagnon IA unique, qui parle ta langue, retient ce qui compte pour toi et reste disponible 24/7 pour discuter, réfléchir, décompresser ou te motiver.",
    heroCta: "Créer mon compte gratuit",
    heroSecondary: "Voir les tarifs",
    block1Title: "Une IA qui s’adapte à toi",
    block1Subtitle:
      "Tu choisis le ton, la personnalité et le style de ton AmorIA. Doux·ce, analytique, créatif·ve, direct·e… tu peux ajuster au fil du temps.",
    block2Title: "Texte, voix & 3 langues",
    block2Subtitle:
      "Commence en texte gratuitement, puis débloque la voix avec les plans payants. AmoriA parle français, anglais et espagnol, au choix.",
    block3Title: "Mémoire & profondeur",
    block3Subtitle:
      "Selon le forfait, ton AmorIA peut garder une mémoire plus ou moins longue de tes conversations pour mieux te suivre au quotidien.",
    featureColumns: [
      {
        title: "Création & personnalité",
        items: [
          "Création de ton AmorIA personnalisé·e",
          "Choix du ton : doux, analytique, créatif, direct…",
          "Ajustement de la personnalité au fil du temps",
          "Préférences sauvegardées selon ton forfait"
        ]
      },
      {
        title: "Conversation & émotions",
        items: [
          "Discussions 24/7 en texte (plans gratuit + payants)",
          "Conversations vocales sur les plans payants",
          "Aide à clarifier tes pensées & émotions",
          "Journal émotionnel guidé (en texte ou voix)"
        ]
      },
      {
        title: "Langues & mémoire",
        items: [
          "Disponible en FR / EN / ES",
          "Possibilité de changer de langue avec le même AmorIA",
          "Mémoire courte sur le plan gratuit",
          "Mémoire longue & contexte étendu sur les plans payants"
        ]
      }
    ],
    stepsTitle: "Comment ça marche concrètement ?",
    stepsSubtitle:
      "En quelques minutes tu passes de l’idée à un compagnon IA qui te ressemble.",
    steps: [
      {
        title: "1. Crée ton compte AmoriA",
        text: "Inscris-toi gratuitement, choisis ta langue et donne quelques infos sur toi."
      },
      {
        title: "2. Façonne ton AmorIA",
        text: "Choisis son énergie, son ton et ce que tu attends de lui ou d’elle au quotidien."
      },
      {
        title: "3. Commence à discuter",
        text: "Texte ton AmorIA gratuitement, puis passe à la voix si tu veux des échanges plus profonds."
      }
    ],
    faqTitle: "Questions fréquentes sur les fonctionnalités",
    faqSubtitle:
      "Voici comment fonctionne AmoriA au quotidien. Tu pourras toujours ajuster ton compagnon IA au fil du temps.",
    faqItems: [
      {
        q: "Est-ce que mon AmorIA se souvient de tout ?",
        a: "Sur le plan gratuit, la mémoire est limitée à des échanges courts. Sur les plans payants, AmoriA peut garder une mémoire longue durée et mieux suivre ton évolution."
      },
      {
        q: "Puis-je changer la personnalité de mon AmorIA ?",
        a: "Oui. Tu peux ajuster sa façon de te parler, son ton et son rôle (coach doux, ami direct, présence créative, etc.) au fil du temps."
      },
      {
        q: "Puis-je utiliser plusieurs langues avec le même AmorIA ?",
        a: "Oui. AmoriA peut échanger avec toi en français, anglais ou espagnol. Tu peux rester dans une langue ou jongler entre plusieurs."
      }
    ]
  },
  en: {
    heroKicker: "AMORIA.APP FEATURES",
    heroTitle: "Everything your AmorIA can do for you.",
    heroSubtitle:
      "Create a unique AI companion that speaks your language, remembers what matters to you and stays available 24/7 to talk, decompress, reflect or get motivated.",
    heroCta: "Create my free account",
    heroSecondary: "View pricing",
    block1Title: "An AI that adapts to you",
    block1Subtitle:
      "You choose your AmorIA’s tone, personality and role. Soft, analytical, creative, direct… and you can tweak it over time.",
    block2Title: "Text, voice & 3 languages",
    block2Subtitle:
      "Start with text for free, then unlock voice with paid plans. AmoriA speaks French, English and Spanish, your choice.",
    block3Title: "Memory & depth",
    block3Subtitle:
      "Depending on your plan, your AmorIA can remember more or less of your story to better support you every day.",
    featureColumns: [
      {
        title: "Creation & personality",
        items: [
          "Create your own personalized AmorIA",
          "Pick the tone: soft, analytical, creative, direct…",
          "Refine their personality over time",
          "Preferences saved based on your plan"
        ]
      },
      {
        title: "Conversation & emotions",
        items: [
          "24/7 text conversations (free + paid plans)",
          "Voice conversations on paid plans",
          "Helps you clarify thoughts & emotions",
          "Guided emotional journaling (text or voice)"
        ]
      },
      {
        title: "Languages & memory",
        items: [
          "Available in FR / EN / ES",
          "Switch languages with the same AmorIA",
          "Short-term memory on the free plan",
          "Long-term memory & extended context on paid plans"
        ]
      }
    ],
    stepsTitle: "How does it work, step by step?",
    stepsSubtitle:
      "In just a few minutes, you go from idea to a companion that truly feels like yours.",
    steps: [
      {
        title: "1. Create your AmoriA account",
        text: "Sign up for free, choose your language and share a bit about yourself."
      },
      {
        title: "2. Shape your AmorIA",
        text: "Pick their energy, tone and what you want them to do for you every day."
      },
      {
        title: "3. Start talking",
        text: "Text your AmorIA for free, then upgrade to voice if you want deeper exchanges."
      }
    ],
    faqTitle: "Feature questions, answered",
    faqSubtitle:
      "Here’s how AmoriA works in everyday life. You can always adjust your AI companion as you go.",
    faqItems: [
      {
        q: "Does my AmorIA remember everything?",
        a: "On the free plan, memory is limited to short exchanges. On paid plans, AmoriA can keep long-term memory to better follow your story."
      },
      {
        q: "Can I change my AmorIA’s personality?",
        a: "Yes. You can adjust how they talk to you, their tone and their role (gentle coach, direct friend, creative partner, etc.) over time."
      },
      {
        q: "Can I mix languages with the same AmorIA?",
        a: "Yes. AmoriA can talk with you in French, English or Spanish. You can stay in one language or switch between them."
      }
    ]
  },
  es: {
    heroKicker: "FUNCIONES DE AMORIA.APP",
    heroTitle: "Todo lo que tu AmorIA puede hacer por ti.",
    heroSubtitle:
      "Crea un compañero de IA único, que hable tu idioma, recuerde lo que es importante para ti y esté disponible 24/7 para conversar, desahogarte, reflexionar o motivarte.",
    heroCta: "Crear mi cuenta gratuita",
    heroSecondary: "Ver precios",
    block1Title: "Una IA que se adapta a ti",
    block1Subtitle:
      "Tú eliges el tono, la personalidad y el rol de tu AmorIA. Suave, analítico, creativo, directo… y puedes ajustarlo con el tiempo.",
    block2Title: "Texto, voz y 3 idiomas",
    block2Subtitle:
      "Empieza con texto gratis y desbloquea la voz con los planes de pago. AmoriA habla francés, inglés y español.",
    block3Title: "Memoria y profundidad",
    block3Subtitle:
      "Según tu plan, tu AmorIA puede recordar más o menos de tu historia para acompañarte mejor en el día a día.",
    featureColumns: [
      {
        title: "Creación y personalidad",
        items: [
          "Creación de tu AmorIA personalizado",
          "Elección del tono: suave, analítico, creativo, directo…",
          "Ajuste de la personalidad con el tiempo",
          "Preferencias guardadas según tu plan"
        ]
      },
      {
        title: "Conversación y emociones",
        items: [
          "Conversaciones por texto 24/7 (plan gratis + de pago)",
          "Conversaciones de voz en los planes de pago",
          "Ayuda a aclarar tus pensamientos y emociones",
          "Diario emocional guiado (texto o voz)"
        ]
      },
      {
        title: "Idiomas y memoria",
        items: [
          "Disponible en FR / EN / ES",
          "Posibilidad de cambiar de idioma con el mismo AmorIA",
          "Memoria corta en el plan gratuito",
          "Memoria a largo plazo y contexto ampliado en los planes de pago"
        ]
      }
    ],
    stepsTitle: "¿Cómo funciona en la práctica?",
    stepsSubtitle:
      "En pocos minutos pasas de la idea a un compañero de IA que realmente se siente tuyo.",
    steps: [
      {
        title: "1. Crea tu cuenta AmoriA",
        text: "Regístrate gratis, elige tu idioma y comparte algunos datos sobre ti."
      },
      {
        title: "2. Da forma a tu AmorIA",
        text: "Elige su energía, su tono y lo que esperas de él o de ella cada día."
      },
      {
        title: "3. Empieza a conversar",
        text: "Chatea por texto con tu AmorIA gratis y pasa a voz si quieres intercambios más profundos."
      }
    ],
    faqTitle: "Preguntas sobre las funciones",
    faqSubtitle:
      "Así funciona AmoriA en tu día a día. Siempre podrás ajustar tu compañero de IA con el tiempo.",
    faqItems: [
      {
        q: "¿Mi AmorIA lo recuerda todo?",
        a: "En el plan gratuito, la memoria es corta. En los planes de pago, AmoriA puede conservar memoria a largo plazo para seguir mejor tu historia."
      },
      {
        q: "¿Puedo cambiar la personalidad de mi AmorIA?",
        a: "Sí. Puedes ajustar su forma de hablarte, su tono y su rol (coach suave, amigo directo, compañero creativo, etc.) con el tiempo."
      },
      {
        q: "¿Puedo usar varios idiomas con el mismo AmorIA?",
        a: "Sí. AmoriA puede hablar contigo en francés, inglés o español. Puedes quedarte en un idioma o alternar entre varios."
      }
    ]
  }
};

// Helper: get locale from ?lang, default FR
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
  const t = FEATURE_STRINGS[locale];

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

  return (
    <main className="amoria-root">
      {/* HEADER – même style que vitrine/pricing, sans boutons de langue */}
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
          <a
            href="/features"
            className="amoria-nav-link amoria-nav-link--active"
          >
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

      {/* HERO FEATURES */}
      <section className="amoria-hero amoria-hero--features">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>

          <div className="amoria-hero-actions">
            <a
              href={buildSignupUrl()}
              className="amoria-btn amoria-btn--primary amoria-btn--big"
            >
              {t.heroCta}
            </a>
            <a
              href={buildPricingUrl()}
              className="amoria-btn amoria-btn--ghost amoria-btn--big"
            >
              {t.heroSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* 3 BIG BLOCKS */}
      <section className="amoria-section">
        <div className="amoria-feature-block-grid">
          <article className="amoria-feature-block">
            <h2 className="amoria-section-title">{t.block1Title}</h2>
            <p className="amoria-section-subtitle">{t.block1Subtitle}</p>
          </article>
          <article className="amoria-feature-block">
            <h2 className="amoria-section-title">{t.block2Title}</h2>
            <p className="amoria-section-subtitle">{t.block2Subtitle}</p>
          </article>
          <article className="amoria-feature-block">
            <h2 className="amoria-section-title">{t.block3Title}</h2>
            <p className="amoria-section-subtitle">{t.block3Subtitle}</p>
          </article>
        </div>
      </section>

      {/* COLUMNS: WHAT YOU GET */}
      <section className="amoria-section amoria-section--features-grid">
        <h2 className="amoria-section-title">
          {locale === "fr"
            ? "Ce que tu peux faire avec AmorIA"
            : locale === "en"
            ? "What you can do with AmorIA"
            : "Lo que puedes hacer con AmorIA"}
        </h2>
        <p className="amoria-section-text">{t.faqSubtitle}</p>

        <div className="amoria-feature-grid">
          {t.featureColumns.map((col, idx) => (
            <article key={idx} className="amoria-feature-card">
              <h3 className="amoria-feature-card-title">{col.title}</h3>
              <ul className="amoria-feature-card-list">
                {col.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="amoria-section amoria-section--steps">
        <h2 className="amoria-section-title">{t.stepsTitle}</h2>
        <p className="amoria-section-subtitle">{t.stepsSubtitle}</p>

        <div className="amoria-steps-grid">
          {t.steps.map((step, idx) => (
            <div key={idx} className="amoria-step-card">
              <div className="amoria-step-number">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </div>
              <h3 className="amoria-step-title">{step.title}</h3>
              <p className="amoria-step-text">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ FEATURES */}
      <section className="amoria-section amoria-section--faq">
        <h2 className="amoria-section-title">{t.faqTitle}</h2>
        <p className="amoria-section-subtitle">{t.faqSubtitle}</p>

        <div className="amoria-faq-grid">
          {t.faqItems.map((item, idx) => (
            <div key={idx} className="amoria-faq-item">
              <h3 className="amoria-faq-question">{item.q}</h3>
              <p className="amoria-faq-answer">{item.a}</p>
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

      {/* STYLES – mêmes couleurs / nouvelles sections */}
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
          padding: 1.5rem 1.5rem 0.5rem;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr);
          gap: 1.5rem;
        }

        .amoria-hero--features {
          grid-template-columns: minmax(0, 1.4fr);
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

        .amoria-hero-actions {
          margin-top: 0.6rem;
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
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

        .amoria-section-subtitle,
        .amoria-section-text {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          max-width: 40rem;
          margin-bottom: 1.4rem;
        }

        .amoria-section--features-grid {
          text-align: left;
        }

        .amoria-section--steps {
          border-top: 1px solid rgba(148, 163, 184, 0.3);
          padding-top: 2.5rem;
        }

        /* FEATURE BLOCKS (3 big) */
        .amoria-feature-block-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.4rem;
        }

        .amoria-feature-block {
          background: rgba(15, 23, 42, 0.85);
          border-radius: 1.2rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1rem 1.1rem;
        }

        /* FEATURE GRID */
        .amoria-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.4rem;
          margin-top: 1.4rem;
        }

        .amoria-feature-card {
          background: radial-gradient(circle at top, #020617, #020617 40%, #000 100%);
          border-radius: 1.2rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 1rem 1.1rem 1.1rem;
        }

        .amoria-feature-card-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.6rem;
        }

        .amoria-feature-card-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        .amoria-feature-card-list li::before {
          content: "• ";
          color: #a5b4fc;
        }

        /* STEPS */
        .amoria-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.4rem;
        }

        .amoria-step-card {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 1.2rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .amoria-step-number {
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a5b4fc;
        }

        .amoria-step-title {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .amoria-step-text {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        /* FAQ (reuse base from pricing) */
        .amoria-section--faq {
          border-top: 1px solid rgba(148, 163, 184, 0.3);
          padding-top: 2.5rem;
        }

        .amoria-faq-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.4rem;
        }

        .amoria-faq-item {
          background: rgba(15, 23, 42, 0.8);
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          padding: 0.9rem 1rem;
        }

        .amoria-faq-question {
          font-size: 0.9rem;
          margin-bottom: 0.4rem;
        }

        .amoria-faq-answer {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
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

          .amoria-hero,
          .amoria-section {
            padding-inline: 1rem;
          }

          .amoria-feature-block-grid,
          .amoria-feature-grid,
          .amoria-steps-grid,
          .amoria-faq-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 640px) {
          .amoria-nav-right a.amoria-nav-btn--ghost {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
