export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_KEY = process.env.OPENAI_API_KEY!;

// ✅ Admin (bypass RLS) pour lire/écrire usage + plans
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE);

function getAuthHeader(req: Request) {
  return req.headers.get("authorization") ?? req.headers.get("Authorization");
}

function monthKeyUTC(d = new Date()) {
  // ex: "2025-12"
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function POST(req: Request) {
  try {
    // 0) Auth header
    const authHeader = getAuthHeader(req);
    if (!authHeader) {
      return NextResponse.json({ error: "missing_authorization" }, { status: 401 });
    }

    // 1) Client anon (auth via token user)
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }
    const user = userData.user;

    // 2) Body
    const body = await req.json().catch(() => ({}));
    const iaId = body?.iaId;
    const text = body?.text;

    if (!iaId || typeof iaId !== "string") {
      return NextResponse.json({ error: "missing_iaId" }, { status: 400 });
    }
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "missing_text" }, { status: 400 });
    }

    const safeText = text.trim().slice(0, 2000); // garde-fou (évite payload trop gros)

    // 3) Abonnement actif (ton modèle actuel: status="active")
    const { data: subscription, error: subErr } = await supabaseAdmin
      .from("user_subscriptions")
      .select("pricing_plan_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (subErr || !subscription?.pricing_plan_id) {
      return NextResponse.json({ error: "no_active_subscription" }, { status: 403 });
    }

    // 4) Plan
    const { data: plan, error: planErr } = await supabaseAdmin
      .from("pricing_plans")
      .select("id, code, has_voice, voice_limit")
      .eq("id", subscription.pricing_plan_id)
      .maybeSingle();

    if (planErr || !plan) {
      return NextResponse.json({ error: "plan_not_found" }, { status: 403 });
    }

    const voiceAllowed = !!plan.has_voice;
    const voiceLimit = Number(plan.voice_limit ?? 0);

    if (!voiceAllowed || voiceLimit <= 0) {
      return NextResponse.json({ error: "voice_not_allowed" }, { status: 403 });
    }

    // 5) Vérifie que l’IA appartient au user + récup voice_id
    const { data: iaRow, error: iaErr } = await supabaseAdmin
      .from("user_amoria")
      .select("id, user_id, voice_id")
      .eq("id", iaId)
      .maybeSingle();

    if (iaErr || !iaRow) {
      return NextResponse.json({ error: "ai_not_found" }, { status: 404 });
    }
    if (iaRow.user_id !== user.id) {
      return NextResponse.json({ error: "forbidden_ai" }, { status: 403 });
    }

    const voiceToUse = (iaRow.voice_id && typeof iaRow.voice_id === "string")
      ? iaRow.voice_id
      : "alloy";

    // 6) Quota mensuel (table usage_voice_monthly)
    const month = monthKeyUTC(new Date());

    // upsert user+month si absent
    const { data: usageRow, error: usageErr } = await supabaseAdmin
      .from("usage_voice_monthly")
      .select("id, used")
      .eq("user_id", user.id)
      .eq("month", month)
      .maybeSingle();

    let used = 0;

    if (usageErr) {
      return NextResponse.json({ error: "usage_read_failed" }, { status: 500 });
    }

    if (!usageRow) {
      const { data: created, error: createErr } = await supabaseAdmin
        .from("usage_voice_monthly")
        .insert({ user_id: user.id, month, used: 0 })
        .select("id, used")
        .single();

      if (createErr || !created) {
        return NextResponse.json({ error: "usage_init_failed" }, { status: 500 });
      }
      used = Number(created.used ?? 0);
    } else {
      used = Number(usageRow.used ?? 0);
    }

    if (used >= voiceLimit) {
      return NextResponse.json({ error: "audio_limit_reached" }, { status: 403 });
    }

    // 7) Appel OpenAI TTS
    const openaiRes = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: voiceToUse,
        format: "mp3",
        input: safeText,
      }),
    });

    if (!openaiRes.ok) {
      const raw = await openaiRes.text().catch(() => "");
      return NextResponse.json(
        { error: "openai_tts_failed", detail: raw.slice(0, 2000) },
        { status: 502 }
      );
    }

    const audioBuffer = await openaiRes.arrayBuffer();

    // 8) Décrément quota (après succès)
    // (simple + fiable; si tu veux atomic strict, on fera une RPC)
    const { error: updErr } = await supabaseAdmin
      .from("usage_voice_monthly")
      .update({ used: used + 1 })
      .eq("user_id", user.id)
      .eq("month", month);

    if (updErr) {
      // On ne bloque pas l’audio (déjà généré), mais on log
      console.error("usage update failed:", updErr);
    }

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("VOICE route fatal:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
                                }
