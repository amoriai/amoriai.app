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

/** Autorise uniquement un chemin interne (anti open-redirect) */
function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v.startsWith("/")) return null;
  if (v.startsWith("//")) return null;
  if (v.includes("\\")) return null;
  return v;
}

function readCookie(name: string): string | null {
  try {
    const v = cookies().get(name)?.value ?? null;
    return v ? decodeURIComponent(v) : null;
  } catch {
    return null;
  }
}

function clearTempCookies(res: NextResponse) {
  res.cookies.set("amoria_returnTo", "", { path: "/", maxAge: 0 });
  res.cookies.set("amoria_lang", "", { path: "/", maxAge: 0 });
  res.cookies.set("amoria_plan", "", { path: "/", maxAge: 0 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Params (URL)
  const returnToParam = safeReturnTo(url.searchParams.get("returnTo"));

  // Cookies temporaires posés côté client avant OAuth (login/signup)
  const cookieReturnTo = safeReturnTo(readCookie("amoria_returnTo"));
  const cookieLang = readCookie("amoria_lang");
  const cookiePlan = readCookie("amoria_plan");

  // Lang/plan: URL priorité, sinon cookies
  const finalLang = normalizeLocale(url.searchParams.get("lang") ?? cookieLang);
  const finalPlan = normalizePlan(url.searchParams.get("plan") ?? cookiePlan);

  // 1) erreur provider
  const oauthError = url.searchParams.get("error");
  if (oauthError) {
    const p = new URLSearchParams();
    p.set("lang", finalLang);
    p.set("error", oauthError);

    const res = NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
    clearTempCookies(res);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // 2) code obligatoire
  const code = url.searchParams.get("code");
  if (!code) {
    const p = new URLSearchParams();
    p.set("lang", finalLang);
    p.set("error", "missing_code");

    const res = NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
    clearTempCookies(res);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // 3) exchange code -> session (pose les cookies httpOnly)
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const p = new URLSearchParams();
    p.set("lang", finalLang);
    p.set("error", "oauth_exchange");

    const res = NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
    clearTempCookies(res);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // 4) Destination finale (priorité: param URL, puis cookie)
  const finalReturnTo = returnToParam ?? cookieReturnTo;

  if (finalReturnTo) {
    const res = NextResponse.redirect(new URL(finalReturnTo, url.origin));
    clearTempCookies(res);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Fallback
  const p = new URLSearchParams();
  p.set("lang", finalLang);
  p.set("plan", finalPlan);

  const res = NextResponse.redirect(new URL(`/create-amoria?${p.toString()}`, url.origin));
  clearTempCookies(res);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
