"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    withGoogle: string;
    withApple: string;
    or: string;
    emailLabel: string;
    passwordLabel: string;
    submit: string;
    already: string;
    loginLink: string;
    fakeAlert: string;
  }
> = {
  fr: {
    title: "Créer mon compte gratuit",
    subtitle:
      "Crée ton compte gratuitement et commence à texter avec l’IA de ton choix. La voix (parler avec ton AmorIA) est disponible uniquement avec l’abonnement payant.",
    withGoogle: "Continuer avec Google",
    withApple: "Continuer avec Apple",
    or: "ou",
    emailLabel: "Courriel",
    passwordLabel: "Mot de passe",
    submit: "Créer mon compte",
    already: "Déjà un compte ?",
    loginLink: "Me connecter",
    fakeAlert:
      "Formulaire visuel uniquement pour l’instant. L’intégration complète de l’inscription arrive bientôt.",
  },
  en: {
    title: "Create my free account",
    subtitle:
      "Create your free account and start texting with the AI you choose. Voice (talking with your AmorIA) is only available with the paid plan.",
    withGoogle: "Continue with Google",
    withApple: "Continue with Apple",
    or: "or",
    emailLabel: "Email",
    passwordLabel: "Password",
    submit: "Create my account",
    already: "Already have an account?",
    loginLink: "Log in",
    fakeAlert:
      "Visual form only for now. Full signup integration is coming soon.",
  },
  es: {
    title: "Crear mi cuenta gratuita",
    subtitle:
      "Crea tu cuenta gratis y empieza a chatear por texto con la IA que elijas. La voz (hablar con tu AmorIA) está disponible solo con la suscripción de pago.",
    withGoogle: "Continuar con Google",
    withApple: "Continuar con Apple",
    or: "o",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    submit: "Crear mi cuenta",
    already: "¿Ya tienes cuenta?",
    loginLink: "Iniciar sesión",
    fakeAlert:
      "Formulario visual por ahora. La integración completa de registro llegará pronto.",
  },
};

export default function SignupPage() {
  const searchParams = useSearchParams();
  const initialLocale =
    (searchParams.get("lang") as Locale | null) ?? "fr";

  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = STRINGS[locale];

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(t.fakeAlert);
  };

  const loginHref = `/login?lang=${locale}`;

  return (
    <main className="amoria-auth-root">
      <section className="amoria-auth-shell">
        {/* Header mini + switch de langue */}
        <header className="amoria-auth-header">
          <div className="amoria-auth-logo">
            <div className="amoria-auth-logo-mark" />
            <span className="amoria-auth-logo-text">AmorIA.app</span>
          </div>

          <div className="amoria-auth-lang-switch">
            {(["fr", "en", "es"] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={
                  "amoria-auth-lang-pill" +
                  (locale === code ? " amoria-auth-lang-pill--active" : "")
                }
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* Carte principale */}
        <div className="amoria-auth-card">
          <h1 className="amoria-auth-title">{t.title}</h1>
          <p className="amoria-auth-subtitle">{t.subtitle}</p>

          {/* Boutons socials */}
          <div className="amoria-auth-socials">
            <button
              type="button"
              className="amoria-auth-social-btn"
            >
              <span className="amoria-auth-social-icon">G</span>
              <span>{t.withGoogle}</span>
            </button>

            <button
              type="button"
              className="amoria-auth-social-btn"
            >
              <span className="amoria-auth-social-icon"></span>
              <span>{t.withApple}</span>
            </button>
          </div>

          <div className="amoria-auth-divider">
            <span className="amoria-auth-divider-line" />
            <span className="amoria-auth-divider-text">{t.or}</span>
            <span className="amoria-auth-divider-line" />
          </div>

          {/* Formulaire email / mot de passe */}
          <form className="amoria-auth-form" onSubmit={handleSubmit}>
            <label className="amoria-auth-label">
              <span>{t.emailLabel}</span>
              <input
                type="email"
                required
                className="amoria-auth-input"
                placeholder="you@example.com"
              />
            </label>

            <label className="amoria-auth-label">
              <span>{t.passwordLabel}</span>
              <input
                type="password"
                required
                className="amoria-auth-input"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              className="amoria-auth-submit"
            >
              {t.submit}
            </button>
          </form>

          <p className="amoria-auth-footer-text">
            {t.already}{" "}
            <a href={loginHref} className="amoria-auth-footer-link">
              {t.loginLink}
            </a>
          </p>
        </div>
      </section>

      <style jsx>{`
        .amoria-auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: radial-gradient(
            circle at top left,
            #111827 0,
            #020617 55%,
            #000 100%
          );
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-auth-shell {
          width: 100%;
          max-width: 480px;
        }

        .amoria-auth-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .amoria-auth-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .amoria-auth-logo-mark {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 0, #fde68a, #f97316);
        }

        .amoria-auth-logo-text {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .amoria-auth-lang-switch {
          display: flex;
          gap: 0.25rem;
          padding: 0.18rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: rgba(15, 23, 42, 0.9);
        }

        .amoria-auth-lang-pill {
          border-radius: 999px;
          border: none;
          padding: 0.15rem 0.48rem;
          font-size: 0.72rem;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
        }

        .amoria-auth-lang-pill--active {
          background: #0f172a;
          color: #f9fafb;
        }

        .amoria-auth-card {
          background: radial-gradient(
            circle at top,
            rgba(15, 23, 42, 0.8),
            #020617 55%,
            #020617 100%
          );
          border-radius: 1.4rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          padding: 1.8rem 1.6rem 1.7rem;
          box-shadow: 0 22px 45px rgba(15, 23, 42, 0.8);
        }

        .amoria-auth-title {
          font-size: 1.4rem;
          margin: 0 0 0.6rem;
        }

        .amoria-auth-subtitle {
          font-size: 0.9rem;
          color: #9ca3af;
          margin: 0 0 1.4rem;
        }

        .amoria-auth-socials {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        .amoria-auth-social-btn {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: rgba(15, 23, 42, 0.9);
          padding: 0.55rem 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          cursor: pointer;
          color: #e5e7eb;
        }

        .amoria-auth-social-icon {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #f9fafb;
          color: #111827;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .amoria-auth-divider {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin: 0.6rem 0 1rem;
        }

        .amoria-auth-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(148, 163, 184, 0.4);
        }

        .amoria-auth-divider-text {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }

        .amoria-auth-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .amoria-auth-input {
          border-radius: 0.7rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: rgba(15, 23, 42, 0.95);
          padding: 0.55rem 0.75rem;
          color: #e5e7eb;
          font-size: 0.86rem;
        }

        .amoria-auth-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.3);
        }

        .amoria-auth-submit {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1.2rem;
          font-size: 0.95rem;
          cursor: pointer;
          background: linear-gradient(
            135deg,
            #fb37ff,
            #ff6b9c
          );
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-auth-footer-text {
          margin: 0.4rem 0 0;
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-footer-link {
          color: #f9a8d4;
          text-decoration: none;
          font-weight: 500;
        }

        @media (max-width: 480px) {
          .amoria-auth-card {
            padding: 1.5rem 1.3rem 1.4rem;
          }

          .amoria-auth-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </main>
  );
}
