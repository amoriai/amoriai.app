// app/api/create-ia/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type CreateIARequest = {
  userId: string;          // id Supabase de l'utilisateur
  name: string;            // nom de l’AmorIA (ex : “Lyra perso”)
  personaType: string;     // ex : "feminine", "masculine", "androgynous"
  mainLanguage: string;    // "fr" | "en" | "es"
  avatarImageUrl?: string;
  accentColor?: string;
  systemPrompt: string;    // texte de personnalité
  voiceId?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateIARequest>;

    const {
      userId,
      name,
      personaType,
      mainLanguage,
      avatarImageUrl,
      accentColor,
      systemPrompt,
      voiceId,
    } = body;

    // 🔒 Vérification minimale
    if (!userId || !name || !personaType || !mainLanguage || !systemPrompt) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    // 💾 Insertion dans la table user_amoria
    const { data, error } = await supabaseAdmin
      .from("user_amoria")
      .insert({
        user_id: userId,
        name,
        persona_type: personaType,
        main_language: mainLanguage,
        avatar_image_url: avatarImageUrl ?? null,
        accent_color: accentColor ?? null,
        system_prompt: systemPrompt,
        voice_id: voiceId ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création de l’AmorIA." },
        { status: 500 }
      );
    }

    // ✅ On renvoie l’AmorIA créée
    return NextResponse.json({ ia: data }, { status: 201 });
  } catch (err) {
    console.error("create-ia route error:", err);
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }
}
