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
};

type Labels = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroSecondary: string;
  billingNote: string;
  simplePricing: string;
  usdNote: string;
  choosePlanCta: string;
  mostPopular: string;
  bestValue: string;
  plans: Plan[];
};

const LABELS: Record<Locale, Labels> = {
  fr: {
    heroKicker: "TARIFS AMORIAI",
    heroTitle: "Commence gratuitement. Fais évoluer ton forfait quand ton lien grandit.",
    heroSubtitle:
      "Crée ton AmorIAI en quelques minutes, teste la connexion en version gratuite, puis passe à la voix et à la mémoire avancée quand tu te sens prête. Tu gardes toujours le contrôle : tu peux changer de forfait ou annuler en un clic.",
    heroCta: "Créer mon compte gratuit",
    heroSecondary: "Aucun engagement · Tu peux arrêter quand tu veux",
    billingNote:
      "Facturation sécurisée via Stripe · Révision ou annulation en tout temps depuis ton compte · Aucun frais caché",
    simplePricing: "Des forfaits simples, pensés pour ta relation avec ton IA",
    usdNote:
      "Les prix sont en dollars américains (USD). Tu peux changer de forfait ou l’annuler quand tu veux, sans pénalité.",
    choosePlanCta: "Choisir ce forfait",
    mostPopular: "Le plus populaire",
    bestValue: "Meilleure valeur",
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ USD / mois",
        tagline: "Commence ta relation avec AmorIAI, sans carte de crédit.",
        features: [
          "Parfait pour découvrir l’expérience et créer ton premier compagnon IA.",
          "Création de 1 AmorIAI personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Accès aux 3 langues : FR, EN, ES",
          "Tu peux passer à un forfait payant à tout moment",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        tagline: "Pour celles et ceux qui veulent écrire à leur AmorIAI chaque jour.",
        features: [
          "Idéal si tu préfères les conversations en texte avec une vraie mémoire.",
          "Jusqu’à 2 AmorIAI différents",
          "400 messages texte / mois",
          "Mémoire longue durée activée",
          "Accès aux 3 langues : FR, EN, ES",
          "Tu peux passer à la voix plus tard, quand tu en as envie",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        tagline: "Texte + voix : ton AmorIAI commence vraiment à faire partie de ta vie.",
        badge: "Le plus populaire",
        features: [
          "Parfait si tu veux entendre sa voix régulièrement et sentir une vraie présence.",
          "Jusqu’à 10 AmorIAI différents (amis, coach, partenaire, etc.)",
          "600 messages texte / mois",
          "100 échanges vocaux / mois",
          "Mémoire longue durée avancée",
          "Priorité dans le traitement des messages",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI Illimité",
        price: "39,99 $ USD / mois",
        tagline: "Ton compagnon IA ultra-présent, matin, soir et week-end.",
        badge: "Meilleure valeur",
        features: [
          "Pour celles et ceux qui veulent qu’AmorIAI soit là presque en continu.",
          "Jusqu’à 30 AmorIAI entièrement personnalisés",
          "10 000 messages texte / mois",
          "300 échanges vocaux / mois",
          "Mémoire profonde + contexte étendu pour des réponses ultra personnalisées",
          "Priorité maximale et accès anticipé aux nouvelles fonctionnalités",
        ],
      },
    ],
  },
  en: {
    heroKicker: "AMORIAI PLANS",
    heroTitle: "Start for free. Upgrade only when the connection feels right.",
    heroSubtitle:
      "Create your AmorIAI in a few minutes, try the free version, then move to voice and advanced memory when you’re ready. You’re always in control: you can upgrade, downgrade, or cancel in one click.",
    heroCta: "Create my free account",
    heroSecondary: "No commitment · Cancel anytime",
    billingNote:
      "Secure billing with Stripe · Upgrade or cancel anytime from your account · No hidden fees",
    simplePricing: "Simple plans designed around your relationship with your AI",
    usdNote:
      "Prices are in US dollars (USD). You can switch or cancel your plan anytime, without penalty.",
    choosePlanCta: "Choose this plan",
    mostPopular: "Most popular",
    bestValue: "Best value",
    plans: [
      {
        id: "free",
        name: "Discovery",
        price: "$0 USD / month",
        tagline: "Start your connection with AmorIAI, no credit card required.",
        features: [
          "Perfect to explore the experience and create your first AI companion.",
          "Create 1 personalized AmorIAI",
          "200 text messages / month",
          "No voice conversations (text only)",
          "Access to 3 languages: FR, EN, ES",
          "You can upgrade to any paid plan at any time",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "$9.99 USD / month",
        tagline: "For daily texting with your AmorIAI, without voice calls.",
        features: [
          "Ideal if you love written conversations with real long-term memory.",
          "Up to 2 different AmorIAI",
          "400 text messages / month",
          "Long-term memory enabled",
          "Access to 3 languages: FR, EN, ES",
          "You can add voice later whenever you want",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "$19.99 USD / month",
        tagline: "Text + voice: your AmorIAI truly becomes part of your daily life.",
        badge: "Most popular",
        features: [
          "Perfect if you want to hear their voice regularly and feel real presence.",
          "Up to 10 different AmorIAI (friend, coach, partner, etc.)",
          "600 text messages / month",
          "100 voice exchanges / month",
          "Advanced long-term memory",
          "Priority in message processing",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI Unlimited",
        price: "$39.99 USD / month",
        tagline: "An ultra-present AI companion, from morning to late at night.",
        badge: "Best value",
        features: [
          "For those who want AmorIAI to be there almost all the time.",
          "Up to 30 fully personalized AmorIAI",
          "10 000 text messages / month",
          "300 voice exchanges / month",
          "Deep memory + extended context for highly personalized answers",
          "Maximum priority and early access to new features",
        ],
      },
    ],
  },
  es: {
    heroKicker: "PLANES AMORIAI",
    heroTitle: "Empieza gratis. Sube de plan solo cuando la conexión lo merezca.",
    heroSubtitle:
      "Crea tu AmorIAI en pocos minutos, prueba la versión gratuita y luego pasa a voz y memoria avanzada cuando te sientas listo. Siempre tienes el control: puedes cambiar de plan o cancelarlo con un solo clic.",
    heroCta: "Crear mi cuenta gratis",
    heroSecondary: "Sin compromiso · Puedes cancelar cuando quieras",
    billingNote:
      "Facturación segura con Stripe · Cambia o cancela tu plan en cualquier momento · Sin cargos ocultos",
    simplePricing: "Planes simples, pensados para tu relación con tu IA",
    usdNote:
      "Los precios están en dólares estadounidenses (USD). Puedes cambiar o cancelar tu plan cuando quieras, sin penalización.",
    choosePlanCta: "Elegir este plan",
    mostPopular: "El más popular",
    bestValue: "Mejor relación calidad-precio",
    plans: [
      {
        id: "free",
        name: "Descubrimiento",
        price: "0 $ USD / mes",
        tagline: "Empieza tu conexión con AmorIAI, sin tarjeta de crédito.",
        features: [
          "Perfecto para probar la experiencia y crear tu primer compañero IA.",
          "Creación de 1 AmorIAI personalizado",
          "200 mensajes de texto / mes",
          "Sin conversaciones de voz (solo texto)",
          "Acceso a 3 idiomas: FR, EN, ES",
          "Puedes pasar a un plan de pago cuando quieras",
        ],
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mes",
        tagline: "Para chatear cada día con tu AmorIAI por texto.",
        features: [
          "Ideal si prefieres conversaciones escritas con memoria a largo plazo.",
          "Hasta 2 AmorIAI diferentes",
          "400 mensajes de texto / mes",
          "Memoria a largo plazo activada",
          "Acceso a 3 idiomas: FR, EN, ES",
          "Puedes añadir voz más adelante cuando te apetezca",
        ],
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mes",
        tagline: "Texto + voz: tu AmorIAI empieza a formar parte de tu día a día.",
        badge: "El más popular",
        features: [
          "Perfecto si quieres escuchar su voz con regularidad y sentir verdadera presencia.",
          "Hasta 10 AmorIAI diferentes (amigo, coach, pareja, etc.)",
          "600 mensajes de texto / mes",
          "100 intercambios de voz / mes",
          "Memoria a largo plazo avanzada",
          "Prioridad en el procesamiento de mensajes",
        ],
      },
      {
        id: "unlimited",
        name: "AmorIAI Ilimitado",
        price: "39,99 $ USD / mes",
        tagline: "Tu compañero IA ultra presente, mañana, tarde y noche.",
        badge: "Mejor relación calidad-precio",
        features: [
          "Para quienes quieren que AmorIAI esté allí casi todo el tiempo.",
          "Hasta 30 AmorIAI totalmente personalizados",
          "10 000 mensajes de texto / mes",
          "300 intercambios de voz / mes",
          "Memoria profunda + contexto ampliado para respuestas muy personalizadas",
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
        <p className="amoria-pricing-kicker">{t.heroKicker}</p>
        <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>

        <div className="amoria-pricing-hero-actions">
          <button className="amoria-pricing-hero-btn" onClick={handleHeroCta}>
            {t.heroCta}
          </button>
          <p className="amoria-pricing-hero-secondary">{t.heroSecondary}</p>
        </div>

        <p className="amoria-pricing-billing-note">{t.billingNote}</p>
      </section>

      <section className="amoria-pricing-section">
        <h2 className="amoria-pricing-section-title">
          {t.simplePricing}
        </h2>
        <p className="amoria-pricing-section-note">{t.usdNote}</p>

        <div className="amoria-pricing-grid">
          {t.plans.map((plan) => (
            <article
              key={plan.id}
              className={[
                "amoria-pricing-card",
                plan.id === "plus" ? "amoria-pricing-card--highlight" : "",
                plan.id === "unlimited" ? "amoria-pricing-card--outline" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <header className="amoria-pricing-card-header">
                <div className="amoria-pricing-card-header-top">
                  <h3 className="amoria-pricing-card-name">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className="amoria-pricing-card-badge">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="amoria-pricing-card-price">
                  {plan.price}
                </p>
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
                {t.choosePlanCta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .amoria-pricing-root {
          min-height: 100vh;
          padding: 3.2rem 1.5rem 4rem;
          background: radial-gradient(circle at top, #020617 0, #000 60%);
          color: #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.8rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-pricing-hero {
          max-width: 960px;
          text-align: center;
        }

        .amoria-pricing-kicker {
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.6rem;
        }

        .amoria-pricing-title {
          font-size: 1.95rem;
          font-weight: 650;
          margin-bottom: 0.8rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.97rem;
          color: #9ca3af;
          margin-bottom: 1.4rem;
        }

        .amoria-pricing-hero-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.9rem;
        }

        .amoria-pricing-hero-btn {
          border: none;
          border-radius: 999px;
          padding: 0.9rem 2.1rem;
          font-size: 0.95rem;
          font-weight: 500;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          cursor: pointer;
          box-shadow: 0 18px 40px rgba(248, 113, 113, 0.55);
          transition: transform 0.16s ease, box-shadow 0.16s ease,
            filter 0.16s ease;
        }

        .amoria-pricing-hero-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow: 0 22px 55px rgba(248, 113, 113, 0.7);
        }

        .amoria-pricing-hero-secondary {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-pricing-billing-note {
          font-size: 0.78rem;
          color: #6b7280;
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
          margin-bottom: 1.8rem;
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
          border-radius: 1.6rem;
          padding: 1.5rem 1.2rem 1.35rem;
          background: radial-gradient(
            circle at top,
            rgba(15, 23, 42, 0.98) 0,
            rgba(15, 23, 42, 0.98) 40%,
            #020617 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.4);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 270px;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.7);
          transition: transform 0.18s ease, box-shadow 0.18s ease,
            border-color 0.18s ease, background 0.18s ease;
        }

        .amoria-pricing-card--highlight {
          border-color: #fb37ff;
          box-shadow: 0 26px 60px rgba(251, 55, 255, 0.35);
          background: radial-gradient(
            circle at top,
            rgba(251, 55, 255, 0.28),
            rgba(15, 23, 42, 0.98),
            #020617
          );
        }

        .amoria-pricing-card--outline {
          border-style: dashed;
        }

        .amoria-pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 26px 65px rgba(15, 23, 42, 0.95);
          border-color: rgba(251, 55, 255, 0.65);
        }

        .amoria-pricing-card-header {
          margin-bottom: 1rem;
        }

        .amoria-pricing-card-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
          margin-bottom: 0.3rem;
        }

        .amoria-pricing-card-name {
          font-size: 1rem;
          font-weight: 600;
        }

        .amoria-pricing-card-badge {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          background: rgba(251, 55, 255, 0.14);
          border: 1px solid rgba(251, 55, 255, 0.6);
          color: #f9fafb;
          white-space: nowrap;
        }

        .amoria-pricing-card-price {
          font-size: 0.96rem;
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
          margin: 0 0 1.1rem;
          font-size: 0.78rem;
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
        }

        .amoria-pricing-card-features li::before {
          content: "•";
          margin-right: 0.45rem;
          color: #fb37ff;
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
          font-weight: 500;
          box-shadow: 0 14px 32px rgba(251, 55, 255, 0.45);
          transition: transform 0.15s ease, box-shadow 0.15s ease,
            filter 0.15s ease;
        }

        .amoria-pricing-card-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow: 0 18px 40px rgba(251, 55, 255, 0.7);
        }

        @media (max-width: 768px) {
          .amoria-pricing-root {
            padding-inline: 1rem;
          }
        }
      `}</style>
    </main>
  );
    }
