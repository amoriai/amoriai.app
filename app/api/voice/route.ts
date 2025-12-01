import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // 1️⃣ Récupérer l'utilisateur connecté
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("authorization")!,
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2️⃣ Lire abonnement + forfait
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("pricing_plan_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!subscription) {
    return NextResponse.json({ error: "No active subscription" }, { status: 403 });
  }

  const { data: plan } = await supabase
    .from("pricing_plans")
    .select("has_voice, voice_limit")
    .eq("id", subscription.pricing_plan_id)
    .single();

  if (!plan || !plan.has_voice || plan.voice_limit <= 0) {
    return NextResponse.json(
      { error: "Voice not allowed for this plan" },
      { status: 403 }
    );
  }

  // 3️⃣ Lire le texte
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "No text" }, { status: 400 });
  }

  // 4️⃣ Appel OpenAI TTS
  const openaiRes = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    }),
  });

  if (!openaiRes.ok) {
    const err = await openaiRes.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const audioBuffer = await openaiRes.arrayBuffer();

  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}
