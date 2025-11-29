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
    // 1) Utilisateur connecté via Supabase
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

    // 2) Body de la requête (vient du ChatClient)
    const body = await req.json();
    const { message, iaId, systemPrompt } = body as {
      message: string;
      iaId?: string;
      systemPrompt?: string;
    };

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Missing message" },
        { status: 400 }
      );
    }

    // 3) Charger la ligne user_amoria correspondant à CETTE IA
    //    (et appartenant bien à cet utilisateur)
    let query = supabase
      .from("user_amoria")
      .select("id, user_id, plan_id, plan, credits, system_prompt")
      .eq("user_id", user.id);

    if (iaId) {
      query = query.eq("id", iaId);
    }

    const { data: profile, error: profileError } = await query.maybeSingle();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return NextResponse.json(
        { error: "profile_not_found" },
        { status: 400 }
      );
    }

    // 4) Déterminer le plan et la limite
    const planId = (profile.plan_id || profile.plan || "free") as PlanId;
    const plan = PLAN_LIMITS[planId] ?? PLAN_LIMITS.free;

    // 5) Vérifier la limite de messages texte pour CETTE IA
    const currentCredits = profile.credits ?? 0;
    if (currentCredits >= plan.maxText) {
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

    // 6) Construire le system prompt
    const mergedSystemPrompt =
      systemPrompt ||
      profile.system_prompt ||
      "Tu es une IA de compagnie bienveillante.";

    // 7) Appel OpenAI
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
        system: mergedSystemPrompt,
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

    // 8) Incrémenter les crédits de CETTE IA
    const newCredits = currentCredits + 1;

    const { error: updateError } = await supabase
      .from("user_amoria")
      .update({ credits: newCredits })
      .eq("id", profile.id);

    if (updateError) {
      console.error("Error updating credits:", updateError);
      // on continue quand même
    }

    // 9) Réponse envoyée au frontend
    return NextResponse.json({
      reply: text,
      planId,
      credits_used: newCredits,
      credits_remaining: Math.max(plan.maxText - newCredits, 0),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
