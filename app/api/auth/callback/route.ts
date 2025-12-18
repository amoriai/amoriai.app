import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function normalizeLocaleNullable(raw: string | null): Locale | null {
  if (!raw) return null;
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

function normalizePlanNullable(raw: string | null): PlanId | null {
  if (!raw) return null;
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited" ? raw : "free";
}

/**
 * Autorise uniquement un chemin interne:
 * - commence par "/"
 * - refuse "//" (open redirect)
 * - refuse "\" (bypass)
 * - refuse les routes sensibles (évite boucles)
 */
function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v.startsWith("/")) return null;
  if (v.startsWith("//")) return null;
  if (v.includes("\\")) return null;

  // bloque les destinations qui causent des boucles / bypass
  const lower = v.toLowerCase();
  const blockedPrefixes = ["/api/", "/login", "/signup", "/auth", "/api/auth/callback"];
  if (blockedPrefixes.some((p) => lower === p || lower.startsWith(p))) return null;

  return v;
}

function getCookieDecoded(name: string): string | null {
  const c = cookies().get(name)?.value;
  if (!c) return null;
  try {
    return decodeURIComponent(c);
  } catch {
    return c;
  }
}

function clearTempCookies(res: NextResponse) {
  res.cookies.set("amoria_lang", "", { path: "/", maxAge: 0 });
  res.cookies.set("amoria_plan", "", { path: "/", maxAge: 0 });
  res.cookies.set("amoria_returnTo", "", { path: "/", maxAge: 0 });
}

function withLangPlan(dest: string, lang: Locale, plan: PlanId) {
  // Ajoute lang/plan si dest n’a pas déjà des query params (ou s’ils manquent)
  const u = new URL(dest, "http://local");
  if (!u.searchParams.get("lang")) u.searchParams.set("lang", lang);
  if (!u.searchParams.get("plan")) u.searchParams.set("plan", plan);
  return u.pathname + (u.search ? u.search : "");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  console.log("[api/auth/callback] hit:", url.pathname, "keys:", Array.from(url.searchParams.keys()));

  // 1) Erreur provider
  const oauthError = url.searchParams.get("error");
  const oauthErrorDesc = url.searchParams.get("error_description");
  if (oauthError) {
    console.error("[api/auth/callback] oauth error:", oauthError, oauthErrorDesc);

    const lang =
      normalizeLocaleNullable(url.searchParams.get("lang")) ??
      normalizeLocaleNullable(getCookieDecoded("amoria_lang")) ??
      "fr";

    const res = NextResponse.redirect(
      new URL(`/login?lang=${lang}&error=${encodeURIComponent(oauthError)}`, url.origin)
    );
    clearTempCookies(res);
    return res;
  }

  // 2) Code obligatoire
  const code = url.searchParams.get("code");
  if (!code) {
    const lang =
      normalizeLocaleNullable(url.searchParams.get("lang")) ??
      normalizeLocaleNullable(getCookieDecoded("amoria_lang")) ??
      "fr";

    const res = NextResponse.redirect(new URL(`/login?lang=${lang}&error=missing_code`, url.origin));
    clearTempCookies(res);
    return res;
  }

  // 3) Exchange code -> session (met les cookies Supabase)
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[api/auth/callback] exchangeCodeForSession error:", error);

    const lang =
      normalizeLocaleNullable(url.searchParams.get("lang")) ??
      normalizeLocaleNullable(getCookieDecoded("amoria_lang")) ??
      "fr";

    const res = NextResponse.redirect(new URL(`/login?lang=${lang}&error=oauth_exchange`, url.origin));
    clearTempCookies(res);
    return res;
  }

  // 4) Vérifie session
  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr || !sessionData.session?.user) {
    console.error("[api/auth/callback] no session after exchange:", sessionErr);

    const lang =
      normalizeLocaleNullable(url.searchParams.get("lang")) ??
      normalizeLocaleNullable(getCookieDecoded("amoria_lang")) ??
      "fr";

    const res = NextResponse.redirect(new URL(`/login?lang=${lang}&error=no_session`, url.origin));
    clearTempCookies(res);
    return res;
  }

  // 5) Lire lang/plan/returnTo depuis query OU cookies
  const lang =
    normalizeLocaleNullable(url.searchParams.get("lang")) ??
    normalizeLocaleNullable(getCookieDecoded("amoria_lang")) ??
    "fr";

  const plan =
    normalizePlanNullable(url.searchParams.get("plan")) ??
    normalizePlanNullable(getCookieDecoded("amoria_plan")) ??
    "free";

  const returnTo = safeReturnTo(url.searchParams.get("returnTo") ?? getCookieDecoded("amoria_returnTo"));

  // 6) Destination finale
  let dest: string;

  if (returnTo) {
    dest = withLangPlan(returnTo, lang, plan);
  } else if (plan !== "free") {
    dest = `/payment?lang=${lang}&plan=${plan}`;
  } else {
    dest = `/create-amoria?lang=${lang}&plan=${plan}`;
  }

  const res = NextResponse.redirect(new URL(dest, url.origin));
  clearTempCookies(res);
  return res;
}
