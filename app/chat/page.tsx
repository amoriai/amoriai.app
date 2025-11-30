"use client";

export const dynamic = "force-dynamic";

import React, {
  FormEvent,
  Suspense,
  useEffect,
  useState,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

/* ========================= TYPES ========================= */

type Locale = "fr" | "en" | "es";

type AmoriaRow = {
  id: string;
  user_id: string;
  name: string;
  avatar_image_url: string | null;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

/* ========================= TEXTES ========================= */

const STRINGS = {
  fr: {
    backHome: "← Retour",
    title: (name: string) => `Chat avec ${name}`,
    empty: (name: string) => `Dis bonjour à ${name}`,
    placeholder: (name: string) => `Écris à ${name}…`,
    send: "Envoyer",
    sending: "Envoi…",
    error: "Erreur serveur.",
  },
  en: {
    backHome: "← Back",
    title: (name: string) => `Chat with ${name}`,
    empty: (name: string) => `Say hi to ${name}`,
    placeholder: (name: string) => `Write to ${name}…`,
    send: "Send",
    sending: "Sending…",
    error: "Server error.",
  },
  es: {
    backHome: "← Volver",
    title: (name: string) => `Chat con ${name}`,
    empty: (name: string) => `Saluda a ${name}`,
    placeholder: (name: string) => `Escribe a ${name}…`,
    send: "Enviar",
    sending: "Enviando…",
    error: "Error del servidor.",
  },
};

const normalizeLocale = (raw: string | null): Locale =>
  raw === "en" || raw === "es" ? raw : "fr";

/* ========================= PAGE WRAPPER ========================= */

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ color: "white" }}>Chargement…</div>}>
      <ChatClient />
    </Suspense>
  );
}

/* ========================= CLIENT ========================= */

function ChatClient() {
  const searchParams = useSearchParams();
  const iaId = searchParams.get("iaId");
  const locale = normalizeLocale(searchParams.get("lang"));
  const t = STRINGS[locale];

  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ========================= MICRO ========================= */

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const rec = new (window as any).webkitSpeechRecognition();
    rec.lang = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US";
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let txt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        txt += e.results[i][0].transcript;
      }
      setNewMessage(txt);
    };
    recognitionRef.current = rec;
  }, [locale]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  /* ========================= VOIX IA ========================= */

  const playAssistantVoice = async (text: string) => {
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iaId, text }),
      });

      if (!res.ok) return;

      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
      audio.onended = () => URL.revokeObjectURL(audio.src);
    } catch (e) {
      console.error("Erreur audio:", e);
    }
  };

  /* ========================= CHARGEMENT IA ========================= */

  useEffect(() => {
    if (!iaId) return;
    supabase
      .from("user_amoria")
      .select("*")
      .eq("id", iaId)
      .single()
      .then(({ data }) => setAi(data));
  }, [iaId]);

  /* ========================= ENVOI MESSAGE ========================= */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !iaId) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((p) => [...p, userMsg]);
    setNewMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iaId,
          message: userMsg.content,
          lang: locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(t.error);
        return;
      }

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((p) => [...p, aiMsg]);

      // ✅ LECTURE AUDIO AUTOMATIQUE
      playAssistantVoice(aiMsg.content);
    } catch {
      setError(t.error);
    } finally {
      setSending(false);
    }
  };

  /* ========================= UI ========================= */

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white" }}>
      <header style={{ padding: 20 }}>
        <a href="/">{t.backHome}</a>
        <h2>{ai?.name}</h2>
      </header>

      <div style={{ padding: 20 }}>
        {messages.length === 0 ? (
          <p>{t.empty(ai?.name || "Amoria")}</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                textAlign: m.role === "user" ? "right" : "left",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: 10,
                  borderRadius: 12,
                  background:
                    m.role === "user" ? "#ff4dff" : "rgb(30,30,30)",
                }}
              >
                {m.content}
              </span>
            </div>
          ))
        )}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ padding: 20 }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t.placeholder(ai?.name || "Amoria")}
          style={{ width: "100%", padding: 10 }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button type="button" onClick={toggleRecording}>
            {isRecording ? "■" : "🎤"}
          </button>
          <button type="submit" disabled={sending}>
            {sending ? t.sending : t.send}
          </button>
        </div>
      </form>
    </main>
  );
}
