"use client";

export const dynamic = "force-dynamic";

import React, { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // adapte le chemin si besoin

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
  pageTitle: (name: string) => string;
  subtitle: (name: string) => string;
  statusOnline: string;
  suggestionTitle: string;
  suggestions: string[];
  textareaPlaceholder: string;
  sendLabel: string;
  loading: string;
  errorNoIA: string;
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

const STRINGS: Record<Locale, UiCopy> = {
  fr: {
    backHome: "← Retour à l’accueil",
    pageTitle: (name) => `Chat avec ${name}`,
    subtitle: (name) =>
      `${name} est en ligne. Tu peux lui écrire librement, il ou elle s’adapte à ton humeur.`,
    statusOnline: "En ligne",
    suggestionTitle: "Tu peux commencer par lui dire…",
    suggestions: [
      "« Aujourd’hui, j’ai besoin de ventiler… »",
      "« J’aimerais que tu me motives pour mes projets. »",
      "« Est-ce que tu peux juste m’écouter ce soir ? »",
    ],
    textareaPlaceholder: "Écris quelque chose à ton AmorIA…",
    sendLabel: "Envoyer",
    loading: "Chargement de ton AmorIA…",
    errorNoIA:
      "Impossible de charger ton AmorIA. Crée-en d’abord une depuis la page d’accueil.",
  },
  en: {
    backHome: "← Back to home",
    pageTitle: (name) => `Chat with ${name}`,
    subtitle: (name) =>
      `${name} is online. You can talk freely, they’ll adapt to your mood.`,
    statusOnline: "Online",
    suggestionTitle: "You can start by saying…",
    suggestions: [
      "“Today I just need to vent…”",
      "“I’d love you to motivate me for my projects.”",
      "“Can you just listen to me tonight?”",
    ],
    textareaPlaceholder: "Write something to your AmorIA…",
    sendLabel: "Send",
    loading: "Loading your AmorIA…",
    errorNoIA:
      "We couldn’t load your AmorIA. Please create one first from the home page.",
  },
  es: {
    backHome: "← Volver al inicio",
    pageTitle: (name) => `Chat con ${name}`,
    subtitle: (name) =>
      `${name} está en línea. Puedes escribirle con total libertad, se adaptará a tu estado de ánimo.`,
    statusOnline: "En línea",
    suggestionTitle: "Puedes empezar diciéndole…",
    suggestions: [
      "« Hoy solo necesito desahogarme… »",
      "« Me gustaría que me motives con mis proyectos. »",
      "« ¿Puedes simplemente escucharme esta noche? »",
    ],
    textareaPlaceholder: "Escribe algo a tu AmorIA…",
    sendLabel: "Enviar",
    loading: "Cargando tu AmorIA…",
    errorNoIA:
      "No pudimos cargar tu AmorIA. Crea una primero desde la página de inicio.",
  },
};

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export default function ChatPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [ia, setIa] = useState<AmoriaRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingIA, setLoadingIA] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Langue + iaId depuis l’URL
  const [iaId, setIaId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      setLocale(normalizeLocale(lang));
      const id = params.get("iaId");
      if (id) setIaId(id);
    } catch {
      // on garde fr
    }
  }, []);

  const t = STRINGS[locale];

  // Charger l’AmorIA depuis Supabase
  useEffect(() => {
    const loadIA = async () => {
      if (!iaId) {
        setError(t.errorNoIA);
        setLoadingIA(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_amoria")
          .select("*")
          .eq("id", iaId)
          .maybeSingle();

        if (error || !data) {
          setError(t.errorNoIA);
        } else {
          setIa(data as AmoriaRow);
        }
      } catch {
        setError(t.errorNoIA);
      } finally {
        setLoadingIA(false);
      }
    };

    if (iaId) loadIA();
  }, [iaId, t.errorNoIA]);

  const buildUrlWithLang = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `${path}?${params.toString()}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const text = input.trim();
    setInput("");

    // On affiche tout de suite le message utilisateur
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: "user", content: text },
    ]);

    // Ici tu pourras brancher ton vrai endpoint de chat plus tard.
    // Pour l’instant, on met juste une réponse simulée pour tester l’UI.
    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-ai`,
          role: "ai",
          content:
            locale === "fr"
              ? "Merci de t’être confié à moi. Dis-moi en un peu plus, je t’écoute. 💬"
              : locale === "en"
              ? "Thank you for opening up. Tell me a bit more, I’m listening. 💬"
              : "Gracias por abrirte conmigo. Cuéntame un poco más, te escucho. 💬",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (loadingIA) {
    return (
      <main className="chat-root">
        <p className="chat-loading">{t.loading}</p>
        <style jsx>{`
          .chat-root {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at top, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
          .chat-loading {
            font-size: 0.95rem;
          }
        `}</style>
      </main>
    );
  }

  if (error || !ia) {
    const homeUrl = buildUrlWithLang("/");
    return (
      <main className="chat-root">
        <div className="chat-error-card">
          <a href={homeUrl} className="chat-back">
            {t.backHome}
          </a>
          <p className="chat-error-text">{t.errorNoIA}</p>
        </div>

        <style jsx>{`
          .chat-root {
            min-height: 100vh;
            padding: 1.5rem;
            background: radial-gradient(circle at top, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
          .chat-error-card {
            max-width: 480px;
            margin: 4rem auto 0;
          }
          .chat-back {
            font-size: 0.8rem;
            color: #9ca3af;
            text-decoration: none;
          }
          .chat-error-text {
            margin-top: 1rem;
            font-size: 0.95rem;
          }
        `}</style>
      </main>
    );
  }

  const homeUrl = buildUrlWithLang("/");

  return (
    <main className="chat-root">
      <header className="chat-header">
        <a href={homeUrl} className="chat-back">
          {t.backHome}
        </a>
      </header>

      <section className="chat-shell">
        {/* HEADER IA */}
        <div className="chat-ia-header">
          <div className="chat-avatar-ring">
            {ia.avatar_image_url ? (
              <img
                src={ia.avatar_image_url}
                alt={`Avatar de ${ia.name}`}
                className="chat-avatar-img"
              />
            ) : (
              <div className="chat-avatar-placeholder">{ia.name[0] ?? "A"}</div>
            )}
          </div>

          <div className="chat-ia-text">
            <h1 className="chat-title">{t.pageTitle(ia.name)}</h1>
            <p className="chat-subtitle">{t.subtitle(ia.name)}</p>

            <div className="chat-status-row">
              <span className="chat-status-dot" />
              <span className="chat-status-label">{t.statusOnline}</span>
            </div>
          </div>
        </div>

        {/* ZONE DE MESSAGES */}
        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <p className="chat-empty-title">{t.suggestionTitle}</p>
              <div className="chat-empty-suggestions">
                {t.suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chat-suggestion-chip"
                    onClick={() => setInput(s.replace(/^[«"\s]+|[»"\s]+$/g, ""))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "chat-bubble-row chat-bubble-row--user"
                      : "chat-bubble-row chat-bubble-row--ai"
                  }
                >
                  {m.role === "ai" && (
                    <div className="chat-bubble-avatar">
                      <img
                        src={ia.avatar_image_url ?? ""}
                        alt={ia.name}
                        className="chat-bubble-avatar-img"
                      />
                    </div>
                  )}
                  <div
                    className={
                      m.role === "user"
                        ? "chat-bubble chat-bubble--user"
                        : "chat-bubble chat-bubble--ai"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INPUT */}
        <form className="chat-input-row" onSubmit={handleSubmit}>
          <textarea
            className="chat-textarea"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.textareaPlaceholder}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={sending || !input.trim()}
          >
            {t.sendLabel}
          </button>
        </form>
      </section>

      <style jsx>{`
        .chat-root {
          min-height: 100vh;
          padding: 1.25rem 1.25rem 1.75rem;
          background: radial-gradient(circle at top, #020617 0, #000 65%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .chat-header {
          width: 100%;
          max-width: 960px;
          margin-bottom: 0.75rem;
        }

        .chat-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }

        .chat-shell {
          width: 100%;
          max-width: 960px;
          border-radius: 1.6rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: radial-gradient(
            circle at top,
            rgba(15, 23, 42, 0.98) 0,
            rgba(15, 23, 42, 0.97) 35%,
            rgba(0, 0, 0, 0.98) 100%
          );
          box-shadow: 0 26px 70px rgba(15, 23, 42, 0.9);
          padding: 1.5rem 1.4rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .chat-ia-header {
          display: flex;
          gap: 1.1rem;
          align-items: center;
        }

        .chat-avatar-ring {
          width: 80px;
          height: 80px;
          border-radius: 999px;
          padding: 2px;
          background: conic-gradient(
            from 180deg,
            #fb37ff,
            #ff6b9c,
            #38bdf8,
            #fb37ff
          );
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 35px rgba(248, 113, 113, 0.5);
          flex-shrink: 0;
        }

        .chat-avatar-img {
          width: 74px;
          height: 74px;
          border-radius: 999px;
          object-fit: cover;
          object-position: 50% 20%;
          background: #020617;
        }

        .chat-avatar-placeholder {
          width: 74px;
          height: 74px;
          border-radius: 999px;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.3rem;
        }

        .chat-ia-text {
          flex: 1;
        }

        .chat-title {
          font-size: 1.25rem;
          margin: 0 0 0.15rem;
        }

        .chat-subtitle {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .chat-status-row {
          margin-top: 0.45rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.15rem 0.6rem;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.14);
        }

        .chat-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.85);
        }

        .chat-status-label {
          font-size: 0.78rem;
          color: #bbf7d0;
        }

        .chat-window {
          flex: 1;
          min-height: 320px;
          max-height: 60vh;
          border-radius: 1.2rem;
          border: 1px solid rgba(30, 64, 175, 0.6);
          background: radial-gradient(
            circle at top left,
            rgba(56, 189, 248, 0.12),
            rgba(15, 23, 42, 0.96)
          );
          padding: 0.9rem 0.85rem;
          overflow-y: auto;
        }

        .chat-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 0.65rem;
        }

        .chat-empty-title {
          font-size: 0.9rem;
          margin: 0 0 0.25rem;
          color: #cbd5f5;
        }

        .chat-empty-suggestions {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .chat-suggestion-chip {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.75);
          padding: 0.45rem 0.75rem;
          font-size: 0.82rem;
          background: rgba(15, 23, 42, 0.95);
          color: #e5e7eb;
          text-align: left;
          cursor: pointer;
        }

        .chat-suggestion-chip:hover {
          border-color: rgba(248, 113, 113, 0.9);
        }

        .chat-messages {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .chat-bubble-row {
          display: flex;
          gap: 0.5rem;
        }

        .chat-bubble-row--user {
          justify-content: flex-end;
        }

        .chat-bubble-row--ai {
          justify-content: flex-start;
        }

        .chat-bubble-avatar {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .chat-bubble-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 20%;
        }

        .chat-bubble {
          max-width: 80%;
          font-size: 0.86rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.9rem;
          line-height: 1.35;
        }

        .chat-bubble--user {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          border-bottom-right-radius: 0.2rem;
        }

        .chat-bubble--ai {
          background: rgba(15, 23, 42, 0.98);
          border: 1px solid rgba(148, 163, 184, 0.7);
          border-bottom-left-radius: 0.2rem;
        }

        .chat-input-row {
          margin-top: 1rem;
          display: flex;
          gap: 0.7rem;
          align-items: flex-end;
        }

        .chat-textarea {
          flex: 1;
          border-radius: 1.1rem;
          border: 1px solid rgba(148, 163, 184, 0.75);
          background: rgba(15, 23, 42, 0.98);
          padding: 0.6rem 0.9rem;
          font-size: 0.88rem;
          color: #e5e7eb;
          resize: none;
          outline: none;
        }

        .chat-textarea::placeholder {
          color: #6b7280;
        }

        .chat-send-btn {
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1.5rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.55);
          flex-shrink: 0;
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: default;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .chat-shell {
            padding-inline: 1.1rem;
          }
          .chat-window {
            max-height: 55vh;
          }
        }

        @media (max-width: 540px) {
          .chat-root {
            padding-inline: 0.85rem;
          }
          .chat-shell {
            padding-inline: 0.95rem;
          }
          .chat-ia-header {
            align-items: flex-start;
          }
          .chat-title {
            font-size: 1.1rem;
          }
          .chat-window {
            min-height: 260px;
          }
        }
      `}</style>
    </main>
  );
          }
