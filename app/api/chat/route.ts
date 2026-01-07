// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ===========================
   QUOTAS
   - Paid: par mois (message_limit dans pricing_plans)
   - Free: 15 une seule fois (lifetime)
   IMPORTANT: on consomme le quota SEULEMENT après succès OpenAI
   + On avertit AVANT la fin (ex: 5/3/1 messages restants)
=========================== */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlanCode = "free" | "chat" | "plus" | "unlimited";
type Lang = "fr" | "en" | "es";

const FREE_LIFETIME_QUOTA = 15;

// ✅ Limite de longueur par plan (AJUSTE ICI)
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

  // ✅ Messages “avant fin quota” (style compagnon, sans agressivité)
  quotaSoon: {
    fr: (remaining: number) =>
      `\n\n💫 Juste pour te le dire : il nous reste encore ${remaining} message${remaining === 1 ? "" : "s"} gratuits.`,
    en: (remaining: number) =>
      `\n\n💫 Just so you know: you have ${remaining} free message${remaining === 1 ? "" : "s"} left.`,
    es: (remaining: number) =>
      `\n\n💫 Solo para avisarte: te quedan ${remaining} mensaje${remaining === 1 ? "" : "s"} gratis.`,
  },
  quotaBridge: {
    fr:
      "\n\nSi tu veux qu’on continue sans perdre le fil et qu’on approfondisse vraiment, un abonnement te permet de poursuivre ici.",
    en:
      "\n\nIf you want to continue without losing the thread and go deeper, a subscription lets us keep going here.",
    es:
      "\n\nSi quieres seguir sin perder el hilo y profundizar, una suscripción nos permite continuar aquí.",
  },
  quotaLast: {
    fr:
      "\n\nAvant qu’on arrive à la fin… si cette conversation t’aide, un abonnement me permet de rester avec toi ici et de garder le fil.",
    en:
      "\n\nBefore we hit the end… if this helps you, a subscription lets me stay here with you and keep the thread.",
    es:
      "\n\nAntes de llegar al final… si esto te ayuda, una suscripción me permite quedarme contigo aquí y mantener el hilo.",
  },
} as const;

function hasBearer(authHeader: string) {
  return /^Bearer\s+.+$/i.test((authHeader ?? "").trim());
}

function jsonError(_safeLang: Lang, status: number, payload: Record<string, any>) {
  return NextResponse.json(payload, { status });
}

// Petit helper timeout fetch
async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs: number) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { iaId, message, lang, withAudio } = body as {
      iaId?: string;
      message?: string;
      lang?: Lang;
      withAudio?: boolean; // optionnel (si tu veux renvoyer audio direct). Sinon /api/voice séparé.
    };

    const safeLang = normalizeLang(lang);

    if (!iaId) return jsonError(safeLang, 400, { error: I18N.missingIaId[safeLang] });

    const rawMessage = typeof message === "string" ? message : "";
    const trimmedMessage = rawMessage.trim();
    if (!trimmedMessage) return jsonError(safeLang, 400, { error: I18N.missingMessage[safeLang] });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error("Missing Supabase env vars");
      return NextResponse.json({ error: "supabase_env_missing" }, { status: 500 });
    }
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json({ error: "missing_openai_key" }, { status: 500 });
    }

    /* ===========================
       1) Auth user via JWT du front
    =========================== */
    const authHeader = req.headers.get("authorization") ?? "";
    if (!hasBearer(authHeader)) {
      return NextResponse.json({ error: "missing_or_invalid_authorization" }, { status: 401 });
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
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    const userId = user.id;

    /* ===========================
       2) Admin client (lecture des plans, vérif IA)
    =========================== */
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
      return NextResponse.json({ error: "ia_not_found" }, { status: 404 });
    }

    if (iaRow.is_archived === true) {
      return NextResponse.json({ error: "ia_archived" }, { status: 403 });
    }

    /* ===========================
       3) Lire abonnement & plan (active sinon free)
    =========================== */
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
        planCode = "free";
        planName = "Free";
        messageLimitFromPlan = 0;
        hasVoiceFromPlan = false;
        voiceLimitFromPlan = 0;
      }
    }

    // ✅ longueur max selon plan
    const maxChars = MAX_CHARS_BY_PLAN[planCode] ?? 800;
    if (trimmedMessage.length > maxChars) {
      return NextResponse.json(
        { error: "message_too_long", maxChars, message: I18N.tooLong[safeLang](maxChars), planCode, planName },
        { status: 413 }
      );
    }

    // Historique PAYANT seulement
    const canStoreHistory = planCode !== "free";

    /* ===========================
       4) SYSTEM PROMPT + verrou langue
    =========================== */
    const defaultSystemPromptFr =
      "Tu es une IA de compagnie bienveillante et chaleureuse. Tu réponds avec un ton naturel, doux et empathique.";
    const defaultSystemPromptEn =
      "You are a caring, warm AI companion. Answer with a natural, friendly, empathetic tone.";
    const defaultSystemPromptEs =
      "Eres una IA compañera cálida y cariñosa. Responde con un tono natural y empático.";

    let defaultSystemPrompt = defaultSystemPromptFr;
    if (safeLang === "en") defaultSystemPrompt = defaultSystemPromptEn;
    if (safeLang === "es") defaultSystemPrompt = defaultSystemPromptEs;

    const personaPrompt = (iaRow.system_prompt?.trim() || defaultSystemPrompt).trim();

    const languageLock =
      safeLang === "fr"
        ? "RÈGLE ABSOLUE : réponds UNIQUEMENT en français. Ne change jamais de langue, même si l’utilisateur écrit en anglais ou en espagnol."
        : safeLang === "en"
        ? "ABSOLUTE RULE: reply ONLY in English. Never switch language, even if the user writes in French or Spanish."
        : "REGLA ABSOLUTA: responde SOLO en español. No cambies de idioma, incluso si el usuario escribe en francés o en inglés.";

    /* ===========================
       5) Appel OpenAI – texte (timeout)
       IMPORTANT: on ne consomme le quota qu'après succès
    =========================== */
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
            { role: "user", content: trimmedMessage },
          ],
          temperature: 0.8,
        }),
      },
      25_000
    );

    if (!chatRes.ok) {
      const errText = await chatRes.text().catch(() => "");
      console.error("OpenAI chat error:", errText);
      return NextResponse.json({ error: "openai_api_error" }, { status: 500 });
    }

    const chatData = await chatRes.json().catch(() => ({} as any));
    let text: string = chatData?.choices?.[0]?.message?.content?.trim() || I18N.fallbackReply[safeLang];

    /* ===========================
       6) QUOTA CHAT (consommer APRÈS succès OpenAI)
       - Free: lifetime -> RPC consume_free_message_once(quota)
       - Paid: monthly -> RPC consume_monthly_message(quota = pricing_plans.message_limit)
    =========================== */
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
        return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
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
        return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
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

    // ✅ Avertir AVANT la fin du quota (FREE)
    const remainingAfter = typeof chatUsage?.remaining === "number" ? chatUsage.remaining : null;

    if (planCode === "free" && remainingAfter !== null) {
      if (remainingAfter === 5 || remainingAfter === 4) {
        text = `${text}${I18N.quotaSoon[safeLang](remainingAfter)}`;
      }
      if (remainingAfter === 3 || remainingAfter === 2) {
        text = `${text}${I18N.quotaSoon[safeLang](remainingAfter)}${I18N.quotaBridge[safeLang]}`;
      }
      if (remainingAfter === 1) {
        text = `${text}${I18N.quotaSoon[safeLang](remainingAfter)}${I18N.quotaLast[safeLang]}`;
      }
    }

    /* ===========================
       7) Sauver messages (PAYANT seulement)
    =========================== */
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
        content: text,
      });
      if (saveAsstMsgErr) console.error("save assistant message error:", saveAsstMsgErr);
    }

    /* ===========================
       8) Audio optionnel
       IMPORTANT: ton front utilise /api/voice séparé,
       donc withAudio sera généralement false.
    =========================== */
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
                input: text,
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
            // @ts-ignore Buffer dispo en runtime Node
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

    /* ===========================
       9) Réponse
    =========================== */
    return NextResponse.json({
      reply: text,

      // audio (optionnel)
      audioBase64,
      audioMimeType,

      // meta plan
      planName,
      planCode,

      // ia
      iaId: iaRow.id,
      iaName: iaRow.name,

      // quotas (chat)
      chat_quota_type: chatQuotaType,
      chat_quota: planCode === "free" ? FREE_LIFETIME_QUOTA : chatQuota,
      chat_remaining: chatUsage?.remaining ?? null,

      // quotas (voice)
      voice_quota_per_month: allowAudioByPlan ? voiceLimitFromPlan : 0,
      voice_remaining_this_month: voiceUsage?.remaining ?? null,
      voice_warning: voiceWarning,
      voice_blocked_reason: voiceBlockedReason,

      // history
      history_enabled: canStoreHistory,

      // lang
      lang: safeLang,

      // debug utile
      max_chars: maxChars,
    });
  } catch (e) {
    console.error("Server error in /api/chat:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
