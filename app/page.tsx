"use client";

import React, { useEffect, useState } from "react";
import fr from "../locales/fr.json";
import en from "../locales/en.json";
import es from "../locales/es.json";

type Locale = "fr" | "en" | "es";

const translations = {
  fr,
  en,
  es,
} as const;

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("fr");

  // Récupérer la langue mémorisée
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("amorai-locale") as Locale | null;
      if (stored && ["fr", "en", "es"].includes(stored)) {
        setLocale(stored);
      }
    }
  }, []);

  // Sauver la langue choisie
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("amorai-locale", locale);
    }
  }, [locale]);

  const t = translations[locale];

  const personas = [
    {
      key: "analytique",
      image: "/amoria-analyste.png",
    },
    {
      key: "artiste",
      image: "/amoria-artiste.png",
    },
    {
      key: "lumineuse",
      image: "/amoria-blonde.png",
    },
    {
      key: "intuitive",
      image: "/amoria-rousse.png",
    },
  ] as const;

  const videoSrc = `/amoria_${locale}.mp4`;

  return (
    <>
      <div className="page">
        {/* Barre du haut */}
        <header className="header">
          <div className="brand">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmorIA"
              className="logo"
            />
            <div>
              <div className="brand-name">AmorIA.app</div>
              <div className="brand-tagline">Compagne IA bienveillante</div>
            </div>
          </div>

          <nav className="nav">
            <button className="nav-link">Accueil</button>
            <button className="nav-link">Fonctionnalités</button>
            <button className="nav-link">Tarifs</button>
          </nav>

          <div className="lang-switch">
            <button
              className={`lang-btn ${locale === "fr" ? "lang-btn-active" : ""}`}
              onClick={() => setLocale("fr")}
            >
              FR
            </button>
            <button
              className={`lang-btn ${locale === "en" ? "lang-btn-active" : ""}`}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <button
              className={`lang-btn ${locale === "es" ? "lang-btn-active" : ""}`}
              onClick={() => setLocale("es")}
            >
              ES
            </button>
          </div>
        </header>

        {/* Hero */}
        <main className="main">
          <section className="hero">
            <div className="hero-text">
              <p className="hero-eyebrow">
                {locale === "fr" && "BIENVENUE SUR AMORIA.APP"}
                {locale === "en" && "WELCOME TO AMORIA.APP"}
                {locale === "es" && "BIENVENID@ A AMORIA.APP"}
              </p>
              <h1 className="hero-title">{t.hero_title}</h1>
              <p className="hero-subtitle">{t.hero_subtitle}</p>

              <div className="hero-actions">
                <button className="btn-primary">{t.hero_cta1}</button>
                <button className="btn-secondary">{t.hero_cta2}</button>
              </div>

              <p className="hero-note">
                {locale === "fr" &&
                  "Optimisée pour les échanges profonds, les journaux émotionnels et le coaching doux du quotidien."}
                {locale === "en" &&
                  "Optimized for deep conversations, emotional journaling, and gentle everyday support."}
                {locale === "es" &&
                  "Optimizada para conversaciones profundas, diarios emocionales y apoyo suave en el día a día."}
              </p>
            </div>

            <div className="hero-media">
              {/* Vidéo d’accueil qui change selon la langue */}
              <div className="video-frame">
                <video
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="video"
                />
              </div>
              <p className="video-caption">
                {locale === "fr" &&
                  "AmorIA vous accueille en français, anglais et espagnol."}
                {locale === "en" &&
                  "AmorIA welcomes you in French, English and Spanish."}
                {locale === "es" &&
                  "AmorIA te da la bienvenida en francés, inglés y español."}
              </p>
            </div>
          </section>

          {/* Cartes des IA */}
          <section className="personas">
            <h2 className="personas-title">{t.section_title}</h2>

            <div className="personas-grid">
              {personas.map((p) => {
                const titleKey = `${p.key}_title` as
                  | "analytique_title"
                  | "artiste_title"
                  | "lumineuse_title"
                  | "intuitive_title";
                const descKey = `${p.key}_desc` as
                  | "analytique_desc"
                  | "artiste_desc"
                  | "lumineuse_desc"
                  | "intuitive_desc";

                return (
                  <article key={p.key} className="persona-card">
                    <img
                      src={p.image}
                      alt={t[titleKey as keyof typeof t] as string}
                      className="persona-image"
                    />
                    <h3 className="persona-name">
                      {t[titleKey as keyof typeof t] as string}
                    </h3>
                    <p className="persona-desc">
                      {t[descKey as keyof typeof t] as string}
                    </p>
                    <button className="persona-btn">
                      {t.button_choose}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        </main>

        <footer className="footer">
          <span>© 2025 AmorIA.app</span>
          <span className="footer-heart">
            {locale === "fr" && "Créé avec bienveillance au Québec 🖤"}
            {locale === "en" && "Created with care in Québec 🖤"}
            {locale === "es" && "Creado con cariño en Quebec 🖤"}
          </span>
        </footer>
      </div>

      {/* Styles locaux */}
      <style jsx>{`
        :global(body) {
          margin: 0;
          background: radial-gradient(circle at top, #111827, #020617);
        }

        .page {
          min-height: 100vh;
          color: #f9fafb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
          padding: 24px 32px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .brand-name {
          font-weight: 600;
          font-size: 16px;
        }

        .brand-tagline {
          font-size: 12px;
          color: #9ca3af;
        }

        .nav {
          display: flex;
          gap: 16px;
          flex: 1;
          justify-content: center;
        }

        .nav-link {
          background: transparent;
          border: none;
          color: #e5e7eb;
          font-size: 14px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .nav-link:hover {
          color: #ffffff;
        }

        .lang-switch {
          display: flex;
          gap: 6px;
        }

        .lang-btn {
          border-radius: 999px;
          border: 1px solid #4b5563;
          background: #020617;
          color: #e5e7eb;
          font-size: 12px;
          padding: 4px 8px;
          cursor: pointer;
        }

        .lang-btn-active {
          background: linear-gradient(90deg, #fb923c, #ec4899);
          border-color: transparent;
          color: white;
        }

        .main {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 32px;
          align-items: center;
        }

        .hero-text {
          max-width: 560px;
        }

        .hero-eyebrow {
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 8px;
        }

        .hero-title {
          font-size: 32px;
          line-height: 1.1;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .hero-subtitle {
          font-size: 14px;
          color: #d1d5db;
          margin: 0 0 20px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 10px;
        }

        .btn-primary {
          border-radius: 999px;
          border: none;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: linear-gradient(90deg, #fb923c, #ec4899);
          color: white;
        }

        .btn-secondary {
          border-radius: 999px;
          border: 1px solid #4b5563;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #e5e7eb;
        }

        .btn-secondary:hover {
          border-color: #9ca3af;
        }

        .hero-note {
          font-size: 12px;
          color: #9ca3af;
        }

        .hero-media {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .video-frame {
          width: 100%;
          border-radius: 18px;
          padding: 6px;
          background: radial-gradient(circle at top left, #fb923c, #0f172a);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
        }

        .video {
          width: 100%;
          border-radius: 12px;
          display: block;
        }

        .video-caption {
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
        }

        .personas {
          padding-top: 8px;
          border-top: 1px solid rgba(148, 163, 184, 0.3);
        }

        .personas-title {
          font-size: 18px;
          margin-bottom: 18px;
        }

        .personas-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .persona-card {
          background: radial-gradient(circle at top, #0b1120, #020617);
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(55, 65, 81, 0.8);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .persona-image {
          width: 100%;
          border-radius: 14px;
          height: 160px;
          object-fit: cover;
        }

        .persona-name {
          font-size: 15px;
          font-weight: 600;
          margin: 2px 0;
        }

        .persona-desc {
          font-size: 13px;
          color: #d1d5db;
          flex: 1;
        }

        .persona-btn {
          margin-top: 4px;
          border-radius: 999px;
          border: 1px solid #4b5563;
          background: #020617;
          color: #e5e7eb;
          font-size: 13px;
          padding: 8px 10px;
          cursor: pointer;
        }

        .persona-btn:hover {
          border-color: #9ca3af;
        }

        .footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid rgba(55, 65, 81, 0.8);
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #9ca3af;
        }

        .footer-heart {
          text-align: right;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .page {
            padding: 16px 16px 28px;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
          }

          .nav {
            justify-content: flex-start;
          }

          .hero {
            grid-template-columns: minmax(0, 1fr);
          }

          .personas-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .personas-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </>
  );
}
