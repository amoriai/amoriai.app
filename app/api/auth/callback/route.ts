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

/** Ajoute lang/plan si pas déjà présents dans l'URL */
function ensureLangPlan(path: string, lang: Locale, plan: PlanId) {
  const hasQuery = path.includes("?");
  const url = new URL(path, "http://local"); // base dummy
  if (!url.searchParams.get("lang")) url.searchParams.set("lang", lang);
  if (!url.searchParams.get("plan")) url.searchParams.set("plan", plan);
  return url.pathname + "?" + url.searchParams.toString();
}

/** Optionnel mais recommandé : whitelist des routes autorisées */
function isAllowedReturnTo(path: string) {
  // Autorise seulement ces écrans finaux (ajoute d'autres si besoin)
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

  // Destination finale (priorité param, puis cookie)
  let finalReturnTo = returnToParam ?? cookieReturnTo;

  // ✅ sécurité + anti-page-intermédiaire : si returnTo pointe ailleurs, on ignore
  if (!finalReturnTo || !isAllowedReturnTo(finalReturnTo)) {
    finalReturnTo = "/create-amoria";
  }

  // ✅ injecte lang/plan si manquants
  const finalWithParams = ensureLangPlan(finalReturnTo, finalLang, finalPlan);

  const res = NextResponse.redirect(new URL(finalWithParams, url.origin));
  clearTempCookies(res);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
