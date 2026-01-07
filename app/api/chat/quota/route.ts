
// app/api/chat/quota/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// IMPORTANT: mets la même valeur que dans /api/chat/route.ts
const FREE_LIFETIME_QUOTA = 15;

type PlanCode = "free" | "chat" | "plus" | "unlimited";

function hasBearer(authHeader: string) {
  return /^Bearer\s+.+$/i.test((authHeader ?? "").trim());
}

function normalizePlanCode(raw: unknown): PlanCode {
  const v = String(raw ?? "").toLowerCase();
  if (v === "chat" || v === "plus" || v === "unlimited") return v;
  return "free";
}

export async function GET(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return NextResponse.json({ error: "supabase_env_missing" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization") ?? "";
    if (!hasBearer(authHeader)) {
      return NextResponse.json({ error: "missing_or_invalid_authorization" }, { status: 401 });
    }

    // 1) Resolve user via JWT (anon key + Authorization header)
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
    const user = userData?.user ?? null;

    if (userError || !user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    const userId = user.id;

    // 2) Admin client (service role) to read subscription/plan + usage
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // Prefer current=true if you use it; fallback to status=active
    const { data: subCurrent } = await supabaseAdmin
      .from("user_subscriptions")
      .select("pricing_plan_id, status, current")
      .eq("user_id", userId)
      .eq("current", true)
      .maybeSingle();

    const { data: subActive } = !subCurrent
      ? await supabaseAdmin
          .from("user_subscriptions")
          .select("pricing_plan_id, status")
          .eq("user_id", userId)
          .eq("status", "active")
          .maybeSingle()
      : { data: null as any };

    const sub = subCurrent ?? subActive;

    let planCode: PlanCode = "free";

    if (sub?.pricing_plan_id) {
      const { data: planRow } = await supabaseAdmin
        .from("pricing_plans")
        .select("code")
        .eq("id", sub.pricing_plan_id)
        .maybeSingle();

      planCode = normalizePlanCode(planRow?.code);
    }

    // 3) Paid: UI doesn't need remaining
    if (planCode !== "free") {
      return NextResponse.json({
        planCode,
        chat_quota: null,
        chat_remaining: null,
      });
    }

    // 4) Free: read remaining from table with ADMIN (no RLS)
    const { data: usageRow, error: usageErr } = await supabaseAdmin
      .from("user_free_message_usage")
      .select("used")
      .eq("user_id", userId)
      .maybeSingle();

    if (usageErr) {
      return NextResponse.json(
        { error: "quota_read_failed", details: usageErr },
        { status: 400 }
      );
    }

    const used = Number(usageRow?.used ?? 0);
    const remaining = Math.max(0, FREE_LIFETIME_QUOTA - used);

    return NextResponse.json({
      planCode,
      chat_quota: FREE_LIFETIME_QUOTA,
      chat_remaining: remaining,
      used,
    });
  } catch (e) {
    console.error("Server error in /api/chat/quota:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
