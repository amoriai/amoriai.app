import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.TEST_EMAIL;

  if (!key) return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY" }, { status: 400 });
  if (!to) return NextResponse.json({ ok: false, error: "Missing TEST_EMAIL" }, { status: 400 });

  const resend = new Resend(key);

  const data = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: "contactamoriai@gmail.com",
    html: "<p>Resend fonctionne ✅</p>",
  });

  return NextResponse.json({ ok: true, data });
}
