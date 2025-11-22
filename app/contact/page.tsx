"use client";

import React from "react";

type Locale = "fr" | "en" | "es";

type ContactCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  labelEmail: string;
  labelFormTitle: string;
  labelName: string;
  labelUserEmail: string;
  labelSubject: string;
  labelMessage: string;
  labelRequired: string;
  placeholderName: string;
  placeholderSubject: string;
  placeholderMessage: string;
  sendButton: string;
  supportTitle: string;
  supportText: string;
};

const CONTACT_STRINGS: Record<Locale, ContactCopy> = {
  fr: {
    heroKicker: "CONTACT AMORIA.APP",
    heroTitle: "On reste joignable, même si ton AmorIA est là 24/7.",
    heroSubtitle:
      "Une question sur ton compte, la facturation ou un bug ? Écris-nous, on te répond dès que possible.",
    labelEmail: "Courriel de support",
    labelFormTitle: "Écris-nous directement",
    labelName: "Nom",
    labelUserEmail: "Adresse courriel",
    labelSubject: "Sujet",
    labelMessage: "Message",
    labelRequired: "Champs obligatoires",
    placeholderName: "Ton prénom ou ton nom",
    placeholderSubject: "Ex. : Question sur mon abonnement",
    placeholderMessage: "Explique-nous ce qu’on peut faire pour toi…",
    sendButton: "Envoyer mon message",
    supportTitle: "Support & partenariat",
    supportText:
      "Pour tout ce qui touche au support technique, à la facturation ou aux partenariats, utilise l’adresse ci-dessous. Merci d’inclure l’adresse courriel liée à ton compte AmoriA.",
  },
  en: {
    heroKicker: "CONTACT AMORIA.APP",
    heroTitle: "We’re reachable, even if your AmorIA is here 24/7.",
    heroSubtitle:
      "Questions about your account, billing or a bug? Send us a message and we’ll get back to you as soon as we can.",
    labelEmail: "Support email",
    labelFormTitle: "Write to us",
    labelName: "Name",
    labelUserEmail: "Email address",
    labelSubject: "Subject",
    labelMessage: "Message",
    labelRequired: "Required fields",
    placeholderName: "Your first name or full name",
    placeholderSubject: "Ex: Question about my subscription",
    placeholderMessage: "Tell us how we can help...",
    sendButton: "Send my message",
    supportTitle: "Support & partnerships",
    supportText:
      "For anything related to technical support, billing or partnerships, use the email below. Please include the email associated with your AmoriA account.",
  },
  es: {
    heroKicker: "CONTACTO AMORIA.APP",
    heroTitle: "Estamos disponibles, aunque tu AmorIA esté 24/7.",
    heroSubtitle:
      "¿Dudas sobre tu cuenta, pagos o algún bug? Escríbenos y te responderemos lo antes posible.",
    labelEmail: "Correo de soporte",
    labelFormTitle: "Escríbenos",
    labelName: "Nombre",
    labelUserEmail: "Correo electrónico",
    labelSubject: "Asunto",
    labelMessage: "Mensaje",
    labelRequired: "Campos obligatorios",
    placeholderName: "Tu nombre o nombre completo",
    placeholderSubject: "Ej.: Pregunta sobre mi suscripción",
    placeholderMessage: "Cuéntanos en qué podemos ayudarte…",
    sendButton: "Enviar mi mensaje",
    supportTitle: "Soporte y colaboraciones",
    supportText:
      "Para soporte técnico, pagos o colaboraciones, utiliza el correo de abajo. Añade el correo asociado a tu cuenta de AmoriA.",
  },
};

// Helper: récupérer la langue depuis ?lang=fr|en|es
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

export default function ContactPage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = CONTACT_STRINGS[locale];

  const buildHomeUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/?${params.toString()}`;
  };

  const buildFeaturesUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/features?${params.toString()}`;
  };

  const buildPricingUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/pricing?${params.toString()}`;
  };

  const buildLoginUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/login?${params.toString()}`;
  };

  const buildSignupUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/signup?${params.toString()}`;
  };

  return (
    <main className="amoria-root">
      {/* HEADER – même look/logo que la vitrine */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          {/* Logo complet transparent */}
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
          <a href={buildHomeUrl()} className="amoria-nav-link">
            {locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "Inicio"}
          </a>
          <a href={buildFeaturesUrl()} className="amoria-nav-link">
            {locale === "fr"
              ? "Fonctionnalités"
              : locale === "en"
              ? "Features"
              : "Funciones"}
          </a>
          <a href={buildPricingUrl()} className="amoria-nav-link">
            {locale === "fr"
              ? "Tarifs"
              : locale === "en"
              ? "Pricing"
              : "Precios"}
          </a>
        </nav>

        <div className="amoria-nav-right">
          <a
            href={buildLoginUrl()}
            className="amoria-nav-btn amoria-nav-btn--ghost"
          >
            {locale === "fr"
              ? "Me connecter"
              : locale === "en"
              ? "Log in"
              : "Iniciar sesión"}
          </a>
          <a
            href={buildSignupUrl()}
            className="amoria-nav-btn amoria-nav-btn--primary"
          >
            {locale === "fr"
              ? "Créer mon compte gratuit"
              : locale === "en"
              ? "Create my free account"
              : "Crear mi cuenta gratuita"}
          </a>
        </div>
      </header>

      {/* HERO CONTACT */}
      <section className="amoria-hero amoria-hero--pricing">
        <div className="amoria-hero-left">
          <p className="amoria-hero-kicker">{t.heroKicker}</p>
          <h1 className="amoria-hero-title">{t.heroTitle}</h1>
          <p className="amoria-hero-subtitle">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* BLOC SUPPORT + FORMULAIRE (visuel, à brancher plus tard) */}
      <section className="amoria-section amoria-section--contact">
        <div className="amoria-contact-grid">
          {/* Bloc support / email direct */}
          <div className="amoria-contact-card">
            <h2 className="amoria-section-title">{t.supportTitle}</h2>
            <p className="amoria-section-subtitle">{t.supportText}</p>

            <div className="amoria-contact-email-block">
              <span className="amoria-contact-email-label">
                {t.labelEmail}
              </span>
              <a
                href="mailto:contactamoriai@gmail.com"
                className="amoria-contact-email"
              >
                contactamoriai@gmail.com
              </a>
            </div>

            <p className="amoria-contact-hint">
              {locale === "fr"
                ? "Astuce : ajoute des captures d’écran quand tu signales un bug, ça nous aide à corriger plus vite."
                : locale === "en"
                ? "Tip: add screenshots when you report a bug, it helps us fix things faster."
                : "Tip: añade capturas de pantalla cuando informes de un error, nos ayuda a corregirlo más rápido."}
            </p>
          </div>

          {/* Bloc formulaire (front seulement) */}
          <div className="amoria-contact-card amoria-contact-card--form">
            <h2 className="amoria-section-title">{t.labelFormTitle}</h2>
            <p className="amoria-contact-required">{t.labelRequired}</p>

            <form
              className="amoria-contact-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="amoria-form-row">
                <label className="amoria-form-label">
                  {t.labelName} *
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={t.placeholderName}
                    className="amoria-form-input"
                  />
                </label>
              </div>

              <div className="amoria-form-row">
                <label className="amoria-form-label">
                  {t.labelUserEmail} *
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@email.com"
                    className="amoria-form-input"
                  />
                </label>
              </div>

              <div className="amoria-form-row">
                <label className="amoria-form-label">
                  {t.labelSubject} *
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder={t.placeholderSubject}
                    className="amoria-form-input"
                  />
                </label>
              </div>

              <div className="amoria-form-row">
                <label className="amoria-form-label">
                  {t.labelMessage} *
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder={t.placeholderMessage}
                    className="amoria-form-textarea"
                  />
                </label>
              </div>

              <button type="submit" className="amoria-btn amoria-btn--primary">
                {t.sendButton}
              </button>
            </form>
          </div>
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

      {/* STYLES (même base que vitrine/pricing, avec le bon logo) */}
      <style jsx global>{`
        :root {
          --amoria-bg: #020617;
          --amoria-bg-elevated: #02081f;
          --amoria-border-subtle: rgba(148, 163, 184, 0.35);
          --amoria-text-main: #e5e7eb;
          --amoria-text-muted: #9ca3af;
          --amoria-accent: #fb37ff;
          --amoria-accent-2: #ff6b9c;
          --amoria-accent-soft: rgba(251, 55, 255, 0.12);
        }

        body {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          background: radial-gradient(
            circle at top,
            #020617 0,
            #020617 40%,
            #000 100%
          );
          color: var(--amoria-text-main);
        }

        .amoria-root {
          min-height: 100vh;
          background: radial-gradient(
            circle at top left,
            #111827 0,
            #020617 55%,
            #000 100%
          );
          color: var(--amoria-text-main);
          padding-bottom: 3rem;
        }

        /* HEADER (comme la vitrine) */
        .amoria-header {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(16px);
          background: linear-gradient(
            to bottom,
            rgba(15, 23, 42, 0.92),
            rgba(15, 23, 42, 0.75),
            transparent
          );
        }

        .amoria-header-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        /* Logo complet */
        .amoria-logo-full {
          height: 40px;
          width: auto;
          object-fit: contain;
        }

        .amoria-logo-text {
          display: flex;
          flex-direction: column;
        }

        .amoria-logo-title {
          font-weight: 600;
          font-size: 0.96rem;
        }

        .amoria-logo-tagline {
          font-size: 0.72rem;
          color: var(--amoria-text-muted);
        }

        .amoria-nav {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .amoria-nav-link {
          font-size: 0.82rem;
          color: var(--amoria-text-muted);
          text-decoration: none;
          padding-bottom: 0.1rem;
          border-bottom: 1px solid transparent;
        }

        .amoria-nav-link:hover {
          color: #f9fafb;
          border-color: rgba(148, 163, 184, 0.7);
        }

        .amoria-nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .amoria-nav-btn {
          border-radius: 999px;
          padding: 0.4rem 0.9rem;
          font-size: 0.78rem;
          border: 1px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-nav-btn--primary {
          background: linear-gradient(
            135deg,
            var(--amoria-accent),
            var(--amoria-accent-2)
          );
          color: #f9fafb;
        }

        .amoria-nav-btn--ghost {
          background: transparent;
          border-color: rgba(148, 163, 184, 0.5);
          color: var(--amoria-text-main);
        }

        /* HERO */
        .amoria-hero {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0.5rem;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr);
          gap: 1.5rem;
        }

        .amoria-hero-left {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .amoria-hero-kicker {
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a5b4fc;
        }

        .amoria-hero-title {
          font-size: clamp(1.9rem, 3vw, 2.3rem);
          line-height: 1.1;
          font-weight: 700;
        }

        .amoria-hero-subtitle {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--amoria-text-muted);
          max-width: 38rem;
        }

        /* SECTIONS */
        .amoria-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-section-title {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .amoria-section-subtitle {
          font-size: 0.9rem;
          color: var(--amoria-text-muted);
          max-width: 40rem;
          margin-bottom: 1.4rem;
        }

        /* CONTACT GRID */
        .amoria-contact-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 1.5rem;
          align-items: flex-start;
        }

        .amoria-contact-card {
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border-radius: 1.4rem;
          border: 1px solid var(--amoria-border-subtle);
          padding: 1.3rem 1.2rem 1.4rem;
        }

        .amoria-contact-card--form {
          background: rgba(15, 23, 42, 0.9);
        }

        .amoria-contact-email-block {
          margin-top: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .amoria-contact-email-label {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        .amoria-contact-email {
          font-size: 0.9rem;
          text-decoration: none;
          color: #e5e7eb;
          font-weight: 500;
        }

        .amoria-contact-email:hover {
          text-decoration: underline;
        }

        .amoria-contact-hint {
          margin-top: 0.9rem;
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
        }

        .amoria-contact-required {
          font-size: 0.8rem;
          color: var(--amoria-text-muted);
          margin-bottom: 0.8rem;
        }

        .amoria-contact-form {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .amoria-form-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .amoria-form-label {
          font-size: 0.8rem;
          color: var(--amoria-text-main);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .amoria-form-input,
        .amoria-form-textarea {
          border-radius: 0.75rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: rgba(15, 23, 42, 0.9);
          color: var(--amoria-text-main);
          font-size: 0.85rem;
          padding: 0.55rem 0.7rem;
          outline: none;
        }

        .amoria-form-input:focus,
        .amoria-form-textarea:focus {
          border-color: #a5b4fc;
          box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.6);
        }

        .amoria-form-textarea {
          resize: vertical;
        }

        /* BUTTONS */
        .amoria-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          font-size: 0.86rem;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-btn--primary {
          padding: 0.7rem 1.3rem;
          background: linear-gradient(
            135deg,
            var(--amoria-accent),
            var(--amoria-accent-2)
          );
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        /* FOOTER */
        .amoria-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          text-align: center;
        }

        /* RESPONSIVE */
        @media (max-width: 960px) {
          .amoria-header {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.6rem 1rem;
          }

          .amoria-nav {
            display: none;
          }

          .amoria-hero,
          .amoria-section {
            padding-inline: 1rem;
          }

          .amoria-contact-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 640px) {
          .amoria-nav-right a.amoria-nav-btn--ghost {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
