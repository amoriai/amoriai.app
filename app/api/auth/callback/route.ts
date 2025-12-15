import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // Si Google/Supabase ne renvoie pas de "code"
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  // Si l’échange du code -> session échoue
  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_exchange", url.origin));
  }

  // ✅ IMPORTANT: ne pas aller direct sur /my-amoria ici.
  // On passe par une page "client" qui laisse le temps au cookie/session d'être dispo.
  return NextResponse.redirect(new URL("/auth/post-login", url.origin), { status: 302 });
}
