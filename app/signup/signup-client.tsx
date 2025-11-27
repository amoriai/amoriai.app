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
      "Inscris-toi pour commencer avec ton AmorIAI. Tu pourras choisir ton forfait juste après.",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
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
      "Sign up to start with your AmorIAI. You’ll choose your plan right after.",
    emailLabel: "Email address",
    passwordLabel: "Password",
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
      "Regístrate para empezar con tu AmorIAI. Elegirás tu plan justo después.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
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

  // langue depuis l’URL (par défaut FR)
  const localeParam = (searchParams.get("lang") || "fr") as Locale;
  const t = LABELS[localeParam];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 👉 Après création du compte → TOUJOURS /pricing
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

    // Supabase envoie l’email de confirmation
    // puis on envoie l’utilisateur vers la page des forfaits
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

  return (
    <main className="amoria-auth-root">
      <div className="amoria-auth-card">
        <h1 className="amoria-auth-title">{t.title}</h1>
        <p className="amoria-auth-subtitle">{t.subtitle}</p>

        <form className="amoria-auth-form" onSubmit={handleSubmit}>
          <label className="amoria-auth-label">
            {t.emailLabel}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="amoria-auth-input"
            />
          </label>

          <label className="amoria-auth-label">
            {t.passwordLabel}
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="amoria-auth-input"
            />
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
          max-width: 420px;
          border-radius: 1.5rem;
          padding: 1.8rem 1.9rem 2rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.35);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.7);
        }

        .amoria-auth-title {
          font-size: 1.2rem;
          margin-bottom: 0.35rem;
        }

        .amoria-auth-subtitle {
          font-size: 0.85rem;
          color: #9ca3af;
          margin-bottom: 0.9rem;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
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
          padding: 0.55rem 0.9rem;
          background: rgba(15, 23, 42, 0.9);
          color: #f9fafb;
          font-size: 0.85rem;
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
          background: rgba(185, 28, 28, 0.18);
          border-radius: 0.75rem;
          padding: 0.45rem 0.6rem;
          margin-top: 0.3rem;
        }

        .amoria-auth-btn-primary {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1.2rem;
          font-size: 0.9rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
        }

        .amoria-auth-btn-primary:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .amoria-auth-divider {
          margin: 1rem 0 0.7rem;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-btn-google {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.45);
          padding: 0.6rem 1.2rem;
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
          margin-top: 0.9rem;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-footer-link {
          color: #e5e7eb;
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
