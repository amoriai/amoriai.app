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

      // Après inscription :
      // - plan gratuit → direct vers la création d’AmorIA
      // - plan payant  → page de paiement Stripe
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
            // tu brancheras ton login Google ici plus tard
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
    </main>
  );
}
