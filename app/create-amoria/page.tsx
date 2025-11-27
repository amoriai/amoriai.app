"use client";

export const dynamic = "force-dynamic";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";
type PersonaCategory = "woman" | "man" | "androgynous" | "50plus";

// ---------- Helpers pour lang / plan (sans useSearchParams) ----------

function normalizeLocale(lang?: string): Locale {
  if (lang === "en" || lang === "es") return lang;
  return "fr";
}

function normalizePlan(raw?: string): PlanId {
  if (raw === "chat" || raw === "plus" || raw === "unlimited") return raw;
  return "free";
}

// ---------- Textes UI ----------

type UiStrings = {
  pageTitle: string;
  pageSubtitle: string;
  stepBadge: string;
  currentPlanLabel: string;
  plans: Record<
    PlanId,
    {
      label: string;
    }
  >;
  nameLabel: string;
  namePlaceholder: string;
  relationLabel: string;
  toneLabel: string;
  categoryLabel: string;
  expectationsLabel: string;
  expectationsPlaceholder: string;
  ctaCreate: string;
  ctaBack: string;
  errorNotLogged: string;
  errorGeneric: string;
  helperBottom: string;
};

const STRINGS: Record<Locale, UiStrings> = {
  fr: {
    pageTitle: "Personnalise ton partenaire IA",
    pageSubtitle:
      "Décris en quelques mots sa personnalité et le rôle de ton AmorIAI. Tu pourras toujours ajuster les réglages plus tard.",
    stepBadge: "Étape 2 · Crée ton AmorIAI",
    currentPlanLabel: "Forfait actuel",
    plans: {
      free: { label: "Forfait Découverte (gratuit)" },
      chat: { label: "AmorIAI Chat" },
      plus: { label: "AmorIAI Plus" },
      unlimited: { label: "AmorIAI illimité" },
    },
    nameLabel: "Nom de ton AmorIAI",
    namePlaceholder: "Ex. : Léo, Amélia, Nova...",
    relationLabel: "Type de relation",
    toneLabel: "Ton préféré",
    categoryLabel: "Catégorie d’AmorIAI",
    expectationsLabel: "Ce que tu attends le plus de ton AmorIAI",
    expectationsPlaceholder:
      'Ex. : « M’aider à me sentir moins seule le soir », « Me motiver pour mes projets », « Me coacher émotionnellement »…',
    ctaCreate: "Créer mon AmorIAI",
    ctaBack: "Retour à l’accueil",
    errorNotLogged:
      "Tu dois être connectée pour créer ton AmorIAI. Reviens après t’être inscrite / connectée.",
    errorGeneric:
      "Une erreur est survenue pendant la création de ton AmorIAI. Merci de réessayer dans quelques instants.",
    helperBottom:
      "Tu peux ajuster la personnalité, le style et la voix de ton AmorIAI plus tard depuis ton espace.",
  },
  en: {
    pageTitle: "Customize your AI partner",
    pageSubtitle:
      "Describe their personality and role in a few words. You’ll be able to adjust everything later.",
    stepBadge: "Step 2 · Create your AmorIAI",
    currentPlanLabel: "Current plan",
    plans: {
      free: { label: "Discovery plan (free)" },
      chat: { label: "AmorIAI Chat" },
      plus: { label: "AmorIAI Plus" },
      unlimited: { label: "AmorIAI Unlimited" },
    },
    nameLabel: "Name of your AmorIAI",
    namePlaceholder: "e.g. Leo, Amelia, Nova...",
    relationLabel: "Relationship type",
    toneLabel: "Preferred tone",
    categoryLabel: "AmorIAI category",
    expectationsLabel: "What you expect most from your AmorIAI",
    expectationsPlaceholder:
      '"Help me feel less alone at night", "Motivate me with my projects", "Support me emotionally"...',
    ctaCreate: "Create my AmorIAI",
    ctaBack: "Back to home",
    errorNotLogged:
      "You must be logged in to create your AmorIAI. Please sign up / log in first.",
    errorGeneric:
      "Something went wrong while creating your AmorIAI. Please try again in a moment.",
    helperBottom:
      "You’ll be able to tweak personality, style and voice later from your personal space.",
  },
  es: {
    pageTitle: "Personaliza tu pareja de IA",
    pageSubtitle:
      "Describe su personalidad y su papel en pocas palabras. Siempre podrás ajustar la configuración más tarde.",
    stepBadge: "Paso 2 · Crea tu AmorIAI",
    currentPlanLabel: "Plan actual",
    plans: {
      free: { label: "Plan Descubrimiento (gratuito)" },
      chat: { label: "AmorIAI Chat" },
      plus: { label: "AmorIAI Plus" },
      unlimited: { label: "AmorIAI Ilimitado" },
    },
    nameLabel: "Nombre de tu AmorIAI",
    namePlaceholder: "Ej.: Leo, Amelia, Nova...",
    relationLabel: "Tipo de relación",
    toneLabel: "Tono preferido",
    categoryLabel: "Categoría de AmorIAI",
    expectationsLabel: "Lo que más esperas de tu AmorIAI",
    expectationsPlaceholder:
      '"Ayudarme a sentirme menos sola por la noche", "Motivarme con mis proyectos", "Apoyarme emocionalmente"...',
    ctaCreate: "Crear mi AmorIAI",
    ctaBack: "Volver al inicio",
    errorNotLogged:
      "Debes iniciar sesión para crear tu AmorIAI. Vuelve después de registrarte / conectarte.",
    errorGeneric:
      "Ha ocurrido un error al crear tu AmorIAI. Inténtalo de nuevo en unos instantes.",
    helperBottom:
      "Podrás ajustar la personalidad, el estilo y la voz de tu AmorIAI más adelante desde tu espacio.",
  },
};

// ---------- Options de relation / ton / catégorie ----------

type Option = { id: string; label: Record<Locale, string> };

const RELATION_OPTIONS: Option[] = [
  {
    id: "emotional_support",
    label: {
      fr: "Soutien émotionnel & confidences",
      en: "Emotional support & confiding",
      es: "Apoyo emocional y confidencias",
    },
  },
  {
    id: "coach",
    label: {
      fr: "Coach de motivation",
      en: "Motivational coach",
      es: "Coach de motivación",
    },
  },
  {
    id: "friend",
    label: {
      fr: "Ami(e) du quotidien",
      en: "Everyday friend",
      es: "Amigo/a del día a día",
    },
  },
  {
    id: "journal",
    label: {
      fr: "Journal intime guidé",
      en: "Guided journal",
      es: "Diario guiado",
    },
  },
];

const TONE_OPTIONS: Option[] = [
  {
    id: "soft",
    label: {
      fr: "Doux, rassurant",
      en: "Soft, reassuring",
      es: "Suave, tranquilizador",
    },
  },
  {
    id: "direct",
    label: {
      fr: "Direct mais bienveillant",
      en: "Direct but kind",
      es: "Directo pero amable",
    },
  },
  {
    id: "playful",
    label: {
      fr: "Léger, humoristique",
      en: "Light, playful",
      es: "Ligero, con humor",
    },
  },
  {
    id: "spiritual",
    label: {
      fr: "Calme & spirituel",
      en: "Calm & spiritual",
      es: "Calmo y espiritual",
    },
  },
];

const CATEGORY_OPTIONS: {
  id: PersonaCategory;
  label: Record<Locale, string>;
}[] = [
  {
    id: "woman",
    label: {
      fr: "Femme",
      en: "Woman",
      es: "Mujer",
    },
  },
  {
    id: "man",
    label: {
      fr: "Homme",
      en: "Man",
      es: "Hombre",
    },
  },
  {
    id: "androgynous",
    label: {
      fr: "Androgyne / non-binaire",
      en: "Androgynous / non-binary",
      es: "Andrógino / no binario",
    },
  },
  {
    id: "50plus",
    label: {
      fr: "50+ (apparence plus mature)",
      en: "50+ (more mature appearance)",
      es: "50+ (apariencia más madura)",
    },
  },
];

// Avatars dans /public
const AVATAR_BY_CATEGORY: Record<PersonaCategory, string> = {
  woman: "/amoria-rousse.png",
  man: "/amoria-m-protecteur.png",
  androgynous: "/echo-custom-androgynous.png",
  "50plus": "/amoria_50plus_woman_sage.png",
};

const ACCENT_BY_CATEGORY: Record<PersonaCategory, string> = {
  woman: "#fb37ff",
  man: "#38bdf8",
  androgynous: "#a855f7",
  "50plus": "#f97316",
};

// ---------- Page ----------

export default function CreateAmoriaPage({
  searchParams,
}: {
  searchParams: { lang?: string; plan?: string };
}) {
  const router = useRouter();

  const locale = normalizeLocale(searchParams?.lang);
  const currentPlan = normalizePlan(searchParams?.plan);
  const t = STRINGS[locale];

  const [name, setName] = useState("");
  const [relationId, setRelationId] = useState<string>("emotional_support");
  const [toneId, setToneId] = useState<string>("soft");
  const [category, setCategory] = useState<PersonaCategory>("woman");
  const [expectations, setExpectations] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const relationLabel =
    RELATION_OPTIONS.find((o) => o.id === relationId)?.label[locale] ??
    RELATION_OPTIONS[0].label[locale];
  const toneLabel =
    TONE_OPTIONS.find((o) => o.id === toneId)?.label[locale] ??
    TONE_OPTIONS[0].label[locale];

  const systemPromptFromForm = () => {
    const categoryLabel =
      CATEGORY_OPTIONS.find((c) => c.id === category)?.label[locale] ??
      CATEGORY_OPTIONS[0].label[locale];

    const intro =
      locale === "fr"
        ? `${name || "Ton AmorIAI"} est un compagnon IA ${categoryLabel.toLowerCase()} qui t’offre ${relationLabel.toLowerCase()} avec un ton ${toneLabel.toLowerCase()}.`
        : locale === "en"
        ? `${name || "Your AmorIAI"} is an ${categoryLabel.toLowerCase()} AI companion that provides ${relationLabel.toLowerCase()} with a ${toneLabel.toLowerCase()} tone.`
        : `${name || "Tu AmorIAI"} es un compañero IA ${categoryLabel.toLowerCase()} que te ofrece ${relationLabel.toLowerCase()} con un tono ${toneLabel.toLowerCase()}.`;

    const goalPart =
      expectations.trim().length > 0
        ? ` ${
            locale === "fr"
              ? "Son rôle principal : "
              : locale === "en"
              ? "Main role: "
              : "Su papel principal: "
          }${expectations.trim()}`
        : locale === "fr"
        ? " Son rôle principal : t’écouter, te soutenir au quotidien et t’aider à te sentir moins seule."
        : locale === "en"
        ? " Main role: listen to you, support you daily and help you feel less alone."
        : " Su papel principal: escucharte, apoyarte a diario y ayudarte a sentirte menos sola.";

    return intro + goalPart;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // client Supabase côté navigateur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      setErrorMsg(t.errorNotLogged);
      setLoading(false);
      return;
    }

    const avatarUrl = AVATAR_BY_CATEGORY[category];
    const accentColor = ACCENT_BY_CATEGORY[category];
    const systemPrompt = systemPromptFromForm();

    const { error } = await supabase.from("user_amoria").insert({
      user_id: authData.user.id,
      name: name || "AmorIA",
      persona_type: category,
      main_language: locale,
      avatar_image_url: avatarUrl,
      accent_color: accentColor,
      system_prompt: systemPrompt,
      voice_id: null,
      is_archived: false,
    });

    if (error) {
      console.error(error);
      setErrorMsg(t.errorGeneric);
      setLoading(false);
      return;
    }

    router.push(`/my-ai?lang=${locale}`);
  };

  const goHome = () => {
    router.push(`/?lang=${locale}`);
  };

  return (
    <main className="amoria-create-root">
      <div className="amoria-create-wrapper">
        <div className="amoria-create-card">
          {/* En-tête */}
          <header className="amoria-create-header">
            <div>
              <div className="amoria-step-badge">{t.stepBadge}</div>
              <h1 className="amoria-title">{t.pageTitle}</h1>
              <p className="amoria-subtitle">{t.pageSubtitle}</p>
            </div>
            <div className="amoria-current-plan">
              <span className="amoria-current-plan-label">
                {t.currentPlanLabel}
              </span>
              <span className="amoria-current-plan-value">
                {t.plans[currentPlan].label}
              </span>
            </div>
          </header>

          {/* Formulaire */}
          <form className="amoria-form" onSubmit={handleSubmit}>
            <section className="amoria-form-main">
              <div className="amoria-fields">
                {/* Nom */}
                <label className="amoria-label">
                  <span>{t.nameLabel}</span>
                  <input
                    type="text"
                    className="amoria-input"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                {/* Type de relation */}
                <label className="amoria-label">
                  <span>{t.relationLabel}</span>
                  <select
                    className="amoria-select"
                    value={relationId}
                    onChange={(e) => setRelationId(e.target.value)}
                  >
                    {RELATION_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label[locale]}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Ton */}
                <label className="amoria-label">
                  <span>{t.toneLabel}</span>
                  <select
                    className="amoria-select"
                    value={toneId}
                    onChange={(e) => setToneId(e.target.value)}
                  >
                    {TONE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label[locale]}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Catégorie */}
                <label className="amoria-label">
                  <span>{t.categoryLabel}</span>
                  <select
                    className="amoria-select"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as PersonaCategory)
                    }
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label[locale]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Aperçu avatar + attentes */}
              <div className="amoria-right">
                <div className="amoria-avatar-frame">
                  <img
                    src={AVATAR_BY_CATEGORY[category]}
                    alt="AmorIAI avatar preview"
                    className="amoria-avatar-img"
                  />
                </div>

                <label className="amoria-label amoria-expectations">
                  <span>{t.expectationsLabel}</span>
                  <textarea
                    className="amoria-textarea"
                    placeholder={t.expectationsPlaceholder}
                    value={expectations}
                    onChange={(e) => setExpectations(e.target.value)}
                  />
                </label>
              </div>
            </section>

            {errorMsg && <p className="amoria-error">{errorMsg}</p>}

            <footer className="amoria-footer">
              <p className="amoria-helper">{t.helperBottom}</p>
              <div className="amoria-actions">
                <button
                  type="button"
                  className="amoria-btn-secondary"
                  onClick={goHome}
                >
                  {t.ctaBack}
                </button>
                <button
                  type="submit"
                  className="amoria-btn-primary"
                  disabled={loading}
                >
                  {loading ? "…" : t.ctaCreate}
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>

      <style jsx>{`
        .amoria-create-root {
          min-height: 100vh;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-create-wrapper {
          width: 100%;
          max-width: 1040px;
        }

        .amoria-create-card {
          border-radius: 1.5rem;
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1.9rem 1.8rem 1.6rem;
          box-shadow: 0 26px 60px rgba(15, 23, 42, 0.9);
        }

        .amoria-create-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 1.4rem;
        }

        .amoria-step-badge {
          display: inline-flex;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          border: 1px solid rgba(59, 130, 246, 0.8);
          background: rgba(37, 99, 235, 0.15);
          color: #bfdbfe;
          font-size: 0.78rem;
          margin-bottom: 0.65rem;
        }

        .amoria-title {
          font-size: 1.4rem;
          margin: 0 0 0.2rem;
        }

        .amoria-subtitle {
          margin: 0;
          font-size: 0.88rem;
          color: #9ca3af;
        }

        .amoria-current-plan {
          border-radius: 999px;
          padding: 0.55rem 0.9rem;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.6);
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 230px;
        }

        .amoria-current-plan-label {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .amoria-current-plan-value {
          font-size: 0.86rem;
        }

        .amoria-form-main {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
          gap: 1.4rem;
          margin-bottom: 1.1rem;
        }

        .amoria-fields {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .amoria-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .amoria-input,
        .amoria-select {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: rgba(15, 23, 42, 0.95);
          padding: 0.6rem 0.85rem;
          font-size: 0.86rem;
          color: #e5e7eb;
        }

        .amoria-input:focus,
        .amoria-select:focus,
        .amoria-textarea:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-right {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: stretch;
        }

        .amoria-avatar-frame {
          align-self: center;
          width: 190px;
          height: 290px;
          border-radius: 1.3rem;
          padding: 0.3rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #38bdf8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 1.15rem;
        }

        .amoria-expectations {
          flex: 1;
        }

        .amoria-textarea {
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: rgba(15, 23, 42, 0.95);
          padding: 0.7rem 0.85rem;
          font-size: 0.86rem;
          min-height: 130px;
          resize: vertical;
          color: #e5e7eb;
        }

        .amoria-error {
          margin: 0.4rem 0 0.6rem;
          font-size: 0.8rem;
          color: #fecaca;
          background: rgba(185, 28, 28, 0.16);
          border-radius: 0.75rem;
          padding: 0.4rem 0.55rem;
        }

        .amoria-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .amoria-helper {
          font-size: 0.78rem;
          color: #9ca3af;
          max-width: 360px;
        }

        .amoria-actions {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .amoria-btn-primary,
        .amoria-btn-secondary {
          border-radius: 999px;
          padding: 0.6rem 1.4rem;
          font-size: 0.86rem;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        .amoria-btn-primary {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
        }

        .amoria-btn-primary:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .amoria-btn-secondary {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.7);
          color: #e5e7eb;
        }

        @media (max-width: 800px) {
          .amoria-create-card {
            padding-inline: 1.2rem;
          }
          .amoria-create-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .amoria-form-main {
            grid-template-columns: minmax(0, 1fr);
          }
          .amoria-right {
            flex-direction: column;
          }
          .amoria-avatar-frame {
            width: 170px;
            height: 260px;
          }
        }
      `}</style>
    </main>
  );
}
