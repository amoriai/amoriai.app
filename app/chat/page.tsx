"use client";

export const dynamic = "force-dynamic";

import React, { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { LogoutButton } from "../components/LogoutButton";

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

  paywallTitle: string;
  paywallText: string;
  paywallCta: string;
  paywallSeePlans: string;

  promoTitle: string;
  promoText: string;
  promoCta: string;

  voicePlay: string;
  voiceLoading: string;
};

const STRINGS: Record<Locale, UiCopy> = {
  fr: {
    backHome: "← Retour à l’accueil",
    title: (name) => `Chat avec ${name}`,
    subtitle: (name) => `${name} est là pour t’écouter et t’aider à mettre des mots sur ce que tu vis.`,
    emptyState: (name) => `Aucun message pour l’instant. Dis bonjour à ${name} pour commencer 💬`,
    inputPlaceholder: (name) => `Écris quelque chose à ${name}…`,
    send: "Envoyer",
    sending: "Envoi…",
    loading: "Chargement du chat…",
    aiNotFoundTitle: "AmorIA introuvable",
    genericError: "Impossible de charger cette conversation pour le moment. Vérifie le lien ou réessaie plus tard.",
    notAuthenticated: "Nous n’avons pas pu vérifier ta session. Actualise la page ou reconnecte-toi, puis réessaie.",
    profileNotFound:
      "Aucun profil AmorIA trouvé. Crée ton profil dans « Mon AmorIA » puis reviens sur ce lien.",

    paywallTitle: "🔒 Tu as atteint la limite de ton accès gratuit.",
    paywallText:
      "Pour continuer à discuter plus librement et débloquer la voix de ton AmorIAI, passe à AmorIAI Plus.",
    paywallCta: "Débloquer AmorIAI Plus",
    paywallSeePlans: "Voir tous les forfaits →",

    promoTitle: "Plus de temps avec ton AmorIAI ?",
    promoText: "Passe à AmorIAI Plus pour beaucoup plus de messages chaque mois et la voix de ton compagnon.",
    promoCta: "Découvrir AmorIAI Plus",

    voicePlay: "Écouter",
    voiceLoading: "Voix…",
  },
  en: {
    backHome: "← Back to home",
    title: (name) => `Chat with ${name}`,
    subtitle: (name) => `${name} is here to listen and help you put words on what you’re feeling.`,
    emptyState: (name) => `No messages yet. Say hi to ${name} to get started 💬`,
    inputPlaceholder: (name) => `Write something to ${name}…`,
    send: "Send",
    sending: "Sending…",
    loading: "Loading your chat…",
    aiNotFoundTitle: "Companion not found",
    genericError: "We couldn’t load this conversation. Please check the link or try again later.",
    notAuthenticated: "We couldn’t verify your session. Please refresh the page or log in again, then try once more.",
    profileNotFound: "No AmorIA profile was found. Create your profile in “My AmorIA”, then come back to this link.",

    paywallTitle: "🔒 You’ve reached your free access limit.",
    paywallText: "To keep talking more freely and unlock your AmorIAI’s voice, switch to AmorIAI Plus.",
    paywallCta: "Unlock AmorIAI Plus",
    paywallSeePlans: "See all plans →",

    promoTitle: "Want more time with your AmorIAI?",
    promoText: "Upgrade to AmorIAI Plus for more messages every month and your companion’s voice.",
    promoCta: "Discover AmorIAI Plus",

    voicePlay: "Play",
    voiceLoading: "Voice…",
  },
  es: {
    backHome: "← Volver al inicio",
    title: (name) => `Chat con ${name}`,
    subtitle: (name) => `${name} está aquí para escucharte y ayudarte a poner en palabras lo que sientes.`,
    emptyState: (name) => `Todavía no hay mensajes. Saluda a ${name} para empezar 💬`,
    inputPlaceholder: (name) => `Escribe algo a ${name}…`,
    send: "Enviar",
    sending: "Enviando…",
    loading: "Cargando tu chat…",
    aiNotFoundTitle: "Compañero no encontrado",
    genericError: "No pudimos cargar esta conversación. Verifica el enlace o inténtalo más tarde.",
    notAuthenticated: "No pudimos verificar tu sesión. Actualiza la página o vuelve a iniciar sesión y prueba de nuevo.",
    profileNotFound:
      "No se encontró ningún perfil de AmorIA. Crea tu perfil en « Mi AmorIA » y vuelve a este enlace.",

    paywallTitle: "🔒 Has alcanzado el límite de tu acceso gratuito.",
    paywallText: "Para seguir hablando con más libertad y desbloquear la voz de tu AmorIAI, pasa a AmorIAI Plus.",
    paywallCta: "Desbloquear AmorIAI Plus",
    paywallSeePlans: "Ver todos los planes →",

    promoTitle: "¿Quieres más tiempo con tu AmorIAI?",
    promoText: "Pasa a AmorIAI Plus para muchos más mensajes cada mes y la voz de tu compañero.",
    promoCta: "Descubrir AmorIAI Plus",

    voicePlay: "Escuchar",
    voiceLoading: "Voz…",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

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
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial,
                sans-serif;
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

  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [planCode, setPlanCode] = useState<string | null>(null);
  const [canUseVoice, setCanUseVoice] = useState(false);
  const [canPulseAvatar, setCanPulseAvatar] = useState(false);
  const [canPlayAvatarVideo, setCanPlayAvatarVideo] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  const [isBlocked, setIsBlocked] = useState(false);

  // audio (évite overlap + libère URL)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const [voiceBusyMsgId, setVoiceBusyMsgId] = useState<string | null>(null);

  const isFreePlan = !planCode || planCode === "free";
  const isPaidPlan = !isFreePlan;

  const displayName = useMemo(() => (ai?.name?.trim() || "AmorIAI").trim(), [ai?.name]);
  const displayNameUpper = useMemo(() => displayName.toUpperCase(), [displayName]);

  const avatarImageUrl = ai?.avatar_image_url ?? null;
  const avatarVideoUrl = useMemo(() => {
    if (!avatarImageUrl) return null;
    if (!/\.(png|jpe?g|webp)$/i.test(avatarImageUrl)) return null;
    return avatarImageUrl.replace(/\.(png|jpe?g|webp)$/i, ".mp4");
  }, [avatarImageUrl]);

  const homeUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/?${params.toString()}`;
  }, [locale]);

  const pricingUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/pricing?${params.toString()}`;
  }, [locale]);

  const handleUpgradeClick = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", "plus");
    window.location.href = `/pricing?${params.toString()}`;
  };

  // 1) Subscription / droits
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
          setPlanCode(null);
          setCanUseVoice(false);
          setCanPulseAvatar(false);
          setCanPlayAvatarVideo(false);
          setSttSupported(false);
          return;
        }

        const { data: sub, error } = await supabase
          .from("user_subscriptions")
          .select(
            `
              pricing_plans (
                code,
                has_voice,
                voice_limit,
                allow_animated_avatar
              )
            `
          )
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        if (error || !sub) {
          setPlanCode(null);
          setCanUseVoice(false);
          setCanPulseAvatar(false);
          setCanPlayAvatarVideo(false);
          setSttSupported(false);
          return;
        }

        const rawPlans: any = (sub as any).pricing_plans;

        let code: string | null = null;
        let hasVoice = false;
        let voiceLimit = 0;
        let allowVideo = false;

        const pickPlan = (p: any) => {
          code = p?.code ?? null;
          hasVoice = !!p?.has_voice;
          voiceLimit = Number(p?.voice_limit ?? 0);
          if (typeof p?.allow_animated_avatar === "boolean") allowVideo = p.allow_animated_avatar;
          else if (p?.code === "unlimited") allowVideo = true;
        };

        if (Array.isArray(rawPlans)) pickPlan(rawPlans[0] ?? {});
        else if (rawPlans && typeof rawPlans === "object") pickPlan(rawPlans);

        setPlanCode(code);

        const paid = !!code && code !== "free";
        setCanPulseAvatar(paid);
        setCanPlayAvatarVideo(allowVideo);

        // Voice = has_voice ET voice_limit > 0
        const voiceOk = hasVoice && voiceLimit > 0;
        setCanUseVoice(voiceOk);
        if (!voiceOk) setSttSupported(false);
      } catch (err) {
        console.error("Erreur loadSubscription:", err);
        setPlanCode(null);
        setCanUseVoice(false);
        setCanPulseAvatar(false);
        setCanPlayAvatarVideo(false);
        setSttSupported(false);
      }
    };

    loadSubscription();
  }, []);

  // 2) STT support (micro)
  useEffect(() => {
    if (!canUseVoice) {
      setSttSupported(false);
      return;
    }
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSttSupported(!!SpeechRecognition);
  }, [canUseVoice]);

  const startRecording = () => {
    if (!canUseVoice || isBlocked) return;
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalText = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript + " ";
        else interim += transcript;
      }
      const merged = (newMessage ? newMessage + " " : "") + finalText + interim;
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
    if (r) r.stop();
    setIsRecording(false);
  };

  const handleToggleRecording = () => {
    if (!canUseVoice || !sttSupported || sending || isBlocked) return;
    if (isRecording) stopRecording();
    else startRecording();
  };

  // 3) Charger AI
  useEffect(() => {
    const loadAI = async () => {
      if (!iaId) {
        setAiError(t.genericError);
        setAiLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from("user_amoria").select("*").eq("id", iaId).maybeSingle();
        if (error || !data) setAiError(t.genericError);
        else setAi(data as AmoriaRow);
      } catch {
        setAiError(t.genericError);
      } finally {
        setAiLoading(false);
      }
    };

    loadAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iaId, locale]);

  // 4) Historique (paid)
  useEffect(() => {
    const loadHistory = async () => {
      if (!iaId) return;
      if (!isPaidPlan) return;

      try {
        const res = await fetch(`/api/chat/history?iaId=${encodeURIComponent(iaId)}`);
        if (!res.ok) return;
        const data = (await res.json()) as ChatMessage[];
        setMessages(
          data
            .map((m) => ({ ...m, createdAt: m.createdAt ?? new Date().toISOString() }))
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        );
      } catch {
        // silence
      }
    };

    loadHistory();
  }, [iaId, isPaidPlan]);

  // 5) Voice (bouton 🔊 par message)
  const playAssistantVoice = async (msgId: string, text: string) => {
    if (!canUseVoice || isBlocked) return;
    if (!iaId || !text?.trim()) return;

    setSendError(null);
    setVoiceBusyMsgId(msgId);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        console.error("Voice: pas de session/access_token");
        setSendError(t.notAuthenticated);
        return;
      }

      const res = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ iaId, text }),
      });

      const contentType = res.headers.get("Content-Type") || "";

      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const data = await res.json().catch(() => ({}));
          console.error("Voice API error:", res.status, data);

          if (data?.error === "audio_limit_reached") {
            setSendError("Tu as atteint la limite de messages vocaux pour ton forfait actuel.");
          } else if (data?.error) {
            setSendError(`Voice error: ${data.error}`);
          } else {
            setSendError("Erreur voice. Vérifie la configuration serveur.");
          }
        } else {
          const raw = await res.text().catch(() => "");
          console.error("Voice API error:", res.status, raw);
          setSendError("Erreur voice. Vérifie la configuration serveur.");
        }
        return;
      }

      const audioBlob = await res.blob();

      // stop + cleanup previous
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        try {
          URL.revokeObjectURL(audioUrlRef.current);
        } catch {}
        audioUrlRef.current = null;
      }

      const url = URL.createObjectURL(audioBlob);
      audioUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.volume = 1;

      audio.onended = () => {
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.error("Erreur /api/voice:", err);
      setSendError("Erreur voice. Vérifie ta connexion et réessaie.");
    } finally {
      setVoiceBusyMsgId(null);
    }
  };

  // 6) Send message
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSendError(null);

    if (!newMessage.trim() || !iaId || isBlocked) return;
    if (isRecording) stopRecording();

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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) console.error("getSession error:", sessionError);

      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        setSendError(t.notAuthenticated);
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ iaId, message: content, lang: locale }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (
        !res.ok &&
        isFreePlan &&
        (data?.error === "text_quota_reached" || data?.error === "free_limit_reached" || data?.error === "quota_exceeded")
      ) {
        setIsBlocked(true);
        setSendError(null);
        return;
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
        if (data?.message) {
          setSendError(data.message);
          return;
        }
        setSendError("Erreur serveur : " + (data?.error ?? "Impossible d’envoyer le message."));
        return;
      }

      const assistantMessage: ChatMessage = {
        id: `${baseId}-assistant`,
        role: "assistant",
        content: data?.reply ?? "",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Erreur réseau /api/chat:", err);
      setSendError("Erreur réseau. Vérifie ta connexion Internet et réessaie dans quelques secondes.");
    } finally {
      setSending(false);
    }
  };

  const avatarRingClass = canPulseAvatar ? "chat-avatar-ring live" : "chat-avatar-ring";

  return (
    <main className="chat-root">
      <header className="chat-header">
        <a href={homeUrl} className="chat-back">
          {t.backHome}
        </a>
        <LogoutButton />
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
              <div className={avatarRingClass}>
                {avatarImageUrl ? (
                  canPlayAvatarVideo && avatarVideoUrl ? (
                    <video src={avatarVideoUrl} autoPlay loop muted playsInline className="chat-avatar-img" />
                  ) : (
                    <img src={avatarImageUrl} alt={`Avatar de ${displayName}`} className="chat-avatar-img" />
                  )
                ) : (
                  <div className="chat-avatar-placeholder">{displayName.charAt(0).toUpperCase()}</div>
                )}
              </div>

              <p className="chat-ai-name">{displayNameUpper}</p>
              <p className="chat-ai-subtitle">{t.subtitle(displayName)}</p>
            </>
          )}
        </div>

        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="chat-empty">{t.emptyState(displayName)}</div>
          ) : (
            <ul className="chat-message-list">
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                const showVoiceBtn = isAssistant && canUseVoice && !isBlocked;
                const busy = voiceBusyMsgId === m.id;

                return (
                  <li
                    key={m.id}
                    className={m.role === "user" ? "chat-message chat-message--user" : "chat-message chat-message--assistant"}
                  >
                    <div className="chat-bubble">
                      <div className="chat-bubble-row">
                        <div className="chat-bubble-text">{m.content}</div>

                        {showVoiceBtn && (
                          <button
                            type="button"
                            className="chat-voice-btn"
                            onClick={() => void playAssistantVoice(m.id, m.content)}
                            disabled={busy || !m.content?.trim()}
                            aria-label="Écouter la réponse"
                            title="Écouter"
                          >
                            {busy ? t.voiceLoading : "🔊"}
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {sendError && <p className="chat-error">{sendError}</p>}

        {!isBlocked && isFreePlan && (
          <div className="chat-promo">
            <div className="chat-promo-tag">PLUS</div>
            <div className="chat-promo-texts">
              <p className="chat-promo-title">{t.promoTitle}</p>
              <p className="chat-promo-text">{t.promoText}</p>
            </div>
            <button type="button" className="chat-promo-btn" onClick={handleUpgradeClick}>
              {t.promoCta}
            </button>
          </div>
        )}

        {isBlocked && isFreePlan && (
          <div className="chat-paywall">
            <div className="chat-paywall-chip">PLUS</div>
            <p className="chat-paywall-title">{t.paywallTitle}</p>
            <p className="chat-paywall-text">{t.paywallText}</p>
            <button type="button" className="chat-paywall-btn" onClick={handleUpgradeClick}>
              <span className="chat-paywall-btn-label">{t.paywallCta}</span>
              <span className="chat-paywall-btn-icon">➜</span>
            </button>
            <a href={pricingUrl} className="chat-paywall-link">
              {t.paywallSeePlans}
            </a>
          </div>
        )}

        <form className="chat-input-bar" onSubmit={handleSubmit}>
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              placeholder={t.inputPlaceholder(displayName)}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={1}
              disabled={isBlocked && isFreePlan}
            />
          </div>

          <div className="chat-actions">
            {canUseVoice && !isBlocked && (
              <button
                type="button"
                className={`chat-mic-btn ${isRecording ? "chat-mic-btn--active" : ""}`}
                onClick={handleToggleRecording}
                disabled={!sttSupported || sending}
                aria-label="Dicter mon message"
              >
                <span className="chat-mic-icon">{isRecording ? "■" : "🎤"}</span>
              </button>
            )}

            <button type="submit" className="chat-send-btn" disabled={sending || !newMessage.trim() || (isBlocked && isFreePlan)}>
              <span className="chat-send-icon">➤</span>
            </button>
          </div>
        </form>

        <p className="chat-privacy-note">Tes messages sont privés et ne sont jamais visibles par les autres utilisateurs.</p>
      </section>

      <style jsx>{`
        /* === TON CSS + petit ajout pour bouton voice === */
        .chat-root {
          min-height: 100vh;
          padding: 1.4rem 1rem 1.7rem;
          background: radial-gradient(circle at top, #020617 0, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .chat-header {
          width: 100%;
          max-width: 900px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
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
          background: radial-gradient(circle at top, rgba(2, 6, 23, 0.96) 0, rgba(15, 23, 42, 0.98) 45%, rgba(0, 0, 0, 0.98) 100%);
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
          background: conic-gradient(from 180deg, #fb37ff, #ff6b9c, #38bdf8, #fb37ff);
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
          background: radial-gradient(circle at top, rgba(15, 23, 42, 0.97), rgba(15, 23, 42, 0.99));
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

        .chat-bubble-row {
          display: flex;
          gap: 0.6rem;
          align-items: flex-start;
        }
        .chat-bubble-text {
          flex: 1;
          min-width: 0;
        }
        .chat-voice-btn {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: rgba(2, 6, 23, 0.7);
          color: #e5e7eb;
          padding: 0.25rem 0.55rem;
          cursor: pointer;
          font-size: 0.85rem;
          line-height: 1;
          white-space: nowrap;
        }
        .chat-voice-btn:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .chat-error {
          font-size: 0.8rem;
          color: #fecaca;
          text-align: center;
        }

        .chat-promo {
          margin-top: 0.5rem;
          margin-bottom: 0.1rem;
          border-radius: 999px;
          padding: 0.55rem 0.9rem;
          background: radial-gradient(circle at left, rgba(251, 55, 255, 0.25), rgba(15, 23, 42, 0.98));
          border: 1px solid rgba(251, 113, 133, 0.7);
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }
        .chat-promo-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
          border: 1px solid rgba(248, 250, 252, 0.4);
          background: rgba(15, 23, 42, 0.9);
        }
        .chat-promo-texts {
          flex: 1;
          min-width: 0;
        }
        .chat-promo-title {
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
        }
        .chat-promo-text {
          font-size: 0.75rem;
          color: #e5e7eb;
        }
        .chat-promo-btn {
          border-radius: 999px;
          border: none;
          padding: 0.38rem 0.9rem;
          font-size: 0.78rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          white-space: nowrap;
        }

        .chat-paywall {
          margin-top: 0.6rem;
          margin-bottom: 0.4rem;
          border-radius: 1.25rem;
          padding: 1rem 1.1rem 0.9rem;
          background: radial-gradient(circle at top left, rgba(251, 55, 255, 0.25), rgba(15, 23, 42, 0.98));
          border: 1px solid rgba(251, 113, 133, 0.7);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
        }
        .chat-paywall::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 120% 0%, rgba(248, 250, 252, 0.25), transparent 60%);
          opacity: 0.6;
          pointer-events: none;
        }
        .chat-paywall-chip {
          position: relative;
          z-index: 1;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          padding: 0.18rem 0.6rem;
          border-radius: 999px;
          border: 1px solid rgba(248, 250, 252, 0.4);
          background: rgba(15, 23, 42, 0.82);
        }
        .chat-paywall-title {
          position: relative;
          z-index: 1;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .chat-paywall-text {
          position: relative;
          z-index: 1;
          font-size: 0.8rem;
          color: #e5e7eb;
          max-width: 420px;
        }
        .chat-paywall-btn {
          position: relative;
          z-index: 1;
          margin-top: 0.2rem;
          border-radius: 999px;
          border: none;
          padding: 0.55rem 1.5rem;
          font-size: 0.85rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 14px 36px rgba(248, 113, 113, 0.7);
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-weight: 600;
        }
        .chat-paywall-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 48px rgba(248, 113, 113, 0.9);
        }
        .chat-paywall-btn:active {
          transform: translateY(0);
          box-shadow: 0 10px 26px rgba(248, 113, 113, 0.6);
        }
        .chat-paywall-btn-label {
          white-space: nowrap;
        }
        .chat-paywall-btn-icon {
          font-size: 0.9rem;
          transform: translateY(0.5px);
        }
        .chat-paywall-link {
          position: relative;
          z-index: 1;
          margin-top: 0.1rem;
          font-size: 0.76rem;
          color: #f9fafb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .chat-input-bar {
          margin-top: 0.4rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.55rem;
          align-items: flex-end;
        }
        .chat-input-wrapper {
          border-radius: 999px;
          padding: 0.1rem 0.75rem;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.7);
          display: flex;
          align-items: center;
        }
        .chat-input {
          width: 100%;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: #e5e7eb;
          font-size: 0.9rem;
          padding: 0.4rem 0;
          resize: none;
          outline: none;
        }
        .chat-input::placeholder {
          color: #6b7280;
        }
        .chat-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .chat-actions {
          display: flex;
          flex-direction: row;
          gap: 0.35rem;
          align-items: center;
        }
        .chat-mic-btn {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.96);
          color: #e5e7eb;
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.05rem;
        }
        .chat-mic-btn--active {
          border-color: #fb37ff;
          box-shadow: 0 0 18px rgba(251, 55, 255, 0.8);
          background: radial-gradient(circle at top, #1e293b, #020617);
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
          width: 44px;
          height: 44px;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.75);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .chat-send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 20px 52px rgba(248, 113, 113, 0.9);
        }
        .chat-send-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 10px 26px rgba(248, 113, 113, 0.6);
        }
        .chat-send-btn:disabled {
          opacity: 0.4;
          cursor: default;
          box-shadow: none;
        }
        .chat-send-icon {
          font-size: 1rem;
          transform: translateX(1px);
        }

        .chat-privacy-note {
          margin-top: 0.3rem;
          font-size: 0.78rem;
          color: #6b7280;
          text-align: right;
        }

        .skeleton {
          background: linear-gradient(90deg, rgba(148, 163, 184, 0.2), rgba(148, 163, 184, 0.4), rgba(148, 163, 184, 0.2));
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .skeleton-text {
          height: 0.9rem;
          width: 60%;
          background: linear-gradient(90deg, rgba(148, 163, 184, 0.2), rgba(148, 163, 184, 0.4), rgba(148, 163, 184, 0.2));
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
          .chat-privacy-note {
            text-align: center;
          }
          .chat-promo {
            border-radius: 1.25rem;
            padding: 0.85rem 0.9rem;
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-areas: "tag texts" "btn btn";
            gap: 0.75rem;
            align-items: start;
          }
          .chat-promo-tag {
            grid-area: tag;
            align-self: start;
          }
          .chat-promo-texts {
            grid-area: texts;
          }
          .chat-promo-title {
            font-size: 0.88rem;
            line-height: 1.2;
          }
          .chat-promo-text {
            font-size: 0.8rem;
            line-height: 1.35;
          }
          .chat-promo-btn {
            grid-area: btn;
            width: 100%;
            padding: 0.6rem 0.9rem;
            font-size: 0.9rem;
            white-space: normal;
          }

          .chat-paywall {
            border-radius: 1.3rem;
            padding: 1rem 0.95rem 0.95rem;
            gap: 0.55rem;
          }
          .chat-paywall-text {
            max-width: none;
            font-size: 0.84rem;
            line-height: 1.35;
          }
          .chat-paywall-btn {
            width: 100%;
            justify-content: center;
            padding: 0.65rem 1rem;
            font-size: 0.92rem;
          }
          .chat-paywall-link {
            width: 100%;
            text-align: center;
            margin-top: 0.2rem;
          }
        }
      `}</style>
    </main>
  );
          }
