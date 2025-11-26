"u"use client";

import React, { FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited") {
    return raw;
  }
  // par défaut, on considère que les gens arrivent sur le plan gratuit
  return "free";
}

const PLAN_TITLES: Record<Locale, Record<PlanId, string>> = {
  fr: {
    free: "Découverte (gratuit)",
    chat: "AmorIA Chat",
    plus: "AmorIA Plus",
    unlimited: "AmorIA Illimité",
  },
  en: {
    free: "Discovery (free)",
    chat: "AmorIA Chat",
    plus: "AmorIA Plus",
    unlimited: "AmorIA Unlimited",
  },
  es: {
    free: "Descubrimiento (gratis)",
    chat: "AmorIA Chat",
    plus: "AmorIA Plus",
    unlimited: "AmorIA Ilimitado",
  },
};

const COPY = {
  fr: {
    title: "Créer mon compte AmorIA",
    subtitle:
      "Inscris-toi pour commencer avec ton AmorIA. Tu pourras changer de forfait plus tard.",
    selectedLabel: "Forfait sélectionné :",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    passwordHint: "Minimum 6 caractères.",
    submit: "Créer mon compte",
    or: "ou",
    continueGoogle: "Continuer avec Google",
    already: "Tu as déjà un compte ?",
    loginLink: "Me connecter",
    errorGeneric:
      "Une erreur est survenue pendant la création du compte. Réessaie dans quelques instants.",
    infoAfterSignup:
      "Un courriel de confirmation t’a été envoyé. Vérifie ta boîte de réception.",
  },
  en: {
    title: "Create my AmorIA account",
    subtitle:
      "Sign up to start with your AmorIA. You can change your plan later.",
    selectedLabel: "Selected plan:",
    emailLabel: "Email address",
    passwordLabel: "Password",
    passwordHint: "Minimum 6 characters.",
    submit: "Create my account",
    or: "or",
    continueGoogle: "Continue with Google",
    already: "Already have an account?",
    loginLink: "Log in",
    errorGeneric:
      "Something went wrong while creating your account. Please try again.",
    infoAfterSignup:
      "A confirmation email has been sent. Please check your inbox.",
  },
  es: {
    title: "Crear mi cuenta AmorIA",
    subtitle:
      "Regístrate para empezar con tu AmorIA. Podrás cambiar de plan más tarde.",
    selectedLabel: "Plan seleccionado:",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passwordHint: "Mínimo 6 caracteres.",
    submit: "Crear mi cuenta",
    or: "o",
    continueGoogle: "Continuar con Google",
    already: "¿Ya tienes cuenta?",
    loginLink: "Iniciar sesión",
    errorGeneric:
      "Se produjo un error al crear la cuenta. Inténtalo de nuevo.",
    infoAfterSignup:
      "Se ha enviado un correo de confirmación. Revisa tu bandeja de entrada.",
  },
} satisfies Record<Locale, any>;

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get("lang"));
  const plan = normalizePlan(searchParams.get("plan"));

  const t = COPY[locale];
  const planTitle = PLAN_TITLES[locale][plan];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
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

    // Message informatif (email de confirmation)
    setInfo(t.infoAfterSignup);

    // 🔴 LOGIQUE IMPORTANTE : redirection selon le plan
    if (plan === "free") {
      // Plan gratuit → on va directement configurer l’AmorIA
      const params = new URLSearchParams();
      params.set("plan", "free");
      params.set("lang", locale);
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      // Plan payant → étape paiement
      const params = new URLSearchParams();
      params.set("plan", plan);
      params.set("lang", locale);
      router.push(`/payment?${params.toString()}`);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setInfo(null);
    setLoadingGoogle(true);

    const redirectTo = `${window.location.origin}/auth/callback?plan=${plan}&lang=${locale}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    setLoadingGoogle(false);

    if (error) {
      setError(error.message || t.errorGeneric);
    }
  };

  const handleGoToLogin = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/login?${params.toString()}`);
  };

  return (
    <main className="amoria-root amoria-auth-root">
      <div className="amoria-auth-wrapper">
        <div className="amoria-auth-card">
          {/* Logo + titre */}
          <header className="amoria-auth-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmorIA logo"
              className="amoria-auth-logo"
            />
            <div>
              <h1 className="amoria-auth-title">{t.title}</h1>
              <p className="amoria-auth-subtitle">{t.subtitle}</p>
            </div>
          </header>

          {/* Forfait sélectionné */}
          <section className="amoria-auth-plan">
            <p className="amoria-auth-plan-label">
              {t.selectedLabel}{" "}
              <span className="amoria-auth-plan-value">{planTitle}</span>
            </p>
          </section>

          {/* Formulaire email / mot de passe */}
          <form onSubmit={handleSubmit} className="amoria-auth-form">
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
            {info && <p className="amoria-auth-info">{info}</p>}

            <button
              type="submit"
              className="amoria-auth-primary"
              disabled={loadingEmail || loadingGoogle}
            >
              {loadingEmail ? "..." : t.submit}
            </button>
          </form>

          {/* Séparateur + Google */}
          <div className="amoria-auth-separator">
            <span>{t.or}</span>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="amoria-auth-google"
            disabled={loadingEmail || loadingGoogle}
          >
            {loadingGoogle ? "..." : t.continueGoogle}
          </button>

          {/* Lien vers login */}
          <p className="amoria-auth-footer">
            {t.already}{" "}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="amoria-auth-link"
            >
              {t.loginLink}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
