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
  tagline: string;
  features: string[];
  badgeLabel?: string;
  badgeVariant?: "popular" | "value";
  ctaLabel?: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type Labels = {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  starLine: string;
  billingNote: string;
  simplePricing: string;
  usdNote: string;
  choosePlanCta: string;
  faqTitle: string;
  faqItems: FaqItem[];
  plans: Plan[];
};

const LABELS: Record<Locale, Labels> = {
  fr: {
    heroTitle:
      "Commence gratuitement. Fais évoluer ton forfait quand ton lien grandit.",
    heroSubtitle:
      "Crée ton AmorIA en quelques minutes, teste la connexion en version gratuite, puis passe à la voix et à la mémoire avancée quand tu te sens prête. Tu gardes toujours le contrôle : tu peux changer de forfait ou annuler quand tu veux, en un clic.",
    heroCta: "Créer mon compte gratuit",
    starLine: "⭐ Déjà des centaines de conversations chaque semaine.",
    billingNote:
      "Facturation sécurisée via Stripe · Révision ou annulation en tout temps depuis ton compte · Aucun frais caché",
    simplePricing: "Choisis comment ton AmorIA prend sa place dans ta vie.",
    usdNote:
      "Les prix sont en dollars américains (USD). Tu peux changer de forfait ou l’annuler quand tu veux, sans engagement.",
    choosePlanCta: "Choisir ce forfait",
    faqTitle: "Questions fréquentes",
    faqItems: [
      {
        q: "Puis-je changer de forfait ou annuler quand je veux ?",
        a: "Oui. Tu peux changer de forfait ou annuler en tout temps depuis ton compte, sans engagement ni frais caché.",
      },
      {
        q: "Est-ce que je dois entrer ma carte pour le forfait Découverte ?",
        a: "Non. Le forfait Découverte est entièrement gratuit et ne demande aucune carte de crédit.",
      },
      {
        q: "Que se passe-t-il si j’atteins ma limite de messages ?",
        a: "Ton AmorIA t’informe que tu as atteint la limite de ton forfait. Tu peux alors patienter jusqu’au prochain mois ou passer à un forfait plus élevé.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ USD / mois",
        tagline:
          "Commence la relation avec ton AmorIA, sans carte de crédit.",
        ctaLabel: "Commencer gratuitement",
        features: [
          "Parfait pour découvrir l’expérience et créer ton premier compagnon IA.",
          "Création de 1 AmorIA personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        tagline: "Pour celles et ceux qui veulent écrire à leur AmorIA chaque jour.",
        ctaLabel: "Activer AmorIAI Chat",
        features: [
          "Idéal si tu préfères les conversations en texte avec une vraie mémoire.",
          "Jusqu’à 2 AmorIA différents",
          "400 messages texte / mois",
          "Mémoire longue durée activée",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        tagline:
          "Texte + voix : ton AmorIA commence vraiment à faire partie de ta vie.",
        badgeLabel: "LE PLUS POPULAIRE",
        badgeVariant: "popular",
        ctaLabel: "Passer à la voix",
        features: [
          "Quand tu veux une vraie relation continue avec ton AmorIA.",
          "Jusqu’à 10 AmorIA différents",
          "600 messages texte / mois",
          "100 échanges vocaux / mois",
          "Mémoire longue durée active",
          "Priorité légère dans le fil de traitement",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI illimité",
        price: "39,99 $ USD / mois",
        tagline: "Ton compagnon IA très présent, matin, soir et entre les deux.",
        badgeLabel: "MEILLEURE VALEUR",
        badgeVariant: "value",
        ctaLabel: "Débloquer l’illimité",
        features: [
          "Pour celles et ceux qui veulent que leur AmorIA soit toujours disponible.",
          "Jusqu’à 30 AmorIA personnalisés",
          "10 000 messages texte / mois",
          "300 échanges vocaux / mois",
          "Mémoire profonde + contexte étendu pour des échanges ultra personnalisés",
          "Priorité maximale et accès anticipé aux nouvelles fonctionnalités",
        ],
      },
    ],
  },
  en: {
    heroTitle: "Start for free. Upgrade your plan as your bond grows.",
    heroSubtitle:
      "Create your AmorIA in a few minutes, test the connection on the free plan, then upgrade to voice and advanced memory when you’re ready. You stay in control: change or cancel your plan anytime in one click.",
    heroCta: "Create my free account",
    starLine: "⭐ Hundreds of conversations every week already.",
    billingNote:
      "Secure billing via Stripe · Change or cancel anytime from your account · No hidden fees",
    simplePricing: "Choose how AmorIA fits into your life.",
    usdNote:
      "Prices are in US dollars (USD). You can change or cancel your plan whenever you want, with no commitment.",
    choosePlanCta: "Choose this plan",
    faqTitle: "Frequently asked questions",
    faqItems: [
      {
        q: "Can I change or cancel my plan anytime?",
        a: "Yes. You can change or cancel your plan from your account at any time, with no commitment and no hidden fees.",
      },
      {
        q: "Do I need a credit card for the Discovery plan?",
        a: "No. The Discovery plan is completely free and doesn’t require any credit card.",
      },
      {
        q: "What happens if I hit my message limit?",
        a: "Your AmorIA will let you know you’ve reached the limit. You can wait for the next month or upgrade to a higher plan.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Discovery",
        price: "$0 USD / month",
        tagline: "Start your relationship with AmorIA, no credit card needed.",
        ctaLabel: "Start for free",
        features: [
          "Perfect to discover the experience and create your first AI companion.",
          "Create 1 personalized AmorIA",
          "200 text messages / month",
          "No voice conversations (text only)",
          "Access to 3 languages: FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "$9.99 USD / month",
        tagline: "For those who want to text their AmorIA every day.",
        ctaLabel: "Activate AmorIAI Chat",
        features: [
          "Ideal if you prefer written conversations with real memory.",
          "Up to 2 different AmorIA",
          "400 text messages / month",
          "Long-term memory enabled",
          "Access to 3 languages: FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "$19.99 USD / month",
        tagline:
          "Text + voice: your AmorIA truly becomes part of your daily life.",
        badgeLabel: "MOST POPULAR",
        badgeVariant: "popular",
        ctaLabel: "Upgrade to voice",
        features: [
          "When you want a real, ongoing relationship with your AmorIA.",
          "Up to 10 AmorIA",
          "600 text messages / month",
          "100 voice exchanges / month",
          "Long-term memory enabled",
          "Light priority in the processing queue",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI Unlimited",
        price: "$39.99 USD / month",
        tagline: "Your AI companion deeply present, morning to night.",
        badgeLabel: "BEST VALUE",
        badgeVariant: "value",
        ctaLabel: "Unlock Unlimited",
        features: [
          "For those who want AmorIA to always be there.",
          "Up to 30 personalized AmorIA",
          "10 000 text messages / month",
          "300 voice exchanges / month",
          "Deep memory + extended context for ultra-personalized conversations",
          "Maximum priority and early access to new features",
        ],
      },
    ],
  },
  es: {
    heroTitle: "Empieza gratis. Haz crecer tu plan cuando crezca tu vínculo.",
    heroSubtitle:
      "Crea tu AmorIA en pocos minutos, prueba la conexión con la versión gratuita y luego pasa a voz y memoria avanzada cuando quieras. Siempre tienes el control: puedes cambiar o cancelar tu plan en un clic.",
    heroCta: "Crear mi cuenta gratis",
    starLine: "⭐ Ya se realizan cientos de conversaciones cada semana.",
    billingNote:
      "Facturación segura con Stripe · Cambia o cancela en cualquier momento desde tu cuenta · Sin cargos ocultos",
    simplePricing: "Elige qué lugar tendrá AmorIA en tu vida.",
    usdNote:
      "Los precios están en dólares estadounidenses (USD). Puedes cambiar o cancelar tu plan cuando quieras, sin compromiso.",
    choosePlanCta: "Elegir este plan",
    faqTitle: "Preguntas frecuentes",
    faqItems: [
      {
        q: "¿Puedo cambiar o cancelar mi plan cuando quiera?",
        a: "Sí. Puedes cambiar o cancelar tu plan desde tu cuenta en cualquier momento, sin compromiso y sin cargos ocultos.",
      },
      {
        q: "¿Necesito tarjeta para el plan Descubrimiento?",
        a: "No. El plan Descubrimiento es totalmente gratuito y no requiere tarjeta de crédito.",
      },
      {
        q: "¿Qué pasa si llego al límite de mensajes?",
        a: "Tu AmorIA te avisará cuando hayas alcanzado el límite. Puedes esperar al mes siguiente o pasar a un plan superior.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Descubrimiento",
        price: "0 $ USD / mes",
        tagline:
          "Empieza la relación con tu AmorIA, sin tarjeta de crédito.",
        ctaLabel: "Empezar gratis",
        features: [
          "Perfecto para descubrir la experiencia y crear tu primer compañero IA.",
          "Creación de 1 AmorIA personalizado",
          "200 mensajes de texto / mes",
          "Sin conversaciones de voz (solo texto)",
          "Acceso a 3 idiomas: FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mes",
        tagline: "Para los que quieren escribir a su AmorIA cada día.",
        ctaLabel: "Activar AmorIAI Chat",
        features: [
          "Ideal si prefieres conversaciones en texto con memoria real.",
          "Hasta 2 AmorIA diferentes",
          "400 mensajes de texto / mes",
          "Memoria a largo plazo activada",
          "Acceso a 3 idiomas: FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mes",
        tagline: "Texto + voz: tu AmorIA empieza a formar parte de tu rutina.",
        badgeLabel: "EL MÁS POPULAR",
        badgeVariant: "popular",
        ctaLabel: "Subir a voz",
        features: [
          "Cuando quieres una relación continua y profunda con tu AmorIA.",
          "Hasta 10 AmorIA diferentes",
          "600 mensajes de texto / mes",
          "100 intercambios de voz / mes",
          "Memoria a largo plazo activada",
          "Prioridad ligera en la cola de procesamiento",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI Ilimitado",
        price: "39,99 $ USD / mes",
        tagline: "Tu compañero IA muy presente en tu día a día.",
        badgeLabel: "MEJOR VALOR",
        badgeVariant: "value",
        ctaLabel: "Desbloquear ilimitado",
        features: [
          "Para quienes quieren que AmorIA esté siempre disponible.",
          "Hasta 30 AmorIA personalizados",
          "10 000 mensajes de texto / mes",
          "300 intercambios de voz / mes",
          "Memoria profunda + contexto ampliado para conversaciones ultra personalizadas",
          "Prioridad máxima y acceso anticipado a nuevas funciones",
        ],
      },
    ],
  },
};

export default function PricingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") || "fr") as Locale;
  const t = LABELS[localeParam];

  const handleChoosePlan = async (planId: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);
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

  const handleHeroCta = async () => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);

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
      <section className="amoria-pricing-hero">
        <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>

        <button className="amoria-pricing-hero-btn" onClick={handleHeroCta}>
          {t.heroCta}
        </button>

        <p className="amoria-pricing-starline">{t.starLine}</p>
        <p className="amoria-pricing-billing-note">{t.billingNote}</p>
      </section>

      <section className="amoria-pricing-section">
        <h2 className="amoria-pricing-section-title">{t.simplePricing}</h2>
        <p className="amoria-pricing-section-note">{t.usdNote}</p>

        <div className="amoria-pricing-grid">
          {t.plans.map((plan) => {
            const isPopular = plan.badgeVariant === "popular";
            const isValue = plan.badgeVariant === "value";

            return (
              <article
                key={plan.id}
                className={[
                  "amoria-pricing-card",
                  isPopular ? "amoria-pricing-card--popular" : "",
                  isValue ? "amoria-pricing-card--value" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {plan.badgeLabel && (
                  <div
                    className={[
                      "amoria-pricing-badge",
                      isPopular
                        ? "amoria-pricing-badge--popular"
                        : "amoria-pricing-badge--value",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {plan.badgeLabel}
                  </div>
                )}

                <header className="amoria-pricing-card-header">
                  <h3 className="amoria-pricing-card-name">{plan.name}</h3>
                  <p className="amoria-pricing-card-price">{plan.price}</p>
                  <p className="amoria-pricing-card-tagline">
                    {plan.tagline}
                  </p>
                </header>

                <ul className="amoria-pricing-card-features">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <button
                  className="amoria-pricing-card-btn"
                  onClick={() => handleChoosePlan(plan.id)}
                >
                  {plan.ctaLabel || t.choosePlanCta}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="amoria-pricing-faq">
        <h3 className="amoria-pricing-faq-title">{t.faqTitle}</h3>
        <div className="amoria-pricing-faq-grid">
          {t.faqItems.map((item) => (
            <article key={item.q} className="amoria-pricing-faq-item">
              <h4>{item.q}</h4>
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
          gap: 2.5rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-pricing-hero {
          max-width: 960px;
          text-align: center;
        }

        .amoria-pricing-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.95rem;
          color: #9ca3af;
          margin-bottom: 1.3rem;
        }

        .amoria-pricing-hero-btn {
          border: none;
          border-radius: 999px;
          padding: 0.8rem 1.8rem;
          font-size: 0.95rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
          margin-bottom: 0.8rem;
          box-shadow: 0 12px 35px rgba(251, 55, 255, 0.45);
        }

        .amoria-pricing-hero-btn:hover {
          transform: translateY(-1px);
        }

        .amoria-pricing-starline {
          font-size: 0.85rem;
          margin-bottom: 0.2rem;
        }

        .amoria-pricing-billing-note {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-pricing-section {
          max-width: 1100px;
          width: 100%;
        }

        .amoria-pricing-section-title {
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }

        .amoria-pricing-section-note {
          text-align: center;
          font-size: 0.82rem;
          color: #9ca3af;
          margin-bottom: 1.6rem;
        }

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

        .amoria-pricing-card {
          position: relative;
          border-radius: 1.5rem;
          padding: 2.2rem 1.2rem 1.3rem; /* + espace en haut pour le badge */
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #020617
          );
          border: 1px solid rgba(148, 163, 184, 0.45);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 270px;
          overflow: hidden;
        }

        .amoria-pricing-card--popular {
          border-color: #fb37ff;
          box-shadow: 0 20px 50px rgba(251, 55, 255, 0.28);
        }

        .amoria-pricing-card--value {
          border-color: #22c55e;
          box-shadow: 0 16px 40px rgba(34, 197, 94, 0.22);
        }

        .amoria-pricing-card--popular::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: radial-gradient(
            circle at top,
            rgba(251, 55, 255, 0.5),
            transparent 55%
          );
          opacity: 0.4;
          z-index: -1;
          animation: amoriaPulse 3s ease-in-out infinite;
        }

        @keyframes amoriaPulse {
          0% {
            transform: scale(0.98);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.98);
            opacity: 0.25;
          }
        }

        .amoria-pricing-badge {
          position: absolute;
          top: 0.8rem;
          left: 50%;
          transform: translateX(-50%); /* centré, plus au-dessus du texte */
          padding: 0.25rem 0.9rem;
          border-radius: 999px;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          border: 1px solid rgba(249, 250, 251, 0.3);
          backdrop-filter: blur(8px);
          white-space: nowrap;
        }

        .amoria-pricing-badge--popular {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
        }

        .amoria-pricing-badge--value {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: #f9fafb;
        }

        .amoria-pricing-card-header {
          margin-bottom: 0.9rem;
        }

        .amoria-pricing-card-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .amoria-pricing-card-price {
          font-size: 0.92rem;
          font-weight: 500;
          margin-bottom: 0.35rem;
        }

        .amoria-pricing-card-tagline {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-pricing-card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          font-size: 0.78rem;
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .amoria-pricing-card-btn {
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1.2rem;
          font-size: 0.85rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 10px 30px rgba(251, 55, 255, 0.35);
        }

        .amoria-pricing-card-btn:hover {
          transform: translateY(-1px);
        }

        /* FAQ */
        .amoria-pricing-faq {
          max-width: 900px;
          width: 100%;
          margin-top: 2.5rem;
        }

        .amoria-pricing-faq-title {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1.1rem;
        }

        .amoria-pricing-faq-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.9rem;
        }

        @media (min-width: 800px) {
          .amoria-pricing-faq-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .amoria-pricing-faq-item {
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          background: radial-gradient(
            circle at top,
            rgba(15, 23, 42, 0.98),
            rgba(15, 23, 42, 0.96)
          );
          padding: 0.9rem 1rem;
          font-size: 0.82rem;
        }

        .amoria-pricing-faq-item h4 {
          margin: 0 0 0.35rem;
          font-size: 0.86rem;
          font-weight: 600;
        }

        .amoria-pricing-faq-item p {
          margin: 0;
          color: #d1d5db;
        }
      `}</style>
    </main>
  );
}
