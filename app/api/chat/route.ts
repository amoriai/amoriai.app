import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
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
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !serviceKey) {
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

    // 1️⃣ RÉCUPÉRER L’UTILISATEUR CONNECTÉ À PARTIR DES COOKIES
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("auth.getUser error:", userError);
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    // 2️⃣ CLIENT ADMIN POUR LES TABLES (service role)
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // 3️⃣ L’IA DOIT APPARTENIR À CET UTILISATEUR
    const { data: iaRow, error: iaError } = await supabaseAdmin
      .from("user_amoria")
      .select("id, user_id, name, system_prompt, credits, voice_id")
      .eq("id", iaId)
      .eq("user_id", user.id)
      .single();

    if (iaError || !iaRow) {
      console.error("IA row error:", iaError);
      return NextResponse.json({ error: "ia_not_found" }, { status: 404 });
    }

    const currentCredits: number = iaRow.credits ?? 0;

    // 4️⃣ LIRE L’ABONNEMENT ACTIF
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("user_subscriptions")
      .select("pricing_plan_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (subError || !subscription) {
      console.error("Subscription error:", subError);
      return NextResponse.json(
        { error: "no_active_subscription" },
        { status: 403 }
      );
    }

    // 5️⃣ RÉCUPÉRER LES LIMITES DU FORFAIT
    const { data: plan, error: planError } = await supabaseAdmin
      .from("pricing_plans")
      .select("name, message_limit, ai_limit, has_voice, voice_limit")
      .eq("id", subscription.pricing_plan_id)
      .single();

    if (planError || !plan) {
      console.error("Plan error:", planError);
      return NextResponse.json({ error: "plan_not_found" }, { status: 500 });
    }

    const maxText: number = plan.message_limit ?? 0;
    const planName: string = plan.name ?? "Unknown";

    // 6️⃣ VÉRIFIER LE QUOTA TEXTE
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

    // 7️⃣ SYSTEM PROMPT SELON LA LANGUE
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

    // 8️⃣ APPEL OPENAI – RÉPONSE TEXTE
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

    // 9️⃣ VOIX (optionnelle, si plan la permet)
    const allowAudio =
      !!withAudio && !!plan.has_voice && (plan.voice_limit ?? 0) > 0;

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

    // 🔟 INCRÉMENTER LES CRÉDITS TEXTE
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
      credits_used: newCredits,
      credits_remaining: maxText > 0 ? maxText - newCredits : null,
      iaId: iaRow.id,
      iaName: iaRow.name,
    });
  } catch (e) {
    console.error("Server error in /api/chat:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
