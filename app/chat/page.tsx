"use client";

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

  tooLong: (max: number) => string;
  charsLeft: (left: number, max: number) => string;

  // ✅ NEW: nudge quota
  freeRemainingLabel: (n: number) => string;
  freeNudgeTitle3: string;
  freeNudgeText3: string;
  freeNudgeTitle1: string;
  freeNudgeText1: string;
  freeNudgeCta: string;
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
    paywallText: "Pour continuer (et débloquer la voix), passe à AmorIAI Plus.",
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

    tooLong: (max) => `Ton message est trop long (max ${max} caractères pour ton forfait).`,
    charsLeft: (left, max) => `${left} / ${max}`,

    freeRemainingLabel: (n) => `Il te reste ${n} message${n > 1 ? "s" : ""} gratuit${n > 1 ? "s" : ""}.`,
    freeNudgeTitle3: "On est bien partis 🙂",
    freeNudgeText3: "Il te reste peu de messages gratuits. Si tu veux qu’on garde le fil et qu’on approfondisse, Plus est idéal.",
    freeNudgeTitle1: "Dernier message gratuit…",
    freeNudgeText1: "Si tu veux continuer juste après, passe à Plus pour garder la continuité (et activer la voix).",
    freeNudgeCta: "Continuer avec Plus",
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
    paywallText: "To continue (and unlock voice), upgrade to AmorIAI Plus.",
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

    tooLong: (max) => `Your message is too long (max ${max} chars for your plan).`,
    charsLeft: (left, max) => `${left} / ${max}`,

    freeRemainingLabel: (n) => `${n} free message${n > 1 ? "s" : ""} left.`,
    freeNudgeTitle3: "We’re on a good track 🙂",
    freeNudgeText3: "You’re close to the free limit. If you want continuity and deeper chat, Plus is best.",
    freeNudgeTitle1: "Last free message…",
    freeNudgeText1: "If you want to continue right after, upgrade to Plus for continuity (and voice).",
    freeNudgeCta: "Continue with Plus",
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
    paywallText: "Para continuar (y desbloquear la voz), pásate a AmorIAI Plus.",
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

    tooLong: (max) => `Tu mensaje es demasiado largo (máx. ${max} caracteres para tu plan).`,
    charsLeft: (left, max) => `${left} / ${max}`,

    freeRemainingLabel: (n) => `Te quedan ${n} mensaje${n > 1 ? "s" : ""} gratis.`,
    freeNudgeTitle3: "Vamos bien 🙂",
    freeNudgeText3: "Estás cerca del límite gratis. Si quieres continuidad y más profundidad, Plus es ideal.",
    freeNudgeTitle1: "Último mensaje gratis…",
    freeNudgeText1: "Si quieres seguir justo después, pásate a Plus para mantener la continuidad (y voz).",
    freeNudgeCta: "Seguir con Plus",
  },
};

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}
function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited" ? raw : "free";
}

/** ✅ Limites de longueur par plan (AJUSTE ICI) */
function maxCharsForPlan(plan: PlanId): number {
  switch (plan) {
    case "free":
      return 800;
    case "chat":
      return 1500;
    case "plus":
      return 2200;
    case "unlimited":
      return 3500;
    default:
      return 800;
  }
}

function clampText(s: string, max: number): string {
  if (!s) return "";
  return s.length > max ? s.slice(0, max) : s;
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

  const SHOW_BUBBLE_AVATAR = true;

  const [ai, setAi] = useState<AmoriaRow | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [sendError, setSendError] = useState<string | null>(null);

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

  // ✅ NEW: remaining quota (free)
  const [freeRemaining, setFreeRemaining] = useState<number | null>(null);
  const lastNudgeRef = useRef<"none" | "n3" | "n1">("none");

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

  const MAX_CHARS = useMemo(() => maxCharsForPlan(planId), [planId]);
  const charsLeft = useMemo(() => Math.max(0, MAX_CHARS - newMessage.length), [MAX_CHARS, newMessage.length]);

  // Avec maxLength + clamp, ça ne dépassera pas, mais on garde la sécurité.
  const isTooLong = useMemo(() => newMessage.length > MAX_CHARS, [newMessage.length, MAX_CHARS]);

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

  useEffect(() => {
    if (!iaId) router.replace(myAmoriaUrl);
  }, [iaId, router, myAmoriaUrl]);

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
          setFreeRemaining(null);
          return;
        }

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
        setFreeRemaining(null);
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
      setNewMessage(clampText(merged.trimStart(), MAX_CHARS));
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
  }, [canUseVoice, isBlocked, locale, newMessage, MAX_CHARS]);

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
    [canUseVoice, isBlocked, voiceEnabled, audioUnlocked, iaId, t.notAuthenticated, t.voiceLimitReached, t.voiceServerError, t.voiceNetworkError]
  );

  // ✅ NEW: afficher nudge selon remaining
  const nudge = useMemo(() => {
    if (!isFreePlan) return null;
    if (isBlocked) return null;
    if (freeRemaining == null) return null;
    if (freeRemaining <= 0) return null;

    if (freeRemaining === 1) {
      return { kind: "n1" as const, title: t.freeNudgeTitle1, text: t.freeNudgeText1 };
    }
    if (freeRemaining <= 3) {
      return { kind: "n3" as const, title: t.freeNudgeTitle3, text: t.freeNudgeText3 };
    }
    return null;
  }, [isFreePlan, isBlocked, freeRemaining, t.freeNudgeTitle1, t.freeNudgeText1, t.freeNudgeTitle3, t.freeNudgeText3]);

  // 6) Send message
  const sendMessage = useCallback(async () => {
    setSendError(null);

    if (sendingRef.current) return;
    if (!newMessage.trim() || !iaId || isBlocked) return;

    const trimmed = newMessage.trim();
    if (trimmed.length > MAX_CHARS) {
      setSendError(t.tooLong(MAX_CHARS));
      return;
    }

    sendingRef.current = true;
    setSending(true);

    if (isRecording) stopRecording();

    const content = trimmed;
    const baseId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const userMessage: ChatMessage = {
      id: `${baseId}-user`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

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

      // ✅ Bloquer proprement si quota atteint (status 429 ou erreur quota)
      const quotaHit =
        res.status === 429 ||
        data?.error === "quota_exceeded" ||
        data?.error === "text_quota_reached" ||
        data?.error === "free_limit_reached";

      if (!res.ok && isFreePlan && quotaHit) {
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

      // ✅ mettre à jour remaining si fourni par l’API
      if (isFreePlan && typeof data?.chat_remaining === "number") {
        const r = Math.max(0, Math.floor(data.chat_remaining));
        setFreeRemaining(r);

        // éviter de “spam” le nudge : on le montre une fois par seuil
        if (r === 1 && lastNudgeRef.current !== "n1") lastNudgeRef.current = "n1";
        else if (r <= 3 && lastNudgeRef.current === "none") lastNudgeRef.current = "n3";
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
      sendingRef.current = false;
      setSending(false);
    }
  }, [
    newMessage,
    iaId,
    isBlocked,
    MAX_CHARS,
    t,
    isRecording,
    stopRecording,
    locale,
    isFreePlan,
    t.notAuthenticated,
    t.profileNotFound,
    t.chatServerErrorPrefix,
    t.chatNetworkError,
    triggerAvatarAnimation,
    canUseVoice,
    voiceEnabled,
    audioUnlocked,
    playAssistantVoice,
    isFreePlan,
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
      if (sendingRef.current) return;
      void sendMessage();
    },
    [sendMessage]
  );

  const avatarRingClass = canPulseAvatar ? "avatarRing avatarRing--live" : "avatarRing";
  const showVideoNow = !!avatarImageUrl && canPlayAvatarVideo && !!avatarVideoUrl && avatarPlaying;

  if (!iaId) return <ChatSkeleton />;

  return (
    <main className="page">
      <header className="topbar">
        <a href={homeUrl} className="topbar__back">
          {t.backHome}
        </a>

        <div className="topbar__right">
          {!isFreePlan && (
            <Link href={myAmoriaUrl} className="topbar__pill">
              {t.myAmoria}
            </Link>
          )}

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

        {/* ✅ NEW: petite barre “remaining” (soft) */}
        {!isBlocked && isFreePlan && typeof freeRemaining === "number" && freeRemaining > 0 && (
          <div className={"remainBar" + (freeRemaining <= 3 ? " remainBar--hot" : "")}>
            <span className="remainBar__dot" aria-hidden="true" />
            <span className="remainBar__text">{t.freeRemainingLabel(freeRemaining)}</span>
            <button type="button" className="remainBar__cta" onClick={handleUpgradeClick}>
              {t.freeNudgeCta}
            </button>
          </div>
        )}

        <div className="chatBox" ref={windowRef} onScroll={handleWindowScroll}>
          {messages.length === 0 ? (
            <div className="empty">{t.emptyState(displayName)}</div>
          ) : (
            <ul className="list">
              {messages.map((m) => {
                const isUser = m.role === "user";
                const showTinyAvatar = SHOW_BUBBLE_AVATAR && !isUser && !!avatarImageUrl;

                return (
                  <li key={m.id} className={isUser ? "row row--user" : "row row--assistant"}>
                    {!isUser && (
                      <div className="row__left">
                        {showTinyAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className="msgAvatar" src={avatarImageUrl!} alt="" aria-hidden="true" />
                        ) : (
                          <span className="msgAvatar msgAvatar--fallback" aria-hidden="true">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}

                    <div className={isUser ? "bubble bubble--user" : "bubble bubble--assistant"}>
                      <div className="bubble__text">{m.content}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {sendError && <p className="error">{sendError}</p>}

        {/* ✅ NEW: NUDGE UI “Replika-like” quand <= 3 */}
        {!isBlocked && isFreePlan && nudge && (
          <div className="nudge">
            <div className="nudge__left">
              <p className="nudge__title">{nudge.title}</p>
              <p className="nudge__text">{nudge.text}</p>
            </div>
            <button type="button" className="pillBtn pillBtn--primary" onClick={handleUpgradeClick}>
              {t.freeNudgeCta}
            </button>
          </div>
        )}

        {/* Promo standard (quand free mais pas encore “hot”) */}
        {!isBlocked && isFreePlan && (!nudge || freeRemaining == null || freeRemaining > 3) && (
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
              onChange={(e) => {
                const next = clampText(e.target.value, MAX_CHARS);
                setNewMessage(next);
                if (sendError) setSendError(null);
              }}
              onKeyDown={handleComposerKeyDown}
              rows={1}
              maxLength={MAX_CHARS}
              disabled={isBlocked && isFreePlan}
            />
            <div className={"charCounter" + (charsLeft <= 30 ? " charCounter--warn" : "")}>{t.charsLeft(charsLeft, MAX_CHARS)}</div>
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
              disabled={sending || !newMessage.trim() || isTooLong || (isBlocked && isFreePlan)}
              aria-label={t.send}
              title={sending ? t.sending : t.send}
            >
              <span className="sendBtn__icon">➤</span>
            </button>
          </div>
        </form>

        <p className="note">{t.notePrivate}</p>

        <style jsx>{`
          .row {
            display: flex;
            align-items: flex-end;
            gap: 10px;
          }
          .row--user {
            justify-content: flex-end;
          }
          .row__left {
            width: 28px;
            flex: 0 0 28px;
            display: grid;
            place-items: center;
          }
          .msgAvatar {
            width: 26px;
            height: 26px;
            border-radius: 999px;
            object-fit: cover;
            border: 1px solid rgba(148, 163, 184, 0.25);
            background: rgba(2, 6, 23, 0.6);
          }
          .msgAvatar--fallback {
            display: grid;
            place-items: center;
            font-size: 12px;
            font-weight: 700;
            color: rgba(226, 232, 240, 0.9);
          }
          .composer__field {
            position: relative;
          }
          .charCounter {
            position: absolute;
            right: 10px;
            bottom: 8px;
            font-size: 12px;
            opacity: 0.85;
            color: rgba(148, 163, 184, 0.95);
            user-select: none;
          }
          .charCounter--warn {
            color: rgba(251, 113, 133, 0.95);
            font-weight: 700;
          }

          /* ✅ NEW: remaining bar */
          .remainBar {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0 12px;
            padding: 10px 12px;
            border-radius: 14px;
            border: 1px solid rgba(148, 163, 184, 0.22);
            background: rgba(2, 6, 23, 0.55);
            backdrop-filter: blur(10px);
          }
          .remainBar--hot {
            border-color: rgba(251, 113, 133, 0.35);
            box-shadow: 0 12px 40px rgba(15, 23, 42, 0.55);
          }
          .remainBar__dot {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: rgba(226, 232, 240, 0.9);
            opacity: 0.8;
          }
          .remainBar__text {
            flex: 1;
            font-size: 0.9rem;
            color: rgba(226, 232, 240, 0.92);
          }
          .remainBar__cta {
            border: 1px solid rgba(148, 163, 184, 0.22);
            background: rgba(30, 41, 59, 0.45);
            color: rgba(226, 232, 240, 0.95);
            padding: 8px 10px;
            border-radius: 999px;
            font-weight: 700;
            font-size: 0.85rem;
            cursor: pointer;
          }

          /* ✅ NEW: nudge */
          .nudge {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 10px;
            padding: 12px 12px;
            border-radius: 16px;
            border: 1px solid rgba(251, 113, 133, 0.28);
            background: rgba(2, 6, 23, 0.62);
            box-shadow: 0 18px 60px rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
          }
          .nudge__left {
            flex: 1;
            min-width: 0;
          }
          .nudge__title {
            margin: 0 0 4px;
            font-weight: 900;
            letter-spacing: 0.2px;
            color: rgba(226, 232, 240, 0.96);
          }
          .nudge__text {
            margin: 0;
            color: rgba(148, 163, 184, 0.98);
            font-size: 0.92rem;
            line-height: 1.25rem;
          }
        `}</style>
      </section>
    </main>
  );
                                 }
