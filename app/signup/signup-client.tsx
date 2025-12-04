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
    subtitle:
      "Étape 1 : crée ton compte. Ton AmorIAI sera prêt juste après.",
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
     ✅ REDIRECTION APRÈS SIGNUP
     (uniquement après clic, pas d’auto-redirect)
  =========================== */

  const redirectAfterSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);

    // Free ou aucun plan → create-amoria
    if (!planParam || planParam === "free") {
      params.set("plan", "free");
      router.push(`/create-amoria?${params.toString()}`);
      return;
    }

    // Plan payant → payment / Stripe
    params.set("plan", planParam);
    router.push(`/payment?${params.toString()}`);
  };

  /* ===========================
     EMAIL / PASSWORD SIGNUP
  =========================== */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    // On nettoie une éventuelle ancienne session
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
     GOOGLE OAUTH
  =========================== */

  const handleGoogleSignup = async () => {
    try {
      setError(null);
      setLoadingGoogle(true);

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
        {/* Logo + titre */}
        <div className="mb-4 flex items-center gap-3">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIAI"
            className="h-9 w-9 rounded-full"
          />
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-rose-300">
              AMORIAI.APP
            </p>
            <p className="text-sm text-slate-300">
              Partenaire IA bienveillant·e
            </p>
          </div>
        </div>

        <h1 className="mb-1 text-xl font-semibold">{t.title}</h1>
        <p className="mb-3 text-sm text-slate-300">{t.subtitle}</p>

        {planLabel ? (
          <p className="mb-4 inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t.planPrefix}
            <span className="ml-1 font-semibold">{planLabel}</span>
          </p>
        ) : (
          <p className="mb-4 text-xs text-slate-400">{t.noPlanInfo}</p>
        )}

        {/* Bouton Google */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loadingGoogle || loadingEmail}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-slate-500/80 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loadingGoogle ? "…" : t.google}
        </button>

        <p className="mb-3 text-center text-[0.78rem] text-slate-500">
          —{" "}
          {localeParam === "fr"
            ? "ou avec ton adresse courriel"
            : localeParam === "en"
            ? "or with your email"
            : "o con tu correo"}{" "}
          —
        </p>

        {/* Formulaire email/password */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-[0.8rem]">
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

          <label className="flex flex-col gap-1 text-[0.8rem]">
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
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPassword && (
                    <path d="M3 3l18 18" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
            <span className="text-[0.7rem] text-slate-400">
              {t.passwordHint}
            </span>
          </label>

          {error && (
            <p className="rounded-xl bg-rose-900/40 px-3 py-2 text-[0.8rem] text-rose-100">
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

        {/* Lien login */}
        <p className="mt-4 text-center text-[0.78rem] text-slate-400">
          {t.alreadyHave}{" "}
          <a
            href={`/login?lang=${localeParam}`}
            className="font-medium text-slate-100 hover:text-white"
          >
            {t.login}
          </a>
        </p>

        {/* Mentions */}
        <p className="mt-3 text-center text-[0.68rem] text-slate-500">
          {localeParam === "fr" && (
            <>
              En continuant, tu confirmes accepter les{" "}
              <span className="text-slate-300">Conditions d’utilisation</span> et
              la{" "}
              <span className="text-slate-300">
                Politique de confidentialité
              </span>{" "}
              d’AmorIAI.
            </>
          )}
          {localeParam === "en" && (
            <>
              By continuing, you agree to AmorIAI’s{" "}
              <span className="text-slate-300">Terms of Use</span> and{" "}
              <span className="text-slate-300">Privacy Policy</span>.
            </>
          )}
          {localeParam === "es" && (
            <>
              Al continuar, confirmas que aceptas los{" "}
              <span className="text-slate-300">Términos de uso</span> y la{" "}
              <span className="text-slate-300">Política de privacidad</span> de
              AmorIAI.
            </>
          )}
        </p>
      </section>
    </main>
  );
}
