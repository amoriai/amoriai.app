"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";
type PersonaType = "woman" | "man" | "woman50" | "man50" | "androgynous";

/* ============ AVATARS ============ */

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

/* ============ TEXTES ============ */

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
    genericError:
      "Une erreur est survenue pendant la création de ton AmorIAI. Merci de réessayer.",
    formError:
      "Merci de remplir tous les champs avant de créer ton AmorIAI.",
    previewTitle: "Ta configuration d’abord, la magie ensuite ✨",
    previewText:
      'Ici, tu définis simplement la personnalité et le rôle de ton AmorIAI. Il sera réellement créé quand tu cliqueras sur « Créer mon AmorIAI ».',
  },
  en: {
    stepBadge: "Step 2 · Create your AmorIAI",
    pageTitle: "Customize your AI partner",
    pageSubtitle:
      "Describe their personality and role in your life. You’ll be able to tweak everything later.",
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
      '"Help me feel less alone at night", "Motivate me for my projects", "Emotionally coach me"…',
    helperText:
      "You’ll be able to adjust personality, style and voice later from your space.",
    createButton: "Create my AmorIAI",
    backHome: "Back to home",
    saving: "Creating your AmorIAI…",
    genericError:
      "Something went wrong while creating your AmorIAI. Please try again.",
    formError:
      "Please fill in all fields before creating your AmorIAI.",
    previewTitle: "Set things up first, magic comes after ✨",
    previewText:
      'Here you only define your AmorIAI’s personality and role. It will actually be created when you click “Create my AmorIAI”.',
  },
  es: {
    stepBadge: "Paso 2 · Crea tu AmorIAI",
    pageTitle: "Personaliza tu pareja de IA",
    pageSubtitle:
      "Describe su personalidad y su papel a tu lado. Podrás ajustar la configuración más tarde.",
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
    helperText:
      "Podrás ajustar la personalidad, el estilo y la voz de tu AmorIAI más adelante desde tu espacio.",
    createButton: "Crear mi AmorIAI",
    backHome: "Volver al inicio",
    saving: "Creando tu AmorIAI…",
    genericError:
      "Ocurrió un error al crear tu AmorIAI. Inténtalo de nuevo, por favor.",
    formError:
      "Por favor, completa todos los campos antes de crear tu AmorIAI.",
    previewTitle: "Primero la configuración, luego la magia ✨",
    previewText:
      'Aquí solo defines la personalidad y el papel de tu AmorIAI. Se creará realmente cuando pulses «Crear mi AmorIAI».',
  },
};

const RELATION_OPTIONS: Record<Locale, string[]> = {
  fr: [
    "Soutien émotionnel & confidences",
    "Coach de motivation",
    "Partenaire de discussion quotidien",
    "Journal intime guidé",
  ],
  en: [
    "Emotional support & confidences",
    "Motivation coach",
    "Daily conversation partner",
    "Guided journaling",
  ],
  es: [
    "Apoyo emocional & confidencias",
    "Coach de motivación",
    "Compañero de conversación diario",
    "Diario guiado",
  ],
};

const TONE_OPTIONS: Record<Locale, string[]> = {
  fr: [
    "Doux, rassurant",
    "Direct mais bienveillant",
    "Humoristique & léger",
    "Sérieux & structuré",
  ],
  en: [
    "Soft & reassuring",
    "Direct but kind",
    "Playful & humorous",
    "Serious & structured",
  ],
  es: [
    "Suave & tranquilizador",
    "Directo pero amable",
    "Divertido & ligero",
    "Serio & estructurado",
  ],
};

type CategoryOption = {
  value: PersonaType;
  label: Record<Locale, string>;
};

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: "woman", label: { fr: "Femme", en: "Woman", es: "Mujer" } },
  { value: "man", label: { fr: "Homme", en: "Man", es: "Hombre" } },
  {
    value: "woman50",
    label: { fr: "Femme 50+", en: "Woman 50+", es: "Mujer 50+" },
  },
  {
    value: "man50",
    label: { fr: "Homme 50+", en: "Man 50+", es: "Hombre 50+" },
  },
  {
    value: "androgynous",
    label: {
      fr: "Androgyne / non-binaire",
      en: "Androgynous / non-binary",
      es: "Andrógino / no binario",
    },
  },
];

/* ============ COMPOSANT ============ */

export default function CreateAmoriaPage() {
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("fr");
  const [plan, setPlan] = useState<PlanId>("free");
  const [ready, setReady] = useState(false);

  const [name, setName] = useState("");
  const [relationType, setRelationType] = useState("");
  const [tone, setTone] = useState("");
  const [category, setCategory] = useState<PersonaType | "">("");
  const [expectation, setExpectation] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // lecture query + session
  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get("lang");
      const planParam = params.get("plan");

      if (langParam === "fr" || langParam === "en" || langParam === "es") {
        setLocale(langParam);
      }
      if (
        planParam === "free" ||
        planParam === "chat" ||
        planParam === "plus" ||
        planParam === "unlimited"
      ) {
        setPlan(planParam);
      }

      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        const qp = new URLSearchParams();
        qp.set(
          "lang",
          langParam === "en" || langParam === "es" ? langParam : "fr"
        );
        if (planParam) qp.set("plan", planParam);
        router.push(`/signup?${qp.toString()}`);
        return;
      }

      setReady(true);
    };

    init();
  }, [router]);

  const t = STRINGS[locale];
  const relationOptions = RELATION_OPTIONS[locale];
  const toneOptions = TONE_OPTIONS[locale];

  const handleBackHome = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push("/?" + params.toString());
  };

  const isFormValid =
    name.trim().length > 0 &&
    relationType.trim().length > 0 &&
    tone.trim().length > 0 &&
    category !== "" &&
    expectation.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isFormValid || !category) {
      setErrorMsg(t.formError);
      return;
    }

    setSaving(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        const params = new URLSearchParams();
        params.set("lang", locale);
        params.set("plan", plan);
        router.push("/signup?" + params.toString());
        return;
      }

      const userId = userData.user.id;
      const personaType = category as PersonaType;
      const categoryLabel =
        CATEGORY_OPTIONS.find((c) => c.value === personaType)?.label[locale] ??
        personaType;

      const systemPrompt = `
Tu es ${name}, une AmorIAI de type "${categoryLabel}".
- Type de relation : ${relationType || "non précisé"}.
- Ton préféré : ${tone || "non précisé"}.
- Ce que l’utilisateur attend le plus de toi : ${expectation || "non précisé"}.

Ta mission est d’apporter soutien, écoute et accompagnement bienveillant,
sans jugement, en respectant les limites de l’utilisateur.
      `.trim();

      const avatarUrl = randomAvatar(personaType);

      const { error } = await supabase.from("user_amoria").insert({
        user_id: userId,
        name,
        persona_type: personaType,
        main_language: locale,
        avatar_image_url: avatarUrl,
        accent_color: "#fb37ff",
        system_prompt: systemPrompt,
        voice_id: null,
        is_archived: false,
      });

      if (error) {
        console.error("insert error", error);
        setErrorMsg(error.message || t.genericError);
        return;
      }

      const params = new URLSearchParams();
      params.set("lang", locale);
      router.push("/my-ai?" + params.toString()); // IMPORTANT : my-ai
    } catch (err) {
      console.error(err);
      setErrorMsg(t.genericError);
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <main className="amoria-create-root">
        <div className="amoria-loading-card">
          <p>Chargement de ton espace…</p>
        </div>
      </main>
    );
  }

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
              <span className="amoria-plan-name">{t.planName(plan)}</span>
            </div>
          </div>
        </header>

        <section className="amoria-card">
          {errorMsg && (
            <div className="amoria-banner amoria-banner--error">
              {errorMsg}
            </div>
          )}

          <form className="amoria-layout" onSubmit={handleSubmit} noValidate>
            {/* COLONNE GAUCHE */}
            <div className="amoria-col-left">
              <label className="amoria-field">
                <span className="amoria-label">{t.nameLabel}</span>
                <input
                  type="text"
                  className="amoria-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    locale === "fr"
                      ? "Ex. : Léo, Amélia, Nova…"
                      : locale === "en"
                      ? "e.g. Leo, Amelia, Nova…"
                      : "Ej.: Leo, Amelia, Nova…"
                  }
                />
              </label>

              <label className="amoria-field">
                <span className="amoria-label">{t.relationLabel}</span>
                <select
                  className="amoria-select"
                  value={relationType}
                  onChange={(e) => setRelationType(e.target.value)}
                >
                  <option value="">
                    {locale === "fr"
                      ? "Choisir…"
                      : locale === "en"
                      ? "Choose…"
                      : "Elegir…"}
                  </option>
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
                >
                  <option value="">
                    {locale === "fr"
                      ? "Choisir…"
                      : locale === "en"
                      ? "Choose…"
                      : "Elegir…"}
                  </option>
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
                  onChange={(e) =>
                    setCategory(e.target.value as PersonaType | "")
                  }
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

            {/* COLONNE DROITE */}
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

      <style jsx global>{`
        .amoria-create-root {
          min-height: 100vh;
          padding: 2rem 1.5rem;
          background:
            radial-gradient(circle at top, #020617 0, #020617 40%, #000 80%),
            radial-gradient(circle at bottom, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .amoria-shell {
          width: 100%;
          max-width: 980px;
        }

        .amoria-loading-card {
          margin: 0 auto;
          margin-top: 6rem;
          max-width: 420px;
          border-radius: 1.4rem;
          padding: 1.4rem 1.6rem;
          background: rgba(15, 23, 42, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.5);
          text-align: center;
          font-size: 0.9rem;
          color: #cbd5f5;
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
          background:
            radial-gradient(
              circle at top left,
              rgba(251, 113, 133, 0.2),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(59, 130, 246, 0.2),
              transparent 55%
            ),
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
          padding-right: 2.4rem; /* espace pour la flèche */
          background-image: linear-gradient(
              45deg,
              transparent 50%,
              #e5e7eb 50%
            ),
            linear-gradient(135deg, #e5e7eb 50%, transparent 50%);
          background-position: calc(100% - 1.1rem) 50%,
            calc(100% - 0.7rem) 50%;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
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
          transition: transform 0.1s ease, box-shadow 0.1s ease,
            filter 0.1s ease;
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
