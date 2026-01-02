import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function hasBearer(authHeader: string) {
  return /^Bearer\s+.+$/i.test(authHeader.trim());
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const iaId = searchParams.get("iaId");

    if (!iaId) return NextResponse.json({ error: "missing_iaId" }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: "supabase_env_missing" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization") ?? "";
    if (!hasBearer(authHeader)) {
      return NextResponse.json({ error: "missing_or_invalid_authorization" }, { status: 401 });
    }

    // 1) user via JWT
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    const userId = user.id;

    // 2) admin: check plan + ownership + fetch messages
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // plan (only paid can access history)
    const { data: sub } = await supabaseAdmin
      .from("user_subscriptions")
      .select("pricing_plan_id, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (!sub?.pricing_plan_id) {
      return NextResponse.json({ error: "history_not_available_on_free" }, { status: 403 });
    }

    // ownership check
    const { data: ai, error: aiErr } = await supabaseAdmin
      .from("user_amoria")
      .select("id, user_id, is_archived")
      .eq("id", iaId)
      .eq("user_id", userId)
      .single();

    if (aiErr || !ai) return NextResponse.json({ error: "ia_not_found" }, { status: 404 });
    if (ai.is_archived) return NextResponse.json({ error: "ia_archived" }, { status: 403 });

    // messages
    const { data: rows, error: msgErr } = await supabaseAdmin
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", userId)
      .eq("amoria_id", iaId)
      .order("created_at", { ascending: true })
      .limit(400);

    if (msgErr) return NextResponse.json({ error: "history_fetch_failed" }, { status: 500 });

    const out = (rows ?? []).map((r: any) => ({
      id: r.id,
      role: r.role,
      content: r.content,
      createdAt: r.created_at,
    }));

    return NextResponse.json(out, { status: 200 });
  } catch (e) {
    console.error("Server error in /api/chat/history:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
