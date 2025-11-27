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
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordHint: string;
    createButton: string;
    loadingCreate: string;
    alreadyHave: string;
    login: string;
    google: string;
    loadingGoogle: string;
    errorGeneric: string;
    orLabel: string;
    termsText: string;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIAI",
    subtitle:
      "Inscris-toi pour commencer avec ton partenaire IA. Tu choisiras ton forfait juste après.",
    emailLabel: "Adresse courriel",
    emailPlaceholder: "ex. mon.adresse@email.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Choisis un mot de passe sécurisé",
    passwordHint: "Minimum 6 caractères.",
    createButton: "Créer mon compte",
    loadingCreate: "Création du compte…",
    alreadyHave: "Tu as déjà un compte ?",
    login: "Me connecter",
    google: "Continuer avec Google",
    loadingGoogle: "Redirection vers Google…",
    errorGeneric: "Une erreur est survenue. Merci de réessayer.",
    orLabel: "ou",
    termsText:
      "En continuant, tu confirmes accepter les Conditions d’utilisation et la Politique de confidentialité d’AmorIAI.",
  },
  en: {
    title: "Create my AmorIAI account",
    subtitle:
      "Sign up to start with your AI companion. You’ll choose your plan right after.",
    emailLabel: "Email address",
    emailPlaceholder: "e.g. my.email@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Choose a secure password",
    passwordHint: "At least 6 characters.",
    createButton: "Create my account",
    loadingCreate: "Creating your account…",
    alreadyHave: "Already have an account?",
    login: "Log in",
    google: "Continue with Google",
    loadingGoogle: "Redirecting to Google…",
    errorGeneric: "An error occurred. Please try again.",
    orLabel: "or",
    termsText:
      "By continuing, you agree to AmorIAI’s Terms of Use and Privacy Policy.",
  },
  es: {
    title: "Crear mi cuenta AmorIAI",
    subtitle:
      "Regístrate para empezar con tu compañero de IA. Podrás elegir tu plan justo después.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "ej. mi.correo@ejemplo.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Elige una contraseña segura",
    passwordHint: "Mínimo 6 caracteres.",
    createButton: "Crear mi cuenta",
    loadingCreate: "Creando tu cuenta…",
    alreadyHave: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    google: "Continuar con Google",
    loadingGoogle: "Redirigiendo a Google…",
    errorGeneric: "Ocurrió un error. Inténtalo de nuevo.",
    orLabel: "o",
    termsText:
      "Al continuar, aceptas los Términos de uso y la Política de privacidad de AmorIAI.",
  },
};

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") || "fr") as Locale;
  const t = LABELS[localeParam];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Après création du compte → TOUJOURS /pricing
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

    // Email de confirmation envoyé par Supabase → on affiche les plans
    redirectAfterSignup();
  };

  const handleGoogleSignup = async () => {
    try {
      setError(null);
      setLoadingGoogle(true);

      const redirectTo = `${window.location.origin}/pricing?lang=${localeParam}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setError(error.message || t.errorGeneric);
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  const isBusy = loadingEmail || loadingGoogle;

  return (
    <main className="amoria-auth-root">
      <div className="amoria-auth-card">
        <header className="amoria-auth-header">
          <div className="amoria-auth-logo">AmorIAI</div>
          <div>
            <h1 className="amoria-auth-title">{t.title}</h1>
            <p className="amoria-auth-subtitle">{t.subtitle}</p>
          </div>
        </header>

        <form className="amoria-auth-form" onSubmit={handleSubmit} noValidate>
          <label className="amoria-auth-label">
            <span>{t.emailLabel}</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="amoria-auth-input"
              placeholder={t.emailPlaceholder}
              autoComplete="email"
            />
          </label>

          <label className="amoria-auth-label">
            <span>{t.passwordLabel}</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="amoria-auth-input"
              placeholder={t.passwordPlaceholder}
              autoComplete="new-password"
            />
            <span className="amoria-auth-hint">{t.passwordHint}</span>
          </label>

          {error && <p className="amoria-auth-error">{error}</p>}

          <button
            type="submit"
            className="amoria-auth-btn-primary"
            disabled={isBusy}
          >
            {loadingEmail ? t.loadingCreate : t.createButton}
          </button>
        </form>

        <div className="amoria-auth-divider">
          <span className="amoria-auth-divider-line" />
          <span className="amoria-auth-divider-label">{t.orLabel}</span>
          <span className="amoria-auth-divider-line" />
        </div>

        <button
          type="button"
          className="amoria-auth-btn-google"
          onClick={handleGoogleSignup}
          disabled={isBusy}
        >
          {loadingGoogle ? t.loadingGoogle : t.google}
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

        <p className="amoria-auth-terms">{t.termsText}</p>
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
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-auth-card {
          width: 100%;
          max-width: 430px;
          border-radius: 1.5rem;
          padding: 1.9rem 1.9rem 1.8rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 45%,
            #000 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.38);
          box-shadow: 0 22px 48px rgba(15, 23, 42, 0.85);
        }

        .amoria-auth-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1rem;
        }

        .amoria-auth-logo {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 0, #fb37ff, #f97316);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .amoria-auth-title {
          font-size: 1.2rem;
          margin-bottom: 0.2rem;
        }

        .amoria-auth-subtitle {
          font-size: 0.84rem;
          color: #9ca3af;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-top: 0.4rem;
        }

        .amoria-auth-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .amoria-auth-input {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.45);
          padding: 0.6rem 0.95rem;
          background: rgba(15, 23, 42, 0.95);
          color: #f9fafb;
          font-size: 0.85rem;
        }

        .amoria-auth-input::placeholder {
          color: #6b7280;
        }

        .amoria-auth-input:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-auth-hint {
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .amoria-auth-error {
          font-size: 0.78rem;
          color: #fecaca;
          background: rgba(185, 28, 28, 0.16);
          border-radius: 0.8rem;
          padding: 0.45rem 0.7rem;
          margin-top: 0.1rem;
          border: 1px solid rgba(248, 113, 113, 0.7);
        }

        .amoria-auth-btn-primary {
          margin-top: 0.35rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1.2rem;
          font-size: 0.9rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          cursor: pointer;
          box-shadow: 0 16px 36px rgba(248, 113, 113, 0.4);
        }

        .amoria-auth-btn-primary:disabled {
          opacity: 0.6;
          cursor: default;
          box-shadow: none;
        }

        .amoria-auth-divider {
          margin: 1.1rem 0 0.7rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-auth-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(55, 65, 81, 0.9);
        }

        .amoria-auth-divider-label {
          flex-shrink: 0;
        }

        .amoria-auth-btn-google {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.55);
          padding: 0.65rem 1.2rem;
          font-size: 0.86rem;
          background: rgba(15, 23, 42, 0.96);
          color: #f9fafb;
          cursor: pointer;
        }

        .amoria-auth-btn-google:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .amoria-auth-footer {
          margin-top: 0.9rem;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-footer-link {
          color: #e5e7eb;
          text-decoration: underline;
        }

        .amoria-auth-terms {
          margin-top: 0.6rem;
          font-size: 0.7rem;
          color: #6b7280;
          text-align: center;
          line-height: 1.4;
        }

        @media (max-width: 480px) {
          .amoria-auth-card {
            padding-inline: 1.35rem;
          }
        }
      `}</style>
    </main>
  );
}
