"use client";

import React, { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

type Strings = {
  title: string;
  subtitle: string;
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
    google: "Continuer avec Google",
    or: "OU",
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
    google: "Continue with Google",
    or: "OR",
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
    google: "Continuar con Google",
    or: "O",
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

      // redirection après connexion
      const nextFromUrl = searchParams.get("next");
      const baseTarget = nextFromUrl || "/my-amoria";

      const params = new URLSearchParams();
      params.set("lang", locale);

      router.replace(`${baseTarget}?${params.toString()}`);
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
      // sinon Supabase redirige lui-même
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
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          borderRadius: "1.75rem",
          padding: "2.2rem 2.1rem 2rem",
          background:
            "radial-gradient(circle at top left, rgba(248,113,113,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(59,130,246,0.18), transparent 55%), #020617",
          boxShadow:
            "0 28px 60px rgba(15,23,42,0.85), 0 0 0 1px rgba(148,163,184,0.4)",
          border: "1px solid rgba(148,163,184,0.5)",
        }}
      >
        <header style={{ marginBottom: "1.4rem" }}>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              margin: 0,
              marginBottom: "0.4rem",
            }}
          >
            {t.title}
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#9ca3af",
              margin: 0,
            }}
          >
            {t.subtitle}
          </p>
        </header>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            borderRadius: "999px",
            border: "1px solid rgba(148,163,184,0.7)",
            padding: "0.65rem 1rem",
            backgroundColor: "rgba(15,23,42,0.9)",
            color: "#e5e7eb",
            fontSize: "0.9rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {t.google}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "1.3rem 0 1.1rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(148,163,184,0.6))",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#6b7280",
            }}
          >
            {t.or}
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, rgba(148,163,184,0.6), transparent)",
            }}
          />
        </div>

        <form onSubmit={handleEmailLogin} noValidate>
          <div style={{ marginBottom: "0.95rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                marginBottom: "0.25rem",
                color: "#e5e7eb",
              }}
            >
              {t.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              style={{
                width: "100%",
                borderRadius: "999px",
                border: "1px solid rgba(55,65,81,0.9)",
                backgroundColor: "rgba(15,23,42,0.9)",
                padding: "0.6rem 0.9rem",
                fontSize: "0.9rem",
                color: "#e5e7eb",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "0.9rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                marginBottom: "0.25rem",
                color: "#e5e7eb",
              }}
            >
              {t.passwordLabel}
            </label>
            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                style={{
                  width: "100%",
                  borderRadius: "999px",
                  border: "1px solid rgba(55,65,81,0.9)",
                  backgroundColor: "rgba(15,23,42,0.9)",
                  padding: "0.6rem 2.6rem 0.6rem 0.9rem",
                  fontSize: "0.9rem",
                  color: "#e5e7eb",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: "0.55rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  borderRadius: "999px",
                  border: "none",
                  background: "transparent",
                  color: "#9ca3af",
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.5rem",
                  cursor: "pointer",
                }}
              >
                {showPassword ? t.hide : t.show}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#fecaca",
                marginTop: "0.2rem",
                marginBottom: "0.8rem",
              }}
            >
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "0.2rem",
              borderRadius: "999px",
              border: "none",
              padding: "0.7rem 1rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#f9fafb",
              cursor: loading ? "default" : "pointer",
              backgroundImage:
                "linear-gradient(90deg, #fb7185, #f97316, #fb7185)",
              boxShadow: "0 12px 30px rgba(248,113,113,0.45)",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>

        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.85rem",
            textAlign: "center",
            color: "#9ca3af",
          }}
        >
          {t.noAccount}{" "}
          <button
            type="button"
            onClick={goToSignup}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              margin: 0,
              color: "#f9a8d4",
              cursor: "pointer",
              fontSize: "0.85rem",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            {t.signupLink}
          </button>
        </div>
      </div>
    </main>
  );
}
