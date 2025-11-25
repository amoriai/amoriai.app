"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Locale = "fr" | "en" | "es";

function getLocale(sp: URLSearchParams): Locale {
  const raw = sp.get("lang");
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

const TEXTS: Record<
  Locale,
  { title: string; subtitle: string; button: string }
> = {
  fr: {
    title: "Créer ton premier AmorIA",
    subtitle:
      "Ton compte est créé. Choisis maintenant le prénom, la personnalité et le style de ton compagnon IA.",
    button: "Commencer la création",
  },
  en: {
    title: "Create your first AmorIA",
    subtitle:
      "Your account is ready. Now choose the name, personality and style of your AI companion.",
    button: "Start creation",
  },
  es: {
    title: "Crea tu primer AmorIA",
    subtitle:
      "Tu cuenta está lista. Ahora elige el nombre, la personalidad y el estilo de tu compañero IA.",
    button: "Empezar la creación",
  },
};

export default function CreateAmoriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!searchParams) return null;
  const locale = getLocale(searchParams);
  const t = TEXTS[locale];

  const handleStart = () => {
    // plus tard : router.push("/app/chat" ou autre)
    router.push("/");
  };

  return (
    <main className="amoria-root amoria-auth-root">
      <div className="amoria-auth-wrapper">
        <div className="amoria-auth-card">
          <div className="amoria-auth-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIA"
              className="amoria-auth-logo"
            />
            <div>
              <h1 className="amoria-auth-title">{t.title}</h1>
              <p className="amoria-auth-subtitle">{t.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="amoria-auth-submit"
          >
            {t.button}
          </button>
        </div>
      </div>
    </main>
  );
}
