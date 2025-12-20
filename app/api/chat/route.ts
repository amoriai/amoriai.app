import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ===========================
   QUOTAS (PAR MOIS)
=========================== */

type PlanCode = "free" | "chat" | "plus" | "unlimited";

function quotaFor(plan: PlanCode) {
  // Limites MENSUELLES chat (messages/mois)
  switch (plan) {
    case "chat":
      return 400;
    case "plus":
      return 1000;
    case "unlimited":
      return 10000;
    default:
      return 200; // free
  }
}

function normalizePlanCode(raw: unknown): PlanCode {
  const v = String(raw ?? "").toLowerCase();
  if (v === "chat" || v === "plus" || v === "unlimited") return v;
  return "free";
}

type Lang = "fr" | "en" | "es";

function normalizeLang(raw: unknown): Lang {
  const v = String(raw ?? "").toLowerCase();
  if (v === "en" || v === "es" || v === "fr") return v;
  return "fr";
}

const I18N = {
  quotaExceeded: {
    fr: "Tu as atteint la limite de messages pour ce mois-ci. Réessaie le mois prochain ou upgrade ton forfait.",
    en: "You’ve reached your monthly message limit. Try again next month or upgrade your plan.",
    es: "Has alcanzado tu límite mensual de mensajes. Inténtalo el próximo mes o mejora tu plan.",
  },
  voiceQuotaExceeded: {
    fr: "Tu as atteint la limite de voix pour ce mois-ci. Le texte reste disponible.",
    en: "You’ve reached your monthly voice limit. Text is still available.",
    es: "Has alcanzado tu límite mensual de voz. El texto sigue disponible.",
  },
  fallbackReply: {
    fr: "Je ne sais pas.",
    en: "I don’t know.",
    es: "No lo sé.",
  },
  missingIaId: {
    fr: "missing_iaId",
    en: "missing_iaId",
    es: "missing_iaId",
  },
  missingMessage: {
    fr: "missing_message",
    en: "missing_message",
    es: "missing_message",
  },
} as const;

function hasBearer(authHeader: string) {
  return /^Bearer\s+.+$/i.test(authHeader.trim());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { iaId, message, lang, withAudio } = body as {
      iaId?: string;
      message?: string;
      lang?: Lang;
      withAudio?: boolean;
    };

    const safeLang = normalizeLang(lang);

    if (!iaId) return NextResponse.json({ error: I18N.missingIaId[safeLang] }, { status: 400 });
    if (!message || !message.trim()) {
      return NextResponse.json({ error: I18N.missingMessage[safeLang] }, { status: 400 });
    }

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
       ⚠️ service role bypass RLS: on filtre strictement par user_id
    =========================== */
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

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
        .select("code, name, has_voice, voice_limit")
        .eq("id", subscription.pricing_plan_id)
        .single();

      if (!planError && plan) {
        planCode = normalizePlanCode(plan.code);
        planName = plan.name ?? planName;
        hasVoiceFromPlan = !!plan.has_voice;
        voiceLimitFromPlan = plan.voice_limit ?? 0;
      } else {
        if (planError) console.error("planError:", planError);
        planCode = "free";
        planName = "Free";
      }
    }

    // Historique PAYANT seulement (note: si tu veux l’imposer vraiment, ça doit aussi être dans RLS)
    const canStoreHistory = planCode !== "free";

    /* ===========================
       4) Quota MENSUEL CHAT (RPC avec JWT)
       RPC attendu: consume_monthly_message(quota int)
       Retour attendu: { ok: boolean, remaining: int, ... }
    =========================== */
    const chatQuota = quotaFor(planCode);

    const { data: chatUsage, error: chatUsageErr } = await supabaseAuth.rpc(
      "consume_monthly_message",
      { quota: chatQuota }
    );

    if (chatUsageErr) {
      console.error("consume_monthly_message error:", chatUsageErr);
      return NextResponse.json({ error: "quota_check_failed" }, { status: 500 });
    }

    if (!chatUsage?.ok) {
      return NextResponse.json(
        {
          error: "quota_exceeded",
          planName,
          planCode,
          details: chatUsage,
          message: I18N.quotaExceeded[safeLang],
        },
        { status: 429 }
      );
    }

    /* ===========================
       5) System prompt + verrou de langue
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
       6) Sauver le message user (PAYANT seulement)
    =========================== */
    if (canStoreHistory) {
      const { error: saveUserMsgErr } = await supabaseAuth.from("chat_messages").insert({
        user_id: userId,
        amoria_id: iaRow.id,
        role: "user",
        content: message.trim(),
      });

      if (saveUserMsgErr) console.error("save user message error:", saveUserMsgErr);
    }

    /* ===========================
       7) Appel OpenAI – texte
    =========================== */
    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
          { role: "user", content: message.trim() },
        ],
      }),
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text();
      console.error("OpenAI chat error:", errText);
      return NextResponse.json({ error: "openai_api_error" }, { status: 500 });
    }

    const chatData = await chatRes.json();
    const text: string =
      chatData?.choices?.[0]?.message?.content?.trim() || I18N.fallbackReply[safeLang];

    /* ===========================
       8) Sauver la réponse assistant (PAYANT seulement)
    =========================== */
    if (canStoreHistory) {
      const { error: saveAsstMsgErr } = await supabaseAuth.from("chat_messages").insert({
        user_id: userId,
        amoria_id: iaRow.id,
        role: "assistant",
        content: text,
      });

      if (saveAsstMsgErr) console.error("save assistant message error:", saveAsstMsgErr);
    }

    /* ===========================
       9) Voix optionnelle (selon plan) + QUOTA MENSUEL VOICE (RPC)
       RPC attendu: consume_monthly_voice(quota int)
       Retour attendu: { ok: boolean, remaining: int, ... }
    =========================== */
    const allowAudioRequested = !!withAudio;
    const allowAudioByPlan = hasVoiceFromPlan && voiceLimitFromPlan > 0;
    const allowAudio = allowAudioRequested && allowAudioByPlan;

    let audioBase64: string | null = null;
    let audioMimeType: string | null = null;

    let voiceUsage: any = null;
    let voiceBlockedReason: string | null = null;

    if (allowAudio) {
      // 9.1) Consommer quota mensuel voice AVANT de générer l’audio
      const { data: vUsage, error: vErr } = await supabaseAuth.rpc("consume_monthly_voice", {
        quota: voiceLimitFromPlan,
      });

      if (vErr) {
        console.error("consume_monthly_voice error:", vErr);
        // Ici je bloque l’audio mais je renvoie le texte
        voiceBlockedReason = "voice_quota_check_failed";
      } else if (!vUsage?.ok) {
        // Quota voix dépassé: on renvoie texte sans audio
        voiceUsage = vUsage;
        voiceBlockedReason = "voice_quota_exceeded";
      } else {
        voiceUsage = vUsage;

        // 9.2) Génération TTS
        try {
          const voice = iaRow.voice_id || "alloy";

          const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
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
          });

          if (!ttsRes.ok) {
            const ttsErr = await ttsRes.text();
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

    const voiceWarning =
      voiceBlockedReason === "voice_quota_exceeded" ? I18N.voiceQuotaExceeded[safeLang] : null;

    /* ===========================
       10) Réponse
    =========================== */
    return NextResponse.json({
      reply: text,

      // audio
      audioBase64,
      audioMimeType,

      // meta plan
      planName,
      planCode,

      // ia
      iaId: iaRow.id,
      iaName: iaRow.name,

      // quotas
      chat_quota_per_month: chatQuota,
      chat_remaining_this_month: chatUsage?.remaining ?? null,

      voice_quota_per_month: allowAudioByPlan ? voiceLimitFromPlan : 0,
      voice_remaining_this_month: voiceUsage?.remaining ?? null,
      voice_warning: voiceWarning,
      voice_blocked_reason: voiceBlockedReason,

      // history
      history_enabled: canStoreHistory,

      // lang
      lang: safeLang,
    });
  } catch (e) {
    console.error("Server error in /api/chat:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
