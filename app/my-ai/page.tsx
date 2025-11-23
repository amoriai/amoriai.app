"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
  // si tu as ajouté ces colonnes plus tard, elles restent optionnelles
  goal?: string | null;
  category?: string | null;
  personality_id?: string | null;
};

const STRINGS: Record<
  Locale,
  {
    backHome: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    goalLabel: string;
    categoryLabel: string;
    languageLabel: string;
    personalityLabel: string;
    noAvatar: string;
    loading: string;
    error: string;
    chatCta: string;
    createAnotherCta: string;
  }
> = {
  fr: {
    backHome: "← Retour à l’accueil",
    title: "Ton AmorIA est prête ✨",
    subtitle:
      "Voici ton IA personnelle. Tu peux déjà accéder à sa fiche et commencer à chatter avec elle.",
    nameLabel: "Prénom",
    goalLabel: "Mission principale",
    categoryLabel: "Type d’IA",
    languageLabel: "Langue principale",
    personalityLabel: "Personnalité / style",
    noAvatar: "Aucun avatar disponible pour le moment.",
    loading: "Chargement...",
    error:
      "Impossible de charger ton AmorIA. Crée-en une depuis /create-ia.",
    chatCta: "Chatter avec ton AmorIA",
    createAnotherCta: "Créer une autre AmorIA",
  },
  en: {
    backHome: "← Back to home",
    title: "Your AmorIA is ready ✨",
    subtitle:
      "Here is your personal AI. You can already access its profile and start chatting with it.",
    nameLabel: "Name",
    goalLabel: "Main mission",
    categoryLabel: "AI type",
    languageLabel: "Main language",
    personalityLabel: "Personality / style",
    noAvatar: "No avatar available yet.",
    loading: "Loading...",
    error:
      "We couldn’t load your AmorIA. Create one from /create-ia.",
    chatCta: "Chat with your AmorIA",
    createAnotherCta: "Create another AmorIA",
  },
  es: {
    backHome: "← Volver al inicio",
    title: "Tu AmorIA está lista ✨",
    subtitle:
      "Aquí está tu IA personal. Ya puedes ver su ficha y empezar a chatear con ella.",
    nameLabel: "Nombre",
    goalLabel: "Misión principal",
    categoryLabel: "Tipo de IA",
    languageLabel: "Idioma principal",
    personalityLabel: "Personalidad / estilo",
    noAvatar: "No hay avatar disponible por ahora.",
    loading: "Cargando...",
    error:
      "No pudimos cargar tu AmorIA. Crea una desde /create-ia.",
    chatCta: "Chatear con tu AmorIA",
    createAnotherCta: "Crear otra AmorIA",
  },
};

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

        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;

        if (!user) {
          setError(t.error);
          setLoading(false);
          return;
        }

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

        setAi(data as AmoriaRow);
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
        <style jsx>{`
          .amoria-ai-root {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at top, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui;
          }
        `}</style>
      </main>
    );
  }

  if (error || !ai) {
    return (
      <main className="amoria-ai-root">
        <header className="amoria-ai-header">
          <a href="/" className="amoria-back">
            {t.backHome}
          </a>
        </header>
        <p className="amoria-error">{t.error}</p>

        <style jsx>{`
          .amoria-ai-root {
            min-height: 100vh;
            padding: 1.5rem;
            background: radial-gradient(circle at top, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui;
          }
          .amoria-ai-header {
            margin-bottom: 1.5rem;
          }
          .amoria-back {
            font-size: 0.8rem;
            color: #9ca3af;
            text-decoration: none;
          }
          .amoria-back:hover {
            color: #e5e7eb;
          }
          .amoria-error {
            text-align: center;
            margin-top: 3rem;
          }
        `}</style>
      </main>
    );
  }

  const params = new URLSearchParams();
  params.set("lang", locale);
  params.set("amoriaId", ai.id);
  const chatUrl = `/chat?${params.toString()}`;

  const createParams = new URLSearchParams();
  createParams.set("lang", locale);
  const createUrl = `/create-ia?${createParams.toString()}`;

  return (
    <main className="amoria-ai-root">
      <header className="amoria-ai-header">
        <a href="/" className="amoria-back">
          {t.backHome}
        </a>
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
            <div className="amoria-avatar-placeholder">
              {t.noAvatar}
            </div>
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
            <span>{t.languageLabel}</span>
            <strong>{ai.main_language}</strong>
          </div>

          <div className="amoria-info-row">
            <span>{t.personalityLabel}</span>
            <strong>
              {ai.personality_id
                ? ai.personality_id
                : ai.system_prompt.slice(0, 60) + "..."}
            </strong>
          </div>

          {ai.goal && (
            <div className="amoria-info-row">
              <span>{t.goalLabel}</span>
              <strong>{ai.goal}</strong>
            </div>
          )}
        </div>

        <div className="amoria-ai-actions">
          <a href={chatUrl} className="amoria-btn amoria-btn--primary">
            {t.chatCta}
          </a>
          <a href={createUrl} className="amoria-btn amoria-btn--ghost">
            {t.createAnotherCta}
          </a>
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
        .amoria-ai-header {
          max-width: 640px;
          margin: 0 auto 1.5rem;
        }
        .amoria-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }
        .amoria-back:hover {
          color: #e5e7eb;
        }
        .amoria-ai-card {
          background: #0f172a;
          border-radius: 1.2rem;
          max-width: 640px;
          margin: 0 auto;
          padding: 1.6rem 1.7rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.85);
        }
        .amoria-ai-title {
          font-size: 1.4rem;
          margin-bottom: 0.3rem;
        }
        .amoria-ai-subtitle {
          font-size: 0.9rem;
          color: #9ca3af;
          margin-bottom: 1rem;
        }
        .amoria-ai-avatar {
          margin: 1rem 0 1.3rem;
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
        .amoria-ai-info {
          margin-top: 0.5rem;
          margin-bottom: 1.2rem;
        }
        .amoria-info-row {
          display: flex;
          justify-content: space-between;
          gap: 0.8rem;
          margin-bottom: 0.6rem;
          font-size: 0.9rem;
        }
        .amoria-ai-actions {
          display: flex;
          gap: 0.8rem;
          justify-content: flex-end;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        .amoria-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          font-size: 0.86rem;
          cursor: pointer;
          white-space: nowrap;
          padding: 0.55rem 1.3rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .amoria-btn--primary {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
        }
        .amoria-btn--ghost {
          background: transparent;
          color: #e5e7eb;
          border-color: rgba(148, 163, 184, 0.6);
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
