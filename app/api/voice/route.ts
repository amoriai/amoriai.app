export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Client "admin" (service role) pour lire tables (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // ✅ 0) Lire le header Authorization proprement (pas de "!")
  const authHeader =
    req.headers.get("authorization") ?? req.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 }
    );
  }

  // ✅ 1) Client "anon" qui utilise le token du user
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: authHeader, // ✅ IMPORTANT
        },
      },
    }
  );

  const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 401 });
  }

  const user = userData?.user;
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // ✅ 2) Lire abonnement actif
  const { data: subscription, error: subErr } = await supabaseAdmin
    .from("user_subscriptions")
    .select("pricing_plan_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (subErr || !subscription) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 403 }
    );
  }

  // ✅ 3) Lire le plan
  const { data: plan, error: planErr } = await supabaseAdmin
    .from("pricing_plans")
    .select("has_voice, voice_limit")
    .eq("id", subscription.pricing_plan_id)
    .single();

  if (planErr || !plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 403 });
  }

  if (!plan.has_voice || (plan.voice_limit ?? 0) <= 0) {
    return NextResponse.json(
      { error: "Voice not allowed for this plan" },
      { status: 403 }
    );
  }

  // ✅ 4) Lire le texte
  const body = await req.json().catch(() => ({}));
  const text = body?.text;

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "No text" }, { status: 400 });
  }

  // ✅ 5) OpenAI TTS
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
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
