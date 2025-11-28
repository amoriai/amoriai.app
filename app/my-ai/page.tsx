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
    chatCta: string;
    createFirstCta: string;
  }
> = {
  fr: {
    backHome: "← Retour à l’accueil",
    title: "Ton AmorIAI est prêt ✨",
    subtitle:
      "Ton compagnon IA est maintenant actif. Tu peux commencer à discuter, activer la voix et ajuster son style.",
    nameLabel: "Prénom",
    goalLabel: "Mission principale",
    categoryLabel: "Type d’IA",
    personalityLabel: "Personnalité & tonalité",
    noAvatar: "Avatar en cours de création…",
    loading: "Chargement de ton AmorIAI…",
    error:
      "Impossible de charger ton AmorIAI. Crée-en d’abord un depuis la page de création.",
    chatCta: "Discuter avec mon AmorIAI",
    createFirstCta: "Créer mon premier AmorIAI",
  },
  en: {
    backHome: "← Back to home",
    title: "Your AmorIAI is ready ✨",
    subtitle:
      "Your AI companion is now active. You can start chatting, enable voice and fine-tune their style.",
    nameLabel: "Name",
    goalLabel: "Main mission",
    categoryLabel: "AI type",
    personalityLabel: "Personality & tone",
    noAvatar: "Avatar is being generated…",
    loading: "Loading your AmorIAI…",
    error:
      "We couldn’t load your AmorIAI. Please create one first from the creation page.",
    chatCta: "Chat with my AmorIAI",
    createFirstCta: "Create my first AmorIAI",
  },
  es: {
    backHome: "← Volver al inicio",
    title: "Tu AmorIAI está listo ✨",
    subtitle:
      "Tu compañero de IA ya está activo. Ahora puedes empezar a chatear, activar la voz y ajustar su estilo.",
    nameLabel: "Nombre",
    goalLabel: "Misión principal",
    categoryLabel: "Tipo de IA",
    personalityLabel: "Personalidad y tono",
    noAvatar: "El avatar se está generando…",
    loading: "Cargando tu AmorIAI…",
    error:
      "No pudimos cargar tu AmorIAI. Crea uno primero desde la página de creación.",
    chatCta: "Hablar con mi AmorIAI",
    createFirstCta: "Crear mi primer AmorIAI",
  },
};

// adapte aux valeurs venant de create-amoria : woman | man | woman50 | man50 | androgynous
function formatPersonaType(persona: string, locale: Locale): string {
  switch (persona) {
    case "woman":
      return locale === "fr"
        ? "Profil féminin"
        : locale === "en"
        ? "Feminine profile"
        : "Perfil femenino";
    case "man":
      return locale === "fr"
        ? "Profil masculin"
        : locale === "en"
        ? "Masculine profile"
        : "Perfil masculino";
    case "woman50":
      return locale === "fr"
        ? "Femme 50+"
        : locale === "en"
        ? "Woman 50+"
        : "Mujer 50+";
    case "man50":
      return locale === "fr"
        ? "Homme 50+"
        : locale === "en"
        ? "Man 50+"
        : "Hombre 50+";
    case "androgynous":
      return locale === "fr"
        ? "Androgyne / non-binaire"
        : locale === "en"
        ? "Androgynous / non-binary"
        : "Andrógino / no binario";
    default:
      return persona;
  }
}

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

// petit helper pour un résumé plus court et plus "humain"
function summarizePrompt(prompt: string, max = 220): string {
  const trimmed = prompt.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max).trimEnd() + "…";
}

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
      setLocale(normalizeLocale(lang));
    } catch {
      // on garde "fr"
    }
  }, []);

  const t = STRINGS[locale];

  // Charger la dernière IA de l’utilisateur connecté
  useEffect(() => {
    const loadAI = async () => {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authData?.user) {
          setError(STRINGS[locale].error);
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
          setError(STRINGS[locale].error);
          setLoading(false);
          return;
        }

        setAi(data as AmoriaRow);
      } catch {
        setError(STRINGS[locale].error);
      } finally {
        setLoading(false);
      }
    };

    loadAI();
  }, [locale]);

  const buildUrlWithLang = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `${path}?${params.toString()}`;
  };

  if (loading) {
    return (
      <main className="amoria-ai-root">
        <div className="amoria-ai-loading-card">
          <p className="amoria-loading">{t.loading}</p>
        </div>

        <style jsx>{`
          .amoria-ai-root {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at top, #020617 0, #000 70%);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
          .amoria-ai-loading-card {
            padding: 1.2rem 1.6rem;
            border-radius: 1rem;
            border: 1px solid rgba(148, 163, 184, 0.4);
            background: rgba(15, 23, 42, 0.95);
            box-shadow: 0 20px 45px rgba(15, 23, 42, 0.9);
          }
          .amoria-loading {
            font-size: 0.95rem;
            color: #e5e7eb;
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

          <div className="amoria-ai-empty-card">
            <p className="amoria-error">{t.error}</p>
            <a href={createUrl} className="amoria-btn amoria-btn--primary">
              {t.createFirstCta}
            </a>
          </div>
        </div>

        <style jsx>{`
          .amoria-ai-root {
            min-height: 100vh;
            padding: 1.5rem;
            background: radial-gradient(circle at top, #020617 0, #000 70%);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
          .amoria-ai-empty {
            max-width: 520px;
            margin: 3.5rem auto 0;
          }
          .amoria-back {
            font-size: 0.8rem;
            color: #9ca3af;
            text-decoration: none;
          }
          .amoria-ai-empty-card {
            margin-top: 1.4rem;
            padding: 1.5rem 1.6rem;
            border-radius: 1.2rem;
            border: 1px solid rgba(148, 163, 184, 0.4);
            background: radial-gradient(
              circle at top,
              #020617 0,
              #020617 40%,
              #000 100%
            );
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.85);
            text-align: center;
          }
          .amoria-error {
            margin-bottom: 1.2rem;
            font-size: 0.95rem;
          }
          .amoria-btn {
            border-radius: 999px;
            border: 1px solid transparent;
            padding: 0.7rem 1.6rem;
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
            box-shadow:
              0 0 25px rgba(251, 55, 255, 0.5),
              0 0 60px rgba(249, 115, 22, 0.5);
          }
        `}</style>
      </main>
    );
  }

  const chatParams = new URLSearchParams();
  chatParams.set("iaId", ai.id);
  chatParams.set("lang", locale);
  const chatUrl = `/chat?${chatParams.toString()}`;
  const homeUrl = buildUrlWithLang("/");

  const personaLabel = formatPersonaType(ai.persona_type, locale);
  const summary = summarizePrompt(ai.system_prompt);

  return (
    <main className="amoria-ai-root">
      <header className="amoria-ai-header">
        <a href={homeUrl} className="amoria-back">
          {t.backHome}
        </a>
      </header>

      <section className="amoria-ai-card">
        <div className="amoria-ai-header-text">
          <h1 className="amoria-ai-title">{t.title}</h1>
          <p className="amoria-ai-subtitle">{t.subtitle}</p>
        </div>

        <div className="amoria-ai-top">
          <div className="amoria-avatar-ring">
            {ai.avatar_image_url ? (
              <img
                src={ai.avatar_image_url}
                alt="Avatar AmorIAI"
                className="amoria-avatar-img"
              />
            ) : (
              <div className="amoria-avatar-placeholder">
                <span>{t.noAvatar}</span>
              </div>
            )}
          </div>

          <div className="amoria-ai-summary">
            <p className="amoria-ai-name">{ai.name}</p>
            <div className="amoria-chip-row">
              <span className="amoria-chip">{personaLabel}</span>
              <span className="amoria-chip-secondary">
                AmorIAI Companion
              </span>
            </div>
          </div>
        </div>

        <div className="amoria-ai-info-grid">
          <div className="amoria-info-block">
            <h2 className="amoria-info-title">{t.personalityLabel}</h2>
            <p className="amoria-info-text">{summary}</p>
          </div>

          <div className="amoria-info-block">
            <h2 className="amoria-info-title">{t.goalLabel}</h2>
            <p className="amoria-info-text-full">{ai.system_prompt}</p>
          </div>
        </div>

        <div className="amoria-ai-actions">
          <a href={chatUrl} className="amoria-btn amoria-btn--primary">
            {t.chatCta}
          </a>
        </div>
      </section>

      <style jsx>{`
        .amoria-ai-root {
          min-height: 100vh;
          padding: 1.6rem;
          background: radial-gradient(circle at top, #020617 0, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .amoria-ai-header {
          max-width: 880px;
          width: 100%;
          margin: 0 auto 1.4rem;
        }

        .amoria-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }

        .amoria-ai-card {
          max-width: 880px;
          width: 100%;
          margin: 0 auto;
          border-radius: 1.6rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: radial-gradient(
            circle at top,
            #020617 0,
            #020617 35%,
            #020617 60%,
            #000 100%
          );
          box-shadow:
            0 0 40px rgba(251, 55, 255, 0.18),
            0 28px 70px rgba(15, 23, 42, 0.9);
          padding: 1.9rem 1.9rem 1.6rem;
        }

        .amoria-ai-header-text {
          text-align: center;
          margin-bottom: 1.4rem;
        }

        .amoria-ai-title {
          font-size: 1.9rem;
          font-weight: 700;
          margin-bottom: 0.3rem;
        }

        .amoria-ai-subtitle {
          font-size: 0.95rem;
          color: #9ca3af;
          max-width: 520px;
          margin: 0 auto;
        }

        .amoria-ai-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.4rem;
        }

        .amoria-avatar-ring {
          padding: 4px;
          border-radius: 999px;
          background: conic-gradient(
            from 180deg,
            #fb37ff,
            #ff6b9c,
            #38bdf8,
            #fb37ff
          );
          box-shadow:
            0 0 35px rgba(251, 55, 255, 0.45),
            0 0 60px rgba(56, 189, 248, 0.3);
        }

        .amoria-avatar-img {
          width: 200px;
          height: 200px;
          border-radius: 999px;
          object-fit: cover;
          display: block;
        }

        .amoria-avatar-placeholder {
          width: 200px;
          height: 200px;
          border-radius: 999px;
          background: #020617;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.3rem;
          font-size: 0.85rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-ai-summary {
          text-align: center;
        }

        .amoria-ai-name {
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }

        .amoria-chip-row {
          display: flex;
          gap: 0.4rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .amoria-chip {
          border-radius: 999px;
          padding: 0.25rem 0.8rem;
          font-size: 0.78rem;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.9);
        }

        .amoria-chip-secondary {
          border-radius: 999px;
          padding: 0.25rem 0.8rem;
          font-size: 0.78rem;
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(251, 113, 133, 0.8);
        }

        .amoria-ai-info-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 1rem;
          margin-top: 0.6rem;
        }

        .amoria-info-block {
          border-radius: 1rem;
          padding: 0.9rem 1rem;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.45);
        }

        .amoria-info-title {
          font-size: 0.86rem;
          color: #9ca3af;
          margin-bottom: 0.35rem;
        }

        .amoria-info-text,
        .amoria-info-text-full {
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .amoria-ai-actions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .amoria-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0.8rem 1.9rem;
          font-size: 0.95rem;
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
          box-shadow:
            0 0 25px rgba(251, 55, 255, 0.55),
            0 0 60px rgba(249, 115, 22, 0.55);
        }

        @media (max-width: 780px) {
          .amoria-ai-card {
            padding-inline: 1.4rem;
          }
          .amoria-ai-info-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 520px) {
          .amoria-ai-root {
            padding-inline: 1rem;
          }
          .amoria-ai-card {
            padding-inline: 1.1rem;
          }
          .amoria-avatar-img,
          .amoria-avatar-placeholder {
            width: 180px;
            height: 180px;
          }
        }
      `}</style>
    </main>
  );
            }
