"use client";

import { useState } from "react";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<Locale, any> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    heroEyebrow: "Bienvenue sur AmoriA.app",
    heroTitle: "Votre partenaire IA bienveillant·e & multilingue.",
    heroSubtitle:
      "AmoriA est une présence douce, disponible 24/7 pour discuter, réfléchir avec vous, poser les bonnes questions et vous aider à mieux comprendre vos émotions.",
    heroNote:
      "Optimisée pour les échanges profonds, les journaux émotionnels et le coaching doux du quotidien.",
    heroPrimary: "Créer mon compte AmoriA",
    heroSecondary: "Me connecter",
    heroLangLine: "AmoriA vous accueille en français, anglais ou espagnol.",
    personasTitle: "Choisissez l’énergie qui vous ressemble",
    personas: [
      {
        key: "analytique",
        title: "AmorIA Analytique",
        desc: "Pose des questions précises, vous aide à décortiquer vos pensées et à prendre des décisions rationnelles, sans perdre l’empathie.",
        image: "/amoria-analyste.png",
      },
      {
        key: "artiste",
        title: "AmorIA Artiste",
        desc: "Parfaite pour brainstormer des projets créatifs, écrire, imaginer des univers et transformer vos idées en véritables œuvres.",
        image: "/amoria-artiste.png",
      },
      {
        key: "lumineuse",
        title: "AmorIA Lumineuse",
        desc: "Énergie douce, optimiste et chaleureuse. Idéale pour vous remonter le moral après une journée difficile.",
        image: "/amoria-blonde.png",
      },
      {
        key: "intuitive",
        title: "AmorIA Intuitive",
        desc: "Une présence plus introspective, tournée vers l’écoute, les ressentis et les questionnements émotionnels profonds.",
        image: "/amoria-rousse.png",
      },
    ],
    personaCta: "Choisir cette énergie",
    footerLeft: "© 2025 AmoriA.app",
    footerRight: "Créé avec bienveillance au Québec",
    authHint:
      "Pas encore de compte ? Créez votre espace AmoriA en quelques clics. Déjà inscrit·e ? Connectez-vous pour retrouver vos échanges.",
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    heroEyebrow: "Welcome to AmoriA.app",
    heroTitle: "Your caring & multilingual AI partner.",
    heroSubtitle:
      "AmoriA is a gentle 24/7 presence to talk with, reflect with, ask better questions and help you understand your emotions.",
    heroNote:
      "Designed for deep conversations, emotional journaling and soft everyday coaching.",
    heroPrimary: "Create my AmoriA account",
    heroSecondary: "Log in",
    heroLangLine: "AmoriA is available in French, English and Spanish.",
    personasTitle: "Choose the energy that feels like you",
    personas: [
      {
        key: "analytical",
        title: "AmorIA Analytical",
        desc: "Asks precise questions, helps you unpack your thoughts and make rational decisions without losing empathy.",
        image: "/amoria-analyste.png",
      },
      {
        key: "creative",
        title: "AmorIA Creative",
        desc: "Perfect to brainstorm creative projects, write stories, imagine new worlds and turn your ideas into reality.",
        image: "/amoria-artiste.png",
      },
      {
        key: "bright",
        title: "AmorIA Bright",
        desc: "Soft, optimistic and warm energy. Ideal when you need comfort and a little boost after a hard day.",
        image: "/amoria-blonde.png",
      },
      {
        key: "intuitive",
        title: "AmorIA Intuitive",
        desc: "More introspective, focused on listening, feelings and deeper emotional questions.",
        image: "/amoria-rousse.png",
      },
    ],
    personaCta: "Choose this energy",
    footerLeft: "© 2025 AmoriA.app",
    footerRight: "Created with care in Québec",
    authHint:
      "No account yet? Create your AmoriA space in a few clicks. Already registered? Log in to continue your conversations.",
  },
  es: {
    brandTagline: "Compañerx IA amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    heroEyebrow: "Bienvenid·x a AmoriA.app",
    heroTitle: "Tu compañerx de IA amable y multilingüe.",
    heroSubtitle:
      "AmoriA es una presencia suave, disponible 24/7 para conversar contigo, reflexionar, hacerte mejores preguntas y ayudarte a comprender tus emociones.",
    heroNote:
      "Optimizada para conversaciones profundas, diarios emocionales y acompañamiento cotidiano.",
    heroPrimary: "Crear mi cuenta AmoriA",
    heroSecondary: "Iniciar sesión",
    heroLangLine: "AmoriA te acompaña en francés, inglés y español.",
    personasTitle: "Elige la energía que va contigo",
    personas: [
      {
        key: "analitica",
        title: "AmorIA Analítica",
        desc: "Hace preguntas precisas, te ayuda a ordenar tus ideas y tomar decisiones racionales sin perder la empatía.",
        image: "/amoria-analyste.png",
      },
      {
        key: "artista",
        title: "AmorIA Artista",
        desc: "Perfecta para proyectos creativos, escribir historias, imaginar universos y dar forma a tus ideas.",
        image: "/amoria-artiste.png",
      },
      {
        key: "luminosa",
        title: "AmorIA Luminosa",
        desc: "Energía suave, optimista y cálida. Ideal para levantar el ánimo después de un día difícil.",
        image: "/amoria-blonde.png",
      },
      {
        key: "intuitiva",
        title: "AmorIA Intuitiva",
        desc: "Más introspectiva, centrada en la escucha, las sensaciones y las preguntas emocionales profundas.",
        image: "/amoria-rousse.png",
      },
    ],
    personaCta: "Elegir esta energía",
    footerLeft: "© 2025 AmoriA.app",
    footerRight: "Creado con cariño en Quebec",
    authHint:
      "¿Todavía no tienes cuenta? Crea tu espacio AmoriA en pocos clics. ¿Ya estás registrad·x? Inicia sesión para retomar tus conversaciones.",
  },
};

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = STRINGS[locale];

  const videoSrc =
    locale === "fr"
      ? "/amoria_fr.mp4"
      : locale === "en"
      ? "/amoria_en.mp4"
      : "/amoria_es.mp4";

  return (
    <div className="amoria-page">
      {/* NAVBAR */}
      <header className="amoria-nav-wrapper">
        <div className="amoria-nav">
          <div className="amoria-brand">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmoriA logo"
              className="amoria-logo"
            />
            <div className="amoria-brand-text">
              <span className="amoria-brand-name">AmoriA.app</span>
              <span className="amoria-brand-tagline">{t.brandTagline}</span>
            </div>
          </div>

          <nav className="amoria-nav-links">
            <a href="#top" className="amoria-nav-link">
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
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="amoria-main" id="top">
        {/* HERO */}
        <section className="amoria-hero">
          <div className="amoria-hero-grid">
            <div className="amoria-hero-text">
              <p className="amoria-hero-eyebrow">{t.heroEyebrow}</p>
              <h1 className="amoria-hero-title">{t.heroTitle}</h1>
              <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>

              <div className="amoria-hero-actions">
                <button type="button" className="amoria-btn amoria-btn--primary">
                  {t.heroPrimary}
                </button>
                <button
                  type="button"
                  className="amoria-btn amoria-btn--secondary"
                >
                  {t.heroSecondary}
                </button>
              </div>

              <p className="amoria-hero-note">{t.heroNote}</p>
              <p className="amoria-auth-hint">{t.authHint}</p>
            </div>

            <div className="amoria-hero-media">
              <div className="amoria-hero-video-wrapper">
                <div className="amoria-hero-video-border">
                  <video
                    className="amoria-hero-video"
                    src={videoSrc}
                    controls
                    playsInline
                    poster="/amoria-rousse.png"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="amoria-hero-langline">{t.heroLangLine}</p>
              </div>
            </div>
          </div>
        </section>

        {/* PERSONAS */}
        <section className="amoria-section amoria-section-personas" id="features">
          <h2 className="amoria-section-title">{t.personasTitle}</h2>

          <div className="amoria-personas-grid">
            {t.personas.map((persona: any) => (
              <article key={persona.key} className="amoria-persona-card">
                <div className="amoria-persona-image-wrapper">
                  <img
                    src={persona.image}
                    alt={persona.title}
                    className="amoria-persona-image"
                  />
                </div>
                <div className="amoria-persona-body">
                  <h3 className="amoria-persona-title">{persona.title}</h3>
                  <p className="amoria-persona-desc">{persona.desc}</p>
                  <button
                    type="button"
                    className="amoria-btn amoria-btn--ghost"
                  >
                    {t.personaCta}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PLACEHOLDER TARIFS */}
        <section className="amoria-section" id="pricing">
          <h2 className="amoria-section-title">
            {locale === "fr"
              ? "Tarifs simples & transparents"
              : locale === "en"
              ? "Simple & transparent pricing"
              : "Precios simples y transparentes"}
          </h2>
          <p className="amoria-section-subtitle">
            {locale === "fr"
              ? "Les plans détaillés arrivent bientôt. En attendant, vous pouvez déjà réserver votre accès à la beta privée."
              : locale === "en"
              ? "Detailed plans are coming soon. For now, you can reserve your spot for the private beta."
              : "Los planes detallados llegarán pronto. Mientras tanto, puedes reservar tu acceso a la beta privada."}
          </p>
          <div className="amoria-pricing-placeholder">
            <button className="amoria-btn amoria-btn--primary" type="button">
              {locale === "fr"
                ? "Être informé·e du lancement"
                : locale === "en"
                ? "Get notified when we launch"
                : "Quiero saber cuándo se lanza"}
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="amoria-footer">
        <div className="amoria-footer-inner">
          <span>{t.footerLeft}</span>
          <span>•</span>
          <span>{t.footerRight} ♡</span>
        </div>
      </footer>

      {/* STYLES */}
      <style jsx global>{`
        :root {
          --amoria-bg: #020617;
          --amoria-bg-elevated: #020617;
          --amoria-surface: #020617;
          --amoria-surface-soft: #020617;
          --amoria-border-subtle: rgba(148, 163, 184, 0.35);
          --amoria-text-main: #e5e7eb;
          --amoria-text-muted: #9ca3af;
          --amoria-accent: #fb7185;
          --amoria-accent-2: #6366f1;
          --amoria-pill: #0f172a;
          --amoria-card-bg: #020617;
        }

        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
          background: radial-gradient(circle at top, #0f172a 0, #020617 55%);
          color: var(--amoria-text-main);
        }

        .amoria-page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0f172a 0, #020617 55%);
          color: var(--amoria-text-main);
        }

        .amoria-nav-wrapper {
          border-bottom: 1px solid rgba(148, 163, 184, 0.27);
          background: radial-gradient(circle at top, #020617 0, #020617 55%);
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .amoria-nav {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0.9rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .amoria-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }

        .amoria-logo {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          object-fit: contain;
          background: radial-gradient(circle at 30% 0%, #f97316, #ec4899 55%);
          padding: 2px;
        }

        .amoria-brand-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .amoria-brand-name {
          font-weight: 600;
          letter-spacing: 0.02em;
          font-size: 0.95rem;
        }

        .amoria-brand-tagline {
          font-size: 0.72rem;
          color: var(--amoria-text-muted);
        }

        .amoria-nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.9rem;
        }

        .amoria-nav-link {
          color: var(--amoria-text-muted);
          text-decoration: none;
          position: relative;
          padding-bottom: 0.15rem;
        }

        .amoria-nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(
            135deg,
            var(--amoria-accent),
            var(--amoria-accent-2)
          );
          transition: width 0.18s ease-out;
        }

        .amoria-nav-link:hover::after {
          width: 100%;
        }

        .amoria-nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .amoria-lang-switch {
          display: inline-flex;
          padding: 0.15rem;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.4);
        }

        .amoria-lang-pill {
          border: none;
          background: transparent;
          color: var(--amoria-text-muted);
          font-size: 0.75rem;
          padding: 0.15rem 0.6rem;
          border-radius: 999px;
          cursor: pointer;
        }

        .amoria-lang-pill--active {
          background: linear-gradient(
            135deg,
            rgba(251, 113, 133, 0.1),
            rgba(99, 102, 241, 0.2)
          );
          color: #f9fafb;
        }

        .amoria-main {
          max-width: 1120px;
          margin: 0 auto;
          padding: 2.75rem 1.5rem 3rem;
        }

        .amoria-hero {
          padding-bottom: 2.5rem;
        }

        .amoria-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 3rem;
          align-items: center;
        }

        .amoria-hero-text {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .amoria-hero-eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.7rem;
          color: #a5b4fc;
        }

        .amoria-hero-title {
          font-size: 2.25rem;
          line-height: 1.12;
          font-weight: 700;
        }

        .amoria-hero-subtitle {
          font-size: 0.98rem;
          color: var(--amoria-text-muted);
          max-width: 34rem;
        }

        .amoria-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .amoria-btn {
          border-radius: 999px;
          padding: 0.65rem 1.35rem;
          font-size: 0.9rem;
          border: 1px solid transparent;
          cursor: pointer;
          transition: transform 0.12s ease-out, box-shadow 0.12s ease-out,
            background 0.12s ease-out, border-color 0.12s ease-out;
          white-space: nowrap;
        }

        .amoria-btn--primary {
          background: linear-gradient(
            135deg,
            var(--amoria-accent),
            var(--amoria-accent-2)
          );
          color: #f9fafb;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.9);
        }

        .amoria-btn--primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 1);
        }

        .amoria-btn--secondary {
          background: rgba(15, 23, 42, 0.9);
          border-color: rgba(148, 163, 184, 0.55);
          color: var(--amoria-text-main);
        }

        .amoria-btn--secondary:hover {
          background: rgba(15, 23, 42, 1);
        }

        .amoria-btn--ghost {
          background: transparent;
          border-color: rgba(148, 163, 184, 0.5);
          color: var(--amoria-text-main);
          padding-inline: 1rem;
          padding-block: 0.55rem;
          width: 100%;
        }

        .amoria-btn--ghost:hover {
          background: rgba(15, 23, 42, 0.9);
        }

        .amoria-hero-note {
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
        }

        .amoria-auth-hint {
          font-size: 0.78rem;
          color: #e5e7eb;
          max-width: 32rem;
        }

        .amoria-hero-media {
          display: flex;
          justify-content: center;
        }

        .amoria-hero-video-wrapper {
          width: 100%;
          max-width: 360px;
        }

        .amoria-hero-video-border {
          padding: 0.5rem;
          border-radius: 1.5rem;
          background: linear-gradient(
            135deg,
            rgba(251, 113, 133, 0.6),
            rgba(99, 102, 241, 0.8)
          );
          box-shadow: 0 18px 36px rgba(15, 23, 42, 1);
        }

        .amoria-hero-video {
          width: 100%;
          height: 460px;
          border-radius: 1.25rem;
          display: block;
          object-fit: cover;
          object-position: center top;
          background: #020617;
        }

        .amoria-hero-langline {
          margin-top: 0.65rem;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          text-align: center;
        }

        .amoria-section {
          padding-top: 2.4rem;
        }

        .amoria-section-personas {
          border-top: 1px solid rgba(148, 163, 184, 0.35);
          margin-top: 1.5rem;
          padding-top: 2.5rem;
        }

        .amoria-section-title {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
        }

        .amoria-section-subtitle {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          max-width: 32rem;
        }

        .amoria-personas-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.3rem;
        }

        .amoria-persona-card {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 1.3rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.9);
        }

        .amoria-persona-image-wrapper {
          width: 100%;
          height: 220px;
          overflow: hidden;
        }

        .amoria-persona-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          display: block;
        }

        .amoria-persona-body {
          padding: 1rem 1.1rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          flex: 1;
        }

        .amoria-persona-title {
          font-size: 0.98rem;
          font-weight: 600;
        }

        .amoria-persona-desc {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
          flex: 1;
        }

        .amoria-pricing-placeholder {
          margin-top: 1.6rem;
        }

        .amoria-footer {
          border-top: 1px solid rgba(148, 163, 184, 0.3);
          padding: 1rem 1.5rem 1.2rem;
          margin-top: 0.5rem;
        }

        .amoria-footer-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          text-align: center;
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {
          .amoria-nav {
            flex-wrap: wrap;
          }

          .amoria-nav-links {
            display: none;
          }

          .amoria-hero-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 2rem;
          }

          .amoria-hero-media {
            order: -1;
          }

          .amoria-main {
            padding-inline: 1rem;
          }

          .amoria-personas-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .amoria-hero-title {
            font-size: 1.6rem;
          }

          .amoria-hero-video {
            height: 360px;
          }

          .amoria-personas-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
