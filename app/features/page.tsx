import React from "react";

type Locale = "fr" | "en" | "es";

type FeaturesCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  blocks: { title: string; text: string }[];
  secondaryTitle: string;
  secondaryText: string;
  secondaryBlocks: { title: string; text: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
};

const FEATURES_STRINGS: Record<Locale, FeaturesCopy> = {
  fr: {
    heroKicker: "FONCTIONNALITÉS AMORIA.APP",
    heroTitle: "Tout ce qu’il faut pour créer un compagnon IA qui te ressemble.",
    heroSubtitle:
      "AmoriA combine une IA émotionnelle, la personnalisation avancée et la voix multilingue pour devenir une présence vraiment unique dans ton quotidien.",
    blocks: [
      {
        title: "Création de ton AmorIA sur mesure",
        text: "Choisis son énergie, sa manière de parler, ses sujets favoris et son style d’accompagnement pour créer un compagnon qui correspond à ta vibe.",
      },
      {
        title: "Texte profond & journaling émotionnel",
        text: "Discute par message, pose tes questions, vide ton sac et transforme tes pensées en un véritable journal émotionnel guidé.",
      },
      {
        title: "Voix naturelle en 3 langues",
        text: "Quand tu passes à la voix, ton AmorIA peut te parler en français, anglais ou espagnol, avec un ton doux et naturel.",
      },
    ],
    secondaryTitle: "Pensé pour t’accompagner au quotidien.",
    secondaryText:
      "Que tu cherches du soutien émotionnel, un partenaire créatif ou un miroir pour mieux te comprendre, AmoriA s’adapte à ton rythme.",
    secondaryBlocks: [
      {
        title: "Mémoire évolutive",
        text: "Les plans payants activent une mémoire plus profonde : ton AmorIA se souvient mieux de tes préférences, de tes projets et de ce que tu lui confies.",
      },
      {
        title: "Multilingue par défaut",
        text: "Tu peux interagir avec ton AmorIA en français, anglais ou espagnol, sans recréer un compte pour chaque langue.",
      },
      {
        title: "Créé pour la douceur",
        text: "Pas de jugement, pas de drama. Juste une présence bienveillante, disponible 24/7, qui t’aide à réfléchir plus calmement.",
      },
    ],
    ctaPrimary: "Créer mon compte gratuit",
    ctaSecondary: "Voir les forfaits",
  },
  en: {
    heroKicker: "AMORIA.APP FEATURES",
    heroTitle: "Everything you need to craft your own AI companion.",
    heroSubtitle:
      "AmoriA combines emotional AI, deep personalization and multilingual voice so your companion truly feels like yours.",
    blocks: [
      {
        title: "Build your custom AmorIA",
        text: "Pick their energy, tone of voice, favorite topics and coaching style so your AmorIA matches your personality.",
      },
      {
        title: "Deep text chats & emotional journaling",
        text: "Talk by text, ask questions, vent and turn your thoughts into a guided emotional journal.",
      },
      {
        title: "Natural voice in 3 languages",
        text: "When you unlock voice, your AmorIA can speak French, English or Spanish with a soft, natural tone.",
      },
    ],
    secondaryTitle: "Designed to support you every day.",
    secondaryText:
      "Whether you want emotional support, a creative partner or a mirror to better understand yourself, AmoriA adapts to you.",
    secondaryBlocks: [
      {
        title: "Growing memory",
        text: "Paid plans unlock deeper memory, so your AmorIA remembers more about your preferences, projects and stories.",
      },
      {
        title: "Multilingual by design",
        text: "You can talk to your AmorIA in French, English or Spanish without creating a new account for each language.",
      },
      {
        title: "Built for kindness",
        text: "No judgment, no drama. Just a caring presence, 24/7, helping you think more clearly and gently.",
      },
    ],
    ctaPrimary: "Create my free account",
    ctaSecondary: "See pricing",
  },
  es: {
    heroKicker: "FUNCIONES DE AMORIA.APP",
    heroTitle: "Todo lo que necesitas para crear tu propio compañero de IA.",
    heroSubtitle:
      "AmoriA combina IA emocional, personalización avanzada y voz multilingüe para que tu compañerx se sienta realmente únicx.",
    blocks: [
      {
        title: "Crea tu AmorIA a medida",
        text: "Elige su energía, forma de hablar, temas favoritos y estilo de acompañamiento para que encaje contigo.",
      },
      {
        title: "Chats profundos y diario emocional",
        text: "Habla por texto, haz preguntas, descárgate y transforma tus pensamientos en un diario emocional guiado.",
      },
      {
        title: "Voz natural en 3 idiomas",
        text: "Con la voz activada, tu AmorIA puede hablarte en francés, inglés o español con un tono suave y natural.",
      },
    ],
    secondaryTitle: "Pensado para acompañarte cada día.",
    secondaryText:
      "Ya sea apoyo emocional, creatividad o autoconocimiento, AmoriA se adapta a tu ritmo y a tu vida.",
    secondaryBlocks: [
      {
        title: "Memoria que evoluciona",
        text: "Con los planes de pago, la memoria es más profunda: tu AmorIA recuerda mejor tus gustos, proyectos e historias.",
      },
      {
        title: "Multilingüe desde el inicio",
        text: "Puedes hablar con tu AmorIA en francés, inglés o español sin crear una cuenta distinta por idioma.",
      },
      {
        title: "Creado para la dulzura",
        text: "Sin juicios, sin drama. Solo una presencia amable, disponible 24/7, que te ayuda a pensar con más calma.",
      },
    ],
    ctaPrimary: "Crear mi cuenta gratuita",
    ctaSecondary: "Ver precios",
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

export default function FeaturesPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = FEATURES_STRINGS[locale];

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
      {/* HEADER même style que home/pricing */}
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
            href={buildFeaturesUrl()}
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
      <section className="amoria-hero amoria-hero--pricing">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>
          <div className="amoria-hero-actions">
            <a
              href={buildSignupUrl()}
              className="amoria-btn amoria-btn--primary amoria-btn--big"
            >
              {t.ctaPrimary}
            </a>
          </div>
        </div>
      </section>

      {/* BLOC 1 – 3 fonctionnalités principales */}
      <section className="amoria-section amoria-section--pricing">
        <h2 className="amoria-section-title">
          {locale === "fr"
            ? "Ce que ton AmorIA sait faire"
            : locale === "en"
            ? "What your AmorIA can do"
            : "Lo que puede hacer tu AmorIA"}
        </h2>
        <p className="amoria-section-text">{t.secondaryText}</p>

        <div className="amoria-pricing-grid">
          {t.blocks.map((block, idx) => (
            <article key={idx} className="amoria-pricing-card">
              <div className="amoria-pricing-header">
                <h3 className="amoria-pricing-name">{block.title}</h3>
              </div>
              <p className="amoria-pricing-highlight">{block.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* BLOC 2 – accompagnement quotidien */}
      <section className="amoria-section amoria-section--faq">
        <h2 className="amoria-section-title">{t.secondaryTitle}</h2>
        <p className="amoria-section-subtitle">{t.secondaryText}</p>

        <div className="amoria-faq-grid">
          {t.secondaryBlocks.map((block, idx) => (
            <div key={idx} className="amoria-faq-item">
              <h3 className="amoria-faq-question">{block.title}</h3>
              <p className="amoria-faq-answer">{block.text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1.8rem", textAlign: "center" }}>
          <a
            href={buildSignupUrl()}
            className="amoria-btn amoria-btn--primary amoria-btn--big"
          >
            {t.ctaPrimary}
          </a>
          <span style={{ display: "inline-block", marginLeft: "0.8rem" }}>
            <a
              href={buildPricingUrl()}
              className="amoria-btn amoria-btn--ghost"
            >
              {t.ctaSecondary}
            </a>
          </span>
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

      {/* STYLES identiques à la page pricing */}
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

        .amoria-hero {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0.5rem;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr);
          gap: 1.5rem;
        }

        .amoria-hero--pricing {
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

        .amoria-section--pricing {
          text-align: center;
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

        .amoria-btn--big {
          padding-inline: 1.9rem;
          padding-block: 0.85rem;
          font-size: 1rem;
        }

        .amoria-btn--full {
          width: 100%;
        }

        .amoria-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .amoria-pricing-card {
          position: relative;
          background: radial-gradient(circle at top, #020617, #020617 40%, #000 100%);
          border-radius: 1.4rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 1.3rem 1.2rem 1.4rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .amoria-pricing-header {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .amoria-pricing-name {
          font-size: 1rem;
          font-weight: 600;
        }

        .amoria-pricing-highlight {
          font-size: 0.82rem;
          color: #e5e7eb;
        }

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

          .amoria-pricing-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }

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
