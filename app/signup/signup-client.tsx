"use client";

import React, { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

/* ===========================
   LABELS
=========================== */

const LABELS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordHint: string;
    submit: string;
    submitting: string;
    google: string;
    alreadyHave: string;
    login: string;
    errorGeneric: string;
    noPlanInfo: string;
    planPrefix: string;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIAI",
    subtitle: "Étape 1 : crée ton compte. Ton AmorIAI sera prêt juste après.",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Choisis un mot de passe sécurisé",
    passwordHint: "Minimum 6 caractères.",
    submit: "Créer mon compte",
    submitting: "Création du compte…",
    google: "Continuer avec Google",
    alreadyHave: "Tu as déjà un compte ?",
    login: "Me connecter",
    errorGeneric: "Une erreur est survenue. Merci de réessayer.",
    noPlanInfo: "Ton AmorIAI sera créé automatiquement.",
    planPrefix: "Forfait sélectionné : ",
  },
  en: {
    title: "Create my AmorIAI account",
    subtitle:
      "Step 1: create your account. Your AmorIAI will be ready right after.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    passwordPlaceholder: "Choose a secure password",
    passwordHint: "At least 6 characters.",
    submit: "Create my account",
    submitting: "Creating your account…",
    google: "Continue with Google",
    alreadyHave: "Already have an account?",
    login: "Log in",
    errorGeneric: "An error occurred. Please try again.",
    noPlanInfo: "Your AmorIAI will be created instantly.",
    planPrefix: "Selected plan: ",
  },
  es: {
    title: "Crear mi cuenta AmorIAI",
    subtitle:
      "Paso 1: crea tu cuenta. Tu AmorIAI estará listo enseguida.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Elige una contraseña segura",
    passwordHint: "Mínimo 6 caracteres.",
    submit: "Crear mi cuenta",
    submitting: "Creando tu cuenta…",
    google: "Continuar con Google",
    alreadyHave: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    errorGeneric: "Ocurrió un error. Inténtalo de nuevo.",
    noPlanInfo: "Tu AmorIAI se creará al instante.",
    planPrefix: "Plan seleccionado: ",
  },
};

const PLAN_NAMES: Record<Locale, Record<PlanId, string>> = {
  fr: {
    free: "Découverte (gratuit)",
    chat: "Chat",
    plus: "AmorIAI Plus",
    unlimited: "AmorIAI illimité",
  },
  en: {
    free: "Discovery (free)",
    chat: "Chat",
    plus: "AmorIAI Plus",
    unlimited: "AmorIAI Unlimited",
  },
  es: {
    free: "Descubrimiento (gratis)",
    chat: "Chat",
    plus: "AmorIAI Plus",
    unlimited: "AmorIAI Ilimitado",
  },
};

/* ===========================
   COMPONENT
=========================== */

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") as Locale) || "fr";
  const planParam = searchParams.get("plan") as PlanId | null;
  const t = LABELS[localeParam];

  const planLabel = planParam
    ? PLAN_NAMES[localeParam][planParam]
    : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===========================
     ✅ REDIRECTION APRÈS SIGINUP (SANS BOUCLE)
  =========================== */

  const redirectAfterSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);

    if (!planParam || planParam === "free") {
      params.set("plan", "free");
      router.replace(`/create-amoria?${params.toString()}`);
    } else {
      params.set("plan", planParam);
      router.replace(`/payment?${params.toString()}`);
    }
  };

  /* ===========================
     ✅ EMAIL / PASSWORD SIGNUP
  =========================== */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    // ✅ On nettoie toute session fantôme avant un signup
    await supabase.auth.signOut();

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

  /* ===========================
     ✅ GOOGLE OAUTH PROPRE
  =========================== */

  const handleGoogleSignup = async () => {
    try {
      setError(null);
      setLoadingGoogle(true);

      // ✅ Nettoyage session avant OAuth
      await supabase.auth.signOut();

      const base = window.location.origin;
      const params = new URLSearchParams();
      params.set("lang", localeParam);

      let redirectTo: string;

      if (!planParam || planParam === "free") {
        params.set("plan", "free");
        redirectTo = `${base}/create-amoria?${params.toString()}`;
      } else {
        params.set("plan", planParam);
        redirectTo = `${base}/payment?${params.toString()}`;
      }

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

  /* ===========================
     ✅ UI
  =========================== */

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-black p-6 shadow-2xl">

        <h1 className="mb-1 text-xl font-semibold">{t.title}</h1>
        <p className="mb-3 text-sm text-slate-300">{t.subtitle}</p>

        {planLabel ? (
          <p className="mb-4 text-xs text-emerald-400">
            {t.planPrefix} {planLabel}
          </p>
        ) : (
          <p className="mb-4 text-xs text-slate-400">{t.noPlanInfo}</p>
        )}

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loadingGoogle || loadingEmail}
          className="mb-4 w-full rounded-full border px-4 py-2.5 text-sm"
        >
          {loadingGoogle ? "…" : t.google}
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <label className="text-xs">
            {t.emailLabel}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 text-black"
            />
          </label>

          <label className="text-xs">
            {t.passwordLabel}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
                placeholder={t.passwordPlaceholder}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2 top-2 text-xs"
              >
                👁
              </button>
            </div>
            <span className="text-[0.7rem] text-slate-400">
              {t.passwordHint}
            </span>
          </label>

          {error && (
            <p className="rounded bg-red-900 px-3 py-2 text-xs">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loadingEmail || loadingGoogle}
            className="mt-2 w-full rounded-full bg-fuchsia-600 px-4 py-2.5 text-sm"
          >
            {loadingEmail ? t.submitting : t.submit}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          {t.alreadyHave}{" "}
          <a
            href={`/login?lang=${localeParam}`}
            className="text-white underline"
          >
            {t.login}
          </a>
        </p>

      </section>
    </main>
  );
}
