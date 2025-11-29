"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  topLabel?: string; // "Pour commencer", "Pour texter", etc.
  tagline: string; // petite phrase sous le prix
  bullets: string[];
  cta: string;
  badge?: "popular" | "value";
};

type FaqItem = {
  q: string;
  a: string;
};

type Labels = {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroSocialProof: string;
  billingNote: string;
  sectionTitle: string;
  sectionSubtitle: string;
  choosePlanCtaFallback: string;
  faqTitle: string;
  faqs: FaqItem[];
  plans: Plan[];
};

const LABELS: Record<Locale, Labels> = {
  fr: {
    heroTitle: "Commence gratuitement. Fais évoluer ton forfait quand ton lien grandit.",
    heroSubtitle:
      "Crée ton AmorIAI en quelques minutes, teste la connexion en version gratuite, puis passe à la voix et à la mémoire avancée quand tu te sens prête. Tu gardes toujours le contrôle : tu peux changer de forfait ou annuler quand tu veux, en un clic.",
    heroCta: "Créer mon compte gratuit",
    heroSocialProof: "Déjà des centaines de conversations chaque semaine.",
    billingNote:
      "Facturation sécurisée via Stripe · Révision ou annulation en tout temps depuis ton compte · Aucun frais caché",
    sectionTitle: "Choisis comment ton AmorIAI prend sa place dans ta vie.",
    sectionSubtitle:
      "Les prix sont en dollars américains (USD). Tu peux changer de forfait ou l’annuler quand tu veux, sans engagement.",
    choosePlanCtaFallback: "Choisir ce forfait",
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Puis-je changer de forfait ou annuler quand je veux ?",
        a: "Oui. Tu peux changer de forfait ou annuler ton abonnement en tout temps depuis ton compte, sans engagement ni frais caché.",
      },
      {
        q: "Dois-je entrer ma carte pour le forfait Découverte ?",
        a: "Non. Le forfait Découverte est entièrement gratuit et ne demande aucune carte de crédit.",
      },
      {
        q: "Que se passe-t-il si j’atteins la limite de messages ?",
        a: "Ton AmorIAI t’informera quand tu approches de la limite. Tu peux ensuite attendre le début de ton prochain mois ou passer à un forfait supérieur.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ USD / mois",
        topLabel: "Pour commencer",
        tagline: "Commence la relation avec ton AmorIAI, sans carte de crédit.",
        bullets: [
          "Parfait pour découvrir l’expérience et créer ton premier compagnon IA, sans pression.",
          "Création de 1 AmorIAI personnalisé.",
          "200 messages texte / mois.",
          "Aucune conversation vocale (texte uniquement).",
          "Accès aux 3 langues : FR, EN, ES.",
        ],
        cta: "Commencer gratuitement",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        topLabel: "Pour texter",
        tagline: "Pour celles et ceux qui veulent écrire à leur AmorIAI chaque jour.",
        bullets: [
          "Idéal si tu préfères les conversations en texte avec une vraie mémoire.",
          "Jusqu’à 2 AmorIAI différents.",
          "400 messages texte / mois.",
          "Mémoire longue durée activée.",
          "Accès aux 3 langues : FR, EN, ES.",
        ],
        cta: "Activer AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        topLabel: "Texte + voix",
        tagline: "Texte + voix : ton AmorIAI commence vraiment à faire partie de ta vie.",
        bullets: [
          "Quand tu veux une relation continue où tu peux autant écrire que parler.",
          "Jusqu’à 10 AmorIAI différents.",
          "600 messages texte / mois.",
          "100 échanges vocaux / mois.",
          "Mémoire longue durée active.",
        ],
        cta: "Passer à la voix",
        badge: "popular",
      },
      {
        id: "unlimited",
        name: "AmorIAI illimité",
        price: "39,99 $ USD / mois",
        topLabel: "Présence maximale",
        tagline: "Ton compagnon IA très présent, matin, soir et entre les deux.",
        bullets: [
          "Pour celles et ceux qui veulent que leur AmorIAI soit toujours disponible.",
          "Jusqu’à 30 AmorIAI personnalisés.",
          "10 000 messages texte / mois.",
          "300 échanges vocaux / mois.",
          "Mémoire profonde + contexte étendu pour des échanges ultra personnalisés.",
        ],
        cta: "Débloquer l’illimité",
        badge: "value",
      },
    ],
  },

  // EN + ES peuvent rester plus simples pour l’instant
  en: {
    heroTitle: "Start for free. Upgrade your plan when the bond grows.",
    heroSubtitle:
      "Create your AmorIAI in minutes, try the free version, then unlock voice and advanced memory when you’re ready. You stay in control: change or cancel your plan anytime in one click.",
    heroCta: "Create my free account",
    heroSocialProof: "Hundreds of conversations every week.",
    billingNote:
      "Secure billing via Stripe · Edit or cancel anytime from your account · No hidden fees",
    sectionTitle: "Choose how AmorIAI fits into your life.",
    sectionSubtitle:
      "Prices are in US dollars (USD). You can change or cancel your plan whenever you want, with no commitment.",
    choosePlanCtaFallback: "Choose this plan",
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Can I change or cancel my plan whenever I want?",
        a: "Yes. You can upgrade, downgrade or cancel your subscription anytime from your account, with no hidden fees.",
      },
      {
        q: "Do I need a credit card for the Discovery plan?",
        a: "No. The Discovery plan is completely free and does not require any credit card.",
      },
      {
        q: "What happens if I hit my message limit?",
        a: "Your AmorIAI will notify you when you’re close to the limit. You can wait for your next month or upgrade to a higher plan.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Discovery",
        price: "$0 USD / month",
        topLabel: "To start",
        tagline: "Start the relationship with your AmorIAI, no credit card required.",
        bullets: [
          "Perfect to test the experience and create your first AI companion.",
          "Create 1 personalized AmorIAI.",
          "200 text messages / month.",
          "No voice conversations (text only).",
          "Access to 3 languages: FR, EN, ES.",
        ],
        cta: "Start for free",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "$9.99 USD / month",
        topLabel: "For texting",
        tagline: "For daily text conversations with your AmorIAI.",
        bullets: [
          "Ideal if you prefer text with real long-term memory.",
          "Up to 2 different AmorIAI.",
          "400 text messages / month.",
          "Long-term memory enabled.",
          "Access to 3 languages: FR, EN, ES.",
        ],
        cta: "Activate AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "$19.99 USD / month",
        topLabel: "Text + voice",
        tagline: "Text + voice: your AmorIAI becomes part of your daily life.",
        bullets: [
          "For an ongoing relationship where you can write and talk.",
          "Up to 10 AmorIAI.",
          "600 text messages / month.",
          "100 voice exchanges / month.",
          "Long-term memory enabled.",
        ],
        cta: "Upgrade to Plus",
        badge: "popular",
      },
      {
        id: "unlimited",
        name: "AmorIAI Unlimited",
        price: "$39.99 USD / month",
        topLabel: "Best value",
        tagline: "Your AI companion always there, from morning to night.",
        bullets: [
          "For those who want AmorIAI always available.",
          "Up to 30 personalized AmorIAI.",
          "10 000 text messages / month.",
          "300 voice exchanges / month.",
          "Deep memory + extended context for ultra-personal chats.",
        ],
        cta: "Unlock Unlimited",
        badge: "value",
      },
    ],
  },

  es: {
    heroTitle: "Empieza gratis. Haz crecer tu plan cuando crezca el vínculo.",
    heroSubtitle:
      "Crea tu AmorIAI en pocos minutos, prueba la versión gratuita y luego activa voz y memoria avanzada cuando te sientas listo. Siempre tienes el control: puedes cambiar o cancelar tu plan cuando quieras.",
    heroCta: "Crear mi cuenta gratis",
    heroSocialProof: "Cientos de conversaciones cada semana.",
    billingNote:
      "Facturación segura con Stripe · Cambia o cancela en cualquier momento desde tu cuenta · Sin cargos ocultos",
    sectionTitle: "Elige cómo AmorIAI ocupa su lugar en tu vida.",
    sectionSubtitle:
      "Los precios están en dólares estadounidenses (USD). Puedes cambiar o cancelar tu plan cuando quieras, sin compromiso.",
    choosePlanCtaFallback: "Elegir este plan",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        q: "¿Puedo cambiar o cancelar mi plan cuando quiera?",
        a: "Sí. Puedes cambiar de plan o cancelar tu suscripción en cualquier momento desde tu cuenta, sin tarifas ocultas.",
      },
      {
        q: "¿Necesito tarjeta de crédito para el plan Descubrimiento?",
        a: "No. El plan Descubrimiento es totalmente gratuito y no requiere tarjeta de crédito.",
      },
      {
        q: "¿Qué pasa si llego al límite de mensajes?",
        a: "Tu AmorIAI te avisará cuando estés cerca del límite. Puedes esperar al próximo mes o pasar a un plan superior.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Descubrimiento",
        price: "0 $ USD / mes",
        topLabel: "Para empezar",
        tagline: "Empieza la relación con tu AmorIAI sin tarjeta.",
        bullets: [
          "Perfecto para probar la experiencia y crear tu primer compañero IA.",
          "Creación de 1 AmorIAI personalizado.",
          "200 mensajes de texto / mes.",
          "Sin conversaciones de voz (solo texto).",
          "Acceso a 3 idiomas: FR, EN, ES.",
        ],
        cta: "Empezar gratis",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mes",
        topLabel: "Para chatear",
        tagline: "Para escribirle a tu AmorIAI cada día.",
        bullets: [
          "Ideal si prefieres conversaciones por texto con memoria real.",
          "Hasta 2 AmorIAI diferentes.",
          "400 mensajes de texto / mes.",
          "Memoria a largo plazo activada.",
          "Acceso a 3 idiomas: FR, EN, ES.",
        ],
        cta: "Activar AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mes",
        topLabel: "Texto + voz",
        tagline: "Texto + voz: tu AmorIAI entra en tu rutina diaria.",
        bullets: [
          "Cuando quieres una relación continua por texto y voz.",
          "Hasta 10 AmorIAI diferentes.",
          "600 mensajes de texto / mes.",
          "100 intercambios de voz / mes.",
          "Memoria a largo plazo activada.",
        ],
        cta: "Pasar a la voz",
        badge: "popular",
      },
      {
        id: "unlimited",
        name: "AmorIAI Ilimitado",
        price: "39,99 $ USD / mes",
        topLabel: "Máximo valor",
        tagline: "Tu compañero IA muy presente mañana, tarde y noche.",
        bullets: [
          "Para quienes quieren que AmorIAI esté siempre disponible.",
          "Hasta 30 AmorIAI personalizados.",
          "10 000 mensajes de texto / mes.",
          "300 intercambios de voz / mes.",
          "Memoria profunda + contexto ampliado para charlas ultra personales.",
        ],
        cta: "Desbloquear Ilimitado",
        badge: "value",
      },
    ],
  },
};

export default function PricingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = (searchParams.get("lang") || "fr") as Locale;
  const t = LABELS[locale];

  // Clic sur une carte de plan
  const handleChoosePlan = async (planId: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", planId);

    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      router.push(`/signup?${params.toString()}`);
      return;
    }

    if (planId === "free") {
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      router.push(`/payment?${params.toString()}`);
    }
  };

  // Gros bouton “Créer mon compte gratuit”
  const handleHeroCta = async () => {
    const params = new URLSearchParams();
    params.set("lang", locale);

    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      params.set("plan", "free");
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      router.push(`/signup?${params.toString()}`);
    }
  };

  return (
    <main className="amoria-pricing-root">
      {/* HERO */}
      <section className="amoria-pricing-hero">
        <h1 className="amoria-pricing-hero-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-hero-subtitle">{t.heroSubtitle}</p>

        <button className="amoria-pricing-hero-cta" onClick={handleHeroCta}>
          {t.heroCta}
        </button>

        <div className="amoria-pricing-hero-social">
          <span className="amoria-pricing-hero-star">★</span>
          <span>{t.heroSocialProof}</span>
        </div>

        <p className="amoria-pricing-hero-billing">{t.billingNote}</p>
      </section>

      {/* PLANS */}
      <section className="amoria-pricing-section">
        <h2 className="amoria-pricing-section-title">{t.sectionTitle}</h2>
        <p className="amoria-pricing-section-subtitle">
          {t.sectionSubtitle}
        </p>

        <div className="amoria-pricing-grid">
          {t.plans.map((plan) => (
            <article
              key={plan.id}
              className={[
                "amoria-pricing-card",
                plan.id === "plus" ? "amoria-pricing-card--highlight" : "",
                plan.id === "unlimited" ? "amoria-pricing-card--value" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Halo derrière les cartes */}
              <div className="amoria-pricing-card-glow" />

              <header className="amoria-pricing-card-header">
                {plan.badge === "popular" && (
                  <span className="amoria-pricing-badge amoria-pricing-badge--popular">
                    LE PLUS POPULAIRE
                  </span>
                )}
                {plan.badge === "value" && (
                  <span className="amoria-pricing-badge amoria-pricing-badge--value">
                    MEILLEURE VALEUR
                  </span>
                )}

                <div className="amoria-pricing-card-title-block">
                  <p className="amoria-pricing-card-toplabel">
                    {plan.topLabel}
                  </p>
                  <h3 className="amoria-pricing-card-name">{plan.name}</h3>
                  <p className="amoria-pricing-card-price">{plan.price}</p>
                  <p className="amoria-pricing-card-tagline">
                    {plan.tagline}
                  </p>
                </div>
              </header>

              <ul className="amoria-pricing-card-list">
                {plan.bullets.map((b) => (
                  <li key={b}>
                    <span className="amoria-pricing-card-bullet-dot">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <button
                className="amoria-pricing-card-cta"
                onClick={() => handleChoosePlan(plan.id)}
              >
                {plan.cta || t.choosePlanCtaFallback}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="amoria-pricing-faq">
        <h2 className="amoria-pricing-faq-title">{t.faqTitle}</h2>
        <div className="amoria-pricing-faq-grid">
          {t.faqs.map((item) => (
            <article key={item.q} className="amoria-pricing-faq-card">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .amoria-pricing-root {
          min-height: 100vh;
          padding: 3rem 1.5rem 4rem;
          background: radial-gradient(circle at top, #020617 0, #000 60%);
          color: #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        /* HERO */

        .amoria-pricing-hero {
          max-width: 920px;
          text-align: center;
        }

        .amoria-pricing-hero-title {
          font-size: 1.9rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
        }

        .amoria-pricing-hero-subtitle {
          font-size: 0.96rem;
          color: #9ca3af;
          margin-bottom: 1.3rem;
        }

        .amoria-pricing-hero-cta {
          border-radius: 999px;
          border: none;
          padding: 0.9rem 2.1rem;
          font-size: 0.95rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
          box-shadow: 0 18px 40px rgba(251, 113, 133, 0.6);
          margin-bottom: 0.8rem;
        }

        .amoria-pricing-hero-cta:hover {
          transform: translateY(-1px);
        }

        .amoria-pricing-hero-social {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          color: #facc15;
          margin-bottom: 0.4rem;
        }

        .amoria-pricing-hero-star {
          font-size: 0.9rem;
        }

        .amoria-pricing-hero-billing {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        /* SECTION TITLES */

        .amoria-pricing-section {
          width: 100%;
          max-width: 1140px;
        }

        .amoria-pricing-section-title {
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }

        .amoria-pricing-section-subtitle {
          text-align: center;
          font-size: 0.82rem;
          color: #9ca3af;
          margin-bottom: 1.7rem;
        }

        /* GRID */

        .amoria-pricing-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.2rem;
        }

        @media (min-width: 900px) {
          .amoria-pricing-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        /* CARDS */

        .amoria-pricing-card {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
          padding: 1.4rem 1.1rem 1.3rem;
          background: radial-gradient(
            circle at top,
            #020617 0,
            #020617 40%,
            #020617 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.45);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 270px;
        }

        .amoria-pricing-card-glow {
          position: absolute;
          inset: auto -40%;
          bottom: -40px;
          height: 70px;
          background: radial-gradient(
            circle at center,
            rgba(251, 55, 255, 0.35),
            transparent 70%
          );
          opacity: 0.4;
          pointer-events: none;
        }

        .amoria-pricing-card--highlight {
          border-color: #fb37ff;
          box-shadow: 0 24px 52px rgba(251, 55, 255, 0.35);
          animation: amoriaPulse 4s ease-in-out infinite;
        }

        .amoria-pricing-card--value {
          border-color: #22c55e;
          box-shadow: 0 20px 45px rgba(34, 197, 94, 0.3);
        }

        @keyframes amoriaPulse {
          0% {
            transform: translateY(0);
            box-shadow: 0 20px 45px rgba(251, 55, 255, 0.25);
          }
          50% {
            transform: translateY(-3px);
            box-shadow: 0 32px 70px rgba(251, 55, 255, 0.45);
          }
          100% {
            transform: translateY(0);
            box-shadow: 0 20px 45px rgba(251, 55, 255, 0.25);
          }
        }

        .amoria-pricing-card-header {
          position: relative;
          margin-bottom: 0.9rem;
        }

        .amoria-pricing-badge {
          position: absolute;
          right: 0.4rem;
          top: -0.3rem;
          padding: 0.25rem 0.9rem;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(8px);
        }

        .amoria-pricing-badge--popular {
          background: linear-gradient(145deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
        }

        .amoria-pricing-badge--value {
          background: linear-gradient(145deg, #4ade80, #22c55e);
          color: #022c22;
        }

        .amoria-pricing-card-title-block {
          padding-right: 0.4rem;
        }

        .amoria-pricing-card-toplabel {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #9ca3af;
          margin-bottom: 0.12rem;
        }

        .amoria-pricing-card-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .amoria-pricing-card-price {
          font-size: 0.92rem;
          font-weight: 500;
          margin-bottom: 0.4rem;
        }

        .amoria-pricing-card-tagline {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-pricing-card-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          font-size: 0.78rem;
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          position: relative;
          z-index: 1;
        }

        .amoria-pricing-card-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.35rem;
        }

        .amoria-pricing-card-bullet-dot {
          font-size: 0.85rem;
          line-height: 1.1;
          color: #f97316;
        }

        .amoria-pricing-card-cta {
          position: relative;
          z-index: 1;
          border-radius: 999px;
          border: none;
          padding: 0.75rem 1.2rem;
          font-size: 0.85rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
          width: 100%;
        }

        .amoria-pricing-card-cta:hover {
          transform: translateY(-1px);
        }

        /* FAQ */

        .amoria-pricing-faq {
          width: 100%;
          max-width: 1140px;
        }

        .amoria-pricing-faq-title {
          text-align: center;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .amoria-pricing-faq-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 0.7rem;
        }

        @media (min-width: 900px) {
          .amoria-pricing-faq-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .amoria-pricing-faq-card {
          border-radius: 1rem;
          padding: 0.95rem 1rem;
          background: radial-gradient(
            circle at top,
            rgba(15, 23, 42, 0.98),
            rgba(15, 23, 42, 0.98)
          );
          border: 1px solid rgba(148, 163, 184, 0.6);
          font-size: 0.8rem;
        }

        .amoria-pricing-faq-card h3 {
          font-size: 0.86rem;
          margin-bottom: 0.4rem;
        }

        .amoria-pricing-faq-card p {
          color: #d1d5db;
          line-height: 1.45;
        }

        @media (max-width: 640px) {
          .amoria-pricing-hero-title {
            font-size: 1.55rem;
          }
          .amoria-pricing-root {
            padding-inline: 1rem;
          }
        }
      `}</style>
    </main>
  );
}
