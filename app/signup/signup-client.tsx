"use client";

import React, { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

const LABELS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordHint: string;
    createButton: string;
    alreadyHave: string;
    login: string;
    google: string;
    errorGeneric: string;
    orLabel: string;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIAI",
    subtitle:
      "Inscris-toi pour commencer avec ton partenaire IA. Tu choisiras ton forfait juste après.",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Choisis un mot de passe sécurisé",
    passwordHint: "Minimum 6 caractères.",
    createButton: "Créer mon compte",
    alreadyHave: "Tu as déjà un compte ?",
    login: "Me connecter",
    google: "Continuer avec Google",
    errorGeneric: "Une erreur est survenue. Merci de réessayer.",
    orLabel: "ou",
  },
  en: {
    title: "Create my AmorIAI account",
    subtitle:
      "Sign up to start with your AI partner. You’ll choose your plan right after.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    passwordPlaceholder: "Choose a secure password",
    passwordHint: "At least 6 characters.",
    createButton: "Create my account",
    alreadyHave: "Already have an account?",
    login: "Log in",
    google: "Continue with Google",
    errorGeneric: "An error occurred. Please try again.",
    orLabel: "or",
  },
  es: {
    title: "Crear mi cuenta AmorIAI",
    subtitle:
      "Regístrate para empezar con tu pareja de IA. Elegirás tu plan justo después.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Elige una contraseña segura",
    passwordHint: "Mínimo 6 caracteres.",
    createButton: "Crear mi cuenta",
    alreadyHave: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    google: "Continuar con Google",
    errorGeneric: "Ocurrió un error. Inténtalo de nuevo.",
    orLabel: "o",
  },
};

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") || "fr") as Locale;
  const t = LABELS[localeParam];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Après création → /pricing
  const redirectAfterSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);
    router.push(`/pricing?${params.toString()}`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoadingEmail(false);

    if (error) {
      setError(error.message || t.errorGeneric);
      return;
    }

    redirectAfterSignup();
  };

  const handleGoogleSignup = async () => {
    try {
      setError(null);
      setLoadingGoogle(true);

      const redirectTo = `${window.location.origin}/pricing?lang=${localeParam}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        setError(error.message || t.errorGeneric);
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <main className="amoria-auth-root">
      <div className="amoria-auth-card">
        {/* Header logo + brand */}
        <div className="amoria-auth-header">
          <div className="amoria-auth-logo-wrapper">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIAI"
              className="amoria-auth-logo"
            />
            <span className="amoria-auth-brand">AmorIAI</span>
          </div>

          <h1 className="amoria-auth-title">{t.title}</h1>
          <p className="amoria-auth-subtitle">{t.subtitle}</p>
        </div>

        {/* Formulaire email / mot de passe */}
        <form className="amoria-auth-form" onSubmit={handleSubmit}>
          <label className="amoria-auth-label">
            {t.emailLabel}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="amoria-auth-input"
              placeholder="ex. mon.adresse@email.com"
            />
          </label>

          <label className="amoria-auth-label">
            {t.passwordLabel}
            <div className="amoria-auth-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="amoria-auth-input amoria-auth-input--password"
                placeholder={t.passwordPlaceholder}
              />
              <button
                type="button"
                className="amoria-auth-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="amoria-auth-eye-icon"
                >
                  <path
                    d="M12 5C7 5 3.1 8 1.5 12c1.6 4 5.5 7 10.5 7s8.9-3 10.5-7C20.9 8 17 5 12 5Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                    fill="currentColor"
                  />
                  {showPassword ? (
                    <path
                      d="M5 5L19 19"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  ) : null}
                </svg>
              </button>
            </div>
            <span className="amoria-auth-hint">{t.passwordHint}</span>
          </label>

          {error && <p className="amoria-auth-error">{error}</p>}

          <button
            type="submit"
            className="amoria-auth-btn-primary"
            disabled={loadingEmail || loadingGoogle}
          >
            {loadingEmail ? "..." : t.createButton}
          </button>
        </form>

        {/* Séparateur plus aéré */}
        <div className="amoria-auth-divider-row">
          <span className="amoria-auth-divider-line" />
          <span className="amoria-auth-divider-text">{t.orLabel}</span>
          <span className="amoria-auth-divider-line" />
        </div>

        {/* Bouton Google, bien séparé */}
        <button
          type="button"
          className="amoria-auth-btn-google"
          onClick={handleGoogleSignup}
          disabled={loadingGoogle || loadingEmail}
        >
          <span className="amoria-auth-google-icon">G</span>
          <span>{loadingGoogle ? "..." : t.google}</span>
        </button>

        {/* Footer login + conditions */}
        <p className="amoria-auth-footer">
          {t.alreadyHave}{" "}
          <a
            href={`/login?lang=${localeParam}`}
            className="amoria-auth-footer-link"
          >
            {t.login}
          </a>
        </p>

        <p className="amoria-auth-terms">
          {localeParam === "fr" && (
            <>
              En continuant, tu confirmes accepter les{" "}
              <span>Conditions d’utilisation</span> et la{" "}
              <span>Politique de confidentialité</span> d’AmorIAI.
            </>
          )}
          {localeParam === "en" && (
            <>
              By continuing, you agree to AmorIAI’s{" "}
              <span>Terms of Use</span> and <span>Privacy Policy</span>.
            </>
          )}
          {localeParam === "es" && (
            <>
              Al continuar, confirmas que aceptas los{" "}
              <span>Términos de uso</span> y la{" "}
              <span>Política de privacidad</span> de AmorIAI.
            </>
          )}
        </p>
      </div>

      <style jsx global>{`
        .amoria-auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #020617 0, #000 100%);
          color: #e5e7eb;
          padding: 1.5rem;
        }

        .amoria-auth-card {
          width: 100%;
          max-width: 440px;
          border-radius: 1.6rem;
          padding: 2rem 2rem 2.2rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.35);
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.8);
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-auth-header {
          margin-bottom: 1.3rem;
        }

        .amoria-auth-logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          margin-bottom: 0.6rem;
        }

        .amoria-auth-logo {
          width: 26px;
          height: 26px;
          border-radius: 999px;
        }

        .amoria-auth-brand {
          font-size: 0.86rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #fb37ff, #ff8a5c, #ffe45e);
          -webkit-background-clip: text;
          color: transparent;
        }

        .amoria-auth-title {
          font-size: 1.25rem;
          margin-bottom: 0.35rem;
        }

        .amoria-auth-subtitle {
          font-size: 0.86rem;
          color: #9ca3af;
          line-height: 1.4;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          margin-top: 1.2rem;
        }

        .amoria-auth-label {
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
          font-size: 0.8rem;
        }

        .amoria-auth-input {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.45);
          padding: 0.6rem 1rem;
          background: rgba(15, 23, 42, 0.92);
          color: #f9fafb;
          font-size: 0.86rem;
        }

        .amoria-auth-input::placeholder {
          color: #6b7280;
        }

        .amoria-auth-input:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-auth-password-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .amoria-auth-input--password {
          padding-right: 2.5rem;
        }

        .amoria-auth-eye-btn {
          position: absolute;
          right: 0.55rem;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 999px;
          border: none;
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          cursor: pointer;
        }

        .amoria-auth-eye-icon {
          width: 18px;
          height: 18px;
        }

        .amoria-auth-hint {
          font-size: 0.7rem;
          color: #9ca3af;
          margin-top: 0.1rem;
        }

        .amoria-auth-error {
          font-size: 0.78rem;
          color: #fecaca;
          background: rgba(185, 28, 28, 0.18);
          border-radius: 0.75rem;
          padding: 0.45rem 0.6rem;
          margin-top: 0.2rem;
        }

        .amoria-auth-btn-primary {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.75rem 1.2rem;
          font-size: 0.9rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          cursor: pointer;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
        }

        .amoria-auth-btn-primary:disabled {
          opacity: 0.6;
          cursor: default;
        }

        /* Divider plus aéré */
        .amoria-auth-divider-row {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin: 1.3rem 0 1rem;
        }

        .amoria-auth-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(148, 163, 184, 0.7),
            transparent
          );
        }

        .amoria-auth-divider-text {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        /* Bouton Google bien séparé */
        .amoria-auth-btn-google {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.55);
          padding: 0.7rem 1.2rem;
          font-size: 0.86rem;
          background: rgba(15, 23, 42, 0.96);
          color: #f9fafb;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
        }

        .amoria-auth-btn-google:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .amoria-auth-google-icon {
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: #f9fafb;
          color: #111827;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .amoria-auth-footer {
          margin-top: 0.4rem;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-footer-link {
          color: #f9a8d4;
          text-decoration: underline;
        }

        .amoria-auth-terms {
          margin-top: 0.6rem;
          font-size: 0.68rem;
          color: #6b7280;
          text-align: center;
          line-height: 1.4;
        }

        .amoria-auth-terms span {
          color: #9ca3af;
        }

        @media (max-width: 480px) {
          .amoria-auth-card {
            padding-inline: 1.4rem;
          }
        }
      `}</style>
    </main>
  );
}
