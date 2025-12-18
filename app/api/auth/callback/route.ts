import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const lang = url.searchParams.get("lang") ?? "fr";
  const plan = url.searchParams.get("plan") ?? "free";

  // Si Google/Supabase ne renvoie pas de "code"
  if (!code) {
    return NextResponse.redirect(
      new URL(`/login?error=missing_code&lang=${encodeURIComponent(lang)}`, url.origin)
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  // Si l’échange du code -> session échoue
  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error);
    return NextResponse.redirect(
      new URL(`/login?error=oauth_exchange&lang=${encodeURIComponent(lang)}`, url.origin)
    );
  }

  // ✅ DIRECT vers create-amoria (plus de /auth/post-login)
  return NextResponse.redirect(
    new URL(
      `/create-amoria?lang=${encodeURIComponent(lang)}&plan=${encodeURIComponent(plan)}`,
      url.origin
    ),
    { status: 302 }
  );
}
