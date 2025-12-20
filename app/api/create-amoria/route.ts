import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";
type PersonaType = "woman" | "man" | "woman50" | "man50" | "androgynous";

/* ===========================
   Avatars & labels
=========================== */

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

function randomAvatar(type: PersonaType): string {
  const list = AVATARS[type];
  if (!list || list.length === 0) return "/amoria-avatar-preview.png";
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function normalizeLocale(raw: unknown): Locale {
  const v = String(raw ?? "").toLowerCase();
  return v === "fr" || v === "en" || v === "es" ? (v as Locale) : "fr";
}

function normalizePersonaType(raw: unknown): PersonaType | null {
  const v = String(raw ?? "").toLowerCase().trim();
  return v === "woman" || v === "man" || v === "woman50" || v === "man50" || v === "androgynous"
    ? (v as PersonaType)
    : null;
}

function normalizePlanCode(raw: unknown): PlanId {
  const v = String(raw ?? "").toLowerCase().trim();
  return v === "free" || v === "chat" || v === "plus" || v === "unlimited" ? (v as PlanId) : "free";
}

// ⚠️ IMPORTANT: applique ici la même règle que ton lib/plan côté front
function maxAmoriaForPlan(plan: PlanId): number {
  switch (plan) {
    case "chat":
      return 2;
    case "plus":
      return 10;
    case "unlimited":
      return 30;
    default:
      return 1; // free
  }
}

function hasBearer(authHeader: string) {
  return /^Bearer\s+.+$/i.test((authHeader || "").trim());
}

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error("Missing Supabase env vars for create-amoria");
      return NextResponse.json({ error: "supabase_env_missing" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization") ?? "";
    if (!hasBearer(authHeader)) {
      return NextResponse.json({ error: "missing_or_invalid_authorization" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const name = String(body?.name ?? "").trim();
    const relationType = String(body?.relationType ?? "").trim();
    const tone = String(body?.tone ?? "").trim();
    const expectation = String(body?.expectation ?? "").trim();
    const loc = normalizeLocale(body?.locale);
    const personaType = normalizePersonaType(body?.category);

    if (!name || !relationType || !tone || !expectation || !personaType) {
      return NextResponse.json(
        { error: "invalid_payload", message: "Missing/invalid fields" },
        { status: 400 }
      );
    }

    // 1) Auth user via JWT du front
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      console.error("create-amoria: not_authenticated", userError);
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    // 2) Admin client (lecture plan + insert)
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // 2.1) Lire le plan depuis la DB (current=true)
    let plan: PlanId = "free";

    const { data: sub, error: subErr } = await supabaseAdmin
      .from("user_subscriptions")
      .select(
        `
          pricing_plan_id,
          current,
          pricing_plans:pricing_plan_id (
            code
          )
        `
      )
      .eq("user_id", user.id)
      .eq("current", true)
      .maybeSingle();

    if (subErr) {
      console.error("create-amoria: subscription read error:", subErr);
      // On ne bloque pas, mais on retombe sur free
    }

    const planCode = (sub as any)?.pricing_plans?.code;
    plan = normalizePlanCode(planCode);

    const maxAllowed = maxAmoriaForPlan(plan);

    // 2.2) Compter les IA actives (non archivées)
    const { count, error: countErr } = await supabaseAdmin
      .from("user_amoria")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_archived", false);

    if (countErr) {
      console.error("create-amoria: user_amoria count error:", countErr);
      return NextResponse.json({ error: "count_failed" }, { status: 500 });
    }

    const aiCount = typeof count === "number" ? count : 0;

    if (aiCount >= maxAllowed) {
      return NextResponse.json(
        { error: "limit_reached", plan, maxAllowed, aiCount },
        { status: 403 }
      );
    }

    // 3) Construire prompt
    const categoryLabel = CATEGORY_LABELS[personaType]?.[loc] ?? personaType;

    const systemPrompt = `
Tu es ${name}, une AmorIAI de type "${categoryLabel}".
- Type de relation : ${relationType}.
- Ton préféré : ${tone}.
- Ce que l’utilisateur attend le plus de toi : ${expectation}.

Ta mission est d’apporter soutien, écoute et accompagnement bienveillant,
sans jugement, en respectant les limites de l’utilisateur.
    `.trim();

    const avatarUrl = randomAvatar(personaType);

    // 4) Insert
    const { data: inserted, error: insertError } = await supabaseAdmin
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
      })
      .select("id")
      .single();

    if (insertError || !inserted?.id) {
      console.error("create-amoria insert error:", insertError);
      return NextResponse.json(
        { error: "insert_failed", details: insertError?.message ?? "unknown" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      amoriaId: inserted.id,
      plan,
      maxAllowed,
      aiCount: aiCount + 1,
    });
  } catch (e: any) {
    console.error("create-amoria server error:", e);
    return NextResponse.json(
      { error: "server_error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
