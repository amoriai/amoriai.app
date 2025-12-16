export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // 0) Vérifier Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 }
    );
  }

  // 1) Récupérer l'utilisateur connecté via le token
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    }
  );

  const { data: { user }, error: userErr } = await supabaseAuth.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2) Lire abonnement actif
  const { data: subscription, error: subErr } = await supabase
    .from("user_subscriptions")
    .select("pricing_plan_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (subErr || !subscription?.pricing_plan_id) {
    return NextResponse.json({ error: "No active subscription" }, { status: 403 });
  }

  // 3) Lire le plan (⚠️ par CODE, pas par ID)
  const { data: plan, error: planErr } = await supabase
    .from("pricing_plans")
    .select("has_voice, voice_limit")
    .eq("code", subscription.pricing_plan_id) // <-- IMPORTANT
    .single();

  const voiceLimit = Number(plan?.voice_limit ?? 0);

  if (planErr || !plan || !plan.has_voice || voiceLimit <= 0) {
    return NextResponse.json(
      { error: "Voice not allowed for this plan" },
      { status: 403 }
    );
  }

  // 4) Lire le texte
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = body?.text;
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "No text" }, { status: 400 });
  }

  // 5) Appel OpenAI TTS
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
    const errText = await openaiRes.text();
    return NextResponse.json({ error: errText }, { status: 500 });
  }

  const audioBuffer = await openaiRes.arrayBuffer();

  return new NextResponse(audioBuffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
