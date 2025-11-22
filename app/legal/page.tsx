"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type LegalStrings = {
  brandTagline: string;
  pageTitle: string;
  introLine: string;
  editorLabel: string;
  editorValue: string;
  contactLabel: string;
  contactEmail: string;
  country: string;
  footerCopy: string;
  footerLinks: {
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    about: string;
  };
};

const STRINGS: Record<Locale, LegalStrings> = {
  fr: {
    brandTagline: "Partenaire IA bienveillante • FR / EN / ES",
    pageTitle: "Mentions légales",
    introLine:
      "Ces informations concernent l’utilisation du site AmoriA.app.",
    editorLabel: "Éditeur",
    editorValue: "AmoriA.app — Canada",
    contactLabel: "Contact",
    contactEmail: "contactamoriai@gmail.com",
    country: "Canada",
    footerCopy: "© 2025 AmoriA.app",
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
    introLine:
      "This information covers the use of the AmoriA.app website.",
    editorLabel: "Publisher",
    editorValue: "AmoriA.app — Canada",
    contactLabel: "Contact",
    contactEmail: "contactamoriai@gmail.com",
    country: "Canada",
    footerCopy: "© 2025 AmoriA.app",
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
    introLine:
      "Esta información se refiere al uso del sitio AmoriA.app.",
    editorLabel: "Editor",
    editorValue: "AmoriA.app — Canadá",
    contactLabel: "Contacto",
    contactEmail: "contactamoriai@gmail.com",
    country: "Canadá",
    footerCopy: "© 2025 AmoriA.app",
    footerLinks: {
      legal: "Aviso legal",
      privacy: "Confidencialidad",
      terms: "Condiciones de uso",
      contact: "Contacto",
      about: "Acerca de",
    },
  },
};

// Récupérer la langue depuis ?lang, défaut = fr
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

  const withLang = (path: string) => `${path}?lang=${locale}`;

  return (
    <main className="amoria-root">
      {/* HEADER SIMPLE AVEC TON LOGO PARFAIT */}
      <header className="amoria-header amoria-header--center">
        <div className="amoria-header-left">
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
        <p className="amoria-legal-line">{t.introLine}</p>

        <p className="amoria-legal-line">
          <strong>{t.editorLabel}</strong>
          <br />
          {t.editorValue}
        </p>

        <p className="amoria-legal-line">
          <strong>{t.contactLabel}</strong>
          <br />
          {t.contactEmail}
        </p>
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

      {/* STYLES SPÉCIFIQUES À LA PAGE LÉGALE */}
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
          padding-bottom: 2.5rem;
        }

        .amoria-header {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .amoria-header--center {
          justify-content: flex-start;
        }

        .amoria-header-left {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .amoria-logo-full {
          height: 48px;
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
          font-size: 0.75rem;
          color: var(--amoria-text-muted);
        }

        .amoria-legal-section {
          max-width: 800px;
          margin: 2rem auto 0;
          padding: 0 1.5rem;
        }

        .amoria-legal-title {
          font-size: 1.4rem;
          margin-bottom: 1rem;
        }

        .amoria-legal-line {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--amoria-text-main);
          margin-bottom: 0.8rem;
        }

        .amoria-footer {
          max-width: 1120px;
          margin: 2.5rem auto 0;
          padding: 1.5rem 1.5rem 0;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          border-top: 1px solid rgba(148, 163, 184, 0.35);
        }

        .amoria-footer-top {
          margin-bottom: 0.6rem;
        }

        .amoria-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .amoria-footer-link {
          text-decoration: none;
          color: #f472b6;
          font-size: 0.8rem;
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
