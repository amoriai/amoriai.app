"use client";

import React, {
  FormEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { LogoutButton } from "../components/LogoutButton";
import { maxAmoriaForPlan, type PlanId } from "@/lib/plan";

// ✅ nouveau composant (Daypass + paywall)
import { PaywallDaypass } from "../components/PaywallDaypass";

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

  // ✅ Daypass 24h
  daypassTitle: string;
  daypassText: string;
  daypassCta: string;
  daypassAltCta: string;
  daypassLoading: string;

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

  freeRemainingLabel: (n: number) => string;
  freeNudgeTitle3: string;
  freeNudgeText3: string;
  freeNudgeTitle1: string;
  freeNudgeText1: string;
  freeNudgeCta: string;

  gentleHook: string;

  freeIpLimit: string;
};

const STRINGS: Record<Locale, UiCopy> = {
  fr: {
    backHome: "← Accueil",
    title: (name) => `Chat avec ${name}`,
    subtitle: (name) => `${name} est là. Tu peux parler librement, à ton rythme.`,
    emptyState: () => `Je suis là. Prends ton temps, je t'écoute.💬`,
    inputPlaceholder: (name) => `Écris à ${name}…`,

    send: "Envoyer",
    sending: "Envoi…",
    loading: "Ouverture du chat…",

    aiNotFoundTitle: "AmorIA introuvable",
    genericError:
      "Impossible d’ouvrir cette conversation pour le moment. Réessaie dans quelques secondes.",
    notAuthenticated:
      "Session introuvable. Actualise la page ou reconnecte-toi, puis réessaie.",
    profileNotFound:
      "Aucune AmorIA trouvée. Va dans « Mes AmorIAI » pour en créer une, puis reviens ici.",

    paywallTitle: "🔒 Limite atteinte pour ton accès gratuit.",
    paywallText: "Pour continuer (et débloquer la voix), passe à AmorIAI Plus.",
    paywallCta: "Passer à AmorIAI Plus",
    paywallSeePlans: "Voir les forfaits →",

    daypassTitle: "⏱️ Continuer maintenant",
    daypassText: "Débloque le chat pendant 24h (paiement unique).",
    daypassCta: "1,99$ — Pass 24h illimité",
    daypassAltCta: "Ou passer à Plus",
    daypassLoading: "Redirection vers paiement…",

    promoTitle: "Tu veux continuer ?",
    promoText:
      "Avec Plus, tu gardes le fil, tu as plus de messages et la voix de ton compagnon.",
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

    freeRemainingLabel: (n) =>
      `Il te reste ${n} message${n > 1 ? "s" : ""} gratuit${n > 1 ? "s" : ""}.`,
    freeNudgeTitle3: "On est bien partis 🙂",
    freeNudgeText3:
      "Il te reste peu de messages gratuits. Si tu veux qu’on garde le fil et qu’on approfondisse, Plus est idéal.",
    freeNudgeTitle1: "Dernier message gratuit…",
    freeNudgeText1:
      "Si tu veux continuer juste après, passe à Plus pour garder la continuité (et activer la voix).",
    freeNudgeCta: "Continuer avec Plus",

    gentleHook: "Je suis là, vraiment. Dis-moi ce qui te pèse le plus là, maintenant.",

    freeIpLimit: "Limite gratuite atteinte pour ce réseau. Réessaie plus tard ou passe à Plus.",
  },
  en: {
    backHome: "← Home",
    title: (name) => `Chat with ${name}`,
    subtitle: (name) => `${name} is here. Take your time.`,
    emptyState: () => `I'm here. Take your time, I'm listening.💬`,
    inputPlaceholder: (name) => `Write to ${name}…`,

    send: "Send",
    sending: "Sending…",
    loading: "Opening chat…",

    aiNotFoundTitle: "Companion not found",
    genericError: "We couldn’t open this conversation. Please try again.",
    notAuthenticated: "Session missing. Refresh or log in again, then retry.",
    profileNotFound:
      "No AmorIA found. Go to “My AmorIAI” to create one, then come back.",

    paywallTitle: "🔒 You’ve reached your free limit.",
    paywallText: "To continue (and unlock voice), upgrade to AmorIAI Plus.",
    paywallCta: "Upgrade to AmorIAI Plus",
    paywallSeePlans: "See plans →",

    daypassTitle: "⏱️ Continue now",
    daypassText: "Unlock chat for 24 hours (one-time payment).",
    daypassCta: "$1.99 — 24h Unlimited Pass",
    daypassAltCta: "Or upgrade to Plus",
    daypassLoading: "Redirecting to payment…",

    promoTitle: "Want to continue?",
    promoText: "Plus keeps the thread, gives you more messages, and unlocks voice.",
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
    freeNudgeText3:
      "You’re close to the free limit. If you want continuity and deeper chat, Plus is best.",
    freeNudgeTitle1: "Last free message…",
    freeNudgeText1:
      "If you want to continue right after, upgrade to Plus for continuity (and voice).",
    freeNudgeCta: "Continue with Plus",

    gentleHook: "I’m here with you. What’s the one thing you wish someone understood today?",

    freeIpLimit: "Free limit reached for this network. Try later or upgrade to Plus.",
  },
  es: {
    backHome: "← Inicio",
    title: (name) => `Chat con ${name}`,
    subtitle: (name) => `${name} está aquí. Tómate tu tiempo.`,
    emptyState: () => `Estoy aquí. Tómate tu tiempo, te escucho.💬`,
    inputPlaceholder: (name) => `Escribe a ${name}…`,

    send: "Enviar",
    sending: "Enviando…",
    loading: "Abriendo chat…",

    aiNotFoundTitle: "Compañero no encontrado",
    genericError: "No pudimos abrir la conversación. Intenta de nuevo.",
    notAuthenticated: "Sesión no encontrada. Actualiza o vuelve a iniciar sesión.",
    profileNotFound:
      "No se encontró ninguna AmorIA. Ve a “Mis AmorIAI” para crear una y vuelve aquí.",

    paywallTitle: "🔒 Has alcanzado tu límite gratuito.",
    paywallText: "Para continuar (y desbloquear la voz), pásate a AmorIAI Plus.",
    paywallCta: "Pasar a AmorIAI Plus",
    paywallSeePlans: "Ver planes →",

    daypassTitle: "⏱️ Continuar ahora",
    daypassText: "Desbloquea el chat por 24 horas (pago único).",
    daypassCta: "$1.99 — Pase ilimitado 24h",
    daypassAltCta: "O pasar a Plus",
    daypassLoading: "Redirigiendo al pago…",

    promoTitle: "¿Quieres continuar?",
    promoText: "Plus mantiene el hilo, te da más mensajes y desbloquea la voz.",
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
    freeNudgeText3:
      "Estás cerca del límite gratis. Si quieres continuidad y más profundidad, Plus es ideal.",
    freeNudgeTitle1: "Último mensaje gratis…",
    freeNudgeText1:
      "Si quieres seguir justo después, pásate a Plus para mantener la continuidad (y voz).",
    freeNudgeCta: "Seguir con Plus",

    gentleHook: "Estoy contigo. ¿Qué te gustaría soltar hoy, aunque sea un poquito?",

    freeIpLimit: "Límite gratuito alcanzado para esta red. Inténtalo más tarde o pásate a Plus.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}
function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited"
    ? raw
    : "free";
}
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
      <div className="chat-shell__loader" aria-label="Loading">
        <span className="chat-shell__dot" />
        <span className="chat-shell__dot" />
        <span className="chat-shell__dot" />
      </div>
      <p className="chat-shell__text">Chargement…</p>
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

  // ✅ Daypass state
  const [daypassActive, setDaypassActive] = useState(false);
  const [daypassLoading, setDaypassLoading] = useState(false);

  const [freeRemaining, setFreeRemaining] = useState<number | null>(null);

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
  const isTooLong = useMemo(
    () => newMessage.length > MAX_CHARS,
    [newMessage.length, MAX_CHARS]
  );

  const canCreate = useMemo(() => {
    if (planId === "free") return false;
    return activeAmoriaCount < maxAllowed;
  }, [planId, activeAmoriaCount, maxAllowed]);

  const displayName = useMemo(
    () => (ai?.name?.trim() || "AmorIAI").trim(),
    [ai?.name]
  );
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

  const handleUpgradeClick = useCallback(() => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", "plus");
    window.location.href = `/pricing?${params.toString()}`;
  }, [locale]);

  const startDaypassCheckout = useCallback(async () => {
    try {
      setSendError(null);
      setDaypassLoading(true);

      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "daypass24h", lang: locale }),
      });

      const data = await r.json().catch(() => ({} as any));
      if (!r.ok || !data?.url) {
        setDaypassLoading(false);
        setSendError(data?.error ?? "Erreur paiement.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setDaypassLoading(false);
      setSendError(t.chatNetworkError);
    }
  }, [locale, t.chatNetworkError]);

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

  // ... (tout ton code inchangé au-dessus)
  // ✅ IMPORTANT : tu gardes tout pareil, et tu ajoutes juste le composant paywall dans le return plus bas

  // ---------- NUDGE (free only) ----------
  const nudge = useMemo(() => {
    if (!isFreePlan) return null;
    if (isBlocked) return null;
    if (daypassActive) return null;
    if (freeRemaining == null) return null;
    if (freeRemaining <= 0) return null;

    if (freeRemaining === 1) {
      return { kind: "n1" as const, title: t.freeNudgeTitle1, text: t.freeNudgeText1 };
    }
    if (freeRemaining <= 3) {
      return { kind: "n3" as const, title: t.freeNudgeTitle3, text: t.freeNudgeText3 };
    }
    return null;
  }, [isFreePlan, isBlocked, daypassActive, freeRemaining, t]);

  const showRemainBar = useMemo(() => {
    return (
      !isBlocked &&
      !daypassActive &&
      isFreePlan &&
      typeof freeRemaining === "number" &&
      freeRemaining > 0 &&
      !nudge
    );
  }, [isBlocked, daypassActive, isFreePlan, freeRemaining, nudge]);

  // ✅ paywall visible quand bloqué + free + pas daypass
  const showPaywall = useMemo(() => {
    return isBlocked && isFreePlan && !daypassActive;
  }, [isBlocked, isFreePlan, daypassActive]);

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
        {/* ... ton hero inchangé ... */}

        {showRemainBar && (
          <div className={"remainBar" + (freeRemaining! <= 3 ? " remainBar--hot" : "")}>
            <span className="remainBar__dot" aria-hidden="true" />
            <span className="remainBar__text">{t.freeRemainingLabel(freeRemaining!)}</span>
          </div>
        )}

        <div className="chatBox" ref={windowRef}>
          {/* ... tes messages inchangés ... */}
        </div>

        {/* ✅ PAYWALL (Daypass 24h inclus) — PLUS DE JSX ICI */}
        {showPaywall && (
          <PaywallDaypass
            title={t.paywallTitle}
            text={t.paywallText}
            daypassTitle={t.daypassTitle}
            daypassText={t.daypassText}
            daypassCta={t.daypassCta}
            daypassAltCta={t.daypassAltCta}
            daypassLoading={t.daypassLoading}
            plusCta={t.paywallCta}
            seePlansLabel={t.paywallSeePlans}
            pricingUrl={pricingUrl}
            isLoadingDaypass={daypassLoading}
            onDaypass={startDaypassCheckout}
            onPlus={handleUpgradeClick}
          />
        )}

        {/* ✅ composer (garde ton JSX existant ici, inchangé) */}
        <form className="composer" onSubmit={handleSubmit}>
  <textarea
    ref={composerRef}
    className="composer__input"
    placeholder={t.inputPlaceholder(displayName)}
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    onKeyDown={handleComposerKeyDown}
    aria-label="Message"
  />

  <div className="composer__actions">
    {canUseVoice && sttSupported && !(isBlocked && !daypassActive) && (
      <button
        type="button"
        className="pillBtn pillBtn--ghost"
        onClick={handleToggleRecording}
        disabled={sending}
      >
        {isRecording ? t.sttStop : t.sttStart}
      </button>
    )}

    <button
      type="submit"
      className="pillBtn pillBtn--primary"
      disabled={sending || !newMessage.trim() || isTooLong || (isBlocked && !daypassActive)}
    >
      {sending ? t.sending : t.send}
    </button>
  </div>

  <div className="composer__meta">
    <span className={isTooLong ? "meta meta--err" : "meta"}>
      {t.charsLeft(Math.min(newMessage.length, MAX_CHARS), MAX_CHARS)}
    </span>
    <span className="meta meta--muted">{t.notePrivate}</span>
  </div>

  {sendError && <div className="errorLine">{sendError}</div>}
</form>

      </section>
    </main>
  );
}

