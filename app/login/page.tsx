"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited" | null;

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    or: string;
    google: string;
    submit: string;
    submitting: string;
    backToSignup: string;
    errorGeneric: string;
  }
> = {
  fr: {
    title: "Me connecter",
    subtitle:
      "Connecte-toi pour retrouver ton AmorIAI et continuer la conversation là où tu l’avais laissée.",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    or: "— OU —",
    google: "Continuer avec Google",
    submit: "Me connecter",
    submitting: "Connexion en cours…",
    backToSignup: "Pas encore de compte ? Créer mon compte",
    errorGeneric:
      "Connexion impossible. Vérifie ton courriel et ton mot de passe, puis réessaie.",
  },
  en: {
    title: "Log in",
    subtitle:
      "Log in to find your AmorIAI again and pick up the conversation where you left off.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    or: "— OR —",
    google: "Continue with Google",
    submit: "Log in",
    submitting: "Signing you in…",
    backToSignup: "No account yet? Create my account",
    errorGeneric:
      "We couldn’t log you in. Check your email and password, then try again.",
  },
  es: {
    title: "Iniciar sesión",
    subtitle:
      "Inicia sesión para reencontrar tu AmorIAI y seguir la conversación donde la dejaste.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    or: "— O —",
    google: "Continuar con Google",
    submit: "Iniciar sesión",
    submitting: "Conectando…",
    backToSignup: "¿Aún no tienes cuenta? Crear mi cuenta",
    errorGeneric:
      "No se pudo iniciar sesión. Verifica tu correo y tu contraseña e inténtalo de nuevo.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited")
    return raw;
  return null;
}

// Construit l’URL où on envoie l’utilisateur après connexion
function buildRedirectUrl(locale: Locale, plan: PlanId): string {
  if (typeof window === "undefined") return "/";

  // Si un plan payant a été choisi → on redirige vers la page de paiement
  if (plan && plan !== "free") {
    const url = new URL("/payment", window.location.origin);
    url.searchParams.set("lang", locale);
    url.searchParams.set("plan", plan);
    return url.toString();
  }

  // Sinon → espace AmorIAI (version gratuite / utilisation normale)
  const url = new URL("/my-amoria", window.location.origin);
  url.searchParams.set("lang", locale);
  return url.toString();
}

export default function LoginPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [plan, setPlan] = useState<PlanId>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lecture des paramètres ?lang= et ?plan=
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = normalizeLocale(params.get("lang"));
      const planParam = normalizePlan(params.get("plan"));
      setLocale(lang);
      setPlan(planParam);
    } catch {
      // on garde les valeurs par défaut
    }
  }, []);

  const t = STRINGS[locale];

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const redirectTo = buildRedirectUrl(locale, plan);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error(error);
        setError(t.errorGeneric);
        setIsSubmitting(false);
      }
      // En cas de succès, Supabase redirige directement vers redirectTo
    } catch (e) {
      console.error(e);
      setError(t.errorGeneric);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error);
        setError(t.errorGeneric);
        setIsSubmitting(false);
        return;
      }

      // Redirection après login email/mot de passe
      window.location.href = buildRedirectUrl(locale, plan);
    } catch (e) {
      console.error(e);
      setError(t.errorGeneric);
      setIsSubmitting(false);
    }
  };

  // URL vers signup en conservant le plan choisi
  const signupHref =
    plan && plan !== "free"
      ? `/signup?lang=${locale}&plan=${plan}`
      : `/signup?lang=${locale}`;

  return (
    <main
      className="flex min-h-screen items-center justify-center px-5 py-10 text-slate-100"
      style={{
        background:
          "radial-gradient(circle at top,#020617 0,#020617 40%,#000 100%)",
      }}
    >
      <section className="w-full max-w-md rounded-2xl border border-slate-600/60 bg-gradient-to-b from-slate-950 via-slate-950 to-black/95 p-7 shadow-2xl shadow-slate-950/90">
        <h1 className="mb-1 text-xl font-semibold">{t.title}</h1>
        <p className="mb-5 text-sm text-slate-300">{t.subtitle}</p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="mb-4 w-full rounded-full border border-slate-500/80 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {t.google}
        </button>

        <p className="my-3 text-center text-[0.78rem] text-slate-500">
          {t.or}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-[0.8rem]">
            {t.emailLabel}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-[0.8rem]">
            {t.passwordLabel}
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/40"
            />
          </label>

          {error && (
            <p className="text-[0.8rem] text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full rounded-full bg-gradient-to-tr from-fuchsia-500 via-rose-400 to-orange-400 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-rose-400/60 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </form>

        <a
          href={signupHref}
          className="mt-4 block text-center text-[0.8rem] text-slate-400 hover:text-slate-100"
        >
          {t.backToSignup}
        </a>
      </section>
    </main>
  );
}
