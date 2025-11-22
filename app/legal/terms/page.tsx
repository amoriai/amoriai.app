"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type Section = {
  title: string;
  paragraphs: string[];
};

type TermsCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  updatedLabel: string;
  updatedDate: string;
  sections: Section[];
};

const TERMS_STRINGS: Record<Locale, TermsCopy> = {
  fr: {
    heroKicker: "CONDITIONS D’UTILISATION",
    heroTitle: "Les règles d’utilisation d’AmoriA.app.",
    heroSubtitle:
      "En créant un compte ou en utilisant AmoriA.app, tu acceptes les présentes conditions. Merci de les lire attentivement avant d’utiliser le service.",
    updatedLabel: "Dernière mise à jour :",
    updatedDate: "novembre 2025",
    sections: [
      {
        title: "1. Objet du service",
        paragraphs: [
          "AmoriA.app propose des compagnons IA bienveillants pour discuter, réfléchir, journaliser et t’accompagner au quotidien.",
          "Le service ne remplace pas un avis médical, psychologique, juridique ou financier professionnel."
        ]
      },
      {
        title: "2. Acceptation des conditions",
        paragraphs: [
          "En accédant à AmoriA.app ou en créant un compte, tu confirmes :",
          "• que tu as l’âge légal requis selon la loi de ton pays (ou l’autorisation d’un parent/tuteur là où applicable) ;\n• que tu as lu et compris ces conditions ;\n• que tu les acceptes sans réserve.",
          "Si tu n’acceptes pas ces conditions, tu ne dois pas utiliser le service."
        ]
      },
      {
        title: "3. Utilisation responsable et contenus interdits",
        paragraphs: [
          "Tu t’engages à utiliser AmoriA.app de manière responsable et à ne pas :",
          "• utiliser le service pour harceler, menacer ou intimider qui que ce soit ;\n• publier du contenu illégal, haineux, violent, discriminatoire ou à caractère criminel ;\n• partager du contenu impliquant des mineurs ou des personnes non consentantes ;\n• tenter d’attaquer la sécurité du service (piratage, injection de code, etc.).",
          "En cas de violation grave, nous pourrons suspendre ou supprimer ton compte."
        ]
      },
      {
        title: "4. Plans gratuits et payants",
        paragraphs: [
          "AmoriA.app propose :",
          "• un plan gratuit, avec un nombre limité de messages texte et une mémoire restreinte ;\n• des plans payants offrant plus de messages, de la voix et une mémoire prolongée.",
          "Les détails des fonctionnalités et des prix sont décrits sur la page Tarifs. Nous pouvons ajuster ces plans à l’avenir (par exemple modifier les quotas, les prix ou les fonctionnalités), mais nous ferons en sorte de l’indiquer clairement."
        ]
      },
      {
        title: "5. Paiements, renouvellement et annulation",
        paragraphs: [
          "Les abonnements payants sont généralement facturés mensuellement en USD via la plateforme de paiement choisie (par exemple, Google Play, App Store ou autre prestataire).",
          "Sauf indication contraire, les abonnements se renouvellent automatiquement jusqu’à leur annulation. Tu peux en général gérer ton abonnement directement via la plateforme sur laquelle tu t’es abonné·e (par exemple : section Abonnements de ton compte Google/Apple).",
          "Les conditions de remboursement peuvent dépendre de la plateforme (Google Play, App Store, etc.). Réfère-toi aussi à leurs politiques de remboursement."
        ]
      },
      {
        title: "6. Contenu généré par l’utilisateur et par l’IA",
        paragraphs: [
          "Tu restes responsable du contenu que tu écris ou transmets via AmoriA.app.",
          "Les réponses générées par l’IA sont produites automatiquement et peuvent parfois être incomplètes, imprécises ou inadaptées. Tu restes libre de les ignorer, de les nuancer ou de les contester.",
          "Tu t’engages à ne pas utiliser les réponses de l’IA pour :\n• prendre des décisions médicales critiques ;\n• engager des actions illégales ;\n• nuire à toi-même ou à autrui."
        ]
      },
      {
        title: "7. Pas de conseil professionnel",
        paragraphs: [
          "AmoriA.app ne fournit pas de conseil médical, psychologique, juridique, financier ou autre conseil professionnel.",
          "Pour toute situation sérieuse (santé, sécurité, finances, procédures légales), tu dois consulter un professionnel compétent."
        ]
      },
      {
        title: "8. Suspension ou suppression de compte",
        paragraphs: [
          "Nous pouvons suspendre ou supprimer ton compte, avec ou sans préavis, notamment si :",
          "• tu violes ces conditions ou la loi ;\n• tu mets en danger la sécurité du service ;\n• tu utilises AmoriA.app pour des activités illégales ou nuisibles.",
          "Tu peux également demander la suppression de ton compte en nous écrivant à : contactamoriai@gmail.com."
        ]
      },
      {
        title: "9. Propriété intellectuelle",
        paragraphs: [
          "Les éléments visuels, le design, le logo AmoriA.app, le code et l’infrastructure technique restent la propriété de leurs détenteurs respectifs.",
          "Sous réserve du respect des lois locales, tu peux en général utiliser les textes générés pour ton usage personnel. Toutefois, nous pouvons limiter ou interdire l’utilisation commerciale de certains contenus dans les cas prévus par la loi ou nos politiques."
        ]
      },
      {
        title: "10. Limitation de responsabilité",
        paragraphs: [
          "Nous mettons des moyens raisonnables pour maintenir AmoriA.app disponible et fonctionnel, mais nous ne pouvons pas garantir une disponibilité continue, ni l’absence totale d’erreurs.",
          "Dans les limites permises par la loi applicable, nous ne pourrons pas être tenus responsables des dommages indirects, pertes de données, pertes de profit ou toute conséquence liée à l’utilisation ou l’impossibilité d’utiliser AmoriA.app."
        ]
      },
      {
        title: "11. Modifications des conditions",
        paragraphs: [
          "Nous pouvons modifier ces conditions pour refléter l’évolution du service, de la technologie ou de la réglementation.",
          "En cas de changement important, nous pourrons t’en informer via l’application, par e-mail ou via notre site. La version à jour sera toujours disponible sur cette page."
        ]
      },
      {
        title: "12. Contact",
        paragraphs: [
          "Pour toute question au sujet de ces conditions d’utilisation, tu peux nous joindre à :",
          "• contactamoriai@gmail.com"
        ]
      }
    ]
  },
  en: {
    heroKicker: "TERMS OF USE",
    heroTitle: "The rules for using AmoriA.app.",
    heroSubtitle:
      "By creating an account or using AmoriA.app, you agree to these terms. Please read them carefully before using the service.",
    updatedLabel: "Last updated:",
    updatedDate: "November 2025",
    sections: [
      {
        title: "1. Purpose of the service",
        paragraphs: [
          "AmoriA.app offers caring AI companions for conversation, reflection, journaling and everyday support.",
          "The service does not replace professional medical, psychological, legal or financial advice."
        ]
      },
      {
        title: "2. Acceptance of the terms",
        paragraphs: [
          "By accessing AmoriA.app or creating an account, you confirm that:",
          "• you meet the legal age requirements in your country (or have parental/guardian authorisation where applicable);\n• you have read and understood these terms;\n• you agree to them without reservation.",
          "If you do not accept these terms, you must not use the service."
        ]
      },
      {
        title: "3. Responsible use and prohibited content",
        paragraphs: [
          "You agree to use AmoriA.app responsibly and not to:",
          "• use the service to harass, threaten or intimidate anyone;\n• post illegal, hateful, violent, discriminatory or criminal content;\n• share content involving minors or non-consenting individuals;\n• attempt to compromise the security of the service (hacking, code injection, etc.).",
          "In case of serious violation, we may suspend or delete your account."
        ]
      },
      {
        title: "4. Free and paid plans",
        paragraphs: [
          "AmoriA.app offers:",
          "• a free plan with a limited number of text messages and reduced memory;\n• paid plans with more messages, voice features and extended memory.",
          "Details about features and pricing are available on the Pricing page. We may adjust these plans in the future (for example changing quotas, prices or features) and will try to communicate these changes clearly."
        ]
      },
      {
        title: "5. Payments, renewal and cancellation",
        paragraphs: [
          "Paid subscriptions are usually billed monthly in USD through the payment platform you chose (for example, Google Play, App Store, or another provider).",
          "Unless stated otherwise, subscriptions renew automatically until cancelled. You can typically manage your subscription directly in the platform where you subscribed (for example the Subscriptions section of your Google/Apple account).",
          "Refund rules may depend on the platform (Google Play, App Store, etc.). Please refer to their refund policies as well."
        ]
      },
      {
        title: "6. User-generated and AI-generated content",
        paragraphs: [
          "You remain responsible for the content you write or transmit via AmoriA.app.",
          "AI-generated responses are produced automatically and may sometimes be incomplete, inaccurate or inappropriate. You are free to ignore, question or adjust them.",
          "You agree not to use AI responses to:\n• make critical medical decisions;\n• engage in illegal activities;\n• harm yourself or others."
        ]
      },
      {
        title: "7. No professional advice",
        paragraphs: [
          "AmoriA.app does not provide medical, psychological, legal, financial or other professional advice.",
          "For any serious situation (health, safety, finances, legal procedures), you should contact a qualified professional."
        ]
      },
      {
        title: "8. Account suspension or termination",
        paragraphs: [
          "We may suspend or delete your account, with or without notice, if:",
          "• you violate these terms or the law;\n• you endanger the security of the service;\n• you use AmoriA.app for illegal or harmful activities.",
          "You may also request deletion of your account by writing to: contactamoriai@gmail.com."
        ]
      },
      {
        title: "9. Intellectual property",
        paragraphs: [
          "The visual elements, design, AmoriA.app logo, code and technical infrastructure remain the property of their respective owners.",
          "Subject to local laws, you may generally use generated text for your personal use. However, we may restrict or forbid commercial use of certain content in cases permitted by law or our policies."
        ]
      },
      {
        title: "10. Limitation of liability",
        paragraphs: [
          "We use reasonable efforts to keep AmoriA.app available and functional, but we cannot guarantee continuous availability or a service entirely free of errors.",
          "To the extent allowed by applicable law, we will not be liable for indirect damages, loss of data, loss of profits or any consequences related to the use or inability to use AmoriA.app."
        ]
      },
      {
        title: "11. Changes to these terms",
        paragraphs: [
          "We may update these terms to reflect changes in the service, technology or regulatory environment.",
          "In case of significant changes, we may notify you via the app, e-mail or our website. The latest version will always be available on this page."
        ]
      },
      {
        title: "12. Contact",
        paragraphs: [
          "For any question about these terms of use, you can contact us at:",
          "• contactamoriai@gmail.com"
        ]
      }
    ]
  },
  es: {
    heroKicker: "TÉRMINOS DE USO",
    heroTitle: "Las reglas para usar AmoriA.app.",
    heroSubtitle:
      "Al crear una cuenta o usar AmoriA.app, aceptas estos términos. Por favor, léelos con atención antes de usar el servicio.",
    updatedLabel: "Última actualización:",
    updatedDate: "noviembre de 2025",
    sections: [
      {
        title: "1. Objeto del servicio",
        paragraphs: [
          "AmoriA.app ofrece compañeros de IA amables para conversar, reflexionar, escribir diarios y acompañarte en el día a día.",
          "El servicio no sustituye asesoramiento médico, psicológico, jurídico o financiero profesional."
        ]
      },
      {
        title: "2. Aceptación de los términos",
        paragraphs: [
          "Al acceder a AmoriA.app o crear una cuenta, confirmas que:",
          "• cumples con la edad legal requerida en tu país (o cuentas con la autorización de un padre/madre o tutor cuando corresponda);\n• has leído y entendido estos términos;\n• los aceptas sin reservas.",
          "Si no aceptas estos términos, no debes usar el servicio."
        ]
      },
      {
        title: "3. Uso responsable y contenido prohibido",
        paragraphs: [
          "Te comprometes a usar AmoriA.app de forma responsable y a no:",
          "• usar el servicio para acosar, amenazar o intimidar a otras personas;\n• publicar contenido ilegal, de odio, violento, discriminatorio o delictivo;\n• compartir contenido que implique a menores o personas no consentidoras;\n• intentar comprometer la seguridad del servicio (hackeo, inyección de código, etc.).",
          "En caso de infracción grave, podremos suspender o eliminar tu cuenta."
        ]
      },
      {
        title: "4. Planes gratuitos y de pago",
        paragraphs: [
          "AmoriA.app ofrece:",
          "• un plan gratuito con un número limitado de mensajes de texto y memoria reducida;\n• planes de pago con más mensajes, funciones de voz y memoria ampliada.",
          "Los detalles sobre funciones y precios se describen en la página de Precios. Podemos ajustar estos planes en el futuro (cambiar cuotas, precios o funciones) e intentaremos comunicar estos cambios con claridad."
        ]
      },
      {
        title: "5. Pagos, renovación y cancelación",
        paragraphs: [
          "Las suscripciones de pago se facturan normalmente de forma mensual en USD a través de la plataforma de pago elegida (por ejemplo, Google Play, App Store u otro proveedor).",
          "Salvo indicación contraria, las suscripciones se renuevan automáticamente hasta su cancelación. Por lo general, puedes gestionar tu suscripción directamente desde la plataforma donde te suscribiste (por ejemplo, la sección Suscripciones de tu cuenta de Google/Apple).",
          "Las políticas de reembolso pueden depender de la plataforma (Google Play, App Store, etc.). Consulta también sus condiciones de reembolso."
        ]
      },
      {
        title: "6. Contenido generado por el usuario y por la IA",
        paragraphs: [
          "Sigues siendo responsable del contenido que escribes o transmites a través de AmoriA.app.",
          "Las respuestas generadas por la IA se producen automáticamente y pueden ser, a veces, incompletas, imprecisas o poco adecuadas. Eres libre de ignorarlas, matizarlas o cuestionarlas.",
          "Te comprometes a no usar las respuestas de la IA para:\n• tomar decisiones médicas críticas;\n• realizar actividades ilegales;\n• hacerte daño a ti mismo/a o a otros."
        ]
      },
      {
        title: "7. Sin asesoramiento profesional",
        paragraphs: [
          "AmoriA.app no ofrece asesoramiento médico, psicológico, jurídico, financiero ni otro asesoramiento profesional.",
          "Para cualquier situación grave (salud, seguridad, finanzas, procedimientos legales), debes dirigirte a un profesional cualificado."
        ]
      },
      {
        title: "8. Suspensión o eliminación de la cuenta",
        paragraphs: [
          "Podemos suspender o eliminar tu cuenta, con o sin previo aviso, si:",
          "• infringes estos términos o la ley;\n• pones en peligro la seguridad del servicio;\n• usas AmoriA.app para actividades ilegales o dañinas.",
          "También puedes solicitar la eliminación de tu cuenta escribiendo a: contactamoriai@gmail.com."
        ]
      },
      {
        title: "9. Propiedad intelectual",
        paragraphs: [
          "Los elementos visuales, el diseño, el logo de AmoriA.app, el código y la infraestructura técnica siguen siendo propiedad de sus titulares respectivos.",
          "Con sujeción a las leyes locales, normalmente puedes usar los textos generados para tu uso personal. Sin embargo, podemos limitar o prohibir el uso comercial de ciertos contenidos en los casos permitidos por la ley o nuestras políticas."
        ]
      },
      {
        title: "10. Limitación de responsabilidad",
        paragraphs: [
          "Ponemos medios razonables para mantener AmoriA.app disponible y en funcionamiento, pero no podemos garantizar una disponibilidad continua ni un servicio totalmente libre de errores.",
          "En la medida permitida por la ley aplicable, no seremos responsables de daños indirectos, pérdida de datos, pérdida de beneficios o cualquier consecuencia relacionada con el uso o la imposibilidad de usar AmoriA.app."
        ]
      },
      {
        title: "11. Cambios en estos términos",
        paragraphs: [
          "Podemos actualizar estos términos para reflejar cambios en el servicio, en la tecnología o en la normativa.",
          "En caso de cambios importantes, podremos avisarte a través de la app, por correo electrónico o en nuestro sitio. La versión más reciente estará siempre disponible en esta página."
        ]
      },
      {
        title: "12. Contacto",
        paragraphs: [
          "Para cualquier pregunta sobre estos términos de uso, puedes escribirnos a:",
          "• contactamoriai@gmail.com"
        ]
      }
    ]
  }
};

// Helper locale
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

export default function TermsPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = TERMS_STRINGS[locale];

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

  const tagline =
    locale === "fr"
      ? "Partenaire IA bienveillant·e • FR / EN / ES"
      : locale === "en"
      ? "Caring AI partner • FR / EN / ES"
      : "Compañerx de IA amable • FR / EN / ES";

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

      {/* Tagline FIXE — ne dépend pas des traductions */}
      <div className="amoria-logo-tagline">
        Partenaire IA bienveillante • FR / EN / ES
      </div>
    </div>
  </div>
</header>

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
              ? "Conditions"
              : locale === "en"
              ? "Terms"
              : "Términos"}
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
          <p className="amoria-hero-updated">
            {t.updatedLabel} {t.updatedDate}
          </p>
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

      {/* STYLES (reprend les mêmes que privacy) */}
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

        .amoria-hero-updated {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
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
