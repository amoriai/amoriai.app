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

  voiceUnlock: string;
  voiceOn: string;
  voiceOff: string;

  sttStart: string;
  sttStop: string;
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
    profileNotFound: "Aucun profil AmorIA trouvé. Crée ton profil dans « Mon AmorIA » puis reviens sur ce lien.",

    paywallTitle: "🔒 Tu as atteint la limite de ton accès gratuit.",
    paywallText: "Pour continuer à discuter plus librement et débloquer la voix de ton AmorIAI, passe à AmorIAI Plus.",
    paywallCta: "Débloquer AmorIAI Plus",
    paywallSeePlans: "Voir tous les forfaits →",

    promoTitle: "Plus de temps avec ton AmorIAI ?",
    promoText: "Passe à AmorIAI Plus pour beaucoup plus de messages chaque mois et la voix de ton compagnon.",
    promoCta: "Découvrir AmorIAI Plus",

    voicePlay: "Écouter",
    voiceLoading: "Voix…",

    voiceUnlock: "🔓 Activer la voix",
    voiceOn: "🔊 Voix : ON",
    voiceOff: "🔇 Voix : OFF",

    sttStart: "Dicter",
    sttStop: "Stop",
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

    voiceUnlock: "🔓 Enable voice",
    voiceOn: "🔊 Voice: ON",
    voiceOff: "🔇 Voice: OFF",

    sttStart: "Dictate",
    sttStop: "Stop",
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
    profileNotFound: "No se encontró ningún perfil de AmorIA. Crea tu perfil en « Mi AmorIA » y vuelve a este enlace.",

    paywallTitle: "🔒 Has alcanzado el límite de tu acceso gratuito.",
    paywallText: "Para seguir hablando con más libertad y desbloquear la voz de tu AmorIAI, pasa a AmorIAI Plus.",
    paywallCta: "Desbloquear AmorIAI Plus",
    paywallSeePlans: "Ver todos los planes →",

    promoTitle: "¿Quieres más tiempo con tu AmorIAI?",
    promoText: "Pasa a AmorIAI Plus para muchos más mensajes cada mes y la voz de tu compañero.",
    promoCta: "Descubrir AmorIAI Plus",

    voicePlay: "Escuchar",
    voiceLoading: "Voz…",

    voiceUnlock: "🔓 Activar voz",
    voiceOn: "🔊 Voz: ON",
    voiceOff: "🔇 Voz: OFF",

    sttStart: "Dictar",
    sttStop: "Stop",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

/**
 * Loop MP4 PRO : double <video> + crossfade juste avant la fin.
 * Résultat : pas de "coupure" visible, même si ton mp4 a une frame de retour.
 */
function LoopCrossfadeVideo({
  src,
  className,
  fadeMs = 180,
  preRollMs = 220,
}: {
  src: string;
  className?: string;
  fadeMs?: number;
  preRollMs?: number;
}) {
  const aRef = useRef<HTMLVideoElement | null>(null);
  const bRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [top, setTop] = useState<"a" | "b">("a");
  const switchingRef = useRef(false);
  const topRef = useRef<"a" | "b">("a");

  useEffect(() => {
    topRef.current = top;
  }, [top]);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    const stopAll = () => {
      try {
        a.pause();
        b.pause();
      } catch {}
      switchingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const tick = () => {
      const currentTop = topRef.current;
      const topVid = currentTop === "a" ? a : b;
      const backVid = currentTop === "a" ? b : a;

      const dur = topVid.duration;
      if (!Number.isFinite(dur) || dur <= 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const timeLeft = dur - topVid.currentTime;
      const trigger = preRollMs / 1000;

      if (!switchingRef.current && timeLeft <= trigger) {
        switchingRef.current = true;

        try {
          backVid.currentTime = 0;
        } catch {}
        backVid.play().catch(() => {});

        const startAt = performance.now();

        const step = (now: number) => {
          const p = Math.min(1, (now - startAt) / fadeMs);

          topVid.style.opacity = String(1 - p);
          backVid.style.opacity = String(p);

          if (p < 1) {
            requestAnimationFrame(step);
            return;
          }

          try {
            topVid.pause();
          } catch {}
          try {
            topVid.currentTime = 0;
          } catch {}

          setTop((prev) => (prev === "a" ? "b" : "a"));
          switchingRef.current = false;
        };

        requestAnimationFrame(step);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const prime = async () => {
      stopAll();

      a.style.opacity = "1";
      b.style.opacity = "0";

      try {
        a.currentTime = 0;
        b.currentTime = 0;
      } catch {}

      try {
        await a.play();
      } catch {}

      tick();
    };

    prime();

    return () => {
      stopAll();
    };
  }, [src, fadeMs, preRollMs]);

  return (
    <div className={className}>
      <video ref={aRef} src={src} muted playsInline preload="auto" className="loop-video" aria-hidden="true" />
      <video ref={bRef} src={src} muted playsInline preload="auto" className="loop-video" aria-hidden="true" />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="chat-shell">
          <div className="chat-shell__loader">
            <span className="chat-shell__dot" />
            <span className="chat-shell__dot" />
            <span className="chat-shell__dot" />
          </div>
          <p className="chat-shell__text">Chargement du chat…</p>

          <style jsx>{`
            .chat-shell {
              min-height: 100vh;
              display: grid;
              place-items: center;
              padding: 24px 16px;
              color: rgba(226, 232, 240, 0.92);
              background: radial-gradient(1200px 800px at 50% -10%, rgba(251, 55, 255, 0.25), transparent 60%),
                radial-gradient(900px 700px at 90% 10%, rgba(56, 189, 248, 0.22), transparent 55%),
                radial-gradient(1000px 900px at 10% 25%, rgba(249, 115, 22, 0.14), transparent 60%),
                linear-gradient(180deg, #020617, #000);
              font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji",
                "Segoe UI Emoji";
            }
            .chat-shell__loader {
              display: inline-flex;
              gap: 10px;
              align-items: center;
              justify-content: center;
              padding: 14px 18px;
              border-radius: 999px;
              border: 1px solid rgba(148, 163, 184, 0.22);
              background: rgba(2, 6, 23, 0.55);
              box-shadow: 0 16px 60px rgba(15, 23, 42, 0.9);
              backdrop-filter: blur(10px);
            }
            .chat-shell__dot {
              width: 10px;
              height: 10px;
              border-radius: 999px;
              background: rgba(226, 232, 240, 0.85);
              animation: chatDot 900ms ease-in-out infinite;
            }
            .chat-shell__dot:nth-child(2) {
              animation-delay: 120ms;
            }
            .chat-shell__dot:nth-child(3) {
              animation-delay: 240ms;
            }
            .chat-shell__text {
              margin-top: 14px;
              font-size: 0.9rem;
              color: rgba(148, 163, 184, 0.9);
              text-align: center;
            }
            @keyframes chatDot {
              0%,
              100% {
                transform: translateY(0);
                opacity: 0.45;
              }
              50% {
                transform: translateY(-6px);
                opacity: 1;
              }
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

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  const [isBlocked, setIsBlocked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const [voiceBusyMsgId, setVoiceBusyMsgId] = useState<string | null>(null);

  const windowRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

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

  const unlockAudio = async () => {
    try {
      const a = new Audio();
      a.muted = true;
      a.src =
        "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA" +
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
      await a.play().catch(() => {});
    } finally {
      setAudioUnlocked(true);
    }
  };

  const handleWindowScroll = () => {
    const el = windowRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 120;
    shouldAutoScrollRef.current = nearBottom;
  };

  const scrollToBottomIfNeeded = () => {
    const el = windowRef.current;
    if (!el) return;
    if (!shouldAutoScrollRef.current) return;
    el.scrollTop = el.scrollHeight;
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

  useEffect(() => {
    scrollToBottomIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
      }
      if (audioUrlRef.current) {
        try {
          URL.revokeObjectURL(audioUrlRef.current);
        } catch {}
      }
    };
  }, []);

  // 5) Voice (TTS)
  const playAssistantVoice = async (msgId: string, text: string) => {
    if (!canUseVoice || isBlocked) return;
    if (!voiceEnabled) return;
    if (!audioUnlocked) return;
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ iaId, text }),
      });

      const contentType = res.headers.get("Content-Type") || "";

      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const data = await res.json().catch(() => ({}));
          console.error("Voice API error:", res.status, data);
          if (data?.error === "audio_limit_reached") setSendError("Tu as atteint la limite de messages vocaux pour ton forfait actuel.");
          else if (data?.error) setSendError(`Voice error: ${data.error}`);
          else setSendError("Erreur voice. Vérifie la configuration serveur.");
        } else {
          const raw = await res.text().catch(() => "");
          console.error("Voice API error:", res.status, raw);
          setSendError("Erreur voice. Vérifie la configuration serveur.");
        }
        return;
      }

      const audioBlob = await res.blob();

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
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
        if (data?.error === "not_authenticated") return setSendError(t.notAuthenticated);
        if (data?.error === "profile_not_found") return setSendError(t.profileNotFound);
        if (data?.message) return setSendError(data.message);
        return setSendError("Erreur serveur : " + (data?.error ?? "Impossible d’envoyer le message."));
      }

      const assistantMessage: ChatMessage = {
        id: `${baseId}-assistant`,
        role: "assistant",
        content: data?.reply ?? "",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (assistantMessage.content && canUseVoice && voiceEnabled && audioUnlocked && !isBlocked) {
        setTimeout(() => void playAssistantVoice(assistantMessage.id, assistantMessage.content), 80);
      }
    } catch (err) {
      console.error("Erreur réseau /api/chat:", err);
      setSendError("Erreur réseau. Vérifie ta connexion Internet et réessaie dans quelques secondes.");
    } finally {
      setSending(false);
    }
  };

  const avatarRingClass = canPulseAvatar ? "avatarRing avatarRing--live" : "avatarRing";

  return (
    <main className="page">
      <header className="topbar">
        <a href={homeUrl} className="topbar__back">
          {t.backHome}
        </a>
        <LogoutButton />
      </header>

      <section className="card">
        <div className="hero">
          {aiLoading ? (
            <>
              <div className="avatarRing avatarRing--skeleton" />
              <div className="skeletonLine skeletonLine--title" />
              <div className="skeletonLine skeletonLine--sub" />
            </>
          ) : aiError || !ai ? (
            <>
              <div className="avatarRing avatarRing--error">
                <span className="avatarRing__bang">!</span>
              </div>
              <p className="hero__name">{t.aiNotFoundTitle}</p>
              <p className="hero__subtitle">{aiError}</p>
            </>
          ) : (
            <>
              <div className={avatarRingClass}>
                {avatarImageUrl ? (
                  canPlayAvatarVideo && avatarVideoUrl ? (
                    <LoopCrossfadeVideo src={avatarVideoUrl} className="avatarMedia" />
                  ) : (
                    <img src={avatarImageUrl} alt={`Avatar de ${displayName}`} className="avatarImg" />
                  )
                ) : (
                  <div className="avatarFallback">{displayName.charAt(0).toUpperCase()}</div>
                )}
              </div>

              <p className="hero__name">{displayNameUpper}</p>
              <p className="hero__subtitle">{t.subtitle(displayName)}</p>
            </>
          )}
        </div>

        {/* VOICE TOGGLE */}
        {canUseVoice && !isBlocked && (
          <div className="voiceToggle">
            {!audioUnlocked ? (
              <button type="button" className="pillBtn pillBtn--ghost" onClick={() => void unlockAudio()}>
                {t.voiceUnlock}
              </button>
            ) : (
              <button
                type="button"
                className="pillBtn pillBtn--ghost"
                onClick={() => setVoiceEnabled((v) => !v)}
                aria-label="Activer ou désactiver la voix"
              >
                {voiceEnabled ? t.voiceOn : t.voiceOff}
              </button>
            )}
          </div>
        )}

        <div className="chatBox" ref={windowRef} onScroll={handleWindowScroll}>
          {messages.length === 0 ? (
            <div className="empty">{t.emptyState(displayName)}</div>
          ) : (
            <ul className="list">
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                const showVoiceBtn = isAssistant && canUseVoice && !isBlocked;
                const busy = voiceBusyMsgId === m.id;

                return (
                  <li key={m.id} className={m.role === "user" ? "row row--user" : "row row--assistant"}>
                    <div className={m.role === "user" ? "bubble bubble--user" : "bubble bubble--assistant"}>
                      <div className="bubble__grid">
                        <div className="bubble__text">{m.content}</div>

                        {showVoiceBtn && (
                          <button
                            type="button"
                            className="miniBtn"
                            onClick={() => void playAssistantVoice(m.id, m.content)}
                            disabled={!audioUnlocked || busy || !voiceEnabled}
                            aria-label="Lire la réponse en audio"
                            title={!audioUnlocked ? "Active d’abord la voix" : "Lire en audio"}
                          >
                            {busy ? t.voiceLoading : t.voicePlay}
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

        {sendError && <p className="error">{sendError}</p>}

        {!isBlocked && isFreePlan && (
          <div className="promo">
            <div className="badge">PLUS</div>
            <div className="promo__texts">
              <p className="promo__title">{t.promoTitle}</p>
              <p className="promo__text">{t.promoText}</p>
            </div>
            <button type="button" className="pillBtn pillBtn--primary" onClick={handleUpgradeClick}>
              {t.promoCta}
            </button>
          </div>
        )}

        {isBlocked && isFreePlan && (
          <div className="paywall">
            <div className="badge">PLUS</div>
            <p className="paywall__title">{t.paywallTitle}</p>
            <p className="paywall__text">{t.paywallText}</p>
            <button type="button" className="pillBtn pillBtn--primary paywall__btn" onClick={handleUpgradeClick}>
              <span>{t.paywallCta}</span>
              <span aria-hidden="true">➜</span>
            </button>
            <a href={pricingUrl} className="paywall__link">
              {t.paywallSeePlans}
            </a>
          </div>
        )}

        <form className="composer" onSubmit={handleSubmit}>
          <div className="composer__field">
            <textarea
              className="composer__input"
              placeholder={t.inputPlaceholder(displayName)}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={1}
              disabled={isBlocked && isFreePlan}
            />
          </div>

          <div className="composer__actions">
            {canUseVoice && !isBlocked && (
              <button
                type="button"
                className={isRecording ? "iconBtn iconBtn--active" : "iconBtn"}
                onClick={handleToggleRecording}
                disabled={!sttSupported || sending}
                aria-label="Dicter mon message"
                title={!sttSupported ? "Dictée non supportée sur ce navigateur" : isRecording ? t.sttStop : t.sttStart}
              >
                <span className="iconBtn__icon">{isRecording ? "■" : "🎤"}</span>
              </button>
            )}

            <button
              type="submit"
              className="sendBtn"
              disabled={sending || !newMessage.trim() || (isBlocked && isFreePlan)}
              aria-label={t.send}
              title={sending ? t.sending : t.send}
            >
              <span className="sendBtn__icon">➤</span>
            </button>
          </div>
        </form>

        <p className="note">Tes messages sont privés et ne sont jamais visibles par les autres utilisateurs.</p>
      </section>

      <style jsx>{`
        /* =========================
           THEME TOKENS
        ========================== */
        :global(html) {
          color-scheme: dark;
        }
        .page {
          --bg0: #000;
          --bg1: #020617;
          --glass: rgba(2, 6, 23, 0.55);
          --card: rgba(15, 23, 42, 0.78);
          --card2: rgba(2, 6, 23, 0.72);
          --line: rgba(148, 163, 184, 0.22);
          --line2: rgba(148, 163, 184, 0.35);
          --text: rgba(226, 232, 240, 0.92);
          --muted: rgba(148, 163, 184, 0.9);
          --muted2: rgba(148, 163, 184, 0.65);

          --g1: #fb37ff;
          --g2: #ff6b9c;
          --g3: #38bdf8;
          --g4: #f97316;

          --shadow: 0 26px 90px rgba(0, 0, 0, 0.75);
          --shadow2: 0 18px 50px rgba(15, 23, 42, 0.75);

          min-height: 100vh;
          padding: 22px 16px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;

          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji",
            "Segoe UI Emoji";

          background: radial-gradient(1100px 700px at 50% -10%, rgba(251, 55, 255, 0.24), transparent 60%),
            radial-gradient(900px 700px at 90% 10%, rgba(56, 189, 248, 0.18), transparent 55%),
            radial-gradient(950px 700px at 10% 25%, rgba(249, 115, 22, 0.12), transparent 60%),
            linear-gradient(180deg, var(--bg1), var(--bg0));
        }

        /* =========================
           TOPBAR
        ========================== */
        .topbar {
          width: 100%;
          max-width: 920px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .topbar__back {
          font-size: 0.82rem;
          color: rgba(148, 163, 184, 0.88);
          text-decoration: none;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          background: rgba(2, 6, 23, 0.35);
          backdrop-filter: blur(10px);
          transition: transform 120ms ease, border-color 120ms ease, color 120ms ease;
        }
        .topbar__back:hover {
          transform: translateY(-1px);
          border-color: rgba(148, 163, 184, 0.3);
          color: rgba(226, 232, 240, 0.92);
        }

        /* =========================
           CARD
        ========================== */
        .card {
          width: 100%;
          max-width: 920px;
          border-radius: 26px;
          border: 1px solid rgba(148, 163, 184, 0.26);
          background: radial-gradient(900px 600px at 50% 0%, rgba(251, 55, 255, 0.16), transparent 60%),
            radial-gradient(800px 520px at 80% 0%, rgba(56, 189, 248, 0.12), transparent 55%),
            linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(2, 6, 23, 0.78));
          box-shadow: var(--shadow);
          padding: 18px 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          backdrop-filter: blur(12px);
        }

        /* =========================
           HERO
        ========================== */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          padding-top: 2px;
        }
        .hero__name {
          margin-top: 8px;
          font-weight: 750;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.92rem;
        }
        .hero__subtitle {
          font-size: 0.86rem;
          color: rgba(148, 163, 184, 0.92);
          max-width: 620px;
          line-height: 1.35;
        }

        /* =========================
           AVATAR
        ========================== */
        @keyframes ringPulse {
          0% {
            transform: scale(1);
            filter: saturate(1);
          }
          50% {
            transform: scale(1.02);
            filter: saturate(1.15);
          }
          100% {
            transform: scale(1);
            filter: saturate(1);
          }
        }

        .avatarRing {
          width: 162px;
          height: 162px;
          border-radius: 999px;
          padding: 3px;
          background: conic-gradient(from 180deg, var(--g1), var(--g2), var(--g3), var(--g1));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow2);
        }
        .avatarRing--live {
          animation: ringPulse 4s ease-in-out infinite;
        }

        /* Container pour les 2 <video> */
        .avatarMedia {
          width: 156px;
          height: 156px;
          border-radius: 999px;
          overflow: hidden;
          position: relative;
          background: rgba(2, 6, 23, 0.9);
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .loop-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 20%;
          border-radius: 999px;
          background: rgba(2, 6, 23, 0.9);
          opacity: 0;
          will-change: opacity;
        }

        .avatarImg {
          width: 156px;
          height: 156px;
          border-radius: 999px;
          object-fit: cover;
          object-position: 50% 20%;
          display: block;
          background: rgba(2, 6, 23, 0.9);
        }

        .avatarFallback {
          width: 156px;
          height: 156px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(30, 41, 59, 0.92);
          color: rgba(226, 232, 240, 0.92);
          font-weight: 700;
          font-size: 3rem;
          letter-spacing: 0.02em;
        }

        .avatarRing--error {
          background: radial-gradient(circle at center, rgba(185, 28, 28, 1), rgba(127, 29, 29, 1));
          border: 1px solid rgba(248, 113, 113, 0.45);
          box-shadow: 0 0 44px rgba(248, 113, 113, 0.34);
        }
        .avatarRing__bang {
          font-size: 2.1rem;
          font-weight: 800;
        }

        /* =========================
           SKELETON
        ========================== */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .avatarRing--skeleton {
          background: linear-gradient(90deg, rgba(148, 163, 184, 0.16), rgba(148, 163, 184, 0.32), rgba(148, 163, 184, 0.16));
          background-size: 200% 100%;
          animation: shimmer 1.3s infinite;
        }
        .skeletonLine {
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(148, 163, 184, 0.28), rgba(148, 163, 184, 0.14));
          background-size: 200% 100%;
          animation: shimmer 1.3s infinite;
        }
        .skeletonLine--title {
          height: 14px;
          width: 180px;
          margin-top: 10px;
        }
        .skeletonLine--sub {
          height: 12px;
          width: min(520px, 86%);
          margin-top: 6px;
        }

        /* =========================
           VOICE TOGGLE / BUTTONS
        ========================== */
        .voiceToggle {
          display: flex;
          justify-content: center;
          margin-top: -2px;
        }

        .pillBtn {
          border-radius: 999px;
          padding: 10px 14px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(2, 6, 23, 0.35);
          color: rgba(226, 232, 240, 0.92);
          cursor: pointer;
          font-size: 0.86rem;
          line-height: 1;
          transition: transform 120ms ease, filter 120ms ease, border-color 120ms ease;
          backdrop-filter: blur(10px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          user-select: none;
        }
        .pillBtn:hover {
          transform: translateY(-1px);
          border-color: rgba(148, 163, 184, 0.35);
          filter: brightness(1.02);
        }
        .pillBtn:disabled {
          opacity: 0.5;
          cursor: default;
          transform: none;
          filter: none;
        }
        .pillBtn--ghost {
          background: rgba(2, 6, 23, 0.4);
        }
        .pillBtn--primary {
          border: none;
          background: linear-gradient(135deg, var(--g1), var(--g2), var(--g4));
          color: rgba(248, 250, 252, 0.98);
          box-shadow: 0 16px 42px rgba(248, 113, 113, 0.45);
        }

        /* =========================
           CHAT BOX
        ========================== */
        .chatBox {
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: radial-gradient(800px 420px at 50% 0%, rgba(56, 189, 248, 0.06), transparent 55%),
            linear-gradient(180deg, rgba(2, 6, 23, 0.55), rgba(2, 6, 23, 0.68));
          height: 380px;
          max-height: 58vh;
          padding: 12px;
          overflow-y: auto;
          overscroll-behavior: contain;
          box-shadow: inset 0 0 0 1px rgba(2, 6, 23, 0.25);
        }

        .chatBox::-webkit-scrollbar {
          width: 10px;
        }
        .chatBox::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.26);
          border-radius: 999px;
          border: 2px solid rgba(2, 6, 23, 0.7);
        }
        .chatBox::-webkit-scrollbar-track {
          background: rgba(2, 6, 23, 0.25);
          border-radius: 999px;
        }

        .empty {
          padding-top: 34px;
          text-align: center;
          color: rgba(148, 163, 184, 0.9);
          font-size: 0.95rem;
        }

        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .row {
          display: flex;
        }
        .row--user {
          justify-content: flex-end;
        }
        .row--assistant {
          justify-content: flex-start;
        }

        .bubble {
          max-width: 78%;
          border-radius: 18px;
          padding: 10px 12px;
          font-size: 0.92rem;
          line-height: 1.42;
          white-space: pre-wrap;
          word-wrap: break-word;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(148, 163, 184, 0.14);
          backdrop-filter: blur(10px);
        }
        .bubble--user {
          background: linear-gradient(135deg, rgba(251, 55, 255, 0.95), rgba(255, 107, 156, 0.95), rgba(249, 115, 22, 0.92));
          color: rgba(248, 250, 252, 0.98);
          border-bottom-right-radius: 6px;
          border: none;
        }
        .bubble--assistant {
          background: rgba(2, 6, 23, 0.5);
          color: rgba(226, 232, 240, 0.92);
          border-bottom-left-radius: 6px;
          border: 1px solid rgba(148, 163, 184, 0.22);
        }

        .bubble__grid {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .bubble__text {
          flex: 1;
          min-width: 0;
        }

        .miniBtn {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(2, 6, 23, 0.35);
          color: rgba(226, 232, 240, 0.92);
          padding: 7px 10px;
          cursor: pointer;
          font-size: 0.86rem;
          line-height: 1;
          white-space: nowrap;
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .miniBtn:hover {
          transform: translateY(-1px);
          border-color: rgba(148, 163, 184, 0.35);
        }
        .miniBtn:disabled {
          opacity: 0.5;
          cursor: default;
          transform: none;
        }

        /* =========================
           ERROR
        ========================== */
        .error {
          margin: 2px 0 0;
          font-size: 0.84rem;
          color: rgba(254, 202, 202, 0.98);
          text-align: center;
        }

        /* =========================
           PROMO / PAYWALL
        ========================== */
        .badge {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(248, 250, 252, 0.2);
          background: rgba(2, 6, 23, 0.55);
          color: rgba(248, 250, 252, 0.92);
          width: fit-content;
        }

        .promo {
          border-radius: 999px;
          padding: 12px 12px;
          border: 1px solid rgba(251, 113, 133, 0.35);
          background: radial-gradient(800px 260px at 0% 50%, rgba(251, 55, 255, 0.16), transparent 60%),
            linear-gradient(180deg, rgba(2, 6, 23, 0.45), rgba(2, 6, 23, 0.6));
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: space-between;
        }
        .promo__texts {
          flex: 1;
          min-width: 0;
          padding: 0 6px;
        }
        .promo__title {
          font-size: 0.86rem;
          font-weight: 650;
          margin: 0;
        }
        .promo__text {
          font-size: 0.8rem;
          margin: 2px 0 0;
          color: rgba(226, 232, 240, 0.9);
          line-height: 1.25;
        }

        .paywall {
          border-radius: 20px;
          padding: 14px 14px 12px;
          border: 1px solid rgba(251, 113, 133, 0.35);
          background: radial-gradient(900px 520px at 0% 0%, rgba(251, 55, 255, 0.18), transparent 55%),
            linear-gradient(180deg, rgba(2, 6, 23, 0.45), rgba(2, 6, 23, 0.65));
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }
        .paywall::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(700px 360px at 120% 0%, rgba(248, 250, 252, 0.16), transparent 60%);
          opacity: 0.7;
          pointer-events: none;
        }
        .paywall__title {
          position: relative;
          margin: 0;
          font-size: 0.98rem;
          font-weight: 700;
        }
        .paywall__text {
          position: relative;
          margin: 0;
          font-size: 0.86rem;
          color: rgba(226, 232, 240, 0.9);
          line-height: 1.35;
          max-width: 520px;
        }
        .paywall__btn {
          position: relative;
          width: fit-content;
          padding-inline: 14px;
        }
        .paywall__link {
          position: relative;
          font-size: 0.82rem;
          color: rgba(248, 250, 252, 0.94);
          text-decoration: underline;
          text-underline-offset: 3px;
          width: fit-content;
        }

        /* =========================
           COMPOSER
        ========================== */
        .composer {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items: end;
          margin-top: 2px;
        }

        .composer__field {
          border-radius: 999px;
          padding: 4px 14px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(2, 6, 23, 0.5);
          backdrop-filter: blur(10px);
          box-shadow: inset 0 0 0 1px rgba(2, 6, 23, 0.25);
        }

        .composer__input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: rgba(226, 232, 240, 0.92);
          font-size: 0.92rem;
          padding: 10px 0;
          resize: none;
          line-height: 1.35;
        }
        .composer__input::placeholder {
          color: rgba(148, 163, 184, 0.65);
        }
        .composer__input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .composer__actions {
          display: inline-flex;
          gap: 8px;
          align-items: center;
        }

        .iconBtn {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(2, 6, 23, 0.45);
          color: rgba(226, 232, 240, 0.92);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform 120ms ease, border-color 120ms ease, filter 120ms ease;
        }
        .iconBtn:hover {
          transform: translateY(-1px);
          border-color: rgba(148, 163, 184, 0.35);
        }
        .iconBtn:disabled {
          opacity: 0.45;
          cursor: default;
          transform: none;
        }
        .iconBtn--active {
          border-color: rgba(251, 55, 255, 0.55);
          box-shadow: 0 0 22px rgba(251, 55, 255, 0.22);
          background: radial-gradient(80px 80px at 50% 0%, rgba(251, 55, 255, 0.18), rgba(2, 6, 23, 0.55));
        }
        .iconBtn__icon {
          font-size: 1.05rem;
          transform: translateY(1px);
        }

        .sendBtn {
          width: 46px;
          height: 46px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, var(--g1), var(--g2), var(--g4));
          color: rgba(248, 250, 252, 0.98);
          box-shadow: 0 18px 46px rgba(248, 113, 113, 0.42);
          display: grid;
          place-items: center;
          transition: transform 120ms ease, filter 120ms ease, opacity 120ms ease;
        }
        .sendBtn:hover {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }
        .sendBtn:disabled {
          opacity: 0.45;
          cursor: default;
          box-shadow: none;
          transform: none;
          filter: none;
        }
        .sendBtn__icon {
          font-size: 1.02rem;
          transform: translateX(1px);
        }

        /* =========================
           FOOTNOTE
        ========================== */
        .note {
          margin: 4px 0 0;
          font-size: 0.8rem;
          color: rgba(148, 163, 184, 0.7);
          text-align: right;
        }

        /* =========================
           RESPONSIVE
        ========================== */
        @media (max-width: 768px) {
          .card {
            padding: 16px 14px 12px;
            border-radius: 24px;
          }
          .chatBox {
            height: 340px;
          }
          .avatarRing {
            width: 154px;
            height: 154px;
          }
          .avatarMedia,
          .avatarImg,
          .avatarFallback {
            width: 148px;
            height: 148px;
          }
        }

        @media (max-width: 480px) {
          .page {
            padding-inline: 12px;
          }
          .note {
            text-align: center;
          }

          .promo {
            border-radius: 18px;
            padding: 12px;
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-areas: "badge texts" "btn btn";
            gap: 10px;
            align-items: start;
          }
          .promo .badge {
            grid-area: badge;
          }
          .promo__texts {
            grid-area: texts;
            padding: 0;
          }
          .promo .pillBtn--primary {
            grid-area: btn;
            width: 100%;
          }

          .paywall__btn {
            width: 100%;
            justify-content: center;
          }
          .paywall__link {
            width: 100%;
            text-align: center;
          }

          .bubble {
            max-width: 90%;
          }
        }
      `}</style>
    </main>
  );
}
