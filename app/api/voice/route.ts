import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { iaId, text } = await req.json();

    if (!iaId || !text) {
      return NextResponse.json({ error: "missing_data" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const openaiKey = process.env.OPENAI_API_KEY!;

    if (!supabaseUrl || !serviceKey || !openaiKey) {
      return NextResponse.json({ error: "env_missing" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Charger l’IA
    const { data: ia, error } = await supabase
      .from("user_amoria")
      .select("id, voice_id, audio_credits, plan_id")
      .eq("id", iaId)
      .single();

    if (!ia || error) {
      return NextResponse.json({ error: "ia_not_found" }, { status: 404 });
    }

    // Limites audio par plan
    const AUDIO_LIMITS: Record<string, number> = {
      free: 0,
      chat: 0,
      plus: 150,
      unlimited: 99999,
    };

    const maxAudio = AUDIO_LIMITS[ia.plan_id || "free"] ?? 0;

    if ((ia.audio_credits ?? 0) >= maxAudio) {
      return NextResponse.json(
        { error: "audio_limit_reached" },
        { status: 403 }
      );
    }

    // ✅ NOUVELLE API OPENAI VOICE (OFFICIELLE 2025)
    const voiceResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini-tts",
          input: text,
          voice: ia.voice_id || "alloy"
        }),
      }
    );

    if (!voiceResponse.ok) {
      const err = await voiceResponse.text();
      console.error("OpenAI voice error:", err);
      return NextResponse.json({ error: "openai_voice_error" }, { status: 500 });
    }

    const data = await voiceResponse.json();
    const audioBase64 = data?.output_audio?.data;

    if (!audioBase64) {
      return NextResponse.json({ error: "no_audio_returned" }, { status: 500 });
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");

    // Incrémenter les crédits audio
    await supabase
      .from("user_amoria")
      .update({ audio_credits: (ia.audio_credits ?? 0) + 1 })
      .eq("id", ia.id);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });

  } catch (e) {
    console.error("VOICE SERVER ERROR:", e);
    return NextResponse.json({ error: "voice_error" }, { status: 500 });
  }
}
