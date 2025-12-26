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

function ensureLangPlan(path: string, lang: Locale, plan: PlanId) {
  const url = new URL(path, "http://local");
  if (!url.searchParams.get("lang")) url.searchParams.set("lang", lang);
  if (!url.searchParams.get("plan")) url.searchParams.set("plan", plan);
  return url.pathname + "?" + url.searchParams.toString();
}

function isAllowedReturnTo(path: string) {
  return (
    path.startsWith("/create-amoria") ||
    path.startsWith("/chat") ||
    path.startsWith("/my-amoria")
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const returnToParam = safeReturnTo(url.searchParams.get("returnTo"));
  const cookieReturnTo = safeReturnTo(readCookie("amoria_returnTo"));
  const cookieLang = readCookie("amoria_lang");
  const cookiePlan = readCookie("amoria_plan");

  const finalLang = normalizeLocale(url.searchParams.get("lang") ?? cookieLang);
  const finalPlan = normalizePlan(url.searchParams.get("plan") ?? cookiePlan);

  // Si provider renvoie ?error=...
  const oauthError = url.searchParams.get("error");
  if (oauthError) {
    const p = new URLSearchParams({ lang: finalLang, error: oauthError });
    const res = NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
    clearTempCookies(res);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Où on veut revenir après auth
  let finalReturnTo = returnToParam ?? cookieReturnTo;
  if (!finalReturnTo || !isAllowedReturnTo(finalReturnTo)) finalReturnTo = "/create-amoria";
  const finalWithParams = ensureLangPlan(finalReturnTo, finalLang, finalPlan);

  const supabase = createRouteHandlerClient({ cookies });

  // 1) OAuth Code flow (PKCE) -> ?code=...
  const code = url.searchParams.get("code");

  // 2) Email confirmation / magic link -> ?token_hash=...&type=...
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  // ✅ A) Si on a un code: exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const p = new URLSearchParams({ lang: finalLang, error: "auth_exchange" });
      const res = NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
      clearTempCookies(res);
      res.headers.set("Cache-Control", "no-store");
      return res;
    }

    const res = NextResponse.redirect(new URL(finalWithParams, url.origin));
    clearTempCookies(res);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // ✅ B) Si on a token_hash+type: verifyOtp
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (error) {
      const p = new URLSearchParams({ lang: finalLang, error: "auth_verify" });
      const res = NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
      clearTempCookies(res);
      res.headers.set("Cache-Control", "no-store");
      return res;
    }

    const res = NextResponse.redirect(new URL(finalWithParams, url.origin));
    clearTempCookies(res);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // ✅ C) Fallback IMPORTANT:
  // Si Google renvoie #access_token (hash), le serveur ne peut PAS le lire.
  // On renvoie vers un callback CLIENT qui va consommer le hash et créer la session.
  const p = new URLSearchParams();
  p.set("lang", finalLang);
  p.set("plan", finalPlan);
  p.set("returnTo", finalReturnTo);
  const res = NextResponse.redirect(new URL(`/auth/callback?${p.toString()}`, url.origin));
  clearTempCookies(res);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
