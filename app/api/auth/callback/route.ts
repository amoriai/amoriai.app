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

function clearCookie(name: string) {
  try {
    cookies().set(name, "", { path: "/", maxAge: 0 });
  } catch {
    // ignore
  }
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
    return NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
  }

  // 2) code obligatoire
  const code = url.searchParams.get("code");
  if (!code) {
    const p = new URLSearchParams();
    p.set("lang", finalLang);
    p.set("error", "missing_code");
    return NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
  }

  // 3) exchange code -> session (pose les cookies httpOnly)
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const p = new URLSearchParams();
    p.set("lang", finalLang);
    p.set("error", "oauth_exchange");
    return NextResponse.redirect(new URL(`/login?${p.toString()}`, url.origin));
  }

  // 4) Destination finale (priorité: param URL, puis cookie)
  const finalReturnTo = returnToParam ?? cookieReturnTo;

  // Nettoyage cookies temporaires
  clearCookie("amoria_returnTo");
  clearCookie("amoria_lang");
  clearCookie("amoria_plan");

  // ✅ Si on a une destination explicite, on la respecte
  if (finalReturnTo) {
    return NextResponse.redirect(new URL(finalReturnTo, url.origin));
  }

  // ✅ Fallback SAFE:
  // - si login a été bien câblé, il passera TOUJOURS returnTo=/auth/post-login...
  // - si signup n’a pas mis de returnTo (ou cookies bloqués), on envoie quand même sur create-amoria
  const p = new URLSearchParams();
  p.set("lang", finalLang);
  p.set("plan", finalPlan);

  return NextResponse.redirect(new URL(`/create-amoria?${p.toString()}`, url.origin));
}
