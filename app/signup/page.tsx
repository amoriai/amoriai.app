"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SignupPage() {
  // Ne surtout pas mettre d'argument — Next.js 14 impose ça
  const searchParams = useSearchParams();

  // Langue par défaut = FR
  const [locale, setLocale] = useState("fr");

  // Lire ?lang=fr/en/es dans l'URL
  useEffect(() => {
    const lang = searchParams.get("lang");
    if (lang === "fr" || lang === "en" || lang === "es") {
      setLocale(lang);
    }
  }, [searchParams]);

  // Traductions
  const translations: Record<string, any> = {
    fr: {
      title: "Créer ton partenaire IA",
      subtitle: "Personnalise ta connexion gratuite",
      google: "Continuer avec Google",
      selectLang: "Choisis ta langue",
    },
    en: {
      title: "Create your AI partner",
      subtitle: "Customize your free connection",
      google: "Continue with Google",
      selectLang: "Choose your language",
    },
    es: {
      title: "Crea tu compañero IA",
      subtitle: "Personaliza tu conexión gratuita",
      google: "Continuar con Google",
      selectLang: "Elige tu idioma",
    },
  };

  const t = translations[locale];

  // Lancement Google Auth
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
      <p className="mb-8 text-lg opacity-80">{t.subtitle}</p>

      <button
        onClick={handleLogin}
        className="px-6 py-3 rounded-lg bg-white text-black font-semibold shadow hover:bg-gray-200 transition"
      >
        {t.google}
      </button>

      <div className="mt-10">
        <p className="mb-2 text-sm opacity-70">{t.selectLang}</p>
        <div className="flex gap-4 text-blue-400 underline">
          <Link href="?lang=fr">FR</Link>
          <Link href="?lang=en">EN</Link>
          <Link href="?lang=es">ES</Link>
        </div>
      </div>
    </div>
  );
}
