"use client";

import React, { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

/* ===========================
   LABELS PAR LANGUE
=========================== */

const LABELS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    step: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordHint: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    submitting: string;
    google: string;
    alreadyHave: string;
    login: string;
    errorGeneric: string;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIAI",
    subtitle:
      "Étape 1 : crée ton compte. Ensuite tu arrives directement à la page des forfaits pour choisir ton plan.",
    step: "Étape 1",
    emailLabel: "Adresse courriel",
    emailPlaceholder: "ex. mon.adresse@email.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Choisis un mot de passe sécurisé",
    passwordHint: "Minimum 6 caractères.",
    showPassword: "Afficher",
    hidePassword: "Cacher",
    submit: "Créer mon compte",
    submitting: "Création du compte...",
    google: "Continuer avec Google",
    alreadyHave: "Tu as déjà un compte ?",
    login: "Me connecter",
    errorGeneric: "Une erreur est survenue. Merci de réessayer."
  },
  en: {
    title: "Create my AmorIAI account",
    subtitle:
      "Step 1: create your account. Then you’ll be redirected to the pricing page to choose your plan.",
    step: "Step 1",
    emailLabel: "Email address",
    emailPlaceholder: "e.g. my.email@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Choose a secure password",
    passwordHint: "Minimum 6 characters.",
    showPassword: "Show",
    hidePassword: "Hide",
    submit: "Create my account",
    submitting: "Creating your account...",
    google: "Continue with Google",
    alreadyHave: "Already have an account?",
    login: "Log in",
    errorGeneric: "Something went wrong. Please try again."
  },
  es: {
    title: "Crear mi cuenta AmorIAI",
    subtitle:
      "Paso 1: crea tu cuenta. Luego serás redirigido a la página de precios para elegir tu plan.",
    step: "Paso 1",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "ej. mi.correo@email.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Elige una contraseña segura",
    passwordHint: "Mínimo 6 caracteres.",
    showPassword: "Ver",
    hidePassword: "Ocultar",
    submit: "Crear mi cuenta",
    submitting: "Creando la cuenta...",
    google: "Continuar con Google",
    alreadyHave: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    errorGeneric: "Ha ocurrido un error. Vuelve a intentarlo."
  }
};

/* ===========================
   COMPOSANT SIGNUP
=========================== */

const SignupPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Langue et plan venant de l’URL (?lang=fr&plan=chat)
  const localeParam = (searchParams.get("lang") as Locale) || "fr";
  const initialPlan = (searchParams.get("plan") as PlanId) || "free";

  const t = LABELS[localeParam];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ==============
     REDIRECTION APRÈS SIGNUP
     -> TOUJOURS /pricing
  =============== */
  const redirectAfterSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);
    params.set("plan", initialPlan);

    router.replace(`/pricing?${params.toString()}`);
  };

  /* ==============
     SUBMIT EMAIL + PASSWORD
  =============== */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
        // si tu as besoin de emailRedirectTo, tu peux l'ajouter ici
        // options: { emailRedirectTo: "https://ton-domaine.com/auth/callback" },
      });

      if (error) {
        console.error("Signup error:", error.message);
        setErrorMsg(error.message || t.errorGeneric);
        setIsSubmitting(false);
        return;
      }

      // Succès -> on envoie vers /pricing
      redirectAfterSignup();
    } catch (err: any) {
      console.error("Unexpected signup error:", err);
      setErrorMsg(t.errorGeneric);
      setIsSubmitting(false);
    }
  };

  /* ==============
     SIGNUP / LOGIN AVEC GOOGLE
  =============== */
  const handleGoogleSignup = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo
        }
      });

      if (error) {
        console.error("Google signup error:", error.message);
        setErrorMsg(error.message || t.errorGeneric);
        setIsSubmitting(false);
        return;
      }

      // La redirection finale après callback devra aussi mener à /pricing
      // (dans ta page /auth/callback, pense à réutiliser redirectAfterSignup)
    } catch (err: any) {
      console.error("Unexpected Google signup error:", err);
      setErrorMsg(t.errorGeneric);
      setIsSubmitting(false);
    }
  };

  const goToLogin = () => {
    const params = new URLSearchParams();
    params.set("lang", localeParam);
    params.set("plan", initialPlan);

    router.push(`/login?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-sm uppercase tracking-[0.2em] text-pink-400 font-semibold">
          {t.step}
        </div>

        <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl shadow-2xl shadow-pink-500/10 px-6 py-7 sm:px-8 sm:py-9 backdrop-blur">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            {t.subtitle}
            <br />
            <span className="text-xs text-slate-400">
              Ton forfait (gratuit ou payant) sera appliqué automatiquement après
              la création du compte.
            </span>
          </p>

          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          {/* BOUTON GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting}
            className="w-full mb-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800/80 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
            >
              <path
                fill="currentColor"
                d="M21.6 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.4c-.23 1.14-.92 2.1-1.96 2.75v2.28h3.17c1.86-1.71 2.99-4.23 2.99-7.04Z"
              />
              <path
                fill="currentColor"
                d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.17-2.28c-.88.6-2.01.95-3.44.95-2.65 0-4.9-1.79-5.7-4.19H3.04v2.34A9.996 9.996 0 0 0 12 22Z"
                opacity="0.8"
              />
              <path
                fill="currentColor"
                d="M6.3 14.05A5.99 5.99 0 0 1 5.95 12c0-.71.12-1.4.35-2.05V7.61H3.04A10.01 10.01 0 0 0 2 12c0 1.6.38 3.11 1.04 4.39L6.3 14.05Z"
                opacity="0.6"
              />
              <path
                fill="currentColor"
                d="M12 6.1c1.47 0 2.79.5 3.83 1.48l2.87-2.87C16.95 2.83 14.69 2 12 2 8.24 2 4.99 4.16 3.04 7.61L6.3 9.95C7.1 7.55 9.35 6.1 12 6.1Z"
                opacity="0.4"
              />
            </svg>
            {t.google}
          </button>

          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              ou
            </span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          {/* FORMULAIRE EMAIL */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-100 mb-1">
                {t.emailLabel}
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-100 mb-1">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 pr-16 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 my-1 px-2 text-xs rounded-lg bg-slate-800/70 text-slate-200 hover:bg-slate-700/80"
                >
                  {showPassword ? t.hidePassword : t.showPassword}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">{t.passwordHint}</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/40 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-300">
            {t.alreadyHave}{" "}
            <button
              type="button"
              onClick={goToLogin}
              className="font-medium text-pink-400 hover:text-pink-300 underline-offset-4 hover:underline"
            >
              {t.login}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
