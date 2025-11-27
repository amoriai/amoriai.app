"use client";

export const dynamic = "force-dynamic";

import React, { FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

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
    email: "Adresse courriel",
    password: "Mot de passe",
    passwordHint: "Minimum 6 caractères.",
    selectedPlan: "Forfait sélectionné :",
    createAccount: "Créer mon compte",
    or: "ou",
    continueGoogle: "Continuer avec Google",
    already: "Tu as déjà un compte ?",
    login: "Me connecter",
    genericError:
      "Une erreur est survenue pendant la création de ton compte. Réessaie dans quelques instants.",
  },
  en: {
    title: "Create my AmorIA account",
    subtitle:
      "Sign up to start with your AmorIA. You can change your plan later.",
    email: "Email address",
    password: "Password",
    passwordHint: "Minimum 6 characters.",
    selectedPlan: "Selected plan:",
    createAccount: "Create my account",
    or: "or",
    continueGoogle: "Continue with Google",
    already: "Already have an account?",
    login: "Log in",
    genericError:
      "Something went wrong while creating your account. Please try again.",
  },
  es: {
    title: "Crear mi cuenta AmorIA",
    subtitle:
      "Regístrate para empezar con tu AmorIA. Podrás cambiar de plan más tarde.",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordHint: "Mínimo 6 caracteres.",
    selectedPlan: "Plan seleccionado:",
    createAccount: "Crear mi cuenta",
    or: "o",
    continueGoogle: "Continuar con Google",
    already: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    genericError:
      "Ocurrió un error al crear tu cuenta. Inténtalo de nuevo.",
  },
} satisfies Record<Locale, any>;

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (raw === "chat" || raw === "plus" || raw === "unlimited" || raw === "free")
    return raw;
  return "free";
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get("lang"));
  const plan = normalizePlan(searchParams.get("plan"));

  const t = COPY[locale];
  const planLabel = PLAN_LABELS[locale][plan];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(error.message || t.genericError);
      return;
    }

    // On garde la langue + le plan dans l’URL
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", plan);

    // 🔁 LOGIQUE IMPORTANTE
    // - plan gratuit  => on saute Stripe → création d’AmorIA
    // - plan payant   => on va sur la page /payment qui ouvre Stripe
    if (plan === "free") {
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      router.push(`/payment?${params.toString()}`);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoadingGoogle(true);

    try {
      const params = new URLSearchParams();
      params.set("lang", locale);
      params.set("plan", plan);

      const redirectTo =
        window.location.origin + `/auth/callback?${params.toString()}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setError(error.message || t.genericError);
        setLoadingGoogle(false);
      }
    } catch (err: any) {
      setError(err?.message || t.genericError);
      setLoadingGoogle(false);
    }
  };

  const goToLogin = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/login?${params.toString()}`);
  };

  return (
    <main className="amoria-root amoria-signup-root">
      <div className="amoria-signup-wrapper">
        <div className="amoria-signup-card">
          <header className="amoria-signup-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmorIA logo"
              className="amoria-signup-logo"
            />
            <div>
              <h1 className="amoria-signup-title">{t.title}</h1>
              <p className="amoria-signup-subtitle">{t.subtitle}</p>
            </div>
          </header>

          <section className="amoria-signup-plan">
            <p className="amoria-signup-plan-label">{t.selectedPlan}</p>
            <p className="amoria-signup-plan-value">{planLabel}</p>
          </section>

          <form className="amoria-signup-form" onSubmit={handleSubmit}>
            <label className="amoria-signup-field">
              <span>{t.email}</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="amoria-signup-field">
              <span>{t.password}</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small>{t.passwordHint}</small>
            </label>

            {error && <p className="amoria-signup-error">{error}</p>}

            <button
              type="submit"
              className="amoria-signup-primary"
              disabled={loadingEmail || !email || !password}
            >
              {loadingEmail ? "..." : t.createAccount}
            </button>
          </form>

          <div className="amoria-signup-separator">
            <span>{t.or}</span>
          </div>

          <button
            type="button"
            className="amoria-signup-google"
            onClick={handleGoogle}
            disabled={loadingGoogle}
          >
            {t.continueGoogle}
          </button>

          <p className="amoria-signup-footer">
            {t.already}{" "}
            <button
              type="button"
              onClick={goToLogin}
              className="amoria-signup-link"
            >
              {t.login}
            </button>
          </p>
        </div>
      </div>

      <style jsx global>{`
        .amoria-signup-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .amoria-signup-wrapper {
          max-width: 480px;
          width: 100%;
        }

        .amoria-signup-card {
          background: radial-gradient(circle at top, #020617, #020617 40%, #000 100%);
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1.6rem 1.5rem 1.4rem;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.9);
        }

        .amoria-signup-header {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .amoria-signup-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }

        .amoria-signup-title {
          margin: 0 0 0.2rem;
          font-size: 1.2rem;
        }

        .amoria-signup-subtitle {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amoria-signup-plan {
          border-radius: 0.9rem;
          padding: 0.75rem 0.9rem;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.6);
          margin-bottom: 1rem;
        }

        .amoria-signup-plan-label {
          margin: 0;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-signup-plan-value {
          margin: 0.2rem 0 0;
          font-size: 0.95rem;
        }

        .amoria-signup-form {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .amoria-signup-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
        }

        .amoria-signup-field span {
          color: #e5e7eb;
        }

        .amoria-signup-field input {
          border-radius: 0.8rem;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.9);
          color: #f9fafb;
          padding: 0.55rem 0.75rem;
          font-size: 0.86rem;
        }

        .amoria-signup-field small {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .amoria-signup-error {
          margin: 0.35rem 0 0;
          padding: 0.45rem 0.6rem;
          border-radius: 0.6rem;
          background: rgba(248, 113, 113, 0.12);
          color: #fecaca;
          font-size: 0.78rem;
        }

        .amoria-signup-primary {
          margin-top: 0.4rem;
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

        .amoria-signup-primary:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .amoria-signup-separator {
          margin: 0.9rem 0 0.5rem;
          text-align: center;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-signup-google {
          width: 100%;
          border-radius: 999px;
          padding: 0.65rem 1rem;
          font-size: 0.86rem;
          cursor: pointer;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
        }

        .amoria-signup-footer {
          margin-top: 0.75rem;
          text-align: center;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-signup-link {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          color: #e5e7eb;
          cursor: pointer;
          font-size: 0.8rem;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .amoria-signup-card {
            padding-inline: 1.1rem;
          }
        }
      `}</style>
    </main>
  );
}
