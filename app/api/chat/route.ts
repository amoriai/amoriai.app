import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PLAN_LIMITS = {
  free: { maxText: 200 },
  chat: { maxText: 400 },
  plus: { maxText: 600 },
  unlimited: { maxText: 10000 },
} as const;

type PlanId = keyof typeof PLAN_LIMITS;

export async function POST(req: Request) {
  try {
    // 1) Body venant du frontend
    const body = await req.json();
    const { iaId, message, lang, withAudio } = body as {
      iaId?: string;
      message?: string;
      lang?: string;
      withAudio?: boolean; // <- nouveau flag
    };

    if (!iaId) {
      return NextResponse.json({ error: "missing_iaId" }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "missing_message" }, { status: 400 });
    }

    // 2) Supabase service
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error("Missing Supabase env vars");
      return NextResponse.json(
        { error: "supabase_env_missing" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // 3) IA row
    const { data: iaRow, error: iaError } = await supabase
      .from("user_amoria")
      .select("id, name, system_prompt, plan_id, credits, voice_id")
      .eq("id", iaId)
      .maybeSingle();

    if (iaError || !iaRow) {
      console.error("IA row error:", iaError);
      return NextResponse.json({ error: "ia_not_found" }, { status: 404 });
    }

    const planId = (iaRow.plan_id || "free") as PlanId;
    const plan = PLAN_LIMITS[planId] ?? PLAN_LIMITS.free;
    const currentCredits = iaRow.credits ?? 0;

    // 4) Limite de messages texte
    if (currentCredits >= plan.maxText) {
      return NextResponse.json(
        {
          error: "text_quota_reached",
          planId,
          maxText: plan.maxText,
          message:
            "Tu as atteint la limite de messages texte pour ton forfait actuel.",
        },
        { status: 429 }
      );
    }

    // 5) System prompt par langue
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

    // 6) Appel OpenAI pour le TEXTE
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json(
        { error: "missing_openai_key" },
        { status: 500 }
      );
    }

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

    // 7) Optionnel : génération AUDIO (TTS)
    //    ici, on autorise la voix seulement pour plus / unlimited
    const allowAudio =
      !!withAudio && (planId === "plus" || planId === "unlimited");

    let audioBase64: string | null = null;
    let audioMimeType: string | null = null;

    if (allowAudio) {
      try {
        const voice = iaRow.voice_id || "alloy"; // voix par défaut

        const ttsRes = await fetch(
          "https://api.openai.com/v1/audio/speech",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "tts-1", // modèle TTS OpenAI 0
              voice,
              input: text,
              format: "mp3",
            }),
          }
        );

        if (!ttsRes.ok) {
          const ttsErr = await ttsRes.text();
          console.error("OpenAI TTS error:", ttsErr);
        } else {
          const audioBuffer = await ttsRes.arrayBuffer();
          audioBase64 = Buffer.from(audioBuffer).toString("base64");
          audioMimeType = "audio/mpeg";
        }
      } catch (e) {
        console.error("TTS generation error:", e);
      }
    }

    // 8) Incrémenter crédits texte (tu peux ajouter plus tard des crédits audio si tu veux)
    const newCredits = currentCredits + 1;

    const { error: updateError } = await supabase
      .from("user_amoria")
      .update({ credits: newCredits })
      .eq("id", iaRow.id);

    if (updateError) {
      console.error("Error updating credits:", updateError);
    }

    // 9) Réponse au frontend
    return NextResponse.json({
      reply: text,
      audioBase64, // null si pas de voix ou plan non autorisé
      audioMimeType,
      planId,
      credits_used: newCredits,
      credits_remaining: plan.maxText - newCredits,
      iaId: iaRow.id,
      iaName: iaRow.name,
    });
  } catch (e) {
    console.error("Server error in /api/chat:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
