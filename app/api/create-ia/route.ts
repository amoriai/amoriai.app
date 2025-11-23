// app/api/create-ia/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Types de ce que le front envoie à l’API
type CreateAmoriaBody = {
  userId: string;          // id de l’utilisateur (auth.users.id)
  name: string;
  personaType: string;     // ex: "feminine", "masculine", "androgyne", etc.
  mainLanguage: string;    // "fr" | "en" | "es"
  avatarImageUrl?: string;
  accentColor?: string;
  systemPrompt: string;    // prompt système de l’IA
  voiceId?: string;
};

// Petit helper pour créer le client Supabase côté serveur
function getSupabaseServerClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase env vars are missing");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * POST /api/create-ia
 * Crée un nouvel AmorIA pour un utilisateur.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateAmoriaBody>;

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

    // Validation minimum
    if (!userId || !name || !personaType || !mainLanguage || !systemPrompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
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
      .select("*")
      .single();

    if (error) {
      console.error("Error inserting user_amoria:", error);
      return NextResponse.json(
        { error: "Failed to create AmorIA" },
        { status: 500 }
      );
    }

    return NextResponse.json({ amoria: data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in POST /api/create-ia:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/create-ia?userId=...
 * (optionnel) Retourne la liste des AmorIA non archivés d’un user.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId in query params" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("user_amoria")
      .select("*")
      .eq("user_id", userId)
      .eq("is_archived", false)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching user_amoria:", error);
      return NextResponse.json(
        { error: "Failed to fetch AmorIAs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ amoriaList: data ?? [] }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in GET /api/create-ia:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
