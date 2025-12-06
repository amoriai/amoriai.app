"use client";

import React, { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

type Strings = {
  title: string;
  subtitle: string;
  badge: string;
  google: string;
  or: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  show: string;
  hide: string;
  submit: string;
  submitting: string;
  noAccount: string;
  signupLink: string;
  errorGeneric: string;
  errorInvalid: string;
};

const STRINGS: Record<Locale, Strings> = {
  fr: {
    title: "Me connecter",
    subtitle: "Accède à ton AmorIAI personnel et reprends la conversation.",
    badge: "Connexion à AmorIAI",
    google: "Continuer avec Google",
    or: "ou",
    emailLabel: "Adresse courriel",
    emailPlaceholder: "ex. mon.adresse@email.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Ton mot de passe AmorIAI",
    show: "Afficher",
    hide: "Masquer",
    submit: "Me connecter",
    submitting: "Connexion…",
    noAccount: "Pas encore de compte ?",
    signupLink: "Créer mon compte",
    errorGeneric: "Une erreur est survenue. Réessaie dans un instant.",
    errorInvalid: "Courriel ou mot de passe invalide.",
  },
  en: {
    title: "Log in",
    subtitle: "Access your personal AmorIAI and resume your conversation.",
    badge: "Sign in to AmorIAI",
    google: "Continue with Google",
    or: "or",
    emailLabel: "Email address",
    emailPlaceholder: "e.g. my.address@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Your AmorIAI password",
    show: "Show",
    hide: "Hide",
    submit: "Log in",
    submitting: "Logging in…",
    noAccount: "Don’t have an account yet?",
    signupLink: "Create my account",
    errorGeneric: "Something went wrong. Please try again.",
    errorInvalid: "Invalid email or password.",
  },
  es: {
    title: "Iniciar sesión",
    subtitle: "Accede a tu AmorIAI personal y continúa la conversación.",
    badge: "Conectarte a AmorIAI",
    google: "Continuar con Google",
    or: "o",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "ej. mi.direccion@email.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Tu contraseña de AmorIAI",
    show: "Mostrar",
    hide: "Ocultar",
    submit: "Iniciar sesión",
    submitting: "Conectando…",
    noAccount: "¿Todavía no tienes cuenta?",
    signupLink: "Crear mi cuenta",
    errorGeneric: "Ocurrió un error. Inténtalo de nuevo.",
    errorInvalid: "Correo o contraseña inválidos.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function LoginClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get("lang"));
  const t = STRINGS[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /** Après connexion → TOUJOURS /my-amoria (plus jamais /pricing) */
  const redirectToMyAmoria = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.replace(`/my-amoria?${params.toString()}`);
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("supabase signIn error", error);
        setErrorMsg(
          error.message.toLowerCase().includes("invalid")
            ? t.errorInvalid
            : t.errorGeneric
        );
        setLoading(false);
        return;
      }

      // ✅ Connexion OK → on va dans /my-amoria
      redirectToMyAmoria();
    } catch (err) {
      console.error("login error", err);
      setErrorMsg(t.errorGeneric);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      // ✅ On indique à /auth/callback de renvoyer vers /my-amoria
      const params = new URLSearchParams();
      params.set("lang", locale);
      params.set("next", "/my-amoria");

      const redirectTo = `${origin}/auth/callback?${params.toString()}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error("google oauth error", error);
        setErrorMsg(t.errorGeneric);
        setLoading(false);
      }
      // Sinon Supabase redirige vers /auth/callback, puis /my-amoria
    } catch (err) {
      console.error("google login error", err);
      setErrorMsg(t.errorGeneric);
      setLoading(false);
    }
  };

  const goToSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/signup?${params.toString()}`);
  };

  return (
    <main className="auth-root">
      <div className="auth-card">
        <div className="auth-badge">{t.badge}</div>

        <header className="auth-header">
          <h1 className="auth-title">{t.title}</h1>
          <p className="auth-subtitle">{t.subtitle}</p>
        </header>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="auth-google-btn"
        >
          <span className="auth-google-icon">G</span>
          <span>{t.google}</span>
        </button>

        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-label">{t.or}</span>
          <span className="auth-divider-line" />
        </div>

        <form onSubmit={handleEmailLogin} noValidate className="auth-form">
          <div className="auth-field">
            <label className="auth-label">{t.emailLabel}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">{t.passwordLabel}</label>
            <div className="auth-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="auth-input auth-input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="auth-password-toggle"
              >
                {showPassword ? t.hide : t.show}
              </button>
            </div>
          </div>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>

        <div className="auth-footer">
          {t.noAccount}{" "}
          <button type="button" onClick={goToSignup} className="auth-link-btn">
            {t.signupLink}
          </button>
        </div>
      </div>

      <style jsx>{`
        .auth-root {
          min-height: 100vh;
          margin: 0;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at top, #020617 0, #020617 40%, #000 80%),
            radial-gradient(circle at bottom right, #0b1120, #020617);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          border-radius: 1.9rem;
          padding: 2.2rem 2.3rem 2rem;
          background:
            radial-gradient(
              circle at top left,
              rgba(248, 113, 113, 0.25),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(59, 130, 246, 0.25),
              transparent 55%
            ),
            #020617;
          box-shadow:
            0 30px 80px rgba(15, 23, 42, 0.95),
            0 0 0 1px rgba(148, 163, 184, 0.35);
          border: 1px solid rgba(148, 163, 184, 0.55);
          backdrop-filter: blur(18px);
        }

        .auth-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem 0.8rem;
          border-radius: 999px;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.6);
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .auth-header {
          margin-bottom: 1.5rem;
        }

        .auth-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0 0 0.35rem;
        }

        .auth-subtitle {
          margin: 0;
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .auth-google-btn {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.8);
          padding: 0.7rem 1rem;
          background: rgba(15, 23, 42, 0.96);
          color: #e5e7eb;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease,
            box-shadow 0.15s ease;
        }

        .auth-google-btn:disabled {
          opacity: 0.65;
          cursor: default;
        }

        .auth-google-btn:not(:disabled):hover {
          background: rgba(15, 23, 42, 0.9);
          transform: translateY(-1px);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.8);
        }

        .auth-google-icon {
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 999px;
          background: #fff;
          color: #111827;
          font-weight: 700;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.4rem 0 1.2rem;
        }

        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(148, 163, 184, 0.7),
            transparent
          );
        }

        .auth-divider-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #6b7280;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .auth-label {
          font-size: 0.8rem;
          color: #e5e7eb;
        }

        .auth-input {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(55, 65, 81, 0.95);
          background: radial-gradient(
              circle at top left,
              rgba(15, 23, 42, 0.9),
              rgba(15, 23, 42, 1)
            );
          padding: 0.6rem 0.95rem;
          font-size: 0.9rem;
          color: #e5e7eb;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease,
            background 0.15s ease;
        }

        .auth-input::placeholder {
          color: #6b7280;
        }

        .auth-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.6),
            0 15px 40px rgba(15, 23, 42, 0.9);
          background: radial-gradient(
              circle at top left,
              rgba(15, 23, 42, 0.9),
              rgba(15, 23, 42, 1)
            );
        }

        .auth-password-wrapper {
          position: relative;
        }

        .auth-input-password {
          padding-right: 2.6rem;
        }

        .auth-password-toggle {
          position: absolute;
          right: 0.6rem;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 999px;
          border: none;
          background: transparent;
          color: #9ca3af;
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          cursor: pointer;
        }

        .auth-password-toggle:hover {
          color: #e5e7eb;
        }

        .auth-error {
          font-size: 0.8rem;
          color: #fecaca;
          margin: 0.2rem 0 0.1rem;
        }

        .auth-submit-btn {
          width: 100%;
          margin-top: 0.3rem;
          border-radius: 999px;
          border: none;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #f9fafb;
          cursor: pointer;
          background-image: linear-gradient(90deg, #fb7185, #f97316, #fb7185);
          box-shadow: 0 16px 45px rgba(248, 113, 113, 0.6);
          transition: transform 0.1s ease, box-shadow 0.15s ease,
            filter 0.1s ease;
        }

        .auth-submit-btn:disabled {
          opacity: 0.75;
          cursor: default;
          box-shadow: none;
          filter: grayscale(0.1);
        }

        .auth-submit-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 22px 55px rgba(248, 113, 113, 0.8);
        }

        .auth-footer {
          margin-top: 1.1rem;
          font-size: 0.85rem;
          text-align: center;
          color: #9ca3af;
        }

        .auth-link-btn {
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          color: #f9a8d4;
          cursor: pointer;
          font-size: 0.85rem;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        @media (max-width: 480px) {
          .auth-root {
            padding-inline: 1rem;
          }
          .auth-card {
            padding-inline: 1.5rem;
          }
        }
      `}</style>
    </main>
  );
}
