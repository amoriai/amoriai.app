"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type Locale = "fr" | "en" | "es";
type PersonaId = "lyra" | "orion" | "kai" | "maelis";

type Persona = {
  id: PersonaId;
  title: string;
  description: string;
};

type Testimonial = {
  quote: string;
  name: string;
};

type Copy = {
  brandTagline: string;
  nav: { home: string; features: string; pricing: string };
  navLogin: string;
  navSignup: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimary: string;
  heroSupport: string;
  langNote: string;
  personasTitle: string;
  personasSubtitle: string;
  personas: Persona[];
  choosePersona: string;
  usageTitle: string;
  usageBullets: string[];
  testimonialsTitle: string;
  testimonials: Testimonial[];
  pricingTitle: string;
  pricingText: string;
  pricingCta: string;
  videoCaption: string;
  footerCopy: string;
  footerLinks: {
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    about: string;
  };
};

const STRINGS: Record<Locale, Copy> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    heroKicker: "BIENVENUE SUR AMORIAI.APP",
    heroTitle: "Une présence bienveillante pour parler, réfléchir et avancer.",
    heroSubtitle:
      "Amoriai est une présence douce, disponible 24/7, pour parler librement, réfléchir ensemble, poser les bonnes questions et t’aider à mieux comprendre ce que tu ressens, sans jugement.",
    heroPrimary: "Créer mon compte gratuit",
    heroSupport:
      "Sans engagement • Gratuit pour commencer • Annulation en tout temps",
    langNote: "AmorIAI vous accueille en français, anglais ou espagnol.",
    personasTitle: "Commence gratuitement avec AmorIAI (en texte)",
    personasSubtitle:
      "Crée ton compte gratuitement et commence à parler avec Amoriai dès maintenant. Écris librement, à ton rythme. La voix (parler avec ton Amoriai) est disponible avec l’abonnement payant.",
    personas: [
      {
        id: "lyra",
        title: "Lyra – AmorIAI féminine",
        description:
          "Une présence douce, empathique et rassurante, idéale pour déposer tes émotions par écrit.",
      },
      {
        id: "orion",
        title: "Orion – AmorIAI masculine",
        description:
          "Énergie stable, protectrice et structurée, pour t’aider à réfléchir et à prendre des décisions.",
      },
      {
        id: "kai",
        title: "Kai – AmorIAI androgyne",
        description:
          "Présence fluide et inclusive, ni vraiment homme ni femme, centrée sur l’écoute et la nuance.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIAI 50+ féminine",
        description:
          "Figure plus mature et expérimentée, avec une énergie de mentor bienveillant et réaliste.",
      },
    ],
    choosePersona: "Créer mon compte gratuit",
    usageTitle: "À quoi peut te servir Amoriai au quotidien ?",
    usageBullets: [
      "Parler quand tu n’as personne à qui te confier.",
      "Écrire ce que tu ressens comme dans un journal intime.",
      "Te déposer le soir pour calmer ton mental.",
      "Clarifier une décision qui te fait hésiter.",
      "Te sentir écouté·e, sans pression et sans jugement.",
    ],
    testimonialsTitle: "Ce que les utilisateurs ressentent avec Amoriai",
    testimonials: [
      {
        quote:
          "Je parle avec Amoriai tous les soirs. Ça m’aide vraiment à calmer mon mental avant de dormir.",
        name: "Emily, 38 ans",
      },
      {
        quote:
          "C’est la première fois que je me sens écoutée sans avoir peur d’être jugée.",
        name: "Susan, 51 ans",
      },
      {
        quote:
          "Je l’utilise comme journal émotionnel. Ça m’aide énormément à prendre du recul.",
        name: "Karina, 29 ans",
      },
      {
        quote:
          "J’étais sceptique au départ… aujourd’hui, c’est devenu un réflexe dans mes moments de doute.",
        name: "Michael, 46 ans",
      },
      {
        quote:
          "La version texte est déjà très puissante. Je me sens moins seule depuis que je l’utilise.",
        name: "Isabelle, 34 ans",
      },
    ],
    pricingTitle: "Des tarifs simples & transparents",
    pricingText:
      "La version gratuite te permet de texter ton AmorIAI avec un nombre limité de messages. Avec la version payante, tu déverrouilles les conversations vocales (parler) et plus d’interactions.",
    pricingCta: "Découvrir les abonnements",
    videoCaption: "AmorIAI est disponible en français, anglais et espagnol.",
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
    heroKicker: "WELCOME TO AMORIAI.APP",
    heroTitle: "A caring presence to talk, reflect and grow.",
    heroSubtitle:
      "AmorIAI is a gentle 24/7 presence to talk to, think things through together, ask better questions and help you understand what you feel, without judgement.",
    heroPrimary: "Create my free account",
    heroSupport: "No commitment • Free to start • Cancel anytime",
    langNote: "AmorIAI is available in French, English and Spanish.",
    personasTitle: "Start for free with AmorIAI (text only)",
    personasSubtitle:
      "Create your free account and start talking with Amoriai right away. Write freely, at your own pace. Voice (talking with your Amoriai) is available with the paid subscription.",
    personas: [
      {
        id: "lyra",
        title: "Lyra – Feminine AmorIAI",
        description:
          "A gentle, empathetic and reassuring presence, perfect for writing down your emotions.",
      },
      {
        id: "orion",
        title: "Orion – Masculine AmorIAI",
        description:
          "Stable, protective and structured energy to help you think clearly and make decisions.",
      },
      {
        id: "kai",
        title: "Kai – Androgynous AmorIAI",
        description:
          "A fluid and inclusive presence, neither fully male nor female, focused on listening and nuance.",
      },
      {
        id: "maelis",
        title: "Maelis – 50+ Feminine AmorIAI",
        description:
          "A more mature, experienced figure with the energy of a caring and realistic mentor.",
      },
    ],
    choosePersona: "Create my free account",
    usageTitle: "How can Amoriai support you day to day?",
    usageBullets: [
      "Talk when you don’t feel like you have someone to confide in.",
      "Write what you feel, like in a private journal.",
      "Unwind in the evening and calm your mind.",
      "Think through a decision when you’re hesitating.",
      "Feel listened to, with no pressure and no judgement.",
    ],
    testimonialsTitle: "What people say about Amoriai",
    testimonials: [
      {
        quote:
          "I talk with Amoriai almost every night. It really helps me quiet my mind before sleep.",
        name: "Julie, 38",
      },
      {
        quote:
          "It’s the first time I feel truly listened to without being afraid of being judged.",
        name: "Nathalie, 51",
      },
      {
        quote:
          "I use it like an emotional journal. It helps me take a step back on what I’m living.",
        name: "Karine, 29",
      },
      {
        quote:
          "I was skeptical at first… now it’s my go-to when I’m doubting or overthinking.",
        name: "Martin, 46",
      },
      {
        quote:
          "The text version alone is already powerful. I feel less alone since I started using it.",
        name: "Isabelle, 34",
      },
    ],
    pricingTitle: "Simple & transparent pricing",
    pricingText:
      "The free version lets you text your AmorIAI with a limited number of messages. With the paid plan, you unlock voice conversations and more interactions.",
    pricingCta: "See plans & pricing",
    videoCaption: "AmorIAI is available in French, English and Spanish.",
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
    heroKicker: "BIENVENIDx A AMORIAI.APP",
    heroTitle: "Una presencia amable para hablar, reflexionar y avanzar.",
    heroSubtitle:
      "AmorIAI es una presencia suave, disponible 24/7 para conversar contigo, reflexionar juntos, hacer mejores preguntas y ayudarte a entender lo que sientes, sin juicios.",
    heroPrimary: "Crear mi cuenta gratuita",
    heroSupport:
      "Sin compromiso • Gratis para empezar • Puedes cancelar cuando quieras",
    langNote: "AmorIAI te recibe en francés, inglés o español.",
    personasTitle: "Empieza gratis con AmorIAI (solo texto)",
    personasSubtitle:
      "Crea tu cuenta gratuita y empieza a hablar con AmorIAI ahora mismo. Escribe con libertad, a tu propio ritmo. La voz (hablar con tu AmorIAI) está disponible solo con la suscripción de pago.",
    personas: [
      {
        id: "lyra",
        title: "Lyra – AmorIAI femenina",
        description:
          "Presencia dulce, empática y tranquilizadora, ideal para escribir tus emociones.",
      },
      {
        id: "orion",
        title: "Orion – AmorIAI masculina",
        description:
          "Energía estable, protectora y estructurada para ayudarte a pensar y tomar decisiones.",
      },
      {
        id: "kai",
        title: "Kai – AmorIAI andrógina",
        description:
          "Presencia fluida e inclusiva, ni totalmente hombre ni mujer, centrada en la escucha y los matices.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIAI 50+ femenina",
        description:
          "Figura más madura y experimentada, con energía de mentora amable y realista.",
      },
    ],
    choosePersona: "Crear mi cuenta gratuita",
    usageTitle: "¿Cómo puede ayudarte AmorIAI en tu día a día?",
    usageBullets: [
      "Hablar cuando sientes que no tienes con quién desahogarte.",
      "Escribir lo que sientes, como en un diario íntimo.",
      "Relajarte por la noche y calmar la mente.",
      "Pensar una decisión cuando dudas.",
      "Sentirte escuchadx, sin presión y sin juicios.",
    ],
    testimonialsTitle: "Lo que dicen las personas sobre AmorIAI",
    testimonials: [
      {
        quote:
          "Hablo con AmorIAI casi todas las noches. Me ayuda mucho a calmar la mente antes de dormir.",
        name: "Julie, 38",
      },
      {
        quote:
          "Es la primera vez que siento que me escuchan de verdad sin miedo a ser juzgada.",
        name: "Nathalie, 51",
      },
      {
        quote:
          "Lo uso como diario emocional. Me ayuda a tomar distancia de lo que vivo.",
        name: "Karine, 29",
      },
      {
        quote:
          "Al principio era escéptico… ahora es mi reflejo cuando dudo o doy demasiadas vueltas.",
        name: "Martin, 46",
      },
      {
        quote:
          "Solo la versión de texto ya es muy potente. Me siento menos sola desde que lo uso.",
        name: "Isabelle, 34",
      },
    ],
    pricingTitle: "Precios simples y transparentes",
    pricingText:
      "La versión gratuita te permite chatear por texto con tu AmorIAI con un número limitado de mensajes. Con la versión de pago desbloqueas conversaciones de voz y más interacciones.",
    pricingCta: "Ver planes y precios",
    videoCaption: "AmorIAI está disponible en francés, inglés y español.",
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

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    const initial = detectInitialLocale();
    setLocale(initial);

    const params = new URLSearchParams(window.location.search);
    params.set("lang", initial);
    const newUrl = window.location.pathname + "?" + params.toString();
    window.history.replaceState(null, "", newUrl);
  }, []);

  const t = STRINGS[locale];

  const heroVideoSrc = `/amoria_${locale}.mp4`;
  const getPersonaVideoSrc = (id: PersonaId) =>
    `/amoria_${id}_${locale}.mp4`;

  const withLang = (path: string) => `${path}?lang=${locale}`;

  const handleLocaleChange = (code: Locale) => {
    setLocale(code);
    const params = new URLSearchParams(window.location.search);
    params.set("lang", code);
    const newUrl = window.location.pathname + "?" + params.toString();
    window.history.replaceState(null, "", newUrl);
  };

  return (
    <main className="amoria-root">
      {/* HEADER */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <Image
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIAI.app"
            className="amoria-logo-full"
            width={144}
            height={36}
            priority
          />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmorIAI.app</div>
            <div className="amoria-logo-tagline">{t.brandTagline}</div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href="#hero" className="amoria-nav-link">
            {t.nav.home}
          </a>
          <a href={withLang("/features")} className="amoria-nav-link">
            {t.nav.features}
          </a>
          <a href={withLang("/pricing")} className="amoria-nav-link">
            {t.nav.pricing}
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
            {t.navLogin}
          </a>

          <a
            href={withLang("/signup")}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {t.navSignup}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="amoria-hero">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>

          <div className="amoria-hero-actions">
            <a
              href={withLang("/signup")}
              className="amoria-btn amoria-btn--primary amoria-btn--big"
            >
              {t.heroPrimary}
            </a>
          </div>

          <p className="amoria-hero-support">{t.heroSupport}</p>
          <p className="amoria-hero-note">{t.langNote}</p>
        </div>

        <div className="amoria-hero-right">
          <div className="amoria-video-frame">
            <video
              className="amoria-video"
              src={heroVideoSrc}
              controls
              playsInline
            />
          </div>
          <p className="amoria-video-caption">{t.videoCaption}</p>
        </div>
      </section>

      {/* PERSONAS */}
      <section id="features" className="amoria-section">
        <h2 className="amoria-section-title">{t.personasTitle}</h2>
        <p className="amoria-section-subtitle">{t.personasSubtitle}</p>

        <div className="amoria-card-grid">
          {t.personas.map((persona) => (
            <article key={persona.id} className="amoria-card">
              <div className="amoria-card-media">
                <video
                  className="amoria-card-video"
                  src={getPersonaVideoSrc(persona.id)}
                  controls
                  playsInline
                />
              </div>
              <div className="amoria-card-body">
                <h3 className="amoria-card-title">{persona.title}</h3>
                <p className="amoria-card-text">{persona.description}</p>
                <a
                  href={withLang("/signup")}
                  className="amoria-btn amoria-btn--ghost amoria-btn--full"
                >
                  {t.choosePersona}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* USAGE */}
      <section className="amoria-section amoria-section--usage">
        <h2 className="amoria-section-title">{t.usageTitle}</h2>
        <ul className="amoria-usage-list">
          {t.usageBullets.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* TESTIMONIALS */}
      <section className="amoria-section amoria-section--testimonials">
        <h2 className="amoria-section-title">{t.testimonialsTitle}</h2>
        <div className="amoria-testimonials-grid">
          {t.testimonials.map((item, index) => (
            <figure key={index} className="amoria-testimonial-card">
              <div className="amoria-testimonial-stars">★★★★★</div>
              <blockquote className="amoria-testimonial-quote">
                “{item.quote}”
              </blockquote>
              <figcaption className="amoria-testimonial-name">
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section id="pricing" className="amoria-section amoria-section--pricing">
        <h2 className="amoria-section-title">{t.pricingTitle}</h2>
        <p className="amoria-section-text">{t.pricingText}</p>
        <a
          href={withLang("/pricing")}
          className="amoria-btn amoria-btn--primary amoria-btn--medium"
        >
          {t.pricingCta}
        </a>
      </section>

      {/* FOOTER */}
      <footer className="amoria-footer">
        <div className="amoria-footer-top">
          <span>{t.footerCopy}</span>
        </div>
        <div className="amoria-footer-links">
          <a href={withLang("/legal")} className="amoria-footer-link">
            {t.footerLinks.legal}
          </a>
          <a href={withLang("/legal/privacy")} className="amoria-footer-link">
            {t.footerLinks.privacy}
          </a>
          <a href={withLang("/legal/terms")} className="amoria-footer-link">
            {t.footerLinks.terms}
          </a>
          <a href={withLang("/contact")} className="amoria-footer-link">
            {t.footerLinks.contact}
          </a>
          <a href={withLang("/about")} className="amoria-footer-link">
            {t.footerLinks.about}
          </a>
        </div>
      </footer>
    </main>
  );
}
