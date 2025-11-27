"use client";

import React, { useState, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited") {
    return raw;
  }
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

const COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    passwordHint: string;
    selectedPlan: string;
    submit: string;
    or: string;
    continueGoogle: string;
    alreadyAccount: string;
    login: string;
    errorGeneric: string;
    backHome: string;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIA",
    subtitle:
      "Inscris-toi pour commencer avec ton AmorIA. Tu pourras changer de forfait plus tard.",
    email: "Adresse courriel",
    password: "Mot de passe",
    passwordHint: "Minimum 6 caractères.",
    selectedPlan: "Forfait sélectionné :",
    submit: "Créer mon compte",
    or: "ou",
    continueGoogle: "Continuer avec Google",
    alreadyAccount: "Tu as déjà un compte ?",
    login: "Me connecter",
    errorGeneric:
      "Une erreur est survenue pendant la création du compte. Réessaie dans quelques instants.",
    backHome: "Retour à l’accueil",
  },
  en: {
    title: "Create my AmorIA account",
    subtitle:
      "Sign up to start with your AmorIA. You can change your plan later.",
    email: "Email address",
    password: "Password",
    passwordHint: "At least 6 characters.",
    selectedPlan: "Selected plan:",
    submit: "Create my account",
    or: "or",
    continueGoogle: "Continue with Google",
    alreadyAccount: "Already have an account?",
    login: "Log in",
    errorGeneric:
      "Something went wrong while creating your account. Please try again.",
    backHome: "Back to homepage",
  },
  es: {
    title: "Crear mi cuenta AmorIA",
    subtitle:
      "Regístrate para empezar con tu AmorIA. Podrás cambiar de plan más adelante.",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordHint: "Mínimo 6 caracteres.",
    selectedPlan: "Plan seleccionado:",
    submit: "Crear mi cuenta",
    or: "o",
    continueGoogle: "Continuar con Google",
    alreadyAccount: "¿Ya tienes cuenta?",
    login: "Iniciar sesión",
    errorGeneric:
      "Se produjo un error al crear la cuenta. Inténtalo de nuevo.",
    backHome: "Volver al inicio",
  },
};

function SignupPageInner() {
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

  const redirectParams = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", plan);
    return params.toString();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message || t.errorGeneric);
      setLoadingEmail(false);
      return;
    }

    const query = redirectParams();

    if (plan === "free") {
      router.push(`/create-amoria?${query}`);
    } else {
      router.push(`/payment?${query}`);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoadingGoogle(true);

    let redirectTo: string | undefined;
    if (typeof window !== "undefined") {
      redirectTo = `${window.location.origin}/oauth-callback?${redirectParams()}`;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: redirectTo ? { redirectTo } : undefined,
    });

    if (error) {
      setError(error.message || t.errorGeneric);
      setLoadingGoogle(false);
    }
  };

  const handleBackHome = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleGoLogin = () => {
    const params = new URLSearchParams();
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

          <section className="amoria-auth-plan">
            <span className="amoria-auth-plan-label">{t.selectedPlan}</span>
            <span className="amoria-auth-plan-value">{planTitle}</span>
          </section>

          <form className="amoria-auth-form" onSubmit={handleSubmit}>
            <label className="amoria-auth-label">
              {t.email}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="amoria-auth-input"
              />
            </label>

            <label className="amoria-auth-label">
              {t.password}
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
              className="amoria-auth-primary"
              disabled={loadingEmail || loadingGoogle}
            >
              {loadingEmail ? "…" : t.submit}
            </button>
          </form>

          <div className="amoria-auth-divider">
            <span>{t.or}</span>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loadingEmail || loadingGoogle}
            className="amoria-auth-google"
          >
            {t.continueGoogle}
          </button>

          <div className="amoria-auth-footer">
            <button
              type="button"
              onClick={handleGoLogin}
              className="amoria-auth-link"
            >
              {t.alreadyAccount} <strong>{t.login}</strong>
            </button>

            <button
              type="button"
              onClick={handleBackHome}
              className="amoria-auth-back"
            >
              {t.backHome}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .amoria-auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .amoria-auth-wrapper {
          max-width: 480px;
          width: 100%;
        }

        .amoria-auth-card {
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1.8rem 1.7rem 1.5rem;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.9);
        }

        .amoria-auth-header {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: 1.4rem;
        }

        .amoria-auth-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }

        .amoria-auth-title {
          font-size: 1.25rem;
          margin: 0 0 0.2rem;
        }

        .amoria-auth-subtitle {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amoria-auth-plan {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 0.9rem;
          padding: 0.6rem 0.9rem;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.6);
          margin-bottom: 1rem;
          font-size: 0.82rem;
        }

        .amoria-auth-plan-label {
          color: #9ca3af;
        }

        .amoria-auth-plan-value {
          font-weight: 500;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .amoria-auth-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.82rem;
        }

        .amoria-auth-input {
          border-radius: 0.7rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          padding: 0.55rem 0.7rem;
          background: rgba(15, 23, 42, 0.9);
          color: #f9fafb;
          font-size: 0.85rem;
        }

        .amoria-auth-input:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.6);
        }

        .amoria-auth-hint {
          font-size: 0.72rem;
          color: #9ca3af;
        }

        .amoria-auth-error {
          margin: 0.4rem 0 0;
          padding: 0.5rem 0.7rem;
          border-radius: 0.6rem;
          background: rgba(248, 113, 113, 0.12);
          color: #fecaca;
          font-size: 0.78rem;
        }

        .amoria-auth-primary {
          margin-top: 0.3rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-auth-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.9rem 0 0.7rem;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-auth-divider::before,
        .amoria-auth-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(148, 163, 184, 0.4);
          margin: 0 0.6rem;
        }

        .amoria-auth-google {
          width: 100%;
          border-radius: 999px;
          padding: 0.65rem 1rem;
          font-size: 0.86rem;
          cursor: pointer;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
        }

        .amoria-auth-footer {
          margin-top: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-size: 0.8rem;
        }

        .amoria-auth-link,
        .amoria-auth-back {
          border: none;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          text-align: left;
        }

        .amoria-auth-link strong {
          color: #e5e7eb;
        }
      `}</style>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={<main className="amoria-root amoria-auth-root" />}
    >
      <SignupPageInner />
    </Suspense>
  );
}
