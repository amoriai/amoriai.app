"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

const LOADING_TEXT: Record<Locale, string> = {
  fr: "Connexion en cours...",
  en: "Signing you in...",
  es: "Iniciando sesión...",
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lang = normalizeLocale(searchParams.get("lang"));
  const plan: PlanId = "free";

  useEffect(() => {
    const finalizeAuth = async () => {
      try {
        // Laisse Supabase traiter le hash / code de la callback
        await supabase.auth.getSession();
      } catch (err) {
        console.error("Erreur dans auth callback:", err);
      } finally {
        // 🔥 Quoi qu'il arrive → on envoie vers la création d’AmorIAI
        const params = new URLSearchParams();
        params.set("lang", lang);
        params.set("plan", plan);

        router.replace(`/create-amoria?${params.toString()}`);
      }
    };

    void finalizeAuth();
  }, [router, lang, plan]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {LOADING_TEXT[lang]}
    </div>
  );
}
