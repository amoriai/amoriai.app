"use client";

export const dynamic = "force-dynamic";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

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

const COPY_SIGNUP: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    passwordHint: string;
    createButton: string;
    or: string;
    googleButton: string;
    already: string;
    signin: string;
    errorGeneric: string;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIA",
    subtitle:
      "Inscris-toi pour commencer avec ton AmorIA. Tu pourras changer de forfait plus tard.",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    passwordHint: "Minimum 6 caractères.",
    createButton: "Créer mon compte",
    or: "ou",
    googleButton: "Continuer avec Google",
    already: "Tu as déjà un compte ?",
    signin: "Me connecter",
    errorGeneric:
      "Une erreur est survenue lors de la création du compte. Réessaie dans quelques instants.",
  },
  en: {
    title: "Create my AmorIA account",
    subtitle:
      "Sign up to start chatting with your AmorIA. You can change your plan later.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    passwordHint: "Minimum 6 characters.",
    createButton: "Create my account",
    or: "or",
    googleButton: "Continue with Google",
    already: "Already have an account?",
    signin: "Sign in",
    errorGeneric:
      "Something went wrong while creating your account. Please try again.",
  },
  es: {
    title: "Crear mi cuenta AmorIA",
    subtitle:
      "Regístrate para empezar con tu AmorIA. Podrás cambiar de plan más adelante.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passwordHint: "Mínimo 6 caracteres.",
    createButton: "Crear mi cuenta",
    or: "o",
    googleButton: "Continuar con Google",
    already: "¿Ya tienes una cuenta?",
    signin: "Iniciar sesión",
    errorGeneric:
      "Se produjo un error al crear la cuenta. Inténtalo de nuevo.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (raw === "chat" || raw === "plus" || raw === "unlimited" || raw === "free") {
    return raw;
  }
  return "free";
}

export default function SignupPage() {
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("fr");
  const [plan, setPlan] = useState<PlanId>("free");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Lire les paramètres de l’URL côté client
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLocale = params.get("lang");
    const urlPlan = params.get("plan");

    setLocale(normalizeLocale(urlLocale));
    setPlan(normalizePlan(urlPlan));
  }, []);

  const t = COPY_SIGNUP[locale];
  const planTitle = PLAN_TITLES[locale][plan];

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

    // Redirection selon le plan
    const params = new URLSearchParams();
    params.set("plan", plan);
    params.set("lang", locale);

    if (plan === "free") {
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      router.push(`/payment?${params.toString()}`);
    }
  };

  const handleGoogle = async () => {
    try {
      setError(null);
      setLoadingGoogle(true);

      const redirectTo = `${window.location.origin}/auth/callback?plan=${plan}&lang=${locale}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setError(error.message || t.errorGeneric);
        setLoadingGoogle(false);
      }
    } catch (err: any) {
      setError(err?.message || t.errorGeneric);
      setLoadingGoogle(false);
    }
  };

  const handleGoToSignin = () => {
    const params = new URLSearchParams();
    params.set("plan", plan);
    params.set("lang", locale);
    router.push(`/login?${params.toString()}`);
  };

  return (
    <main className="amoria-root amoria-auth-root">
      <div className="amoria-auth-wrapper">
        <div className="amoria-auth-card">
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

          <section className="amoria-auth-plan-pill">
            <span className="amoria-auth-plan-label">
              {locale === "fr"
                ? "Forfait sélectionné :"
                : locale === "en"
                ? "Selected plan:"
                : "Plan seleccionado:"}
            </span>
            <span className="amoria-auth-plan-value">{planTitle}</span>
          </section>

          <form className="amoria-auth-form" onSubmit={handleSubmit}>
            <label className="amoria-auth-label">
              <span>{t.emailLabel}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="amoria-auth-input"
              />
            </label>

            <label className="amoria-auth-label">
              <span>{t.passwordLabel}</span>
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
              {loadingEmail ? "…" : t.createButton}
            </button>
          </form>

          <div className="amoria-auth-separator">
            <span>{t.or}</span>
          </div>

          <button
            type="button"
            className="amoria-auth-google"
            onClick={handleGoogle}
            disabled={loadingEmail || loadingGoogle}
          >
            {loadingGoogle ? "…" : t.googleButton}
          </button>

          <footer className="amoria-auth-footer">
            <span>{t.already}</span>{" "}
            <button
              type="button"
              onClick={handleGoToSignin}
              className="amoria-auth-link"
            >
              {t.signin}
            </button>
          </footer>
        </div>
      </div>
    </main>
  );
}
