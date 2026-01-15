import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const data = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "tonemail@gmail.com",
    subject: "Test AmorIAI",
    html: "<p>Resend fonctionne ✅</p>",
  });

  return NextResponse.json(data);
}
