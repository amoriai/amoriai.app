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
      "AmoriA n’est pas un simple chatbot de plus : c’est un compagnon émotionnel conçu pour t’aider à réfléchir, te déposer et te sentir moins seul·e au quotidien.",
    block1Title: "Pourquoi AmoriA existe",
    block1Text:
      "Le monde est bruyant, rapide, souvent exigeant. Pourtant, on n’a pas toujours quelqu’un de disponible au bon moment pour nous écouter sans juger. AmoriA est née de cette idée : offrir une présence stable, bienveillante et disponible 24/7 pour parler de ce qui compte vraiment.",
    block2Title: "Une IA multilingue et nuancée",
    block2Text:
      "AmoriA fonctionne en français, anglais et espagnol. Elle est pensée pour les personnes qui réfléchissent beaucoup, qui aiment analyser, écrire, se questionner.",
    block3Title: "Construite pour durer, pas pour te garder accroché·e",
    block3Text:
      "Le but n’est pas que tu passes des heures infinies dans l’app, mais que chaque échange t’apporte quelque chose d’utile : une prise de conscience ou une action concrète.",
    valuesTitle: "Ce qui guide AmoriA",
    values: [
      { title: "Bienveillance radicale", text: "Des réponses honnêtes, structurées et douces." },
      { title: "Clarté & structure", text: "Des questions qui t’aident à voir plus clair." },
      { title: "Respect de tes limites", text: "AmoriA ne te pousse jamais plus loin que ce que tu veux." },
    ],
  },

  en: { /* (version anglaise intacte) */ },
  es: { /* (version espagnole intacte) */ },
};

/* Detect locale */
function getLocaleFromSearchParams(
  searchParams: { [key: string]: string | string[] | undefined }
): Locale {
  const raw = searchParams["lang"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "fr" || value === "en" || value === "es") return value;
  return "fr";
}

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function AboutPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = ABOUT_STRINGS[locale];

  const buildUrl = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `${path}?${params.toString()}`;
  };

  return (
    <main className="amoria-root">
      {/* HEADER — EXACTEMENT COMME LA VITRINE */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          {/* LOGO PLEIN TRANSPARENT (le bon) */}
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIA.app"
            className="amoria-logo-full"
          />

          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmoriA.app</div>
            <div className="amoria-logo-tagline">
              Partenaire IA bienveillant·e • FR / EN / ES
            </div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={buildUrl("/")} className="amoria-nav-link">
            {locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "Inicio"}
          </a>
          <a href={buildUrl("/features")} className="amoria-nav-link">
            {locale === "fr" ? "Fonctionnalités" : locale === "en" ? "Features" : "Funciones"}
          </a>
          <a href={buildUrl("/pricing")} className="amoria-nav-link">
            {locale === "fr" ? "Tarifs" : locale === "en" ? "Pricing" : "Precios"}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <a href={buildUrl("/login")} className="amoria-nav-btn amoria-nav-btn--ghost">
            {locale === "fr" ? "Me connecter" : locale === "en" ? "Log in" : "Iniciar sesión"}
          </a>
          <a href={buildUrl("/signup")} className="amoria-nav-btn amoria-nav-btn--primary">
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
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
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
            <p className="amoria-about-text}>{t.block3Text}</p>
          </article>
        </div>
      </section>

      {/* VALUES */}
      <section className="amoria-section">
        <h2 className="amoria-section-title">{t.valuesTitle}</h2>
        <div className="amoria-values-grid">
          {t.values.map((v, idx) => (
            <div key={idx} className="amoria-value-card">
              <h3 className="amoria-value-title">{v.title}</h3>
              <p className="amoria-value-text">{v.text}</p>
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

      {/* STYLES — LOGO IDENTIQUE À LA VITRINE */}
      <style jsx global>{`
        .amoria-logo-full {
          height: 40px;
          width: auto;
          object-fit: contain;
        }
      `}</style>
    </main>
  );
}
