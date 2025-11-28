"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

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

type UiCopy = {
  backHome: string;
  title: (name: string) => string;
  subtitle: string;
  personalityTitle: string;
  missionTitle: string;
  profileChipLabel: (persona: string) => string;
  companionChip: string;
  noAvatar: string;
  loading: string;
  error: string;
  chatCta: (name: string) => string;
  createFirstCta: string;
};

const STRINGS: Record<Locale, UiCopy> = {
  fr: {
    backHome: "← Retour à l’accueil",
    title: (name: string) => `${name} est là pour toi ✨`,
    subtitle:
      "Ton compagnon IA est maintenant à tes côtés. Il est prêt à t’écouter, te parler et t’accompagner à ton rythme.",
    personalityTitle: "Personnalité & tonalité",
    missionTitle: "Mission principale",
    profileChipLabel: (persona: string) => {
      if (persona === "woman" || persona === "woman50") return "Profil féminin";
      if (persona === "man" || persona === "man50") return "Profil masculin";
      if (persona === "androgynous") return "Profil androgyne";
      return "Profil personnalisé";
    },
    companionChip: "AmorIAI Companion",
    noAvatar: "Aucun avatar disponible pour le moment.",
    loading: "Chargement...",
    error:
      "Impossible de charger ton AmorIAI. Crée-en d’abord une depuis la page de création.",
    chatCta: (name: string) => `Parler avec ${name} maintenant`,
    createFirstCta: "Créer ma première AmorIAI",
  },
  en: {
    backHome: "← Back to home",
    title: (name: string) => `${name} is here for you ✨`,
    subtitle:
      "Your AI companion is now by your side. They’re ready to listen, talk and support you, at your own pace.",
    personalityTitle: "Personality & tone",
    missionTitle: "Main mission",
    profileChipLabel: (persona: string) => {
      if (persona === "woman" || persona === "woman50") return "Feminine profile";
      if (persona === "man" || persona === "man50") return "Masculine profile";
      if (persona === "androgynous") return "Androgynous profile";
      return "Custom profile";
    },
    companionChip: "AmorIAI Companion",
    noAvatar: "No avatar available yet.",
    loading: "Loading...",
    error:
      "We couldn’t load your AmorIAI. Please create one first from the creation page.",
    chatCta: (name: string) => `Talk with ${name} now`,
    createFirstCta: "Create my first AmorIAI",
  },
  es: {
    backHome: "← Volver al inicio",
    title: (name: string) => `${name} está aquí para ti ✨`,
    subtitle:
      "Tu compañero de IA ya está a tu lado. Está listo para escucharte, hablar contigo y acompañarte a tu ritmo.",
    personalityTitle: "Personalidad y tono",
    missionTitle: "Misión principal",
    profileChipLabel: (persona: string) => {
      if (persona === "woman" || persona === "woman50") return "Perfil femenino";
      if (persona === "man" || persona === "man50") return "Perfil masculino";
      if (persona === "androgynous") return "Perfil andrógino";
      return "Perfil personalizado";
    },
    companionChip: "Compañero AmorIAI",
    noAvatar: "No hay avatar disponible por ahora.",
    loading: "Cargando...",
    error:
      "No pudimos cargar tu AmorIAI. Crea una primero desde la página de creación.",
    chatCta: (name: string) => `Hablar con ${name} ahora`,
    createFirstCta: "Crear mi primera AmorIAI",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

// On essaie de séparer personnalité et mission à partir du system_prompt
function extractPersonality(prompt: string): string {
  const idx = prompt.indexOf("Ta mission");
  if (idx > 0) {
    return prompt.slice(0, idx).trim();
  }
  return prompt.trim();
}

function extractMission(prompt: string): string {
  const idx = prompt.indexOf("Ta mission");
  if (idx > -1) {
    return prompt.slice(idx).trim();
  }
  return prompt.trim();
}

export default function MyAIPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [loading, setLoading] = useState(true);
  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Langue depuis ?lang=
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      setLocale(normalizeLocale(lang));
    } catch {
      // on garde fr
    }
  }, []);

  const t = STRINGS[locale];

  // Charger la dernière IA de l’utilisateur connecté
  useEffect(() => {
    const loadAI = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          setError(t.error);
          setLoading(false);
          return;
        }

        const user = authData.user;

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
      } catch {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    loadAI();
  }, [t.error]);

  const buildUrlWithLang = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `${path}?${params.toString()}`;
  };

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
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
          .amoria-loading {
            font-size: 1rem;
          }
        `}</style>
      </main>
    );
  }

  if (error || !ai) {
    const createUrl = buildUrlWithLang("/create-amoria");
    const homeUrl = buildUrlWithLang("/");

    return (
      <main className="amoria-ai-root">
        <div className="amoria-ai-empty">
          <a href={homeUrl} className="amoria-back">
            {t.backHome}
          </a>
          <p className="amoria-error">{t.error}</p>
          <a href={createUrl} className="amoria-btn amoria-btn--primary">
            {t.createFirstCta}
          </a>
        </div>

        <style jsx>{`
          .amoria-ai-root {
            min-height: 100vh;
            padding: 1.5rem;
            background: radial-gradient(circle at top, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
          .amoria-ai-empty {
            max-width: 480px;
            margin: 5rem auto 0;
            text-align: center;
          }
          .amoria-back {
            font-size: 0.8rem;
            color: #9ca3af;
            text-decoration: none;
          }
          .amoria-error {
            margin: 1.2rem 0;
            font-size: 0.95rem;
          }
          .amoria-btn {
            border-radius: 999px;
            border: 1px solid transparent;
            padding: 0.6rem 1.4rem;
            font-size: 0.86rem;
            cursor: pointer;
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
        `}</style>
      </main>
    );
  }

  const personalityText = extractPersonality(ai.system_prompt);
  const missionText = extractMission(ai.system_prompt);

  const chatParams = new URLSearchParams();
  chatParams.set("iaId", ai.id);
  chatParams.set("lang", locale);
  const chatUrl = `/chat?${chatParams.toString()}`;
  const homeUrl = buildUrlWithLang("/");

  const profileChip = t.profileChipLabel(ai.persona_type);
  const chatLabel = t.chatCta(ai.name);

  return (
    <main className="amoria-ai-root">
      <header className="amoria-ai-header">
        <a href={homeUrl} className="amoria-back">
          {t.backHome}
        </a>
      </header>

      <section className="amoria-ai-card">
        <div className="amoria-ai-header-main">
          <h1 className="amoria-ai-title">{t.title(ai.name)}</h1>
          <p className="amoria-ai-subtitle">{t.subtitle}</p>
        </div>

        <div className="amoria-ai-avatar-block">
          <div className="amoria-avatar-ring">
            {ai.avatar_image_url ? (
              <img
                src={ai.avatar_image_url}
                alt="Avatar AmorIAI"
                className="amoria-avatar-img"
              />
            ) : (
              <div className="amoria-avatar-placeholder">{t.noAvatar}</div>
            )}
          </div>
          <p className="amoria-ai-name">{ai.name}</p>

          <div className="amoria-chip-row">
            <span className="amoria-chip amoria-chip--outline">{profileChip}</span>
            <span className="amoria-chip amoria-chip--solid">
              {t.companionChip}
            </span>
          </div>
        </div>

        <div className="amoria-ai-panels">
          <article className="amoria-panel">
            <h2 className="amoria-panel-title">{t.personalityTitle}</h2>
            <p className="amoria-panel-text">{personalityText}</p>
          </article>

          <article className="amoria-panel">
            <h2 className="amoria-panel-title">{t.missionTitle}</h2>
            <p className="amoria-panel-text">{missionText}</p>
          </article>
        </div>

        <div className="amoria-ai-actions">
          <a href={chatUrl} className="amoria-btn amoria-btn--primary">
            {chatLabel}
          </a>
        </div>
      </section>

      <style jsx>{`
        .amoria-ai-root {
          min-height: 100vh;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #000 65%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .amoria-ai-header {
          width: 100%;
          max-width: 900px;
          margin-bottom: 1.5rem;
        }

        .amoria-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }

        .amoria-ai-card {
          width: 100%;
          max-width: 900px;
          border-radius: 1.8rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: radial-gradient(
            circle at top,
            #020617 0,
            #020617 35%,
            #020617 40%,
            #000 100%
          );
          box-shadow: 0 26px 70px rgba(15, 23, 42, 0.95);
          padding: 2.1rem 2rem 1.9rem;
          text-align: center;
        }

        .amoria-ai-header-main {
          margin-bottom: 1.7rem;
        }

        .amoria-ai-title {
          font-size: 1.7rem;
          margin-bottom: 0.3rem;
        }

        .amoria-ai-subtitle {
          font-size: 0.9rem;
          color: #9ca3af;
          max-width: 520px;
          margin: 0 auto;
        }

        .amoria-ai-avatar-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 1.6rem;
        }

        .amoria-avatar-ring {
          width: 190px;
          height: 190px;
          border-radius: 999px;
          padding: 3px;
          background: conic-gradient(from 180deg, #fb37ff, #ff6b9c, #38bdf8, #fb37ff);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 45px rgba(248, 113, 113, 0.5);
        }

        .amoria-avatar-img {
          width: 182px;
          height: 182px;
          border-radius: 999px;
          object-fit: cover;
          background: #020617;
        }

        .amoria-avatar-placeholder {
          width: 182px;
          height: 182px;
          border-radius: 999px;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #9ca3af;
          padding: 1rem;
        }

        .amoria-ai-name {
          margin-top: 0.4rem;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .amoria-chip-row {
          display: flex;
          gap: 0.6rem;
          margin-top: 0.4rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .amoria-chip {
          font-size: 0.75rem;
          padding: 0.25rem 0.9rem;
          border-radius: 999px;
          border: 1px solid transparent;
        }

        .amoria-chip--outline {
          border-color: rgba(148, 163, 184, 0.9);
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
        }

        .amoria-chip--solid {
          border-color: transparent;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          box-shadow: 0 10px 26px rgba(248, 113, 113, 0.45);
        }

        .amoria-ai-panels {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          margin-top: 1.4rem;
          text-align: left;
        }

        .amoria-panel {
          border-radius: 1.1rem;
          border: 1px solid rgba(148, 163, 184, 0.55);
          background: radial-gradient(
            circle at top left,
            rgba(56, 189, 248, 0.12),
            rgba(15, 23, 42, 0.96)
          );
          padding: 0.95rem 1rem;
          font-size: 0.86rem;
        }

        .amoria-panel-title {
          font-size: 0.85rem;
          color: #cbd5f5;
          margin-bottom: 0.4rem;
        }

        .amoria-panel-text {
          margin: 0;
          color: #e5e7eb;
          white-space: pre-line;
        }

        .amoria-ai-actions {
          margin-top: 1.6rem;
          display: flex;
          justify-content: center;
        }

        .amoria-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0.7rem 1.7rem;
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        .amoria-btn--primary {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.55);
        }

        @media (max-width: 860px) {
          .amoria-ai-card {
            padding-inline: 1.4rem;
          }
          .amoria-ai-panels {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 540px) {
          .amoria-ai-root {
            padding-inline: 1rem;
          }
          .amoria-ai-card {
            padding-inline: 1.1rem;
          }
          .amoria-avatar-ring {
            width: 170px;
            height: 170px;
          }
          .amoria-avatar-img,
          .amoria-avatar-placeholder {
            width: 164px;
            height: 164px;
          }
        }
      `}</style>
    </main>
  );
}
