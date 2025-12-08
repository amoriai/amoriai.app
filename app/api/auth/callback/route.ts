import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const langParam = url.searchParams.get("lang") ?? "fr";

  // Pas de code → on renvoie au login
  if (!code) {
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

  // ✅ IMPORTANT : après Google, on va TOUJOURS sur /my-amoria
  // C'est /my-amoria qui décidera ensuite : chat ou page "Créer ton AmorIA"
  return NextResponse.redirect(
    new URL(`/my-amoria?lang=${langParam}`, url.origin)
  );
}
