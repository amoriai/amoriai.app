"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

type LayoutStrings = {
  brandTagline: string;
  nav: { home: string; features: string; pricing: string };
  navLogin: string;
  navSignup: string;
  footerCopy: string;
  footerLinks: {
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    about: string;
  };
};

/* ===========================
   STRINGS LAYOUT (HEADER / FOOTER)
=========================== */

const LAYOUT_STRINGS: Record<Locale, LayoutStrings> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: {
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      terms: "Conditions d’utilisation",
      contact: "Contact",
      about: "À propos",
    },
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my free account",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: {
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms of use",
      contact: "Contact",
      about: "About",
    },
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta gratuita",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: {
      legal: "Aviso legal",
      privacy: "Política de privacidad",
      terms: "Términos de uso",
      contact: "Contacto",
      about: "Acerca de",
    },
  },
};

/* ===========================
   STRINGS PRICING
=========================== */

const LABELS: Record<Locale, Labels> = {
  fr: {
    heroTitle:
      "Commence gratuitement. Fais évoluer ton forfait quand ton lien grandit.",
    heroSubtitle:
      "Crée ton AmorIAI en quelques minutes, teste la connexion en version gratuite, puis passe à la voix et à la mémoire avancée quand tu te sens prête. Tu gardes toujours le contrôle : tu peux changer de forfait ou annuler quand tu veux, en un clic.",
    heroCta: "Commencer avec le forfait Découverte",
    heroStat: "⭐ Déjà des centaines de conversations chaque semaine.",
    billingNote:
      "Facturation sécurisée via Stripe · Révision ou annulation en tout temps depuis ton compte · Aucun frais caché",
    chooseIntro: "Choisis comment ton AmorIAI prend sa place dans ta vie.",
    usdNote:
      "Les prix sont en dollars américains (USD). Tu peux changer de forfait ou l’annuler quand tu veux, sans engagement.",
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ USD / mois",
        tagline:
          "Commence la relation avec ton AmorIAI, sans carte de crédit.",
        features: [
          "Parfait pour découvrir l’expérience et créer ton premier compagnon IA, sans pression.",
          "Création de 1 AmorIAI personnalisé",
          "200 messages texte / mois",
          "Aucune conversation vocale (texte uniquement)",
          "Accès aux 3 langues : FR, EN, ES",
        ],
        ctaLabel: "Choisir le forfait Découverte",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        tagline:
          "Pour celles et ceux qui veulent écrire à leur AmorIAI chaque jour.",
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
        tagline:
          "Texte + voix IA : ton AmorIAI commence vraiment à faire partie de ta vie.",
        features: [
          "Quand tu veux une relation continue où tu peux autant écrire que parler.",
          "Jusqu’à 10 AmorIAI différents",
          "1000 messages texte / mois",
          "100 réponses audio générées par l’IA / mois",
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
        tagline:
          "Ton compagnon IA très présent, avec IA qui parle et qui bouge en continu.",
        features: [
          "Pour celles et ceux qui veulent que leur AmorIAI soit toujours disponible.",
          "Jusqu’à 30 AmorIAI personnalisés",
          "10 000 messages texte / mois",
          "300 réponses audio générées par l’IA / mois",
          "Mémoire profonde + contexte étendu pour des échanges ultra personnalisés",
          "Priorité maximale et accès anticipé aux nouvelles fonctionnalités",
          "Accès aux vidéos d’IA qui bouge (avatars animés en boucle) réservées au plan Illimité",
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
  en: {
    heroTitle: "Start for free. Upgrade when your bond grows.",
    heroSubtitle:
      "Create your AmorIAI in minutes, test the connection on the free tier, then upgrade to voice and advanced memory when you're ready. You stay in control: you can change or cancel your plan anytime, in one click.",
    heroCta: "Start with the Discovery plan",
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
        tagline:
          "Start your relationship with AmorIAI, no credit card required.",
        features: [
          "Perfect to discover the experience and create your first AI companion, with no pressure.",
          "Create 1 personalized AmorIAI",
          "200 text messages / month",
          "No voice conversations (text only)",
          "Access to FR, EN, ES",
        ],
        ctaLabel: "Choose Discovery",
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
        tagline:
          "Text + AI voice: your AmorIAI becomes part of your daily life.",
        features: [
          "When you want an ongoing relationship where you can both write and talk.",
          "Up to 10 AmorIAI",
          "1000 text messages / month",
          "100 AI-generated voice replies / month",
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
        tagline:
          "Your AI companion deeply present, with talking and moving IA videos.",
        features: [
          "For those who want AmorIAI to be always available.",
          "Up to 30 personalized AmorIAI",
          "10 000 text messages / month",
          "300 AI-generated voice replies / month",
          "Deep memory + extended context",
          "Maximum priority & early access to new features",
          "Exclusive access to looping animated IA videos (moving avatars) included only in Unlimited",
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
    heroCta: "Empezar con el plan Descubrimiento",
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
        tagline:
          "Empieza tu relación con AmorIAI, sin tarjeta de crédito.",
        features: [
          "Perfecto para descubrir la experiencia y crear tu primer compañero IA sin presión.",
          "Creación de 1 AmorIAI personalizado",
          "200 mensajes de texto / mes",
          "Sin conversaciones de voz (solo texto)",
          "Acceso a FR, EN, ES",
        ],
        ctaLabel: "Elegir Descubrimiento",
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
        tagline:
          "Texto + voz IA: tu AmorIAI entra en tu rutina diaria.",
        features: [
          "Cuando quieres una relación continua, por texto y por voz.",
          "Hasta 10 AmorIAI diferentes",
          "1000 mensajes de texto / mes",
          "100 respuestas de voz generadas por la IA / mes",
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
        tagline:
          "Tu compañero IA muy presente, con IA que habla y se mueve en pantalla.",
        features: [
          "Para quienes quieren que AmorIAI esté siempre disponible.",
          "Hasta 30 AmorIAI personalizados",
          "10 000 mensajes de texto / mes",
          "300 respuestas de voz generadas por la IA / mes",
          "Memoria profunda + contexto ampliado",
          "Prioridad máxima y acceso anticipado a nuevas funciones",
          "Acceso exclusivo a vídeos de IA animada en bucle (avatares en movimiento) solo en el plan Ilimitado",
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

/* ===========================
   UTIL LOCALE
=========================== */

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get("lang");
  if (fromParam === "fr" || fromParam === "en" || fromParam === "es") {
    return fromParam;
  }
  const navLang = navigator.language.toLowerCase();
  if (navLang.startsWith("fr")) return "fr";
  if (navLang.startsWith("es")) return "es";
  return "en";
}

/* ===========================
   COMPONENT
=========================== */

export default function PricingPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    const initial = detectInitialLocale();
    setLocale(initial);
    const params = new URLSearchParams(window.location.search);
    params.set("lang", initial);
    const newUrl = window.location.pathname + "?" + params.toString();
    window.history.replaceState(null, "", newUrl);
  }, []);

  const t = LABELS[locale];
  const ui = LAYOUT_STRINGS[locale];

  const withLang = (path: string) => `${path}?lang=${locale}`;

  const handleLocaleChange = (code: Locale) => {
    setLocale(code);
    const params = new URLSearchParams(window.location.search);
    params.set("lang", code);
    const newUrl = window.location.pathname + "?" + params.toString();
    window.history.replaceState(null, "", newUrl);
  };

  /* ============
     NAV HELPERS
  ============ */

  const goToCreateAmoria = (planId: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", planId);
    router.push(`/create-amoria?${params.toString()}`);
  };

  const goToPayment = (planId: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", planId);
    router.push(`/payment?${params.toString()}`);
  };

  /* ============
     HERO CTA = toujours FREE
  ============ */

  const handleHeroCta = () => {
    goToCreateAmoria("free");
  };

  /* ============
     CLICK SUR UNE CARTE DE PRIX
  ============ */

  const handleChoosePlan = (planId: PlanId) => {
    if (planId === "free") {
      goToCreateAmoria("free");
    } else {
      goToPayment(planId);
    }
  };

  return (
    <main className="amoria-root">
      {/* HEADER */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIAI.app"
            className="amoria-logo-full"
          />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmorIAI.app</div>
            <div className="amoria-logo-tagline">{ui.brandTagline}</div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={withLang("/")} className="amoria-nav-link">
            {ui.nav.home}
          </a>
          <a href={withLang("/#features")} className="amoria-nav-link">
            {ui.nav.features}
          </a>
          <a
            href={withLang("/pricing")}
            className="amoria-nav-link amoria-nav-link--active"
          >
            {ui.nav.pricing}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <div className="amoria-lang-switch">
            {(["fr", "en", "es"] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLocaleChange(code)}
                className={
                  "amoria-lang-pill" +
                  (locale === code ? " amoria-lang-pill--active" : "")
                }
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href={withLang("/login")}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {ui.navLogin}
          </a>
          <a
            href={withLang("/signup")}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {ui.navSignup}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="amoria-pricing-hero">
        <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>
        <button
          className="amoria-pricing-hero-btn"
          onClick={handleHeroCta}
        >
          {t.heroCta}
        </button>
        <p className="amoria-pricing-hero-stat">{t.heroStat}</p>
        <p className="amoria-pricing-billing-note">{t.billingNote}</p>
      </section>

      {/* PLANS */}
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
                {plan.ctaLabel}
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

      {/* FOOTER */}
      <footer className="amoria-footer">
        <div className="amoria-footer-top">
          <span>{ui.footerCopy}</span>
        </div>
        <div className="amoria-footer-links">
          <a href={withLang("/legal")} className="amoria-footer-link">
            {ui.footerLinks.legal}
          </a>
          <a
            href={withLang("/legal/privacy")}
            className="amoria-footer-link"
          >
            {ui.footerLinks.privacy}
          </a>
          <a
            href={withLang("/legal/terms")}
            className="amoria-footer-link"
          >
            {ui.footerLinks.terms}
          </a>
          <a href={withLang("/contact")} className="amoria-footer-link">
            {ui.footerLinks.contact}
          </a>
          <a href={withLang("/about")} className="amoria-footer-link">
            {ui.footerLinks.about}
          </a>
        </div>
      </footer>

      {/* styles identiques à ta version (je ne les recolle pas ici pour ne pas rallonger encore plus) */}
    </main>
  );
    }
