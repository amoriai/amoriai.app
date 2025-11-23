"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// --- TYPES ---
type Locale = "fr" | "en" | "es";

type AmoriaRow = {
  id: string;
  user_id: string;
  name: string;
  persona_type: string;
  main_language: string;
  avatar_image_url: string | null;
  accent_color: string | null;
  system_prompt: string;
  voice_id: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

// --- STRINGS ---
const STRINGS: Record<
  Locale,
  {
    backHome: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    goalLabel: string;
    categoryLabel: string;
    personalityLabel: string;
    noAvatar: string;
    loading: string;
    error: string;
  }
> = {
  fr: {
    backHome: "← Retour à l’accueil",
    title: "Ton AmorIA est prête ✨",
    subtitle:
      "Voici ton IA personnelle. Plus tard on pourra ajouter : chat, voix, avatar généré, personnalisation avancée.",
    nameLabel: "Prénom",
    goalLabel: "Mission principale",
    categoryLabel: "Type d’IA",
    personalityLabel: "Personnalité",
    noAvatar: "Aucun avatar disponible pour le moment.",
    loading: "Chargement...",
    error:
      "Impossible de charger ton AmorIA. Crée-en une depuis /create-ia.",
  },
  en: {
    backHome: "← Back to home",
    title: "Your AmorIA is ready ✨",
    subtitle:
      "Here is your personal AI. Later we will add: chat, voice, generated avatar, advanced customization.",
    nameLabel: "Name",
    goalLabel: "Main mission",
    categoryLabel: "AI type",
    personalityLabel: "Personality",
    noAvatar: "No avatar available yet.",
    loading: "Loading...",
    error:
      "We couldn’t load your AmorIA. Create one from /create-ia.",
  },
  es: {
    backHome: "← Volver al inicio",
    title: "Tu AmorIA está lista ✨",
    subtitle:
      "Aquí está tu IA personal. Más tarde añadiremos: chat, voz, avatar generado, personalización avanzada.",
    nameLabel: "Nombre",
    goalLabel: "Misión principal",
    categoryLabel: "Tipo de IA",
    personalityLabel: "Personalidad",
    noAvatar: "No hay avatar disponible por ahora.",
    loading: "Cargando...",
    error:
      "No pudimos cargar tu AmorIA. Crea una desde /create-ia.",
  },
};

// --- PAGE ---
export default function MyAIPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [loading, setLoading] = useState(true);
  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lire la langue depuis ?lang=
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      if (lang === "fr" || lang === "en" || lang === "es") {
        setLocale(lang);
      }
    } catch {}
  }, []);

  const t = STRINGS[locale];

  // Charger Supabase et récupérer l’IA
  useEffect(() => {
    const loadAI = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Qui est connecté ?
        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;

        if (!user) {
          setError(t.error);
          setLoading(false);
          return;
        }

        // Prendre la dernière IA créée (ou la seule)
        const { data, error } = await supabase
          .from("user_amoria")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error || !data) {
          setError(t.error);
          setLoading(false);
          return;
        }

        setAi(data);
      } catch (err) {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    loadAI();
  }, [t.error]);

  if (loading) {
    return (
      <main className="amoria-ai-root">
        <p className="amoria-loading">{t.loading}</p>
      </main>
    );
  }

  if (error || !ai) {
    return (
      <main className="amoria-ai-root">
        <a href="/" className="amoria-back">{t.backHome}</a>
        <p className="amoria-error">{t.error}</p>
      </main>
    );
  }

  return (
    <main className="amoria-ai-root">
      <header className="amoria-ai-header">
        <a href="/" className="amoria-back">{t.backHome}</a>
      </header>

      <section className="amoria-ai-card">
        <h1 className="amoria-ai-title">{t.title}</h1>
        <p className="amoria-ai-subtitle">{t.subtitle}</p>

        <div className="amoria-ai-avatar">
          {ai.avatar_image_url ? (
            <img
              src={ai.avatar_image_url}
              alt="avatar"
              className="amoria-avatar-img"
            />
          ) : (
            <div className="amoria-avatar-placeholder">{t.noAvatar}</div>
          )}
        </div>

        <div className="amoria-ai-info">
          <div className="amoria-info-row">
            <span>{t.nameLabel}</span>
            <strong>{ai.name}</strong>
          </div>

          <div className="amoria-info-row">
            <span>{t.categoryLabel}</span>
            <strong>{ai.persona_type}</strong>
          </div>

          <div className="amoria-info-row">
            <span>{t.personalityLabel}</span>
            <strong>{ai.system_prompt.slice(0, 60)}...</strong>
          </div>

          <div className="amoria-info-row">
            <span>{t.goalLabel}</span>
            <strong>{ai.system_prompt}</strong>
          </div>
        </div>
      </section>

      <style jsx>{`
        .amoria-ai-root {
          min-height: 100vh;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui;
        }
        .amoria-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }
        .amoria-ai-header {
          margin-bottom: 1.5rem;
        }
        .amoria-ai-card {
          background: #0f172a;
          border-radius: 1.2rem;
          max-width: 520px;
          margin: 0 auto;
          padding: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
        }
        .amoria-ai-title {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
        }
        .amoria-ai-avatar {
          margin: 1rem 0;
          display: flex;
          justify-content: center;
        }
        .amoria-avatar-img {
          width: 130px;
          height: 130px;
          border-radius: 999px;
          object-fit: cover;
        }
        .amoria-avatar-placeholder {
          width: 130px;
          height: 130px;
          border-radius: 999px;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
          padding: 1rem;
        }
        .amoria-info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.7rem;
          font-size: 0.9rem;
        }
        .amoria-error,
        .amoria-loading {
          text-align: center;
          margin-top: 3rem;
          font-size: 1rem;
        }
      `}</style>
    </main>
  );
}
