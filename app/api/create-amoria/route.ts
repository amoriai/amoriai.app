import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";
type PersonaType = "woman" | "man" | "woman50" | "man50" | "androgynous";

// --- avatars & catégories (même logique que dans la page) ---

const AVATARS: Record<PersonaType, string[]> = {
  woman: [
    "/amoria-blonde.png",
    "/amoria-rousse.png",
    "/amoria-artiste.png",
    "/amoria-passionnee.png",
    "/amoria-mystique.png",
  ],
  man: [
    "/amoria-m-ami.png",
    "/amoria-m-intellectuel.png",
    "/amoria-m-passionne.png",
    "/amoria-m-protecteur.png",
    "/amoria-m-rebelle.png",
    "/amoria-m-romantique.png",
  ],
  woman50: [
    "/amoria_50plus_woman_charisma.png",
    "/amoria_50plus_woman_elegant.png",
    "/amoria_50plus_woman_pro.png",
    "/amoria_50plus_woman_sage.png",
    "/amoria_50plus_woman_spiritual.png",
    "/amoria_50plus_woman_whitehair.png",
  ],
  man50: [
    "/amoria_50plus_man_charm.png",
    "/amoria_50plus_man_elegant.png",
    "/amoria_50plus_man_empathic.png",
    "/amoria_50plus_man_mysterious.png",
    "/amoria_50plus_man_thoughtful.png",
    "/amoria_50plus_man_warm.png",
  ],
  androgynous: [
    "/amor-romantic-androgynous.png",
    "/echo-custom-androgynous.png",
    "/eko-friend-androgynous.png",
    "/lumen-sensual-androgynous.png",
    "/nova-mysterious-androgynous.png",
    "/sora-mentalcoach-androgynous.png",
  ],
};

function randomAvatar(type: PersonaType): string {
  const list = AVATARS[type];
  if (!list || list.length === 0) return "/amoria-avatar-preview.png";
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

const CATEGORY_LABELS: Record<PersonaType, Record<Locale, string>> = {
  woman: { fr: "Femme", en: "Woman", es: "Mujer" },
  man: { fr: "Homme", en: "Man", es: "Hombre" },
  woman50: { fr: "Femme 50+", en: "Woman 50+", es: "Mujer 50+" },
  man50: { fr: "Homme 50+", en: "Man 50+", es: "Hombre 50+" },
  androgynous: {
    fr: "Androgyne / non-binaire",
    en: "Androgynous / non-binary",
    es: "Andrógino / no binario",
  },
};

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error("Missing Supabase env vars for create-amoria");
      return NextResponse.json(
        { error: "supabase_env_missing" },
        { status: 500 }
      );
    }

    const {
      name,
      relationType,
      tone,
      category,
      expectation,
      locale,
      plan,
    }: {
      name: string;
      relationType: string;
      tone: string;
      category: PersonaType;
      expectation: string;
      locale: Locale;
      plan?: PlanId;
    } = await req.json();

    // Validation basique
    if (
      !name?.trim() ||
      !relationType?.trim() ||
      !tone?.trim() ||
      !category ||
      !expectation?.trim()
    ) {
      return NextResponse.json(
        { error: "invalid_payload", message: "Missing fields" },
        { status: 400 }
      );
    }

    // --- client auth avec le token envoyé en header ---
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: req.headers.get("authorization") ?? "",
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      console.error("create-amoria: not_authenticated", userError);
      return NextResponse.json(
        { error: "not_authenticated" },
        { status: 401 }
      );
    }

    // --- client admin pour insérer dans user_amoria ---
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const loc: Locale = locale ?? "fr";
    const personaType: PersonaType = category;
    const categoryLabel =
      CATEGORY_LABELS[personaType]?.[loc] ?? personaType;

    const systemPrompt = `
Tu es ${name}, une AmorIAI de type "${categoryLabel}".
- Type de relation : ${relationType || "non précisé"}.
- Ton préféré : ${tone || "non précisé"}.
- Ce que l’utilisateur attend le plus de toi : ${expectation || "non précisé"}.

Ta mission est d’apporter soutien, écoute et accompagnement bienveillant,
sans jugement, en respectant les limites de l’utilisateur.
    `.trim();

    const avatarUrl = randomAvatar(personaType);

    const { data, error: insertError } = await supabaseAdmin
      .from("user_amoria")
      .insert({
        user_id: user.id,
        name,
        persona_type: personaType,
        main_language: loc,
        avatar_image_url: avatarUrl,
        accent_color: "#fb37ff",
        system_prompt: systemPrompt,
        voice_id: null,
        is_archived: false,
        // plan_id a probablement un default "free" en base
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("create-amoria insert error:", insertError);
      return NextResponse.json(
        { error: "insert_failed", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      amoriaId: data.id,
      plan: plan ?? "free",
    });
  } catch (e: any) {
    console.error("create-amoria server error:", e);
    return NextResponse.json(
      { error: "server_error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
