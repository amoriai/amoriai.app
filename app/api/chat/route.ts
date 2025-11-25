import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { Database } from "@/types/supabase"; // si tu as généré les types, tu peux typer ici

// Limites par plan (texte uniquement ici)
const PLAN_LIMITS = {
  free: { maxText: 200, maxVoice: 0, maxAis: 1 },
  chat: { maxText: 400, maxVoice: 0, maxAis: 2 },
  plus: { maxText: 600, maxVoice: 100, maxAis: 10 },
  unlimited: { maxText: 10000, maxVoice: 300, maxAis: 30 },
} as const;

type PlanId = keyof typeof PLAN_LIMITS;

export async function POST(req: Request) {
  try {
    // 1) Récupérer l'utilisateur connecté via Supabase
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

    // 2) Charger le profil (plan + compteur texte)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan_id, text_used_this_month")
      .eq("id", user.id)
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

    // 3) Vérifier la limite de messages texte pour ce plan
    if (profile.text_used_this_month >= plan.maxText) {
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

    // 4) Lire le body (message + systemPrompt)
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
        model: "gpt-5.1-mini", // modèle pas cher
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

    // 6) Incrémenter le compteur de messages texte
    const newCount = (profile.text_used_this_month || 0) + 1;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ text_used_this_month: newCount })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating text_used_this_month:", updateError);
      // On retourne quand même la réponse à l'utilisateur,
      // mais on logue l'erreur serveur.
    }

    // 7) Réponse finale au frontend
    return NextResponse.json({
      reply: text,
      planId,
      text_used_this_month: newCount,
      text_remaining: plan.maxText - newCount,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
