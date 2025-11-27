"use client";

import React, { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type PlanId = "free" | "chat" | "plus" | "unlimited";
type Locale = "fr" | "en" | "es";

const LABELS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    passwordHint: string;
    createButton: string;
    alreadyHave: string;
    login: string;
    selectedPlanPrefix: string;
    google: string;
    errorGeneric: string;
    planNames: Record<PlanId, string>;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIAI",
    subtitle:
      "Inscris-toi pour commencer avec ton AmorIAI. Tu pourras changer de forfait plus tard.",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    passwordHint: "Minimum 6 caractères.",
    createButton: "Créer mon compte",
    alreadyHave: "Tu as déjà un compte ?",
    login: "Me connecter",
    selectedPlanPrefix: "Forfait sélectionné :",
    google: "Continuer avec Google",
    errorGeneric: "Une erreur est survenue. Merci de réessayer.",
    planNames: {
      free: "Découverte (gratuit)",
      chat: "AmorIAI Chat",
      plus: "AmorIAI Plus",
      unlimited: "AmorIAI illimité",
    },
  },
  en: {
    title: "Create my AmorIAI account",
    subtitle:
      "Sign up to start with your AmorIAI. You can change plan later.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    passwordHint: "At least 6 characters.",
    createButton: "Create my account",
    alreadyHave: "Already have an account?",
    login: "Log in",
    selectedPlanPrefix: "Selected plan:",
    google: "Continue with Google",
    errorGeneric: "An error occurred. Please try again.",
    planNames: {
      free: "Discovery (free)",
      chat: "AmorIAI Chat",
      plus: "AmorIAI Plus",
      unlimited: "AmorIAI Unlimited",
    },
  },
  es: {
    title: "Crear mi cuenta AmorIAI",
    subtitle:
      "Regístrate para empezar con tu AmorIAI. Podrás cambiar de plan más tarde.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passwordHint: "Mínimo 6 caracteres.",
    createButton: "Crear mi cuenta",
    alreadyHave: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    selectedPlanPrefix: "Plan seleccionado:",
    google: "Continuar con Google",
    errorGeneric: "Ocurrió un error. Inténtalo de nuevo.",
    planNames: {
      free: "Descubrimiento (gratis)",
      chat: "AmorIAI Chat",
      plus: "AmorIAI Plus",
      unlimited: "AmorIAI Ilimitado",
    },
  },
};

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- locale depuis l’URL, avec fallback sécurisé ---
  const localeFromUrl = searchParams.get("lang");
  const locale: Locale =
    localeFromUrl === "en" || localeFromUrl === "es" || localeFromUrl === "fr"
      ? localeFromUrl
      : "fr";

  // --- plan depuis l’URL, avec fallback sécurisé ---
  const planFromUrl = searchParams.get("plan");
  let initialPlan: PlanId = "free";
  if (planFromUrl === "chat" || planFromUrl === "plus" || planFromUrl === "unlimited") {
    initialPlan = planFromUrl;
  }

  const t = LABELS[locale];

  const [plan, setPlan] = useState<PlanId>(initialPlan);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlanLabel = t.planNames[plan];

  // 👉 Après création du compte, on décide où aller en fonction du plan choisi
  const redirectAfterSignup = () => {
    if (plan === "free") {
      router.push(`/create-amoria?lang=${locale}&plan=${plan}`);
    } else {
      router.push(`/payment?lang=${locale}&plan=${plan}`);
    }
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

    // Supabase envoie l’email de confirmation
    redirectAfterSignup();
  };

  const handleGoogleSignup = async () => {
    try {
      setError(null);
      setLoadingGoogle(true);

      const redirectTo =
        plan === "free"
          ? `${window.location.origin}/create-amoria?lang=${locale}&plan=${plan}`
          : `${window.location.origin}/payment?lang=${locale}&plan=${plan}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
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
        <h1 className="amoria-auth-title">{t.title}</h1>
        <p className="amoria-auth-subtitle">{t.subtitle}</p>

        {/* Sélecteur de plan */}
        <div className="amoria-auth-plan-picker">
          <p className="amoria-auth-plan-picker-label">
            {t.selectedPlanPrefix}{" "}
            <span className="amoria-auth-plan-name">{selectedPlanLabel}</span>
          </p>
          <div className="amoria-auth-plan-options">
            <button
              type="button"
              className={
                "amoria-auth-plan-option" +
                (plan === "free" ? " amoria-auth-plan-option--active" : "")
              }
              onClick={() => setPlan("free")}
            >
              {t.planNames.free}
            </button>
            <button
              type="button"
              className={
                "amoria-auth-plan-option" +
                (plan === "chat" ? " amoria-auth-plan-option--active" : "")
              }
              onClick={() => setPlan("chat")}
            >
              {t.planNames.chat}
            </button>
            <button
              type="button"
              className={
                "amoria-auth-plan-option" +
                (plan === "plus" ? " amoria-auth-plan-option--active" : "")
              }
              onClick={() => setPlan("plus")}
            >
              {t.planNames.plus}
            </button>
            <button
              type="button"
              className={
                "amoria-auth-plan-option" +
                (plan === "unlimited" ? " amoria-auth-plan-option--active" : "")
              }
              onClick={() => setPlan("unlimited")}
            >
              {t.planNames.unlimited}
            </button>
          </div>
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

          <button
            type="submit"
            className="amoria-auth-btn-primary"
            disabled={loadingEmail || loadingGoogle}
          >
            {loadingEmail ? "..." : t.createButton}
          </button>
        </form>

        <div className="amoria-auth-divider">ou</div>

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
            href={`/login?lang=${locale}`}
            className="amoria-auth-footer-link"
          >
            {t.login}
          </a>
        </p>
      </div>

      <style jsx global>{`
        .amoria-auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #020617 0, #000 100%);
          color: #e5e7eb;
          padding: 1.5rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-auth-card {
          width: 100%;
          max-width: 480px;
          border-radius: 1.5rem;
          padding: 1.8rem 1.9rem 2rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.35);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.7);
        }

        .amoria-auth-title {
          font-size: 1.2rem;
          margin-bottom: 0.35rem;
        }

        .amoria-auth-subtitle {
          font-size: 0.85rem;
          color: #9ca3af;
          margin-bottom: 0.9rem;
        }

        .amoria-auth-plan-picker {
          margin-bottom: 1.1rem;
        }

        .amoria-auth-plan-picker-label {
          font-size: 0.8rem;
          margin-bottom: 0.45rem;
          color: #9ca3af;
        }

        .amoria-auth-plan-name {
          font-weight: 600;
          color: #e5e7eb;
        }

        .amoria-auth-plan-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .amoria-auth-plan-option {
          flex: 1 1 48%;
          min-width: 46%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.45);
          padding: 0.35rem 0.8rem;
          font-size: 0.76rem;
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
          cursor: pointer;
          text-align: left;
        }

        .amoria-auth-plan-option--active {
          border-color: #fb37ff;
          background: radial-gradient(
            circle at top,
            rgba(251, 55, 255, 0.14),
            rgba(15, 23, 42, 0.9)
          );
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.35);
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .amoria-auth-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .amoria-auth-input {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 0.55rem 0.9rem;
          background: rgba(15, 23, 42, 0.9);
          color: #f9fafb;
          font-size: 0.85rem;
        }

        .amoria-auth-input:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-auth-hint {
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .amoria-auth-error {
          font-size: 0.78rem;
          color: #fecaca;
          background: rgba(185, 28, 28, 0.18);
          border-radius: 0.75rem;
          padding: 0.45rem 0.6rem;
          margin-top: 0.3rem;
        }

        .amoria-auth-btn-primary {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1.2rem;
          font-size: 0.9rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          cursor: pointer;
        }

        .amoria-auth-btn-primary:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .amoria-auth-divider {
          margin: 1rem 0 0.7rem;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-btn-google {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.45);
          padding: 0.6rem 1.2rem;
          font-size: 0.86rem;
          background: rgba(15, 23, 42, 0.95);
          color: #f9fafb;
          cursor: pointer;
        }

        .amoria-auth-btn-google:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .amoria-auth-footer {
          margin-top: 0.9rem;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-footer-link {
          color: #e5e7eb;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .amoria-auth-plan-option {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </main>
  );
}
