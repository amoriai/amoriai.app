import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Limites de messages texte par mois selon le plan
const PLAN_LIMITS = {
  free: { maxText: 200 },
  chat: { maxText: 400 },
  plus: { maxText: 600 },
  unlimited: { maxText: 10000 },
} as const;

type PlanId = keyof typeof PLAN_LIMITS;

export async function POST(req: Request) {
  try {
    // 1) Récupérer l’utilisateur connecté via Supabase (auth)
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "not_authenticated" },
        { status: 401 }
      );
    }

    // 2) Charger le profil Amoria lié à cet utilisateur
    const { data: profile, error: profileError } = await supabase
      .from("user_amoria")
      .select("id, plan_id, credits")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return NextResponse.json(
        { error: "profile_not_found" },
        { status: 400 }
      );
    }

    const planId = (profile.plan_id || "free") as PlanId;
    const plan = PLAN_LIMITS[planId] ?? PLAN_LIMITS.free;

    // 3) Vérifier la limite de messages texte
    if ((profile.credits ?? 0) >= plan.maxText) {
      return NextResponse.json(
        {
          error: "text_quota_reached",
          planId,
          maxText: plan.maxText,
          message:
            "Tu as atteint la limite de messages texte pour ton forfait actuel.",
        },
        { status: 429 }
      );
    }

    // 4) Lire le body (message + éventuel systemPrompt)
    const body = await req.json();
    const { message, systemPrompt } = body as {
      message: string;
      systemPrompt?: string;
    };

    if (!message) {
      return NextResponse.json(
        { error: "Missing message" },
        { status: 400 }
      );
    }

    // 5) Appel à l’API OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.1-mini",
        input: message,
        system: systemPrompt || "Tu es une IA de compagnie bienveillante.",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return NextResponse.json(
        { error: "OpenAI API error" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text =
      data?.output?.[0]?.content?.[0]?.text ?? "Je ne sais pas.";

    // 6) Incrémenter le compteur de messages (credits)
    const newCredits = (profile.credits ?? 0) + 1;

    const { error: updateError } = await supabase
      .from("user_amoria")
      .update({ credits: newCredits })
      .eq("id", profile.id);

    if (updateError) {
      console.error("Error updating credits:", updateError);
      // On continue quand même à renvoyer la réponse à l’utilisateur
    }

    // 7) Réponse finale au frontend
    return NextResponse.json({
      reply: text,
      planId,
      credits_used: newCredits,
      credits_remaining: plan.maxText - newCredits,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
