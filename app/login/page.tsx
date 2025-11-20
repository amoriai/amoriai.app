"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    or: string;
    google: string;
    submit: string;
    submitting: string;
    backToSignup: string;
    errorGeneric: string;
  }
> = {
  fr: {
    title: "Me connecter",
    subtitle:
      "Connecte-toi pour retrouver ton AmorIA et continuer à discuter.",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    or: "— OU —",
    google: "Continuer avec Google",
    submit: "Me connecter",
    submitting: "Connexion en cours…",
    backToSignup: "Pas encore de compte ? Créer mon compte",
    errorGeneric:
      "Impossible de te connecter. Vérifie tes informations ou essaie à nouveau.",
  },
  en: {
    title: "Log in",
    subtitle: "Log in to find your AmorIA and continue chatting.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    or: "— OR —",
    google: "Continue with Google",
    submit: "Log in",
    submitting: "Signing you in…",
    backToSignup: "No account yet? Create my account",
    errorGeneric:
      "Unable to log you in. Check your credentials or try again.",
  },
  es: {
    title: "Iniciar sesión",
    subtitle:
      "Conéctate para reencontrar tu AmorIA y seguir conversando.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    or: "— O —",
    google: "Continuar con Google",
    submit: "Iniciar sesión",
    submitting: "Conectando…",
    backToSignup: "¿Aún no tienes cuenta? Crear mi cuenta",
    errorGeneric:
      "No se pudo iniciar sesión. Verifica tus datos o inténtalo de nuevo.",
  },
};

export default function LoginPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // lire ?lang= côté client (comme sur create-ai)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      if (lang === "fr" || lang === "en" || lang === "es") {
        setLocale(lang);
      }
    } catch {
      // on ignore
    }
  }, []);

  const t = STRINGS[locale];

  const redirectAfterAuth = () =>
    `${window.location.origin}/create-ai?lang=${locale}`;

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectAfterAuth(),
        },
      });

      if (error) {
        console.error(error);
        setError(t.errorGeneric);
        setIsSubmitting(false);
      }
      // pas besoin de rediriger ici : Supabase redirige vers redirectTo
    } catch (e) {
      console.error(e);
      setError(t.errorGeneric);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error);
        setError(t.errorGeneric);
        setIsSubmitting(false);
        return;
      }

      window.location.href = redirectAfterAuth();
    } catch (e) {
      console.error(e);
      setError(t.errorGeneric);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="amoria-auth-root">
      <section className="amoria-auth-card">
        <h1 className="amoria-auth-title">{t.title}</h1>
        <p className="amoria-auth-subtitle">{t.subtitle}</p>

        <button
          type="button"
          className="amoria-auth-google"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
        >
          {t.google}
        </button>

        <p className="amoria-auth-or">{t.or}</p>

        <form onSubmit={handleSubmit} className="amoria-auth-form">
          <label className="amoria-auth-label">
            {t.emailLabel}
            <input
              type="email"
              className="amoria-auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="amoria-auth-label">
            {t.passwordLabel}
            <input
              type="password"
              className="amoria-auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="amoria-auth-error">{error}</p>}

          <button
            type="submit"
            className="amoria-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </form>

        <a
          href={`/signup?lang=${locale}`}
          className="amoria-auth-secondary-link"
        >
          {t.backToSignup}
        </a>
      </section>

      <style jsx global>{`
        .amoria-auth-root {
          min-height: 100vh;
          margin: 0;
          padding: 2.5rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #020617 0, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-auth-card {
          width: 100%;
          max-width: 420px;
          background: radial-gradient(circle at top, #020617, #020617 40%, #000);
          border-radius: 1.5rem;
          padding: 1.8rem 1.7rem 2rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.85);
        }

        .amoria-auth-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .amoria-auth-subtitle {
          font-size: 0.9rem;
          color: #9ca3af;
          margin-bottom: 1.2rem;
        }

        .amoria-auth-google {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.8);
          background: #0f172a;
          color: #e5e7eb;
          font-size: 0.9rem;
          padding: 0.7rem 1rem;
          cursor: pointer;
        }

        .amoria-auth-or {
          text-align: center;
          font-size: 0.78rem;
          color: #6b7280;
          margin: 1rem 0;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .amoria-auth-label {
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .amoria-auth-input {
          border-radius: 0.9rem;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: #020617;
          color: #e5e7eb;
          padding: 0.6rem 0.8rem;
          font-size: 0.9rem;
        }

        .amoria-auth-error {
          font-size: 0.8rem;
          color: #f97373;
          margin-top: 0.2rem;
        }

        .amoria-auth-submit {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
        }

        .amoria-auth-secondary-link {
          display: block;
          margin-top: 1rem;
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
          text-decoration: none;
        }

        .amoria-auth-secondary-link:hover {
          color: #e5e7eb;
        }
      `}</style>
    </main>
  );
}
