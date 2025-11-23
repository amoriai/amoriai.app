"use client";

import React, { useEffect, useState, FormEvent } from "react";
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
};

type Message = {
  id: string;
  from: "user" | "ai";
  text: string;
  createdAt: Date;
};

const STRINGS: Record<
  Locale,
  {
    backMyAI: string;
    loading: string;
    errorNoAI: string;
    headerIntro: (name: string) => string;
    inputPlaceholder: string;
    sendLabel: string;
    emptyState: string;
  }
> = {
  fr: {
    backMyAI: "← Retour à mon AmorIA",
    loading: "Chargement du chat...",
    errorNoAI:
      "Impossible de charger ton AmorIA. Retourne à /my-ai pour en créer ou en sélectionner une.",
    headerIntro: (name) => `Tu discutes avec ${name}.`,
    inputPlaceholder: "Écris un message pour ton AmorIA…",
    sendLabel: "Envoyer",
    emptyState:
      "Commence la conversation avec un premier message. Ton AmorIA répondra ici.",
  },
  en: {
    backMyAI: "← Back to my AmorIA",
    loading: "Loading chat...",
    errorNoAI:
      "We couldn’t load your AmorIA. Go back to /my-ai to create or select one.",
    headerIntro: (name) => `You’re chatting with ${name}.`,
    inputPlaceholder: "Write a message to your AmorIA…",
    sendLabel: "Send",
    emptyState:
      "Start the conversation with your first message. Your AmorIA will answer here.",
  },
  es: {
    backMyAI: "← Volver a mi AmorIA",
    loading: "Cargando el chat...",
    errorNoAI:
      "No pudimos cargar tu AmorIA. Vuelve a /my-ai para crear o elegir una.",
    headerIntro: (name) => `Estás chateando con ${name}.`,
    inputPlaceholder: "Escribe un mensaje para tu AmorIA…",
    sendLabel: "Enviar",
    emptyState:
      "Empieza la conversación con tu primer mensaje. Tu AmorIA responderá aquí.",
  },
};

export default function ChatPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // Lire lang + amoriaId depuis l’URL
  const [amoriaId, setAmoriaId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      const id = params.get("amoriaId");
      if (lang === "fr" || lang === "en" || lang === "es") {
        setLocale(lang);
      }
      if (id) setAmoriaId(id);
    } catch {
      // ignore
    }
  }, []);

  const t = STRINGS[locale];

  // Charger l’IA
  useEffect(() => {
    const loadAI = async () => {
      if (!amoriaId) {
        setError(t.errorNoAI);
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;

        if (!user) {
          setError(t.errorNoAI);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("user_amoria")
          .select("*")
          .eq("id", amoriaId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error || !data) {
          setError(t.errorNoAI);
          setLoading(false);
          return;
        }

        setAi(data as AmoriaRow);
      } catch {
        setError(t.errorNoAI);
      } finally {
        setLoading(false);
      }
    };

    loadAI();
  }, [amoriaId, t.errorNoAI]);

  // Gestion envoi message (DEMO – pas d’API pour l’instant)
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !ai) return;

    const text = input.trim();
    setInput("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      from: "user",
      text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const aiReplyText =
      locale === "fr"
        ? `Je suis ${ai.name}. Pour le moment, je te réponds en mode démo. Plus tard, cette réponse viendra de l’IA réelle.`
        : locale === "en"
        ? `I’m ${ai.name}. For now I’m answering in demo mode. Later this will be a real AI reply.`
        : `Soy ${ai.name}. Por ahora respondo en modo demo. Más adelante será una respuesta real de IA.`;

    const aiMsg: Message = {
      id: `ai-${Date.now() + 1}`,
      from: "ai",
      text: aiReplyText,
      createdAt: new Date(),
    };

    // petit délai pour simuler
    setTimeout(() => {
      setMessages((prev) => [...prev, aiMsg]);
    }, 400);
  };

  // URL retour vers /my-ai avec la langue
  const backParams = new URLSearchParams();
  backParams.set("lang", locale);
  const backUrl = `/my-ai?${backParams.toString()}`;

  if (loading) {
    return (
      <main className="amoria-chat-root">
        <p className="amoria-chat-loading">{t.loading}</p>
        <style jsx>{`
          .amoria-chat-root {
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
      <main className="amoria-chat-root">
        <header className="amoria-chat-header">
          <a href={backUrl} className="amoria-chat-back">
            {t.backMyAI}
          </a>
        </header>
        <p className="amoria-chat-error">{error || t.errorNoAI}</p>
        <style jsx>{`
          .amoria-chat-root {
            min-height: 100vh;
            padding: 1.5rem;
            background: radial-gradient(circle at top, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui;
          }
          .amoria-chat-header {
            margin-bottom: 1.5rem;
          }
          .amoria-chat-back {
            font-size: 0.8rem;
            color: #9ca3af;
            text-decoration: none;
          }
          .amoria-chat-back:hover {
            color: #e5e7eb;
          }
          .amoria-chat-error {
            margin-top: 3rem;
            text-align: center;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="amoria-chat-root">
      <header className="amoria-chat-header">
        <a href={backUrl} className="amoria-chat-back">
          {t.backMyAI}
        </a>
      </header>

      <section className="amoria-chat-layout">
        <aside className="amoria-chat-sidebar">
          <div className="amoria-chat-card">
            <div className="amoria-chat-avatar">
              {ai.avatar_image_url ? (
                <img
                  src={ai.avatar_image_url}
                  alt={ai.name}
                  className="amoria-chat-avatar-img"
                />
              ) : (
                <div className="amoria-chat-avatar-placeholder">
                  {ai.name[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="amoria-chat-title">{ai.name}</h1>
            <p className="amoria-chat-subtitle">
              {t.headerIntro(ai.name)}
            </p>
            <div className="amoria-chat-meta">
              <span className="amoria-chat-pill">{ai.persona_type}</span>
              <span className="amoria-chat-pill">
                {ai.main_language.toUpperCase()}
              </span>
            </div>
          </div>
        </aside>

        <section className="amoria-chat-main">
          <div className="amoria-chat-messages">
            {messages.length === 0 ? (
              <p className="amoria-chat-empty">{t.emptyState}</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    "amoria-chat-bubble " +
                    (m.from === "user"
                      ? "amoria-chat-bubble--user"
                      : "amoria-chat-bubble--ai")
                  }
                >
                  <p>{m.text}</p>
                </div>
              ))
            )}
          </div>

          <form className="amoria-chat-input-row" onSubmit={handleSend}>
            <textarea
              className="amoria-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder={t.inputPlaceholder}
            />
            <button
              type="submit"
              className="amoria-chat-send"
              disabled={!input.trim()}
            >
              {t.sendLabel}
            </button>
          </form>
        </section>
      </section>

      <style jsx>{`
        .amoria-chat-root {
          min-height: 100vh;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui;
        }
        .amoria-chat-header {
          max-width: 1120px;
          margin: 0 auto 1.2rem;
        }
        .amoria-chat-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }
        .amoria-chat-back:hover {
          color: #e5e7eb;
        }
        .amoria-chat-layout {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 2fr);
          gap: 1.5rem;
        }
        .amoria-chat-sidebar {
          display: flex;
        }
        .amoria-chat-card {
          width: 100%;
          background: #0f172a;
          border-radius: 1.2rem;
          padding: 1.3rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.9);
        }
        .amoria-chat-avatar {
          display: flex;
          justify-content: center;
          margin-bottom: 0.8rem;
        }
        .amoria-chat-avatar-img {
          width: 96px;
          height: 96px;
          border-radius: 999px;
          object-fit: cover;
        }
        .amoria-chat-avatar-placeholder {
          width: 96px;
          height: 96px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 20%, #fb37ff, #1f2937 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
        }
        .amoria-chat-title {
          text-align: center;
          font-size: 1.2rem;
          margin-bottom: 0.2rem;
        }
        .amoria-chat-subtitle {
          text-align: center;
          font-size: 0.85rem;
          color: #9ca3af;
          margin-bottom: 0.8rem;
        }
        .amoria-chat-meta {
          display: flex;
          justify-content: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .amoria-chat-pill {
          font-size: 0.75rem;
          padding: 0.1rem 0.6rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.6);
          color: #e5e7eb;
        }

        .amoria-chat-main {
          background: #020617;
          border-radius: 1.2rem;
          padding: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          display: flex;
          flex-direction: column;
          min-height: 380px;
        }
        .amoria-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .amoria-chat-empty {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #9ca3af;
        }
        .amoria-chat-bubble {
          max-width: 80%;
          padding: 0.6rem 0.8rem;
          border-radius: 0.8rem;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .amoria-chat-bubble--user {
          margin-left: auto;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          border-bottom-right-radius: 0.1rem;
        }
        .amoria-chat-bubble--ai {
          margin-right: auto;
          background: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.5);
          border-bottom-left-radius: 0.1rem;
        }

        .amoria-chat-input-row {
          display: flex;
          gap: 0.8rem;
          margin-top: 0.9rem;
        }
        .amoria-chat-input {
          flex: 1;
          border-radius: 0.85rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: #020617;
          color: #e5e7eb;
          font-size: 0.9rem;
          padding: 0.6rem 0.8rem;
          resize: none;
        }
        .amoria-chat-send {
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.45);
        }
        .amoria-chat-send:disabled {
          opacity: 0.6;
          cursor: default;
          box-shadow: none;
        }

        @media (max-width: 960px) {
          .amoria-chat-layout {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 640px) {
          .amoria-chat-root {
            padding-inline: 1rem;
          }
        }
      `}</style>
    </main>
  );
}
