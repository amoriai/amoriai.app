"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type TermsCopy = {
  pageTitle: string;
  updatedLabel: string;
  updatedValue: string;
  intro: string;
  sections: LegalSection[];
};

const TERMS_STRINGS: Record<Locale, TermsCopy> = {
  fr: {
    pageTitle: "Conditions d’utilisation",
    updatedLabel: "Dernière mise à jour :",
    updatedValue: "novembre 2025",
    intro:
      "Les présentes Conditions d’utilisation (les « Conditions ») encadrent l’accès et l’utilisation de AmoriA.app (le « Service »). En créant un compte ou en utilisant AmoriA, tu acceptes ces Conditions.",
    sections: [
      {
        title: "1. Exploitant du service",
        paragraphs: [
          "AmoriA.app est exploité par Les Entreprises Kema inc.",
          "Tu peux nous contacter à : contactamoriai@gmail.com."
        ]
      },
      {
        title: "2. Public visé",
        paragraphs: [
          "Le Service est destiné uniquement aux personnes majeures selon la loi applicable (par exemple, 18 ans et plus).",
          "En utilisant AmoriA.app, tu confirmes que tu as l’âge légal requis et la capacité d’accepter ces Conditions."
        ]
      },
      {
        title: "3. Description du service",
        paragraphs: [
          "AmoriA.app propose des compagnons IA conversationnels, accessibles par texte et, selon le forfait choisi, par voix.",
          "Les réponses sont générées à l’aide de modèles d’intelligence artificielle. Elles peuvent être incomplètes, inexactes ou inadaptées à certaines situations.",
          "Le Service est fourni à des fins de soutien, d’échange et de réflexion personnelle. Il ne remplace en aucun cas un avis médical, psychologique, juridique, financier ou professionnel."
        ]
      },
      {
        title: "4. Compte utilisateur",
        paragraphs: [
          "Pour utiliser AmoriA.app, tu dois créer un compte et fournir une adresse e-mail valide.",
          "Tu es responsable de :",
          "- La confidentialité de ton mot de passe.",
          "- Toute activité effectuée depuis ton compte.",
          "Si tu soupçonnes un accès non autorisé, tu dois nous en informer rapidement."
        ]
      },
      {
        title: "5. Abonnements et paiements",
        paragraphs: [
          "Une partie du Service est gratuite et une autre est accessible via des abonnements payants.",
          "Les détails des forfaits, prix et limites (messages, voix, nombre d’AmorIA, etc.) sont indiqués sur la page Tarifs.",
          "Les paiements sont traités par des prestataires tiers. En souscrivant un abonnement, tu acceptes également les conditions de ces prestataires.",
          "Sauf indication contraire, les abonnements sont reconduits automatiquement à chaque période (mensuelle, par exemple) jusqu’à leur annulation.",
          "Les politiques de remboursement peuvent varier selon la plateforme (site web, Google Play, App Store). Le cas échéant, les règles de la plateforme d’achat prévalent."
        ]
      },
      {
        title: "6. Utilisation acceptable",
        paragraphs: [
          "Tu t’engages à ne pas utiliser AmoriA.app pour :",
          "- Violer la loi, harceler ou menacer une personne.",
          "- Envoyer du contenu haineux, discriminatoire, violent ou sexuellement explicite illégal.",
          "- Tenter de nuire au Service (piratage, surcharge, contournement des mesures de sécurité).",
          "- Collecter ou tenter de identifier d’autres utilisateurs sans leur consentement.",
          "Nous pouvons suspendre ou résilier ton accès en cas d’abus ou de violation de ces Conditions."
        ]
      },
      {
        title: "7. Propriété intellectuelle",
        paragraphs: [
          "L’interface, le design, le logo AmoriA.app, ainsi que la plupart des éléments visuels et textuels du Service sont protégés par les droits de propriété intellectuelle.",
          "Sous réserve du respect des présentes Conditions, tu obtiens une licence limitée, non exclusive et non transférable pour utiliser le Service à des fins personnelles et non commerciales."
        ]
      },
      {
        title: "8. Contenu généré par l’utilisateur",
        paragraphs: [
          "Tu restes responsable du contenu que tu fournis (messages, textes, enregistrements audio, etc.).",
          "En utilisant le Service, tu nous accordes une licence mondiale limitée pour traiter ce contenu dans le seul but de fournir AmoriA (réponses de l’IA, mémorisation contextuelle, amélioration du service).",
          "Tu garantis que tu disposes des droits nécessaires sur le contenu que tu partages."
        ]
      },
      {
        title: "9. Absence de garanties",
        paragraphs: [
          "Le Service est fourni « tel quel » et « selon disponibilité ». Nous ne garantissons pas que :",
          "- Le Service sera exempt d’erreurs, d’interruptions ou de bugs.",
          "- Les réponses de l’IA seront exactes, complètes ou adaptées à toutes les situations.",
          "Tu utilises AmoriA.app sous ta propre responsabilité."
        ]
      },
      {
        title: "10. Limitation de responsabilité",
        paragraphs: [
          "Dans la mesure maximale permise par la loi, Les Entreprises Kema inc. ne pourra être tenue responsable des dommages indirects, consécutifs, spéciaux ou punitifs liés à l’utilisation ou l’impossibilité d’utiliser le Service.",
          "Notre responsabilité totale, le cas échéant, sera limitée au montant que tu as payé pour le Service sur la période de facturation en cours au moment du litige."
        ]
      },
      {
        title: "11. Résiliation",
        paragraphs: [
          "Tu peux arrêter d’utiliser le Service à tout moment et, si tu le souhaites, demander la suppression de ton compte.",
          "Nous pouvons suspendre ou résilier ton accès en cas de violation grave ou répétée de ces Conditions, ou si la loi l’exige."
        ]
      },
      {
        title: "12. Droit applicable",
        paragraphs: [
          "Sous réserve des lois impératives de ton pays de résidence, ces Conditions sont régies par les lois en vigueur dans la province de Québec (Canada).",
          "Tout litige lié au Service pourra être soumis aux tribunaux compétents de cette juridiction, sauf disposition impérative contraire."
        ]
      },
      {
        title: "13. Modifications des Conditions",
        paragraphs: [
          "Nous pouvons mettre à jour ces Conditions pour refléter des changements techniques, juridiques ou fonctionnels.",
          "Si une modification est importante, nous pourrons t’en informer via l’application ou par e-mail. Le fait de continuer à utiliser le Service après l’entrée en vigueur de ces changements vaut acceptation des Conditions mises à jour."
        ]
      },
      {
        title: "14. Contact",
        paragraphs: [
          "Pour toute question concernant ces Conditions :",
          "Adresse e-mail : contactamoriai@gmail.com"
        ]
      }
    ]
  },
  en: {
    pageTitle: "Terms of Use",
    updatedLabel: "Last updated:",
    updatedValue: "November 2025",
    intro:
      "These Terms of Use (the “Terms”) govern your access to and use of AmoriA.app (the “Service”). By creating an account or using AmoriA, you agree to these Terms.",
    sections: [
      {
        title: "1. Service operator",
        paragraphs: [
          "AmoriA.app is operated by Les Entreprises Kema inc.",
          "You can contact us at: contactamoriai@gmail.com."
        ]
      },
      {
        title: "2. Target users",
        paragraphs: [
          "The Service is intended only for adults according to applicable law (for example, 18 years or older).",
          "By using AmoriA.app, you confirm that you meet the legal age requirement and have the capacity to agree to these Terms."
        ]
      },
      {
        title: "3. Description of the Service",
        paragraphs: [
          "AmoriA.app provides conversational AI companions, available via text and, depending on your plan, via voice.",
          "Responses are generated by artificial intelligence models and may be incomplete, inaccurate or unsuitable for certain situations.",
          "The Service is offered for support, conversation and personal reflection only. It does not replace professional medical, psychological, legal, financial or other expert advice."
        ]
      },
      {
        title: "4. User account",
        paragraphs: [
          "To use AmoriA.app, you must create an account and provide a valid e-mail address.",
          "You are responsible for:",
          "- Keeping your password confidential.",
          "- All activity that occurs under your account.",
          "If you suspect unauthorised access, you should notify us promptly."
        ]
      },
      {
        title: "5. Subscriptions and payments",
        paragraphs: [
          "Part of the Service is free, and other features are available through paid subscriptions.",
          "Details about plans, prices and limits (messages, voice, number of AmorIAs, etc.) are displayed on the Pricing page.",
          "Payments are processed by third-party providers. By subscribing, you also accept their terms.",
          "Unless stated otherwise, subscriptions renew automatically at the end of each billing period until cancelled.",
          "Refund policies may vary depending on the platform (website, Google Play, App Store). When applicable, the rules of the purchasing platform prevail."
        ]
      },
      {
        title: "6. Acceptable use",
        paragraphs: [
          "You agree not to use AmoriA.app to:",
          "- Break the law, harass or threaten others.",
          "- Send hateful, discriminatory, violent or illegal sexually explicit content.",
          "- Attempt to damage the Service (hacking, overloading, bypassing security).",
          "- Collect or attempt to identify other users without their consent.",
          "We may suspend or terminate your access if you abuse the Service or violate these Terms."
        ]
      },
      {
        title: "7. Intellectual property",
        paragraphs: [
          "The interface, design, AmoriA.app logo and most visual and textual elements of the Service are protected by intellectual property rights.",
          "Subject to your compliance with these Terms, you are granted a limited, non-exclusive, non-transferable licence to use the Service for personal, non-commercial purposes."
        ]
      },
      {
        title: "8. User-generated content",
        paragraphs: [
          "You remain responsible for the content you provide (messages, text, audio recordings, etc.).",
          "By using the Service, you grant us a limited worldwide licence to process this content solely to provide the Service (AI responses, contextual memory, service improvement).",
          "You warrant that you have the necessary rights to the content you share."
        ]
      },
      {
        title: "9. No guarantees",
        paragraphs: [
          "The Service is provided “as is” and “as available”. We do not warrant that:",
          "- The Service will be error-free or uninterrupted.",
          "- AI responses will be accurate, complete or suitable for every situation.",
          "You use AmoriA.app at your own risk."
        ]
      },
      {
        title: "10. Limitation of liability",
        paragraphs: [
          "To the maximum extent permitted by law, Les Entreprises Kema inc. shall not be liable for any indirect, consequential, special or punitive damages arising from your use or inability to use the Service.",
          "Any direct liability, if established, shall be limited to the amount you paid for the Service during the current billing period at the time of the issue."
        ]
      },
      {
        title: "11. Termination",
        paragraphs: [
          "You may stop using the Service at any time and request deletion of your account if you wish.",
          "We may suspend or terminate your access in case of serious or repeated breaches of these Terms, or where required by law."
        ]
      },
      {
        title: "12. Governing law",
        paragraphs: [
          "Subject to mandatory laws of your country of residence, these Terms are governed by the laws in force in the Province of Quebec, Canada.",
          "Any dispute may be brought before the competent courts of that jurisdiction, unless otherwise required by mandatory law."
        ]
      },
      {
        title: "13. Changes to the Terms",
        paragraphs: [
          "We may update these Terms to reflect technical, legal or functional changes.",
          "If a change is significant, we may notify you via the app or by e-mail. Continued use of the Service after the changes take effect constitutes acceptance of the updated Terms."
        ]
      },
      {
        title: "14. Contact",
        paragraphs: [
          "For any questions about these Terms:",
          "E-mail: contactamoriai@gmail.com"
        ]
      }
    ]
  },
  es: {
    pageTitle: "Condiciones de uso",
    updatedLabel: "Última actualización:",
    updatedValue: "noviembre de 2025",
    intro:
      "Estas Condiciones de uso (las «Condiciones») regulan el acceso y el uso de AmoriA.app (el «Servicio»). Al crear una cuenta o utilizar AmoriA, aceptas estas Condiciones.",
    sections: [
      {
        title: "1. Operador del servicio",
        paragraphs: [
          "AmoriA.app es operado por Les Entreprises Kema inc.",
          "Puedes contactarnos en: contactamoriai@gmail.com."
        ]
      },
      {
        title: "2. Usuarios a los que va dirigido",
        paragraphs: [
          "El Servicio está destinado únicamente a personas mayores de edad según la ley aplicable (por ejemplo, 18 años o más).",
          "Al usar AmoriA.app confirmas que cumples con el requisito de edad y tienes capacidad para aceptar estas Condiciones."
        ]
      },
      {
        title: "3. Descripción del Servicio",
        paragraphs: [
          "AmoriA.app ofrece compañeros de IA conversacionales disponibles por texto y, según el plan, también por voz.",
          "Las respuestas se generan mediante modelos de inteligencia artificial y pueden ser incompletas, inexactas o inadecuadas para ciertas situaciones.",
          "El Servicio se ofrece con fines de apoyo, conversación y reflexión personal. No sustituye asesoramiento médico, psicológico, jurídico, financiero ni profesional."
        ]
      },
      {
        title: "4. Cuenta de usuario",
        paragraphs: [
          "Para utilizar AmoriA.app debes crear una cuenta y proporcionar un correo electrónico válido.",
          "Eres responsable de:",
          "- Mantener la confidencialidad de tu contraseña.",
          "- Toda actividad que se realice desde tu cuenta.",
          "Si sospechas un acceso no autorizado, debes informarnos lo antes posible."
        ]
      },
      {
        title: "5. Suscripciones y pagos",
        paragraphs: [
          "Una parte del Servicio es gratuita y otras funciones se ofrecen mediante suscripciones de pago.",
          "Los detalles de los planes, precios y límites (mensajes, voz, número de AmorIA, etc.) se muestran en la página de Precios.",
          "Los pagos son procesados por terceros. Al suscribirte, aceptas también sus condiciones.",
          "Salvo que se indique lo contrario, las suscripciones se renuevan automáticamente al final de cada período de facturación hasta su cancelación.",
          "Las políticas de reembolso pueden variar según la plataforma (sitio web, Google Play, App Store). En su caso, prevalecen las reglas de la plataforma de compra."
        ]
      },
      {
        title: "6. Uso aceptable",
        paragraphs: [
          "Te comprometes a no utilizar AmoriA.app para:",
          "- Violar la ley, acosar o amenazar a otras personas.",
          "- Enviar contenido de odio, discriminatorio, violento o sexualmente explícito ilegal.",
          "- Intentar dañar el Servicio (hackeo, sobrecarga, eludir medidas de seguridad).",
          "- Recopilar o intentar identificar a otros usuarios sin su consentimiento.",
          "Podemos suspender o cancelar tu acceso en caso de abuso o incumplimiento de estas Condiciones."
        ]
      },
      {
        title: "7. Propiedad intelectual",
        paragraphs: [
          "La interfaz, el diseño, el logo de AmoriA.app y la mayoría de los elementos visuales y textuales del Servicio están protegidos por derechos de propiedad intelectual.",
          "Siempre que cumplas estas Condiciones, obtienes una licencia limitada, no exclusiva e intransferible para usar el Servicio con fines personales y no comerciales."
        ]
      },
      {
        title: "8. Contenido generado por el usuario",
        paragraphs: [
          "Sigues siendo responsable del contenido que aportas (mensajes, textos, grabaciones de audio, etc.).",
          "Al usar el Servicio, nos concedes una licencia mundial limitada para tratar dicho contenido únicamente con el fin de prestar AmoriA (respuestas de IA, memoria contextual, mejora del servicio).",
          "Garantizas que dispones de los derechos necesarios sobre el contenido que compartes."
        ]
      },
      {
        title: "9. Ausencia de garantías",
        paragraphs: [
          "El Servicio se ofrece «tal cual» y «según disponibilidad». No garantizamos que:",
          "- El Servicio esté libre de errores o interrupciones.",
          "- Las respuestas de la IA sean exactas, completas o adecuadas en todas las situaciones.",
          "Utilizas AmoriA.app bajo tu propia responsabilidad."
        ]
      },
      {
        title: "10. Limitación de responsabilidad",
        paragraphs: [
          "En la máxima medida permitida por la ley, Les Entreprises Kema inc. no será responsable de daños indirectos, consecuentes, especiales o punitivos derivados del uso o la imposibilidad de usar el Servicio.",
          "Cualquier responsabilidad directa, en su caso, se limitará al importe que hayas pagado por el Servicio durante el período de facturación vigente en el momento del problema."
        ]
      },
      {
        title: "11. Resolución",
        paragraphs: [
          "Puedes dejar de usar el Servicio en cualquier momento y solicitar la eliminación de tu cuenta si lo deseas.",
          "Podemos suspender o cancelar tu acceso en caso de incumplimientos graves o repetidos de estas Condiciones, o cuando la ley lo exija."
        ]
      },
      {
        title: "12. Ley aplicable",
        paragraphs: [
          "Sin perjuicio de las leyes imperativas de tu país de residencia, estas Condiciones se rigen por las leyes de la provincia de Quebec (Canadá).",
          "Cualquier disputa podrá someterse a los tribunales competentes de dicha jurisdicción, salvo disposición legal imperativa en sentido contrario."
        ]
      },
      {
        title: "13. Cambios en las Condiciones",
        paragraphs: [
          "Podemos actualizar estas Condiciones para reflejar cambios técnicos, legales o funcionales.",
          "Si el cambio es importante, podremos avisarte a través de la app o por correo electrónico. Si sigues utilizando el Servicio tras la entrada en vigor de los cambios, se considerará que aceptas las Condiciones actualizadas."
        ]
      },
      {
        title: "14. Contacto",
        paragraphs: [
          "Para cualquier pregunta sobre estas Condiciones:",
          "Correo electrónico: contactamoriai@gmail.com"
        ]
      }
    ]
  }
};

// Helper: locale from ?lang
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
            href={`/terms?lang=${locale}`}
            className="amoria-nav-link amoria-nav-link--active"
          >
            {locale === "fr"
              ? "Conditions"
              : locale === "en"
              ? "Terms"
              : "Condiciones"}
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

      {/* STYLES (réutilise le bloc légal de la page privacy) */}
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
