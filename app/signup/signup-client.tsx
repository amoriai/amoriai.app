"use client";

import React, { FormEvent, useState, useEffect } from "react";
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
  }
> = {
  fr: {
    title: "Créer mon compte AmorIAI",
    subtitle:
      "Étape 1 : crée ton compte. Ensuite tu choisiras ton forfait sur la page des tarifs.",
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
    noPlanInfo: "Tu choisiras ton forfait (gratuit ou payant) à l’étape suivante.",
  },
  en: {
    title: "Create my AmorIAI account",
    subtitle:
      "Step 1: create your account. Then you’ll choose your plan on the pricing page.",
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
    noPlanInfo: "You’ll choose your plan (free or paid) on the next step.",
  },
  es: {
    title: "Crear mi cuenta AmorIAI",
    subtitle:
      "Paso 1: crea tu cuenta. Luego elegirás tu plan en la página de precios.",
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
    noPlanInfo: "Elegirás tu plan (gratis o de pago) en el siguiente paso.",
  },
};

/* ===========================
   COMPONENT
=========================== */

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") as Locale) || "fr";

  // on récupère le plan passé depuis /pricing (ou on force "free")
  const planParam = searchParams.get("plan");
  const initialPlan: PlanId =
    planParam === "chat" ||
    planParam === "plus" ||
    planParam === "unlimited" ||
    planParam === "free"
      ? (planParam as PlanId)
      : "free";

  const t = LABELS[localeParam];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===========================
     ✅ SI DÉJÀ CONNECTÉ → PRICING
  =========================== */

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const params = new URLSearchParams();
        params.set("lang", localeParam);
        params.set("plan", initialPlan);
        router.replace(`/pricing?${params.toString()}`);
      }
    };
    checkSession();
  }, [localeParam, initialPlan, router]);

  /* ===========================
     ✅ REDIRECTION APRÈS SIGNUP
     → toujours vers /pricing?lang=..&plan=..
  =========================== */

  const redirectAfterSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);
    params.set("plan", initialPlan);
    router.replace(`/pricing?${params.toString()}`);
  };

  /* ===========================
     EMAIL SIGNUP
  =========================== */

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

    redirectAfterSignup();
  };

  /* ===========================
     GOOGLE OAUTH
  =========================== */

  const handleGoogleSignup = async () => {
    try {
      setError(null);
      setLoadingGoogle(true);

      const base = window.location.origin;
      const params = new URLSearchParams();
      params.set("lang", localeParam);
      params.set("plan", initialPlan);

      const redirectTo = `${base}/pricing?${params.toString()}`;

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
     UI
  =========================== */

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-8 text-slate-100"
      style={{
        background:
          "radial-gradient(circle at top,#020617 0,#020617 45%,#000 100%)",
      }}
    >
      <section className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-gradient-to-b from-slate-950 via-slate-950 to-black/95 p-6 shadow-2xl shadow-slate-950/90">
        {/* Titre */}
        <h1 className="mb-1 text-xl font-semibold">{t.title}</h1>
        <p className="mb-2 text-sm text-slate-300">{t.subtitle}</p>
        <p className="mb-4 text-xs text-slate-400">{t.noPlanInfo}</p>

        {/* Bouton Google */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loadingGoogle || loadingEmail}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-slate-500/80 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loadingGoogle ? "…" : t.google}
        </button>

        {/* Formulaire email/password */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-[0.8rem] text-slate-200">
            {t.emailLabel}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/40"
              placeholder="ex. mon.adresse@email.com"
            />
          </label>

          <label className="flex flex-col gap-1 text-[0.8rem] text-slate-200">
            {t.passwordLabel}
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 pr-10 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/40"
                placeholder={t.passwordPlaceholder}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-slate-100"
              >
                👁
              </button>
            </div>
            <span className="text-[0.7rem] text-slate-400">
              {t.passwordHint}
            </span>
          </label>

          {error && (
            <p className="rounded-xl bg-red-900/70 px-3 py-2 text-[0.8rem] text-red-50">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loadingEmail || loadingGoogle}
            className="mt-1 w-full rounded-full bg-gradient-to-tr from-fuchsia-500 via-rose-400 to-orange-400 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-rose-400/60 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingEmail ? t.submitting : t.submit}
          </button>
        </form>

        <p className="mt-4 text-center text-[0.78rem] text-slate-400">
          {t.alreadyHave}{" "}
          <a
            href={`/login?lang=${localeParam}`}
            className="font-medium text-slate-100 hover:text-white"
          >
            {t.login}
          </a>
        </p>
      </section>
    </main>
  );
}

