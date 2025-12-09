"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";
type PersonaType = "woman" | "man" | "woman50" | "man50" | "androgynous";

// ---------------- AVATARS ----------------

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

// ---------------- TEXTES ----------------

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

// ---------------- COMPONENT ----------------

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

  // Lecture des query params + vérification session
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
      router.push("/my-ai?" + params.toString());
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
        <div className="amoria-create-wrapper">
          <div className="amoria-create-card">
            <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              Chargement de ton espace…
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="amoria-create-root">
      <div className="amoria-create-wrapper">
        <div className="amoria-create-card">
          <header className="amoria-create-header">
            <div className="amoria-step-badge">{t.stepBadge}</div>

            <div className="amoria-create-top">
              <div>
                <h1 className="amoria-create-title">{t.pageTitle}</h1>
                <p className="amoria-create-subtitle">{t.pageSubtitle}</p>
              </div>
              <div className="amoria-plan-pill">
                <span className="amoria-plan-label">
                  {t.currentPlanLabel}
                </span>
                <span className="amoria-plan-name">
                  {t.planName(plan)}
                </span>
              </div>
            </div>
          </header>

          {errorMsg && (
            <div className="amoria-banner amoria-banner--error">
              {errorMsg}
            </div>
          )}

          {/* Formulaire + footer dans le <form> */}
          <form className="amoria-grid" onSubmit={handleSubmit} noValidate>
            <div className="amoria-left">
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
            </div>

            <div className="amoria-right">
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
                  rows={5}
                />
              </label>
            </div>

            {/* FOOTER sous tout le bloc */}
            <div className="amoria-footer">
              <p className="amoria-helper">{t.helperText}</p>

              <div className="amoria-actions">
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
        </div>
      </div>

      <style jsx global>{`
        .amoria-create-root {
          min-height: 100vh;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #000 60%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-create-wrapper {
          width: 100%;
          max-width: 980px;
        }

        .amoria-create-card {
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          box-shadow: 0 22px 55px rgba(15, 23, 42, 0.9);
          padding: 1.8rem 1.7rem 1.5rem;
        }

        .amoria-create-header {
          margin-bottom: 1.1rem;
        }

        .amoria-step-badge {
          display: inline-flex;
          padding: 0.25rem 0.8rem;
          border-radius: 999px;
          border: 1px solid rgba(96, 165, 250, 0.8);
          background: rgba(37, 99, 235, 0.25);
          color: #bfdbfe;
          font-size: 0.78rem;
          margin-bottom: 0.75rem;
        }

        .amoria-create-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .amoria-create-title {
          font-size: 1.3rem;
          margin-bottom: 0.3rem;
        }

        .amoria-create-subtitle {
          font-size: 0.86rem;
          color: #9ca3af;
          max-width: 560px;
        }

        .amoria-plan-pill {
          border-radius: 999px;
          padding: 0.45rem 0.85rem;
          border: 1px solid rgba(148, 163, 184, 0.7);
          display: inline-flex;
          flex-direction: column;
          gap: 0.1rem;
          font-size: 0.75rem;
          background: rgba(15, 23, 42, 0.9);
        }

        .amoria-plan-label {
          color: #9ca3af;
        }

        .amoria-plan-name {
          font-weight: 500;
        }

        .amoria-banner {
          border-radius: 0.9rem;
          padding: 0.55rem 0.9rem;
          font-size: 0.8rem;
          margin-bottom: 0.8rem;
        }

        .amoria-banner--error {
          background: rgba(185, 28, 28, 0.18);
          border: 1px solid rgba(248, 113, 113, 0.8);
          color: #fecaca;
        }

        .amoria-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 1.4rem;
          margin-bottom: 1.1rem;
        }

        .amoria-left,
        .amoria-right {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
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
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.5);
          padding: 0.65rem 0.95rem;
          background: rgba(15, 23, 42, 0.96);
          color: #f9fafb;
          font-size: 0.86rem;
        }

        .amoria-textarea {
          border-radius: 1rem;
          resize: vertical;
          min-height: 120px;
        }

        .amoria-input:focus,
        .amoria-select:focus,
        .amoria-textarea:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-preview-card {
          border-radius: 1.2rem;
          padding: 1rem 1.1rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #38bdf8);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: #f9fafb;
        }

        .amoria-preview-title {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .amoria-preview-text {
          font-size: 0.8rem;
        }

        /* ===== FOOTER sous le bloc ===== */
        .amoria-footer {
          grid-column: 1 / -1; /* largeur complète sous les 2 colonnes */
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.9rem;
          margin-top: 0.6rem;
        }

        .amoria-helper {
          font-size: 0.78rem;
          color: #9ca3af;
          max-width: 460px;
        }

        .amoria-actions {
          display: flex;
          gap: 0.6rem;
          width: 100%;
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        .amoria-btn {
          border-radius: 999px;
          padding: 0.6rem 1.3rem;
          font-size: 0.85rem;
          cursor: pointer;
          border: 1px solid transparent;
          white-space: nowrap;
        }

        .amoria-btn--primary {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
        }

        .amoria-btn--primary:disabled {
          opacity: 0.55;
          cursor: default;
        }

        .amoria-btn--secondary {
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
          border-color: rgba(148, 163, 184, 0.7);
        }

        @media (max-width: 820px) {
          .amoria-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-create-card {
            padding-inline: 1.15rem;
          }
        }

        @media (max-width: 520px) {
          .amoria-actions {
            flex-direction: column;
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
