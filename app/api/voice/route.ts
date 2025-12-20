export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function hasBearer(authHeader: string) {
  return /^Bearer\s+.+$/i.test(authHeader.trim());
}

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: "supabase_env_missing" }, { status: 500 });
    }
    if (!openaiKey) {
      return NextResponse.json({ error: "missing_openai_key" }, { status: 500 });
    }

    const authHeader =
      req.headers.get("authorization") ?? req.headers.get("Authorization") ?? "";

    if (!hasBearer(authHeader)) {
      return NextResponse.json(
        { error: "missing_or_invalid_authorization" },
        { status: 401 }
      );
    }

    // Client JWT (RLS ON)
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userErr,
    } = await supabaseAuth.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    // Admin client (lit plan/sub + IA)
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Body
    const body = await req.json().catch(() => ({}));
    const text = body?.text;
    const iaId = body?.iaId;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "missing_text" }, { status: 400 });
    }
    if (!iaId || typeof iaId !== "string") {
      return NextResponse.json({ error: "missing_iaId" }, { status: 400 });
    }

    // 0) Vérifier IA appartient au user + récupérer voice_id
    const { data: iaRow, error: iaErr } = await supabaseAdmin
      .from("user_amoria")
      .select("id, user_id, voice_id, is_archived")
      .eq("id", iaId)
      .eq("user_id", user.id)
      .single();

    if (iaErr || !iaRow) {
      return NextResponse.json({ error: "ia_not_found" }, { status: 404 });
    }
    if (iaRow.is_archived === true) {
      return NextResponse.json({ error: "ia_archived" }, { status: 403 });
    }

    // 1) abonnement actif
    const { data: subscription, error: subErr } = await supabaseAdmin
      .from("user_subscriptions")
      .select("pricing_plan_id, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (subErr) console.error("subscription error:", subErr);

    // Si pas d’abonnement actif → pas de voice
    if (!subscription?.pricing_plan_id) {
      return NextResponse.json({ error: "voice_not_allowed" }, { status: 403 });
    }

    // 2) plan
    const { data: plan, error: planErr } = await supabaseAdmin
      .from("pricing_plans")
      .select("has_voice, voice_limit")
      .eq("id", subscription.pricing_plan_id)
      .single();

    if (planErr || !plan) {
      console.error("plan error:", planErr);
      return NextResponse.json({ error: "plan_not_found" }, { status: 403 });
    }

    const hasVoice = !!plan.has_voice;
    const voiceLimit = Number(plan.voice_limit ?? 0);

    if (!hasVoice || voiceLimit <= 0) {
      return NextResponse.json({ error: "voice_not_allowed" }, { status: 403 });
    }

    // 3) ✅ Consommer quota MENSUEL voice (RPC avec JWT)
    const { data: vUsage, error: vErr } = await supabaseAuth.rpc(
      "consume_monthly_voice",
      { quota: voiceLimit }
    );

    if (vErr) {
      console.error("consume_monthly_voice error:", vErr);
      return NextResponse.json({ error: "voice_quota_check_failed" }, { status: 500 });
    }

    if (!vUsage?.ok) {
      // ⚠️ IMPORTANT: ton UI attend "audio_limit_reached"
      return NextResponse.json(
        {
          error: "audio_limit_reached",
          remaining_this_month: vUsage?.remaining ?? null,
        },
        { status: 429 }
      );
    }

    // 4) OpenAI TTS
    const voice = (iaRow.voice_id || "alloy").toString();

    const openaiRes = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice,
        input: text.trim(),
        format: "mp3",
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error("OpenAI TTS error:", err);
      return NextResponse.json({ error: "openai_tts_error" }, { status: 500 });
    }

    const audioBuffer = await openaiRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "X-Voice-Remaining": String(vUsage?.remaining ?? ""),
      },
    });
  } catch (e) {
    console.error("Server error in /api/voice:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
