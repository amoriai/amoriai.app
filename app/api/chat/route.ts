import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FREE_MONTHLY_LIMIT = 3; // 🔒 Free = 3 messages par mois

function getCurrentPeriodStart(): string {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return monthStart.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { iaId, message, lang, withAudio } = body as {
      iaId?: string;
      message?: string;
      lang?: "fr" | "en" | "es";
      withAudio?: boolean;
    };

    if (!iaId) {
      return NextResponse.json({ error: "missing_iaId" }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "missing_message" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error("Missing Supabase env vars");
      return NextResponse.json(
        { error: "supabase_env_missing" },
        { status: 500 }
      );
    }
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json(
        { error: "missing_openai_key" },
        { status: 500 }
      );
    }

    // 1️⃣ Client "auth" qui lit le token envoyé par le front dans Authorization
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: req.headers.get("authorization") ?? "",
        },
      },
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

    // 2️⃣ Client admin (service role) pour lire / écrire dans les tables
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // 3️⃣ L’IA doit appartenir à cet utilisateur
    const { data: iaRow, error: iaError } = await supabaseAdmin
      .from("user_amoria")
      .select("id, user_id, name, system_prompt, credits, voice_id")
      .eq("id", iaId)
      .eq("user_id", userId)
      .single();

    if (iaError || !iaRow) {
      console.error("IA row error:", iaError);
      return NextResponse.json({ error: "ia_not_found" }, { status: 404 });
    }

    const currentCredits: number = iaRow.credits ?? 0;

    // 4️⃣ Abonnement & plan
    let maxText = 0;
    let hasVoiceFromPlan = false;
    let voiceLimitFromPlan = 0;
    let planName = "Free";
    let planCode: string | null = null;

    const { data: subscription } = await supabaseAdmin
      .from("user_subscriptions")
      .select("pricing_plan_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (subscription?.pricing_plan_id) {
      const { data: plan, error: planError } = await supabaseAdmin
        .from("pricing_plans")
        .select("code, name, message_limit, has_voice, voice_limit")
        .eq("id", subscription.pricing_plan_id)
        .single();

      if (!planError && plan) {
        planCode = plan.code ?? null;
        planName = plan.name ?? "Unknown";
        maxText = plan.message_limit ?? 0;
        hasVoiceFromPlan = !!plan.has_voice;
        voiceLimitFromPlan = plan.voice_limit ?? 0;
      }
    } else {
      // Aucun abonnement = plan gratuit par défaut
      planCode = "free";
      planName = "Free";
      maxText = 0; // on ne se sert pas de message_limit pour le free
      hasVoiceFromPlan = false;
      voiceLimitFromPlan = 0;
    }

    const isFreePlan =
      !subscription?.pricing_plan_id ||
      planCode === "free" ||
      planName.toLowerCase().includes("free");

    // 5️⃣ Gestion de la limite Free = 200 messages / mois / user
    if (isFreePlan) {
      const periodStart = getCurrentPeriodStart();

      const { data: usageRow, error: usageError } = await supabaseAdmin
        .from("user_chat_usage")
        .select("message_count")
        .eq("user_id", userId)
        .eq("period_start", periodStart)
        .maybeSingle();

      if (usageError) {
        console.error("user_chat_usage select error:", usageError);
      }

      const currentCount = usageRow?.message_count ?? 0;

      if (currentCount >= FREE_MONTHLY_LIMIT) {
        return NextResponse.json(
          {
            error: "free_limit_reached",
            planName,
            maxText: FREE_MONTHLY_LIMIT,
            message:
              "Tu as atteint la limite de la version gratuite pour cette période.",
          },
          { status: 429 }
        );
      }

      // ⚠️ On n’updatte pas encore, on le fera après l’appel OpenAI
    } else {
      // 6️⃣ Plans payants : limite basée sur message_limit + credits
      if (maxText > 0 && currentCredits >= maxText) {
        return NextResponse.json(
          {
            error: "text_quota_reached",
            planName,
            maxText,
            message:
              "Tu as atteint la limite de messages texte pour ton forfait actuel.",
          },
          { status: 429 }
        );
      }
    }

    // 7️⃣ System prompt selon la langue
    const defaultSystemPromptFr =
      "Tu es une IA de compagnie bienveillante et chaleureuse. Tu réponds en français avec un ton naturel, doux et empathique.";
    const defaultSystemPromptEn =
      "You are a caring, warm AI companion. Answer in natural, friendly, empathetic English.";
    const defaultSystemPromptEs =
      "Eres una IA compañera cálida y cariñosa. Respondes en español con un tono natural y empático.";

    let defaultSystemPrompt = defaultSystemPromptFr;
    if (lang === "en") defaultSystemPrompt = defaultSystemPromptEn;
    if (lang === "es") defaultSystemPrompt = defaultSystemPromptEs;

    const systemPrompt = iaRow.system_prompt || defaultSystemPrompt;

    // 8️⃣ Appel OpenAI – texte
    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text();
      console.error("OpenAI chat error:", errText);
      return NextResponse.json(
        { error: "openai_api_error" },
        { status: 500 }
      );
    }

    const chatData = await chatRes.json();
    const text: string =
      chatData?.choices?.[0]?.message?.content?.trim() || "Je ne sais pas.";

    // 9️⃣ Voix optionnelle (selon plan)
    const allowAudio =
      !!withAudio && hasVoiceFromPlan && voiceLimitFromPlan > 0;

    let audioBase64: string | null = null;
    let audioMimeType: string | null = null;

    if (allowAudio) {
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
        } else {
          const audioBuffer = await ttsRes.arrayBuffer();
          // @ts-ignore Buffer dispo en runtime Node
          audioBase64 = Buffer.from(audioBuffer).toString("base64");
          audioMimeType = "audio/mpeg";
        }
      } catch (e) {
        console.error("TTS generation error:", e);
      }
    }

    // 🔟 Comptabiliser l’usage

    if (isFreePlan) {
      // 🔒 Free → 200 / mois dans user_chat_usage
      const periodStart = getCurrentPeriodStart();

      const { data: usageRow, error: usageError } = await supabaseAdmin
        .from("user_chat_usage")
        .select("message_count")
        .eq("user_id", userId)
        .eq("period_start", periodStart)
        .maybeSingle();

      if (usageError) {
        console.error("user_chat_usage select (after) error:", usageError);
      }

      const currentCount = usageRow?.message_count ?? 0;
      const newCount = currentCount + 1;

      const { error: upsertError } = await supabaseAdmin
        .from("user_chat_usage")
        .upsert(
          {
            user_id: userId,
            period_start: periodStart,
            message_count: newCount,
          },
          { onConflict: "user_id,period_start" }
        );

      if (upsertError) {
        console.error("user_chat_usage upsert error:", upsertError);
      }

      // Pour le free, on peut utiliser credits_* pour le suivi visuel
      return NextResponse.json({
        reply: text,
        audioBase64,
        audioMimeType,
        planName,
        iaId: iaRow.id,
        iaName: iaRow.name,
        credits_used: newCount,
        credits_remaining: FREE_MONTHLY_LIMIT - newCount,
      });
    } else {
      // 💳 Plans payants : on garde ton système de credits
      const newCredits = currentCredits + 1;

      const { error: updateError } = await supabaseAdmin
        .from("user_amoria")
        .update({ credits: newCredits })
        .eq("id", iaRow.id);

      if (updateError) {
        console.error("Error updating credits:", updateError);
      }

      return NextResponse.json({
        reply: text,
        audioBase64,
        audioMimeType,
        planName,
        iaId: iaRow.id,
        iaName: iaRow.name,
        credits_used: newCredits,
        credits_remaining: maxText > 0 ? maxText - newCredits : null,
      });
    }
  } catch (e) {
    console.error("Server error in /api/chat:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
