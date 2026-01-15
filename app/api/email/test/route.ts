import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const key = process.env.RESEND_API_KEY;
    const to = process.env.TEST_EMAIL;

    if (!key) {
      return NextResponse.json(
        { ok: false, error: "Missing RESEND_API_KEY" },
        { status: 400 }
      );
    }

    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Missing TEST_EMAIL" },
        { status: 400 }
      );
    }

    const resend = new Resend(key);

    const data = await resend.emails.send({
      // ✅ Quand ton domaine Resend est VERIFIED, utilise ça :
      from: "AmorIAI <contact@amoriai.app>",

      // ⚠️ Si ton domaine est encore PENDING, utilise plutôt :
      // from: "onboarding@resend.dev",

      to,
      subject: "Test AmorIAI - Resend OK ✅",
      replyTo: "contactamoriai@gmail.com",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Resend fonctionne ✅</h2>
          <p>Ton email sort bien depuis <b>AmorIAI</b>.</p>
          <p>Tu peux maintenant faire :</p>
          <ul>
            <li>Relance automatique</li>
            <li>Email de confirmation</li>
            <li>Séquence “inactive users”</li>
          </ul>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
