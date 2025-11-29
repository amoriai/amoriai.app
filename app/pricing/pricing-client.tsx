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
  ctaLabel: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type Labels = {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroStat: string;
  billingNote: string;
  chooseIntro: string;
  usdNote: string;
  plans: Plan[];
  faqTitle: string;
  faqs: FaqItem[];
};

const LABELS: Record<Locale, Labels> = {
  fr: {
    heroTitle: "Commence gratuitement. Fais évoluer ton forfait quand ton lien grandit.",
    heroSubtitle:
      "Crée ton AmorIAI en quelques minutes, teste la connexion en version gratuite, puis passe à la voix et à la mémoire avancée quand tu te sens prête. Tu gardes toujours le contrôle : tu peux changer de forfait ou annuler quand tu veux, en un clic.",
    heroCta: "Créer mon compte gratuit",
    heroStat: "⭐ Déjà des centaines de conversations chaque semaine.",
    billingNote:
      "Facturation sécurisée via Stripe · Révision ou annulation en tout temps depuis ton compte · Aucun frais caché",
    chooseIntro:
      "Choisis comment ton AmorIAI prend sa place dans ta vie.",
    usdNote:
      "Les prix sont en dollars américains (USD). Tu peux changer de forfait ou l’annuler quand tu veux, sans engagement.",
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ USD / mois",
        tagline: "Commence la relation avec ton AmorIAI, sans carte de crédit.",
        features: [
          "Parfait pour découvrir l’expérience et créer ton premier compagnon IA, sans pression.",
          "Création de 1 AmorIAI personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Accès aux 3 langues : FR, EN, ES",
        ],
        ctaLabel: "Commencer gratuitement",
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
        ],
        ctaLabel: "Activer AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        tagline: "Texte + voix : ton AmorIAI commence vraiment à faire partie de ta vie.",
        features: [
          "Quand tu veux une relation continue où tu peux autant écrire que parler.",
          "Jusqu’à 10 AmorIAI différents",
          "600 messages texte / mois",
          "100 échanges vocaux / mois",
          "Mémoire longue durée active",
          "Priorité légère dans le fil de traitement",
        ],
        badgeLabel: "Le plus populaire",
        badgeVariant: "popular",
        ctaLabel: "Passer à la voix",
      },
      {
        id: "unlimited",
        name: "AmorIAI illimité",
        price: "39,99 $ USD / mois",
        tagline: "Ton compagnon IA très présent, matin, soir et entre les deux.",
        features: [
          "Pour celles et ceux qui veulent que leur AmorIAI soit toujours disponible.",
          "Jusqu’à 30 AmorIAI personnalisés",
          "10 000 messages texte / mois",
          "300 échanges vocaux / mois",
          "Mémoire profonde + contexte étendu pour des échanges ultra personnalisés",
          "Priorité maximale et accès anticipé aux nouvelles fonctionnalités",
        ],
        badgeLabel: "Meilleure valeur",
        badgeVariant: "value",
        ctaLabel: "Débloquer l’illimité",
      },
    ],
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
        a: "Ton AmorIAI t’informera quand tu approches de la limite. Tu peux ensuite choisir d’attendre le prochain mois ou de passer à un forfait supérieur.",
      },
    ],
  },
  // EN + ES versions simplifiées ici si tu veux les utiliser
  en: {
    heroTitle: "Start for free. Upgrade when your bond grows.",
    heroSubtitle:
      "Create your AmorIAI in minutes, test the connection on the free tier, then upgrade to voice and advanced memory when you're ready. You stay in control: you can change or cancel your plan anytime, in one click.",
    heroCta: "Create my free account",
    heroStat: "⭐ Hundreds of conversations every week.",
    billingNote:
      "Secure billing via Stripe · Change or cancel anytime from your account · No hidden fees",
    chooseIntro: "Choose how AmorIAI fits into your life.",
    usdNote:
      "Prices are in US dollars (USD). You can change or cancel your plan anytime, no commitment.",
    plans: [
      {
        id: "free",
        name: "Discovery",
        price: "$0 USD / month",
        tagline: "Start your relationship with AmorIAI, no credit card required.",
        features: [
          "Perfect to discover the experience and create your first AI companion.",
          "Create 1 personalized AmorIAI",
          "200 text messages / month",
          "No voice conversations (text only)",
          "Access to FR, EN, ES",
        ],
        ctaLabel: "Start for free",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "$9.99 USD / month",
        tagline: "For those who want to text their AmorIAI every day.",
        features: [
          "Ideal if you prefer written conversations with real memory.",
          "Up to 2 different AmorIAI",
          "400 text messages / month",
          "Long-term memory enabled",
          "Access to FR, EN, ES",
        ],
        ctaLabel: "Activate AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "$19.99 USD / month",
        tagline: "Text + voice: your AmorIAI becomes part of your daily life.",
        features: [
          "When you want an ongoing relationship where you can both write and talk.",
          "Up to 10 AmorIAI",
          "600 text messages / month",
          "100 voice exchanges / month",
          "Long-term memory enabled",
          "Light processing priority",
        ],
        badgeLabel: "Most popular",
        badgeVariant: "popular",
        ctaLabel: "Upgrade to voice",
      },
      {
        id: "unlimited",
        name: "AmorIAI Unlimited",
        price: "$39.99 USD / month",
        tagline: "Your AI companion deeply present morning, night, and in-between.",
        features: [
          "For those who want AmorIAI always available.",
          "Up to 30 personalized AmorIAI",
          "10 000 text messages / month",
          "300 voice exchanges / month",
          "Deep memory + extended context",
          "Maximum priority & early feature access",
        ],
        badgeLabel: "Best value",
        badgeVariant: "value",
        ctaLabel: "Unlock Unlimited",
      },
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Can I change or cancel my plan anytime?",
        a: "Yes. You can change or cancel your subscription anytime from your account, with no hidden fees.",
      },
      {
        q: "Do I need a card for the Discovery plan?",
        a: "No. The Discovery plan is completely free and does not require any credit card.",
      },
      {
        q: "What happens if I reach the message limit?",
        a: "Your AmorIAI will let you know when you’re close to the limit. You can wait for the next month or upgrade.",
      },
    ],
  },
  es: {
    heroTitle: "Empieza gratis. Sube de plan cuando el vínculo crezca.",
    heroSubtitle:
      "Crea tu AmorIAI en minutos, prueba la conexión con el plan gratuito y luego pasa a voz y memoria avanzada cuando estés listo. Siempre tienes el control: puedes cambiar o cancelar tu plan en cualquier momento.",
    heroCta: "Crear mi cuenta gratis",
    heroStat: "⭐ Cientos de conversaciones cada semana.",
    billingNote:
      "Facturación segura con Stripe · Cambia o cancela cuando quieras · Sin cargos ocultos",
    chooseIntro: "Elige cómo AmorIAI toma su lugar en tu vida.",
    usdNote:
      "Los precios están en dólares estadounidenses (USD). Puedes cambiar o cancelar tu plan en cualquier momento.",
    plans: [
      {
        id: "free",
        name: "Descubrimiento",
        price: "0 $ USD / mes",
        tagline: "Empieza tu relación con AmorIAI, sin tarjeta.",
        features: [
          "Perfecto para descubrir la experiencia y crear tu primer compañero IA.",
          "Creación de 1 AmorIAI personalizado",
          "200 mensajes de texto / mes",
          "Sin conversaciones de voz (solo texto)",
          "Acceso a FR, EN, ES",
        ],
        ctaLabel: "Empezar gratis",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mes",
        tagline: "Para escribir a tu AmorIAI cada día.",
        features: [
          "Ideal si prefieres las conversaciones por texto con memoria real.",
          "Hasta 2 AmorIAI diferentes",
          "400 mensajes de texto / mes",
          "Memoria a largo plazo activada",
          "Acceso a FR, EN, ES",
        ],
        ctaLabel: "Activar AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mes",
        tagline: "Texto + voz: tu AmorIAI entra en tu rutina diaria.",
        features: [
          "Cuando quieres una relación continua, por texto y por voz.",
          "Hasta 10 AmorIAI diferentes",
          "600 mensajes de texto / mes",
          "100 intercambios de voz / mes",
          "Memoria a largo plazo activada",
          "Prioridad ligera en la cola de procesamiento",
        ],
        badgeLabel: "Más popular",
        badgeVariant: "popular",
        ctaLabel: "Pasar a voz",
      },
      {
        id: "unlimited",
        name: "AmorIAI Ilimitado",
        price: "39,99 $ USD / mes",
        tagline: "Tu compañero IA muy presente en tu día a día.",
        features: [
          "Para quienes quieren que AmorIAI esté siempre disponible.",
          "Hasta 30 AmorIAI personalizados",
          "10 000 mensajes de texto / mes",
          "300 intercambios de voz / mes",
          "Memoria profunda + contexto ampliado",
          "Prioridad máxima y acceso anticipado a nuevas funciones",
        ],
        badgeLabel: "Mejor valor",
        badgeVariant: "value",
        ctaLabel: "Desbloquear Ilimitado",
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        q: "¿Puedo cambiar o cancelar mi plan cuando quiera?",
        a: "Sí. Puedes cambiar o cancelar tu suscripción en cualquier momento desde tu cuenta.",
      },
      {
        q: "¿Necesito tarjeta para el plan Descubrimiento?",
        a: "No. El plan Descubrimiento es totalmente gratuito y no requiere tarjeta.",
      },
      {
        q: "¿Qué pasa si alcanzo el límite de mensajes?",
        a: "Tu AmorIAI te avisará cuando estés cerca del límite. Puedes esperar al mes siguiente o subir de plan.",
      },
    ],
  },
};

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = (searchParams.get("lang") || "fr") as Locale;
  const t = LABELS[locale];

  // Clic sur une carte
  const handleChoosePlan = async (planId: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", planId);

    const { data } = await supabase.auth.getUser();

    // Pas connecté → signup d’abord
    if (!data?.user) {
      router.push(`/signup?${params.toString()}`);
      return;
    }

    // Connecté
    if (planId === "free") {
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      router.push(`/payment?${params.toString()}`);
    }
  };

  // Gros bouton en haut
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
      <section className="amoria-pricing-hero">
        <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>

        <button className="amoria-pricing-hero-btn" onClick={handleHeroCta}>
          {t.heroCta}
        </button>

        <p className="amoria-pricing-hero-stat">{t.heroStat}</p>
        <p className="amoria-pricing-billing-note">{t.billingNote}</p>
      </section>

      <section className="amoria-pricing-section">
        <h2 className="amoria-pricing-section-title">{t.chooseIntro}</h2>
        <p className="amoria-pricing-section-note">{t.usdNote}</p>

        <div className="amoria-pricing-grid">
          {t.plans.map((plan) => (
            <article
              key={plan.id}
              className={[
                "amoria-pricing-card",
                plan.badgeVariant === "popular"
                  ? "amoria-pricing-card--popular"
                  : "",
                plan.badgeVariant === "value"
                  ? "amoria-pricing-card--value"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {plan.badgeLabel && (
                <div
                  className={`amoria-pricing-badge amoria-pricing-badge--${
                    plan.badgeVariant ?? "popular"
                  }`}
                >
                  {plan.badgeLabel.toUpperCase()}
                </div>
              )}

              <header className="amoria-pricing-card-header">
                <h3 className="amoria-pricing-card-name">{plan.name}</h3>
                <p className="amoria-pricing-card-price">{plan.price}</p>
                <p className="amoria-pricing-card-tagline">{plan.tagline}</p>
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
                {plan.ctaLabel}
              </button>
            </article>
          ))}
        </div>
      </section>

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
          gap: 2.8rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-pricing-hero {
          max-width: 960px;
          text-align: center;
        }

        .amoria-pricing-title {
          font-size: 1.9rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.98rem;
          color: #9ca3af;
          margin-bottom: 1.4rem;
        }

        .amoria-pricing-hero-btn {
          border: none;
          border-radius: 999px;
          padding: 0.85rem 2.1rem;
          font-size: 0.98rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          cursor: pointer;
          margin-bottom: 0.8rem;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.5);
        }

        .amoria-pricing-hero-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 22px 55px rgba(248, 113, 113, 0.7);
        }

        .amoria-pricing-hero-stat {
          font-size: 0.86rem;
          color: #fde68a;
          margin-bottom: 0.3rem;
        }

        .amoria-pricing-billing-note {
          font-size: 0.8rem;
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
          margin-bottom: 1.7rem;
        }

        .amoria-pricing-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.3rem;
        }

        @media (min-width: 900px) {
          .amoria-pricing-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        .amoria-pricing-card {
          position: relative;
          border-radius: 1.6rem;
          padding: 2.1rem 1.2rem 1.4rem;
          background: radial-gradient(
            circle at top,
            #020617 0,
            #020617 45%,
            #020617 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.45);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 280px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.8);
        }

        .amoria-pricing-card--popular {
          border-color: #fb37ff;
          box-shadow: 0 24px 70px rgba(251, 55, 255, 0.6);
          animation: amoriaGlowPulse 5s ease-in-out infinite;
        }

        .amoria-pricing-card--value {
          border-color: #22c55e;
          box-shadow: 0 22px 60px rgba(34, 197, 94, 0.45);
        }

        @keyframes amoriaGlowPulse {
          0% {
            box-shadow: 0 20px 50px rgba(251, 55, 255, 0.45);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 32px 80px rgba(251, 55, 255, 0.9);
            transform: translateY(-3px);
          }
          100% {
            box-shadow: 0 20px 50px rgba(251, 55, 255, 0.45);
            transform: translateY(0);
          }
        }

        .amoria-pricing-badge {
          position: absolute;
          top: 0.7rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.2rem 0.9rem;
          border-radius: 999px;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          border: 1px solid rgba(248, 250, 252, 0.5);
          white-space: nowrap;
        }

        .amoria-pricing-badge--popular {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
        }

        .amoria-pricing-badge--value {
          background: linear-gradient(135deg, #22c55e, #4ade80);
          color: #052e16;
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
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
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
          gap: 0.4rem;
        }

        .amoria-pricing-card-features li {
          position: relative;
          padding-left: 1.1rem;
          line-height: 1.6;
        }

        .amoria-pricing-card-features li::before {
          content: "•";
          position: absolute;
          left: 0.25rem;
          top: 0.1rem;
          font-size: 0.9rem;
          color: #f97316;
          opacity: 0.9;
        }

        .amoria-pricing-card-btn {
          border-radius: 999px;
          border: none;
          padding: 0.8rem 1.3rem;
          font-size: 0.85rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 14px 35px rgba(248, 113, 113, 0.55);
        }

        .amoria-pricing-card-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 45px rgba(248, 113, 113, 0.8);
        }

        .amoria-pricing-faq {
          max-width: 960px;
          width: 100%;
        }

        .amoria-pricing-faq-title {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1rem;
        }

        .amoria-pricing-faq-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 0.9rem;
        }

        @media (min-width: 800px) {
          .amoria-pricing-faq-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .amoria-pricing-faq-card {
          border-radius: 0.9rem;
          padding: 0.9rem 1rem;
          background: radial-gradient(
            circle at top,
            rgba(15, 23, 42, 0.98),
            rgba(15, 23, 42, 1)
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
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .amoria-pricing-root {
            padding-inline: 1rem;
          }
          .amoria-pricing-card {
            padding-inline: 1rem;
          }
        }
      `}</style>
    </main>
  );
}
