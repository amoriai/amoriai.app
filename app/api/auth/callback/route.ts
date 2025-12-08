// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const langParam = url.searchParams.get("lang") ?? "fr";

  if (!code) {
    // Pas de code → retour au login
    return NextResponse.redirect(
      new URL(`/login?lang=${langParam}`, url.origin)
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("exchangeCodeForSession error", error);
    return NextResponse.redirect(
      new URL(`/login?lang=${langParam}`, url.origin)
    );
  }

  // ✅ IMPORTANT : après Google → TOUJOURS passer par /my-amoria
  return NextResponse.redirect(
    new URL(`/my-amoria?lang=${langParam}`, url.origin)
  );
}
