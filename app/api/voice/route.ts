import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { iaId, text } = await req.json();

    if (!iaId || !text) {
      return NextResponse.json(
        { error: "missing_data" },
        { status: 400 }
      );
    }

    // ✅ Variables d’environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const openaiKey = process.env.OPENAI_API_KEY!;

    if (!supabaseUrl || !serviceKey || !openaiKey) {
      return NextResponse.json(
        { error: "missing_env_keys" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // ✅ Charger l’IA
    const { data: ia, error: iaError } = await supabase
      .from("user_amoria")
      .select("id, voice_id, audio_credits, plan_id")
      .eq("id", iaId)
      .single();

    if (!ia || iaError) {
      return NextResponse.json(
        { error: "ia_not_found" },
        { status: 404 }
      );
    }

    // ✅ Limites audio par plan
    const AUDIO_LIMITS: Record<string, number> = {
      free: 0,
      chat: 0,
      plus: 150,
      unlimited: 999999,
    };

    const maxAudio = AUDIO_LIMITS[ia.plan_id || "free"] || 0;

    if (ia.audio_credits >= maxAudio) {
      return NextResponse.json(
        { error: "audio_limit_reached" },
        { status: 403 }
      );
    }

    // ✅ Appel officiel OpenAI TTS (API 2025)
    const voiceResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts",
          input: text,
          audio: {
            voice: ia.voice_id || "alloy",
            format: "mp3",
          },
        }),
      }
    );

    const result = await voiceResponse.json();

    if (!result?.output_audio?.data) {
      console.error("AUDIO API ERROR:", result);
      return NextResponse.json(
        { error: "no_audio_generated" },
        { status: 500 }
      );
    }

    const audioBase64 = result.output_audio.data;
    const audioBuffer = Buffer.from(audioBase64, "base64");

    // ✅ Incrément crédits audio
    await supabase
      .from("user_amoria")
      .update({
        audio_credits: ia.audio_credits + 1,
      })
      .eq("id", ia.id);

    // ✅ Retour audio
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (e) {
    console.error("VOICE SERVER ERROR:", e);
    return NextResponse.json(
      { error: "voice_server_error" },
      { status: 500 }
    );
  }
}
