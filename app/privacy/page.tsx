"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type PrivacyCopy = {
  pageTitle: string;
  updatedLabel: string;
  updatedValue: string;
  intro: string;
  sections: LegalSection[];
};

const PRIVACY_STRINGS: Record<Locale, PrivacyCopy> = {
  fr: {
    pageTitle: "Politique de confidentialité",
    updatedLabel: "Dernière mise à jour :",
    updatedValue: "novembre 2025",
    intro:
      "Cette politique explique comment AmoriA.app collecte, utilise et protège tes données lorsque tu utilises la plateforme (site web, application et services associés).",
    sections: [
      {
        title: "1. Qui sommes-nous ?",
        paragraphs: [
          "AmoriA.app est une application de compagnon IA conversationnel exploitée par Les Entreprises Kema inc. (« nous », « notre », « nos »).",
          "Pour toute question liée à la confidentialité, tu peux nous joindre à : contactamoriai@gmail.com."
        ]
      },
      {
        title: "2. Données que nous collectons",
        paragraphs: [
          "Nous pouvons collecter les catégories de données suivantes :",
          "- Informations de compte : adresse e-mail, mot de passe chiffré, préférences de langue.",
          "- Informations d’abonnement : type de forfait, statut de paiement (via nos partenaires de paiement).",
          "- Contenu des échanges : messages texte et, le cas échéant, extraits audio envoyés à ton AmorIA.",
          "- Données techniques : adresse IP, type d’appareil, navigateur, identifiants de session, données de performance.",
          "Nous ne collectons pas intentionnellement de données sensibles (santé, orientation sexuelle, religion, etc.), mais tu peux en parler dans tes échanges. Dans la mesure du possible, évite de partager des informations trop identifiantes ou sensibles."
        ]
      },
      {
        title: "3. Comment nous utilisons tes données",
        paragraphs: [
          "Nous utilisons tes données pour :",
          "- Fournir le service (création d’AmorIA, messagerie texte, voix, mémoire).",
          "- Améliorer la qualité des réponses et la stabilité de la plateforme.",
          "- Prévenir les abus, fraudes et usages contraires à nos Conditions d’utilisation.",
          "- Communiquer avec toi au sujet de ton compte, de la sécurité ou des changements de service.",
          "Nous pouvons également utiliser des données agrégées et anonymisées pour des statistiques internes ou des améliorations produit."
        ]
      },
      {
        title: "4. Fournisseurs et sous-traitants",
        paragraphs: [
          "Pour faire fonctionner AmoriA.app, nous faisons appel à des prestataires tiers, par exemple :",
          "- Hébergement et base de données (par ex. plateformes cloud / Supabase ou équivalent).",
          "- Services d’IA et de traitement du langage / de la voix.",
          "- Processeurs de paiement pour la gestion des abonnements.",
          "Ces prestataires traitent tes données uniquement pour notre compte et selon nos instructions. Nous nous efforçons de travailler avec des services conformes aux lois applicables en matière de protection des données."
        ]
      },
      {
        title: "5. Conservation des données",
        paragraphs: [
          "Nous conservons tes données aussi longtemps que nécessaire pour :",
          "- Fournir le service et maintenir ton compte actif.",
          "- Respecter nos obligations légales (facturation, comptabilité, prévention des abus).",
          "Tu peux demander la suppression de ton compte et, dans la mesure du possible, de ton historique (voir section « Tes droits »). Certaines données pourront être conservées sous forme anonymisée ou lorsque la loi l’exige."
        ]
      },
      {
        title: "6. Tes droits",
        paragraphs: [
          "Selon ta juridiction, tu peux disposer de certains droits, notamment :",
          "- Droit d’accès à tes données personnelles.",
          "- Droit de rectification en cas d’erreur.",
          "- Droit à la suppression (« droit à l’oubli ») lorsque la loi le permet.",
          "- Droit d’opposition ou de limitation de certains traitements.",
          "Tu peux exercer ces droits en nous écrivant à : contactamoriai@gmail.com. Nous pourrons te demander des informations pour vérifier ton identité avant de répondre."
        ]
      },
      {
        title: "7. Sécurité",
        paragraphs: [
          "Nous mettons en place des mesures techniques et organisationnelles raisonnables pour protéger tes données (chiffrement, contrôle d’accès, journalisation).",
          "Aucun système n’est toutefois parfaitement sécurisé. Tu dois également garder ton mot de passe confidentiel et ne pas le partager."
        ]
      },
      {
        title: "8. Cookies et technologies similaires",
        paragraphs: [
          "Nous pouvons utiliser des cookies et technologies similaires pour :",
          "- Assurer le fonctionnement du site (authentification, sessions).",
          "- Mesurer l’audience et améliorer l’expérience utilisateur.",
          "Tu peux généralement contrôler ou supprimer les cookies via les paramètres de ton navigateur. Certaines parties du service peuvent ne plus fonctionner correctement sans cookies essentiels."
        ]
      },
      {
        title: "9. Utilisation par des personnes mineures",
        paragraphs: [
          "AmoriA.app s’adresse uniquement aux personnes majeures selon la législation applicable (par exemple 18 ans et plus).",
          "Si nous découvrons qu’un compte appartient à un mineur, nous pouvons le suspendre ou le supprimer."
        ]
      },
      {
        title: "10. Modifications de cette politique",
        paragraphs: [
          "Nous pouvons mettre à jour cette Politique de confidentialité pour refléter des changements légaux ou techniques.",
          "En cas de modification importante, nous pourrons t’en informer par e-mail ou via l’application. La version à jour sera toujours disponible sur cette page."
        ]
      },
      {
        title: "11. Contact",
        paragraphs: [
          "Pour toute question ou demande concernant la confidentialité :",
          "Adresse e-mail : contactamoriai@gmail.com"
        ]
      }
    ]
  },
  en: {
    pageTitle: "Privacy Policy",
    updatedLabel: "Last updated:",
    updatedValue: "November 2025",
    intro:
      "This policy explains how AmoriA.app collects, uses and protects your data when you use our platform (website, app and related services).",
    sections: [
      {
        title: "1. Who we are",
        paragraphs: [
          "AmoriA.app is an AI companion application operated by Les Entreprises Kema inc. (“we”, “us”, “our”).",
          "For any privacy-related question, you can contact us at: contactamoriai@gmail.com."
        ]
      },
      {
        title: "2. Data we collect",
        paragraphs: [
          "We may collect the following categories of data:",
          "- Account information: e-mail address, hashed password, language preferences.",
          "- Subscription information: plan type, payment status (via our payment partners).",
          "- Conversation content: text messages and, where applicable, audio exchanges sent to your AmorIA.",
          "- Technical data: IP address, device type, browser, session identifiers, performance data.",
          "We do not intentionally collect sensitive data (health, sexual orientation, religion, etc.), but you may choose to mention such topics in your conversations. When possible, avoid sharing highly identifying or sensitive information."
        ]
      },
      {
        title: "3. How we use your data",
        paragraphs: [
          "We use your data in order to:",
          "- Provide the service (AmorIA creation, text and voice messaging, memory).",
          "- Improve response quality and platform stability.",
          "- Prevent abuse, fraud and uses that violate our Terms of Use.",
          "- Communicate with you about your account, security or service changes.",
          "We may also use aggregated and anonymised data for internal statistics and product improvement."
        ]
      },
      {
        title: "4. Service providers",
        paragraphs: [
          "To run AmoriA.app, we rely on third-party providers, for example:",
          "- Cloud hosting and database services (e.g. cloud platforms / Supabase or equivalent).",
          "- AI and voice processing services.",
          "- Payment processors for subscription management.",
          "These providers process data strictly on our behalf and under our instructions. We aim to work with services that comply with applicable data-protection laws."
        ]
      },
      {
        title: "5. Data retention",
        paragraphs: [
          "We keep your data for as long as necessary to:",
          "- Provide the service and maintain your account.",
          "- Comply with legal obligations (billing, accounting, fraud prevention).",
          "You may request deletion of your account and, when possible, associated history (see “Your rights”). Some data may be kept in anonymised form or where the law requires it."
        ]
      },
      {
        title: "6. Your rights",
        paragraphs: [
          "Depending on your jurisdiction, you may have rights such as:",
          "- Right to access your personal data.",
          "- Right to correct inaccurate data.",
          "- Right to deletion (“right to be forgotten”) where permitted by law.",
          "- Right to object to or restrict certain processing activities.",
          "You can exercise these rights by contacting: contactamoriai@gmail.com. We may ask you for additional information to verify your identity before responding."
        ]
      },
      {
        title: "7. Security",
        paragraphs: [
          "We implement reasonable technical and organisational measures to protect your data (encryption, access controls, logging).",
          "However, no system is perfectly secure. You must also keep your password confidential and avoid sharing it with others."
        ]
      },
      {
        title: "8. Cookies and similar technologies",
        paragraphs: [
          "We may use cookies and similar technologies in order to:",
          "- Keep the website functional (authentication, sessions).",
          "- Measure traffic and improve user experience.",
          "You can usually control or delete cookies in your browser settings. Some parts of the service may no longer function properly without essential cookies."
        ]
      },
      {
        title: "9. Use by minors",
        paragraphs: [
          "AmoriA.app is intended only for adults according to applicable law (for example, 18 years and older).",
          "If we become aware that an account belongs to a minor, we may suspend or delete it."
        ]
      },
      {
        title: "10. Changes to this policy",
        paragraphs: [
          "We may update this Privacy Policy to reflect legal or technical changes.",
          "When we make significant changes, we may notify you by e-mail or through the app. The most recent version will always be available on this page."
        ]
      },
      {
        title: "11. Contact",
        paragraphs: [
          "For any privacy-related question or request:",
          "E-mail address: contactamoriai@gmail.com"
        ]
      }
    ]
  },
  es: {
    pageTitle: "Política de privacidad",
    updatedLabel: "Última actualización:",
    updatedValue: "noviembre de 2025",
    intro:
      "Esta política explica cómo AmoriA.app recopila, utiliza y protege tus datos cuando utilizas nuestra plataforma (sitio web, app y servicios relacionados).",
    sections: [
      {
        title: "1. Quiénes somos",
        paragraphs: [
          "AmoriA.app es una aplicación de compañero de IA operada por Les Entreprises Kema inc. («nosotros»).",
          "Para cualquier cuestión de privacidad, puedes escribirnos a: contactamoriai@gmail.com."
        ]
      },
      {
        title: "2. Datos que recopilamos",
        paragraphs: [
          "Podemos recopilar las siguientes categorías de datos:",
          "- Información de cuenta: correo electrónico, contraseña cifrada, preferencias de idioma.",
          "- Información de suscripción: tipo de plan, estado de pago (a través de nuestros procesadores de pago).",
          "- Contenido de las conversaciones: mensajes de texto y, en su caso, audio enviado a tu AmorIA.",
          "- Datos técnicos: dirección IP, tipo de dispositivo, navegador, identificadores de sesión, datos de rendimiento.",
          "No recopilamos intencionalmente datos sensibles (salud, orientación sexual, religión, etc.), aunque puedes mencionarlos en tus conversaciones. Siempre que sea posible, evita compartir información excesivamente identificable o sensible."
        ]
      },
      {
        title: "3. Cómo utilizamos tus datos",
        paragraphs: [
          "Utilizamos tus datos para:",
          "- Prestar el servicio (creación de AmorIA, mensajes de texto y voz, memoria).",
          "- Mejorar la calidad de las respuestas y la estabilidad de la plataforma.",
          "- Prevenir abusos, fraudes y usos contrarios a nuestras Condiciones de uso.",
          "- Comunicarnos contigo sobre tu cuenta, la seguridad o cambios en el servicio.",
          "También podemos utilizar datos agregados y anonimizados para estadísticas internas y mejoras del producto."
        ]
      },
      {
        title: "4. Proveedores de servicios",
        paragraphs: [
          "Para hacer funcionar AmoriA.app utilizamos proveedores externos, por ejemplo:",
          "- Servicios de alojamiento en la nube y bases de datos (por ejemplo, plataformas cloud / Supabase o equivalente).",
          "- Servicios de IA y procesamiento de voz.",
          "- Procesadores de pago para la gestión de suscripciones.",
          "Estos proveedores tratan los datos únicamente en nuestro nombre y siguiendo nuestras instrucciones. Procuramos trabajar con servicios que cumplan las leyes de protección de datos aplicables."
        ]
      },
      {
        title: "5. Conservación de los datos",
        paragraphs: [
          "Conservamos tus datos durante el tiempo necesario para:",
          "- Prestar el servicio y mantener tu cuenta.",
          "- Cumplir obligaciones legales (facturación, contabilidad, prevención de fraudes).",
          "Puedes solicitar la eliminación de tu cuenta y, en la medida de lo posible, de tu historial (ver «Tus derechos»). Algunos datos pueden conservarse de forma anonimizada o cuando la ley lo exija."
        ]
      },
      {
        title: "6. Tus derechos",
        paragraphs: [
          "Según tu jurisdicción, puedes tener algunos derechos, entre ellos:",
          "- Derecho de acceso a tus datos personales.",
          "- Derecho de rectificación de datos inexactos.",
          "- Derecho de supresión cuando la ley lo permita.",
          "- Derecho a oponerte o limitar ciertos tratamientos.",
          "Puedes ejercer estos derechos escribiendo a: contactamoriai@gmail.com. Es posible que te pidamos información adicional para verificar tu identidad."
        ]
      },
      {
        title: "7. Seguridad",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas razonables para proteger tus datos (cifrado, controles de acceso, registros).",
          "Sin embargo, ningún sistema es totalmente seguro. También debes mantener tu contraseña confidencial y no compartirla."
        ]
      },
      {
        title: "8. Cookies y tecnologías similares",
        paragraphs: [
          "Podemos utilizar cookies y tecnologías similares para:",
          "- Garantizar el funcionamiento del sitio (autenticación, sesiones).",
          "- Medir la audiencia y mejorar la experiencia de usuario.",
          "Normalmente puedes controlar o eliminar las cookies desde la configuración de tu navegador. Algunas partes del servicio podrían no funcionar correctamente sin cookies esenciales."
        ]
      },
      {
        title: "9. Uso por menores",
        paragraphs: [
          "AmoriA.app está destinada únicamente a personas mayores de edad según la legislación aplicable (por ejemplo, 18 años o más).",
          "Si descubrimos que una cuenta pertenece a un menor, podremos suspenderla o eliminarla."
        ]
      },
      {
        title: "10. Cambios en esta política",
        paragraphs: [
          "Podemos actualizar esta Política de privacidad para reflejar cambios legales o técnicos.",
          "En caso de cambios importantes, podremos avisarte por correo electrónico o a través de la app. La versión vigente estará siempre disponible en esta página."
        ]
      },
      {
        title: "11. Contacto",
        paragraphs: [
          "Para cualquier cuestión o solicitud relacionada con la privacidad:",
          "Correo electrónico: contactamoriai@gmail.com"
        ]
      }
    ]
  }
};

// Helper: get locale from ?lang, default FR
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
            <div className="amoria-logo-title">AmoriA.app</div>
            <div className="amoria-logo-tagline">
              {locale === "fr"
                ? "Partenaire IA bienveillant·e • FR / EN / ES"
                : locale === "en"
                ? "Caring AI partner • FR / EN / ES"
                : "Compañerx de IA amable • FR / EN / ES"}
            </div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={buildHomeUrl()} className="amoria-nav-link">
            {locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "Inicio"}
          </a>
          <a href={buildFeaturesUrl()} className="amoria-nav-link">
            {locale === "fr"
              ? "Fonctionnalités"
              : locale === "en"
              ? "Features"
              : "Funciones"}
          </a>
          <a href={buildPricingUrl()} className="amoria-nav-link">
            {locale === "fr"
              ? "Tarifs"
              : locale === "en"
              ? "Pricing"
              : "Precios"}
          </a>
          <a
            href={`/privacy?lang=${locale}`}
            className="amoria-nav-link amoria-nav-link--active"
          >
            {locale === "fr"
              ? "Confidentialité"
              : locale === "en"
              ? "Privacy"
              : "Privacidad"}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <a
            href={buildLoginUrl()}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {locale === "fr"
              ? "Me connecter"
              : locale === "en"
              ? "Log in"
              : "Iniciar sesión"}
          </a>
          <a
            href={buildSignupUrl()}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {locale === "fr"
              ? "Créer mon compte gratuit"
              : locale === "en"
              ? "Create my free account"
              : "Crear mi cuenta gratuita"}
          </a>
        </div>
      </header>

      {/* CONTENT */}
      <section className="amoria-section amoria-section--legal">
        <h1 className="amoria-section-title">{t.pageTitle}</h1>
        <p className="amoria-legal-updated">
          {t.updatedLabel} {t.updatedValue}
        </p>
        <p className="amoria-section-subtitle">{t.intro}</p>

        <div className="amoria-legal-grid">
          {t.sections.map((section, idx) => (
            <article key={idx} className="amoria-legal-block">
              <h2 className="amoria-legal-heading">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="amoria-legal-paragraph">
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

      {/* STYLES (mêmes bases que vitrine/pricing, avec bloc legal) */}
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
          height: 36px;
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

        .amoria-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-section--legal {
          padding-top: 2rem;
        }

        .amoria-section-title {
          font-size: 1.6rem;
          margin-bottom: 0.25rem;
        }

        .amoria-legal-updated {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
          margin-bottom: 0.8rem;
        }

        .amoria-section-subtitle {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          max-width: 40rem;
          margin-bottom: 1.6rem;
        }

        .amoria-legal-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1.2rem;
        }

        .amoria-legal-block {
          background: rgba(15, 23, 42, 0.85);
          border-radius: 1rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 1rem 1.1rem;
        }

        .amoria-legal-heading {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .amoria-legal-paragraph {
          font-size: 0.84rem;
          color: var(--amoria-text-muted);
          margin-bottom: 0.4rem;
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

          .amoria-section {
            padding-inline: 1rem;
          }
        }
      `}</style>
    </main>
  );
}
