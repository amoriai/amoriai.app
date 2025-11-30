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

    const supabase = createClient(supabaseUrl, serviceKey);

    // Charger l’IA
    const { data: ia } = await supabase
      .from("user_amoria")
      .select("id, voice_id, audio_credits, plan_id")
      .eq("id", iaId)
      .single();

    if (!ia) {
      return NextResponse.json({ error: "ia_not_found" }, { status: 404 });
    }

    // Limites audio par plan
    const AUDIO_LIMITS: any = {
      free: 0,
      chat: 0,
      plus: 150,
      unlimited: 99999,
    };

    const maxAudio = AUDIO_LIMITS[ia.plan_id || "free"] || 0;

    if (ia.audio_credits >= maxAudio) {
      return NextResponse.json({
        error: "audio_limit_reached",
      }, { status: 403 });
    }

    // Appel OpenAI VOICE
    const voiceResponse = await fetch(
      "https://api.openai.com/v1/audio/speech",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts",
          voice: ia.voice_id || "alloy",
          input: text,
        }),
      }
    );

    const audioBuffer = await voiceResponse.arrayBuffer();

    // Incrément crédit audio
    await supabase
      .from("user_amoria")
      .update({ audio_credits: ia.audio_credits + 1 })
      .eq("id", ia.id);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "voice_error" }, { status: 500 });
  }
}
