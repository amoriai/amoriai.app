"use client";

import React, { useEffect, useState, FormEvent } from "react";

type Message = {
  id: string;
  from: "user" | "ai";
  text: string;
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Exemple très simple : un petit système pour ton IA
  const systemPrompt =
    "Tu es AmorIAI, une IA de compagnie chaleureuse. Réponds en français simple, avec bienveillance.";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    const newUserMsg: Message = {
      id: crypto.randomUUID(),
      from: "user",
      text: userText,
    };
    setMessages((prev) => [...prev, newUserMsg]);

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          systemPrompt,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const err = data?.error || "Erreur de communication avec AmorIA.";
        const errMsg: Message = {
          id: crypto.randomUUID(),
          from: "ai",
          text: err,
        };
        setMessages((prev) => [...prev, errMsg]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const aiText: string = data.reply ?? "Je ne sais pas.";

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        from: "ai",
        text: aiText,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        from: "ai",
        text: "Erreur réseau. Réessaie dans un instant.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="amoria-chat-root">
      <header className="amoria-chat-header">
        <a href="/" className="amoria-back">
          ← Retour à l’accueil
        </a>
        <h1 className="amoria-chat-title">Chat avec ton AmorIA</h1>
      </header>

      <section className="amoria-chat-card">
        <div className="amoria-chat-messages">
          {messages.length === 0 && (
            <p className="amoria-chat-empty">
              Commence la conversation en écrivant un message ci-dessous.
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={
                "amoria-chat-bubble " +
                (m.from === "user"
                  ? "amoria-chat-bubble-user"
                  : "amoria-chat-bubble-ai")
              }
            >
              <span className="amoria-chat-bubble-label">
                {m.from === "user" ? "Toi" : "AmorIA"}
              </span>
              <p>{m.text}</p>
            </div>
          ))}

          {loading && (
            <div className="amoria-chat-bubble amoria-chat-bubble-ai">
              <span className="amoria-chat-bubble-label">AmorIA</span>
              <p>…est en train d’écrire</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="amoria-chat-form">
          <textarea
            className="amoria-chat-input"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écris quelque chose à ton AmorIA…"
          />
          <button
            type="submit"
            className="amoria-chat-send"
            disabled={loading || !input.trim()}
          >
            Envoyer
          </button>
        </form>
      </section>

      <style jsx>{`
        .amoria-chat-root {
          min-height: 100vh;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }
        .amoria-chat-header {
          max-width: 900px;
          margin: 0 auto 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .amoria-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }
        .amoria-back:hover {
          color: #e5e7eb;
        }
        .amoria-chat-title {
          font-size: 1.4rem;
          font-weight: 600;
        }
        .amoria-chat-card {
          max-width: 900px;
          margin: 0 auto;
          background: #020617;
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          height: calc(100vh - 140px);
        }
        .amoria-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .amoria-chat-empty {
          font-size: 0.9rem;
          color: #9ca3af;
          text-align: center;
          margin-top: 2rem;
        }
        .amoria-chat-bubble {
          max-width: 80%;
          padding: 0.6rem 0.8rem;
          border-radius: 0.9rem;
          font-size: 0.9rem;
        }
        .amoria-chat-bubble-user {
          align-self: flex-end;
          background: #4f46e5;
        }
        .amoria-chat-bubble-ai {
          align-self: flex-start;
          background: #111827;
          border: 1px solid rgba(148, 163, 184, 0.6);
        }
        .amoria-chat-bubble-label {
          display: block;
          font-size: 0.7rem;
          opacity: 0.7;
          margin-bottom: 0.2rem;
        }
        .amoria-chat-form {
          border-top: 1px solid rgba(148, 163, 184, 0.4);
          padding-top: 0.6rem;
          display: flex;
          gap: 0.6rem;
        }
        .amoria-chat-input {
          flex: 1;
          border-radius: 0.7rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: #020617;
          color: #e5e7eb;
          font-size: 0.9rem;
          padding: 0.5rem 0.7rem;
          resize: none;
        }
        .amoria-chat-send {
          border-radius: 999px;
          padding: 0.5rem 1.1rem;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          font-size: 0.9rem;
          white-space: nowrap;
        }
        .amoria-chat-send:disabled {
          opacity: 0.6;
          cursor: default;
        }
      `}</style>
    </main>
  );
}
