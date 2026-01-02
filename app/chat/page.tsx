"use client";

export const dynamic = "force-dynamic";

import React, { FormEvent, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { LogoutButton } from "../components/LogoutButton";
import { maxAmoriaForPlan, type PlanId } from "@/lib/plan";

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

  voiceUnlock: string;
  voiceOn: string;
  voiceOff: string;

  sttStart: string;
  sttStop: string;

  notePrivate: string;

  voiceLimitReached: string;
  voiceServerError: string;
  voiceNetworkError: string;

  chatNetworkError: string;
  chatServerErrorPrefix: string;

  myAmoria: string;
  createAmoria: string;
};

const STRINGS: Record<Locale, UiCopy> = {
  fr: {
    backHome: "← Accueil",
    title: (name) => `Chat avec ${name}`,
    subtitle: (name) => `${name} est là. Tu peux parler librement, à ton rythme.`,
    emptyState: (name) => `Aucun message pour l’instant. Dis simplement “salut” à ${name} 💬`,
    inputPlaceholder: (name) => `Écris à ${name}…`,

    send: "Envoyer",
    sending: "Envoi…",
    loading: "Ouverture du chat…",

    aiNotFoundTitle: "AmorIA introuvable",
    genericError: "Impossible d’ouvrir cette conversation pour le moment. Réessaie dans quelques secondes.",
    notAuthenticated: "Session introuvable. Actualise la page ou reconnecte-toi, puis réessaie.",
    profileNotFound: "Aucune AmorIA trouvée. Va dans « Mes AmorIAI » pour en créer une, puis reviens ici.",

    paywallTitle: "🔒 Limite atteinte pour ton accès gratuit.",
    paywallText: "Pour continuer et débloquer la voix, passe à AmorIAI Plus.",
    paywallCta: "Passer à AmorIAI Plus",
    paywallSeePlans: "Voir les forfaits →",

    promoTitle: "Tu veux plus de messages ?",
    promoText: "AmorIAI Plus te donne plus de messages et la voix de ton compagnon.",
    promoCta: "Découvrir AmorIAI Plus",

    voiceUnlock: "🔓 Activer l’audio",
    voiceOn: "🔊 Voix : ON",
    voiceOff: "🔇 Voix : OFF",

    sttStart: "Dicter",
    sttStop: "Stop",

    notePrivate: "Tes messages sont privés.",

    voiceLimitReached: "Tu as atteint la limite de voix pour ton forfait.",
    voiceServerError: "Erreur voice (serveur).",
    voiceNetworkError: "Erreur voice (réseau).",

    chatNetworkError: "Erreur réseau. Vérifie ta connexion et réessaie.",
    chatServerErrorPrefix: "Erreur serveur : ",

    myAmoria: "Mes AmorIAI",
    createAmoria: "Créer",
  },
  en: {
    backHome: "← Home",
    title: (name) => `Chat with ${name}`,
    subtitle: (name) => `${name} is here. Take your time.`,
    emptyState: (name) => `No messages yet. Say “hi” to ${name} 💬`,
    inputPlaceholder: (name) => `Write to ${name}…`,

    send: "Send",
    sending: "Sending…",
    loading: "Opening chat…",

    aiNotFoundTitle: "Companion not found",
    genericError: "We couldn’t open this conversation. Please try again.",
    notAuthenticated: "Session missing. Refresh or log in again, then retry.",
    profileNotFound: "No AmorIA found. Go to “My AmorIAI” to create one, then come back.",

    paywallTitle: "🔒 You’ve reached your free limit.",
    paywallText: "To continue and unlock voice, upgrade to AmorIAI Plus.",
    paywallCta: "Upgrade to AmorIAI Plus",
    paywallSeePlans: "See plans →",

    promoTitle: "Want more messages?",
    promoText: "AmorIAI Plus gives you more messages and voice.",
    promoCta: "Discover AmorIAI Plus",

    voiceUnlock: "🔓 Enable audio",
    voiceOn: "🔊 Voice: ON",
    voiceOff: "🔇 Voice: OFF",

    sttStart: "Dictate",
    sttStop: "Stop",

    notePrivate: "Your messages are private.",

    voiceLimitReached: "You’ve reached the voice limit for your plan.",
    voiceServerError: "Voice error (server).",
    voiceNetworkError: "Voice error (network).",

    chatNetworkError: "Network error. Check your connection and try again.",
    chatServerErrorPrefix: "Server error: ",

    myAmoria: "My AmorIAI",
    createAmoria: "Create",
  },
  es: {
    backHome: "← Inicio",
    title: (name) => `Chat con ${name}`,
    subtitle: (name) => `${name} está aquí. Tómate tu tiempo.`,
    emptyState: (name) => `Aún no hay mensajes. Di “hola” a ${name} 💬`,
    inputPlaceholder: (name) => `Escribe a ${name}…`,

    send: "Enviar",
    sending: "Enviando…",
    loading: "Abriendo chat…",

    aiNotFoundTitle: "Compañero no encontrado",
    genericError: "No pudimos abrir la conversación. Intenta de nuevo.",
    notAuthenticated: "Sesión no encontrada. Actualiza o vuelve a iniciar sesión.",
    profileNotFound: "No se encontró ninguna AmorIA. Ve a “Mis AmorIAI” para crear una y vuelve aquí.",

    paywallTitle: "🔒 Has alcanzado tu límite gratuito.",
    paywallText: "Para continuar y desbloquear la voz, pásate a AmorIAI Plus.",
    paywallCta: "Pasar a AmorIAI Plus",
    paywallSeePlans: "Ver planes →",

    promoTitle: "¿Quieres más mensajes?",
    promoText: "AmorIAI Plus te da más mensajes y voz.",
    promoCta: "Descubrir AmorIAI Plus",

    voiceUnlock: "🔓 Activar audio",
    voiceOn: "🔊 Voz: ON",
    voiceOff: "🔇 Voz: OFF",

    sttStart: "Dictar",
    sttStop: "Stop",

    notePrivate: "Tus mensajes son privados.",

    voiceLimitReached: "Has alcanzado el límite de voz para tu plan.",
    voiceServerError: "Error de voz (servidor).",
    voiceNetworkError: "Error de voz (red).",

    chatNetworkError: "Error de red. Verifica tu conexión e inténtalo de nuevo.",
    chatServerErrorPrefix: "Error del servidor: ",

    myAmoria: "Mis AmorIAI",
    createAmoria: "Crear",
  },
};

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}
function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited" ? raw : "free";
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatClient />
    </Suspense>
  );
}

function ChatSkeleton() {
  return (
    <main className="chat-shell">
      <div className="chat-shell__loader">
        <span className="chat-shell__dot" />
        <span className="chat-shell__dot" />
        <span className="chat-shell__dot" />
      </div>
      <p className="chat-shell__text">Chargement…</p>

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
  );
}

function ChatClient() {
  const router = useRouter();
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

  // plan + quota
  const [planCode, setPlanCode] = useState<string | null>(null);
  const [activeAmoriaCount, setActiveAmoriaCount] = useState<number>(0);

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
  const voiceBusyRef = useRef(false);

  const windowRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  const [avatarPlaying, setAvatarPlaying] = useState(false);
  const avatarTimerRef = useRef<number | null>(null);

  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const planId: PlanId = useMemo(() => normalizePlan(planCode), [planCode]);
  const maxAllowed = useMemo(() => maxAmoriaForPlan(planId), [planId]);

  const isFreePlan = planId === "free";
  const isPaidPlan = !isFreePlan;

  const canCreate = useMemo(() => {
    if (planId === "free") return false;
    return activeAmoriaCount < maxAllowed;
  }, [planId, activeAmoriaCount, maxAllowed]);

  const displayName = useMemo(() => (ai?.name?.trim() || "AmorIAI").trim(), [ai?.name]);
  const displayNameUpper = useMemo(() => displayName.toUpperCase(), [displayName]);
  const avatarImageUrl = ai?.avatar_image_url ?? null;

  const avatarVideoUrl = useMemo(() => {
    if (!avatarImageUrl) return null;
    if (!/\.(png|jpe?g|webp)$/i.test(avatarImageUrl)) return null;
    return avatarImageUrl.replace(/\.(png|jpe?g|webp)$/i, ".mp4");
  }, [avatarImageUrl]);

  const homeUrl = useMemo(() => `/?lang=${locale}`, [locale]);
  const myAmoriaUrl = useMemo(() => `/my-amoria?lang=${locale}`, [locale]);
  const createAmoriaUrl = useMemo(() => `/create-amoria?lang=${locale}`, [locale]);
  const pricingUrl = useMemo(() => `/pricing?lang=${locale}`, [locale]);

  // ✅ IMPORTANT: si /chat sans iaId -> back /my-amoria
  useEffect(() => {
    if (!iaId) router.replace(myAmoriaUrl);
  }, [iaId, router, myAmoriaUrl]);

  // ✅ Save last IA used
  useEffect(() => {
    if (!iaId) return;
    try {
      window.localStorage.setItem("amoria_last_ia_id", iaId);
    } catch {}
  }, [iaId]);

  const handleUpgradeClick = useCallback(() => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", "plus");
    window.location.href = `/pricing?${params.toString()}`;
  }, [locale]);

  const unlockAudio = useCallback(async () => {
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
  }, []);

  const handleWindowScroll = useCallback(() => {
    const el = windowRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 120;
    shouldAutoScrollRef.current = nearBottom;
  }, []);

  const scrollToBottomIfNeeded = useCallback(() => {
    const el = windowRef.current;
    if (!el) return;
    if (!shouldAutoScrollRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  const triggerAvatarAnimation = useCallback(() => {
    if (!canPlayAvatarVideo) return;
    if (!avatarVideoUrl) return;

    if (avatarTimerRef.current) {
      window.clearTimeout(avatarTimerRef.current);
      avatarTimerRef.current = null;
    }

    setAvatarPlaying(true);
    avatarTimerRef.current = window.setTimeout(() => {
      setAvatarPlaying(false);
      avatarTimerRef.current = null;
    }, 10_000);
  }, [canPlayAvatarVideo, avatarVideoUrl]);

  // Auto-grow textarea
  const autoGrow = useCallback(() => {
    const el = composerRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 180);
    el.style.height = `${next}px`;
  }, []);
  useEffect(() => {
    autoGrow();
  }, [newMessage, autoGrow]);

  // 1) plan + quota IA
  useEffect(() => {
    let cancelled = false;

    const loadSubscriptionAndQuota = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (cancelled) return;

        if (!user) {
          setPlanCode(null);
          setActiveAmoriaCount(0);
          setCanUseVoice(false);
          setCanPulseAvatar(false);
          setCanPlayAvatarVideo(false);
          setSttSupported(false);
          return;
        }

        // plan depuis user_subscriptions -> pricing_plans.code
        let sub: any = null;

        const q1 = await supabase
          .from("user_subscriptions")
          .select(
            `
            pricing_plans (
              code,
              has_voice,
              voice_limit
            )
          `
          )
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        if (!q1.error && q1.data) sub = q1.data;

        if (!sub) {
          const q2 = await supabase
            .from("user_subscriptions")
            .select(
              `
              pricing_plans (
                code,
                has_voice,
                voice_limit
              )
            `
            )
            .eq("user_id", user.id)
            .eq("status", "active")
            .maybeSingle();

          if (!q2.error && q2.data) sub = q2.data;
        }

        const rawPlans: any = sub?.pricing_plans;

        let code: string | null = null;
        let hasVoice = false;
        let voiceLimit = 0;

        const pickPlan = (p: any) => {
          code = p?.code ?? null;
          hasVoice = !!p?.has_voice;
          voiceLimit = Number(p?.voice_limit ?? 0);
        };

        if (Array.isArray(rawPlans)) pickPlan(rawPlans[0] ?? {});
        else if (rawPlans && typeof rawPlans === "object") pickPlan(rawPlans);

        if (cancelled) return;

        setPlanCode(code);

        const paid = !!code && code !== "free";
        setCanPulseAvatar(paid);
        setCanPlayAvatarVideo(code === "unlimited");

        const voiceOk = hasVoice && voiceLimit > 0;
        setCanUseVoice(voiceOk);
        if (!voiceOk) setSttSupported(false);

        if (code !== "unlimited") setAvatarPlaying(false);

        // quota IA
        const countRes = await supabase
          .from("user_amoria")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_archived", false);

        if (cancelled) return;
        setActiveAmoriaCount(countRes.count ?? 0);
      } catch (err) {
        console.error("Erreur loadSubscription:", err);
        if (cancelled) return;
        setPlanCode(null);
        setActiveAmoriaCount(0);
        setCanUseVoice(false);
        setCanPulseAvatar(false);
        setCanPlayAvatarVideo(false);
        setSttSupported(false);
      }
    };

    loadSubscriptionAndQuota();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2) STT support
  useEffect(() => {
    if (!canUseVoice) {
      setSttSupported(false);
      return;
    }
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSttSupported(!!SpeechRecognition);
  }, [canUseVoice]);

  const startRecording = useCallback(() => {
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
  }, [canUseVoice, isBlocked, locale, newMessage]);

  const stopRecording = useCallback(() => {
    const r = recognitionRef.current;
    if (r) r.stop();
    setIsRecording(false);
  }, []);

  const handleToggleRecording = useCallback(() => {
    if (!canUseVoice || !sttSupported || sending || isBlocked) return;
    if (isRecording) stopRecording();
    else startRecording();
  }, [canUseVoice, sttSupported, sending, isBlocked, isRecording, stopRecording, startRecording]);

  // 3) Charger AI
  useEffect(() => {
    let cancelled = false;

    const loadAI = async () => {
      setAiLoading(true);
      setAiError(null);
      setAi(null);

      if (!iaId) {
        setAiLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from("user_amoria").select("*").eq("id", iaId).maybeSingle();
        if (cancelled) return;
        if (error || !data) setAiError(t.genericError);
        else setAi(data as AmoriaRow);
      } catch {
        if (cancelled) return;
        setAiError(t.genericError);
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    };

    loadAI();

    return () => {
      cancelled = true;
    };
  }, [iaId, t.genericError]);

  // 4) Historique (paid)
  useEffect(() => {
    if (!iaId) return;
    if (!isPaidPlan) return;

    const ac = new AbortController();

    const loadHistory = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;
        if (!accessToken) return;

        const res = await fetch(`/api/chat/history?iaId=${encodeURIComponent(iaId)}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: ac.signal,
        });

        if (!res.ok) return;

        const data = (await res.json()) as ChatMessage[];
        if (ac.signal.aborted) return;

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

    return () => {
      ac.abort();
    };
  }, [iaId, isPaidPlan]);

  useEffect(() => {
    scrollToBottomIfNeeded();
  }, [messages.length, scrollToBottomIfNeeded]);

  // cleanup
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
      if (avatarTimerRef.current) {
        try {
          window.clearTimeout(avatarTimerRef.current);
        } catch {}
        avatarTimerRef.current = null;
      }
    };
  }, []);

  // 5) Voice (TTS)
  const playAssistantVoice = useCallback(
    async (text: string) => {
      if (!canUseVoice || isBlocked) return;
      if (!voiceEnabled) return;
      if (!audioUnlocked) return;
      if (!iaId || !text?.trim()) return;
      if (voiceBusyRef.current) return;

      voiceBusyRef.current = true;
      setSendError(null);

      const ac = new AbortController();

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;
        if (!accessToken) {
          setSendError(t.notAuthenticated);
          return;
        }

        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ iaId, text }),
          signal: ac.signal,
        });

        const contentType = res.headers.get("Content-Type") || "";

        if (!res.ok) {
          if (contentType.includes("application/json")) {
            const data = await res.json().catch(() => ({}));
            if (data?.error === "audio_limit_reached") setSendError(t.voiceLimitReached);
            else if (data?.error) setSendError(`Voice error: ${data.error}`);
            else setSendError(t.voiceServerError);
          } else {
            setSendError(t.voiceServerError);
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
        setSendError(t.voiceNetworkError);
      } finally {
        ac.abort();
        voiceBusyRef.current = false;
      }
    },
    [
      canUseVoice,
      isBlocked,
      voiceEnabled,
      audioUnlocked,
      iaId,
      t.notAuthenticated,
      t.voiceLimitReached,
      t.voiceServerError,
      t.voiceNetworkError,
    ]
  );

  // 6) Send message
  const sendMessage = useCallback(async () => {
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

    const ac = new AbortController();

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        setSendError(t.notAuthenticated);
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ iaId, message: content, lang: locale }),
        signal: ac.signal,
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
        if (data?.error === "not_authenticated") return setSendError(t.notAuthenticated);
        if (data?.error === "profile_not_found") return setSendError(t.profileNotFound);
        if (data?.message) return setSendError(data.message);
        return setSendError(t.chatServerErrorPrefix + (data?.error ?? "Unable to send message."));
      }

      const assistantMessage: ChatMessage = {
        id: `${baseId}-assistant`,
        role: "assistant",
        content: data?.reply ?? "",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (assistantMessage.content && !isBlocked) triggerAvatarAnimation();

      if (assistantMessage.content && canUseVoice && voiceEnabled && audioUnlocked && !isBlocked) {
        window.setTimeout(() => void playAssistantVoice(assistantMessage.content), 80);
      }
    } catch (err) {
      console.error("Erreur réseau /api/chat:", err);
      setSendError(t.chatNetworkError);
    } finally {
      ac.abort();
      setSending(false);
    }
  }, [
    newMessage,
    iaId,
    isBlocked,
    isRecording,
    stopRecording,
    t.notAuthenticated,
    locale,
    isFreePlan,
    t.profileNotFound,
    t.chatServerErrorPrefix,
    t.chatNetworkError,
    triggerAvatarAnimation,
    canUseVoice,
    voiceEnabled,
    audioUnlocked,
    playAssistantVoice,
  ]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await sendMessage();
    },
    [sendMessage]
  );

  const handleComposerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Enter") return;
      if (e.shiftKey) return;
      e.preventDefault();
      if (sending) return;
      void sendMessage();
    },
    [sendMessage, sending]
  );

  const avatarRingClass = canPulseAvatar ? "avatarRing avatarRing--live" : "avatarRing";
  const showVideoNow = !!avatarImageUrl && canPlayAvatarVideo && !!avatarVideoUrl && avatarPlaying;

  // Tant que iaId est absent, on laisse le router.replace faire sa job
  if (!iaId) return <ChatSkeleton />;

  return (
    <main className="page">
      <header className="topbar">
        <a href={homeUrl} className="topbar__back">
          {t.backHome}
        </a>

        <div className="topbar__right">
          {/* ✅ FREE: on cache “Mes AmorIAI” */}
          {!isFreePlan && (
            <Link href={myAmoriaUrl} className="topbar__pill">
              {t.myAmoria}
            </Link>
          )}

          {/* canCreate est déjà false en FREE */}
          {canCreate && (
            <Link href={createAmoriaUrl} className="topbar__pill topbar__pill--primary">
              {t.createAmoria}
            </Link>
          )}

          <LogoutButton />
        </div>
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
                  showVideoNow ? (
                    <video
                      key={avatarVideoUrl ?? "vid"}
                      src={avatarVideoUrl ?? undefined}
                      muted
                      playsInline
                      autoPlay
                      preload="auto"
                      className="avatarVid"
                      onEnded={() => setAvatarPlaying(false)}
                      aria-label="Avatar animé"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarImageUrl} alt={`Avatar de ${displayName}`} className="avatarImg" />
                  )
                ) : (
                  <div className="avatarFallback">{displayName.charAt(0).toUpperCase()}</div>
                )}
              </div>

              <p className="hero__name">{displayNameUpper}</p>
              <p className="hero__subtitle">{t.subtitle(displayName)}</p>

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
                      title={voiceEnabled ? "OFF" : "ON"}
                    >
                      {voiceEnabled ? t.voiceOn : t.voiceOff}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="chatBox" ref={windowRef} onScroll={handleWindowScroll}>
          {messages.length === 0 ? (
            <div className="empty">{t.emptyState(displayName)}</div>
          ) : (
            <ul className="list">
              {messages.map((m) => (
                <li key={m.id} className={m.role === "user" ? "row row--user" : "row row--assistant"}>
                  <div className={m.role === "user" ? "bubble bubble--user" : "bubble bubble--assistant"}>
                    <div className="bubble__text">{m.content}</div>
                  </div>
                </li>
              ))}
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
              ref={composerRef}
              className="composer__input"
              placeholder={t.inputPlaceholder(displayName)}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleComposerKeyDown}
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
                aria-label={t.sttStart}
                title={!sttSupported ? "STT not supported" : isRecording ? t.sttStop : t.sttStart}
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

        <p className="note">{t.notePrivate}</p>
      </section>
    </main>
  );
          }
