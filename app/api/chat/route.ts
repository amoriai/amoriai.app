import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Limites de messages texte par mois selon le plan
const PLAN_LIMITS = {
  free: { maxText: 200 },
  chat: { maxText: 400 },
  plus: { maxText: 600 },
  unlimited: { maxText: 10000 },
} as const;

type PlanId = keyof typeof PLAN_LIMITS;

export async function POST(req: Request) {
  try {
    // 1) Lire le body envoyé par le frontend
    const body = await req.json();
    const { iaId, message, lang } = body as {
      iaId?: string;
      message?: string;
      lang?: string;
    };

    if (!iaId) {
      return NextResponse.json(
        { error: "missing_iaId" },
        { status: 400 },
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "missing_message" },
        { status: 400 },
      );
    }

    // 2) Client Supabase SERVEUR (service role = autorisé ici)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error("Missing Supabase env vars");
      return NextResponse.json(
        { error: "supabase_env_missing" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // 3) Charger la ligne de l’IA (user_amoria) via iaId
    const { data: iaRow, error: iaError } = await supabase
      .from("user_amoria")
      .select("id, name, system_prompt, plan_id, credits")
      .eq("id", iaId)
      .maybeSingle();

    if (iaError || !iaRow) {
      console.error("IA row error:", iaError);
      return NextResponse.json(
        { error: "ia_not_found" },
        { status: 404 },
      );
    }

    const planId = (iaRow.plan_id || "free") as PlanId;
    const plan = PLAN_LIMITS[planId] ?? PLAN_LIMITS.free;
    const currentCredits = iaRow.credits ?? 0;

    // 4) Vérifier la limite de messages texte
    if (currentCredits >= plan.maxText) {
      return NextResponse.json(
        {
          error: "text_quota_reached",
          planId,
          maxText: plan.maxText,
          message:
            "Tu as atteint la limite de messages texte pour ton forfait actuel.",
        },
        { status: 429 },
      );
    }

    // 5) Préparer le system prompt
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

    // 6) Appel à l’API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json(
        { error: "missing_openai_key" },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.1-mini",
        input: message,
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return NextResponse.json(
        { error: "openai_api_error" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const text =
      data?.output?.[0]?.content?.[0]?.text ?? "Je ne sais pas.";

    // 7) Incrémenter le compteur de messages (credits) pour CETTE IA
    const newCredits = currentCredits + 1;

    const { error: updateError } = await supabase
      .from("user_amoria")
      .update({ credits: newCredits })
      .eq("id", iaRow.id);

    if (updateError) {
      console.error("Error updating credits:", updateError);
      // On continue quand même
    }

    // 8) Réponse finale
    return NextResponse.json({
      reply: text,
      planId,
      credits_used: newCredits,
      credits_remaining: plan.maxText - newCredits,
      iaId: iaRow.id,
      iaName: iaRow.name,
    });
  } catch (e) {
    console.error("Server error in /api/chat:", e);
    return NextResponse.json(
      { error: "server_error" },
      { status: 500 },
    );
  }
}
