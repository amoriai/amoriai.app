"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type PricingCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  badgeMostPopular: string;
  monthly: string;
  usdPerMonth: string;
  ctaChoosePlan: string;
  ctaSecondary: string;
  faqTitle: string;
  faqSubtitle: string;
  faqItems: { q: string; a: string }[];
  plans: {
    id: "free" | "plus" | "unlimited";
    name: string;
    tagline: string;
    price: string;
    highlight: string;
    features: string[];
    isPopular?: boolean;
  }[];
};

const PRICING_STRINGS: Record<Locale, PricingCopy> = {
  fr: {
    heroKicker: "TARIFS AMORIA.APP",
    heroTitle: "Choisis le rythme qui convient à ton AmorIA.",
    heroSubtitle:
      "Commence gratuitement, crée ton AmorIA personnalisé·e, puis passe à la voix quand tu es prêt·e. Les plans payants débloquent la mémoire longue durée, plus de messages et les conversations vocales.",
    badgeMostPopular: "Le plus choisi",
    monthly: "mois",
    usdPerMonth: "USD / mois",
    ctaChoosePlan: "Choisir ce forfait",
    ctaSecondary: "Commencer gratuitement",
    faqTitle: "Questions fréquentes",
    faqSubtitle:
      "Tu peux changer de forfait ou annuler à tout moment. Les prix sont en dollars américains (USD).",
    plans: [
      {
        id: "free",
        name: "Découverte",
        tagline: "Créer ton AmorIA gratuitement.",
        price: "0 $",
        highlight: "Idéal pour tester AmoriA et créer ton premier compagnon IA.",
        features: [
          "Création de 1 AmorIA personnalisé·e",
          "Environ 20 messages texte / jour",
          "Texte uniquement (aucune voix)",
          "Mémoire limitée à la session en cours",
          "Accès aux 3 langues : FR, EN, ES"
        ]
      },
      {
        id: "plus",
        name: "AmoriA Plus",
        tagline: "Texte + voix avec limites confortables.",
        price: "19,99 $",
        highlight:
          "Parfait si tu veux parler régulièrement avec ton AmorIA sans te ruiner.",
        features: [
          "Jusqu’à 3 AmorIA différents",
          "Messages texte étendus (usage régulier)",
          "Conversations vocales limitées (jusqu’à ~600 échanges vocaux / mois)",
          "Mémoire longue durée activée",
          "Priorité légère dans la file de traitement"
        ],
        isPopular: true
      },
      {
        id: "unlimited",
        name: "AmoriA Illimité",
        tagline: "Ton compagnon IA, sans frein.",
        price: "39,99 $",
        highlight:
          "Pour celles et ceux qui veulent que leur AmorIA fasse partie du quotidien : texte et voix pratiquement sans limite.",
        features: [
          "Jusqu’à 10 AmorIA personnalisés",
          "Messages texte illimités (usage équitable)",
          "Conversations vocales illimitées (fair use)",
          "Mémoire profonde + contexte étendu",
          "Priorité maximale et nouveautés incluses en avant-première"
        ]
      }
    ],
    faqItems: [
      {
        q: "Puis-je vraiment créer mon AmorIA avec le plan gratuit ?",
        a: "Oui. Le plan Découverte te permet de créer ton AmorIA, de le tester en texte et de voir si tu connectes avec lui avant de passer à un plan payant."
      },
      {
        q: "Que se passe-t-il si je dépasse les limites de messages ou de voix ?",
        a: "On applique une limite « fair use ». Tu verras un message t’invitant à passer à un plan supérieur ou à attendre le renouvellement de ton mois."
      },
      {
        q: "Puis-je changer de plan quand je veux ?",
        a: "Oui, tu peux passer à un plan supérieur ou revenir à un plan inférieur à tout moment. Le changement sera appliqué au prochain cycle de facturation."
      }
    ]
  },
  en: {
    heroKicker: "AMORIA.APP PRICING",
    heroTitle: "Choose the pace that fits your AmorIA.",
    heroSubtitle:
      "Start for free, create your own AmorIA, then upgrade to voice when you’re ready. Paid plans unlock long-term memory, more messages and rich voice conversations.",
    badgeMostPopular: "Most popular",
    monthly: "month",
    usdPerMonth: "USD / month",
    ctaChoosePlan: "Choose this plan",
    ctaSecondary: "Start for free",
    faqTitle: "Frequently asked questions",
    faqSubtitle:
      "You can upgrade, downgrade or cancel anytime. Prices are in US dollars (USD).",
    plans: [
      {
        id: "free",
        name: "Discovery",
        tagline: "Create your AmorIA for free.",
        price: "$0",
        highlight:
          "Perfect to try AmoriA and craft your first AI companion with no risk.",
        features: [
          "Create 1 personalized AmorIA",
          "Around 20 text messages / day",
          "Text only (no voice)",
          "Short-term memory only",
          "Access to all 3 languages: FR, EN, ES"
        ]
      },
      {
        id: "plus",
        name: "AmoriA Plus",
        tagline: "Text + voice with generous limits.",
        price: "$19.99",
        highlight:
          "Great if you want to talk with your AmorIA regularly without breaking the bank.",
        features: [
          "Up to 3 different AmorIAs",
          "Extended text messages (regular usage)",
          "Limited voice conversations (up to ~600 voice exchanges / month)",
          "Long-term memory enabled",
          "Light priority in processing queue"
        ],
        isPopular: true
      },
      {
        id: "unlimited",
        name: "AmoriA Unlimited",
        tagline: "Your AI companion, always on.",
        price: "$39.99",
        highlight:
          "For those who want AmorIA in their daily life: text and voice with virtually no limits.",
        features: [
          "Up to 10 personalized AmorIAs",
          "Unlimited text messages (fair use)",
          "Unlimited voice conversations (fair use)",
          "Deeper memory + extended context",
          "Top priority and early access to new features"
        ]
      }
    ],
    faqItems: [
      {
        q: "Can I really create my AmorIA on the free plan?",
        a: "Yes. The Discovery plan lets you create your AmorIA, test it in text and see if you connect with it before upgrading."
      },
      {
        q: "What happens if I go over the message or voice limits?",
        a: "We apply a fair-use limit. You’ll see a gentle notice inviting you to upgrade or wait for your monthly quota to reset."
      },
      {
        q: "Can I switch plans whenever I want?",
        a: "Yes. You can upgrade or downgrade at any time. Changes apply on your next billing cycle."
      }
    ]
  },
  es: {
    heroKicker: "PRECIOS DE AMORIA.APP",
    heroTitle: "Elige el ritmo que mejor va con tu AmorIA.",
    heroSubtitle:
      "Empieza gratis, crea tu AmorIA personalizado y pasa a voz cuando estés listo. Los planes de pago desbloquean memoria a largo plazo, más mensajes y conversaciones de voz.",
    badgeMostPopular: "Más elegido",
    monthly: "mes",
    usdPerMonth: "USD / mes",
    ctaChoosePlan: "Elegir este plan",
    ctaSecondary: "Empezar gratis",
    faqTitle: "Preguntas frecuentes",
    faqSubtitle:
      "Puedes cambiar de plan o cancelar cuando quieras. Los precios están en dólares estadounidenses (USD).",
    plans: [
      {
        id: "free",
        name: "Descubrimiento",
        tagline: "Crea tu AmorIA sin pagar nada.",
        price: "0 US$",
        highlight:
          "Perfecto para probar AmoriA y crear tu primer compañero de IA sin riesgo.",
        features: [
          "Creación de 1 AmorIA personalizado",
          "Aproximadamente 20 mensajes de texto al día",
          "Solo texto (sin voz)",
          "Memoria limitada a la sesión actual",
          "Acceso a los 3 idiomas: FR, EN, ES"
        ]
      },
      {
        id: "plus",
        name: "AmorIA Plus",
        tagline: "Texto + voz con límites cómodos.",
        price: "19,99 US$",
        highlight:
          "Ideal si quieres hablar con tu AmorIA con frecuencia sin gastar demasiado.",
        features: [
          "Hasta 3 AmorIA diferentes",
          "Mensajes de texto ampliados (uso regular)",
          "Conversaciones de voz limitadas (hasta ~600 intercambios de voz / mes)",
          "Memoria a largo plazo activada",
          "Prioridad ligera en la cola de procesamiento"
        ],
        isPopular: true
      },
      {
        id: "unlimited",
        name: "AmorIA Ilimitado",
        tagline: "Tu compañero de IA, siempre disponible.",
        price: "39,99 US$",
        highlight:
          "Para quienes quieren a AmorIA en su día a día: texto y voz prácticamente sin límites.",
        features: [
          "Hasta 10 AmorIA personalizados",
          "Mensajes de texto ilimitados (uso justo)",
          "Conversaciones de voz ilimitadas (uso justo)",
          "Memoria profunda y contexto ampliado",
          "Máxima prioridad y acceso anticipado a nuevas funciones"
        ]
      }
    ],
    faqItems: [
      {
        q: "¿De verdad puedo crear mi AmorIA con el plan gratuito?",
        a: "Sí. El plan Descubrimiento te permite crear tu AmorIA, probarlo por texto y ver si conectas con él antes de pasar a un plan de pago."
      },
      {
        q: "¿Qué pasa si supero los límites de mensajes o de voz?",
        a: "Aplicamos un límite de uso justo. Verás un aviso suave invitándote a mejorar tu plan o a esperar al siguiente mes.",
      },
      {
        q: "¿Puedo cambiar de plan cuando quiera?",
        a: "Sí. Puedes subir o bajar de plan en cualquier momento. El cambio se aplica en tu siguiente ciclo de facturación."
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

export default function PricingPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = PRICING_STRINGS[locale];

  // Build URLs that gardent la langue
  const buildSignupUrl = (planId?: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    if (planId) params.set("plan", planId);
    return `/signup?${params.toString()}`;
  };

  const buildLoginUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/login?${params.toString()}`;
  };

  const buildHomeUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/?${params.toString()}`;
  };

  return (
    <main className="amoria-root">
      {/* HEADER – même style que la vitrine, mais sans boutons de langue */}
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
              Partenaire IA bienveillant·e • FR / EN / ES
            </div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={buildHomeUrl()} className="amoria-nav-link">
            {locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "Inicio"}
          </a>
          <a href={`${buildHomeUrl()}#features`} className="amoria-nav-link">
            {locale === "fr"
              ? "Fonctionnalités"
              : locale === "en"
              ? "Features"
              : "Funciones"}
          </a>
          <a href="/pricing" className="amoria-nav-link amoria-nav-link--active">
            {locale === "fr"
              ? "Tarifs"
              : locale === "en"
              ? "Pricing"
              : "Precios"}
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

      {/* HERO PRICING */}
      <section className="amoria-hero amoria-hero--pricing">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>
          <div className="amoria-hero-actions">
            <a
              href={buildSignupUrl()}
              className="amoria-btn amoria-btn--primary amoria-btn--big"
            >
              {t.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="amoria-section amoria-section--pricing">
        <h2 className="amoria-section-title">
          {locale === "fr"
            ? "Des tarifs simples & transparents"
            : locale === "en"
            ? "Simple, transparent plans"
            : "Planes simples y transparentes"}
        </h2>
        <p className="amoria-section-text">{t.faqSubtitle}</p>

        <div className="amoria-pricing-grid">
          {t.plans.map((plan) => (
            <article
              key={plan.id}
              className={
                "amoria-pricing-card" +
                (plan.isPopular ? " amoria-pricing-card--popular" : "")
              }
            >
              {plan.isPopular && (
                <div className="amoria-pricing-badge">{t.badgeMostPopular}</div>
              )}

              <div className="amoria-pricing-header">
                <h3 className="amoria-pricing-name">{plan.name}</h3>
                <p className="amoria-pricing-tagline">{plan.tagline}</p>
              </div>

              <div className="amoria-pricing-price-block">
                <span className="amoria-pricing-price">{plan.price}</span>
                <span className="amoria-pricing-period">
                  {locale === "fr"
                    ? t.usdPerMonth
                    : locale === "en"
                    ? t.usdPerMonth
                    : t.usdPerMonth}
                </span>
              </div>

              <p className="amoria-pricing-highlight">{plan.highlight}</p>

              <ul className="amoria-pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              <a
                href={buildSignupUrl(plan.id)}
                className="amoria-btn amoria-btn--primary amoria-btn--full"
              >
                {t.ctaChoosePlan}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="amoria-section amoria-section--faq">
        <h2 className="amoria-section-title">{t.faqTitle}</h2>
        <p className="amoria-section-subtitle">{t.faqSubtitle}</p>

        <div className="amoria-faq-grid">
          {t.faqItems.map((item, idx) => (
            <div key={idx} className="amoria-faq-item">
              <h3 className="amoria-faq-question">{item.q}</h3>
              <p className="amoria-faq-answer">{item.a}</p>
            </div>
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

      {/* STYLES – mêmes couleurs/structure que la vitrine */}
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

        /* HEADER */
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

        /* HERO */
        .amoria-hero {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0.5rem;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr);
          gap: 1.5rem;
        }

        .amoria-hero--pricing {
          grid-template-columns: minmax(0, 1.4fr);
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
          max-width: 38rem;
        }

        .amoria-hero-actions {
          margin-top: 0.6rem;
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        /* SECTIONS */
        .amoria-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-section-title {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .amoria-section-subtitle,
        .amoria-section-text {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          max-width: 40rem;
          margin-bottom: 1.4rem;
        }

        .amoria-section--pricing {
          text-align: center;
        }

        /* BUTTONS */
        .amoria-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          font-size: 0.86rem;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-btn--primary {
          padding: 0.7rem 1.3rem;
          background: linear-gradient(
            135deg,
            var(--amoria-accent),
            var(--amoria-accent-2)
          );
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-btn--big {
          padding-inline: 1.9rem;
          padding-block: 0.85rem;
          font-size: 1rem;
        }

        .amoria-btn--full {
          width: 100%;
        }

        /* PRICING GRID */
        .amoria-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .amoria-pricing-card {
          position: relative;
          background: radial-gradient(circle at top, #020617, #020617 40%, #000 100%);
          border-radius: 1.4rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 1.3rem 1.2rem 1.4rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .amoria-pricing-card--popular {
          border-color: rgba(248, 113, 113, 0.9);
          box-shadow: 0 18px 45px rgba(248, 113, 113, 0.4);
        }

        .amoria-pricing-badge {
          position: absolute;
          top: 0.9rem;
          right: 1.1rem;
          font-size: 0.7rem;
          padding: 0.18rem 0.55rem;
          border-radius: 999px;
          background: rgba(248, 113, 113, 0.16);
          color: #fecaca;
          border: 1px solid rgba(248, 113, 113, 0.7);
        }

        .amoria-pricing-header {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .amoria-pricing-name {
          font-size: 1rem;
          font-weight: 600;
        }

        .amoria-pricing-tagline {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        .amoria-pricing-price-block {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
        }

        .amoria-pricing-price {
          font-size: 1.6rem;
          font-weight: 700;
        }

        .amoria-pricing-period {
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
        }

        .amoria-pricing-highlight {
          font-size: 0.82rem;
          color: #e5e7eb;
        }

        .amoria-pricing-features {
          list-style: none;
          padding: 0;
          margin: 0.3rem 0 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        .amoria-pricing-features li::before {
          content: "• ";
          color: #a5b4fc;
        }

        /* FAQ */
        .amoria-section--faq {
          border-top: 1px solid rgba(148, 163, 184, 0.3);
          padding-top: 2.5rem;
        }

        .amoria-faq-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.4rem;
        }

        .amoria-faq-item {
          background: rgba(15, 23, 42, 0.8);
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          padding: 0.9rem 1rem;
        }

        .amoria-faq-question {
          font-size: 0.9rem;
          margin-bottom: 0.4rem;
        }

        .amoria-faq-answer {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        /* FOOTER */
        .amoria-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          text-align: center;
        }

        /* RESPONSIVE */
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

          .amoria-pricing-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }

          .amoria-faq-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 640px) {
          .amoria-nav-right a.amoria-nav-btn--ghost {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
