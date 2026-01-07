// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlanCode = "free" | "chat" | "plus" | "unlimited";
type Lang = "fr" | "en" | "es";

const FREE_LIFETIME_QUOTA = 15;

const MAX_CHARS_BY_PLAN: Record<PlanCode, number> = {
  free: 800,
  chat: 1500,
  plus: 2200,
  unlimited: 3500,
};

function normalizePlanCode(raw: unknown): PlanCode {
  const v = String(raw ?? "").toLowerCase();
  if (v === "chat" || v === "plus" || v === "unlimited") return v;
  return "free";
}

function normalizeLang(raw: unknown): Lang {
  const v = String(raw ?? "").toLowerCase();
  if (v === "en" || v === "es" || v === "fr") return v;
  return "fr";
}

const I18N = {
  quotaExceededPaid: {
    fr: "Tu as atteint la limite de messages pour ce mois-ci. Réessaie le mois prochain ou upgrade ton forfait.",
    en: "You’ve reached your monthly message limit. Try again next month or upgrade your plan.",
    es: "Has alcanzado tu límite mensual de mensajes. Inténtalo el próximo mes o mejora tu plan.",
  },
  quotaExceededFree: {
    fr: `Tu as atteint la limite gratuite (${FREE_LIFETIME_QUOTA} messages). Crée un abonnement pour continuer.`,
    en: `You’ve reached the free limit (${FREE_LIFETIME_QUOTA} messages). Subscribe to continue.`,
    es: `Has alcanzado el límite gratis (${FREE_LIFETIME_QUOTA} mensajes). Suscríbete para continuar.`,
  },
  voiceQuotaExceeded: {
    fr: "Tu as atteint la limite de voix pour ce mois-ci. Le texte reste disponible.",
    en: "You’ve reached your monthly voice limit. Text is still available.",
    es: "Has alcanzado tu límite mensual de voz. El texto sigue disponible.",
  },
  tooLong: {
    fr: (max: number) => `Ton message est trop long (max ${max} caractères pour ton forfait).`,
    en: (max: number) => `Your message is too long (max ${max} characters for your plan).`,
    es: (max: number) => `Tu mensaje es demasiado largo (máx. ${max} caracteres para tu plan).`,
  },
  fallbackReply: {
    fr: "Je ne sais pas.",
    en: "I don’t know.",
    es: "No lo sé.",
  },
  missingIaId: { fr: "missing_iaId", en: "missing_iaId", es: "missing_iaId" },
  missingMessage: { fr: "missing_message", en: "missing_message", es: "missing_message" },
} as const;

function hasBearer(authHeader: string) {
  return /^Bearer\s+.+$/i.test((authHeader ?? "").trim());
}

function jsonError(status: number, payload: Record<string, any>) {
  return NextResponse.json(payload, { status });
}

async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs: number) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(t);
  }
}

function buildStyleGuide(lang: Lang) {
  if (lang === "fr") {
    return [
      "Style: naturel, chaleureux, intime, sans être thérapeute.",
      "Réponses courtes (2–6 phrases).",
      "1 question à la fois.",
      "Reformule une phrase importante du message de l’utilisateur.",
      "Évite les listes longues et les avertissements inutiles.",
      "Pas de mention du quota ni d’abonnement dans la réponse.",
    ].join(" ");
  }
  if (lang === "en") {
    return [
      "Style: natural, warm, intimate (not clinical).",
      "Short replies (2–6 sentences).",
      "Ask one question at a time.",
      "Mirror one important user sentence.",
      "Avoid long lists and unnecessary warnings.",
      "Never mention quota/subscription inside the reply.",
    ].join(" ");
  }
  return [
    "Estilo: natural, cálido, íntimo (no clínico).",
    "Respuestas cortas (2–6 frases).",
    "Una pregunta a la vez.",
    "Refleja una frase importante del usuario.",
    "Evita listas largas y avisos innecesarios.",
    "Nunca menciones cuota/suscripción dentro de la respuesta.",
  ].join(" ");
}

function buildLanguageLock(lang: Lang) {
  if (lang === "fr")
    return "RÈGLE ABSOLUE : réponds UNIQUEMENT en français. Ne change jamais de langue, même si l’utilisateur écrit en anglais ou en espagnol.";
  if (lang === "en")
    return "ABSOLUTE RULE: reply ONLY in English. Never switch language, even if the user writes in French or Spanish.";
  return "REGLA ABSOLUTA: responde SOLO en español. No cambies de idioma, incluso si el usuario escribe en francés o en inglés.";
}

function buildQuotaBanner(lang: Lang, remaining: number) {
  if (lang === "fr") {
    if (remaining <= 0) return null;
    if (remaining === 1) return "Il te reste 1 message gratuit.";
    if (remaining <= 3) return `Il te reste ${remaining} messages gratuits.`;
    return null;
  }
  if (lang === "en") {
    if (remaining <= 0) return null;
    if (remaining === 1) return "You have 1 free message left.";
    if (remaining <= 3) return `You have ${remaining} free messages left.`;
    return null;
  }
  if (remaining <= 0) return null;
  if (remaining === 1) return "Te queda 1 mensaje gratis.";
  if (remaining <= 3) return `Te quedan ${remaining} mensajes gratis.`;
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { iaId, message, lang, withAudio } = body as {
      iaId?: string;
      message?: string;
      lang?: Lang;
      withAudio?: boolean;
    };

    const safeLang = normalizeLang(lang);

    if (!iaId) return jsonError(400, { error: I18N.missingIaId[safeLang] });

    const rawMessage = typeof message === "string" ? message : "";
    const trimmedMessage = rawMessage.trim();
    if (!trimmedMessage) return jsonError(400, { error: I18N.missingMessage[safeLang] });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error("Missing Supabase env vars");
      return jsonError(500, { error: "supabase_env_missing" });
    }
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return jsonError(500, { error: "missing_openai_key" });
    }

    const authHeader = req.headers.get("authorization") ?? "";
    if (!hasBearer(authHeader)) {
      return jsonError(401, { error: "missing_or_invalid_authorization" });
    }

    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      console.error("auth.getUser error:", userError);
      return jsonError(401, { error: "not_authenticated" });
    }

    const userId = user.id;

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data: iaRow, error: iaError } = await supabaseAdmin
      .from("user_amoria")
      .select("id, user_id, name, system_prompt, voice_id, is_archived")
      .eq("id", iaId)
      .eq("user_id", userId)
      .single();

    if (iaError || !iaRow) {
      console.error("IA row error:", iaError);
      return jsonError(404, { error: "ia_not_found" });
    }
    if (iaRow.is_archived === true) {
      return jsonError(403, { error: "ia_archived" });
    }

    let planCode: PlanCode = "free";
    let planName = "Free";

    let hasVoiceFromPlan = false;
    let voiceLimitFromPlan = 0;
    let messageLimitFromPlan = 0;

    const { data: subscription, error: subErr } = await supabaseAdmin
      .from("user_subscriptions")
      .select("pricing_plan_id, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (subErr) console.error("subscription error:", subErr);

    if (subscription?.pricing_plan_id) {
      const { data: plan, error: planError } = await supabaseAdmin
        .from("pricing_plans")
        .select("code, name, message_limit, has_voice, voice_limit")
        .eq("id", subscription.pricing_plan_id)
        .single();

      if (!planError && plan) {
        planCode = normalizePlanCode((plan as any).code);
        planName = (plan as any).name ?? planName;

        messageLimitFromPlan = Number((plan as any).message_limit ?? 0);
        hasVoiceFromPlan = !!(plan as any).has_voice;
        voiceLimitFromPlan = Number((plan as any).voice_limit ?? 0);
      } else {
        if (planError) console.error("planError:", planError);
      }
    }

    const maxChars = MAX_CHARS_BY_PLAN[planCode] ?? 800;
    if (trimmedMessage.length > maxChars) {
      return NextResponse.json(
        {
          error: "message_too_long",
          maxChars,
          message: I18N.tooLong[safeLang](maxChars),
          planCode,
          planName,
        },
        { status: 413 }
      );
    }

    const canStoreHistory = planCode !== "free";

    const defaultSystemPromptFr =
      "Tu es une IA de compagnie bienveillante et chaleureuse. Tu réponds avec un ton naturel, doux et empathique.";
    const defaultSystemPromptEn =
      "You are a caring, warm AI companion. Answer with a natural, friendly, empathetic tone.";
    const defaultSystemPromptEs =
      "Eres una IA compañera cálida y cariñosa. Responde con un tono natural y empático.";

    const defaultSystemPrompt =
      safeLang === "en" ? defaultSystemPromptEn : safeLang === "es" ? defaultSystemPromptEs : defaultSystemPromptFr;

    const personaPrompt = (iaRow.system_prompt?.trim() || defaultSystemPrompt).trim();
    const languageLock = buildLanguageLock(safeLang);
    const styleGuide = buildStyleGuide(safeLang);

    const chatRes = await fetchWithTimeout(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            { role: "system", content: personaPrompt },
            { role: "system", content: languageLock },
            { role: "system", content: styleGuide },
            { role: "user", content: trimmedMessage },
          ],
          temperature: 0.85,
        }),
      },
      25_000
    );

    if (!chatRes.ok) {
      const errText = await chatRes.text().catch(() => "");
      console.error("OpenAI chat error:", errText);
      return jsonError(500, { error: "openai_api_error" });
    }

    const chatData = await chatRes.json().catch(() => ({} as any));
    const replyText: string = chatData?.choices?.[0]?.message?.content?.trim() || I18N.fallbackReply[safeLang];

    let chatQuotaType: "lifetime" | "monthly" = "monthly";
    let chatQuota = 0;
    let chatUsage: any = null;

    if (planCode === "free") {
      chatQuotaType = "lifetime";
      chatQuota = FREE_LIFETIME_QUOTA;

      const { data, error } = await supabaseAuth.rpc("consume_free_message_once", {
        quota: FREE_LIFETIME_QUOTA,
      });

      if (error) {
        console.error("consume_free_message_once error:", error);
        return jsonError(500, { error: "quota_check_failed" });
      }

      chatUsage = data;

      if (!chatUsage?.ok) {
        return NextResponse.json(
          {
            error: "quota_exceeded",
            planName,
            planCode,
            details: chatUsage,
            message: I18N.quotaExceededFree[safeLang],
          },
          { status: 429 }
        );
      }
    } else {
      chatQuotaType = "monthly";
      chatQuota = Math.max(0, messageLimitFromPlan);

      const { data, error } = await supabaseAuth.rpc("consume_monthly_message", {
        quota: chatQuota,
      });

      if (error) {
        console.error("consume_monthly_message error:", error);
        return jsonError(500, { error: "quota_check_failed" });
      }

      chatUsage = data;

      if (!chatUsage?.ok) {
        return NextResponse.json(
          {
            error: "quota_exceeded",
            planName,
            planCode,
            details: chatUsage,
            message: I18N.quotaExceededPaid[safeLang],
          },
          { status: 429 }
        );
      }
    }

    const remainingAfter = typeof chatUsage?.remaining === "number" ? chatUsage.remaining : null;

    if (canStoreHistory) {
      const { error: saveUserMsgErr } = await supabaseAuth.from("chat_messages").insert({
        user_id: userId,
        amoria_id: iaRow.id,
        role: "user",
        content: trimmedMessage,
      });
      if (saveUserMsgErr) console.error("save user message error:", saveUserMsgErr);

      const { error: saveAsstMsgErr } = await supabaseAuth.from("chat_messages").insert({
        user_id: userId,
        amoria_id: iaRow.id,
        role: "assistant",
        content: replyText,
      });
      if (saveAsstMsgErr) console.error("save assistant message error:", saveAsstMsgErr);
    }

    const allowAudioRequested = !!withAudio;
    const allowAudioByPlan = hasVoiceFromPlan && voiceLimitFromPlan > 0;
    const allowAudio = allowAudioRequested && allowAudioByPlan;

    let audioBase64: string | null = null;
    let audioMimeType: string | null = null;

    let voiceUsage: any = null;
    let voiceBlockedReason: string | null = null;

    if (allowAudio) {
      const { data: vUsage, error: vErr } = await supabaseAuth.rpc("consume_monthly_voice", {
        quota: voiceLimitFromPlan,
      });

      if (vErr) {
        console.error("consume_monthly_voice error:", vErr);
        voiceBlockedReason = "voice_quota_check_failed";
      } else if (!vUsage?.ok) {
        voiceUsage = vUsage;
        voiceBlockedReason = "voice_quota_exceeded";
      } else {
        voiceUsage = vUsage;

        try {
          const voice = iaRow.voice_id || "alloy";

          const ttsRes = await fetchWithTimeout(
            "https://api.openai.com/v1/audio/speech",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "tts-1",
                voice,
                input: replyText,
                format: "mp3",
              }),
            },
            25_000
          );

          if (!ttsRes.ok) {
            const ttsErr = await ttsRes.text().catch(() => "");
            console.error("OpenAI TTS error:", ttsErr);
            voiceBlockedReason = "openai_tts_error";
          } else {
            const audioBuffer = await ttsRes.arrayBuffer();
            // @ts-ignore
            audioBase64 = Buffer.from(audioBuffer).toString("base64");
            audioMimeType = "audio/mpeg";
          }
        } catch (e) {
          console.error("TTS generation error:", e);
          voiceBlockedReason = "tts_exception";
        }
      }
    }

    const voiceWarning = voiceBlockedReason === "voice_quota_exceeded" ? I18N.voiceQuotaExceeded[safeLang] : null;

    const quotaBanner =
      planCode === "free" && typeof remainingAfter === "number" ? buildQuotaBanner(safeLang, remainingAfter) : null;

    return NextResponse.json({
      reply: replyText,

      quota_banner: quotaBanner,
      show_paywall_hint: planCode === "free" && typeof remainingAfter === "number" && remainingAfter <= 1,

      audioBase64,
      audioMimeType,

      planName,
      planCode,

      iaId: iaRow.id,
      iaName: iaRow.name,

      chat_quota_type: chatQuotaType,
      chat_quota: planCode === "free" ? FREE_LIFETIME_QUOTA : chatQuota,
      chat_remaining: remainingAfter,

      voice_quota_per_month: allowAudioByPlan ? voiceLimitFromPlan : 0,
      voice_remaining_this_month: voiceUsage?.remaining ?? null,
      voice_warning: voiceWarning,
      voice_blocked_reason: voiceBlockedReason,

      history_enabled: canStoreHistory,
      lang: safeLang,

      max_chars: maxChars,
    });
  } catch (e) {
    console.error("Server error in /api/chat:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
      }
