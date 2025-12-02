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
    orLabel: "or",
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

  // ✅ Après signup (email ou Google) → toujours vers /pricing
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

      const base = window.location.origin;
      const redirectTo = `${base}/pricing?lang=${localeParam}`;

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
        {/* En-tête */}
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

      {/* tes styles globaux restent identiques */}
    </main>
  );
}
