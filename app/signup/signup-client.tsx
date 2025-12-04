"use client";

import React, { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient"; // ✅ CORRECT: remonte à la racine puis /lib

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

const LABELS: Record<Locale, any> = {
  fr: {
    title: "Créer mon compte AmorIAI",
    subtitle:
      "Étape 1 : crée ton compte. Tu choisiras ensuite ton forfait sur la page des prix.",
    email: "Adresse courriel",
    password: "Mot de passe",
    placeholderEmail: "ex. mon.adresse@email.com",
    placeholderPassword: "Minimum 6 caractères",
    submit: "Créer mon compte",
    loading: "Création...",
    google: "Continuer avec Google",
    already: "Tu as déjà un compte ?",
    login: "Me connecter",
    error: "Une erreur est survenue."
  },
  en: {
    title: "Create my AmorIAI account",
    subtitle:
      "Step 1: create your account. Then you’ll choose your plan on the pricing page.",
    email: "Email",
    password: "Password",
    placeholderEmail: "e.g. my@email.com",
    placeholderPassword: "Minimum 6 characters",
    submit: "Create account",
    loading: "Creating...",
    google: "Continue with Google",
    already: "Already have an account?",
    login: "Log in",
    error: "An error occurred."
  },
  es: {
    title: "Crear mi cuenta AmorIAI",
    subtitle:
      "Paso 1: crea tu cuenta. Luego elegirás tu plan en la página de precios.",
    email: "Correo electrónico",
    password: "Contraseña",
    placeholderEmail: "ej. mi@email.com",
    placeholderPassword: "Mínimo 6 caracteres",
    submit: "Crear cuenta",
    loading: "Creando...",
    google: "Continuar con Google",
    already: "¿Ya tienes cuenta?",
    login: "Iniciar sesión",
    error: "Ocurrió un error."
  }
};

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = (searchParams.get("lang") as Locale) || "fr";
  const plan = (searchParams.get("plan") as PlanId) || "free";
  const t = LABELS[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Redirection : TOUJOURS vers /pricing
  const redirectAfterSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", plan);
    router.replace(`/pricing?${params.toString()}`);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setErrorMsg(error.message || t.error);
      setLoading(false);
      return;
    }

    // ✅ Succès → page pricing
    redirectAfterSignup();
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setErrorMsg(error.message || t.error);
      setLoading(false);
    }
  };

  const goToLogin = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", plan);
    router.push(`/login?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-900 to-black px-4 text-white">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="text-sm text-slate-300">{t.subtitle}</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 text-sm p-2 rounded">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border border-slate-600 bg-slate-800 hover:bg-slate-700 transition rounded-lg py-2 text-sm font-medium"
        >
          {t.google}
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-700" />
          <span>ou</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">{t.email}</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholderEmail}
              className="w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">{t.password}</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.placeholderPassword}
              className="w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 rounded-lg py-2 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? t.loading : t.submit}
          </button>
        </form>

        <div className="text-center text-sm text-slate-300">
          {t.already}{" "}
          <button
            type="button"
            onClick={goToLogin}
            className="text-pink-400 underline"
          >
            {t.login}
          </button>
        </div>
      </div>
    </div>
  );
}
