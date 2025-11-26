"use client";

import React, { FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    selectedPlanLabel: string;
    emailLabel: string;
    passwordLabel: string;
    submit: string;
    submitting: string;
    or: string;
    google: string;
    already: string;
    login: string;
    errorGeneric: string;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIA",
    subtitle:
      "Inscris-toi pour commencer avec ton AmorIA. Tu pourras changer de forfait plus tard.",
    selectedPlanLabel: "Forfait sélectionné :",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    submit: "Créer mon compte",
    submitting: "Création du compte…",
    or: "ou",
    google: "Continuer avec Google",
    already: "Tu as déjà un compte ?",
    login: "Me connecter",
    errorGeneric:
      "Impossible de créer ton compte. Vérifie tes informations ou réessaie.",
  },
  en: {
    title: "Create my AmorIA account",
    subtitle:
      "Sign up to start with your AmorIA. You can change your plan later.",
    selectedPlanLabel: "Selected plan:",
    emailLabel: "Email address",
    passwordLabel: "Password",
    submit: "Create my account",
    submitting: "Creating account…",
    or: "or",
    google: "Continue with Google",
    already: "Already have an account?",
    login: "Log in",
    errorGeneric:
      "We could not create your account. Please check your details or try again.",
  },
  es: {
    title: "Crear mi cuenta AmorIA",
    subtitle:
      "Regístrate para empezar con tu AmorIA. Podrás cambiar de plan más tarde.",
    selectedPlanLabel: "Plan seleccionado:",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    submit: "Crear mi cuenta",
    submitting: "Creando cuenta…",
    or: "o",
    google: "Continuar con Google",
    already: "¿Ya tienes cuenta?",
    login: "Iniciar sesión",
    errorGeneric:
      "No se pudo crear tu cuenta. Verifica tus datos o inténtalo de nuevo.",
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
  // par défaut : gratuit
  return "free";
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get("lang"));
  const plan = normalizePlan(searchParams.get("plan"));

  const t = STRINGS[locale];
  const planTitle = PLAN_TITLES[locale][plan];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error(signUpError);
        setError(t.errorGeneric);
        setSubmitting(false);
        return;
      }

      // après création du compte :
      const params = new URLSearchParams();
      params.set("plan", plan);
      params.set("lang", locale);

      if (plan === "free") {
        // plan gratuit → pas de Stripe
        router.push(`/create-amoria?${params.toString()}`);
      } else {
        // plan payant → page de paiement
        router.push(`/payment?${params.toString()}`);
      }
    } catch (err) {
      console.error(err);
      setError(t.errorGeneric);
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.set("plan", plan);
      params.set("lang", locale);

      // après Google, on repassera par /payment ou /create-amoria
      const redirectTo =
        `${window.location.origin}/payment?` + params.toString();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error(error);
        setError(t.errorGeneric);
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError(t.errorGeneric);
      setSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/login?${params.toString()}`);
  };

  return (
    <main className="amoria-root amoria-auth-root">
      <section className="amoria-auth-card">
        <header className="amoria-auth-header">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="AmorIA"
            className="amoria-auth-logo"
          />
          <div>
            <h1 className="amoria-auth-title">{t.title}</h1>
            <p className="amoria-auth-subtitle">{t.subtitle}</p>
          </div>
        </header>

        <div className="amoria-auth-plan">
          <span className="amoria-auth-plan-label">{t.selectedPlanLabel}</span>
          <span className="amoria-auth-plan-value">{planTitle}</span>
        </div>

        <form onSubmit={handleEmailSignup} className="amoria-auth-form">
          <label className="amoria-auth-label">
            {t.emailLabel}
            <input
              type="email"
              className="amoria-auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="amoria-auth-label">
            {t.passwordLabel}
            <input
              type="password"
              className="amoria-auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>

          {error && <p className="amoria-auth-error">{error}</p>}

          <button
            type="submit"
            className="amoria-auth-submit"
            disabled={submitting}
          >
            {submitting ? t.submitting : t.submit}
          </button>
        </form>

        <div className="amoria-auth-divider">
          <span>{t.or}</span>
        </div>

        <button
          type="button"
          className="amoria-auth-google"
          onClick={handleGoogleSignup}
          disabled={submitting}
        >
          {t.google}
        </button>

        <p className="amoria-auth-footer">
          {t.already}{" "}
          <button
            type="button"
            onClick={handleGoToLogin}
            className="amoria-auth-link-button"
          >
            {t.login}
          </button>
        </p>
      </section>

      <style jsx global>{`
        .amoria-auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .amoria-auth-card {
          width: 100%;
          max-width: 420px;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
          padding: 1.8rem 1.7rem 2rem;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-auth-header {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: 1.1rem;
        }

        .amoria-auth-logo {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .amoria-auth-title {
          font-size: 1.3rem;
          margin: 0 0 0.2rem;
        }

        .amoria-auth-subtitle {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amoria-auth-plan {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.7);
          font-size: 0.78rem;
          margin-bottom: 1.1rem;
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
          gap: 0.75rem;
        }

        .amoria-auth-label {
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .amoria-auth-input {
          border-radius: 0.9rem;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: #020617;
          color: #e5e7eb;
          padding: 0.6rem 0.8rem;
          font-size: 0.9rem;
        }

        .amoria-auth-error {
          font-size: 0.8rem;
          color: #fecaca;
          background: rgba(248, 113, 113, 0.12);
          border-radius: 0.6rem;
          padding: 0.4rem 0.6rem;
          margin-top: 0.2rem;
        }

        .amoria-auth-submit {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
        }

        .amoria-auth-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin: 0.9rem 0 0.7rem;
          font-size: 0.78rem;
          color: #6b7280;
        }

        .amoria-auth-divider::before,
        .amoria-auth-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(55, 65, 81, 0.9);
        }

        .amoria-auth-google {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.8);
          background: #0f172a;
          color: #e5e7eb;
          font-size: 0.9rem;
          padding: 0.7rem 1rem;
          cursor: pointer;
        }

        .amoria-auth-footer {
          margin-top: 0.9rem;
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-link-button {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          color: #f9a8d4;
          text-decoration: underline;
          font-size: 0.8rem;
        }
      `}</style>
    </main>
  );
}
