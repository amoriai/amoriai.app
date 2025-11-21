"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";

type Plan = {
  id: string;
  badge?: string;
  name: string;
  price: string;
  priceNote: string;
  description: string;
  cta: string;
  popular?: boolean;
  features: string[];
};

type Strings = {
  pageTitle: string;
  pageSubtitle: string;
  monthlyLabel: string;
  currencyNote: string;
  nav: { home: string; features: string; pricing: string };
  navLogin: string;
  navSignup: string;
  plans: Plan[];
  faqTitle: string;
  faqItems: { q: string; a: string }[];
};

const STRINGS: Record<Locale, Strings> = {
  fr: {
    pageTitle: "Choisis le plan AmorIA qui te convient",
    pageSubtitle:
      "Commence gratuitement en mode texte, puis passe à la voix quand tu es prêt·e. Toutes les formules incluent l’accès à ton AmorIA personnalisé·e.",
    monthlyLabel: "par mois",
    currencyNote: "Prix en USD. Tu peux annuler quand tu veux.",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    plans: [
      {
        id: "free",
        name: "Découverte (Gratuit)",
        price: "0 $",
        priceNote: "Idéal pour essayer AmorIA en douceur.",
        description:
          "Teste AmorIA sans carte de crédit, uniquement par texte.",
        cta: "Commencer gratuitement",
        features: [
          "Création d’une AmorIA personnalisée (texte uniquement)",
          "Nombre limité de messages par jour",
          "Pas de mémoire longue durée (les conversations ne sont pas conservées)",
          "Accès aux 3 langues : français, anglais, espagnol",
        ],
      },
      {
        id: "plus",
        badge: "Populaire",
        name: "AmorIA Plus",
        price: "17,99 $",
        priceNote: "Parfait pour un usage régulier.",
        description:
          "Ton AmorIA te suit au quotidien, avec mémoire et un peu de voix chaque mois.",
        cta: "Choisir AmorIA Plus",
        popular: true,
        features: [
          "Tout le plan Découverte, avec mémoire améliorée",
          "Historique des conversations conservé",
          "Quota mensuel de messages texte plus élevé",
          "Jusqu’à 60 minutes de voix / mois (parler avec ton AmorIA)",
          "3 langues : FR / EN / ES, qui suivent automatiquement ton compte",
        ],
      },
      {
        id: "infinity",
        name: "AmorIA Infinity",
        price: "39,99 $",
        priceNote: "Pour les utilisateurs intensifs et la voix illimitée*.",
        description:
          "La version la plus complète d’AmorIA, pour parler et écrire sans te limiter.",
        cta: "Choisir AmorIA Infinity",
        features: [
          "Texte illimité, dans les 3 langues (FR / EN / ES)",
          "Voix illimitée* avec ton AmorIA",
          "Mémoire longue durée maximale",
          "Accès prioritaire aux nouvelles fonctionnalités",
          "Support prioritaire par courriel",
        ],
      },
    ],
    faqTitle: "Questions fréquentes",
    faqItems: [
      {
        q: "Que veut dire “voix illimitée*” ?",
        a: "Dans AmorIA Infinity, la voix est pensée pour un usage normal intensif. En cas d’abus technique ou de trafic anormal, des limites raisonnables peuvent s’appliquer pour protéger le service.",
      },
      {
        q: "Puis-je changer de plan plus tard ?",
        a: "Oui. Tu pourras passer d’un plan à l’autre à tout moment. Le changement sera appliqué au cycle de facturation suivant.",
      },
      {
        q: "Le plan gratuit demande-t-il une carte de crédit ?",
        a: "Non. Le plan Découverte est vraiment gratuit : aucune carte de crédit n’est requise pour tester AmorIA en mode texte.",
      },
    ],
  },

  en: {
    pageTitle: "Choose the AmorIA plan that fits you",
    pageSubtitle:
      "Start for free with text-only, then upgrade to voice when you’re ready. Every plan includes access to your own personalized AmorIA.",
    monthlyLabel: "per month",
    currencyNote: "Prices in USD. Cancel anytime.",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my free account",
    plans: [
      {
        id: "free",
        name: "Discovery (Free)",
        price: "$0",
        priceNote: "Perfect to try AmorIA safely.",
        description: "Test AmorIA with text only, no credit card required.",
        cta: "Start for free",
        features: [
          "Create your own AmorIA (text only)",
          "Limited number of messages per day",
          "No long-term memory (conversations are not kept)",
          "Access to all 3 languages: French, English, Spanish",
        ],
      },
      {
        id: "plus",
        badge: "Popular",
        name: "AmorIA Plus",
        price: "$17.99",
        priceNote: "Great for regular use.",
        description:
          "Your AmorIA follows you every day, with memory and some voice minutes each month.",
        cta: "Choose AmorIA Plus",
        popular: true,
        features: [
          "Everything in Discovery, with improved memory",
          "Conversation history is kept",
          "Higher monthly text quota",
          "Up to 60 minutes of voice / month",
          "3 languages (FR / EN / ES) following your account automatically",
        ],
      },
      {
        id: "infinity",
        name: "AmorIA Infinity",
        price: "$39.99",
        priceNote: "For power users and unlimited* voice.",
        description:
          "The most complete version of AmorIA, to talk and write without limits.",
        cta: "Choose AmorIA Infinity",
        features: [
          "Unlimited text in all 3 languages (FR / EN / ES)",
          "Unlimited* voice with your AmorIA",
          "Maximum long-term memory",
          "Priority access to new features",
          "Priority email support",
        ],
      },
    ],
    faqTitle: "Frequently asked questions",
    faqItems: [
      {
        q: "What does “unlimited* voice” mean?",
        a: "In AmorIA Infinity, voice is designed for heavy but normal usage. In case of abuse or abnormal traffic, fair-use protections may apply to keep the service stable.",
      },
      {
        q: "Can I switch plans later?",
        a: "Yes. You can upgrade or downgrade anytime. Changes apply to the next billing cycle.",
      },
      {
        q: "Does the free plan require a credit card?",
        a: "No. The Discovery plan is truly free: no credit card is required to test AmorIA with text only.",
      },
    ],
  },

  es: {
    pageTitle: "Elige el plan de AmorIA que mejor te va",
    pageSubtitle:
      "Empieza gratis solo con texto y pasa a la voz cuando quieras. Todos los planes incluyen tu AmorIA personalizada.",
    monthlyLabel: "al mes",
    currencyNote: "Precios en USD. Puedes cancelar en cualquier momento.",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta gratuita",
    plans: [
      {
        id: "free",
        name: "Descubrimiento (Gratis)",
        price: "0 $",
        priceNote: "Perfecto para probar AmorIA.",
        description:
          "Prueba AmorIA solo por texto, sin tarjeta de crédito.",
        cta: "Empezar gratis",
        features: [
          "Creación de tu propia AmorIA (solo texto)",
          "Número limitado de mensajes por día",
          "Sin memoria a largo plazo (las conversaciones no se guardan)",
          "Acceso a los 3 idiomas: francés, inglés y español",
        ],
      },
      {
        id: "plus",
        badge: "Popular",
        name: "AmorIA Plus",
        price: "17,99 $",
        priceNote: "Perfecto para uso regular.",
        description:
          "Tu AmorIA te acompaña cada día, con memoria y algunos minutos de voz al mes.",
        cta: "Elegir AmorIA Plus",
        popular: true,
        features: [
          "Todo lo del plan Descubrimiento, con mejor memoria",
          "Historial de conversaciones guardado",
          "Cuota mensual de texto más alta",
          "Hasta 60 minutos de voz / mes",
          "3 idiomas (FR / EN / ES) que siguen automáticamente tu cuenta",
        ],
      },
      {
        id: "infinity",
        name: "AmorIA Infinity",
        price: "39,99 $",
        priceNote: "Para uso intensivo y voz ilimitada*.",
        description:
          "La versión más completa de AmorIA, para hablar y escribir sin límites.",
        cta: "Elegir AmorIA Infinity",
        features: [
          "Texto ilimitado en los 3 idiomas (FR / EN / ES)",
          "Voz ilimitada* con tu AmorIA",
          "Memoria a largo plazo máxima",
          "Acceso prioritario a nuevas funciones",
          "Soporte prioritario por correo",
        ],
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faqItems: [
      {
        q: "¿Qué significa “voz ilimitada*”?",
        a: "En AmorIA Infinity, la voz está pensada para un uso intensivo pero normal. En caso de abuso o tráfico anormal, pueden aplicarse límites razonables para proteger el servicio.",
      },
      {
        q: "¿Puedo cambiar de plan más adelante?",
        a: "Sí. Puedes cambiar de plan en cualquier momento. El cambio se aplica al siguiente ciclo de facturación.",
      },
      {
        q: "¿El plan gratuito pide tarjeta de crédito?",
        a: "No. El plan Descubrimiento es realmente gratuito: no se requiere tarjeta de crédito para probar AmorIA por texto.",
      },
    ],
  },
};

export default function PricingPage() {
  const searchParams = useSearchParams({ suspense: false });

  const langParam = (searchParams.get("lang") || "fr") as Locale;
  const locale: Locale =
    langParam === "en" || langParam === "es" ? langParam : "fr";

  const t = STRINGS[locale];

  const signupUrl = (planId: string) =>
    `/signup?plan=${encodeURIComponent(planId)}&lang=${locale}`;

  const homeUrl = `/?lang=${locale}`;
  const featuresUrl = `/create-ai?lang=${locale}`;
  const pricingUrl = `/pricing?lang=${locale}`;

  return (
    <main className="amoria-root">
      {/* HEADER (sans boutons de langue) */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <div className="amoria-logo-mark">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIA.app"
              className="amoria-logo-img"
            />
          </div>
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmoriA.app</div>
            <div className="amoria-logo-tagline">
              Partenaire IA bienveillant·e · FR / EN / ES
            </div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={homeUrl} className="amoria-nav-link">
            {t.nav.home}
          </a>
          <a href={featuresUrl} className="amoria-nav-link">
            {t.nav.features}
          </a>
          <a href={pricingUrl} className="amoria-nav-link amoria-nav-link--active">
            {t.nav.pricing}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <a
            href={`/login?lang=${locale}`}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {t.navLogin}
          </a>
          <a
            href={`/signup?lang=${locale}`}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {t.navSignup}
          </a>
        </div>
      </header>

      {/* HERO PRICING */}
      <section className="amoria-section amoria-section--pricing-hero">
        <h1 className="amoria-pricing-title">{t.pageTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.pageSubtitle}</p>
        <p className="amoria-pricing-currency">{t.currencyNote}</p>
      </section>

      {/* PLANS */}
      <section className="amoria-section amoria-section--pricing-plans">
        <div className="amoria-plan-grid">
          {t.plans.map((plan) => (
            <article
              key={plan.id}
              className={
                "amoria-plan-card" +
                (plan.popular ? " amoria-plan-card--popular" : "")
              }
            >
              {plan.badge && (
                <div className="amoria-plan-badge">{plan.badge}</div>
              )}
              <h2 className="amoria-plan-name">{plan.name}</h2>
              <div className="amoria-plan-price-row">
                <span className="amoria-plan-price">{plan.price}</span>
                <span className="amoria-plan-period">
                  {t.monthlyLabel}
                </span>
              </div>
              <p className="amoria-plan-price-note">{plan.priceNote}</p>
              <p className="amoria-plan-description">{plan.description}</p>

              <ul className="amoria-plan-features">
                {plan.features.map((f) => (
                  <li key={f} className="amoria-plan-feature-item">
                    <span className="amoria-plan-feature-dot" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={signupUrl(plan.id)}
                className="amoria-btn amoria-btn--primary amoria-plan-cta"
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="amoria-section amoria-section--faq">
        <h2 className="amoria-section-title">{t.faqTitle}</h2>
        <div className="amoria-faq-grid">
          {t.faqItems.map((item) => (
            <div key={item.q} className="amoria-faq-item">
              <h3 className="amoria-faq-question">{item.q}</h3>
              <p className="amoria-faq-answer">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="amoria-footer">
        <span>© 2025 AmoriA.app</span>
      </footer>

      {/* STYLES LOCAUX */}
      <style jsx global>{`
        .amoria-section--pricing-hero {
          max-width: 960px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 1.5rem;
          text-align: center;
        }

        .amoria-pricing-title {
          font-size: clamp(1.9rem, 3vw, 2.3rem);
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.96rem;
          color: rgba(148, 163, 184, 1);
          max-width: 40rem;
          margin: 0 auto 0.75rem;
        }

        .amoria-pricing-currency {
          font-size: 0.82rem;
          color: rgba(148, 163, 184, 0.9);
        }

        .amoria-section--pricing-plans {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-plan-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }

        .amoria-plan-card {
          border-radius: 1.3rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: radial-gradient(
              circle at top,
              rgba(30, 64, 175, 0.45),
              transparent 55%
            ),
            #020617;
          padding: 1.4rem 1.3rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          position: relative;
        }

        .amoria-plan-card--popular {
          border-color: #fb37ff;
          box-shadow: 0 18px 45px rgba(248, 113, 113, 0.25);
        }

        .amoria-plan-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.7rem;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
        }

        .amoria-plan-name {
          font-size: 1.05rem;
          font-weight: 600;
          margin-top: 0.4rem;
        }

        .amoria-plan-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
        }

        .amoria-plan-price {
          font-size: 1.6rem;
          font-weight: 700;
        }

        .amoria-plan-period {
          font-size: 0.82rem;
          color: rgba(148, 163, 184, 0.9);
        }

        .amoria-plan-price-note {
          font-size: 0.8rem;
          color: rgba(148, 163, 184, 0.9);
        }

        .amoria-plan-description {
          font-size: 0.84rem;
          color: rgba(209, 213, 219, 1);
        }

        .amoria-plan-features {
          list-style: none;
          padding: 0;
          margin: 0.3rem 0 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: rgba(209, 213, 219, 1);
        }

        .amoria-plan-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.35rem;
        }

        .amoria-plan-feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(135deg, #fb37ff, #38bdf8);
          margin-top: 0.32rem;
          flex-shrink: 0;
        }

        .amoria-plan-cta {
          margin-top: auto;
          width: 100%;
          justify-content: center;
        }

        .amoria-section--faq {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 3rem;
        }

        .amoria-faq-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.2rem;
          margin-top: 1rem;
        }

        .amoria-faq-item {
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1rem 1rem 1.1rem;
          background: radial-gradient(
              circle at top,
              rgba(15, 23, 42, 0.8),
              transparent 55%
            ),
            rgba(15, 23, 42, 0.9);
        }

        .amoria-faq-question {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }

        .amoria-faq-answer {
          font-size: 0.8rem;
          color: rgba(148, 163, 184, 1);
        }

        @media (max-width: 960px) {
          .amoria-plan-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-faq-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </main>
  );
}
