"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    google: string;
    or: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    submitting: string;
    noAccount: string;
    signupLink: string;
    errorRequired: string;
    errorGeneric: string;
    oauthError: string;
  }
> = {
  fr: {
    title: "Me connecter",
    subtitle: "Accède à ton AmorIAI personnel et reprends la conversation.",
    google: "Continuer avec Google",
    or: "OU",
    emailLabel: "Adresse courriel",
    emailPlaceholder: "ex. mon.adresse@email.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Ton mot de passe AmorIAI",
    showPassword: "Afficher",
    hidePassword: "Masquer",
    submit: "Me connecter",
    submitting: "Connexion...",
    noAccount: "Pas encore de compte ?",
    signupLink: "Créer mon compte",
    errorRequired: "Entre ton courriel et ton mot de passe.",
    errorGeneric:
      "Impossible de te connecter. Vérifie tes identifiants ou réessaie dans un instant.",
    oauthError: "La connexion avec Google a échoué. Réessaie.",
  },
  en: {
    title: "Log in",
    subtitle: "Access your personal AmorIAI and continue the conversation.",
    google: "Continue with Google",
    or: "OR",
    emailLabel: "Email address",
    emailPlaceholder: "e.g. my.email@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Your AmorIAI password",
    showPassword: "Show",
    hidePassword: "Hide",
    submit: "Log in",
    submitting: "Logging in...",
    noAccount: "No account yet?",
    signupLink: "Create my account",
    errorRequired: "Please enter your email and password.",
    errorGeneric:
      "We couldn’t log you in. Check your credentials or try again in a moment.",
    oauthError: "Google sign-in failed. Please try again.",
  },
  es: {
    title: "Iniciar sesión",
    subtitle: "Accede a tu AmorIAI personal y retoma la conversación.",
    google: "Continuar con Google",
    or: "O",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "ej. mi.correo@ejemplo.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Tu contraseña de AmorIAI",
    showPassword: "Mostrar",
    hidePassword: "Ocultar",
    submit: "Iniciar sesión",
    submitting: "Conectando...",
    noAccount: "¿Aún no tienes cuenta?",
    signupLink: "Crear mi cuenta",
    errorRequired: "Escribe tu correo y contraseña.",
    errorGeneric:
      "No pudimos conectarte. Verifica tus datos o inténtalo de nuevo.",
    oauthError: "Falló el inicio de sesión con Google. Inténtalo de nuevo.",
  },
};

export default function LoginClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("fr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Récupérer la langue depuis ?lang=
  useEffect(() => {
    const langParam = searchParams.get("lang");
    setLocale(normalizeLocale(langParam));
  }, [searchParams]);

  const t = STRINGS[locale];

  const signupUrl = (() => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/signup?${params.toString()}`;
  })();

  const afterLoginUrl = (() => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/my-amoria?${params.toString()}`;
  })();

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg(t.errorRequired);
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error("supabase.auth.signInWithPassword error:", error);
        setErrorMsg(t.errorGeneric);
        return;
      }

      router.replace(afterLoginUrl);
    } catch (err) {
      console.error("login error:", err);
      setErrorMsg(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setErrorMsg(null);
    try {
      setLoading(true);

      const redirectTo = `${window.location.origin}${afterLoginUrl}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error("supabase.auth.signInWithOAuth error:", error);
        setErrorMsg(t.oauthError);
      }
      // Supabase va rediriger automatiquement
    } catch (err) {
      console.error("oauth error:", err);
      setErrorMsg(t.oauthError);
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background:
          "radial-gradient(circle at top, #020617 0, #020617 35%, #000 80%)",
        color: "#e5e7eb",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "1.5rem",
          padding: "2.2rem 2.1rem 2rem",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.94))",
          boxShadow: "0 30px 80px rgba(15,23,42,0.92)",
          border: "1px solid rgba(148,163,184,0.35)",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <h1
            style={{
              fontSize: "1.7rem",
              fontWeight: 600,
              marginBottom: "0.35rem",
            }}
          >
            {t.title}
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#9ca3af",
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            {t.subtitle}
          </p>
        </header>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            borderRadius: "999px",
            padding: "0.75rem 1rem",
            marginBottom: "1.1rem",
            border: "1px solid rgba(148,163,184,0.5)",
            backgroundColor: "#020617",
            color: "#e5e7eb",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: loading ? "default" : "pointer",
          }}
        >
          {t.google}
        </button>

        {/* séparateur */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.1rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(75,85,99,0.8))",
            }}
          />
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{t.or}</span>
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to left, transparent, rgba(75,85,99,0.8))",
            }}
          />
        </div>

        {/* Formulaire email */}
        <form onSubmit={handleEmailLogin} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 4 }}>
            <label
              htmlFor="email"
              style={{ fontSize: "0.8rem", color: "#e5e7eb" }}
            >
              {t.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              style={{
                borderRadius: "0.9rem",
                border: "1px solid rgba(51,65,85,0.9)",
                backgroundColor: "#020617",
                color: "#e5e7eb",
                fontSize: "0.9rem",
                padding: "0.65rem 0.75rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 4 }}>
            <label
              htmlFor="password"
              style={{ fontSize: "0.8rem", color: "#e5e7eb" }}
            >
              {t.passwordLabel}
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                style={{
                  flex: 1,
                  borderRadius: "0.9rem",
                  border: "1px solid rgba(51,65,85,0.9)",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: "0.9rem",
                  padding: "0.65rem 3.2rem 0.65rem 0.75rem",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: "absolute",
                  right: 8,
                  padding: "0.25rem 0.55rem",
                  fontSize: "0.75rem",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor: "rgba(31,41,55,0.9)",
                  color: "#e5e7eb",
                  cursor: "pointer",
                }}
              >
                {showPw ? t.hidePassword : t.showPassword}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#f97373",
                marginTop: 4,
              }}
            >
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.6rem",
              width: "100%",
              borderRadius: "999px",
              padding: "0.8rem 1rem",
              border: "none",
              background:
                "linear-gradient(135deg, #fb37ff 0%, #f97316 45%, #facc15 100%)",
              color: "#020617",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.8 : 1,
              boxShadow: "0 16px 40px rgba(236,72,153,0.4)",
            }}
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>

        <div
          style={{
            marginTop: "1.1rem",
            fontSize: "0.8rem",
            textAlign: "center",
            color: "#9ca3af",
          }}
        >
          {t.noAccount}{" "}
          <a
            href={signupUrl}
            style={{
              color: "#f9a8d4",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {t.signupLink}
          </a>
        </div>
      </div>
    </main>
  );
}
