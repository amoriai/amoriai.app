"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    or: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    loginBtn: string;
    googleBtn: string;
    noAccount: string;
    signupLink: string;
    googleError: string;
  }
> = {
  fr: {
    title: "Me connecter",
    subtitle: "Accède à ton AmorIAI personnel et reprends la conversation.",
    or: "OU",
    emailLabel: "Adresse courriel",
    emailPlaceholder: "ex. mon.adresse@email.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Ton mot de passe AmorIAI",
    loginBtn: "Me connecter",
    googleBtn: "Continuer avec Google",
    noAccount: "Pas encore de compte ?",
    signupLink: "Créer mon compte",
    googleError: "Erreur avec la connexion Google.",
  },
  en: {
    title: "Log in",
    subtitle: "Access your personal AmorIAI and continue the conversation.",
    or: "OR",
    emailLabel: "Email address",
    emailPlaceholder: "e.g. my.address@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Your AmorIAI password",
    loginBtn: "Log in",
    googleBtn: "Continue with Google",
    noAccount: "No account yet?",
    signupLink: "Create my account",
    googleError: "Error with Google sign-in.",
  },
  es: {
    title: "Iniciar sesión",
    subtitle: "Accede a tu AmorIAI personal y continúa la conversación.",
    or: "O",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "ej. mi.direccion@email.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Tu contraseña de AmorIAI",
    loginBtn: "Iniciar sesión",
    googleBtn: "Continuar con Google",
    noAccount: "¿Todavía no tienes cuenta?",
    signupLink: "Crear mi cuenta",
    googleError: "Error con el inicio de sesión de Google.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locale, setLocale] = useState<Locale>("fr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const lang = searchParams.get("lang");
    setLocale(normalizeLocale(lang));
  }, [searchParams]);

  const t = STRINGS[locale];

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // on garde la langue dans l’URL
    router.replace(`/my-amoria?lang=${locale}`);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErrorMsg("");

    const redirectUrl = `${window.location.origin}/my-amoria?lang=${locale}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      setErrorMsg(t.googleError);
      setLoading(false);
    }
  };

  const goToSignup = () => {
    router.push(`/signup?lang=${locale}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        {/* Titre */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-sm text-zinc-400 mt-2">{t.subtitle}</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full mb-5 py-3 rounded-xl border border-zinc-700 hover:border-zinc-500 transition text-sm flex items-center justify-center gap-2"
        >
          <span>{t.googleBtn}</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="mx-3 text-xs text-zinc-500">{t.or}</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-xs text-zinc-400 mb-1">
            {t.emailLabel}
          </label>
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Mot de passe */}
        <div className="mb-2">
          <label className="block text-xs text-zinc-400 mb-1">
            {t.passwordLabel}
          </label>
          <input
            type="password"
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500"
          />
        </div>

        {errorMsg && (
          <p className="text-red-500 text-xs mb-4 text-center">{errorMsg}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold hover:opacity-90 transition mt-2"
        >
          {loading ? "…" : t.loginBtn}
        </button>

        <p className="mt-6 text-xs text-zinc-500 text-center">
          {t.noAccount}{" "}
          <span
            onClick={goToSignup}
            className="text-pink-400 cursor-pointer hover:underline"
          >
            {t.signupLink}
          </span>
        </p>
      </div>
    </main>
  );
}
