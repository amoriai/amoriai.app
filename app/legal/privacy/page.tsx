"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type Section = {
  title: string;
  paragraphs: string[];
};

type PrivacyCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  updatedLabel: string;
  updatedDate: string;
  sections: Section[];
};

const PRIVACY_STRINGS: Record<Locale, PrivacyCopy> = {
  fr: {
    heroKicker: "POLITIQUE DE CONFIDENTIALITÉ",
    heroTitle: "Comment AmorIAI.app protège tes données.",
    heroSubtitle:
      "Cette politique explique quelles données nous collectons, pourquoi nous les collectons et comment nous les protégeons lorsque tu utilises AmorIAI.app.",
    updatedLabel: "Dernière mise à jour :",
    updatedDate: "novembre 2025",
    sections: [
      {
        title: "1. Qui est responsable de tes données ?",
        paragraphs: [
          "AmorIAI.app est une application exploitée sous la marque « AmorIAI ». Pour toute question liée à la protection de tes données, tu peux nous écrire à : contactamoriai@gmail.com.",
          "Lorsque nous parlons de « nous », « AmorIAI » ou « le service », nous faisons référence à l’équipe derrière AmorIAI.app.",
        ],
      },
      {
        title: "2. Quelles données sont collectées ?",
        paragraphs: [
          "Nous pouvons collecter plusieurs types de données lorsque tu utilises AmorIAI.app :",
          "• Informations de compte : adresse e-mail, mot de passe chiffré, langue préférée, paramètres de ton compte.\n• Données d’usage : dates et heures de connexion, type d’appareil, système d’exploitation, données techniques permettant d’améliorer le service.\n• Contenu des échanges avec ton AmorIAI : messages texte, journaux, réponses, ainsi que certaines métadonnées (heure, langue utilisée).",
          "Nous ne vendons pas tes données personnelles à des tiers.",
        ],
      },
      {
        title: "3. Comment utilisons-nous tes données ?",
        paragraphs: [
          "Nous utilisons tes données pour :",
          "• Fournir le service : créer ton compte, te connecter, permettre les échanges texte/voix avec ton AmorIAI.\n• Personnaliser ton expérience : mémoriser certains éléments (dans les plans payants) pour que ton AmorIA se souvienne de toi.\n• Améliorer AmorIAI.app : analyser de manière agrégée l’usage du service afin de comprendre ce qui fonctionne ou non.\n• Respecter nos obligations légales : par exemple en cas de demande des autorités compétentes, dans les limites prévues par la loi.",
        ],
      },
      {
        title: "4. IA, confidentialité et contenu sensible",
        paragraphs: [
          "Tes conversations avec ton AmorIAI peuvent toucher à des sujets personnels (émotions, relations, bien-être, etc.).",
          "Nous te recommandons :\n• de ne pas partager d’informations ultra sensibles (numéros de cartes bancaires, mots de passe, documents officiels complets, etc.),\n• d’éviter de publier des informations permettant d’identifier directement une autre personne sans son consentement.",
          "Les modèles d’IA utilisés pour faire fonctionner AmoriA peuvent analyser ton contenu pour répondre, mais nous mettons en place des garde-fous pour limiter l’usage de ces données à l’amélioration du service et au fonctionnement du modèle.",
        ],
      },
      {
        title: "5. Partage de tes données",
        paragraphs: [
          "Nous pouvons partager certaines données avec :",
          "• Des prestataires techniques (hébergement, infrastructure, outils d’analytique) strictement nécessaires au fonctionnement d’AmorIAI.app.\n• Des services d’IA tiers, lorsque c’est nécessaire pour générer les réponses de ton AmorIAI.",
          "Nous ne partageons pas tes données avec des annonceurs pour du ciblage publicitaire basé sur tes conversations individuelles.",
        ],
      },
      {
        title: "6. Durée de conservation",
        paragraphs: [
          "Nous conservons tes données aussi longtemps que nécessaire pour :",
          "• fournir le service,\n• respecter nos obligations légales,\n• résoudre des litiges potentiels.",
          "Tu peux demander la suppression de ton compte en nous écrivant à : contactamoriai@gmail.com. Certaines données peuvent toutefois être conservées plus longtemps si la loi l’exige (par exemple, des journaux techniques ou des preuves de consentement).",
        ],
      },
      {
        title: "7. Tes droits",
        paragraphs: [
          "Selon ta juridiction, tu peux disposer de certains droits sur tes données personnelles, notamment :",
          "• droit d’accès : savoir quelles données nous détenons sur toi ;\n• droit de rectification : corriger des informations inexactes ;\n• droit à l’effacement (dans certaines limites) ;\n• droit d’opposition ou de limitation du traitement.",
          "Pour exercer tes droits, contacte-nous à : contactamoriai@gmail.com. Nous ferons de notre mieux pour te répondre dans un délai raisonnable, dans le respect des lois applicables.",
        ],
      },
      {
        title: "8. Sécurité",
        paragraphs: [
          "Nous mettons en place des mesures raisonnables (techniques et organisationnelles) pour protéger tes données contre l’accès non autorisé, la perte, la modification ou la divulgation.",
          "Aucun système n’étant parfaitement sécurisé, nous te recommandons également de choisir un mot de passe fort, de ne pas le réutiliser sur d’autres services et de le garder confidentiel.",
        ],
      },
      {
        title: "9. Utilisation par des mineurs",
        paragraphs: [
          "AmorIAI.app est destiné à des utilisateurs adultes. Si tu as moins de 18 ans, l’utilisation du service devrait se faire avec l’autorisation d’un parent ou d’un tuteur légal, en fonction des lois de ton pays.",
          "Si nous découvrons qu’un compte a été créé en violation de ces règles, nous pourrons le suspendre ou le supprimer.",
        ],
      },
      {
        title: "10. Modifications de cette politique",
        paragraphs: [
          "Nous pouvons mettre à jour cette politique de confidentialité pour refléter l’évolution du service, de la technologie ou des lois applicables.",
          "En cas de modification importante, nous pourrons t’en informer via l’application, par e-mail ou via notre site. La version la plus récente reste toujours disponible sur cette page.",
        ],
      },
      {
        title: "11. Comment nous contacter",
        paragraphs: [
          "Pour toute question liée à la confidentialité ou à tes données personnelles, tu peux nous écrire à :",
          "• Adresse e-mail de contact : contactamoriai@gmail.com",
        ],
      },
    ],
  },
  en: {
    heroKicker: "PRIVACY POLICY",
    heroTitle: "How AmorIAI.app protects your data.",
    heroSubtitle:
      "This policy explains what data we collect, why we collect it and how we protect it when you use AmorIAI.app.",
    updatedLabel: "Last updated:",
    updatedDate: "November 2025",
    sections: [
      {
        title: "1. Who is responsible for your data?",
        paragraphs: [
          "AmorIAI.app is an application operated under the “AmoriA” brand. For any privacy-related question, you can contact us at: contactamoriai@gmail.com.",
          "When we say “we”, “AmoriA” or “the service”, we refer to the team behind AmorIAI.app.",
        ],
      },
      {
        title: "2. What data do we collect?",
        paragraphs: [
          "We may collect several types of data when you use AmorIAI.app:",
          "• Account information: e-mail address, encrypted password, preferred language, account settings.\n• Usage data: login dates and times, device type, operating system, technical logs used to improve the service.\n• Conversation content: text messages and some metadata (time, language used) exchanged with your AmorIAI.",
          "We do not sell your personal data to third parties.",
        ],
      },
      {
        title: "3. How do we use your data?",
        paragraphs: [
          "We use your data to:",
          "• Provide the service: create your account, log you in, enable text/voice exchanges with your AmorIAI.\n• Personalize your experience: in paid plans, enable your AmorIAI to remember you over time.\n• Improve AmorIAI.app: analyze usage in an aggregated way to understand what works and what does not.\n• Comply with legal obligations: for example, in response to lawful requests from competent authorities.",
        ],
      },
      {
        title: "4. AI, privacy and sensitive content",
        paragraphs: [
          "Your conversations with your AmorIAI may involve personal topics (emotions, relationships, wellbeing, etc.).",
          "We recommend that you:\n• do not share ultra-sensitive information (payment card numbers, passwords, full official documents, etc.);\n• avoid sharing data that could directly identify another person without their consent.",
          "The AI models used to run AmoriAI may analyze your content to generate responses, but we put safeguards in place so this data is used only to operate and improve the service.",
        ],
      },
      {
        title: "5. Sharing your data",
        paragraphs: [
          "We may share certain data with:",
          "• Technical providers (hosting, infrastructure, analytics tools) strictly necessary for AmorIAI.app to function.\n• Third-party AI services, when needed to generate responses from your AmorIAI.",
          "We do not share your personal conversations with advertisers for interest-based advertising.",
        ],
      },
      {
        title: "6. Data retention",
        paragraphs: [
          "We keep your data for as long as necessary to:",
          "• provide the service,\n• comply with legal obligations,\n• handle potential disputes.",
          "You can request deletion of your account by writing to: contactamoriai@gmail.com. Some data may be kept longer if required by law (for example, technical logs or proof of consent).",
        ],
      },
      {
        title: "7. Your rights",
        paragraphs: [
          "Depending on your jurisdiction, you may have certain rights over your personal data, including:",
          "• right of access;\n• right to rectification;\n• right to erasure (under certain conditions);\n• right to object or restrict processing.",
          "To exercise your rights, contact us at: contactamoriai@gmail.com. We will do our best to reply within a reasonable timeframe, in accordance with applicable law.",
        ],
      },
      {
        title: "8. Security",
        paragraphs: [
          "We implement reasonable technical and organisational measures to protect your data against unauthorised access, loss, modification or disclosure.",
          "No system is perfectly secure, so we also recommend that you choose a strong password, do not reuse it on other services and keep it confidential.",
        ],
      },
      {
        title: "9. Use by minors",
        paragraphs: [
          "AmorIAI.app is intended for adult users. If you are under 18, you should only use the service with the authorisation of a parent or legal guardian, where allowed by your local laws.",
          "If we discover that an account was created in breach of these rules, we may suspend or delete it.",
        ],
      },
      {
        title: "10. Changes to this policy",
        paragraphs: [
          "We may update this privacy policy to reflect changes in the service, technology or applicable law.",
          "In case of significant changes, we may notify you via the app, by e-mail or via our website. The latest version will always be available on this page.",
        ],
      },
      {
        title: "11. Contact us",
        paragraphs: [
          "For any privacy-related question or request about your personal data, you can contact us at:",
          "• Contact e-mail: contactamoriai@gmail.com",
        ],
      },
    ],
  },
  es: {
    heroKicker: "POLÍTICA DE PRIVACIDAD",
    heroTitle: "Cómo AmorIAI.app protege tus datos.",
    heroSubtitle:
      "Esta política explica qué datos recopilamos, por qué los recopilamos y cómo los protegemos cuando usas AmorIAI.app.",
    updatedLabel: "Última actualización:",
    updatedDate: "noviembre de 2025",
    sections: [
      {
        title: "1. ¿Quién es responsable de tus datos?",
        paragraphs: [
          "AmorIAI.app es una aplicación operada bajo la marca «AmorIAI». Para cualquier pregunta sobre privacidad, puedes escribirnos a: contactamoriai@gmail.com.",
          "Cuando hablamos de «nosotros», «AmoriA» o «el servicio», nos referimos al equipo detrás de AmorIAI.app.",
        ],
      },
      {
        title: "2. ¿Qué datos recopilamos?",
        paragraphs: [
          "Podemos recopilar varios tipos de datos cuando usas AmorIAI.app:",
          "• Información de cuenta: correo electrónico, contraseña cifrada, idioma preferido, ajustes de tu cuenta.\n• Datos de uso: fechas y horas de conexión, tipo de dispositivo, sistema operativo, datos técnicos para mejorar el servicio.\n• Contenido de las conversaciones con tu AmorIA: mensajes de texto y algunas metadatos (hora, idioma utilizado).",
          "No vendemos tus datos personales a terceros.",
        ],
      },
      {
        title: "3. ¿Cómo utilizamos tus datos?",
        paragraphs: [
          "Utilizamos tus datos para:",
          "• Prestar el servicio: crear tu cuenta, iniciar sesión y permitir los intercambios de texto/voz con tu AmorIA.\n• Personalizar tu experiencia: en los planes de pago, permitir que tu AmorIA recuerde ciertos elementos a lo largo del tiempo.\n• Mejorar AmoriA.app: analizar el uso de forma agregada para entender qué funciona y qué no.\n• Cumplir con nuestras obligaciones legales: por ejemplo, ante solicitudes válidas de autoridades competentes.",
        ],
      },
      {
        title: "4. IA, privacidad y contenido sensible",
        paragraphs: [
          "Tus conversaciones con tu AmorIA pueden tratar temas personales (emociones, relaciones, bienestar, etc.).",
          "Te recomendamos:\n• no compartir información ultra sensible (números de tarjeta, contraseñas, documentos oficiales completos, etc.);\n• evitar compartir datos que identifiquen directamente a otra persona sin su consentimiento.",
          "Los modelos de IA utilizados para hacer funcionar AmoriA pueden analizar tu contenido para responder, pero aplicamos medidas de protección para limitar el uso de estos datos a la prestación y mejora del servicio.",
        ],
      },
      {
        title: "5. Compartir tus datos",
        paragraphs: [
          "Podemos compartir algunos datos con:",
          "• Proveedores técnicos (alojamiento, infraestructura, herramientas de analítica) estrictamente necesarios para el funcionamiento de AmoriA.app.\n• Servicios de IA de terceros, cuando sea necesario para generar las respuestas de tu AmorIAI.",
          "No compartimos tus conversaciones personales con anunciantes para publicidad basada en tus chats.",
        ],
      },
      {
        title: "6. Plazo de conservación",
        paragraphs: [
          "Conservamos tus datos durante el tiempo necesario para:",
          "• prestar el servicio,\n• cumplir con obligaciones legales,\n• gestionar posibles disputas.",
          "Puedes solicitar la eliminación de tu cuenta escribiendo a: contactamoriai@gmail.com. Algunos datos pueden conservarse más tiempo si la ley lo exige (por ejemplo, registros técnicos o pruebas de consentimiento).",
        ],
      },
      {
        title: "7. Tus derechos",
        paragraphs: [
          "Según tu jurisdicción, puedes tener ciertos derechos sobre tus datos personales, entre ellos:",
          "• derecho de acceso;\n• derecho de rectificación;\n• derecho de supresión (en ciertos casos);\n• derecho a oponerte o limitar el tratamiento.",
          "Para ejercer tus derechos, escríbenos a: contactamoriai@gmail.com. Haremos lo posible por responder en un plazo razonable, de acuerdo con la legislación aplicable.",
        ],
      },
      {
        title: "8. Seguridad",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra el acceso no autorizado, pérdida, modificación o divulgación.",
          "Ningún sistema es totalmente seguro, por lo que también te recomendamos usar una contraseña robusta, no reutilizarla en otros servicios y mantenerla confidencial.",
        ],
      },
      {
        title: "9. Uso por menores",
        paragraphs: [
          "AmorIAI.app está destinado a personas adultas. Si eres menor de 18 años, solo deberías usar el servicio con autorización de un padre, madre o tutor legal, según las leyes de tu país.",
          "Si descubrimos que una cuenta se creó en contra de estas reglas, podremos suspenderla o eliminarla.",
        ],
      },
      {
        title: "10. Cambios en esta política",
        paragraphs: [
          "Podemos actualizar esta política de privacidad para reflejar cambios en el servicio, en la tecnología o en la legislación aplicable.",
          "En caso de cambios importantes, podremos avisarte a través de la app, por correo electrónico o en nuestro sitio. La versión más reciente estará siempre disponible en esta página.",
        ],
      },
      {
        title: "11. Cómo contactarnos",
        paragraphs: [
          "Para cualquier pregunta relacionada con la privacidad o tus datos personales, puedes escribirnos a:",
          "• Correo de contacto: contactamoriai@gmail.com",
        ],
      },
    ],
  },
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

export default function PrivacyPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = PRIVACY_STRINGS[locale];

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
              ? "Confidentialité"
              : locale === "en"
              ? "Privacy"
              : "Privacidad"}
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

      {/* STYLES (identiques à ceux de legal / vitrine) */}
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
