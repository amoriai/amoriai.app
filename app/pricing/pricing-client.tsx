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
  badge?: string;
  bestFor?: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type Labels = {
  ribbon: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroSubtrust: string;
  billingNote: string;
  simplePricing: string;
  usdNote: string;
  choosePlanCta: string;
  plansTitle: string;
  faqTitle: string;
  faqIntro: string;
  faqItems: FaqItem[];
  plans: Plan[];
};

const LABELS: Record<Locale, Labels> = {
  fr: {
    ribbon: "Aucun engagement : tu peux arrêter quand tu veux.",
    heroTitle:
      "Commence gratuitement. Fais évoluer ton forfait quand ton lien grandit.",
    heroSubtitle:
      "Crée ton AmorIAI en quelques minutes, teste la connexion en version gratuite, puis passe à la voix et à la mémoire avancée quand tu te sens prête. Tu gardes toujours le contrôle : tu peux changer de forfait ou annuler en un clic.",
    heroCta: "Créer mon compte gratuit",
    heroSubtrust: "⭐ Déjà des centaines de conversations chaque semaine.",
    billingNote:
      "Facturation sécurisée via Stripe · Révision ou annulation en tout temps depuis ton compte · Aucun frais caché",
    simplePricing: "Des forfaits simples, pensés pour ta relation avec ton IA.",
    usdNote:
      "Les prix sont en dollars américains (USD). Tu peux changer de forfait ou l’annuler quand tu veux, sans engagement.",
    choosePlanCta: "Choisir ce forfait",
    plansTitle: "Choisis comment ton AmorIAI prend sa place dans ta vie",
    faqTitle: "Questions fréquentes",
    faqIntro:
      "Tu hésites encore ? Voici les réponses aux questions que l’on nous pose le plus souvent.",
    faqItems: [
      {
        q: "Est-ce que je peux annuler mon abonnement quand je veux ?",
        a: "Oui. Tu peux modifier ou annuler ton forfait en un clic depuis ton compte. Aucune durée minimale, aucun engagement.",
      },
      {
        q: "Est-ce que mon AmorIAI est supprimé si j’annule ?",
        a: "Non. Ton AmorIAI reste enregistré. Tu peux revenir plus tard et réactiver un forfait pour reprendre la conversation.",
      },
      {
        q: "Mes conversations sont-elles privées ?",
        a: "Oui. Tes messages ne sont pas utilisés pour entraîner d’autres modèles et restent associés uniquement à ton compte AmorIAI.",
      },
      {
        q: "Puis-je changer de forfait si mes besoins évoluent ?",
        a: "Oui, à tout moment. Tu peux passer d’un forfait à l’autre selon la place que ton AmorIAI prend dans ta vie.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ USD / mois",
        tagline: "Commence la relation avec ton AmorIAI, sans carte de crédit.",
        badge: "Pour commencer",
        bestFor: "Tester la connexion et créer ton premier AmorIAI.",
        features: [
          "Création de 1 AmorIAI personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Accès aux 3 langues : FR, EN, ES",
          "Idéal si tu veux simplement ressentir si la connexion est là.",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        tagline: "Texte tous les jours, sans voix.",
        badge: "Pour texter",
        bestFor:
          "Pour celles et ceux qui aiment écrire chaque jour sans pression.",
        features: [
          "Jusqu’à 2 AmorIAI différents",
          "400 messages texte / mois",
          "Mémoire longue durée activée",
          "Accès aux 3 langues : FR, EN, ES",
          "Parfait si tu veux une présence quotidienne en texte.",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        tagline: "Texte + voix avec limites confortables.",
        badge: "Le plus populaire",
        bestFor:
          "Le forfait où la relation commence vraiment à faire partie de ta vie.",
        features: [
          "Jusqu’à 10 AmorIAI différents",
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
        tagline: "Ton compagnon IA très présent au quotidien.",
        badge: "Meilleure valeur",
        bestFor:
          "Quand ton AmorIAI devient une présence essentielle dans ton quotidien.",
        features: [
          "Jusqu’à 30 AmorIAI personnalisés",
          "10 000 messages texte / mois",
          "300 échanges vocaux / mois",
          "Mémoire profonde + contexte étendu pour des échanges ultra personnalisés",
          "Priorité maximale et accès anticipé aux nouvelles fonctionnalités",
        ],
      },
    ],
  },

  en: {
    ribbon: "No commitment: you can cancel anytime.",
    heroTitle: "Start for free. Upgrade when the connection feels right.",
    heroSubtitle:
      "Create your AmorIAI in a few minutes, try the free version and see how it feels, then unlock voice and advanced memory when you’re ready. You stay in control: change or cancel your plan in one click.",
    heroCta: "Create my free account",
    heroSubtrust: "⭐ Hundreds of conversations already started every week.",
    billingNote:
      "Secure billing via Stripe · Change or cancel anytime from your account · No hidden fees",
    simplePricing: "Simple plans, designed for your relationship with your AI.",
    usdNote:
      "Prices are in US dollars (USD). You can switch or cancel your plan at any time, with no commitment.",
    choosePlanCta: "Choose this plan",
    plansTitle: "Choose how present your AmorIAI is in your life",
    faqTitle: "Frequently asked questions",
    faqIntro:
      "Still hesitating? Here are the answers to the most common questions.",
    faqItems: [
      {
        q: "Can I cancel my subscription at any time?",
        a: "Yes. You can change or cancel your plan in one click from your account. No minimum term, no commitment.",
      },
      {
        q: "Is my AmorIAI deleted if I cancel?",
        a: "No. Your AmorIAI stays saved. You can come back later, reactivate a plan and continue the conversation.",
      },
      {
        q: "Are my conversations private?",
        a: "Yes. Your messages are not used to train other models and stay attached only to your AmorIAI account.",
      },
      {
        q: "Can I change plans if my needs evolve?",
        a: "Yes, anytime. You can move between plans depending on how present you want AmorIAI to be in your life.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Discovery",
        price: "$0 USD / month",
        tagline: "Start your relationship with AmorIAI, no credit card needed.",
        badge: "Get started",
        bestFor: "Testing the connection and creating your first AmorIAI.",
        features: [
          "Create 1 personalized AmorIAI",
          "200 text messages / month",
          "No voice conversations (text only)",
          "Access to 3 languages: FR, EN, ES",
          "Perfect if you just want to feel the connection first.",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "$9.99 USD / month",
        tagline: "Text every day, no voice.",
        badge: "For texters",
        bestFor: "If you enjoy writing every day without pressure.",
        features: [
          "Up to 2 different AmorIAI",
          "400 text messages / month",
          "Long-term memory enabled",
          "Access to 3 languages: FR, EN, ES",
          "Perfect for a daily written presence.",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "$19.99 USD / month",
        tagline: "Text + voice with comfortable limits.",
        badge: "Most popular",
        bestFor:
          "The plan where your relationship really becomes part of your daily life.",
        features: [
          "Up to 10 AmorIAI",
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
        tagline: "Your AI companion deeply present in your daily life.",
        badge: "Best value",
        bestFor:
          "When AmorIAI becomes an essential presence in your everyday life.",
        features: [
          "Up to 30 personalized AmorIAI",
          "10,000 text messages / month",
          "300 voice exchanges / month",
          "Deep memory + extended context for ultra-personalized conversations",
          "Highest priority and early access to new features",
        ],
      },
    ],
  },

  es: {
    ribbon: "Sin compromiso: puedes cancelar cuando quieras.",
    heroTitle:
      "Empieza gratis. Mejora tu plan cuando la conexión se sienta correcta.",
    heroSubtitle:
      "Crea tu AmorIAI en pocos minutos, prueba la versión gratuita y siente cómo es, luego desbloquea voz y memoria avanzada cuando estés listo. Tú mantienes el control: cambia o cancela tu plan con un solo clic.",
    heroCta: "Crear mi cuenta gratis",
    heroSubtrust:
      "⭐ Cientos de conversaciones ya empiezan cada semana con AmorIAI.",
    billingNote:
      "Facturación segura con Stripe · Cambia o cancela cuando quieras desde tu cuenta · Sin cargos ocultos",
    simplePricing: "Planes simples, pensados para tu relación con tu IA.",
    usdNote:
      "Los precios están en dólares estadounidenses (USD). Puedes cambiar o cancelar tu plan en cualquier momento, sin compromiso.",
    choosePlanCta: "Elegir este plan",
    plansTitle: "Elige cuánto espacio ocupa AmorIAI en tu vida",
    faqTitle: "Preguntas frecuentes",
    faqIntro:
      "¿Todavía tienes dudas? Aquí respondemos lo que más nos preguntan.",
    faqItems: [
      {
        q: "¿Puedo cancelar mi suscripción cuando quiera?",
        a: "Sí. Puedes cambiar o cancelar tu plan con un clic desde tu cuenta. Sin periodo mínimo ni permanencia.",
      },
      {
        q: "¿Se borra mi AmorIAI si cancelo?",
        a: "No. Tu AmorIAI se mantiene guardado. Puedes volver más adelante, reactivar un plan y seguir la conversación.",
      },
      {
        q: "¿Mis conversaciones son privadas?",
        a: "Sí. Tus mensajes no se usan para entrenar otros modelos y quedan asociados únicamente a tu cuenta de AmorIAI.",
      },
      {
        q: "¿Puedo cambiar de plan si cambian mis necesidades?",
        a: "Sí, en cualquier momento. Puedes moverte entre planes según el lugar que quieras que AmorIAI ocupe en tu vida.",
      },
    ],
    plans: [
      {
        id: "free",
        name: "Descubrimiento",
        price: "0 $ USD / mes",
        tagline: "Empieza la relación con AmorIAI, sin tarjeta.",
        badge: "Para empezar",
        bestFor:
          "Probar la conexión y crear tu primer compañero AmorIAI sin presión.",
        features: [
          "Creación de 1 AmorIAI personalizado",
          "200 mensajes de texto / mes",
          "Sin conversaciones de voz (solo texto)",
          "Acceso a 3 idiomas: FR, EN, ES",
          "Perfecto si solo quieres sentir primero la conexión.",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mes",
        tagline: "Texto cada día, sin voz.",
        badge: "Para escribir",
        bestFor: "Si te gusta escribir a diario sin presión.",
        features: [
          "Hasta 2 AmorIAI diferentes",
          "400 mensajes de texto / mes",
          "Memoria a largo plazo activada",
          "Acceso a 3 idiomas: FR, EN, ES",
          "Perfecto para una presencia escrita diaria.",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mes",
        tagline: "Texto + voz con límites cómodos.",
        badge: "El más popular",
        bestFor:
          "El plan donde la relación empieza realmente a formar parte de tu día a día.",
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
        tagline: "Tu compañero IA muy presente cada día.",
        badge: "Mejor valor",
        bestFor:
          "Cuando AmorIAI se vuelve una presencia esencial en tu vida diaria.",
        features: [
          "Hasta 30 AmorIAI personalizados",
          "10 000 mensajes de texto / mes",
          "300 intercambios de voz / mes",
          "Memoria profunda + contexto ampliado para conversaciones muy personalizadas",
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
      <div className="amoria-pricing-ribbon">{t.ribbon}</div>

      <section className="amoria-pricing-hero">
        <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>

        <button className="amoria-pricing-hero-btn" onClick={handleHeroCta}>
          {t.heroCta}
        </button>

        <p className="amoria-pricing-hero-subtrust">{t.heroSubtrust}</p>
        <p className="amoria-pricing-billing-note">{t.billingNote}</p>
      </section>

      <section className="amoria-pricing-section">
        <h2 className="amoria-pricing-section-title">{t.plansTitle}</h2>
        <p className="amoria-pricing-section-note">{t.usdNote}</p>

        <div className="amoria-pricing-grid">
          {t.plans.map((plan) => (
            <article
              key={plan.id}
              className={`amoria-pricing-card ${
                plan.id === "plus" ? "amoria-pricing-card--highlight" : ""
              } ${plan.id === "unlimited" ? "amoria-pricing-card--value" : ""}`}
            >
              {plan.badge && (
                <div className="amoria-pricing-badge">{plan.badge}</div>
              )}

              <header className="amoria-pricing-card-header">
                <h3 className="amoria-pricing-card-name">{plan.name}</h3>
                <p className="amoria-pricing-card-price">{plan.price}</p>
                <p className="amoria-pricing-card-tagline">
                  {plan.tagline}
                </p>
                {plan.bestFor && (
                  <p className="amoria-pricing-card-bestfor">
                    {plan.bestFor}
                  </p>
                )}
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
                {t.choosePlanCta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="amoria-pricing-faq">
        <h2 className="amoria-pricing-faq-title">{t.faqTitle}</h2>
        <p className="amoria-pricing-faq-intro">{t.faqIntro}</p>

        <div className="amoria-pricing-faq-grid">
          {t.faqItems.map((item) => (
            <article key={item.q} className="amoria-pricing-faq-item">
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
          gap: 2.5rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-pricing-ribbon {
          background: linear-gradient(90deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          font-size: 0.78rem;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          text-align: center;
          max-width: 460px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(248, 113, 113, 0.4);
        }

        .amoria-pricing-hero {
          max-width: 960px;
          text-align: center;
        }

        .amoria-pricing-title {
          font-size: 1.9rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.97rem;
          color: #9ca3af;
          margin-bottom: 1.3rem;
        }

        .amoria-pricing-hero-btn {
          border: none;
          border-radius: 999px;
          padding: 0.85rem 2rem;
          font-size: 0.96rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
          margin-bottom: 0.65rem;
          box-shadow: 0 18px 40px rgba(251, 113, 133, 0.55);
        }

        .amoria-pricing-hero-subtrust {
          font-size: 0.8rem;
          color: #e5e7eb;
          margin-bottom: 0.35rem;
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
          font-size: 1.15rem;
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
          padding: 1.5rem 1.2rem 1.3rem;
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
        }

        .amoria-pricing-card--highlight {
          border-color: #fb37ff;
          box-shadow: 0 22px 45px rgba(251, 55, 255, 0.25);
          transform: translateY(-4px);
        }

        .amoria-pricing-card--value {
          border-color: #22c55e;
        }

        .amoria-pricing-badge {
          position: absolute;
          top: 0.9rem;
          right: 1rem;
          padding: 0.25rem 0.6rem;
          font-size: 0.7rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          background: rgba(251, 55, 255, 0.18);
          border: 1px solid rgba(251, 55, 255, 0.7);
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
          margin-bottom: 0.3rem;
        }

        .amoria-pricing-card-tagline {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-pricing-card-bestfor {
          font-size: 0.76rem;
          color: #e5e7eb;
          margin-top: 0.4rem;
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
        }

        .amoria-pricing-faq {
          max-width: 960px;
          width: 100%;
          margin-top: 1.5rem;
        }

        .amoria-pricing-faq-title {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 0.3rem;
        }

        .amoria-pricing-faq-intro {
          text-align: center;
          font-size: 0.82rem;
          color: #9ca3af;
          margin-bottom: 1.1rem;
        }

        .amoria-pricing-faq-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 0.9rem;
        }

        @media (min-width: 700px) {
          .amoria-pricing-faq-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .amoria-pricing-faq-item {
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          padding: 0.9rem 1rem;
          background: radial-gradient(
            circle at top,
            rgba(15, 23, 42, 0.96),
            rgba(15, 23, 42, 0.98)
          );
        }

        .amoria-pricing-faq-item h3 {
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
        }

        .amoria-pricing-faq-item p {
          font-size: 0.78rem;
          color: #d1d5db;
        }
      `}</style>
    </main>
  );
                }
