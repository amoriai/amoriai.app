// app/api/verify-recaptcha/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important: reCAPTCHA = appel externe

type GoogleVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export async function POST(req: Request) {
  const secret = process.env.RECAPTCHA_SECRET_KEY || "";

  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY manquante dans Vercel");
    return NextResponse.json(
      { success: false, message: "reCAPTCHA mal configuré" },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      token?: string;
      action?: string;
    };

    const token = body.token;
    const expectedAction = body.action; // ex: "signup"

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Token manquant" },
        { status: 400 }
      );
    }

    // Appel Google
    const params = new URLSearchParams();
    params.set("secret", secret);
    params.set("response", token);

    const googleRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = (await googleRes.json().catch(() => null)) as GoogleVerifyResponse | null;

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Réponse reCAPTCHA invalide" },
        { status: 502 }
      );
    }

    // Si Google dit non => non
    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message: "reCAPTCHA refusé",
          score: data.score ?? null,
          action: data.action ?? null,
          errors: data["error-codes"] ?? [],
        },
        { status: 200 }
      );
    }

    // Vérifie l'action si on en attend une
    if (expectedAction && data.action && data.action !== expectedAction) {
      return NextResponse.json(
        {
          success: false,
          message: "Action reCAPTCHA invalide",
          score: data.score ?? null,
          action: data.action ?? null,
          errors: ["action-mismatch"],
        },
        { status: 200 }
      );
    }

    // Seuil de score (ajustable)
    const score = typeof data.score === "number" ? data.score : 0;
    const MIN_SCORE = 0.5;

    if (score < MIN_SCORE) {
      return NextResponse.json(
        {
          success: false,
          message: "Score reCAPTCHA trop bas",
          score,
          action: data.action ?? null,
          errors: ["low-score"],
        },
        { status: 200 }
      );
    }

    // OK
    return NextResponse.json(
      {
        success: true,
        score,
        action: data.action ?? expectedAction ?? null,
        errors: [],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur verify-recaptcha:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur reCAPTCHA" },
      { status: 500 }
    );
  }
}
