import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FREE_LIFETIME_QUOTA = 40;

function hasBearer(authHeader: string) {
  return /^Bearer\s+.+$/i.test((authHeader || "").trim());
}

export async function GET(req: Request) {
  try {
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

    // user via JWT
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    const userId = userData.user.id;

    // admin to read plan
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { data: sub } = await supabaseAdmin
      .from("user_subscriptions")
      .select("pricing_plan_id, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    let planCode: "free" | "chat" | "plus" | "unlimited" = "free";

    if (sub?.pricing_plan_id) {
      const { data: plan } = await supabaseAdmin
        .from("pricing_plans")
        .select("code")
        .eq("id", sub.pricing_plan_id)
        .maybeSingle();

      const code = String(plan?.code ?? "").toLowerCase();
      if (code === "chat" || code === "plus" || code === "unlimited") planCode = code as any;
    }

    // ✅ pour le moment on renvoie remaining seulement si free
    if (planCode !== "free") {
      return NextResponse.json({ planCode, chat_remaining: null, chat_quota: null });
    }

    // IMPORTANT: suppose que tu as une table/state qui conserve "used" lifetime
    // Ici, on appelle une RPC NON destructive qui ne consomme rien.
    // 👉 Je te donne 2 options :
    // A) Tu as déjà une RPC "get_free_remaining()"
    // B) Sinon on lit une table "user_quotas" / "profiles" etc.

    // Option A (recommandé) : RPC get_free_remaining()
    const { data: remainingData, error: remErr } = await supabaseAuth.rpc("get_free_remaining", {
      quota: FREE_LIFETIME_QUOTA,
    });

    if (remErr) {
      return NextResponse.json({ error: "quota_read_failed" }, { status: 500 });
    }

    const remaining =
      typeof remainingData?.remaining === "number"
        ? Math.max(0, Math.floor(remainingData.remaining))
        : null;

    return NextResponse.json({
      planCode,
      chat_quota: FREE_LIFETIME_QUOTA,
      chat_remaining: remaining,
    });
  } catch (e) {
    console.error("Server error in /api/chat/quota:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
