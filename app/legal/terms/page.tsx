"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type Section = {
  title: string;
  paragraphs: string[];
};

type TermsCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  updatedLabel: string;
  updatedDate: string;
  sections: Section[];
};

const TERMS_STRINGS: Record<Locale, TermsCopy> = {
  /* ——— TON GROS OBJET TERMS_STRINGS EXACTEMENT COMME TU L’AS COLLÉ ——— */
};

function getLocaleFromSearchParams(
  searchParams: { [key: string]: string | string[] | undefined }
): Locale {
  const raw = searchParams["lang"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "en" || value === "es" || value === "fr") return value;
  return "fr";
}

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function TermsPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = TERMS_STRINGS[locale];

  const buildUrl = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `${path}?${params.toString()}`;
  };

  const navHome =
    locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "Inicio";
  const navFeatures =
    locale === "fr"
      ? "Fonctionnalités"
      : locale === "en"
      ? "Features"
      : "Funciones";
  const navPricing =
    locale === "fr" ? "Tarifs" : locale === "en" ? "Pricing" : "Precios";
  const loginLabel =
    locale === "fr"
      ? "Me connecter"
      : locale === "en"
      ? "Log in"
      : "Iniciar sesión";
  const signupLabel =
    locale === "fr"
      ? "Créer mon compte gratuit"
      : locale === "en"
      ? "Create my free account"
      : "Crear mi cuenta gratuita";

  return (
    <main className="amoria-root">
      {/* HEADER */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIA.app"
            className="amoria-logo-full"
          />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmorIA.app</div>
            <div className="amoria-logo-tagline">
              Partenaire IA bienveillante • FR / EN / ES
            </div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={buildUrl("/")} className="amoria-nav-link">
            {navHome}
          </a>
          <a href={buildUrl("/features")} className="amoria-nav-link">
            {navFeatures}
          </a>
          <a href={buildUrl("/pricing")} className="amoria-nav-link">
            {navPricing}
          </a>
          <span className="amoria-nav-link amoria-nav-link--active">
            {locale === "fr"
              ? "Conditions"
              : locale === "en"
              ? "Terms"
              : "Términos"}
          </span>
        </nav>

        <div className="amoria-nav-right">
          <a
            href={buildUrl("/login")}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {loginLabel}
          </a>
          <a
            href={buildUrl("/signup")}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {signupLabel}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="amoria-hero amoria-hero--legal">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>
          <p className="amoria-hero-updated">
            {t.updatedLabel} {t.updatedDate}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="amoria-section amoria-section--legal">
        <div className="amoria-legal-grid">
          {t.sections.map((section, idx) => (
            <article key={idx} className="amoria-legal-block">
              <h2 className="amoria-legal-title">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="amoria-legal-text">
                  {p}
                </p>
              ))}
            </article>
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

      {/* même bloc <style jsx global> que les deux autres */}
    </main>
  );
}
