"use client";

export const dynamic = "force-dynamic";

import React, {
  useEffect,
  useState,
  useRef,
  FormEvent,
  KeyboardEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient"; // ⬅ IMPORTANT : chemin corrigé

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

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

type UiCopy = {
  backHome: string;
  pageTitle: string;
  introEmpty: (name?: string) => string;
  inputPlaceholder: string;
  sendLabel: string;
  loading: string;
  error: string;
};

const STRINGS: Record<Locale, UiCopy> = {
  fr: {
    backHome: "← Retour à l’accueil",
    pageTitle: "Chat avec ton AmorIA",
    introEmpty: (name?: string) =>
      name
        ? `Commence la conversation avec ${name} en écrivant un message ci-dessous.`
        : "Commence la conversation en écrivant un message ci-dessous.",
    inputPlaceholder: "Écris quelque chose à ton AmorIA…",
    sendLabel: "Envoyer",
    loading: "Chargement de ton AmorIA…",
    error:
      "Impossible de charger ton AmorIA. Reviens à l’accueil et crée d’abord ton compagnon.",
  },
  en: {
    backHome: "← Back to home",
    pageTitle: "Chat with your AmorIA",
    introEmpty: (name?: string) =>
      name
        ? `Start the conversation with ${name} by sending a first message.`
        : "Start the conversation by sending a first message.",
    inputPlaceholder: "Write something to your AmorIA…",
    sendLabel: "Send",
    loading: "Loading your AmorIA…",
    error:
      "We couldn’t load your AmorIA. Go back home and create your companion first.",
  },
  es: {
    backHome: "← Volver al inicio",
    pageTitle: "Chat con tu AmorIA",
    introEmpty: (name?: string) =>
      name
        ? `Empieza a hablar con ${name} enviando tu primer mensaje.`
        : "Empieza la conversación enviando tu primer mensaje.",
    inputPlaceholder: "Escribe algo a tu AmorIA…",
    sendLabel: "Enviar",
    loading: "Cargando tu AmorIA…",
    error:
      "No pudimos cargar tu AmorIA. Vuelve al inicio y crea primero tu compañero.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<Locale>("fr");

  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [loadingAI, setLoadingAI] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Langue depuis ?lang=
  useEffect(() => {
    const lang = searchParams.get("lang");
    setLocale(normalizeLocale(lang));
  }, [searchParams]);

  const t = STRINGS[locale];

  // Scroll automatique vers le bas quand une réponse arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  // Charger la dernière AmorIA de l’utilisateur
  useEffect(() => {
    const loadAI = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          setError(t.error);
          setLoadingAI(false);
          return;
        }

        const { data, error } = await supabase
          .from("user_amoria")
          .select("*")
          .eq("user_id", authData.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error || !data) {
          setError(t.error);
          setLoadingAI(false);
          return;
        }

        setAi(data as AmoriaRow);

        // Message d’accueil de l’IA (local uniquement)
        const welcome: Message = {
          id: "welcome",
          role: "assistant",
          content: `Bonjour, je suis ${data.name}. Je suis là pour t'écouter et t'accompagner. Qu’est-ce qui te ferait du bien de partager en ce moment ?`,
          createdAt: Date.now(),
        };
        setMessages([welcome]);
      } catch {
        setError(t.error);
      } finally {
        setLoadingAI(false);
      }
    };

    loadAI();
  }, [t.error]);

  const buildUrlWithLang = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `${path}?${params.toString()}`;
  };

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !ai || sending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      // À adapter à ton API réelle.
      // Ici on suppose un endpoint POST /api/chat qui prend { iaId, message, history }
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iaId: ai.id,
          message: userMsg.content,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Chat API error");
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply ?? "",
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Oups… je n’arrive pas à répondre pour le moment. Essaie de renvoyer ton message dans quelques instants.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Simule un submit du formulaire
      const fake = { preventDefault() {} } as unknown as FormEvent;
      handleSend(fake);
    }
  };

  // États de chargement / erreur
  if (loadingAI) {
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

  if (error || !ai) {
    const homeUrl = buildUrlWithLang("/");
    return (
      <main className="chat-root">
        <div className="chat-error-card">
          <a href={homeUrl} className="chat-back">
            {t.backHome}
          </a>
          <p className="chat-error-text">{t.error}</p>
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
            max-width: 520px;
            margin: 4rem auto 0;
          }
          .chat-back {
            font-size: 0.8rem;
            color: #9ca3af;
            text-decoration: none;
          }
          .chat-error-text {
            margin-top: 1.2rem;
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
        {/* Header IA avec avatar */}
        <div className="chat-ia-header">
          <div className="chat-avatar-ring">
            {ai.avatar_image_url ? (
              <img
                src={ai.avatar_image_url}
                alt={`Avatar de ${ai.name}`}
                className="chat-avatar-img"
              />
            ) : (
              <div className="chat-avatar-placeholder">{ai.name[0] ?? "A"}</div>
            )}
          </div>
          <div className="chat-ia-meta">
            <h1 className="chat-title">{t.pageTitle}</h1>
            <p className="chat-subtitle">{t.introEmpty(ai.name)}</p>
          </div>
        </div>

        {/* Zone de messages */}
        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <p>{t.introEmpty(ai.name)}</p>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "chat-bubble-row chat-bubble-row--user"
                      : "chat-bubble-row chat-bubble-row--assistant"
                  }
                >
                  <div
                    className={
                      m.role === "user"
                        ? "chat-bubble chat-bubble--user"
                        : "chat-bubble chat-bubble--assistant"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <form className="chat-input-row" onSubmit={handleSend}>
          <textarea
            className="chat-input"
            placeholder={t.inputPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
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
          padding: 1.2rem 1rem;
          background: radial-gradient(circle at top, #020617 0, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .chat-header {
          width: 100%;
          max-width: 900px;
          margin-bottom: 1.1rem;
        }

        .chat-back {
          font-size: 0.85rem;
          color: #9ca3af;
          text-decoration: none;
        }

        .chat-shell {
          width: 100%;
          max-width: 900px;
          border-radius: 1.8rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: radial-gradient(
            circle at top,
            rgba(15, 23, 42, 0.96),
            rgba(3, 7, 18, 0.98)
          );
          box-shadow: 0 26px 70px rgba(15, 23, 42, 0.95);
          padding: 1.6rem 1.5rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          backdrop-filter: blur(18px);
        }

        .chat-ia-header {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .chat-avatar-ring {
          width: 72px;
          height: 72px;
          padding: 2px;
          border-radius: 999px;
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
          box-shadow: 0 0 28px rgba(248, 113, 113, 0.55);
          flex-shrink: 0;
          overflow: hidden;
        }

        .chat-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 999px;
          object-fit: cover;
          object-position: 50% 20%;
        }

        .chat-avatar-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #020617;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .chat-ia-meta {
          flex: 1;
        }

        .chat-title {
          font-size: 1.25rem;
          margin: 0 0 0.2rem;
        }

        .chat-subtitle {
          margin: 0;
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .chat-window {
          margin-top: 0.4rem;
          border-radius: 1.4rem;
          border: 1px solid rgba(31, 41, 55, 0.95);
          background: radial-gradient(
            circle at top left,
            rgba(15, 23, 42, 0.96),
            rgba(3, 7, 18, 0.98)
          );
          padding: 0.9rem 0.9rem 0.8rem;
          min-height: 280px;
          max-height: 480px;
          display: flex;
          flex-direction: column;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .chat-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 0.9rem;
          text-align: center;
          padding: 0 1rem;
        }

        .chat-bubble-row {
          display: flex;
          width: 100%;
        }

        .chat-bubble-row--user {
          justify-content: flex-end;
        }

        .chat-bubble-row--assistant {
          justify-content: flex-start;
        }

        .chat-bubble {
          max-width: 80%;
          padding: 0.55rem 0.8rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          line-height: 1.35;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .chat-bubble--user {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
        }

        .chat-bubble--assistant {
          background: #020617;
          border: 1px solid rgba(55, 65, 81, 0.9);
          color: #e5e7eb;
        }

        .chat-input-row {
          margin-top: 0.8rem;
          display: flex;
          gap: 0.7rem;
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          border-radius: 999px;
          border: 1px solid rgba(55, 65, 81, 0.9);
          background: #020617;
          color: #e5e7eb;
          font-size: 0.9rem;
          padding: 0.65rem 1rem;
          resize: none;
          outline: none;
          min-height: 44px;
          max-height: 96px;
        }

        .chat-input::placeholder {
          color: #6b7280;
        }

        .chat-send-btn {
          border-radius: 999px;
          border: none;
          padding: 0.65rem 1.4rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.55);
          white-space: nowrap;
        }

        .chat-send-btn:disabled {
          opacity: 0.55;
          cursor: default;
          box-shadow: none;
        }

        .chat-error-card {
          max-width: 520px;
          margin: 4rem auto 0;
        }

        @media (max-width: 640px) {
          .chat-shell {
            padding: 1.4rem 1.2rem 1.1rem;
          }
          .chat-window {
            max-height: 420px;
          }
        }
      `}</style>
    </main>
  );
            }
