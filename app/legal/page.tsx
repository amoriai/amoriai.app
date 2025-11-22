"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type Section = {
  title: string;
  paragraphs: string[];
};

type LegalCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  sections: Section[];
};

const LEGAL_STRINGS: Record<Locale, LegalCopy> = {
  fr: {
    heroKicker: "MENTIONS LÉGALES",
    heroTitle: "Informations légales du site et de l’application AmorIA.app.",
    heroSubtitle:
      "Ces mentions légales présentent l’éditeur, le responsable de la publication et les informations de contact pour AmorIA.app.",
    sections: [
      {
        title: "1. Éditeur du service",
        paragraphs: [
          "AmorIA.app est exploité sous la marque « AmorIA.app ».",
          "Pays : Canada",
          "Responsable de la publication : Les Entreprises Kema inc.",
          "Contact principal : contactamoriai@gmail.com"
        ]
      },
      {
        title: "2. Objet du service",
        paragraphs: [
          "AmorIA.app propose des compagnons IA bienveillants pour discuter, réfléchir, journaliser et t’accompagner au quotidien.",
          "Le service ne remplace pas un avis médical, psychologique, juridique ou financier professionnel. Pour toute situation grave ou urgente, il est important de consulter un professionnel qualifié ou d’appeler les services d’urgence de ton pays."
        ]
      },
      {
        title: "3. Propriété intellectuelle",
        paragraphs: [
          "L’ensemble des éléments présents sur AmorIA.app (nom, logo, design, textes générés par l’IA, interface, code et éléments graphiques) est protégé par les lois en vigueur sur la propriété intellectuelle.",
          "Toute reproduction, diffusion ou modification substantielle non autorisée peut constituer une violation de ces droits."
        ]
      },
      {
        title: "4. Données personnelles et confidentialité",
        paragraphs: [
          "Le traitement des données personnelles collectées via AmorIA.app est décrit dans la Politique de confidentialité.",
          "Cette politique est disponible à l’adresse : /legal/privacy (en français, anglais et espagnol)."
        ]
      },
      {
        title: "5. Contact",
        paragraphs: [
          "Pour toute question relative aux mentions légales, à la sécurité ou à un éventuel signalement de contenu, tu peux nous joindre à :",
          "• contactamoriai@gmail.com"
        ]
      }
    ]
  },
  en: {
    heroKicker: "LEGAL NOTICE",
    heroTitle: "Legal information for the AmorIA.app website and app.",
    heroSubtitle:
      "This page describes the publisher, publication manager and contact information for AmorIA.app.",
    sections: [
      {
        title: "1. Service publisher",
        paragraphs: [
          "AmorIA.app is operated under the “AmorIA.app” brand.",
          "Country: Canada",
          "Publication manager: Les Entreprises Kema inc.",
          "Primary contact: contactamoriai@gmail.com"
        ]
      },
      {
        title: "2. Purpose of the service",
        paragraphs: [
          "AmorIA.app offers caring AI companions for conversation, reflection, journaling and everyday support.",
          "The service does not replace professional medical, psychological, legal or financial advice. For any serious or urgent situation, you should contact a qualified professional or your local emergency services."
        ]
      },
      {
        title: "3. Intellectual property",
        paragraphs: [
          "All elements of AmorIA.app (name, logo, design, AI-generated copy, interface, code and graphic assets) are protected by applicable intellectual property laws.",
          "Any substantial reproduction, distribution or modification without permission may constitute an infringement."
        ]
      },
      {
        title: "4. Personal data and privacy",
        paragraphs: [
          "Processing of personal data collected through AmorIA.app is described in the Privacy Policy.",
          "The policy is available at: /legal/privacy (in French, English and Spanish)."
        ]
      },
      {
        title: "5. Contact",
        paragraphs: [
          "For any question regarding this legal notice, security issues or content reports, you can contact us at:",
          "• contactamoriai@gmail.com"
        ]
      }
    ]
  },
  es: {
    heroKicker: "AVISO LEGAL",
    heroTitle: "Información legal del sitio web y la aplicación AmorIA.app.",
    heroSubtitle:
      "Esta página describe el editor, el responsable de la publicación y los datos de contacto de AmorIA.app.",
    sections: [
      {
        title: "1. Editor del servicio",
        paragraphs: [
          "AmorIA.app se explota bajo la marca « AmorIA.app ».",
          "País: Canadá",
          "Responsable de la publicación: Les Entreprises Kema inc.",
          "Contacto principal: contactamoriai@gmail.com"
        ]
      },
      {
        title: "2. Objeto del servicio",
        paragraphs: [
          "AmorIA.app ofrece compañeros de IA amables para conversar, reflexionar, escribir diarios y acompañarte en el día a día.",
          "El servicio no sustituye el asesoramiento médico, psicológico, jurídico o financiero profesional. Para cualquier situación grave o urgente, debes dirigirte a un profesional cualificado o a los servicios de emergencia de tu país."
        ]
      },
      {
        title: "3. Propiedad intelectual",
        paragraphs: [
          "Todos los elementos de AmorIA.app (nombre, logo, diseño, textos generados por IA, interfaz, código y elementos gráficos) están protegidos por la normativa aplicable en materia de propiedad intelectual.",
          "Cualquier reproducción, difusión o modificación sustancial no autorizada puede constituir una infracción."
        ]
      },
      {
        title: "4. Datos personales y privacidad",
        paragraphs: [
          "El tratamiento de los datos personales recogidos a través de AmorIA.app se describe en la Política de privacidad.",
          "Esta política está disponible en: /legal/privacy (en francés, inglés y español)."
        ]
      },
      {
        title: "5. Contacto",
        paragraphs: [
          "Para cualquier pregunta sobre este aviso legal, la seguridad o para informar contenido, puedes escribirnos a:",
          "• contactamoriai@gmail.com"
        ]
      }
    ]
  }
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

  const buildUrl = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `${path}?${params.toString()}`;
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
      {/* HEADER */}
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
          <a href={buildUrl("/")} className="amoria-nav-link">
            {navHome}
          </a>
          <a href={buildUrl("/features")} className="amoria-nav-link">
            {navFeatures}
          </a>
          <a href={buildUrl("/pricing")} className="amoria-nav-link">
            {navPricing}
          </a>
          <span className="amoria-nav-link amoria-nav-link--active">
            {locale === "fr"
              ? "Mentions légales"
              : locale === "en"
              ? "Legal"
              : "Aviso legal"}
          </span>
        </nav>

        <div className="amoria-nav-right">
          <a
            href={buildUrl("/login")}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {loginLabel}
          </a>
          <a
            href={buildUrl("/signup")}
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
          {t.sections.map((section, idx) => (
            <article key={idx} className="amoria-legal-block">
              <h2 className="amoria-legal-title">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="amoria-legal-text">
                  {p}
                </p>
              ))}
            </article>
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

      {/* STYLES identiques aux autres pages légales */}
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
