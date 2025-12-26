"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { maxAmoriaForPlan, type PlanId } from "@/lib/plan";

type Locale = "fr" | "en" | "es";
type PersonaType = "woman" | "man" | "woman50" | "man50" | "androgynous";

/* =========================
   AVATARS
========================= */

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
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * ✅ Choisit un avatar non encore utilisé par l’utilisateur pour ce persona_type,
 * puis retombe en random quand tous les avatars de ce type ont été utilisés.
 */
async function pickAvatarForUser(userId: string, personaType: PersonaType): Promise<string> {
  const candidates = AVATARS[personaType] ?? [];
  if (candidates.length === 0) return "/amoria-avatar-preview.png";

  const { data, error } = await supabase
    .from("user_amoria")
    .select("avatar_image_url")
    .eq("user_id", userId)
    .eq("persona_type", personaType)
    .eq("is_archived", false);

  if (error) {
    console.error("pickAvatarForUser SELECT error:", error);
    return randomAvatar(personaType);
  }

  const used = new Set(
    (data ?? [])
      .map((r: any) => String(r?.avatar_image_url ?? "").trim())
      .filter(Boolean)
  );

  const notUsed = candidates.find((url) => !used.has(url));
  if (notUsed) return notUsed;

  return randomAvatar(personaType);
}

/* =========================
   AUTH (getSession with retry)
========================= */

async function getSessionWithRetry(retries = 6, delayMs = 150) {
  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase.auth.getSession();
    if (error) console.error("auth.getSession error:", error);

    const session = data?.session ?? null;
    if (session?.user) return session;

    await new Promise((r) => setTimeout(r, delayMs));
  }
  return null;
}

/* =========================
   TEXTES
========================= */

type Copy = {
  stepBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  currentPlanLabel: string;
  planName: (p: PlanId) => string;

  nameLabel: string;
  relationLabel: string;
  toneLabel: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  expectationLabel: string;
  expectationPlaceholder: string;

  helperText: string;
  createButton: string;
  backHome: string;

  saving: string;
  genericError: string;
  formError: string;

  previewTitle: string;
  previewText: string;
  loadingText: string;

  limitReachedTitle: string;
  limitReachedBody: (max: number) => string;
  goUpgrade: string;
  goMyAmoria: string;

  choose: string;
  placeholderName: string;
};

const STRINGS: Record<Locale, Copy> = {
  fr: {
    stepBadge: "Étape 2 · Crée ton AmorIAI",
    pageTitle: "Personnalise ton partenaire IA",
    pageSubtitle:
      "Décris en quelques mots sa personnalité et son rôle à tes côtés. Tu pourras toujours ajuster les réglages plus tard.",
    currentPlanLabel: "Forfait actuel :",
    planName: (p) =>
      p === "free"
        ? "Forfait Découverte (gratuit)"
        : p === "chat"
        ? "AmorIAI Chat"
        : p === "plus"
        ? "AmorIAI Plus"
        : "AmorIAI Illimité",

    nameLabel: "Nom de ton AmorIAI",
    relationLabel: "Type de relation",
    toneLabel: "Ton préféré",
    categoryLabel: "Catégorie d’AmorIAI",
    categoryPlaceholder: "Choisir la catégorie…",
    expectationLabel: "Ce que tu attends le plus de ton AmorIAI",
    expectationPlaceholder:
      'Ex. : « M’aider à me sentir moins seule le soir », « Me motiver pour mes projets », « Me coacher émotionnellement »…',

    helperText:
      "Tu pourras ajuster la personnalité, le style et la voix de ton AmorIAI plus tard depuis ton espace.",
    createButton: "Créer mon AmorIAI",
    backHome: "Retour à l’accueil",

    saving: "Création en cours…",
    genericError: "Une erreur est survenue. Merci de réessayer.",
    formError: "Merci de remplir tous les champs avant de créer ton AmorIAI.",

    previewTitle: "Ta configuration d’abord, la magie ensuite ✨",
    previewText:
      'Ici, tu définis simplement la personnalité et le rôle de ton AmorIAI. Il sera réellement créé quand tu cliqueras sur « Créer mon AmorIAI ».',
    loadingText: "Chargement de ton espace…",

    limitReachedTitle: "Limite atteinte",
    limitReachedBody: (max) => `Tu as atteint la limite de ton plan (${max} AmorIA max).`,
    goUpgrade: "Voir les forfaits",
    goMyAmoria: "Retour à mon espace",

    choose: "Choisir…",
    placeholderName: "Ex. : Léo, Amélia, Nova…",
  },
  en: {
    stepBadge: "Step 2 · Create your AmorIAI",
    pageTitle: "Customize your AI partner",
    pageSubtitle: "Describe their personality and role. You can tweak it later.",
    currentPlanLabel: "Current plan:",
    planName: (p) =>
      p === "free"
        ? "Discovery plan (free)"
        : p === "chat"
        ? "AmorIAI Chat"
        : p === "plus"
        ? "AmorIAI Plus"
        : "AmorIAI Unlimited",

    nameLabel: "Your AmorIAI’s name",
    relationLabel: "Relationship type",
    toneLabel: "Preferred tone",
    categoryLabel: "AmorIAI category",
    categoryPlaceholder: "Choose a category…",
    expectationLabel: "What you expect most from your AmorIAI",
    expectationPlaceholder:
      '"Help me feel less alone at night", "Motivate me for my projects", "Coach me emotionally"…',

    helperText: "You can adjust personality, style and voice later from your space.",
    createButton: "Create my AmorIAI",
    backHome: "Back to home",

    saving: "Creating…",
    genericError: "Something went wrong. Please try again.",
    formError: "Please fill in all fields.",

    previewTitle: "Setup first, magic after ✨",
    previewText:
      'Here you only define personality and role. It will be created when you click “Create my AmorIAI”.',
    loadingText: "Loading your space…",

    limitReachedTitle: "Limit reached",
    limitReachedBody: (max) => `You reached your plan limit (${max} max AmorIA).`,
    goUpgrade: "See plans",
    goMyAmoria: "Back to my space",

    choose: "Choose…",
    placeholderName: "e.g. Leo, Amelia, Nova…",
  },
  es: {
    stepBadge: "Paso 2 · Crea tu AmorIAI",
    pageTitle: "Personaliza tu pareja de IA",
    pageSubtitle: "Describe su personalidad y su papel. Podrás ajustarlo después.",
    currentPlanLabel: "Plan actual:",
    planName: (p) =>
      p === "free"
        ? "Plan Descubrimiento (gratis)"
        : p === "chat"
        ? "AmorIAI Chat"
        : p === "plus"
        ? "AmorIAI Plus"
        : "AmorIAI Ilimitado",

    nameLabel: "Nombre de tu AmorIAI",
    relationLabel: "Tipo de relación",
    toneLabel: "Tono preferido",
    categoryLabel: "Categoría de AmorIAI",
    categoryPlaceholder: "Elegir la categoría…",
    expectationLabel: "Lo que más esperas de tu AmorIAI",
    expectationPlaceholder:
      'Ej.: « Ayudarme a sentirme menos sola por la noche », « Motivarme con mis proyectos », « Acompañarme emocionalmente »…',

    helperText: "Podrás ajustar personalidad, estilo y voz más tarde desde tu espacio.",
    createButton: "Crear mi AmorIAI",
    backHome: "Volver al inicio",

    saving: "Creando…",
    genericError: "Ocurrió un error. Inténtalo de nuevo.",
    formError: "Completa todos los campos.",

    previewTitle: "Primero la configuración, luego la magia ✨",
    previewText:
      "Aquí solo defines la personalidad y el papel. Se creará cuando pulses «Crear mi AmorIAI».",
    loadingText: "Cargando tu espacio…",

    limitReachedTitle: "Límite alcanzado",
    limitReachedBody: (max) => `Alcanzaste el límite de tu plan (${max} AmorIA máx).`,
    goUpgrade: "Ver planes",
    goMyAmoria: "Volver a mi espacio",

    choose: "Elegir…",
    placeholderName: "Ej.: Leo, Amelia, Nova…",
  },
};

const RELATION_OPTIONS: Record<Locale, string[]> = {
  fr: ["Soutien émotionnel & confidences", "Coach de motivation", "Partenaire de discussion quotidien", "Journal intime guidé"],
  en: ["Emotional support & confidences", "Motivation coach", "Daily conversation partner", "Guided journaling"],
  es: ["Apoyo emocional & confidencias", "Coach de motivación", "Compañero de conversación diario", "Diario guiado"],
};

const TONE_OPTIONS: Record<Locale, string[]> = {
  fr: ["Doux, rassurant", "Direct mais bienveillant", "Humoristique & léger", "Sérieux & structuré"],
  en: ["Soft & reassuring", "Direct but kind", "Playful & humorous", "Serious & structured"],
  es: ["Suave & tranquilizador", "Directo pero amable", "Divertido & ligero", "Serio & estructurado"],
};

type CategoryOption = { value: PersonaType; label: Record<Locale, string> };
const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: "woman", label: { fr: "Femme", en: "Woman", es: "Mujer" } },
  { value: "man", label: { fr: "Homme", en: "Man", es: "Hombre" } },
  { value: "woman50", label: { fr: "Femme 50+", en: "Woman 50+", es: "Mujer 50+" } },
  { value: "man50", label: { fr: "Homme 50+", en: "Man 50+", es: "Hombre 50+" } },
  { value: "androgynous", label: { fr: "Androgyne / non-binaire", en: "Androgynous / non-binary", es: "Andrógino / no binario" } },
];

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

function normalizePlanCode(raw: any): PlanId {
  const v = String(raw ?? "").toLowerCase().trim();
  return v === "free" || v === "chat" || v === "plus" || v === "unlimited" ? (v as PlanId) : "free";
}

/* =========================
   PAGE
========================= */

export default function CreateAmoriaPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const locale = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);
  const t = STRINGS[locale];

  const relationOptions = RELATION_OPTIONS[locale];
  const toneOptions = TONE_OPTIONS[locale];

  const [ready, setReady] = useState(false);

  const [plan, setPlan] = useState<PlanId>("free");
  const [maxAllowed, setMaxAllowed] = useState<number>(1);
  const [aiCount, setAiCount] = useState<number>(0);

  const [name, setName] = useState("");
  const [relationType, setRelationType] = useState("");
  const [tone, setTone] = useState("");
  const [category, setCategory] = useState<PersonaType | "">("");
  const [expectation, setExpectation] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBackHome = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push("/?" + params.toString());
  };

  const goMyAmoria = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.replace(`/my-amoria?${params.toString()}`);
  };

  const goPricing = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/pricing?${params.toString()}`);
  };

  // ✅ init: auth + plan DB (current=true only) + count DB
  useEffect(() => {
    let cancelled = false;

    const goLogin = () => {
      const qp = new URLSearchParams();
      qp.set("lang", locale);
      router.replace(`/login?${qp.toString()}`);
    };

    const init = async () => {
      setReady(false);
      setErrorMsg(null);

      // 1) Auth (✅ getSession + retry)
      const session = await getSessionWithRetry();
      const user = session?.user;

      if (!user) {
        goLogin();
        return;
      }

      const userId = user.id;

      // 2) Plan: ONLY current=true (no status fallback)
      let planLocal: PlanId = "free";

      const { data: sub, error: subErr } = await supabase
        .from("user_subscriptions")
        .select(
          `
            current,
            pricing_plans:pricing_plan_id (
              code
            )
          `
        )
        .eq("user_id", userId)
        .eq("current", true)
        .maybeSingle();

      if (subErr) {
        console.error("user_subscriptions SELECT error:", subErr);
      } else {
        const code: any = (sub as any)?.pricing_plans?.code;
        planLocal = normalizePlanCode(code);
      }

      const maxLocal = maxAmoriaForPlan(planLocal);

      // 3) Count (non-archived)
      const { count, error: countErr } = await supabase
        .from("user_amoria")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_archived", false);

      if (countErr) {
        console.error("user_amoria COUNT error:", countErr);
      }

      const countLocal = typeof count === "number" ? count : 0;

      if (cancelled) return;

      setPlan(planLocal);
      setMaxAllowed(maxLocal);
      setAiCount(countLocal);
      setReady(true);
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [router, locale]);

  const limitReached = aiCount >= maxAllowed;

  const isFormValid =
    name.trim().length > 0 &&
    relationType.trim().length > 0 &&
    tone.trim().length > 0 &&
    category !== "" &&
    expectation.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (saving) return;
    if (!isFormValid || !category) {
      setErrorMsg(t.formError);
      return;
    }

    // ✅ Hard enforcement client-side
    if (limitReached) {
      setErrorMsg(t.limitReachedBody(maxAllowed));
      return;
    }

    setSaving(true);

    try {
      // Auth (re-check) (✅ getSession + retry)
      const session = await getSessionWithRetry();
      const user = session?.user;

      if (!user) {
        const params = new URLSearchParams();
        params.set("lang", locale);
        router.replace("/login?" + params.toString());
        return;
      }

      const userId = user.id;

      // Re-check count just before insert (avoid race)
      const { count: freshCount, error: freshCountErr } = await supabase
        .from("user_amoria")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_archived", false);

      if (freshCountErr) {
        console.error("user_amoria COUNT(recheck) error:", freshCountErr);
        setErrorMsg(t.genericError);
        return;
      }

      const current = typeof freshCount === "number" ? freshCount : 0;
      if (current >= maxAllowed) {
        setAiCount(current);
        setErrorMsg(t.limitReachedBody(maxAllowed));
        return;
      }

      const personaType = category as PersonaType;
      const categoryLabel =
        CATEGORY_OPTIONS.find((c) => c.value === personaType)?.label[locale] ?? personaType;

      const systemPrompt = `
Tu es ${name}, une AmorIAI de type "${categoryLabel}".
- Type de relation : ${relationType || "non précisé"}.
- Ton préféré : ${tone || "non précisé"}.
- Ce que l’utilisateur attend le plus de toi : ${expectation || "non précisé"}.

Ta mission est d’apporter soutien, écoute et accompagnement bienveillant,
sans jugement, en respectant les limites de l’utilisateur.
      `.trim();

      // ✅ NEW: avatar non utilisé si possible, sinon random
      const avatarUrl = await pickAvatarForUser(userId, personaType);

      const { data: inserted, error: insErr } = await supabase
        .from("user_amoria")
        .insert({
          user_id: userId,
          name,
          persona_type: personaType,
          main_language: locale,
          avatar_image_url: avatarUrl,
          accent_color: "#fb37ff",
          system_prompt: systemPrompt,
          voice_id: null,
          is_archived: false,
        })
        .select("id")
        .maybeSingle();

      if (insErr) {
        console.error("user_amoria INSERT error:", insErr);
        setErrorMsg(insErr.message || t.genericError);
        return;
      }

      if (inserted?.id) {
        router.replace(`/chat?iaId=${inserted.id}&lang=${locale}`);
        return;
      }

      goMyAmoria();
    } catch (err) {
      console.error("create-amoria error:", err);
      setErrorMsg(t.genericError);
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <main className="amoria-create-root">
        <div className="amoria-loading-card">
          <p>{t.loadingText}</p>
          {errorMsg ? (
            <p style={{ marginTop: "0.75rem", color: "#fecaca", fontSize: "0.85rem" }}>
              {errorMsg}
            </p>
          ) : null}
        </div>

        <style jsx global>{`
          .amoria-create-root {
            min-height: 100vh;
            padding: 2rem 1.5rem;
            background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 80%),
              radial-gradient(circle at bottom, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
              "Helvetica Neue", Arial, sans-serif;
            display: flex;
            align-items: flex-start;
            justify-content: center;
          }
          .amoria-loading-card {
            margin: 0 auto;
            margin-top: 6rem;
            max-width: 460px;
            border-radius: 1.4rem;
            padding: 1.4rem 1.6rem;
            background: rgba(15, 23, 42, 0.96);
            border: 1px solid rgba(148, 163, 184, 0.5);
            text-align: center;
            font-size: 0.9rem;
            color: #cbd5f5;
          }
        `}</style>
      </main>
    );
  }

  // ✅ Si limite atteinte -> écran simple
  if (limitReached) {
    return (
      <main className="amoria-create-root">
        <div className="amoria-shell" style={{ maxWidth: 720, width: "100%" }}>
          <section className="amoria-card">
            <div className="amoria-banner amoria-banner--error">
              <strong>{t.limitReachedTitle}</strong>
              <div style={{ marginTop: "0.35rem" }}>{t.limitReachedBody(maxAllowed)}</div>
            </div>

            <div className="amoria-actions amoria-actions--under-right" style={{ justifyContent: "flex-start" }}>
              <button type="button" className="amoria-btn amoria-btn--secondary" onClick={goMyAmoria}>
                {t.goMyAmoria}
              </button>
              <button type="button" className="amoria-btn amoria-btn--primary" onClick={goPricing}>
                {t.goUpgrade}
              </button>
            </div>
          </section>
        </div>

        <style jsx global>{`
          .amoria-create-root {
            min-height: 100vh;
            padding: 2rem 1.5rem;
            background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 80%),
              radial-gradient(circle at bottom, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
              "Helvetica Neue", Arial, sans-serif;
            display: flex;
            align-items: flex-start;
            justify-content: center;
          }
          .amoria-shell {
            width: 100%;
            max-width: 980px;
          }
          .amoria-card {
            margin-top: 5rem;
            border-radius: 1.6rem;
            padding: 1.7rem 1.5rem 1.5rem;
            border: 1px solid rgba(148, 163, 184, 0.45);
            background: radial-gradient(circle at top left, rgba(251, 113, 133, 0.2), transparent 55%),
              radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.2), transparent 55%),
              rgba(15, 23, 42, 0.98);
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.9);
          }
          .amoria-banner {
            border-radius: 0.9rem;
            padding: 0.55rem 0.9rem;
            font-size: 0.9rem;
            margin-bottom: 0.9rem;
          }
          .amoria-banner--error {
            background: rgba(185, 28, 28, 0.2);
            border: 1px solid rgba(248, 113, 113, 0.9);
            color: #fecaca;
          }
          .amoria-actions {
            display: flex;
            gap: 0.65rem;
            margin-top: 1rem;
            flex-wrap: wrap;
          }
          .amoria-btn {
            border-radius: 999px;
            padding: 0.65rem 1.35rem;
            font-size: 0.9rem;
            cursor: pointer;
            border: 1px solid transparent;
            white-space: nowrap;
          }
          .amoria-btn--primary {
            background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
            color: #f9fafb;
            box-shadow: 0 16px 40px rgba(248, 113, 113, 0.75);
            font-weight: 600;
          }
          .amoria-btn--secondary {
            background: rgba(15, 23, 42, 0.95);
            color: #e5e7eb;
            border-color: rgba(148, 163, 184, 0.8);
          }
        `}</style>
      </main>
    );
  }

  // ✅ Formulaire
  return (
    <main className="amoria-create-root">
      <div className="amoria-shell">
        <header className="amoria-header">
          <div className="amoria-step-badge">{t.stepBadge}</div>

          <div className="amoria-header-main">
            <div>
              <h1 className="amoria-title">{t.pageTitle}</h1>
              <p className="amoria-subtitle">{t.pageSubtitle}</p>
            </div>

            <div className="amoria-plan-pill">
              <span className="amoria-plan-label">{t.currentPlanLabel}</span>
              <span className="amoria-plan-name">
                {t.planName(plan)}{" "}
                <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                  · {aiCount}/{maxAllowed}
                </span>
              </span>
            </div>
          </div>
        </header>

        <section className="amoria-card">
          {errorMsg && <div className="amoria-banner amoria-banner--error">{errorMsg}</div>}

          <form className="amoria-layout" onSubmit={handleSubmit} noValidate>
            <div className="amoria-col-left">
              <label className="amoria-field">
                <span className="amoria-label">{t.nameLabel}</span>
                <input
                  type="text"
                  className="amoria-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.placeholderName}
                  disabled={saving}
                />
              </label>

              <label className="amoria-field">
                <span className="amoria-label">{t.relationLabel}</span>
                <select
                  className="amoria-select"
                  value={relationType}
                  onChange={(e) => setRelationType(e.target.value)}
                  disabled={saving}
                >
                  <option value="">{t.choose}</option>
                  {relationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label className="amoria-field">
                <span className="amoria-label">{t.toneLabel}</span>
                <select
                  className="amoria-select"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  disabled={saving}
                >
                  <option value="">{t.choose}</option>
                  {toneOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label className="amoria-field">
                <span className="amoria-label">{t.categoryLabel}</span>
                <select
                  className="amoria-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PersonaType | "")}
                  disabled={saving}
                >
                  <option value="">{t.categoryPlaceholder}</option>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label[locale]}
                    </option>
                  ))}
                </select>
              </label>

              <p className="amoria-helper">{t.helperText}</p>
            </div>

            <div className="amoria-col-right">
              <div className="amoria-preview-card">
                <p className="amoria-preview-title">{t.previewTitle}</p>
                <p className="amoria-preview-text">{t.previewText}</p>
              </div>

              <label className="amoria-field amoria-field--textarea">
                <span className="amoria-label">{t.expectationLabel}</span>
                <textarea
                  className="amoria-textarea"
                  value={expectation}
                  onChange={(e) => setExpectation(e.target.value)}
                  placeholder={t.expectationPlaceholder}
                  rows={6}
                  disabled={saving}
                />
              </label>

              <div className="amoria-actions amoria-actions--under-right">
                <button
                  type="button"
                  className="amoria-btn amoria-btn--secondary"
                  onClick={handleBackHome}
                  disabled={saving}
                >
                  {t.backHome}
                </button>

                <button
                  type="submit"
                  className="amoria-btn amoria-btn--primary"
                  disabled={saving || !isFormValid}
                >
                  {saving ? t.saving : t.createButton}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>

      {/* ✅ Ton CSS global original inchangé */}
      <style jsx global>{`
        .amoria-create-root {
          min-height: 100vh;
          padding: 2rem 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 80%),
            radial-gradient(circle at bottom, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Helvetica Neue", Arial, sans-serif;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .amoria-shell {
          width: 100%;
          max-width: 980px;
        }

        .amoria-header {
          margin-bottom: 1rem;
        }

        .amoria-step-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.85rem;
          border-radius: 999px;
          border: 1px solid rgba(96, 165, 250, 0.9);
          background: radial-gradient(
            circle at 0% 0%,
            rgba(59, 130, 246, 0.7),
            rgba(15, 23, 42, 0.9)
          );
          color: #dbeafe;
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .amoria-header-main {
          margin-top: 0.8rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        .amoria-title {
          font-size: 1.6rem;
          margin-bottom: 0.3rem;
        }

        .amoria-subtitle {
          font-size: 0.9rem;
          color: #9ca3af;
          max-width: 580px;
        }

        .amoria-plan-pill {
          border-radius: 999px;
          padding: 0.45rem 0.9rem;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.95);
          display: inline-flex;
          flex-direction: column;
          gap: 0.1rem;
          font-size: 0.78rem;
        }

        .amoria-plan-label {
          color: #9ca3af;
        }

        .amoria-plan-name {
          font-weight: 500;
        }

        .amoria-card {
          border-radius: 1.6rem;
          padding: 1.7rem 1.5rem 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: radial-gradient(circle at top left, rgba(251, 113, 133, 0.2), transparent 55%),
            radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.2), transparent 55%),
            rgba(15, 23, 42, 0.98);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.9);
        }

        .amoria-banner {
          border-radius: 0.9rem;
          padding: 0.55rem 0.9rem;
          font-size: 0.8rem;
          margin-bottom: 0.9rem;
        }

        .amoria-banner--error {
          background: rgba(185, 28, 28, 0.2);
          border: 1px solid rgba(248, 113, 113, 0.9);
          color: #fecaca;
        }

        .amoria-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 1.6rem;
        }

        .amoria-col-left,
        .amoria-col-right {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
        }

        .amoria-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.82rem;
        }

        .amoria-label {
          color: #cbd5f5;
        }

        .amoria-input,
        .amoria-select,
        .amoria-textarea {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.6);
          padding: 0.65rem 1rem;
          background: radial-gradient(
            circle at top left,
            rgba(15, 23, 42, 0.96),
            rgba(15, 23, 42, 1)
          );
          color: #f9fafb;
          font-size: 0.86rem;
        }

        .amoria-input::placeholder,
        .amoria-textarea::placeholder {
          color: #6b7280;
        }

        .amoria-input:focus,
        .amoria-select:focus,
        .amoria-textarea:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.45);
        }

        .amoria-select {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 2.4rem;
          background-image: linear-gradient(45deg, transparent 50%, #e5e7eb 50%),
            linear-gradient(135deg, #e5e7eb 50%, transparent 50%);
          background-position: calc(100% - 1.1rem) 50%, calc(100% - 0.7rem) 50%;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
        }

        .amoria-select option {
          background-color: #020617;
          color: #f9fafb;
        }

        .amoria-field--textarea .amoria-textarea {
          border-radius: 1rem;
          resize: vertical;
          min-height: 140px;
        }

        .amoria-preview-card {
          border-radius: 1.2rem;
          padding: 1rem 1.2rem;
          background: linear-gradient(130deg, #fb37ff, #ff6b9c, #38bdf8);
          color: #f9fafb;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.65);
          animation: amoriaGlow 7s ease-in-out infinite;
        }

        .amoria-preview-title {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .amoria-preview-text {
          font-size: 0.82rem;
        }

        .amoria-helper {
          margin-top: 0.35rem;
          font-size: 0.78rem;
          color: #9ca3af;
          max-width: 420px;
        }

        .amoria-actions {
          display: flex;
          gap: 0.65rem;
        }

        .amoria-actions--under-right {
          margin-top: 0.9rem;
          justify-content: flex-end;
        }

        .amoria-btn {
          border-radius: 999px;
          padding: 0.65rem 1.35rem;
          font-size: 0.85rem;
          cursor: pointer;
          border: 1px solid transparent;
          white-space: nowrap;
        }

        .amoria-btn--primary {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.75);
          font-weight: 600;
          transition: transform 0.1s ease, box-shadow 0.1s ease, filter 0.1s ease;
        }

        .amoria-btn--primary:disabled {
          opacity: 0.55;
          cursor: default;
          box-shadow: none;
          filter: grayscale(0.1);
        }

        .amoria-btn--primary:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 22px 55px rgba(248, 113, 113, 0.9);
        }

        .amoria-btn--secondary {
          background: rgba(15, 23, 42, 0.95);
          color: #e5e7eb;
          border-color: rgba(148, 163, 184, 0.8);
        }

        @keyframes amoriaGlow {
          0% {
            box-shadow: 0 16px 40px rgba(248, 113, 113, 0.55);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 20px 55px rgba(248, 113, 113, 0.9);
            transform: translateY(-1px);
          }
          100% {
            box-shadow: 0 16px 40px rgba(248, 113, 113, 0.55);
            transform: translateY(0);
          }
        }

        @media (max-width: 860px) {
          .amoria-layout {
            grid-template-columns: minmax(0, 1fr);
          }
          .amoria-actions--under-right {
            justify-content: flex-start;
          }
        }

        @media (max-width: 520px) {
          .amoria-create-root {
            padding-inline: 1.1rem;
          }
          .amoria-card {
            padding-inline: 1.15rem;
          }
          .amoria-actions--under-right {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .amoria-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
