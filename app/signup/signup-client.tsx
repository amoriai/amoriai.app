"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

/* ===========================
   TEXTES
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
    alreadyLoggedTitle: string;
    alreadyLoggedBody: string;
    useExisting: string;
    logoutAndCreate: string;
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
    alreadyLoggedTitle: "Tu es déjà connectée",
    alreadyLoggedBody:
      "Tu as déjà une session ouverte. Tu peux continuer avec ce compte ou te déconnecter pour en créer un nouveau.",
    useExisting: "Continuer avec ce compte",
    logoutAndCreate: "Me déconnecter pour créer un nouveau compte",
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
    alreadyLoggedTitle: "You are already logged in",
    alreadyLoggedBody:
      "You already have an active session. You can continue with this account or log out to create a new one.",
    useExisting: "Continue with this account",
    logoutAndCreate: "Log out and create a new account",
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
    alreadyLoggedTitle: "Ya has iniciado sesión",
    alreadyLoggedBody:
      "Ya tienes una sesión activa. Puedes continuar con esta cuenta o cerrar sesión para crear otra.",
    useExisting: "Continuar con esta cuenta",
    logoutAndCreate: "Cerrar sesión y crear otra cuenta",
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

  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  /* ===========================
     CHECK SESSION AU CHARGEMENT
     (mais SANS redirection auto)
  =========================== */

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
      setSessionChecked(true);
    };
    check();
  }, []);

  /* ===========================
     LOGIQUE DE REDIRECTION
=========================== */

  const buildNextUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);

    if (!planParam || planParam === "free") {
      params.set("plan", "free");
      return `/create-amoria?${params.toString()}`;
    }

    params.set("plan", planParam);
    return `/payment?${params.toString()}`;
  };

  const redirectAfterSignup = () => {
    const url = buildNextUrl();
    router.push(url);
  };

  const handleUseExistingAccount = () => {
    redirectAfterSignup();
  };

  const handleLogoutAndCreateNew = async () => {
    setError(null);
    setLoadingEmail(true);
    await supabase.auth.signOut();
    setHasSession(false);
    setLoadingEmail(false);
  };

  /* ===========================
     EMAIL SIGNUP
  =========================== */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    // on s'assure de partir propre
    await supabase.auth.signOut();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoadingEmail(false);

    if (error) {
      // si l'utilisateur existe déjà, on lui propose plutôt de se connecter
      if (
        error.message.toLowerCase().includes("already registered") ||
        error.message.toLowerCase().includes("already exists")
      ) {
        setError(
          localeParam === "fr"
            ? "Ce courriel est déjà utilisé. Clique sur « Me connecter » en bas pour ouvrir ta session."
            : localeParam === "en"
            ? "This email is already in use. Click “Log in” below to open your session."
            : "Este correo ya está en uso. Haz clic en «Iniciar sesión» abajo para entrar."
        );
      } else {
        setError(error.message || t.errorGeneric);
      }
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

  if (!sessionChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-slate-100">
        <p className="text-sm text-slate-300">Chargement…</p>
      </main>
    );
  }

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
        </div>

        {/* Si il y a déjà une session ouverte */}
        {hasSession ? (
          <>
            <h1 className="mb-2 text-xl font-semibold">
              {t.alreadyLoggedTitle}
            </h1>
            <p className="mb-4 text-sm text-slate-300">
              {t.alreadyLoggedBody}
            </p>

            {planLabel ? (
              <p className="mb-4 inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {t.planPrefix}
                <span className="ml-1 font-semibold">{planLabel}</span>
              </p>
            ) : (
              <p className="mb-4 text-xs text-slate-400">{t.noPlanInfo}</p>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleUseExistingAccount}
                className="w-full rounded-full bg-gradient-to-tr from-fuchsia-500 via-rose-400 to-orange-400 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-rose-400/60 transition hover:brightness-110"
              >
                {t.useExisting}
              </button>
              <button
                type="button"
                onClick={handleLogoutAndCreateNew}
                className="w-full rounded-full border border-slate-600 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 hover:bg-slate-900"
                disabled={loadingEmail || loadingGoogle}
              >
                {t.logoutAndCreate}
              </button>
            </div>
          </>
        ) : (
          <>
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

            <p className="mt-4 text-center text-[0.78rem] text-slate-400">
              {t.alreadyHave}{" "}
              <a
                href={`/login?lang=${localeParam}`}
                className="font-medium text-slate-100 hover:text-white"
              >
                {t.login}
              </a>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
