"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type LegalCopy = {
  brandTagline: string;
  pageTitle: string;
  pageIntro: string;
  publisherTitle: string;
  publisherNameLine: string;
  publisherResponsibleLine: string;
  contactTitle: string;
  contactLine: string;
  footerCopy: string;
  footerLinks: {
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    about: string;
  };
};

const STRINGS: Record<Locale, LegalCopy> = {
  fr: {
    brandTagline: "Partenaire IA bienveillante • FR / EN / ES",
    pageTitle: "Mentions légales",
    pageIntro:
      "Ces informations concernent l’utilisation du site et de l’application AmorIA.app.",
    publisherTitle: "Éditeur",
    publisherNameLine: "AmorIA.app — Canada",
    publisherResponsibleLine:
      "Responsable de la publication : Les Entreprises Kema inc.",
    contactTitle: "Contact",
    contactLine:
      "Pour toute question légale : contactamoriai@gmail.com",
    footerCopy: "© 2025 AmorIA.app — Tous droits réservés.",
    footerLinks: {
      legal: "Mentions légales",
      privacy: "Confidentialité",
      terms: "Conditions d’utilisation",
      contact: "Contact",
      about: "À propos",
    },
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    pageTitle: "Legal notice",
    pageIntro:
      "This information relates to the use of the AmorIA.app website and application.",
    publisherTitle: "Publisher",
    publisherNameLine: "AmorIA.app — Canada",
    publisherResponsibleLine:
      "Publication manager: Les Entreprises Kema inc.",
    contactTitle: "Contact",
    contactLine:
      "For any legal question: contactamoriai@gmail.com",
    footerCopy: "© 2025 AmorIA.app — All rights reserved.",
    footerLinks: {
      legal: "Legal notice",
      privacy: "Privacy policy",
      terms: "Terms of use",
      contact: "Contact",
      about: "About",
    },
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    pageTitle: "Aviso legal",
    pageIntro:
      "Esta información se refiere al uso del sitio web y de la aplicación AmorIA.app.",
    publisherTitle: "Editor",
    publisherNameLine: "AmorIA.app — Canadá",
    publisherResponsibleLine:
      "Responsable de la publicación: Les Entreprises Kema inc.",
    contactTitle: "Contacto",
    contactLine:
      "Para cualquier pregunta legal: contactamoriai@gmail.com",
    footerCopy: "© 2025 AmorIA.app — Todos los derechos reservados.",
    footerLinks: {
      legal: "Aviso legal",
      privacy: "Política de privacidad",
      terms: "Condiciones de uso",
      contact: "Contacto",
      about: "Acerca de",
    },
  },
};

// récupère la langue depuis ?lang=fr|en|es, par défaut fr
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
  const t = STRINGS[locale];

  // helper pour garder ?lang=xx dans tous les liens
  const withLang = (path: string) => `${path}?lang=${locale}`;

  return (
    <main className="amoria-root">
      {/* HEADER avec le même logo que la vitrine */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          {/* Logo complet transparent */}
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIA.app"
            className="amoria-logo-full"
          />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmorIA.app</div>
            <div className="amoria-logo-tagline">{t.brandTagline}</div>
          </div>
        </div>
      </header>

      {/* CONTENU MENTIONS LÉGALES */}
      <section className="amoria-legal-section">
        <h1 className="amoria-legal-title">{t.pageTitle}</h1>
        <p className="amoria-legal-intro">{t.pageIntro}</p>

        <div className="amoria-legal-block">
          <h2>{t.publisherTitle}</h2>
          <p>{t.publisherNameLine}</p>
          <p>{t.publisherResponsibleLine}</p>
        </div>

        <div className="amoria-legal-block">
          <h2>{t.contactTitle}</h2>
          <p>{t.contactLine}</p>
        </div>
      </section>

      {/* FOOTER AVEC LIENS LÉGAUX */}
      <footer className="amoria-footer">
        <div className="amoria-footer-top">
          <span>{t.footerCopy}</span>
        </div>
        <div className="amoria-footer-links">
          <a href={withLang("/legal")} className="amoria-footer-link">
            {t.footerLinks.legal}
          </a>
          <a
            href={withLang("/legal/privacy")}
            className="amoria-footer-link"
          >
            {t.footerLinks.privacy}
          </a>
          <a
            href={withLang("/legal/terms")}
            className="amoria-footer-link"
          >
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

      {/* STYLES – simplifiés mais cohérents avec la vitrine */}
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
          background: radial-gradient(
            circle at top,
            #020617 0,
            #020617 40%,
            #000 100%
          );
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
          padding: 1.5rem 1.5rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .amoria-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
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
          font-size: 1rem;
        }

        .amoria-logo-tagline {
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
        }

        /* CONTENU LEGAL */
        .amoria-legal-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 2rem 1.5rem 2.5rem;
        }

        .amoria-legal-title {
          font-size: 1.4rem;
          margin-bottom: 0.6rem;
        }

        .amoria-legal-intro {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          margin-bottom: 1.6rem;
          max-width: 40rem;
        }

        .amoria-legal-block {
          margin-bottom: 1.4rem;
        }

        .amoria-legal-block h2 {
          font-size: 0.98rem;
          margin-bottom: 0.3rem;
        }

        .amoria-legal-block p {
          font-size: 0.85rem;
          color: var(--amoria-text-main);
          margin: 0.15rem 0;
        }

        /* FOOTER */
        .amoria-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
        }

        .amoria-footer-top {
          margin-bottom: 0.4rem;
        }

        .amoria-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .amoria-footer-link {
          color: #fb37ff;
          text-decoration: none;
          font-size: 0.78rem;
        }

        .amoria-footer-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .amoria-header {
            padding-inline: 1rem;
          }
          .amoria-legal-section {
            padding-inline: 1rem;
          }
          .amoria-footer {
            padding-inline: 1rem;
          }
        }
      `}</style>
    </main>
  );
}
