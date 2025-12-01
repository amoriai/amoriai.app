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

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

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

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type UiCopy = {
  backHome: string;
  title: (name: string) => string;
  subtitle: (name: string) => string;
  emptyState: (name: string) => string;
  inputPlaceholder: (name: string) => string;
  send: string;
  sending: string;
  loading: string;
  aiNotFoundTitle: string;
  genericError: string;
  notAuthenticated: string;
  profileNotFound: string;
};

const STRINGS: Record<Locale, UiCopy> = {
  fr: {
    backHome: "← Retour à l’accueil",
    title: (name) => `Chat avec ${name}`,
    subtitle: (name) =>
      `${name} est là pour t’écouter et t’aider à mettre des mots sur ce que tu vis.`,
    emptyState: (name) =>
      `Aucun message pour l’instant. Dis bonjour à ${name} pour commencer 💬`,
    inputPlaceholder: (name) => `Écris quelque chose à ${name}…`,
    send: "Envoyer",
    sending: "Envoi…",
    loading: "Chargement de ta conversation…",
    aiNotFoundTitle: "AmorIA introuvable",
    genericError:
      "Impossible de charger cette conversation pour le moment. Vérifie le lien ou réessaie plus tard.",
    notAuthenticated:
      "Tu dois être connectée à ton compte AmorIA pour discuter avec ton IA.",
    profileNotFound:
      "Profil AmorIA introuvable. Connecte-toi, puis crée ton profil dans « Mon AmorIA ».",
  },
  en: {
    backHome: "← Back to home",
    title: (name) => `Chat with ${name}`,
    subtitle: (name) =>
      `${name} is here to listen and help you put words on what you’re feeling.`,
    emptyState: (name) =>
      `No messages yet. Say hi to ${name} to get started 💬`,
    inputPlaceholder: (name) => `Write something to ${name}…`,
    send: "Send",
    sending: "Sending…",
    loading: "Loading your conversation…",
    aiNotFoundTitle: "Companion not found",
    genericError:
      "We couldn’t load this conversation. Please check the link or try again later.",
    notAuthenticated:
      "You must be logged in to your AmorIA account to chat with your AI.",
    profileNotFound:
      "AmorIA profile not found. Please log in and create your profile in “My AmorIA”.",
  },
  es: {
    backHome: "← Volver al inicio",
    title: (name) => `Chat con ${name}`,
    subtitle: (name) =>
      `${name} está aquí para escucharte y ayudarte a poner en palabras lo que sientes.`,
    emptyState: (name) =>
      `Todavía no hay mensajes. Saluda a ${name} para empezar 💬`,
    inputPlaceholder: (name) => `Escribe algo a ${name}…`,
    send: "Enviar",
    sending: "Enviando…",
    loading: "Cargando tu conversación…",
    aiNotFoundTitle: "Compañero no encontrado",
    genericError:
      "No pudimos cargar esta conversación. Verifica el enlace o inténtalo más tarde.",
    notAuthenticated:
      "Debes iniciar sesión en tu cuenta de AmorIA para chatear con tu IA.",
    profileNotFound:
      "Perfil de AmorIA no encontrado. Inicia sesión y crea tu perfil en « Mi AmorIA ».",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

/**
 * Wrapper exigé par Next.js : useSearchParams doit être
 * utilisé dans un composant rendu à l’intérieur d’un <Suspense>.
 */
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="chat-root">
          <p className="chat-loading">Chargement du chat…</p>
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
      }
    >
      <ChatClient />
    </Suspense>
  );
}

function ChatClient() {
  const searchParams = useSearchParams();
  const iaId = searchParams.get("iaId");
  const locale = normalizeLocale(searchParams.get("lang"));
  const t = STRINGS[locale];

  // Plan passé dans l'URL (utile pour tes tests, fallback si pas d'abonnement en base)
  const rawPlan = searchParams.get("plan");

  const [planId, setPlanId] = useState<PlanId>("free");
  const [canUseVoice, setCanUseVoice] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);

  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Micro / dictée
  const [isRecording, setIsRecording] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  // 🔐 Charger le plan depuis Supabase (user_subscriptions + pricing_plans.has_voice)
  useEffect(() => {
    const loadPlan = async () => {
      try {
        // 1) Récupère l'utilisateur connecté
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError || !authData?.user) {
          // Pas connecté → fallback sur l'URL (?plan=...) ou free par défaut
          if (
            rawPlan === "chat" ||
            rawPlan === "plus" ||
            rawPlan === "unlimited" ||
            rawPlan === "free"
          ) {
            const p = rawPlan as PlanId;
            setPlanId(p);
            setCanUseVoice(p === "plus" || p === "unlimited");
          } else {
            setPlanId("free");
            setCanUseVoice(false);
          }
          return;
        }

        const user = authData.user;

        // 2) Abonnement en base
        const { data: sub, error: subError } = await supabase
          .from("user_subscriptions")
          .select("pricing_plans(has_voice)")
          .eq("user_id", user.id)
          .maybeSingle();

        if (subError || !sub) {
          // Aucun abonnement trouvé → fallback URL ou free
          if (
            rawPlan === "chat" ||
            rawPlan === "plus" ||
            rawPlan === "unlimited" ||
            rawPlan === "free"
          ) {
            const p = rawPlan as PlanId;
            setPlanId(p);
            setCanUseVoice(p === "plus" || p === "unlimited");
          } else {
            setPlanId("free");
            setCanUseVoice(false);
          }
        } else {
          const hasVoice = sub?.pricing_plans?.has_voice === true;
          setCanUseVoice(hasVoice);

          // Optionnel si tu veux un jour afficher le nom du plan :
          // setPlanId(hasVoice ? "plus" ou "unlimited" : "free/chat");
          // Pour l'instant, on ne l'utilise pas plus loin.
        }
      } finally {
        setPlanLoading(false);
      }
    };

    void loadPlan();
    // rawPlan en dépend, comme ça si tu changes ?plan= pour tester, ça se met à jour
  }, [rawPlan]);

  // Détection support STT (seulement si plan avec voix)
  useEffect(() => {
    if (!canUseVoice) {
      setSttSupported(false);
      return;
    }
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setSttSupported(!!SpeechRecognition);
  }, [canUseVoice]);

  const startRecording = () => {
    if (!canUseVoice) return;
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang =
      locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalText = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      const merged =
        (newMessage ? newMessage + " " : "") + finalText + interim;
      setNewMessage(merged.trimStart());
    };

    recognition.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    setIsRecording(true);
    recognition.start();
  };

  const stopRecording = () => {
    const r = recognitionRef.current;
    if (r) {
      r.stop();
    }
    setIsRecording(false);
  };

  const handleToggleRecording = () => {
    if (!canUseVoice || !sttSupported || sending) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Lecture de la voix de l’IA via /api/voice (plus/unlimited seulement)
  const playAssistantVoice = async (text: string) => {
    if (!canUseVoice) return;
    if (!iaId || !text.trim()) return;

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ iaId, text }),
      });

      const contentType = res.headers.get("Content-Type") || "";

      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const data = await res.json();
          console.error("Voice API error:", data);
          if (data?.error === "audio_limit_reached") {
            setSendError(
              "Tu as atteint la limite de messages vocaux pour ton forfait actuel."
            );
          }
        } else {
          console.error("Voice API HTTP error:", res.status);
        }
        return;
      }

      if (contentType.startsWith("audio/")) {
        const arrayBuffer = await res.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: contentType });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio
          .play()
          .catch((err) => console.error("Erreur de lecture audio:", err));
        audio.onended = () => URL.revokeObjectURL(url);
      } else if (contentType.includes("application/json")) {
        const data = await res.json();
        console.log("Voice API JSON:", data);
      }
    } catch (err) {
      console.error("Erreur /api/voice:", err);
    }
  };

  // Charger les infos de l’AmorIA
  useEffect(() => {
    const loadAI = async () => {
      if (!iaId) {
        setAiError(t.genericError);
        setAiLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_amoria")
          .select("*")
          .eq("id", iaId)
          .maybeSingle();

        if (error || !data) {
          setAiError(t.genericError);
        } else {
          setAi(data as AmoriaRow);
        }
      } catch {
        setAiError(t.genericError);
      } finally {
        setAiLoading(false);
      }
    };

    void loadAI();
  }, [iaId, t.genericError]);

  // Charger l’historique (optionnel, ignore 404)
  useEffect(() => {
    const loadHistory = async () => {
      if (!iaId) return;

      try {
        const res = await fetch(
          `/api/chat/history?iaId=${encodeURIComponent(iaId)}`
        );
        if (!res.ok) return;

        const data = (await res.json()) as ChatMessage[];
        setMessages(
          data
            .map((m) => ({
              ...m,
              createdAt: m.createdAt ?? new Date().toISOString(),
            }))
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        );
      } catch {
        // silencieux
      }
    };

    void loadHistory();
  }, [iaId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSendError(null);

    if (!newMessage.trim() || !iaId) return;

    if (isRecording) {
      stopRecording();
    }

    const content = newMessage.trim();
    const baseId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const userMessage: ChatMessage = {
      id: `${baseId}-user`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ iaId, message: content, lang: locale }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // pas de JSON
      }

      if (!res.ok) {
        console.error("ERREUR API /api/chat:", res.status, data);
        if (data?.error === "not_authenticated") {
          setSendError(t.notAuthenticated);
          return;
        }
        if (data?.error === "profile_not_found") {
          setSendError(t.profileNotFound);
          return;
        }
        setSendError(
          "Erreur serveur : " +
            (data?.error ?? "Impossible d’envoyer le message.")
        );
        return;
      }

      const assistantMessage: ChatMessage = {
        id: `${baseId}-assistant`,
        role: "assistant",
        content: data?.reply ?? "",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (assistantMessage.content) {
        void playAssistantVoice(assistantMessage.content);
      }
    } catch (err) {
      console.error("Erreur réseau /api/chat:", err);
      setSendError(
        "Erreur réseau. Vérifie ta connexion Internet et réessaie dans quelques secondes."
      );
    } finally {
      setSending(false);
    }
  };

  const homeUrl = (() => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/?${params.toString()}`;
  })();

  const displayName = (() => {
    const raw = ai?.name?.trim() || "AmorIA";
    return raw;
  })();

  const displayNameUpper = displayName.toUpperCase();

  return (
    <main className="chat-root">
      <header className="chat-header">
        <a href={homeUrl} className="chat-back">
          {t.backHome}
        </a>
      </header>

      <section className="chat-card">
        <div className="chat-ai-header">
          {aiLoading ? (
            <>
              <div className="chat-avatar-ring skeleton" />
              <p className="chat-ai-name skeleton-text" />
              <p className="chat-ai-subtitle skeleton-text" />
            </>
          ) : aiError || !ai ? (
            <>
              <div className="chat-avatar-ring error">
                <span className="chat-avatar-error">!</span>
              </div>
              <p className="chat-ai-name">{t.aiNotFoundTitle}</p>
              <p className="chat-ai-subtitle">{aiError}</p>
            </>
          ) : (
            <>
              <div className="chat-avatar-ring live">
                {ai.avatar_image_url ? (
                  <img
                    src={ai.avatar_image_url}
                    alt={`Avatar de ${displayName}`}
                    className="chat-avatar-img"
                  />
                ) : (
                  <div className="chat-avatar-placeholder">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <p className="chat-ai-name">{displayNameUpper}</p>
              <p className="chat-ai-subtitle">
                {t.title(displayName)} · {t.subtitle(displayName)}
              </p>
            </>
          )}
        </div>

        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="chat-empty">{t.emptyState(displayName)}</div>
          ) : (
            <ul className="chat-message-list">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "chat-message chat-message--user"
                      : "chat-message chat-message--assistant"
                  }
                >
                  <div className="chat-bubble">{m.content}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {sendError && <p className="chat-error">{sendError}</p>}

        <form className="chat-input-bar" onSubmit={handleSubmit}>
          <textarea
            className="chat-input"
            placeholder={t.inputPlaceholder(displayName)}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={2}
          />
          <div className="chat-actions">
            {/* Mic visible uniquement si plan avec voix */}
            {canUseVoice && (
              <button
                type="button"
                className={`chat-mic-btn ${
                  isRecording ? "chat-mic-btn--active" : ""
                }`}
                onClick={handleToggleRecording}
                disabled={!sttSupported || sending || planLoading}
                aria-label="Dicter mon message"
              >
                <span className="chat-mic-icon">
                  {isRecording ? "■" : "🎤"}
                </span>
              </button>
            )}

            <button
              type="submit"
              className="chat-send-btn"
              disabled={sending || !newMessage.trim()}
            >
              <span className="chat-send-label">
                {sending ? t.sending : t.send}
              </span>
              <span className="chat-send-icon">➤</span>
            </button>
          </div>
        </form>

        <p className="chat-privacy-note">
          Tes messages sont privés et ne sont jamais visibles par les autres
          utilisateurs.
        </p>
      </section>

      <style jsx>{`
        .chat-root {
          min-height: 100vh;
          padding: 1.4rem 1rem 1.7rem;
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
          margin-bottom: 1rem;
        }
        .chat-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }
        .chat-back:hover {
          color: #e5e7eb;
        }
        .chat-card {
          width: 100%;
          max-width: 900px;
          border-radius: 1.6rem;
          border: 1px solid rgba(148, 163, 184, 0.42);
          background: radial-gradient(
            circle at top,
            rgba(2, 6, 23, 0.96) 0,
            rgba(15, 23, 42, 0.98) 45%,
            rgba(0, 0, 0, 0.98) 100%
          );
          box-shadow: 0 26px 70px rgba(15, 23, 42, 0.95);
          padding: 1.6rem 1.6rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .chat-ai-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.35rem;
        }
        @keyframes slowPulse {
          0% {
            box-shadow: 0 0 26px rgba(251, 55, 255, 0.35);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 52px rgba(56, 189, 248, 0.55);
            transform: scale(1.02);
          }
          100% {
            box-shadow: 0 0 26px rgba(251, 55, 255, 0.35);
            transform: scale(1);
          }
        }
        .chat-avatar-ring {
          width: 160px;
          height: 160px;
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
        }
        .chat-avatar-ring.live {
          animation: slowPulse 4s ease-in-out infinite;
        }
        .chat-avatar-img {
          width: 154px;
          height: 154px;
          border-radius: 999px;
          object-fit: cover;
          object-position: 50% 20%;
          background: #020617;
        }
        .chat-avatar-placeholder {
          width: 154px;
          height: 154px;
          border-radius: 999px;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 600;
          color: #e5e7eb;
        }
        .chat-ai-name {
          margin-top: 0.35rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.9rem;
        }
        .chat-ai-subtitle {
          font-size: 0.84rem;
          color: #9ca3af;
          max-width: 560px;
        }
        .chat-window {
          margin-top: 0.4rem;
          border-radius: 1rem;
          border: 1px solid rgba(30, 64, 175, 0.56);
          background: radial-gradient(
            circle at top,
            rgba(15, 23, 42, 0.97),
            rgba(15, 23, 42, 0.99)
          );
          height: 360px;
          max-height: 55vh;
          padding: 0.7rem;
          overflow-y: auto;
        }
        .chat-empty {
          font-size: 0.9rem;
          color: #9ca3af;
          text-align: center;
          padding-top: 2.1rem;
        }
        .chat-message-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .chat-message {
          display: flex;
        }
        .chat-message--user {
          justify-content: flex-end;
        }
        .chat-message--assistant {
          justify-content: flex-start;
        }
        .chat-bubble {
          max-width: 78%;
          padding: 0.55rem 0.85rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          line-height: 1.4;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .chat-message--user .chat-bubble {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          border-bottom-right-radius: 0.24rem;
        }
        .chat-message--assistant .chat-bubble {
          background: rgba(15, 23, 42, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.55);
          color: #e5e7eb;
          border-bottom-left-radius: 0.24rem;
        }
        .chat-error {
          font-size: 0.8rem;
          color: #fecaca;
          text-align: center;
        }
        .chat-input-bar {
          margin-top: 0.3rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.6rem;
          align-items: flex-end;
        }
        .chat-input {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.96);
          color: #e5e7eb;
          font-size: 0.9rem;
          padding: 0.55rem 0.8rem;
          resize: none;
          outline: none;
        }
        .chat-input::placeholder {
          color: #6b7280;
        }
        .chat-actions {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          align-items: stretch;
        }
        .chat-mic-btn {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.96);
          color: #e5e7eb;
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.1rem;
        }
        .chat-mic-btn--active {
          border-color: #fb37ff;
          box-shadow: 0 0 18px rgba(251, 55, 255, 0.6);
        }
        .chat-mic-btn:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .chat-mic-icon {
          transform: translateY(1px);
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
          min-width: 120px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
        }
        .chat-send-icon {
          font-size: 0.9rem;
          transform: translateY(0.5px);
        }
        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: default;
          box-shadow: none;
        }
        .chat-privacy-note {
          margin-top: 0.2rem;
          font-size: 0.78rem;
          color: #6b7280;
          text-align: right;
        }
        .skeleton {
          background: linear-gradient(
            90deg,
            rgba(148, 163, 184, 0.2),
            rgba(148, 163, 184, 0.4),
            rgba(148, 163, 184, 0.2)
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .skeleton-text {
          height: 0.9rem;
          width: 60%;
          background: linear-gradient(
            90deg,
            rgba(148, 163, 184, 0.2),
            rgba(148, 163, 184, 0.4),
            rgba(148, 163, 184, 0.2)
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 999px;
        }
        .chat-avatar-ring.error {
          background: radial-gradient(circle at center, #b91c1c, #7f1d1d);
          box-shadow: 0 0 35px rgba(248, 113, 113, 0.7);
        }
        .chat-avatar-error {
          font-size: 2.1rem;
          font-weight: 700;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @media (max-width: 768px) {
          .chat-card {
            padding-inline: 1.2rem;
          }
          .chat-window {
            height: 320px;
          }
          .chat-avatar-ring {
            width: 150px;
            height: 150px;
          }
          .chat-avatar-img,
          .chat-avatar-placeholder {
            width: 144px;
            height: 144px;
          }
        }
        @media (max-width: 480px) {
          .chat-root {
            padding-inline: 0.7rem;
          }
          .chat-input-bar {
            grid-template-columns: 1fr;
          }
          .chat-actions {
            flex-direction: row;
          }
          .chat-send-btn {
            flex: 1;
          }
          .chat-privacy-note {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
