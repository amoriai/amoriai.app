import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) return unauthorized();

  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!resendKey) return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY" }, { status: 400 });
  if (!supabaseUrl) return NextResponse.json({ ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 400 });
  if (!serviceRole) return NextResponse.json({ ok: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 400 });

  const resend = new Resend(resendKey);
  const supabase = createClient(supabaseUrl, serviceRole);

  // ✅ test email (pour valider que Resend fonctionne)
  const to = process.env.TEST_EMAIL || "contactamoriai@gmail.com";

  const sent = await resend.emails.send({
    from: "AmorIAI <noreply@amoriai.app>",
    to,
    subject: "AmorIAI cron OK ✅",
    html: `<p>Ton cron AmorIAI fonctionne.</p>`,
  });

  return NextResponse.json({ ok: true, sent });
}
