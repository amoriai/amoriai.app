"use client";

import React, { useState } from "react";

type Locale = "fr" | "en" | "es";

const STRINGS = {
  fr: {
    brandTagline: "Partenaire IA bienveillante • FR / EN / ES",
    pageTitle: "Mentions légales",
    intro:
      "Ces informations concernent l’utilisation du site et de l’application AmorIA.app.",
    publisherTitle: "Éditeur",
    publisherBody:
      "AmorIA.app — Canada\nResponsable de la publication : Les Entreprises Kema inc.",
    contactTitle: "Contact",
    contactBody: "Pour toute question légale : contactamoriai@gmail.com",
    hostingTitle: "Hébergement",
    hostingBody:
      "Le site est hébergé par Vercel Inc. (États-Unis). L’authentification et la base de données sont gérées par Supabase.",
    responsibilityTitle: "Responsabilité",
    responsibilityBody:
      "AmorIA.app est un outil de conversation et de soutien émotionnel léger. Il ne remplace en aucun cas un avis médical, psychologique, juridique ou financier professionnel. L’utilisateur reste responsable de ses décisions et de l’usage qu’il fait des informations fournies par l’IA.",
    ipTitle: "Propriété intellectuelle",
    ipBody:
      "Le nom AmorIA.app, le logo et l’interface du site sont protégés par les lois applicables sur la propriété intellectuelle. Toute reproduction, diffusion ou modification non autorisée est interdite.",
    lastUpdate: "Dernière mise à jour : novembre 2025",
    footerCopy: "© 2025 AmorIA.app",
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
    pageTitle: "Legal Notice",
    intro:
      "This information applies to the use of the AmorIA.app website and application.",
    publisherTitle: "Publisher",
    publisherBody:
      "AmorIA.app — Canada\nPublishing manager: Les Entreprises Kema inc.",
    contactTitle: "Contact",
    contactBody: "For any legal question: contactamoriai@gmail.com",
    hostingTitle: "Hosting",
    hostingBody:
      "The website is hosted by Vercel Inc. (United States). Authentication and database are managed by Supabase.",
    responsibilityTitle: "Liability",
    responsibilityBody:
      "AmorIA.app is a conversational and light emotional-support tool. It does not replace medical, psychological, legal or financial professional advice. Users remain fully responsible for their decisions and for how they use information provided by the AI.",
    ipTitle: "Intellectual property",
    ipBody:
      "The AmorIA.app name, logo and website interface are protected by applicable intellectual property laws. Any unauthorised reproduction, distribution or modification is prohibited.",
    lastUpdate: "Last updated: November 2025",
    footerCopy: "© 2025 AmorIA.app",
    footerLinks: {
      legal: "Legal notice",
      privacy: "Privacy Policy",
      terms: "Terms of use",
      contact: "Contact",
      about: "About",
    },
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    pageTitle: "Aviso legal",
    intro:
      "Esta información se refiere al uso del sitio web y de la aplicación AmorIA.app.",
    publisherTitle: "Editor",
    publisherBody:
      "AmorIA.app — Canadá\nResponsable de la publicación: Les Entreprises Kema inc.",
    contactTitle: "Contacto",
    contactBody:
      "Para cualquier pregunta legal, puedes escribir a: contactamoriai@gmail.com",
    hostingTitle: "Alojamiento",
    hostingBody:
      "El sitio está alojado por Vercel Inc. (Estados Unidos). La autenticación y la base de datos son gestionadas por Supabase.",
    responsibilityTitle: "Responsabilidad",
    responsibilityBody:
      "AmorIA.app es una herramienta de conversación y apoyo emocional ligero. No sustituye en ningún caso el consejo médico, psicológico, jurídico ni financiero profesional. La persona usuaria sigue siendo responsable de sus decisiones y del uso que haga de la información proporcionada por la IA.",
    ipTitle: "Propiedad intelectual",
    ipBody:
      "El nombre AmorIA.app, el logotipo y la interfaz del sitio están protegidos por las leyes de propiedad intelectual aplicables. Cualquier reproducción, difusión o modificación no autorizada está prohibida.",
    lastUpdate: "Última actualización: noviembre de 2025",
    footerCopy: "© 2025 AmorIA.app",
    footerLinks: {
      legal: "Aviso legal",
      privacy: "Confidencialidad",
      terms: "Condiciones de uso",
      contact: "Contacto",
      about: "Acerca de",
    },
  },
} as const;

function getLocaleFromSearchParams(
  searchParams: { [key: string]: string | string[] | undefined }
): Locale {
  const raw = searchParams["lang"];
  const val = Array.isArray(raw) ? raw[0] : raw;
  if (val === "en" || val === "es" || val === "fr") return val;
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
      {/* HEADER minimal pour les pages légales */}
      <header className="amoria-header">
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

      <section className="amoria-section amoria-section--legal">
        <h1 className="amoria-section-title">{t.pageTitle}</h1>
        <p className="amoria-section-intro">{t.intro}</p>

        <div className="amoria-legal-block">
          <h2>{t.publisherTitle}</h2>
          <p className="amoria-legal-text">
            {t.publisherBody.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        <div className="amoria-legal-block">
          <h2>{t.contactTitle}</h2>
          <p className="amoria-legal-text">{t.contactBody}</p>
        </div>

        <div className="amoria-legal-block">
          <h2>{t.hostingTitle}</h2>
          <p className="amoria-legal-text">{t.hostingBody}</p>
        </div>

        <div className="amoria-legal-block">
          <h2>{t.responsibilityTitle}</h2>
          <p className="amoria-legal-text">{t.responsibilityBody}</p>
        </div>

        <div className="amoria-legal-block">
          <h2>{t.ipTitle}</h2>
          <p className="amoria-legal-text">{t.ipBody}</p>
        </div>

        <p className="amoria-legal-updated">{t.lastUpdate}</p>
      </section>

      {/* FOOTER identique aux autres pages */}
      <footer className="amoria-footer">
        <div className="amoria-footer-top">
          <span>{t.footerCopy}</span>
        </div>
        <div className="amoria-footer-links">
          <a href={withLang("/legal")} className="amoria-footer-link">
            {t.footerLinks.legal}
          </a>
          <a href={withLang("/legal/privacy")} className="amoria-footer-link">
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

        <style jsx global>{`
          .amoria-section--legal {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem 1.5rem 2.5rem;
          }

          .amoria-section-intro {
            font-size: 0.9rem;
            color: #9ca3af;
            margin-bottom: 1.4rem;
          }

          .amoria-legal-block {
            margin-bottom: 1.4rem;
          }

          .amoria-legal-block h2 {
            font-size: 1rem;
            margin-bottom: 0.3rem;
          }

          .amoria-legal-text {
            font-size: 0.86rem;
            color: #e5e7eb;
            white-space: pre-wrap;
          }

          .amoria-legal-updated {
            font-size: 0.78rem;
            color: #9ca3af;
            margin-top: 1.2rem;
          }

          .amoria-footer-top {
            max-width: 1120px;
            margin: 0 auto;
            padding: 1rem 1.5rem 0.3rem;
            font-size: 0.78rem;
            color: #9ca3af;
          }

          .amoria-footer-links {
            max-width: 1120px;
            margin: 0 auto;
            padding: 0 1.5rem 1.5rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            font-size: 0.78rem;
          }

          .amoria-footer-link {
            color: #fb37ff;
            text-decoration: none;
          }

          .amoria-footer-link:hover {
            text-decoration: underline;
          }
        `}</style>
      </footer>
    </main>
  );
}
