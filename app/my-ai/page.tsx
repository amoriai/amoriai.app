"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// --- TYPES ---
type Locale = "fr" | "en" | "es";

type AmoriaRow = {
  id: string;
  user_id: string;
  name: string;
  persona_type: string; // ex: "woman" / "man" / "androgynous" / "50plus"
  main_language: string; // "fr" | "en" | "es"
  avatar_image_url: string | null;
  accent_color: string | null;
  system_prompt: string; // texte de personnalité / mission
  voice_id: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

// --- TRADUCTIONS ---
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
    title: "Ton AmorIAI est prête ✨",
    subtitle:
      "Voici ton IA personnelle. Ensuite tu pourras chatter avec elle, activer la voix et personnaliser son style.",
    nameLabel: "Prénom",
    goalLabel: "Mission principale (résumé)",
    categoryLabel: "Type d’IA",
    personalityLabel: "Personnalité / tonalité",
    noAvatar: "Aucun avatar disponible pour le moment.",
    loading: "Chargement...",
    error:
      "Impossible de charger ton AmorIAI. Crée-en d’abord une depuis la page de création.",
    chatCta: "Chatter avec cette IA",
    createFirstCta: "Créer ma première AmorIAI",
  },
  en: {
    backHome: "← Back to home",
    title: "Your AmorIAI is ready ✨",
    subtitle:
      "Here is your personal AI. Next, you’ll be able to chat with it, enable voice and customize its style.",
    nameLabel: "Name",
    goalLabel: "Main mission (summary)",
    categoryLabel: "AI type",
    personalityLabel: "Personality / tone",
    noAvatar: "No avatar available yet.",
    loading: "Loading...",
    error:
      "We couldn’t load your AmorIAI. Please create one first from the creation page.",
    chatCta: "Chat with this AI",
    createFirstCta: "Create my first AmorIAI",
  },
  es: {
    backHome: "← Volver al inicio",
    title: "Tu AmorIAI está lista ✨",
    subtitle:
      "Aquí está tu IA personal. Luego podrás chatear con ella, activar la voz y personalizar su estilo.",
    nameLabel: "Nombre",
    goalLabel: "Misión principal (resumen)",
    categoryLabel: "Tipo de IA",
    personalityLabel: "Personalidad / tono",
    noAvatar: "No hay avatar disponible por ahora.",
    loading: "Cargando...",
    error:
      "No pudimos cargar tu AmorIAI. Crea una primero desde la página de creación.",
    chatCta: "Chatear con esta IA",
    createFirstCta: "Crear mi primera AmorIAI",
  },
};

// --- FORMAT DU TYPE D’IA ---
function formatPersonaType(persona: string, locale: Locale): string {
  switch (persona) {
    case "woman":
      return locale === "fr"
        ? "IA féminine"
        : locale === "en"
        ? "Feminine AI"
        : "IA femenina";
    case "man":
      return locale === "fr"
        ? "IA masculine"
        : locale === "en"
        ? "Masculine AI"
        : "IA masculina";
    case "androgynous":
      return locale === "fr"
        ? "IA androgyne / non genrée"
        : locale === "en"
        ? "Androgynous / non-gendered AI"
        : "IA andrógina / sin género";
    case "50plus":
      return locale === "fr"
        ? "Profil 50+"
        : locale === "en"
        ? "50+ profile"
        : "Perfil 50+";
    default:
      return persona;
  }
}

export default function MyAIPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [loading, setLoading] = useState(true);
  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1) Lire la langue depuis ?lang=
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      if (lang === "fr" || lang === "en" || lang === "es") {
        setLocale(lang);
      }
    } catch {
      // ignore
    }
  }, []);

  const t = STRINGS[locale];

  // 2) Charger Supabase + récupérer la dernière IA de l’utilisateur connecté
  useEffect(() => {
    const loadAI = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Qui est connecté ?
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authData?.user) {
          setError(t.error);
          setLoading(false);
          return;
        }

        const user = authData.user;

        // Dernière IA créée pour cet utilisateur
        const { data, error } = await supabase
          .from("user_amoria") // garde le même nom de table que tu utilises déjà
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
      } catch (e) {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    loadAI();
  }, [t.error]);

  // Helper pour garder le ?lang= aussi sur les liens
  const buildUrlWithLang = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `${path}?${params.toString()}`;
  };

  // --- ÉTATS INTERMÉDIAIRES ---

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
            color: #e5e7eb;
          }
        `}</style>
      </main>
    );
  }

  if (error || !ai) {
    const createUrl = buildUrlWithLang("/create-ia");
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

  // URL pour le chat : /chat?iaId=...&lang=...
  const chatParams = new URLSearchParams();
  chatParams.set("iaId", ai.id);
  chatParams.set("lang", locale);
  const chatUrl = `/chat?${chatParams.toString()}`;
  const homeUrl = buildUrlWithLang("/");

  return (
    <main className="amoria-ai-root">
      <header className="amoria-ai-header">
        <a href={homeUrl} className="amoria-back">
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
              alt="Avatar AmorIAI"
              className="amoria-avatar-img"
            />
          ) : (
            <div className="amoria-avatar-placeholder">{t.noAvatar}</div>
          )}
        </div>

        <div className="amoria-ai-info">
          <div className="amoria-info-row">
            <span className="amoria-label">{t.nameLabel}</span>
            <strong>{ai.name}</strong>
          </div>

          <div className="amoria-info-row">
            <span className="amoria-label">{t.categoryLabel}</span>
            <strong>{formatPersonaType(ai.persona_type, locale)}</strong>
          </div>

          <div className="amoria-info-row amoria-info-row--column">
            <span className="amoria-label">{t.personalityLabel}</span>
            <span className="amoria-value">
              {ai.system_prompt.slice(0, 120)}…
            </span>
          </div>

          <div className="amoria-info-row amoria-info-row--column">
            <span className="amoria-label">{t.goalLabel}</span>
            <span className="amoria-value">{ai.system_prompt}</span>
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
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }
        .amoria-ai-header {
          max-width: 700px;
          margin: 0 auto 1.5rem;
        }
        .amoria-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }
        .amoria-ai-card {
          background: #0f172a;
          border-radius: 1.2rem;
          max-width: 700px;
          margin: 0 auto;
          padding: 1.7rem 1.6rem 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.85);
        }
        .amoria-ai-title {
          font-size: 1.5rem;
          margin-bottom: 0.3rem;
        }
        .amoria-ai-subtitle {
          font-size: 0.9rem;
          color: #9ca3af;
          margin-bottom: 1.2rem;
        }
        .amoria-ai-avatar {
          margin: 0.5rem 0 1.2rem;
          display: flex;
          justify-content: center;
        }
        .amoria-avatar-img {
          width: 130px;
          height: 130px;
          border-radius: 999px;
          object-fit: cover;
          border: 2px solid rgba(251, 55, 255, 0.6);
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
          margin-top: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .amoria-info-row {
          display: flex;
          justify-content: space-between;
          gap: 0.7rem;
          font-size: 0.9rem;
        }
        .amoria-info-row--column {
          flex-direction: column;
          align-items: flex-start;
        }
        .amoria-label {
          font-size: 0.78rem;
          color: #9ca3af;
        }
        .amoria-value {
          font-size: 0.9rem;
        }
        .amoria-ai-actions {
          margin-top: 1.4rem;
          display: flex;
          justify-content: flex-end;
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

        @media (max-width: 640px) {
          .amoria-ai-root {
            padding-inline: 1rem;
          }
          .amoria-ai-card {
            padding-inline: 1.2rem;
          }
        }
      `}</style>
    </main>
  );
}
