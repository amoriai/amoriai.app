"use client";

import React, { useEffect, useState } from "react";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    backHome: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    goalLabel: string;
    categoryLabel: string;
    noAvatar: string;
    chatSoon: string;
  }
> = {
  fr: {
    backHome: "← Retour à l’accueil",
    title: "Ton AmorIA est prête ✨",
    subtitle:
      "Voici un aperçu avant d’ajouter les véritables fonctionnalités.",
    nameLabel: "Nom",
    goalLabel: "Mission principale",
    categoryLabel: "Catégorie",
    noAvatar: "Aucun avatar sélectionné",
    chatSoon: "La discussion arrive bientôt…",
  },
  en: {
    backHome: "← Back to home",
    title: "Your AmorIA is ready ✨",
    subtitle: "Here’s a preview until real features are added.",
    nameLabel: "Name",
    goalLabel: "Main mission",
    categoryLabel: "Category",
    noAvatar: "No avatar selected",
    chatSoon: "Chat coming soon…",
  },
  es: {
    backHome: "← Volver al inicio",
    title: "Tu AmorIA está lista ✨",
    subtitle:
      "Aquí tienes una vista previa antes de agregar las funciones reales.",
    nameLabel: "Nombre",
    goalLabel: "Misión principal",
    categoryLabel: "Categoría",
    noAvatar: "Ningún avatar seleccionado",
    chatSoon: "El chat llegará pronto…",
  },
};

export default function MyAIPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [ai, setAI] = useState<{
    name: string;
    goal: string;
    avatar: string;
    category: string;
  } | null>(null);

  // Lire URL pour récupérer ?lang et les infos d'IA
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const lang = params.get("lang");
    if (lang === "fr" || lang === "en" || lang === "es") {
      setLocale(lang);
    }

    const name = params.get("name") || "";
    const goal = params.get("goal") || "";
    const avatar = params.get("avatar") || "";
    const category = params.get("category") || "";

    setAI({ name, goal, avatar, category });
  }, []);

  if (!ai) return null;

  const t = STRINGS[locale];

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#050816] text-white">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">

        <a href="/" className="text-sm text-white/60 hover:text-white">
          {t.backHome}
        </a>

        <h1 className="text-2xl font-semibold mt-3 mb-2">{t.title}</h1>

        <p className="text-white/70 text-sm mb-6">{t.subtitle}</p>

        {/* Avatar */}
        <div className="w-full h-60 rounded-2xl overflow-hidden border border-white/10">
          {ai.avatar ? (
            <img
              src={`/${ai.avatar}.png`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50">
              {t.noAvatar}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="mt-6 space-y-4">

          <div>
            <p className="text-xs text-white/50">{t.nameLabel}</p>
            <p className="text-lg">{ai.name || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-white/50">{t.goalLabel}</p>
            <p className="text-base">{ai.goal || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-white/50">{t.categoryLabel}</p>
            <p className="text-base capitalize">{ai.category || "—"}</p>
          </div>
        </div>

        {/* Bouton désactivé */}
        <button
          disabled
          className="mt-6 w-full rounded-full py-3 bg-gradient-to-r from-pink-500 to-orange-400 font-semibold opacity-60 cursor-not-allowed"
        >
          {t.chatSoon}
        </button>
      </div>
    </main>
  );
}
