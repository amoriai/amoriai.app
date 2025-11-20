"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  // Langue par défaut = FR
  const [locale, setLocale] = useState<"fr" | "en" | "es">("fr");

  const t = {
    fr: {
      title: "Créer mon compte gratuit",
      subtitle:
        "Crée un compte gratuitement et commence à texter avec ton IA préférée.",
      google: "Continuer avec Google",
      email: "Adresse courriel",
      password: "Mot de passe",
      submit: "Créer mon compte",
      login: "Tu as déjà un compte ? Me connecter",
    },
    en: {
      title: "Create your free account",
      subtitle:
        "Create an account for free and start texting your favorite AI.",
      google: "Continue with Google",
      email: "Email address",
      password: "Password",
      submit: "Create my account",
      login: "Already have an account? Log in",
    },
    es: {
      title: "Crear mi cuenta gratis",
      subtitle:
        "Crea una cuenta gratis y comienza a chatear con tu IA favorita.",
      google: "Continuar con Google",
      email: "Correo electrónico",
      password: "Contraseña",
      submit: "Crear mi cuenta",
      login: "¿Ya tienes una cuenta? Iniciar sesión",
    },
  };

  const dict = t[locale];

  // ---- Login Google ----
  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://amoriai.app/create-ai",
      },
    });

    if (error) alert(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050816]">
      <div className="bg-gray-900/40 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-full max-w-md border border-white/10">

        {/* Sélecteur de langue */}
        <div className="flex justify-end mb-4">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as any)}
            className="bg-gray-800 text-white px-3 py-1 rounded"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>

        <h1 className="text-2xl font-bold mb-2">{dict.title}</h1>
        <p className="text-gray-300 mb-6">{dict.subtitle}</p>

        <button
          onClick={handleGoogle}
          className="w-full bg-white text-black py-3 rounded-xl mb-6"
        >
          {dict.google}
        </button>

        <div className="text-center my-4 text-gray-400">— OU —</div>

        <input
          type="email"
          placeholder={dict.email}
          className="w-full bg-gray-800 text-white p-3 rounded-lg mb-3"
        />

        <input
          type="password"
          placeholder={dict.password}
          className="w-full bg-gray-800 text-white p-3 rounded-lg mb-6"
        />

        <button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 rounded-xl">
          {dict.submit}
        </button>

        <p className="text-center text-gray-400 mt-4 cursor-pointer">
          {dict.login}
        </p>
      </div>
    </div>
  );
}
