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
    errorInvalid:
      "Courriel ou mot de passe invalide. Vérifie tes infos ou crée un compte.",
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

  // ✅ Après connexion → toujours /my-amoria
  const redirectToMyAmoria = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.replace(`/my-amoria?${params.toString()}`);
  };

  const goToSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/signup?${params.toString()}`);
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
        const msg = (error.message || "").toLowerCase();
        const looksAuthError =
          msg.includes("invalid") ||
          msg.includes("user not found") ||
          msg.includes("credentials");

        setErrorMsg(looksAuthError ? t.errorInvalid : t.errorGeneric);
        setLoading(false);
        return;
      }

      // Connexion réussie → /my-amoria
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

      // On laisse /auth/callback gérer la suite et rediriger vers /my-amoria
      const params = new URLSearchParams();
      params.set("lang", locale);
      const redirectTo = `${origin}/auth/callback?${params.toString()}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        console.error("google oauth error", error);
        setErrorMsg(t.errorGeneric);
        setLoading(false);
      }
    } catch (err) {
      console.error("google login error", err);
      setErrorMsg(t.errorGeneric);
      setLoading(false);
    }
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

      {/* CSS identique à ta version précédente */}
    </main>
  );
}
