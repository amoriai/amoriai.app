import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id manquant" },
        { status: 400 }
      );
    }

    // Supabase client (server-side)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 30 IA préconfigurées
    const templates = Array.from({ length: 30 }).map((_, i) => ({
      user_id,
      name: `AmorIA ${i + 1}`,
      persona_type: "custom",
      main_language: "fr",
      avatar_image_url: `/avatars/default_${(i % 6) + 1}.png`,
      accent_color: ["#ff6b9c", "#6b6bff", "#ffb347", "#8affc1", "#b55bff", "#ffc1e3"][i % 6],
      system_prompt: `Tu es une version personnalisée d’AmorIA numéro ${i + 1}.`,
      voice_id: null,
      is_archived: false,
    }));

    // Insertion groupée dans Supabase
    const { error } = await supabase
      .from("user_amoria")
      .insert(templates);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erreur Supabase", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "30 IA créées avec succès",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
