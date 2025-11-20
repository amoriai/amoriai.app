"use client";

export const dynamic = "force-dynamic";

import React, { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  // IMPORTANT avec Next 14 : suspense désactivé
  const searchParams = useSearchParams({ suspense: false });
  const localeParam = searchParams?.get("lang") || "fr";
  const [locale] = useState<"fr" | "en" | "es">(
    localeParam === "en" || localeParam === "es" ? localeParam : "fr"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // -------- TEXTES MULTILINGUES --------
  const STRINGS = {
    fr: {
      title: "Créer mon compte gratuit",
      subtitle:
        "Crée un compte gratuitement et commence à texter avec ton IA préférée. La voix est disponible seulement avec l’abonnement payant.",
      emailLabel: "Adresse courriel",
      passwordLabel: "Mot de passe",
      submit: loadingEmail ? "Création en cours..." : "Créer mon compte",
      google: loadingGoogle ? "Connexion à Google..." : "Continuer avec Google",
      or: "ou",
      already: "Tu as déjà un compte ? Me connecter",
      backHome: "← Retour à l’accueil",
    },
    en: {
      title: "Create my free account",
      subtitle:
        "Create a free account and start texting with your favorite AI. Voice is only available with the paid plan.",
      emailLabel: "Email address",
      passwordLabel: "Password",
      submit: loadingEmail ? "Creating account..." : "Create my account",
      google: loadingGoogle ? "Connecting to Google..." : "Continue with Google",
      or: "or",
      already: "Already have an account? Log in",
      backHome: "← Back to home",
    },
    es: {
      title: "Crear mi cuenta gratis",
      subtitle:
        "Crea una cuenta gratis y empieza a chatear con tu IA favorita. La voz solo está disponible con la suscripción de pago.",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      submit: loadingEmail ? "Creando cuenta..." : "Crear mi cuenta",
      google: loadingGoogle ? "Conectando con Google..." : "Continuar con Google",
      or: "o",
      already: "¿Ya tienes una cuenta? Iniciar sesión",
      backHome: "← Volver al inicio",
    },
  } as const;

  const t = STRINGS[locale];

  // -------- INSCRIPTION EMAIL / MOT DE PASSE --------
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
      setError(error.message);
      return;
    }

    // Après inscription → page création d’IA
    window.location.href = `/create-ai?lang=${locale}`;
  };

  // -------- CONNEXION GOOGLE AVEC REDIRECT CORRECT --------
  const handleGoogle = async () => {
    setError(null);
    setInfo(null);
    setLoadingGoogle(true);

    // Important : utiliser l'origin du navigateur (localhost ou domaine)
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "";

    const redirectTo = `${origin}/create-ai?lang=${locale}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    setLoadingGoogle(false);

    if (error) {
      setError(error.message);
      return;
    }

    // La redirection sera gérée par Supabase + Google → /create-ai?lang=xx
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <a
          href="/"
          className="mb-6 inline-flex items-center text-sm text-white/70 hover:text-white"
        >
          {t.backHome}
        </a>

        <h1 className="text-3xl font-semibold mb-2">{t.title}</h1>
        <p className="text-sm text-white/70 mb-6">{t.subtitle}</p>

        {/* Bouton Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loadingGoogle}
          className="w-full mb-4 flex items-center justify-center gap-2 rounded-full bg-white text-black py-3 text-sm font-medium hover:bg-gray-100 disabled:opacity-60"
        >
          <span className="font-semibold text-lg">G</span>
          <span>{t.google}</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/50 uppercase tracking-wide">
            {t.or}
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Formulaire email + mot de passe */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">{t.emailLabel}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">{t.passwordLabel}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            />
          </div>

          {error && (
            <p className="text-sm text-red-300 bg-red-900/40 border border-red-500/40 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {info && (
            <p className="text-sm text-emerald-300 bg-emerald-900/40 border border-emerald-500/40 rounded-xl px-3 py-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loadingEmail}
            className="w-full mt-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 py-3 text-sm font-semibold shadow-lg shadow-pink-500/40 disabled:opacity-60"
          >
            {t.submit}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/60">
          {t.already}
        </p>
      </div>
    </main>
  );
}
