"use client";

import React, { FormEvent, useEffect, useState } from "react";
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

  /* ✅ REDIRECTION AUTO SI DÉJÀ CONNECTÉE */
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace(`/my-amoria?lang=${locale}`);
      }
    };
    checkSession();
  }, [router, locale]);

  /* ✅ LOGIN EMAIL */
  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(
        error.message.toLowerCase().includes("invalid")
          ? t.errorInvalid
          : t.errorGeneric
      );
      setLoading(false);
      return;
    }

    router.replace(`/my-amoria?lang=${locale}`);
  };

  /* ✅ LOGIN GOOGLE */
  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);

    const origin = window.location.origin;
    const redirectTo = `${origin}/my-amoria?lang=${locale}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setErrorMsg(t.errorGeneric);
      setLoading(false);
    }
  };

  const goToSignup = () => {
    router.push(`/signup?lang=${locale}`);
  };

  /* ✅ JSX VISUEL COMPLET */
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
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>
            {t.title}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
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
            cursor: loading ? "default" : "pointer",
          }}
        >
          {t.google}
        </button>

        <div style={{ margin: "1rem 0", textAlign: "center", color: "#9ca3af" }}>
          {t.or}
        </div>

        <form onSubmit={handleEmailLogin} noValidate>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            style={{ width: "100%", marginBottom: "0.7rem" }}
          />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.passwordPlaceholder}
            style={{ width: "100%", marginBottom: "0.7rem" }}
          />

          {errorMsg && (
            <p style={{ fontSize: "0.8rem", color: "#fecaca" }}>{errorMsg}</p>
          )}

          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? t.submitting : t.submit}
          </button>
        </form>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          {t.noAccount}{" "}
          <button onClick={goToSignup}>{t.signupLink}</button>
        </div>
      </div>
    </main>
  );
}
