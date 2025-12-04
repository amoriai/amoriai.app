"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

const LABELS: Record<Locale, any> = {
  fr: {
    title: "Créer mon compte AmorIAI",
    subtitle:
      "Étape 1 : crée ton compte. Tu choisiras ensuite ton forfait.",
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
    subtitle: "Step 1: Create your account, then select your plan.",
    email: "Email",
    password: "Password",
    placeholderEmail: "ex. my@email.com",
    placeholderPassword: "Minimum 6 characters",
    submit: "Create account",
    loading: "Creating...",
    google: "Continue with Google",
    already: "Already have an account?",
    login: "Login",
    error: "An error occurred."
  },
  es: {
    title: "Crear mi cuenta AmorIAI",
    subtitle: "Paso 1: crea tu cuenta, luego selecciona tu plan.",
    email: "Correo",
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

  // ✅ REDIRECTION GARANTIE VERS /pricing
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

    // ✅ SUCCÈS → PRICING
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-900 to-black text-white px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-2xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">{t.title}</h1>
        <p className="text-sm text-slate-300 text-center">{t.subtitle}</p>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm p-2 rounded">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full border border-slate-600 bg-slate-800 hover:bg-slate-700 p-2 rounded"
        >
          {t.google}
        </button>

        <input
          type="email"
          placeholder={t.placeholderEmail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 rounded bg-slate-800 border border-slate-600"
        />

        <input
          type="password"
          placeholder={t.placeholderPassword}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full p-2 rounded bg-slate-800 border border-slate-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded font-bold disabled:opacity-50"
        >
          {loading ? t.loading : t.submit}
        </button>

        <div className="text-center text-sm text-slate-300">
          {t.already}{" "}
          <button
            type="button"
            onClick={() => router.push(`/login?lang=${locale}`)}
            className="text-pink-400 underline"
          >
            {t.login}
          </button>
        </div>
      </form>
    </div>
  );
}
