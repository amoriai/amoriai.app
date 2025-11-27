"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type LegalSection = {
  title: string;
  text: string;
};

type LegalCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  sections: LegalSection[];
};

function getLocaleFromSearchParams(
  searchParams: { [key: string]: string | string[] | undefined }
): Locale {
  const raw = searchParams["lang"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "en" || value === "es" || value === "fr") return value;
  return "fr";
}

const LEGAL_STRINGS: Record<Locale, LegalCopy> = {
  fr: {
    heroKicker: "MENTIONS LÉGALES",
    heroTitle: "Informations légales d’AmorIAI.app.",
    heroSubtitle:
      "Conformément aux lois applicables au Québec et au Canada, cette page présente les informations relatives à l’éditeur, à l’hébergement et à l’utilisation du site AmorIA.app.",
    sections: [
      {
        title: "1. Éditeur du site",
        text: `Nom du site : AmorIAI.app
Nom commercial : AmorIAI
Éditeur : Les Entreprises Kema inc.
Statut juridique : Société par actions
Pays : Canada
Province : Québec
Courriel : contactamoriai@gmail.com`,
      },
      {
        title: "2. Direction de la publication",
        text: `La direction de la publication du site AmorIAI.app est assurée par Les Entreprises Kema inc.`,
      },
      {
        title: "3. Hébergement",
        text: `Le site AmorIAI.app est hébergé par :
Vercel Inc.
440 N Barranca Ave #4133
Covina, CA 91723 – États-Unis
https://vercel.com`,
      },
      {
        title: "4. Activité du site",
        text: `AmorIAI.app est une plateforme d’intelligence artificielle offrant un partenaire conversationnel à des fins de soutien émotionnel, de réflexion personnelle et de journaling.
Le service ne constitue pas un service médical, psychologique, d’urgence ou de conseil professionnel (juridique, financier, etc.).`,
      },
      {
        title: "5. Propriété intellectuelle",
        text: `Tous les éléments du site AmorIA.app (textes, visuels, logo, identité graphique, avatars, code, structure des pages) sont protégés par le droit d’auteur et demeurent la propriété exclusive de Les Entreprises Kema inc., sauf mention contraire.
Toute reproduction, représentation, modification, diffusion ou exploitation, totale ou partielle, sans autorisation écrite préalable, est strictement interdite.`,
      },
      {
        title: "6. Données personnelles",
        text: `Les données sont traitées conformément aux lois en vigueur au Québec et au Canada.
Aucune donnée personnelle n’est vendue à des tiers.
Pour toute demande relative à l’accès, la rectification ou la suppression de tes données, tu peux écrire à : contactamoriai@gmail.com.`,
      },
      {
        title: "7. Cookies et données techniques",
        text: `Le site peut utiliser des cookies techniques et des outils d’analytique afin d’assurer son bon fonctionnement et d’améliorer l’expérience utilisateur.
Tu peux, selon ton navigateur, limiter ou désactiver l’usage des cookies dans les réglages de ton appareil.`,
      },
      {
        title: "8. Responsabilité",
        text: `L’éditeur met tout en œuvre pour fournir un service fiable et des informations à jour, mais ne peut garantir l’absence totale d’erreurs, d’interruptions ou de défauts techniques.
L’utilisation du site et des réponses générées par l’IA se fait sous ta seule responsabilité.
Les réponses de l’IA ne remplacent en aucun cas un avis de professionnel de la santé, du droit, des finances ou de tout autre domaine spécialisé.`,
      },
      {
        title: "9. Conditions d’utilisation et politiques associées",
        text: `L’accès au site et à l’application implique l’acceptation :
• des présentes mentions légales ;
• des Conditions d’utilisation ;
• de la Politique de confidentialité.
Ces documents sont disponibles depuis le site AmorIAI.app.`,
      },
      {
        title: "10. Transition juridique vers AmorIAI Tech",
        text: `AmorIAI Tech est en cours de création en tant qu’entité distincte. Jusqu’à l’immatriculation officielle et le transfert complet des activités, l’exploitation du site demeure assurée par Les Entreprises Kema inc.
Les mentions légales seront mises à jour pour refléter ce changement dès qu’il sera effectif.`,
      },
    ],
  },
  en: {
    heroKicker: "LEGAL NOTICE",
    heroTitle: "Legal information for AmorIAI.app.",
    heroSubtitle:
      "In accordance with applicable laws in Quebec and Canada, this page provides information about the publisher, hosting and use of the AmorIAI.app website.",
    sections: [
      {
        title: "1. Website publisher",
        text: `Website name: AmorIAI.app
Business name: AmorIAI
Publisher: Les Entreprises Kema inc.
Legal status: Incorporated company
Country: Canada
Province: Quebec
Email: contactamoriai@gmail.com`,
      },
      {
        title: "2. Director of publication",
        text: `Publication of the AmorIAI.app website is managed by Les Entreprises Kema inc.`,
      },
      {
        title: "3. Hosting",
        text: `The AmorIAI.app website is hosted by:
Vercel Inc.
440 N Barranca Ave #4133
Covina, CA 91723 – United States
https://vercel.com`,
      },
      {
        title: "4. Website activity",
        text: `AmorIAI.app is an artificial intelligence platform offering a conversational AI partner for emotional support, personal reflection and journaling.
The service is not a medical, psychological, emergency or professional advisory service (legal, financial, etc.).`,
      },
      {
        title: "5. Intellectual property",
        text: `All elements of the AmorIAI.app website (texts, visuals, logo, visual identity, avatars, code, page structure) are protected by copyright and remain the exclusive property of Les Entreprises Kema inc., unless otherwise stated.
Any reproduction, modification, distribution or exploitation, in whole or in part, without prior written permission is strictly prohibited.`,
      },
      {
        title: "6. Personal data",
        text: `Data is processed in accordance with laws in force in Quebec and Canada.
No personal data is sold to third parties.
For any request related to access, rectification or deletion of your data, you can contact: contactamoriai@gmail.com.`,
      },
      {
        title: "7. Cookies and technical data",
        text: `The website may use technical cookies and analytics tools to ensure proper operation and to improve the user experience.
You can restrict or disable the use of cookies in your browser or device settings, depending on your configuration.`,
      },
      {
        title: "8. Liability",
        text: `The publisher makes reasonable efforts to provide a reliable service and up-to-date information, but cannot guarantee the complete absence of errors, interruptions or technical issues.
Use of the site and AI-generated responses is at your own risk.
AI responses do not replace professional advice in health, law, finance or any other specialised field.`,
      },
      {
        title: "9. Terms of use and related policies",
        text: `Access to the website and application implies acceptance of:
• these legal notices;
• the Terms of Use;
• the Privacy Policy.
These documents are available from the AmorIA.app website.`,
      },
      {
        title: "10. Legal transition to AmorIAI Tech",
        text: `AmorIAI Tech is currently being established as a separate entity. Until official incorporation and full transfer of operations, the site is operated by Les Entreprises Kema inc.
These legal notices will be updated to reflect the change as soon as it becomes effective.`,
      },
    ],
  },
  es: {
    heroKicker: "AVISO LEGAL",
    heroTitle: "Información legal de AmorIAI.app.",
    heroSubtitle:
      "De conformidad con las leyes aplicables en Quebec y Canadá, esta página presenta la información relativa al editor, al alojamiento y al uso del sitio AmorIA.app.",
    sections: [
      {
        title: "1. Editor del sitio",
        text: `Nombre del sitio: AmorIAI.app
Nombre comercial: AmorIAI
Editor: Les Entreprises Kema inc.
Estatus legal: Sociedad incorporada
País: Canadá
Provincia: Quebec
Correo electrónico: contactamoriai@gmail.com`,
      },
      {
        title: "2. Dirección de la publicación",
        text: `La dirección de la publicación del sitio AmorIAI.app está a cargo de Les Entreprises Kema inc.`,
      },
      {
        title: "3. Alojamiento",
        text: `El sitio AmorIAI.app está alojado por:
Vercel Inc.
440 N Barranca Ave #4133
Covina, CA 91723 – Estados Unidos
https://vercel.com`,
      },
      {
        title: "4. Actividad del sitio",
        text: `AmorIAI.app es una plataforma de inteligencia artificial que ofrece un compañero conversacional para apoyo emocional, reflexión personal y escritura de diarios.
Este servicio no sustituye servicios médicos, psicológicos, de urgencias ni de asesoramiento profesional (jurídico, financiero, etc.).`,
      },
      {
        title: "5. Propiedad intelectual",
        text: `Todos los elementos del sitio AmorIA.app (textos, imágenes, logotipo, identidad visual, avatares, código, estructura de las páginas) están protegidos por derechos de autor y son propiedad exclusiva de Les Entreprises Kema inc., salvo indicación contraria.
Queda prohibida cualquier reproducción, modificación, difusión o explotación, total o parcial, sin autorización previa por escrito.`,
      },
      {
        title: "6. Datos personales",
        text: `Los datos se tratan de acuerdo con las leyes vigentes en Quebec y Canadá.
No se venden datos personales a terceros.
Para cualquier solicitud de acceso, rectificación o eliminación de tus datos, puedes escribir a: contactamoriai@gmail.com.`,
      },
      {
        title: "7. Cookies y datos técnicos",
        text: `El sitio puede utilizar cookies técnicas y herramientas de analítica para garantizar su correcto funcionamiento y mejorar la experiencia de usuario.
Puedes limitar o desactivar el uso de cookies en la configuración de tu navegador o dispositivo.`,
      },
      {
        title: "8. Responsabilidad",
        text: `El editor realiza esfuerzos razonables para ofrecer un servicio fiable e información actualizada, pero no puede garantizar la ausencia total de errores, interrupciones o fallos técnicos.
El uso del sitio y de las respuestas generadas por la IA se realiza bajo tu exclusiva responsabilidad.
Las respuestas de la IA no sustituyen el asesoramiento profesional en salud, derecho, finanzas u otras áreas especializadas.`,
      },
      {
        title: "9. Condiciones de uso y políticas relacionadas",
        text: `El acceso al sitio y a la aplicación implica la aceptación:
• del presente aviso legal;
• de las Condiciones de uso;
• de la Política de privacidad.
Estos documentos están disponibles en el sitio AmorIAI.app.`,
      },
      {
        title: "10. Transición legal hacia AmorIAI Tech",
        text: `AmorIAI Tech se encuentra en proceso de constitución como entidad independiente. Hasta su registro oficial y la transferencia completa de las operaciones, la explotación del sitio sigue a cargo de Les Entreprises Kema inc.
El presente aviso legal se actualizará para reflejar este cambio en cuanto sea efectivo.`,
      },
    ],
  },
};

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

  const legalNavLabel =
    locale === "fr" ? "Mentions légales" : locale === "en" ? "Legal" : "Aviso legal";

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
            <div className="amoria-logo-title">AmorIAI.app</div>
            <div className="amoria-logo-tagline">
              Partenaire IA bienveillant·e • FR / EN / ES
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
            {legalNavLabel}
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
          {t.sections.map((section, idx) => (
            <article key={idx} className="amoria-legal-block">
              <h2 className="amoria-legal-title">{section.title}</h2>
              <p className="amoria-legal-text">{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="amoria-footer">
        <span>
          © 2025 AmoriAI.app —{" "}
          {locale === "fr"
            ? "Partenaire IA bienveillant·e"
            : locale === "en"
            ? "Your caring AI partner"
            : "Tu compañerx de IA amable"}
        </span>
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
