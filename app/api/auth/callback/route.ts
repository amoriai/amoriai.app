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
  const v = raw.trim();
  if (!v.startsWith("/")) return null;
  if (v.startsWith("//")) return null;
  if (v.includes("\\")) return null;
  return v;
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Params (dans l'URL)
  const lang = normalizeLocale(url.searchParams.get("lang"));
  const plan = normalizePlan(url.searchParams.get("plan"));
  const returnTo = safeReturnTo(url.searchParams.get("returnTo"));

  // 1) erreur provider
  const oauthError = url.searchParams.get("error");
  if (oauthError) {
    const p = new URLSearchParams();
    p.set("lang", lang);
    p.set("error", oauthError);
    return NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
  }

  // 2) code obligatoire
  const code = url.searchParams.get("code");
  if (!code) {
    const p = new URLSearchParams();
    p.set("lang", lang);
    p.set("error", "missing_code");
    return NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
  }

  // 3) exchange code -> session (cookies httpOnly)
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const p = new URLSearchParams();
    p.set("lang", lang);
    p.set("error", "oauth_exchange");
    return NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
  }

  // 4) Destination finale UNIFIÉE
  // - si returnTo est safe: on respecte
  // - sinon: on passe par /auth/post-login (qui décidera chat vs create-amoria)
  if (returnTo) {
    return NextResponse.redirect(new URL(returnTo, url.origin));
  }

  const p = new URLSearchParams();
  p.set("lang", lang);
  p.set("plan", plan);

  return NextResponse.redirect(new URL(`/auth/post-login?${p.toString()}`, url.origin));
}
