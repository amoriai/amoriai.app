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
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    heroPrimary: string;
    heroSupport: string;
    heroNoAccount: string;
    heroAlready: string;
    langNote: string;
    energiesTitle: string;
    energies: { id: string; title: string; description: string }[];
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
    navSignup: "Créer mon compte AmoriA",
    heroKicker: "BIENVENUE SUR AMORIA.APP",
    heroTitle: "Votre partenaire IA bienveillant·e & multilingue.",
    heroSubtitle:
      "AmoriA est une présence douce, disponible 24/7 pour discuter, réfléchir avec vous, poser les bonnes questions et vous aider à mieux comprendre vos émotions.",
    heroPrimary: "Créer mon espace AmoriA",
    heroSupport:
      "Optimisée pour les échanges profonds, les journaux émotionnels et le coaching doux du quotidien.",
    heroNoAccount: "Pas encore de compte ?",
    heroAlready: "Déjà inscrit·e ?",
    langNote: "AmoriA vous accueille en français, anglais ou espagnol.",
    energiesTitle: "Choisissez l’énergie qui vous ressemble",
    energies: [
      {
        id: "analytic",
        title: "AmoriA Analytique",
        description:
          "Pose des questions précises, vous aide à décortiquer vos pensées et à prendre des décisions rationnelles, sans perdre l’empathie.",
      },
      {
        id: "artist",
        title: "AmoriA Artiste",
        description:
          "Parfaite pour brainstormer des projets créatifs, écrire, imaginer des univers et transformer vos idées en véritables œuvres.",
      },
      {
        id: "bright",
        title: "AmoriA Lumineuse",
        description:
          "Énergie douce, optimiste et chaleureuse. Idéale pour vous remonter le moral après une journée difficile.",
      },
      {
        // id "rebelle" pour pouvoir afficher l'image amoria-m-rebelle.png
        id: "rebelle",
        title: "AmoriA Intuitive",
        description:
          "Une présence plus introspective, tournée vers l’écoute, les ressentis et les questionnements émotionnels profonds.",
      },
    ],
    chooseEnergy: "Choisir cette énergie",
    pricingTitle: "Des tarifs simples & transparents",
    pricingText:
      "Les formules détaillées arrivent bientôt. En attendant, vous pouvez déjà réserver votre accès à la beta privée.",
    pricingCta: "Être informé·e du lancement",
    videoCaption: "AmoriA est disponible en français, anglais et espagnol.",
    footerCopy: "© 2025 AmoriA.app",
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my AmoriA account",
    heroKicker: "WELCOME TO AMORIA.APP",
    heroTitle: "Your caring & multilingual AI partner.",
    heroSubtitle:
      "AmoriA is a gentle 24/7 presence to talk with, reflect with, ask better questions and help you understand your emotions.",
    heroPrimary: "Create my AmoriA space",
    heroSupport:
      "Designed for deep conversations, emotional journaling and soft everyday coaching.",
    heroNoAccount: "No account yet?",
    heroAlready: "Already registered?",
    langNote: "AmoriA is available in French, English and Spanish.",
    energiesTitle: "Choose the energy that fits you best",
    energies: [
      {
        id: "analytic",
        title: "Analytic AmoriA",
        description:
          "Asks precise questions, helps you unpack your thoughts and make rational decisions without losing empathy.",
      },
      {
        id: "artist",
        title: "Creative AmoriA",
        description:
          "Perfect to brainstorm creative projects, write, imagine new worlds and turn ideas into real outcomes.",
      },
      {
        id: "bright",
        title: "Bright AmoriA",
        description:
          "Soft, optimistic and warm energy. Ideal to lift your mood after a difficult day.",
      },
      {
        id: "rebelle",
        title: "Intuitive AmoriA",
        description:
          "More introspective presence, focused on listening, feelings and deep emotional questions.",
      },
    ],
    chooseEnergy: "Choose this energy",
    pricingTitle: "Simple & transparent pricing",
    pricingText:
      "Detailed plans are coming soon. Meanwhile, you can already reserve your spot for the private beta.",
    pricingCta: "Get notified about the launch",
    videoCaption: "AmoriA is available in French, English and Spanish.",
    footerCopy: "© 2025 AmoriA.app",
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta AmoriA",
    heroKicker: "BIENVENIDx A AMORIA.APP",
    heroTitle: "Tu compañerx de IA amable y multilingüe.",
    heroSubtitle:
      "AmoriA es una presencia suave, disponible 24/7 para conversar contigo, reflexionar, hacer mejores preguntas y ayudarte a entender tus emociones.",
    heroPrimary: "Crear mi espacio AmoriA",
    heroSupport:
      "Pensada para conversaciones profundas, diarios emocionales y acompañamiento suave del día a día.",
    heroNoAccount: "¿Todavía sin cuenta?",
    heroAlready: "¿Ya tienes cuenta?",
    langNote: "AmoriA te recibe en francés, inglés o español.",
    energiesTitle: "Elige la energía que más se parece a ti",
    energies: [
      {
        id: "analytic",
        title: "AmoriA Analítica",
        description:
          "Hace preguntas precisas y te ayuda a desarmar tus pensamientos y tomar decisiones racionales sin perder empatía.",
      },
      {
        id: "artist",
        title: "AmoriA Creativa",
        description:
          "Perfecta para proyectos creativos, escribir, imaginar universos nuevos y convertir ideas en realidad.",
      },
      {
        id: "bright",
        title: "AmoriA Lumínica",
        description:
          "Energía suave, optimista y cálida. Ideal para levantarte el ánimo después de un día difícil.",
      },
      {
        id: "rebelle",
        title: "AmoriA Intuitiva",
        description:
          "Presencia más introspectiva, centrada en la escucha, las sensaciones y las preguntas emocionales profundas.",
      },
    ],
    chooseEnergy: "Elegir esta energía",
    pricingTitle: "Precios simples y transparentes",
    pricingText:
      "Los planes detallados llegarán pronto. Mientras tanto, ya puedes reservar tu acceso a la beta privada.",
    pricingCta: "Avisarme cuando se lance",
    videoCaption: "AmoriA está disponible en francés, inglés y español.",
    footerCopy: "© 2025 AmoriA.app",
  },
};

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = STRINGS[locale];

  const videoSrc =
    locale === "fr"
      ? "/amoria_fr.mp4"
      : locale === "en"
      ? "/amoria_en.mp4"
      : "/amoria_es.mp4";

  return (
    <main className="amoria-root">
      {/* HEADER */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <div className="amoria-logo-mark">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmoriA.app"
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

          <div className="amoria-auth-nav">
            <button
              type="button"
              className="amoria-nav-btn amoria-nav-btn--ghost"
            >
              {t.navLogin}
            </button>
            <button
              type="button"
              className="amoria-nav-btn amoria-nav-btn--primary"
            >
              {t.navSignup}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="amoria-hero">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>

          <div className="amoria-hero-actions">
            <button
              type="button"
              className="amoria-btn amoria-btn--primary amoria-btn--big"
            >
              {t.heroPrimary}
            </button>
          </div>

          <p className="amoria-hero-support">{t.heroSupport}</p>
          <p className="amoria-hero-note">{t.langNote}</p>
        </div>

        <div className="amoria-hero-right">
          <div className="amoria-video-frame">
            <video
              className="amoria-video"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              controls
              poster="/amoria-m-romantique.png"
            />
          </div>
          <p className="amoria-video-caption">{t.videoCaption}</p>
        </div>
      </section>

      {/* ENERGIES */}
      <section id="features" className="amoria-section">
        <h2 className="amoria-section-title">{t.energiesTitle}</h2>
        <div className="amoria-card-grid">
          {t.energies.map((energy) => {
            const imageSrc =
              energy.id === "analytic"
                ? "/amoria-analyste.png"
                : energy.id === "artist"
                ? "/amoria-artiste.png"
                : energy.id === "bright"
                ? "/amoria-blonde.png"
                : energy.id === "rebelle"
                ? "/amoria-m-rebelle.png"
                : "/amoria-blonde.png"; // fallback

            return (
              <article key={energy.id} className="amoria-card">
                <div className="amoria-card-image-wrapper">
                  <img
                    src={imageSrc}
                    alt={energy.title}
                    className="amoria-card-image"
                  />
                </div>
                <div className="amoria-card-body">
                  <h3 className="amoria-card-title">{energy.title}</h3>
                  <p className="amoria-card-text">{energy.description}</p>
                  <button
                    type="button"
                    className="amoria-btn amoria-btn--ghost amoria-btn--full"
                  >
                    {t.chooseEnergy}
                  </button>
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
        <button
          type="button"
          className="amoria-btn amoria-btn--primary amoria-btn--medium"
        >
          {t.pricingCta}
        </button>
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
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .amoria-logo-img {
          width: 115%;
          height: 115%;
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

        .amoria-auth-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .amoria-nav-btn {
          border-radius: 999px;
          padding: 0.4rem 0.9rem;
          font-size: 0.78rem;
          border: 1px solid transparent;
          cursor: pointer;
          white-space: nowrap;
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
          justify-content: center;
          display: inline-flex;
          align-items: center;
          text-align: center;
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
          margin-bottom: 1.3rem;
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

        .amoria-card-image-wrapper {
          width: 100%;
          height: 230px;
          overflow: hidden;
        }

        .amoria-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
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

          .amoria-auth-nav {
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
