"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type LegalCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  publisherTitle: string;
  publisherBody: string;
  contactTitle: string;
  contactBody: string;
};

const LEGAL_STRINGS: Record<Locale, LegalCopy> = {
  fr: {
    heroKicker: "MENTIONS LÉGALES",
    heroTitle: "Informations légales d’AmorIA.app",
    heroSubtitle:
      "Ces informations concernent l’utilisation du site et de l’application AmorIA.app.",
    publisherTitle: "Éditeur",
    publisherBody:
      "AmorIA.app — Canada\nResponsable de la publication : Les Entreprises Kema inc.",
    contactTitle: "Contact",
    contactBody:
      "Pour toute question légale concernant AmorIA.app :\n• contactamoriai@gmail.com",
  },
  en: {
    heroKicker: "LEGAL NOTICE",
    heroTitle: "Legal information for AmorIA.app",
    heroSubtitle:
      "These details relate to the use of the AmorIA.app website and application.",
    publisherTitle: "Publisher",
    publisherBody:
      "AmorIA.app — Canada\nPublication manager: Les Entreprises Kema inc.",
    contactTitle: "Contact",
    contactBody:
      "For any legal question about AmorIA.app:\n• contactamoriai@gmail.com",
  },
  es: {
    heroKicker: "AVISO LEGAL",
    heroTitle: "Información legal de AmorIA.app",
    heroSubtitle:
      "Esta información se refiere al uso del sitio web y la aplicación AmorIA.app.",
    publisherTitle: "Editor",
    publisherBody:
      "AmorIA.app — Canadá\nResponsable de la publicación: Les Entreprises Kema inc.",
    contactTitle: "Contacto",
    contactBody:
      "Para cualquier pregunta legal sobre AmorIA.app:\n• contactamoriai@gmail.com",
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

export default function LegalPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = LEGAL_STRINGS[locale];

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

  const navHome =
    locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "Inicio";
  const navFeatures =
    locale === "fr"
      ? "Fonctionnalités"
      : locale === "en"
      ? "Features"
      : "Funciones";
  const navPricing =
    locale === "fr" ? "Tarifs" : locale === "en" ? "Pricing" : "Precios";
  const loginLabel =
    locale === "fr"
      ? "Me connecter"
      : locale === "en"
      ? "Log in"
      : "Iniciar sesión";
  const signupLabel =
    locale === "fr"
      ? "Créer mon compte gratuit"
      : locale === "en"
      ? "Create my free account"
      : "Crear mi cuenta gratuita";

  return (
    <main className="amoria-root">
      {/* HEADER (même logo que la vitrine) */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIA.app"
            className="amoria-logo-full"
          />

          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmorIA.app</div>
            <div className="amoria-logo-tagline">
              Partenaire IA bienveillante • FR / EN / ES
            </div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={buildHomeUrl()} className="amoria-nav-link">
            {navHome}
          </a>
          <a href={buildFeaturesUrl()} className="amoria-nav-link">
            {navFeatures}
          </a>
          <a href={buildPricingUrl()} className="amoria-nav-link">
            {navPricing}
          </a>
          <span className="amoria-nav-link amoria-nav-link--active">
            {locale === "fr"
              ? "Mentions légales"
              : locale === "en"
              ? "Legal notice"
              : "Aviso legal"}
          </span>
        </nav>

        <div className="amoria-nav-right">
          <a
            href={buildLoginUrl()}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {loginLabel}
          </a>
          <a
            href={buildSignupUrl()}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {signupLabel}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="amoria-hero amoria-hero--legal">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="amoria-section amoria-section--legal">
        <div className="amoria-legal-grid">
          <article className="amoria-legal-block">
            <h2 className="amoria-legal-title">{t.publisherTitle}</h2>
            <p className="amoria-legal-text">{t.publisherBody}</p>
          </article>

          <article className="amoria-legal-block">
            <h2 className="amoria-legal-title">{t.contactTitle}</h2>
            <p className="amoria-legal-text">{t.contactBody}</p>
          </article>
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

      {/* STYLES communs */}
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

        .amoria-logo-full {
          height: 40px;
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
        }

        .amoria-hero--legal {
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
          max-width: 40rem;
        }

        .amoria-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-section--legal {
          padding-top: 1rem;
        }

        .amoria-legal-grid {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .amoria-legal-block {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 1.1rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1rem 1.2rem;
        }

        .amoria-legal-title {
          font-size: 1rem;
          margin-bottom: 0.4rem;
        }

        .amoria-legal-text {
          font-size: 0.86rem;
          color: var(--amoria-text-muted);
          white-space: pre-line;
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
        }
      `}</style>
    </main>
  );
}
