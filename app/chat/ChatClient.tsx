"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type AiMeta = {
  id: string;
  name: string;
  avatar_image_url: string | null;
};

type UiCopy = {
  backHome: string;
  title: (name: string) => string;
  subtitle: (name: string) => string;
  emptyState: (name: string) => string;
  inputPlaceholder: (name: string) => string;
  sendLabel: string;
  sendingLabel: string;
  typingLabel: (name: string) => string;
  loading: string;
  error: string;
};

const STRINGS: Record<Locale, UiCopy> = {
  fr: {
    backHome: "← Retour à l’accueil",
    title: (name) => `Chat avec ${name}`,
    subtitle: (name) =>
      `Commence la conversation en écrivant un message ci-dessous. ${name} te répondra dans la seconde.`,
    emptyState: (name) =>
      `Aucun message pour l’instant. Dis bonjour à ${name} pour commencer 💬`,
    inputPlaceholder: (name) => `Écris quelque chose à ${name}…`,
    sendLabel: "Envoyer",
    sendingLabel: "Envoi…",
    typingLabel: (name) => `${name} est en train d’écrire`,
    loading: "Chargement de la conversation…",
    error:
      "Impossible de charger cette conversation. Vérifie le lien ou réessaie plus tard.",
  },
  en: {
    backHome: "← Back to home",
    title: (name) => `Chat with ${name}`,
    subtitle: (name) =>
      `Start the conversation by sending a message below. ${name} will reply in a second.`,
    emptyState: (name) =>
      `No messages yet. Say hi to ${name} to get started 💬`,
    inputPlaceholder: (name) => `Write something to ${name}…`,
    sendLabel: "Send",
    sendingLabel: "Sending…",
    typingLabel: (name) => `${name} is typing`,
    loading: "Loading your conversation…",
    error:
      "We couldn’t load this conversation. Please check the link or try again later.",
  },
  es: {
    backHome: "← Volver al inicio",
    title: (name) => `Chat con ${name}`,
    subtitle: (name) =>
      `Empieza la conversación escribiendo un mensaje abajo. ${name} te contestará en segundos.`,
    emptyState: (name) =>
      `Aún no hay mensajes. Saluda a ${name} para empezar 💬`,
    inputPlaceholder: (name) => `Escribe algo a ${name}…`,
    sendLabel: "Enviar",
    sendingLabel: "Enviando…",
    typingLabel: (name) => `${name} está escribiendo`,
    loading: "Cargando tu conversación…",
    error:
      "No pudimos cargar esta conversación. Verifica el enlace o inténtalo más tarde.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function formatDisplayName(name: string | null | undefined): string {
  if (!name) return "";
  const trimmed = name.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export default function ChatClient() {
  const searchParams = useSearchParams();

  const [locale, setLocale] = useState<Locale>("fr");
  const [aiMeta, setAiMeta] = useState<AiMeta | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");

  // Langue depuis ?lang=
  useEffect(() => {
    const lang = searchParams.get("lang");
    setLocale(normalizeLocale(lang));
  }, [searchParams]);

  const t = STRINGS[locale];

  // chatId = id dans public_user_amoria
  const chatId = searchParams.get("chatId");

  // Charger l'IA depuis public_user_amoria
  useEffect(() => {
    if (!chatId) {
      setError(t.error);
      setLoading(false);
      return;
    }

    const loadAi = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supaError } = await supabase
          .from("public_user_amoria")
          .select("id, name, avatar_image_url")
          .eq("id", chatId)
          .maybeSingle();

        if (supaError || !data) {
          console.error("Supabase error:", supaError);
          setError(t.error);
          return;
        }

        setAiMeta({
          id: data.id,
          name: data.name,
          avatar_image_url: data.avatar_image_url,
        });
      } catch (e) {
        console.error("Unexpected error:", e);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    loadAi();
  }, [chatId, t.error]);

  const displayName = formatDisplayName(aiMeta?.name || "ton AmorIA");

  // Envoi d’un message (pour l’instant : placeholder)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId || !aiMeta) return;

    const content = input.trim();
    setInput("");

    const optimisticUserMsg: ChatMessage = {
      id: `local-user-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setSending(true);
    setTyping(true);

    try {
      // Ici tu brancheras ton vrai backend (OpenAI, Edge Function, etc.)
      const fakeAssistantReply: ChatMessage = {
        id: `local-assistant-${Date.now()}`,
        role: "assistant",
        content:
          "☝️ Ce message est un exemple. Ensuite tu pourras le remplacer par la vraie réponse de ton backend OpenAI.",
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, fakeAssistantReply]);
    } catch (e) {
      console.error(e);
      setError("Erreur lors de l’envoi du message. Réessaie.");
    } finally {
      setSending(false);
      setTyping(false);
    }
  };

  // Loading / erreur gérés par le wrapper Suspense pour la plupart,
  // mais on garde un minimum ici pour la sécurité.
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
            background: radial-gradient(circle at top, #020617 0, #000 65%);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
          .amoria-chat-loading {
            font-size: 0.95rem;
            color: #e5e7eb;
          }
        `}</style>
      </main>
    );
  }

  if (error || !aiMeta) {
    return (
      <main className="amoria-chat-root">
        <div className="amoria-chat-error-card">
          <p className="amoria-chat-error-title">Oups…</p>
          <p className="amoria-chat-error-text">{error || t.error}</p>
        </div>
        <style jsx>{`
          .amoria-chat-root {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at top, #020617 0, #000 65%);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
            padding: 1.5rem;
          }
          .amoria-chat-error-card {
            max-width: 480px;
            border-radius: 1.5rem;
            border: 1px solid rgba(248, 113, 113, 0.6);
            background: radial-gradient(
              circle at top left,
              rgba(248, 113, 113, 0.2),
              rgba(15, 23, 42, 0.96)
            );
            padding: 1.4rem 1.6rem;
          }
          .amoria-chat-error-title {
            font-weight: 600;
            margin-bottom: 0.4rem;
          }
          .amoria-chat-error-text {
            font-size: 0.9rem;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="amoria-chat-root">
      <header className="amoria-chat-header">
        <a href="/" className="amoria-back-link">
          {t.backHome}
        </a>
      </header>

      <section className="amoria-chat-card">
        {/* Avatar + titre */}
        <div className="amoria-chat-top">
          <div className="amoria-avatar-ring">
            {aiMeta.avatar_image_url ? (
              <img
                src={aiMeta.avatar_image_url}
                alt={`Avatar de ${displayName}`}
                className="amoria-avatar-img"
              />
            ) : (
              <div className="amoria-avatar-placeholder">
                {displayName.charAt(0) || "A"}
              </div>
            )}
          </div>
          <h1 className="amoria-chat-title">
            {t.title(displayName || "ton AmorIA")}
          </h1>
          <p className="amoria-chat-subtitle">
            {t.subtitle(displayName || "ton AmorIA")}
          </p>
        </div>

        {/* Zone de messages */}
        <div className="amoria-chat-window">
          {messages.length === 0 ? (
            <p className="amoria-chat-empty">{t.emptyState(displayName)}</p>
          ) : (
            <div className="amoria-chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble chat-bubble--${msg.role} message`}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          )}

          {typing && (
            <div className="typing">
              <span className="typing-label">
                {t.typingLabel(displayName)}&nbsp;
              </span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form className="amoria-chat-input-row" onSubmit={handleSubmit}>
          <input
            className="amoria-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder(displayName)}
            disabled={sending}
          />
          <button
            type="submit"
            className="amoria-chat-send-btn"
            disabled={sending || !input.trim()}
          >
            {sending ? t.sendingLabel : t.sendLabel}
          </button>
        </form>
      </section>

      <style jsx>{`
        .amoria-chat-root {
          min-height: 100vh;
          padding: 1.5rem;
          background: linear-gradient(160deg, #020617 0%, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .amoria-chat-header {
          width: 100%;
          max-width: 980px;
          margin-bottom: 1rem;
        }

        .amoria-back-link {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }

        .amoria-chat-card {
          width: 100%;
          max-width: 980px;
          border-radius: 1.8rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: radial-gradient(
            circle at top,
            rgba(2, 6, 23, 0.95) 0,
            rgba(15, 23, 42, 0.98) 40%,
            rgba(0, 0, 0, 0.98) 100%
          );
          box-shadow: 0 26px 70px rgba(15, 23, 42, 0.95);
          padding: 1.9rem 2rem 1.6rem;
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }

        .amoria-chat-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.6rem;
        }

        @keyframes slowPulse {
          0% {
            box-shadow: 0 0 25px rgba(251, 55, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 55px rgba(56, 189, 248, 0.6);
          }
          100% {
            box-shadow: 0 0 25px rgba(251, 55, 255, 0.4);
          }
        }

        .amoria-avatar-ring {
          width: 130px;
          height: 130px;
          border-radius: 999px;
          padding: 3px;
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
          overflow: hidden;
          animation: slowPulse 4s infinite ease-in-out;
        }

        .amoria-avatar-img {
          width: 124px;
          height: 124px;
          border-radius: 999px;
          object-fit: cover;
          object-position: 50% 20%;
          background: #020617;
        }

        .amoria-avatar-placeholder {
          width: 124px;
          height: 124px;
          border-radius: 999px;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          font-weight: 600;
          color: #e5e7eb;
        }

        .amoria-chat-title {
          margin-top: 0.4rem;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .amoria-chat-subtitle {
          font-size: 0.9rem;
          color: #9ca3af;
          max-width: 520px;
        }

        .amoria-chat-window {
          border-radius: 1.4rem;
          border: 1px solid rgba(148, 163, 184, 0.55);
          background: radial-gradient(
            circle at top left,
            rgba(56, 189, 248, 0.12),
            rgba(15, 23, 42, 0.96)
          );
          padding: 1rem 1rem 0.8rem;
          min-height: 220px;
          max-height: 480px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.6rem;
        }

        .amoria-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        @keyframes messageFade {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message {
          animation: messageFade 0.25s ease-out;
        }

        .chat-bubble {
          max-width: 80%;
          padding: 0.55rem 0.75rem;
          border-radius: 0.8rem;
          font-size: 0.9rem;
          line-height: 1.35;
        }

        .chat-bubble--user {
          align-self: flex-end;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          border-bottom-right-radius: 0.2rem;
        }

        .chat-bubble--assistant {
          align-self: flex-start;
          background: rgba(15, 23, 42, 0.95);
          color: #e5e7eb;
          border-bottom-left-radius: 0.2rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
        }

        .amoria-chat-empty {
          font-size: 0.9rem;
          color: #cbd5f5;
        }

        .typing {
          margin-top: 0.4rem;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.15rem;
          color: #9ca3af;
        }

        .typing span {
          animation: blink 1.4s infinite both;
        }

        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }

        .typing-label {
          margin-right: 0.1rem;
        }

        .amoria-chat-input-row {
          display: flex;
          gap: 0.6rem;
          margin-top: 0.4rem;
        }

        .amoria-chat-input {
          flex: 1;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.96);
          padding: 0.7rem 1rem;
          font-size: 0.9rem;
          color: #e5e7eb;
          outline: none;
          transition: all 0.25s ease;
        }

        .amoria-chat-input::placeholder {
          color: #6b7280;
        }

        .amoria-chat-input:focus {
          border-color: #fb37ff;
          box-shadow: 0 0 15px rgba(251, 55, 255, 0.4);
        }

        .amoria-chat-send-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          padding: 0.7rem 1.4rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
          white-space: nowrap;
        }

        .amoria-chat-send-btn:disabled {
          opacity: 0.5;
          cursor: default;
          box-shadow: none;
        }

        @media (max-width: 820px) {
          .amoria-chat-card {
            padding-inline: 1.3rem;
          }
          .amoria-chat-window {
            max-height: 380px;
          }
        }

        @media (max-width: 540px) {
          .amoria-chat-root {
            padding-inline: 0.9rem;
          }
          .amoria-chat-card {
            padding-inline: 1rem;
          }
          .amoria-chat-title {
            font-size: 1.1rem;
          }
          .amoria-chat-subtitle {
            font-size: 0.85rem;
          }
          .amoria-chat-input-row {
            flex-direction: column;
          }
          .amoria-chat-send-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
