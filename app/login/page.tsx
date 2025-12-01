"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

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
      "Connecte-toi pour retrouver ton AmorIA et continuer à discuter.",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    or: "— OU —",
    google: "Continuer avec Google",
    submit: "Me connecter",
    submitting: "Connexion en cours…",
    backToSignup: "Pas encore de compte ? Créer mon compte",
    errorGeneric:
      "Impossible de te connecter. Vérifie tes informations ou essaie à nouveau.",
  },
  en: {
    title: "Log in",
    subtitle: "Log in to find your AmorIA and continue chatting.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    or: "— OR —",
    google: "Continue with Google",
    submit: "Log in",
    submitting: "Signing you in…",
    backToSignup: "No account yet? Create my account",
    errorGeneric:
      "Unable to log you in. Check your credentials or try again.",
  },
  es: {
    title: "Iniciar sesión",
    subtitle:
      "Conéctate para reencontrar tu AmorIA y seguir conversando.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    or: "— O —",
    google: "Continuar con Google",
    submit: "Iniciar sesión",
    submitting: "Conectando…",
    backToSignup: "¿Aún no tienes cuenta? Crear mi cuenta",
    errorGeneric:
      "No se pudo iniciar sesión. Verifica tus datos o inténtalo de nuevo.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

// URL de destination après connexion (email ou Google)
function buildRedirectUrl(locale: Locale): string {
  if (typeof window === "undefined") return "/";
  // si un jour tu veux une autre page, change "/my-amoria" ici
  const url = new URL("/my-amoria", window.location.origin);
  url.searchParams.set("lang", locale);
  return url.toString();
}

export default function LoginPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = normalizeLocale(params.get("lang"));
      setLocale(lang);
    } catch {
      // on garde "fr"
    }
  }, []);

  const t = STRINGS[locale];

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: buildRedirectUrl(locale),
        },
      });

      if (error) {
        console.error(error);
        setError(t.errorGeneric);
        setIsSubmitting(false);
      }
      // si tout va bien, Supabase redirige vers redirectTo
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

      // redirection après login email/mot de passe
      window.location.href = buildRedirectUrl(locale);
    } catch (e) {
      console.error(e);
      setError(t.errorGeneric);
      setIsSubmitting(false);
    }
  };

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
          href={`/signup?lang=${locale}`}
          className="mt-4 block text-center text-[0.8rem] text-slate-400 hover:text-slate-100"
        >
          {t.backToSignup}
        </a>
      </section>
    </main>
  );
}
