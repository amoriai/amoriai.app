import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited"
    ? raw
    : "free";
}

function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/")) return null;
  if (raw.startsWith("//")) return null;
  return raw;
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const lang = normalizeLocale(url.searchParams.get("lang"));
  const plan = normalizePlan(url.searchParams.get("plan"));
  const returnTo = safeReturnTo(url.searchParams.get("returnTo"));

  // Pas de code => retour login (avec langue)
  if (!code) {
    return NextResponse.redirect(new URL(`/login?lang=${lang}&error=missing_code`, url.origin));
  }

  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error);
    return NextResponse.redirect(new URL(`/login?lang=${lang}&error=oauth_exchange`, url.origin));
  }

  // Priorité returnTo si fourni
  if (returnTo) {
    return NextResponse.redirect(new URL(returnTo, url.origin));
  }

  // Plan payant -> subscription, sinon -> create-amoria
  if (plan !== "free") {
    return NextResponse.redirect(new URL(`/subscription?lang=${lang}&plan=${plan}`, url.origin));
  }

  return NextResponse.redirect(new URL(`/create-amoria?lang=${lang}&plan=${plan}`, url.origin));
}
