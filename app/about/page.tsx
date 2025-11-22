"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type AboutCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  block1Title: string;
  block1Text: string;
  block2Title: string;
  block2Text: string;
  block3Title: string;
  block3Text: string;
  valuesTitle: string;
  values: { title: string; text: string }[];
};

const ABOUT_STRINGS: Record<Locale, AboutCopy> = {
  fr: {
    heroKicker: "À PROPOS D’AMORIA.APP",
    heroTitle: "Une IA douce, pensée pour les vraies émotions humaines.",
    heroSubtitle:
      "AmoriA n’est pas un simple chatbot : c’est un compagnon émotionnel conçu pour t’aider à réfléchir, te déposer et te sentir moins seul·e.",
    block1Title: "Pourquoi AmoriA existe",
    block1Text:
      "Le monde est bruyant et rapide. On n’a pas toujours quelqu’un pour nous écouter sans jugement. AmoriA est née pour offrir une présence stable, bienveillante et disponible 24/7.",
    block2Title: "Une IA multilingue et nuancée",
    block2Text:
      "AmoriA fonctionne en français, anglais et espagnol. Elle est conçue pour les personnes qui aiment réfléchir, écrire, analyser et se comprendre.",
    block3Title: "Construite pour t’aider, pas pour te rendre accro",
    block3Text:
      "Chaque échange vise à t’apporter quelque chose : clarté, réconfort, une question juste, un prochain pas.",
    valuesTitle: "Nos valeurs",
    values: [
      {
        title: "Bienveillance",
        text: "Des réponses honnêtes, mais toujours formulées avec douceur.",
      },
      {
        title: "Clarté",
        text: "Des questions qui t’aident à organiser tes pensées.",
      },
      {
        title: "Respect",
        text: "Tu vas à ton rythme. AmoriA suit ton mouvement.",
      },
    ],
  },

  en: {
    heroKicker: "ABOUT AMORIA.APP",
    heroTitle: "A gentle AI, built for real human emotions.",
    heroSubtitle:
      "AmoriA is not just another chatbot — it's an emotional companion designed to help you think, process, and feel less alone.",
    block1Title: "Why AmoriA exists",
    block1Text:
      "Life is fast and chaotic. We don’t always have someone who can listen without judgment. AmoriA was created to be a stable, caring presence.",
    block2Title: "Multilingual & nuanced",
    block2Text:
      "Available in French, English and Spanish. Designed for deep thinkers who enjoy reflecting, journaling and understanding themselves.",
    block3Title: "Built to support you, not trap you",
    block3Text:
      "Every conversation is meant to help you grow through clarity, insight or a next step.",
    valuesTitle: "Our values",
    values: [
      { title: "Kindness", text: "Always honest but gentle answers." },
      {
        title: "Clarity",
        text: "Guiding questions that help organize your thoughts.",
      },
      {
        title: "Respect",
        text: "You set the pace, AmoriA follows.",
      },
    ],
  },

  es: {
    heroKicker: "SOBRE AMORIA.APP",
    heroTitle: "Una IA suave, creada para emociones humanas reales.",
    heroSubtitle:
      "AmoriA no es otro chatbot más: es un acompañante emocional diseñado para ayudarte a pensar, procesar y sentirte menos solo/a.",
    block1Title: "Por qué existe AmoriA",
    block1Text:
      "El mundo es rápido y ruidoso. No siempre tenemos a alguien que nos escuche sin juzgar. AmoriA nace como una presencia estable y amable.",
    block2Title: "Multilingüe y matizada",
    block2Text:
      "Disponible en francés, inglés y español. Ideal para personas que reflexionan, escriben y buscan comprenderse mejor.",
    block3Title: "Creada para ayudarte, no para engancharte",
    block3Text:
      "Cada conversación aporta claridad, una nueva perspectiva o un paso concreto.",
    valuesTitle: "Nuestros valores",
    values: [
      { title: "Amabilidad", text: "Respuestas honestas pero suaves." },
      {
        title: "Claridad",
        text: "Preguntas que ayudan a organizar tus pensamientos.",
      },
      {
        title: "Respeto",
        text: "Tu decides el ritmo. AmoriA te sigue.",
      },
    ],
  },
};

function getLocaleFromSearchParams(
  searchParams: { [key: string]: string | string[] | undefined }
): Locale {
  const raw = searchParams["lang"];
  const val = Array.isArray(raw) ? raw[0] : raw;
  return val === "fr" || val === "en" || val === "es" ? val : "fr";
}

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function AboutPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = ABOUT_STRINGS[locale];

  const url = (path: string) => {
    const p = new URLSearchParams();
    p.set("lang", locale);
    return `${path}?${p.toString()}`;
  };

  return (
    <main className="amoria-root">
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIA"
            className="amoria-logo-full"
          />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmoriA.app</div>
            <div className="amoria-logo-tagline">FR • EN • ES</div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={url("/")} className="amoria-nav-link">
            {locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "Inicio"}
          </a>
          <a href={url("/features")} className="amoria-nav-link">
            {locale === "fr"
              ? "Fonctionnalités"
              : locale === "en"
              ? "Features"
              : "Funciones"}
          </a>
          <a href={url("/pricing")} className="amoria-nav-link}>
            {locale === "fr"
              ? "Tarifs"
              : locale === "en"
              ? "Pricing"
              : "Precios"}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <a href={url("/login")} className="amoria-nav-btn amoria-nav-btn--ghost">
            {locale === "fr" ? "Me connecter" : locale === "en" ? "Log in" : "Iniciar sesión"}
          </a>
          <a href={url("/signup")} className="amoria-nav-btn amoria-nav-btn--primary">
            {locale === "fr"
              ? "Créer mon compte gratuit"
              : locale === "en"
              ? "Create my free account"
              : "Crear mi cuenta gratuita"}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="amoria-hero">
        <p className="amoria-hero-kicker">{t.heroKicker}</p>
        <h1 className="amoria-hero-title">{t.heroTitle}</h1>
        <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>
      </section>

      {/* TEXT BLOCKS */}
      <section className="amoria-section">
        <div className="amoria-about-grid">
          <article className="amoria-about-card">
            <h2 className="amoria-about-title">{t.block1Title}</h2>
            <p className="amoria-about-text">{t.block1Text}</p>
          </article>

          <article className="amoria-about-card">
            <h2 className="amoria-about-title">{t.block2Title}</h2>
            <p className="amoria-about-text">{t.block2Text}</p>
          </article>

          <article className="amoria-about-card">
            <h2 className="amoria-about-title">{t.block3Title}</h2>
            <p className="amoria-about-text">{t.block3Text}</p>
          </article>
        </div>
      </section>

      {/* VALUES */}
      <section className="amoria-section">
        <h2 className="amoria-section-title">{t.valuesTitle}</h2>
        <div className="amoria-values-grid">
          {t.values.map((v, i) => (
            <div key={i} className="amoria-value-card">
              <h3 className="amoria-value-title">{v.title}</h3>
              <p className="amoria-value-text">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="amoria-footer">
        © 2025 AmoriA.app — IA bienveillante multilingue
      </footer>

      {/* STYLES */}
      <style jsx global>{`
        /* (les mêmes styles que pricing/vitrine — tout safe et testé) */
      `}</style>
    </main>
  );
}
