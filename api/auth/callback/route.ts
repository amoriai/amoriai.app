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

/**
 * Autorise uniquement un chemin interne:
 * - commence par "/"
 * - refuse "//" (open redirect)
 * - refuse "\" (bypass)
 */
function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v.startsWith("/")) return null;
  if (v.startsWith("//")) return null;
  if (v.includes("\\")) return null;
  return v;
}

function getCookieDecoded(name: string): string | null {
  const c = cookies().get(name)?.value;
  if (!c) return null;
  try {
    return decodeURIComponent(c);
  } catch {
    return c; // au pire, non décodé
  }
}

function clearTempCookies(res: NextResponse) {
  res.cookies.set("amoria_lang", "", { path: "/", maxAge: 0 });
  res.cookies.set("amoria_plan", "", { path: "/", maxAge: 0 });
  res.cookies.set("amoria_returnTo", "", { path: "/", maxAge: 0 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Logs utiles (Vercel logs / local)
  console.log("[auth/callback] hit:", url.toString());

  // Certains providers renvoient une erreur directement
  const oauthError = url.searchParams.get("error");
  const oauthErrorDesc = url.searchParams.get("error_description");
  if (oauthError) {
    console.error("[auth/callback] oauth error:", oauthError, oauthErrorDesc);

    const lang = normalizeLocale(getCookieDecoded("amoria_lang"));
    const res = NextResponse.redirect(new URL(`/login?lang=${lang}&error=${encodeURIComponent(oauthError)}`, url.origin));
    clearTempCookies(res);
    return res;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    const lang = normalizeLocale(getCookieDecoded("amoria_lang"));
    const res = NextResponse.redirect(new URL(`/login?lang=${lang}&error=missing_code`, url.origin));
    clearTempCookies(res);
    return res;
  }

  const supabase = createRouteHandlerClient({ cookies });

  // Exchange code -> session
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error);

    const lang = normalizeLocale(getCookieDecoded("amoria_lang"));
    const res = NextResponse.redirect(new URL(`/login?lang=${lang}&error=oauth_exchange`, url.origin));
    clearTempCookies(res);
    return res;
  }

  // Confirmer la session (optionnel mais utile)
  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr || !sessionData.session?.user) {
    console.error("[auth/callback] no session after exchange:", sessionErr);

    const lang = normalizeLocale(getCookieDecoded("amoria_lang"));
    const res = NextResponse.redirect(new URL(`/login?lang=${lang}&error=no_session`, url.origin));
    clearTempCookies(res);
    return res;
  }

  // ✅ Lire les infos depuis cookies (posés AVANT redirect Google)
  const lang = normalizeLocale(getCookieDecoded("amoria_lang"));
  const plan = normalizePlan(getCookieDecoded("amoria_plan"));
  const returnTo = safeReturnTo(getCookieDecoded("amoria_returnTo"));

  // ✅ Destination finale
  let dest = `/create-amoria?lang=${lang}&plan=${plan}`;
  if (returnTo) dest = returnTo;
  else if (plan !== "free") dest = `/subscription?lang=${lang}&plan=${plan}`;

  const res = NextResponse.redirect(new URL(dest, url.origin));
  clearTempCookies(res);
  return res;
}
