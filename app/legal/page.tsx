"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalCopy = {
  brandTagline: string;
  pageTitle: string;
  intro: string;
  sections: LegalSection[];
  footerCopy: string;
  footerLinks: {
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    about: string;
  };
};

const LEGAL_STRINGS: Record<Locale, LegalCopy> = {
  fr: {
    brandTagline: "Partenaire IA bienveillante • FR / EN / ES",
    pageTitle: "Mentions légales",
    intro:
      "Ces informations concernent l’utilisation du site et de l’application AmorIA.app.",
    sections: [
      {
        title: "Éditeur du site et de l’application",
        paragraphs: [
          "Nom commercial : AmorIA.app",
          "Société responsable : Les Entreprises Kema inc.",
          "Pays d’exploitation : Canada",
        ],
      },
      {
        title: "Responsable de la publication",
        paragraphs: [
          "Responsable de la publication : Les Entreprises Kema inc.",
          "La responsable veille à la cohérence éditoriale et au respect des politiques légales d’AmorIA.app.",
        ],
      },
      {
        title: "Hébergement",
        paragraphs: [
          "L’infrastructure technique (hébergement du site et de l’application web) est fournie par un prestataire d’hébergement spécialisé en déploiement d’applications web.",
          "Les informations détaillées sur l’hébergeur peuvent être fournies sur demande raisonnable.",
        ],
      },
      {
        title: "Propriété intellectuelle",
        paragraphs: [
          "L’ensemble du contenu disponible sur AmorIA.app (textes, visuels, éléments de design, structure de l’interface, nom de marque et logo AmorIA) est protégé par les lois applicables en matière de propriété intellectuelle.",
          "Toute reproduction, diffusion, modification, adaptation ou réutilisation non autorisée du contenu, en dehors des usages strictement personnels, est interdite sans l’accord écrit préalable de Les Entreprises Kema inc.",
        ],
      },
      {
        title: "Utilisation du service",
        paragraphs: [
          "AmorIA.app propose un service de compagnon IA conversationnel, destiné à l’échange, à la réflexion personnelle et au soutien émotionnel léger. Il ne s’agit pas d’un service médical, psychologique ou juridique.",
          "Les contenus générés par l’IA ne constituent pas un avis professionnel. L’utilisateur reste seul responsable des décisions prises sur la base des échanges effectués avec AmorIA.",
        ],
      },
      {
        title: "Données personnelles & cookies",
        paragraphs: [
          "AmorIA.app collecte et traite certaines données nécessaires au fonctionnement du service (création de compte, sécurité, personnalisation de l’expérience, suivi d’usage).",
          "Les modalités complètes de traitement des données (finalités, base légale, durée de conservation, droits des utilisateurs) sont détaillées dans la Politique de confidentialité.",
          "Pour en savoir plus, consulte la page « Politique de confidentialité ».",
        ],
      },
      {
        title: "Contact légal",
        paragraphs: [
          "Pour toute question relative aux mentions légales, à la propriété intellectuelle ou à un usage litigieux du service, tu peux écrire à : contactamoriai@gmail.com.",
        ],
      },
    ],
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
    pageTitle: "Legal notice",
    intro:
      "This information relates to the use of the AmorIA.app website and application.",
    sections: [
      {
        title: "Publisher",
        paragraphs: [
          "Trade name: AmorIA.app",
          "Responsible company: Les Entreprises Kema inc.",
          "Country of operation: Canada",
        ],
      },
      {
        title: "Publication director",
        paragraphs: [
          "Publication director: Les Entreprises Kema inc.",
          "The publication director oversees the editorial coherence and legal compliance of AmorIA.app.",
        ],
      },
      {
        title: "Hosting",
        paragraphs: [
          "The technical infrastructure (hosting of the website and web application) is provided by a professional web hosting provider specialized in application deployment.",
          "Detailed hosting information can be provided upon reasonable request.",
        ],
      },
      {
        title: "Intellectual property",
        paragraphs: [
          "All content available on AmorIA.app (texts, visuals, design elements, interface structure, brand name and AmorIA logo) is protected by applicable intellectual property laws.",
          "Any reproduction, distribution, modification, adaptation or reuse of the content, beyond strictly personal use, is prohibited without prior written consent from Les Entreprises Kema inc.",
        ],
      },
      {
        title: "Use of the service",
        paragraphs: [
          "AmorIA.app provides an AI companion service designed for conversation, personal reflection and light emotional support. It is not a medical, psychological or legal service.",
          "The content generated by the AI does not constitute professional advice. Users remain solely responsible for any decisions made based on their conversations with AmorIA.",
        ],
      },
      {
        title: "Personal data & cookies",
        paragraphs: [
          "AmorIA.app collects and processes certain data required for the functioning of the service (account creation, security, personalization, usage analytics).",
          "Full details about data processing (purposes, legal basis, retention, user rights) are described in the Privacy Policy.",
          "For more information, please refer to the “Privacy Policy” page.",
        ],
      },
      {
        title: "Legal contact",
        paragraphs: [
          "For any questions relating to the legal notice, intellectual property or a disputed use of the service, please contact: contactamoriai@gmail.com.",
        ],
      },
    ],
    footerCopy: "© 2025 AmorIA.app",
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
    intro:
      "Esta información se refiere al uso del sitio web y la aplicación AmorIA.app.",
    sections: [
      {
        title: "Editor del sitio y de la aplicación",
        paragraphs: [
          "Nombre comercial: AmorIA.app",
          "Empresa responsable: Les Entreprises Kema inc.",
          "País de operación: Canadá",
        ],
      },
      {
        title: "Responsable de la publicación",
        paragraphs: [
          "Responsable de la publicación: Les Entreprises Kema inc.",
          "La responsable garantiza la coherencia editorial y el cumplimiento legal de AmorIA.app.",
        ],
      },
      {
        title: "Alojamiento",
        paragraphs: [
          "La infraestructura técnica (alojamiento del sitio y de la aplicación web) es proporcionada por un proveedor profesional de alojamiento web especializado en despliegue de aplicaciones.",
          "La información detallada sobre el proveedor de alojamiento puede facilitarse a petición razonable.",
        ],
      },
      {
        title: "Propiedad intelectual",
        paragraphs: [
          "Todo el contenido disponible en AmorIA.app (textos, elementos visuales, diseño, estructura de la interfaz, nombre de la marca y logotipo AmorIA) está protegido por las leyes aplicables de propiedad intelectual.",
          "Cualquier reproducción, distribución, modificación, adaptación o reutilización del contenido, más allá del uso estrictamente personal, está prohibida sin el consentimiento previo y por escrito de Les Entreprises Kema inc.",
        ],
      },
      {
        title: "Uso del servicio",
        paragraphs: [
          "AmorIA.app ofrece un servicio de compañerx de IA conversacional, pensado para el diálogo, la reflexión personal y un apoyo emocional ligero. No es un servicio médico, psicológico ni jurídico.",
          "El contenido generado por la IA no constituye un consejo profesional. La persona usuaria sigue siendo la única responsable de las decisiones que tome basándose en las conversaciones con AmorIA.",
        ],
      },
      {
        title: "Datos personales y cookies",
        paragraphs: [
          "AmorIA.app recoge y trata algunos datos necesarios para el funcionamiento del servicio (creación de cuenta, seguridad, personalización, estadísticas de uso).",
          "Los detalles completos sobre el tratamiento de datos (finalidades, base jurídica, tiempo de conservación, derechos de las personas usuarias) se describen en la Política de confidencialidad.",
          "Para más información, consulta la página «Política de confidencialidad».",
        ],
      },
      {
        title: "Contacto legal",
        paragraphs: [
          "Para cualquier pregunta relativa al aviso legal, a la propiedad intelectual o a un uso conflictivo del servicio, puedes escribir a: contactamoriai@gmail.com.",
        ],
      },
    ],
    footerCopy: "© 2025 AmorIA.app",
    footerLinks: {
      legal: "Aviso legal",
      privacy: "Confidencialidad",
      terms: "Condiciones de uso",
      contact: "Contacto",
      about: "Acerca de",
    },
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

  const withLang = (path: string) => `${path}?lang=${locale}`;

  return (
    <main className="amoria-root">
      {/* HEADER SIMPLE AVEC LOGO */}
     <header className="amoria-header">
  <div className="amoria-header-left">
    <img
      src="/AmorIA_logo_transparent.png"
      alt="Logo AmorIA.app"
      className="amoria-logo-full"
    />

    <div className="amoria-logo-text">
      <div className="amoria-logo-title">AmorIA.app</div>

      {/* Tagline FIXE — ne dépend pas des traductions */}
      <div className="amoria-logo-tagline">
        Partenaire IA bienveillante • FR / EN / ES
      </div>
    </div>
  </div>
</header>

      {/* CONTENU MENTIONS LÉGALES */}
      <section className="amoria-section amoria-section--legal">
        <h1 className="amoria-legal-title">{t.pageTitle}</h1>
        <p className="amoria-legal-intro">{t.intro}</p>

        <div className="amoria-legal-grid">
          {t.sections.map((section, index) => (
            <article key={index} className="amoria-legal-block">
              <h2 className="amoria-legal-heading">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="amoria-legal-text">
                  {p}
                </p>
              ))}
            </article>
          ))}
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
      </footer>

      {/* STYLES SPÉCIFIQUES MENTIONS LÉGALES */}
      <style jsx global>{`
        .amoria-section--legal {
          max-width: 960px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 3rem;
        }

        .amoria-legal-title {
          font-size: 1.6rem;
          margin-bottom: 0.4rem;
        }

        .amoria-legal-intro {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          margin-bottom: 1.8rem;
          max-width: 40rem;
        }

        .amoria-legal-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem;
        }

        .amoria-legal-block {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 1.1rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          padding: 1rem 1.1rem;
        }

        .amoria-legal-heading {
          font-size: 0.98rem;
          margin-bottom: 0.5rem;
        }

        .amoria-legal-text {
          font-size: 0.82rem;
          color: var(--amoria-text-muted);
          margin-bottom: 0.4rem;
        }

        .amoria-footer-top {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.2rem 1.5rem 0.4rem;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
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

        @media (max-width: 800px) {
          .amoria-legal-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-section--legal {
            padding-inline: 1rem;
          }

          .amoria-footer-top,
          .amoria-footer-links {
            padding-inline: 1rem;
          }
        }
      `}</style>
    </main>
  );
}
