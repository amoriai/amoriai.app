import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const langParam = url.searchParams.get("lang") ?? "fr";

  const supabase = createRouteHandlerClient({ cookies });

  if (!code) {
    return NextResponse.redirect(
      new URL(`/?lang=${langParam}`, url.origin)
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("exchangeCodeForSession error:", error);
    return NextResponse.redirect(
      new URL(`/?lang=${langParam}`, url.origin)
    );
  }

  // ✅ ICI TOUT LE MONDE VA TOUJOURS À /my-amoria
  return NextResponse.redirect(
    new URL(`/my-amoria?lang=${langParam}`, url.origin)
  );
}
