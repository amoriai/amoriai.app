"use client";

import React, { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

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
    orLabel: "or",
  },
};

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") || "fr") as Locale;
  const planParam = (searchParams.get("plan") || "free") as PlanId; // <- plan demandé
  const t = LABELS[localeParam];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirection après création du compte selon le plan
  const redirectAfterSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);

    if (planParam === "free") {
      // compte gratuit → on va directement créer l’AmorIAI
      params.set("plan", "free");
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      // plan payant → page de paiement Stripe
      params.set("plan", planParam);
      router.push(`/payment?${params.toString()}`);
    }
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

      const base = window.location.origin;

      let redirectTo: string;
      if (planParam === "free") {
        redirectTo = `${base}/create-amoria?lang=${localeParam}&plan=free`;
      } else {
        redirectTo = `${base}/payment?lang=${localeParam}&plan=${planParam}`;
      }

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
        {/* En-tête avec logo + titre */}
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
                {/* petit œil en SVG */}
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

        <div className="amoria-auth-divider">{t.orLabel}</div>

        <button
          type="button"
          className="amoria-auth-btn-google"
          onClick={handleGoogleSignup}
          disabled={loadingGoogle || loadingEmail}
        >
          {loadingGoogle ? "..." : t.google}
        </button>

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
          max-width: 430px;
          border-radius: 1.5rem;
          padding: 1.9rem 1.9rem 2.1rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.35);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.7);
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-auth-header {
          margin-bottom: 1.2rem;
        }

        .amoria-auth-logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .amoria-auth-logo {
          width: 28px;
          height: 28px;
          border-radius: 999px;
        }

        .amoria-auth-brand {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #fb37ff, #ff8a5c, #ffe45e);
          -webkit-background-clip: text;
          color: transparent;
        }

        .amoria-auth-title {
          font-size: 1.25rem;
          margin-bottom: 0.3rem;
        }

        .amoria-auth-subtitle {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          margin-top: 1rem;
        }

        .amoria-auth-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .amoria-auth-input {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 0.55rem 0.95rem;
          background: rgba(15, 23, 42, 0.9);
          color: #f9fafb;
          font-size: 0.85rem;
          width: 100%;
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
          width: 100%;
        }

        .amoria-auth-input--password {
          padding-right: 2.4rem;
          width: 100%;
        }

        .amoria-auth-eye-btn {
          position: absolute;
          right: 0.45rem;
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
        }

        .amoria-auth-error {
          font-size: 0.78rem;
          color: #fecaca;
          background: rgba(185, 28, 28, 0.18);
          border-radius: 0.75rem;
          padding: 0.45rem 0.6rem;
          margin-top: 0.15rem;
        }

        .amoria-auth-btn-primary {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1.2rem;
          font-size: 0.9rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          cursor: pointer;
          box-shadow: 0 12px 32px rgba(248, 113, 113, 0.45);
        }

        .amoria-auth-btn-primary:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .amoria-auth-divider {
          margin: 1.2rem 0 0.8rem;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-btn-google {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.45);
          padding: 0.7rem 1.2rem;
          font-size: 0.86rem;
          background: rgba(15, 23, 42, 0.95);
          color: #f9fafb;
          cursor: pointer;
        }

        .amoria-auth-btn-google:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .amoria-auth-footer {
          margin-top: 1rem;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-footer-link {
          color: #e5e7eb;
          text-decoration: underline;
        }

        .amoria-auth-terms {
          margin-top: 0.55rem;
          font-size: 0.68rem;
          color: #6b7280;
          text-align: center;
        }

        .amoria-auth-terms span {
          color: #9ca3af;
        }
      `}</style>
    </main>
  );
}
