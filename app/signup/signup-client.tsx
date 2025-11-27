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

  const redirectAfterSignup = () => {
    router.push(`/pricing?lang=${localeParam}`);
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

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/pricing?lang=${localeParam}`,
        },
      });

      if (error) setError(error.message || t.errorGeneric);
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <main className="amoria-auth-root">
      <div className="amoria-auth-card">
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
              >
                👁
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
          <a href={`/login?lang=${localeParam}`} className="amoria-auth-footer-link">
            {t.login}
          </a>
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
        }

        .amoria-auth-card {
          width: 100%;
          max-width: 430px;
          border-radius: 1.5rem;
          padding: 2rem;
          background: #020617;
          border: 1px solid rgba(148, 163, 184, 0.35);
        }

        .amoria-auth-logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .amoria-auth-logo {
          width: 30px;
        }

        .amoria-auth-brand {
          font-weight: bold;
          background: linear-gradient(135deg, #fb37ff, #ff8a5c);
          -webkit-background-clip: text;
          color: transparent;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .amoria-auth-input {
          width: 100%;
          border-radius: 999px;
          padding: 0.7rem 1rem;
          background: #020617;
          border: 1px solid #334155;
          color: white;
        }

        .amoria-auth-password-wrapper {
          position: relative;
        }

        .amoria-auth-input--password {
          padding-right: 3rem;
        }

        .amoria-auth-eye-btn {
          position: absolute;
          right: 0.6rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .amoria-auth-btn-primary {
          border-radius: 999px;
          padding: 0.8rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          border: none;
          color: white;
        }
      `}</style>
    </main>
  );
}
