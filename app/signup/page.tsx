"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

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

const PLAN_LABELS: Record<Locale, Record<PlanId, string>> = {
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
    selectedPlanPrefix: "Forfait sélectionné : ",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    passwordHint: "Minimum 6 caractères.",
    createButton: "Créer mon compte",
    or: "ou",
    continueGoogle: "Continuer avec Google",
    already: "Tu as déjà un compte ?",
    login: "Me connecter",
    errorGeneric: "Une erreur est survenue. Réessaie dans quelques instants.",
  },
  en: {
    title: "Create my AmorIA account",
    subtitle:
      "Sign up to start with your AmorIA. You can change your plan later.",
    selectedPlanPrefix: "Selected plan: ",
    emailLabel: "Email address",
    passwordLabel: "Password",
    passwordHint: "Minimum 6 characters.",
    createButton: "Create my account",
    or: "or",
    continueGoogle: "Continue with Google",
    already: "Already have an account?",
    login: "Log in",
    errorGeneric: "Something went wrong. Please try again.",
  },
  es: {
    title: "Crear mi cuenta AmorIA",
    subtitle:
      "Regístrate para empezar con tu AmorIA. Podrás cambiar de plan más tarde.",
    selectedPlanPrefix: "Plan seleccionado: ",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passwordHint: "Mínimo 6 caracteres.",
    createButton: "Crear mi cuenta",
    or: "o",
    continueGoogle: "Continuar con Google",
    already: "¿Ya tienes cuenta?",
    login: "Iniciar sesión",
    errorGeneric: "Se produjo un error. Inténtalo de nuevo.",
  },
};

export default function SignupPage() {
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("fr");
  const [plan, setPlan] = useState<PlanId>("free");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lecture des query params côté client
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawPlan = params.get("plan");
    const rawLang = params.get("lang");

    setLocale(normalizeLocale(rawLang));
    setPlan(normalizePlan(rawPlan));
  }, []);

  const t = COPY[locale];
  const planLabel = PLAN_LABELS[locale][plan];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: supaError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (supaError) {
        setError(supaError.message || t.errorGeneric);
        setLoading(false);
        return;
      }

      const qs = new URLSearchParams();
      qs.set("plan", plan);
      qs.set("lang", locale);

      if (plan === "free") {
        router.push(`/create-amoria?${qs.toString()}`);
      } else {
        router.push(`/payment?${qs.toString()}`);
      }
    } catch (err: any) {
      setError(err?.message || t.errorGeneric);
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const qs = new URLSearchParams();
    qs.set("lang", locale);
    router.push(`/login?${qs.toString()}`);
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

          <div className="amoria-auth-plan-pill">
            {t.selectedPlanPrefix}
            <strong>{planLabel}</strong>
          </div>

          <form className="amoria-auth-form" onSubmit={handleSubmit}>
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
                required
                minLength={6}
              />
              <span className="amoria-auth-hint">{t.passwordHint}</span>
            </label>

            {error && <p className="amoria-auth-error">{error}</p>}

            <button
              type="submit"
              className="amoria-auth-primary"
              disabled={loading}
            >
              {loading ? "..." : t.createButton}
            </button>
          </form>

          <div className="amoria-auth-or">
            <span>{t.or}</span>
          </div>

          <button
            type="button"
            className="amoria-auth-google"
            // login Google plus tard
          >
            {t.continueGoogle}
          </button>

          <div className="amoria-auth-footer">
            <span>{t.already} </span>
            <button
              type="button"
              className="amoria-auth-link"
              onClick={handleLogin}
            >
              {t.login}
            </button>
          </div>
        </div>
      </div>

      {/* STYLES DE LA PAGE SIGNUP */}
      <style jsx global>{`
        .amoria-auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617, #020617 40%, #000 100%);
          color: #f9fafb;
        }

        .amoria-auth-wrapper {
          max-width: 480px;
          width: 100%;
        }

        .amoria-auth-card {
          background: rgba(15, 23, 42, 0.96);
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          padding: 1.9rem 1.7rem 1.6rem;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.9);
        }

        .amoria-auth-header {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: 1.4rem;
        }

        .amoria-auth-logo {
          width: 56px;
          height: 56px;
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

        .amoria-auth-plan-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          border: 1px solid rgba(248, 250, 252, 0.25);
          background: rgba(15, 23, 42, 0.9);
          font-size: 0.78rem;
          margin-bottom: 1rem;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .amoria-auth-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.82rem;
        }

        .amoria-auth-input {
          border-radius: 0.7rem;
          border: 1px solid rgba(148, 163, 184, 0.8);
          padding: 0.55rem 0.75rem;
          font-size: 0.9rem;
          background: rgba(15, 23, 42, 0.95);
          color: #f9fafb;
          outline: none;
        }

        .amoria-auth-input:focus {
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.6);
        }

        .amoria-auth-hint {
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .amoria-auth-error {
          margin: 0.2rem 0 0.3rem;
          padding: 0.45rem 0.6rem;
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
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-auth-or {
          display: flex;
          justify-content: center;
          margin: 0.8rem 0 0.4rem;
          font-size: 0.8rem;
          color: #9ca3af;
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
          margin-top: 0.8rem;
          text-align: center;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-auth-link {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          color: #fb37ff;
          font-size: 0.8rem;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .amoria-auth-card {
            padding-inline: 1.2rem;
          }
        }
      `}</style>
    </main>
  );
}
