"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";

type PlanId = "free" | "chat" | "plus" | "unlimited";

type PricingCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  billingNote: string;
  simpleTitle: string;
  faqTitle: string;
  faqSubtitle: string;
  faqItems: { q: string; a: string }[];
  plans: {
    id: PlanId;
    name: string;
    price: string;
    description: string;
    highlight?: string;
    features: string[];
    isPopular?: boolean;
  }[];
};

const PRICING_STRINGS: Record<Locale, PricingCopy> = {
  fr: {
    heroKicker: "TARIFS AMORIAI.APP",
    heroTitle: "Choisis le rythme qui convient à ton AmorIAI.",
    heroSubtitle:
      "Commence gratuitement, crée ton AmorIAI personnalisé, puis passe à la voix quand tu es prête. Les plans payants débloquent la mémoire longue durée, plus de messages et les conversations vocales.",
    ctaPrimary: "Créer mon compte gratuit",
    billingNote:
      "Facturation sécurisée via Stripe · Annulation en tout temps depuis ton compte · Aucun frais caché",
    simpleTitle: "Des tarifs simples & transparents",
    faqTitle: "Questions fréquentes",
    faqSubtitle:
      "Tu peux changer de forfait ou annuler à tout moment. Les prix sont en dollars américains (USD).",
    faqItems: [
      {
        q: "Puis-je vraiment créer mon AmorIAI avec le plan gratuit ?",
        a: "Oui. Le plan Découverte te permet de créer ton AmorIAI, de tester la relation et de voir si tu aimes l’expérience avant de passer à un plan payant.",
      },
      {
        q: "Que se passe-t-il si je dépasse les limites de messages ou de voix ?",
        a: "On applique une limite « fair use ». Tu verras un message t’invitant à passer à un plan supérieur ou à attendre le renouvellement de ton mois.",
      },
      {
        q: "Puis-je changer de plan quand je veux ?",
        a: "Oui, tu peux passer à un plan supérieur ou revenir à un plan inférieur à tout moment. Le changement sera appliqué au prochain cycle de facturation.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ USD / mois",
        description: "Crée ton AmorIAI gratuitement.",
        features: [
          "Création de 1 AmorIAI personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        description: "Texte tous les jours, sans voix.",
        features: [
          "Jusqu’à 2 AmorIAI différents",
          "400 messages texte / mois",
          "Mémoire longue durée activée",
          "Accès aux 3 langues : FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        description: "Texte + voix avec limites confortables.",
        highlight: "Le plus choisi",
        isPopular: true,
        features: [
          "Jusqu’à 10 AmorIAI différents",
          "600 messages texte / mois",
          "100 échanges vocaux / mois",
          "Mémoire longue durée activée",
          "Priorité légère dans le fil de traitement",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI illimité",
        price: "39,99 $ USD / mois",
        description: "Ton compagnon IA, très présent au quotidien.",
        features: [
          "Jusqu’à 30 AmorIAI personnalisés",
          "10 000 messages texte / mois",
          "300 échanges vocaux / mois",
          "Mémoire profonde + contexte étendu",
          "Priorité maximale et accès anticipé aux nouvelles fonctionnalités",
        ],
      },
    ],
  },

  en: {
    heroKicker: "AMORIAI.APP PRICING",
    heroTitle: "Choose the pace that fits your AmorIAI.",
    heroSubtitle:
      "Start for free, create your personalized AmorIAI, then upgrade to voice when you’re ready. Paid plans unlock long-term memory, more messages and voice conversations.",
    ctaPrimary: "Create my free account",
    billingNote:
      "Secure billing via Stripe · Cancel anytime from your account · No hidden fees",
    simpleTitle: "Simple & transparent pricing",
    faqTitle: "Frequently asked questions",
    faqSubtitle:
      "You can change plan or cancel at any time. Prices are in US dollars (USD).",
    faqItems: [
      {
        q: "Can I really create my AmorIAI with the free plan?",
        a: "Yes. The Discovery plan lets you create your AmorIAI and test the relationship before upgrading to a paid plan.",
      },
      {
        q: "What happens if I reach the message or voice limits?",
        a: "We apply a fair-use policy. You’ll see a message inviting you to upgrade or wait for the next billing period.",
      },
      {
        q: "Can I change plan whenever I want?",
        a: "Yes, you can upgrade or downgrade at any time. The change will apply on your next billing cycle.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Discovery",
        price: "$0 USD / month",
        description: "Create your AmorIAI for free.",
        features: [
          "Create 1 personalized AmorIAI",
          "200 text messages / month",
          "No voice conversations (text only)",
          "Access to 3 languages: FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "$9.99 USD / month",
        description: "Text every day, without voice.",
        features: [
          "Up to 2 different AmorIAI",
          "400 text messages / month",
          "Long-term memory enabled",
          "Access to 3 languages: FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "$19.99 USD / month",
        description: "Text + voice with comfortable limits.",
        highlight: "Most popular",
        isPopular: true,
        features: [
          "Up to 10 different AmorIAI",
          "600 text messages / month",
          "100 voice exchanges / month",
          "Long-term memory enabled",
          "Light priority in processing queue",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI Unlimited",
        price: "$39.99 USD / month",
        description: "Your AI companion very present in your daily life.",
        features: [
          "Up to 30 personalized AmorIAI",
          "10,000 text messages / month",
          "300 voice exchanges / month",
          "Deep memory + extended context",
          "Maximum priority & early access to new features",
        ],
      },
    ],
  },

  es: {
    heroKicker: "PRECIOS AMORIAI.APP",
    heroTitle: "Elige el ritmo que encaja con tu AmorIAI.",
    heroSubtitle:
      "Empieza gratis, crea tu AmorIAI personalizado y pasa a la voz cuando estés lista. Los planes de pago desbloquean memoria a largo plazo, más mensajes y conversaciones de voz.",
    ctaPrimary: "Crear mi cuenta gratuita",
    billingNote:
      "Cobro seguro con Stripe · Cancelación en cualquier momento desde tu cuenta · Sin cargos ocultos",
    simpleTitle: "Tarifas simples y transparentes",
    faqTitle: "Preguntas frecuentes",
    faqSubtitle:
      "Puedes cambiar de plan o cancelar en cualquier momento. Los precios están en dólares estadounidenses (USD).",
    faqItems: [
      {
        q: "¿De verdad puedo crear mi AmorIAI con el plan gratuito?",
        a: "Sí. El plan Descubrimiento te permite crear tu AmorIAI y probar la relación antes de pasar a un plan de pago.",
      },
      {
        q: "¿Qué pasa si supero los límites de mensajes o de voz?",
        a: "Aplicamos una política de uso justo. Verás un mensaje invitándote a pasar a un plan superior o a esperar el siguiente mes.",
      },
      {
        q: "¿Puedo cambiar de plan cuando quiera?",
        a: "Sí, puedes subir o bajar de plan en cualquier momento. El cambio se aplicará en tu próximo ciclo de facturación.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Descubrimiento",
        price: "0 $ USD / mes",
        description: "Crea tu AmorIAI gratuitamente.",
        features: [
          "Creación de 1 AmorIAI personalizado",
          "200 mensajes de texto / mes",
          "Sin conversación de voz (solo texto)",
          "Acceso a 3 idiomas: FR, EN, ES",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mes",
        description: "Texto cada día, sin voz.",
        features: [
          "Hasta 2 AmorIAI diferentes",
          "400 mensajes de texto / mes",
          "Memoria a largo plazo activada",
          "Acceso a 3 idiomas: FR, EN, ES",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mes",
        description: "Texto + voz con límites cómodos.",
        highlight: "El más elegido",
        isPopular: true,
        features: [
          "Hasta 10 AmorIAI diferentes",
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
        description: "Tu compañero IA muy presente en tu día a día.",
        features: [
          "Hasta 30 AmorIAI personalizados",
          "10 000 mensajes de texto / mes",
          "300 intercambios de voz / mes",
          "Memoria profunda + contexto ampliado",
          "Prioridad máxima y acceso anticipado a nuevas funciones",
        ],
      },
    ],
  },
};

export default function PricingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = (searchParams.get("lang") || "fr") as Locale;
  const t = PRICING_STRINGS[locale];

  // Pour l’instant, tous les boutons envoient vers /signup
  const handleChoosePlan = (planId: PlanId) => {
    router.push(`/signup?lang=${locale}`);
  };

  const handleHeroCta = () => {
    router.push(`/signup?lang=${locale}`);
  };

  return (
    <main className="pricing-root">
      <section className="pricing-hero">
        <p className="pricing-hero-kicker">{t.heroKicker}</p>
        <h1 className="pricing-hero-title">{t.heroTitle}</h1>
        <p className="pricing-hero-subtitle">{t.heroSubtitle}</p>

        <button className="pricing-hero-cta" onClick={handleHeroCta}>
          {t.ctaPrimary}
        </button>

        <p className="pricing-hero-note">{t.billingNote}</p>
      </section>

      <section className="pricing-plans">
        <h2 className="pricing-simple-title">{t.simpleTitle}</h2>

        <div className="pricing-plans-grid">
          {t.plans.map((plan) => (
            <article
              key={plan.id}
              className={
                "pricing-card" + (plan.isPopular ? " pricing-card-popular" : "")
              }
            >
              {plan.highlight && (
                <div className="pricing-card-badge">{plan.highlight}</div>
              )}

              <h3 className="pricing-card-name">{plan.name}</h3>
              <p className="pricing-card-price">{plan.price}</p>
              <p className="pricing-card-desc">{plan.description}</p>

              <ul className="pricing-card-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>

              <button
                className="pricing-card-cta"
                onClick={() => handleChoosePlan(plan.id)}
              >
                {locale === "fr"
                  ? "Choisir ce forfait"
                  : locale === "es"
                  ? "Elegir este plan"
                  : "Choose this plan"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-faq">
        <h2 className="pricing-faq-title">{t.faqTitle}</h2>
        <p className="pricing-faq-subtitle">{t.faqSubtitle}</p>

        <div className="pricing-faq-grid">
          {t.faqItems.map((item, i) => (
            <article key={i} className="pricing-faq-item">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .pricing-root {
          min-height: 100vh;
          padding: 4rem 1.5rem 3rem;
          background: radial-gradient(circle at top, #020617 0, #000 100%);
          color: #e5e7eb;
        }

        .pricing-hero {
          max-width: 960px;
          margin: 0 auto 2.5rem;
          text-align: center;
        }

        .pricing-hero-kicker {
          font-size: 0.8rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.5rem;
        }

        .pricing-hero-title {
          font-size: 1.8rem;
          margin-bottom: 0.6rem;
        }

        .pricing-hero-subtitle {
          font-size: 0.95rem;
          color: #9ca3af;
          margin-bottom: 1.2rem;
        }

        .pricing-hero-cta {
          border: none;
          border-radius: 999px;
          padding: 0.8rem 1.8rem;
          font-size: 0.95rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
          margin-bottom: 0.7rem;
        }

        .pricing-hero-note {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .pricing-simple-title {
          max-width: 960px;
          margin: 2.5rem auto 1.2rem;
          font-size: 1.2rem;
        }

        .pricing-plans-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.5rem;
        }

        .pricing-card {
          position: relative;
          border-radius: 1.5rem;
          padding: 1.5rem 1.4rem 1.7rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.35);
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.6);
        }

        .pricing-card-popular {
          border-color: #fb37ff;
          box-shadow: 0 22px 45px rgba(251, 55, 255, 0.4);
        }

        .pricing-card-badge {
          position: absolute;
          top: 1rem;
          right: 1.1rem;
          font-size: 0.68rem;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          background: rgba(251, 55, 255, 0.18);
        }

        .pricing-card-name {
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }

        .pricing-card-price {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .pricing-card-desc {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 0.7rem;
        }

        .pricing-card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 0.9rem;
          font-size: 0.78rem;
          color: #d1d5db;
        }

        .pricing-card-features li {
          margin-bottom: 0.3rem;
        }

        .pricing-card-cta {
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.6rem 1rem;
          font-size: 0.85rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
        }

        .pricing-faq {
          max-width: 1100px;
          margin: 3rem auto 0;
        }

        .pricing-faq-title {
          font-size: 1.2rem;
          margin-bottom: 0.3rem;
        }

        .pricing-faq-subtitle {
          font-size: 0.86rem;
          color: #9ca3af;
          margin-bottom: 1.2rem;
        }

        .pricing-faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.1rem;
        }

        .pricing-faq-item {
          border-radius: 1.2rem;
          padding: 1rem 1.1rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.35);
          font-size: 0.8rem;
        }

        .pricing-faq-item h3 {
          font-size: 0.86rem;
          margin-bottom: 0.4rem;
        }

        .pricing-faq-item p {
          color: #d1d5db;
          font-size: 0.78rem;
        }

        @media (max-width: 640px) {
          .pricing-root {
            padding-top: 3rem;
          }

          .pricing-hero-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </main>
  );
}
