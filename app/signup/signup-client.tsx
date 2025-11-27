"use client";

import React, { useState, FormEvent } from "react";
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

const COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    selectedPlan: string;
    emailLabel: string;
    passwordLabel: string;
    passwordHint: string;
    submit: string;
    or: string;
    google: string;
    already: string;
    login: string;
    errorGeneric: string;
    infoCheckEmail: string;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIA",
    subtitle:
      "Inscris-toi pour commencer avec ton AmorIA. Tu pourras changer de forfait plus tard.",
    selectedPlan: "Forfait sélectionné :",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    passwordHint: "Minimum 6 caractères.",
    submit: "Créer mon compte",
    or: "ou",
    google: "Continuer avec Google",
    already: "Tu as déjà un compte ?",
    login: "Me connecter",
    errorGeneric:
      "Une erreur est survenue pendant la création du compte. Réessaie dans quelques instants.",
    infoCheckEmail:
      "Compte créé ! Vérifie ta boîte courriel pour confirmer ton adresse.",
  },
  en: {
    title: "Create my AmorIA account",
    subtitle:
      "Sign up to start with your AmorIA. You can change your plan later.",
    selectedPlan: "Selected plan:",
    emailLabel: "Email address",
    passwordLabel: "Password",
    passwordHint: "Minimum 6 characters.",
    submit: "Create my account",
    or: "or",
    google: "Continue with Google",
    already: "Already have an account?",
    login: "Log in",
    errorGeneric:
      "Something went wrong while creating your account. Please try again.",
    infoCheckEmail:
      "Account created! Please check your inbox to confirm your email.",
  },
  es: {
    title: "Crear mi cuenta AmorIA",
    subtitle:
      "Regístrate para empezar con tu AmorIA. Podrás cambiar de plan más tarde.",
    selectedPlan: "Plan seleccionado:",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passwordHint: "Mínimo 6 caracteres.",
    submit: "Crear mi cuenta",
    or: "o",
    google: "Continuar con Google",
    already: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    errorGeneric:
      "Se produjo un error al crear tu cuenta. Inténtalo de nuevo.",
    infoCheckEmail:
      "¡Cuenta creada! Revisa tu correo para confirmar tu dirección.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function SignupClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get("lang"));

  // ⚠️ Ici on NE force PLUS les plans inconnus à "free"
  const rawPlan = searchParams.get("plan");
  const isFree = !rawPlan || rawPlan === "free";

  // Pour l’affichage du libellé, on retombe sur un plan connu si nécessaire
  let planKey: PlanId = "free";
  if (rawPlan === "chat" || rawPlan === "plus" || rawPlan === "unlimited") {
    planKey = rawPlan;
  }
  const planLabel = PLAN_LABELS[locale][planKey];

  const t = COPY[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const goToNextStep = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    if (rawPlan) params.set("plan", rawPlan);

    if (isFree) {
      router.push(`/create-amoria?${params.toString()}`);
    } else {
      router.push(`/payment?${params.toString()}`);
    }
  };

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

    setInfo(t.infoCheckEmail);
    goToNextStep();
  };

  const handleGoogle = async () => {
    try {
      setError(null);
      setInfo(null);
      setLoadingGoogle(true);

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const params = new URLSearchParams();
      params.set("lang", locale);
      if (rawPlan) params.set("plan", rawPlan);

      const redirectTo = `${origin}/auth/callback?${params.toString()}`;

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

  const handleGoToLogin = () => {
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
            <span className="amoria-signup-plan-label">
              {t.selectedPlan} <strong>{planLabel}</strong>
            </span>
          </section>

          <form className="amoria-signup-form" onSubmit={handleSubmit}>
            <label className="amoria-signup-field">
              <span>{t.emailLabel}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="amoria-signup-field">
              <span>{t.passwordLabel}</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small>{t.passwordHint}</small>
            </label>

            {error && <p className="amoria-signup-error">{error}</p>}
            {info && <p className="amoria-signup-info">{info}</p>}

            <button
              type="submit"
              className="amoria-signup-primary"
              disabled={loadingEmail || loadingGoogle}
            >
              {loadingEmail ? "..." : t.submit}
            </button>
          </form>

          <div className="amoria-signup-separator">
            <span>{t.or}</span>
          </div>

          <button
            type="button"
            className="amoria-signup-google"
            onClick={handleGoogle}
            disabled={loadingEmail || loadingGoogle}
          >
            {loadingGoogle ? "..." : t.google}
          </button>

          <p className="amoria-signup-login">
            {t.already}{" "}
            <button type="button" onClick={handleGoToLogin}>
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
          font-size: 1.3rem;
          margin: 0 0 0.2rem;
        }

        .amoria-signup-subtitle {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amoria-signup-plan {
          margin-bottom: 1rem;
        }

        .amoria-signup-plan-label {
          font-size: 0.82rem;
          color: #e5e7eb;
        }

        .amoria-signup-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .amoria-signup-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.82rem;
        }

        .amoria-signup-field span {
          color: #e5e7eb;
        }

        .amoria-signup-field input {
          border-radius: 0.6rem;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.9);
          padding: 0.5rem 0.7rem;
          font-size: 0.85rem;
          color: #e5e7eb;
          outline: none;
        }

        .amoria-signup-field input:focus {
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.35);
        }

        .amoria-signup-field small {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .amoria-signup-error {
          margin: 0.1rem 0 0.3rem;
          padding: 0.45rem 0.7rem;
          border-radius: 0.6rem;
          background: rgba(248, 113, 113, 0.12);
          color: #fecaca;
          font-size: 0.78rem;
        }

        .amoria-signup-info {
          margin: 0.1rem 0 0.3rem;
          padding: 0.45rem 0.7rem;
          border-radius: 0.6rem;
          background: rgba(34, 197, 94, 0.12);
          color: #bbf7d0;
          font-size: 0.78rem;
        }

        .amoria-signup-primary {
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

        .amoria-signup-primary:disabled,
        .amoria-signup-google:disabled {
          opacity: 0.7;
          cursor: default;
        }

        .amoria-signup-separator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.9rem 0 0.7rem;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-signup-separator::before,
        .amoria-signup-separator::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(148, 163, 184, 0.5);
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

        .amoria-signup-login {
          margin-top: 0.8rem;
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-signup-login button {
          border: none;
          background: transparent;
          color: #e5e7eb;
          cursor: pointer;
          text-decoration: underline;
          font-size: 0.8rem;
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
