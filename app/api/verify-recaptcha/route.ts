// app/api/verify-recaptcha/route.ts
import { NextResponse } from "next/server";

const RECAPTCHA_SECRET = "6LcTvCcsAAAAAOqpVcbhgNOH-xUPCAfu7O6gg-nA";

export async function POST(req: Request) {
  if (!RECAPTCHA_SECRET) {
    console.error("RECAPTCHA_SECRET_KEY manquante dans les variables d'environnement");
    return NextResponse.json(
      { success: false, message: "Recaptcha mal configuré" },
      { status: 500 }
    );
  }

  try {
    const { token, action } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token manquant" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    params.append("secret", RECAPTCHA_SECRET);
    params.append("response", token);

    const googleRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = (await googleRes.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    return NextResponse.json({
      success: data.success,
      score: data.score,
      action: data.action,
      errors: data["error-codes"] ?? [],
    });
  } catch (err) {
    console.error("Erreur verify-recaptcha:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur reCAPTCHA" },
      { status: 500 }
    );
  }
}
