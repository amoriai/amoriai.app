import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited" ? raw : "free";
}

function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v.startsWith("/")) return null;
  if (v.startsWith("//")) return null;
  if (v.includes("\\")) return null;
  return v;
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  // 1) erreur provider
  const oauthError = url.searchParams.get("error");
  if (oauthError) {
    const lang = normalizeLocale(url.searchParams.get("lang"));
    return NextResponse.redirect(new URL(`/login?lang=${lang}&error=${encodeURIComponent(oauthError)}`, url.origin));
  }

  // 2) code obligatoire
  const code = url.searchParams.get("code");
  if (!code) {
    const lang = normalizeLocale(url.searchParams.get("lang"));
    return NextResponse.redirect(new URL(`/login?lang=${lang}&error=missing_code`, url.origin));
  }

  // 3) exchange code -> session (cookies httpOnly gérés par auth-helpers)
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const lang = normalizeLocale(url.searchParams.get("lang"));
    return NextResponse.redirect(new URL(`/login?lang=${lang}&error=oauth_exchange`, url.origin));
  }

  // 4) lire params (dans l'URL, pas de cookies)
  const lang = normalizeLocale(url.searchParams.get("lang"));
  const plan = normalizePlan(url.searchParams.get("plan"));
  const returnTo = safeReturnTo(url.searchParams.get("returnTo"));

  // 5) destination finale
  if (returnTo) {
    return NextResponse.redirect(new URL(returnTo, url.origin));
  }

  if (plan !== "free") {
    return NextResponse.redirect(new URL(`/payment?lang=${lang}&plan=${plan}`, url.origin));
  }

  return NextResponse.redirect(new URL(`/create-amoria?lang=${lang}&plan=${plan}`, url.origin));
}
