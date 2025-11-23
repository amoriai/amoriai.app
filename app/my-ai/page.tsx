"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// --- TYPES ---
type Locale = "fr" | "en" | "es";

type AmoriaRow = {
  id: string;
  user_id: string;
  name: string;
  // On laisse en string car la colonne peut être "woman" | "man" | "androgynous" | "50plus"
  persona_type?: string | null;
  personality_id?: string | null;
  main_language?: string | null;
  avatar_image_url?: string | null;
  accent_color?: string | null;
  goal?: string | null;
  system_prompt?: string | null;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
};

// --- TEXTES ---
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
    languageLabel: string;
    noAvatar: string;
    loading: string;
    errorNoUser: string;
    errorNoAI: string;
    chatButton: string;
  }
> = {
  fr: {
    backHome: "← Retour à l’accueil",
    title: "Ton AmorIA est prête ✨",
    subtitle:
      "Voici ton IA personnelle. Plus tard, on ajoutera le chat en temps réel, la voix, un avatar généré et des réglages avancés.",
    nameLabel: "Prénom",
    goalLabel: "Mission principale",
    categoryLabel: "Type d’IA",
    personalityLabel: "Personnalité",
    languageLabel: "Langue principale",
    noAvatar: "Aucun avatar disponible pour le moment.",
    loading: "Chargement...",
    errorNoUser:
      "Tu n’es pas connecté·e. Connecte-toi pour voir ton AmorIA.",
    errorNoAI:
      "Aucune AmorIA trouvée. Crée-en une depuis la page de création.",
    chatButton: "Chatter avec ton AmorIA",
  },
  en: {
    backHome: "← Back to home",
    title: "Your AmorIA is ready ✨",
    subtitle:
      "Here is your personal AI. Later we’ll add real-time chat, voice, generated avatar and advanced settings.",
    nameLabel: "Name",
    goalLabel: "Main mission",
    categoryLabel: "AI type",
    personalityLabel: "Personality",
    languageLabel: "Main language",
    noAvatar: "No avatar available yet.",
    loading: "Loading...",
    errorNoUser:
      "You are not logged in. Please log in to see your AmorIA.",
    errorNoAI:
      "No AmorIA found. Create one from the creation page.",
    chatButton: "Chat with your AmorIA",
  },
  es: {
    backHome: "← Volver al inicio",
    title: "Tu AmorIA está lista ✨",
    subtitle:
      "Aquí está tu IA personal. Más adelante añadiremos chat en tiempo real, voz, avatar generado y ajustes avanzados.",
    nameLabel: "Nombre",
    goalLabel: "Misión principal",
    categoryLabel: "Tipo de IA",
    personalityLabel: "Personalidad",
    languageLabel: "Idioma principal",
    noAvatar: "No hay avatar disponible por ahora.",
    loading: "Cargando...",
    errorNoUser:
      "No has iniciado sesión. Conéctate para ver tu AmorIA.",
    errorNoAI:
      "No se encontró ninguna AmorIA. Crea una desde la página de creación.",
    chatButton: "Chatear con tu AmorIA",
  },
};

// mêmes ids que sur le wizard /create-ia
type CategoryId = "woman" | "man" | "androgynous" | "50plus";

const CATEGORY_LABELS: Record<CategoryId, Record<Locale, string>> = {
  woman: {
    fr: "IA féminine",
    en: "Feminine AI",
    es: "IA femenina",
  },
  man: {
    fr: "IA masculine",
    en: "Masculine AI",
    es: "IA masculina",
  },
  androgynous: {
    fr: "IA androgyne / non genrée",
    en: "Androgynous / non-gendered AI",
    es: "IA andrógina / sin género",
  },
  "50plus": {
    fr: "50 ans et plus",
    en: "50+ years look",
    es: "Apariencia 50+",
  },
};

const PERSONALITY_LABELS: Record<string, string> = {
  soft_support: "Douce & rassurante",
  creative: "Créative & intuitive",
  coach: "Coach de vie",
  friend: "Ami bienveillant",
  strategist: "Stratège",
  charismatic: "Charismatique",
  neutral_friend: "Présence neutre",
  mindset: "Coach mindset",
  deep: "Profond & introspectif",
  mentor: "Mentor expérimenté",
  warm_sage: "Sage chaleureux",
  pro: "Profil très pro",
};

// --- HELPERS ---
function getLocaleFromSearch(): Locale {
  try {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    if (lang === "fr" || lang === "en" || lang === "es") return lang;
  } catch {
    // ignore
  }
  return "fr";
}

function formatCategory(
  persona_type: string | null | undefined,
  locale: Locale
): string {
  if (!persona_type) return "—";
  if (
    persona_type === "woman" ||
    persona_type === "man" ||
    persona_type === "androgynous" ||
    persona_type === "50plus"
  ) {
    return CATEGORY_LABELS[persona_type][locale];
  }
  // valeur inattendue, on affiche brute
  return persona_type;
}

function formatLanguage(main_language: string | null | undefined): string {
  if (main_language === "fr") return "Français";
  if (main_language === "en") return "English";
  if (main_language === "es") return "Español";
  if (!main_language) return "—";
  return main_language;
}

// --- PAGE ---
export default function MyAIPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [loading, setLoading] = useState(true);
  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [error, setError] = useState<"no_user" | "no_ai" | null>(null);

  // lire ?lang=
  useEffect(() => {
    setLocale(getLocaleFromSearch());
  }, []);

  const t = STRINGS[locale];

  // Charger Supabase et récupérer la dernière IA
  useEffect(() => {
    const loadAI = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError || !authData?.user) {
          setError("no_user");
          setLoading(false);
          return;
        }

        const user = authData.user;

        const { data, error: queryError } = await supabase
          .from("user_amoria")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle<AmoriaRow>();

        if (queryError || !data) {
          setError("no_ai");
          setLoading(false);
          return;
        }

        setAi(data);
      } catch {
        setError("no_ai");
      } finally {
        setLoading(false);
      }
    };

    loadAI();
  }, []);

  // états chargement / erreur
  if (loading) {
    return (
      <main className="amoria-ai-root">
        <p className="amoria-loading">{t.loading}</p>

        <style jsx>{`
          .amoria-ai-root {
            min-height: 100vh;
            padding: 1.5rem;
            background: radial-gradient(circle at top, #020617, #000);
            color: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
          .amoria-loading {
            font-size: 1rem;
            color: #9ca3af;
          }
        `}</style>
      </main>
    );
  }

  if (error || !ai) {
    return (
      <main className="amoria-ai-root">
        <div className="amoria-ai-error-card">
          <a href="/" className="amoria-back">
            {t.backHome}
          </a>
          <p className="amoria-error-text">
            {error === "no_user" ? t.errorNoUser : t.errorNoAI}
          </p>
          <div className="amoria-error-actions">
            <a href="/login" className="amoria-btn amoria-btn--ghost">
              Login
            </a>
            <a href="/create-ia" className="amoria-btn amoria-btn--primary">
              Créer mon AmorIA
            </a>
          </div>
        </div>

        <style jsx>{`
          .amoria-ai-root {
            min-height: 100vh;
            padding: 1.5rem;
            background: radial-gradient(circle at top, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .amoria-ai-error-card {
            background: #0f172a;
            border-radius: 1.2rem;
            padding: 1.5rem 1.7rem;
            border: 1px solid rgba(148, 163, 184, 0.4);
            max-width: 420px;
            width: 100%;
          }
          .amoria-back {
            font-size: 0.8rem;
            color: #9ca3af;
            text-decoration: none;
          }
          .amoria-back:hover {
            color: #e5e7eb;
          }
          .amoria-error-text {
            margin-top: 1rem;
            font-size: 0.9rem;
          }
          .amoria-error-actions {
            margin-top: 1.2rem;
            display: flex;
            gap: 0.75rem;
          }
          .amoria-btn {
            border-radius: 999px;
            border: 1px solid transparent;
            font-size: 0.84rem;
            cursor: pointer;
            padding: 0.55rem 1.2rem;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .amoria-btn--primary {
            background: linear-gradient(
              135deg,
              #fb37ff,
              #ff6b9c,
              #f97316
            );
            color: #f9fafb;
            box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
          }
          .amoria-btn--ghost {
            background: transparent;
            color: #e5e7eb;
            border-color: rgba(148, 163, 184, 0.6);
          }
        `}</style>
      </main>
    );
  }

  // données dérivées
  const missionText = ai.goal || ai.system_prompt || "—";
  const personalityLabel =
    (ai.personality_id && PERSONALITY_LABELS[ai.personality_id]) || "—";
  const categoryLabel = formatCategory(ai.persona_type ?? null, locale);
  const mainLangLabel = formatLanguage(ai.main_language ?? null);
  const accent = ai.accent_color || "#fb37ff";

  const params = new URLSearchParams();
  params.set("lang", locale);
  const chatUrl = `/chat?iaId=${ai.id}&${params.toString()}`; // tu peux adapter ce chemin

  return (
    <main className="amoria-ai-root">
      <header className="amoria-ai-header">
        <a href={`/?${params.toString()}`} className="amoria-back">
          {t.backHome}
        </a>
      </header>

      <section className="amoria-ai-card">
        <div className="amoria-ai-card-header">
          <h1 className="amoria-ai-title">{t.title}</h1>
          <p className="amoria-ai-subtitle">{t.subtitle}</p>
        </div>

        <div className="amoria-ai-layout">
          <div className="amoria-ai-avatar-block">
            <div
              className="amoria-ai-avatar-ring"
              style={{ boxShadow: `0 0 0 2px ${accent}` }}
            >
              {ai.avatar_image_url ? (
                <img
                  src={ai.avatar_image_url}
                  alt={ai.name}
                  className="amoria-avatar-img"
                />
              ) : (
                <div className="amoria-avatar-placeholder">
                  <span>{t.noAvatar}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              className="amoria-btn amoria-btn--primary amoria-ai-chat-btn"
              onClick={() => {
                window.location.href = chatUrl;
              }}
            >
              {t.chatButton}
            </button>
          </div>

          <div className="amoria-ai-info">
            <div className="amoria-info-row">
              <span className="amoria-info-label">{t.nameLabel}</span>
              <span className="amoria-info-value">{ai.name}</span>
            </div>

            <div className="amoria-info-row">
              <span className="amoria-info-label">
                {t.categoryLabel}
              </span>
              <span className="amoria-info-value">
                {categoryLabel}
              </span>
            </div>

            <div className="amoria-info-row">
              <span className="amoria-info-label">
                {t.personalityLabel}
              </span>
              <span className="amoria-info-value">
                {personalityLabel}
              </span>
            </div>

            <div className="amoria-info-row">
              <span className="amoria-info-label">
                {t.languageLabel}
              </span>
              <span className="amoria-info-value">
                {mainLangLabel}
              </span>
            </div>

            <div className="amoria-info-row amoria-info-row--column">
              <span className="amoria-info-label">{t.goalLabel}</span>
              <span className="amoria-info-value amoria-info-value--multiline">
                {missionText}
              </span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .amoria-ai-root {
          min-height: 100vh;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-ai-header {
          max-width: 1120px;
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
          max-width: 1120px;
          margin: 0 auto;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000
          );
          border-radius: 1.5rem;
          padding: 1.6rem 1.7rem 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.85);
        }

        .amoria-ai-card-header {
          margin-bottom: 1.4rem;
        }

        .amoria-ai-title {
          font-size: 1.5rem;
          margin-bottom: 0.35rem;
        }

        .amoria-ai-subtitle {
          font-size: 0.88rem;
          color: #9ca3af;
          max-width: 40rem;
        }

        .amoria-ai-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.3fr);
          gap: 1.8rem;
          align-items: flex-start;
        }

        .amoria-ai-avatar-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
        }

        .amoria-ai-avatar-ring {
          border-radius: 999px;
          padding: 4px;
          background: radial-gradient(
            circle at 30% 0,
            #f97316,
            #fb37ff,
            #38bdf8
          );
        }

        .amoria-avatar-img {
          width: 140px;
          height: 140px;
          border-radius: 999px;
          object-fit: cover;
          border: 3px solid #020617;
        }

        .amoria-avatar-placeholder {
          width: 140px;
          height: 140px;
          border-radius: 999px;
          background: #020617;
          border: 3px solid #020617;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
          padding: 0.8rem;
        }

        .amoria-ai-chat-btn {
          margin-top: 0.3rem;
          width: 100%;
          max-width: 220px;
          justify-content: center;
        }

        .amoria-ai-info {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .amoria-info-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.9rem;
        }

        .amoria-info-row--column {
          flex-direction: column;
          align-items: flex-start;
        }

        .amoria-info-label {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-info-value {
          font-weight: 500;
        }

        .amoria-info-value--multiline {
          white-space: pre-wrap;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .amoria-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          font-size: 0.86rem;
          cursor: pointer;
          white-space: nowrap;
          padding: 0.55rem 1.2rem;
        }

        .amoria-btn--primary {
          background: linear-gradient(
            135deg,
            #fb37ff,
            #ff6b9c,
            #f97316
          );
          color: #f9fafb;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
        }

        .amoria-btn--ghost {
          background: transparent;
          color: #e5e7eb;
          border-color: rgba(148, 163, 184, 0.6);
        }

        @media (max-width: 960px) {
          .amoria-ai-layout {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-ai-avatar-block {
            order: -1;
          }
        }

        @media (max-width: 640px) {
          .amoria-ai-root {
            padding-inline: 1rem;
          }

          .amoria-ai-card {
            padding-inline: 1.1rem;
          }
        }
      `}</style>
    </main>
  );
}
