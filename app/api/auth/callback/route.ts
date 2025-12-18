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
 * Autorise uniquement:
 * - chemins relatifs internes qui commencent par "/"
 * - sans protocole (http/https), sans "//", sans backslashes
 */
function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;

  // Trim + refuse backslashes (Windows-style) pour éviter des bypass
  const v = raw.trim();
  if (!v.startsWith("/")) return null;
  if (v.startsWith("//")) return null;
  if (v.includes("\\")) return null;

  // Empêche les URLs absolues déguisées dans des paramètres
  // (ex: "/\\evil.com" déjà bloqué par backslash, ou "/%2F%2Fevil.com" côté decode)
  // Ici on garde simple: chemins internes seulement.
  return v;
}

function buildUrl(origin: string, pathWithQuery: string) {
  return new URL(pathWithQuery, origin);
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Logs utiles pour débug (vercel logs)
  console.log("[auth/callback] hit:", url.toString());

  // Certaines erreurs OAuth arrivent via ces params
  const oauthError = url.searchParams.get("error");
  const oauthErrorDesc = url.searchParams.get("error_description");

  const code = url.searchParams.get("code");
  const lang = normalizeLocale(url.searchParams.get("lang"));
  const plan = normalizePlan(url.searchParams.get("plan"));
  const returnTo = safeReturnTo(url.searchParams.get("returnTo"));

  // Si provider renvoie une erreur directement
  if (oauthError) {
    console.error("[auth/callback] oauth error:", oauthError, oauthErrorDesc);
    return NextResponse.redirect(
      buildUrl(
        url.origin,
        `/login?lang=${lang}&error=${encodeURIComponent(oauthError)}`
      )
    );
  }

  // Pas de code => retour login (avec langue)
  if (!code) {
    return NextResponse.redirect(
      buildUrl(url.origin, `/login?lang=${lang}&error=missing_code`)
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  // Échange code -> session (cookies)
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error);
    return NextResponse.redirect(
      buildUrl(url.origin, `/login?lang=${lang}&error=oauth_exchange`)
    );
  }

  // Optionnel mais utile: confirmer la session après échange
  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr || !sessionData.session?.user) {
    console.error("[auth/callback] no session after exchange:", sessionErr);
    return NextResponse.redirect(
      buildUrl(url.origin, `/login?lang=${lang}&error=no_session`)
    );
  }

  // 1) priorité returnTo (si safe)
  if (returnTo) {
    return NextResponse.redirect(buildUrl(url.origin, returnTo));
  }

  // 2) payant -> subscription
  if (plan !== "free") {
    return NextResponse.redirect(
      buildUrl(url.origin, `/subscription?lang=${lang}&plan=${plan}`)
    );
  }

  // 3) free -> create-amoria direct
  return NextResponse.redirect(
    buildUrl(url.origin, `/create-amoria?lang=${lang}&plan=${plan}`)
  );
}
