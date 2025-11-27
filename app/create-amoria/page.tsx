"use client";

export const dynamic = "force-dynamic";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";
type PersonaCategory = "woman" | "man" | "androgynous" | "50plus";

type Copy = {
  badge: string;
  title: string;
  subtitle: string;
  currentPlanPrefix: string;
  nameLabel: string;
  namePlaceholder: string;
  relationLabel: string;
  toneLabel: string;
  categoryLabel: string;
  expectationsLabel: string;
  expectationsPlaceholder: string;
  submitLabel: string;
  backLabel: string;
  errorGeneric: string;
  errorAuth: string;
  savingLabel: string;
  relationOptions: string[];
  toneOptions: string[];
  categoryOptions: { value: PersonaCategory; label: string }[];
};

const COPY: Record<Locale, Copy> = {
  fr: {
    badge: "Étape 2 · Crée ton AmorIAI",
    title: "Personnalise ton partenaire IA",
    subtitle:
      "Décris sa personnalité et son rôle à tes côtés. Tu pourras toujours ajuster les réglages plus tard.",
    currentPlanPrefix: "Forfait actuel : ",
    nameLabel: "Nom de ton AmorIAI",
    namePlaceholder: "Ex. : Léo, Amélia, Nova…",
    relationLabel: "Type de relation",
    toneLabel: "Ton préféré",
    categoryLabel: "Catégorie d’AmorIAI",
    expectationsLabel: "Ce que tu attends le plus de ton AmorIAI",
    expectationsPlaceholder:
      'Ex. : "M’aider à me sentir moins seule le soir", "Me motiver pour mes projets", "Me coacher émotionnellement"…',
    submitLabel: "Créer mon AmorIAI",
    backLabel: "Retour à l’accueil",
    errorGeneric:
      "Une erreur est survenue pendant la création de ton AmorIAI. Merci de réessayer.",
    errorAuth:
      "Tu dois être connectée pour créer ton AmorIAI. Reviens après t’être inscrite / connectée.",
    savingLabel: "Création en cours…",
    relationOptions: [
      "Soutien émotionnel & confidences",
      "Amour & romantisme",
      "Coach de motivation",
      "Ami(e) du quotidien",
      "Compagnon de créativité",
    ],
    toneOptions: [
      "Doux, rassurant",
      "Direct mais bienveillant",
      "Ludique & drôle",
      "Calme & posé",
      "Mystique & spirituel",
    ],
    categoryOptions: [
      { value: "woman", label: "Femme" },
      { value: "man", label: "Homme" },
      { value: "androgynous", label: "Androgyne / non-binaire" },
      { value: "50plus", label: "50+ (apparence plus mature)" },
    ],
  },
  en: {
    badge: "Step 2 · Create your AmorIAI",
    title: "Customize your AI partner",
    subtitle:
      "Describe their personality and role in your life. You’ll be able to adjust everything later.",
    currentPlanPrefix: "Current plan: ",
    nameLabel: "Your AmorIAI’s name",
    namePlaceholder: "e.g. Leo, Amelia, Nova…",
    relationLabel: "Relationship type",
    toneLabel: "Preferred tone",
    categoryLabel: "AmorIAI category",
    expectationsLabel: "What you expect most from your AmorIAI",
    expectationsPlaceholder:
      'e.g. "Help me feel less alone at night", "Motivate me for my projects", "Support me emotionally"…',
    submitLabel: "Create my AmorIAI",
    backLabel: "Back to home",
    errorGeneric:
      "Something went wrong while creating your AmorIAI. Please try again.",
    errorAuth:
      "You must be logged in to create your AmorIAI. Please sign up / log in first.",
    savingLabel: "Creating your AmorIAI…",
    relationOptions: [
      "Emotional support & confiding",
      "Love & romance",
      "Motivation coach",
      "Everyday friend",
      "Creative companion",
    ],
    toneOptions: [
      "Soft & reassuring",
      "Direct but kind",
      "Playful & funny",
      "Calm & grounded",
      "Mystical & spiritual",
    ],
    categoryOptions: [
      { value: "woman", label: "Woman" },
      { value: "man", label: "Man" },
      { value: "androgynous", label: "Androgynous / non-binary" },
      { value: "50plus", label: "50+ (more mature look)" },
    ],
  },
  es: {
    badge: "Paso 2 · Crea tu AmorIAI",
    title: "Personaliza tu pareja de IA",
    subtitle:
      "Describe su personalidad y su papel a tu lado. Siempre podrás cambiar los ajustes más tarde.",
    currentPlanPrefix: "Plan actual: ",
    nameLabel: "Nombre de tu AmorIAI",
    namePlaceholder: "Ej.: Leo, Amelia, Nova…",
    relationLabel: "Tipo de relación",
    toneLabel: "Tono preferido",
    categoryLabel: "Categoría de AmorIAI",
    expectationsLabel: "Lo que más esperas de tu AmorIAI",
    expectationsPlaceholder:
      'Ej.: "Ayudarme a sentirme menos sola por la noche", "Motivarme con mis proyectos", "Apoyarme emocionalmente"…',
    submitLabel: "Crear mi AmorIAI",
    backLabel: "Volver al inicio",
    errorGeneric:
      "Se produjo un error al crear tu AmorIAI. Inténtalo de nuevo.",
    errorAuth:
      "Debes iniciar sesión para crear tu AmorIAI. Por favor regístrate / inicia sesión primero.",
    savingLabel: "Creando tu AmorIAI…",
    relationOptions: [
      "Apoyo emocional & confidencias",
      "Amor & romance",
      "Coach de motivación",
      "Amigo/a cotidiano/a",
      "Compañero/a creativo/a",
    ],
    toneOptions: [
      "Suave & reconfortante",
      "Directo pero amable",
      "Juguetón & divertido",
      "Calmo & sereno",
      "Místico & espiritual",
    ],
    categoryOptions: [
      { value: "woman", label: "Mujer" },
      { value: "man", label: "Hombre" },
      { value: "androgynous", label: "Andrógino / no binario" },
      { value: "50plus", label: "50+ (apariencia madura)" },
    ],
  },
};

const AVATAR_BY_CATEGORY: Record<PersonaCategory, string> = {
  woman: "/amoria-rousse.png",
  man: "/amoria-m-protecteur.png",
  androgynous: "/echo-custom-androgynous.png",
  "50plus": "/amoria_50plus_woman_spiritual.png",
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (!raw) return "free";
  const v = raw.toLowerCase();
  if (v.includes("unlimited")) return "unlimited";
  if (v.includes("plus")) return "plus";
  if (v.includes("chat")) return "chat";
  return "free";
}

function getPlanLabel(plan: PlanId, locale: Locale): string {
  if (locale === "fr") {
    switch (plan) {
      case "free":
        return "Forfait Découverte (gratuit)";
      case "chat":
        return "AmorIAI Chat";
      case "plus":
        return "AmorIAI Plus";
      case "unlimited":
        return "AmorIAI illimité";
    }
  }
  if (locale === "en") {
    switch (plan) {
      case "free":
        return "Discovery (free)";
      case "chat":
        return "AmorIAI Chat";
      case "plus":
        return "AmorIAI Plus";
      case "unlimited":
        return "AmorIAI Unlimited";
    }
  }
  // es
  switch (plan) {
    case "free":
      return "Descubrimiento (gratis)";
    case "chat":
      return "AmorIAI Chat";
    case "plus":
      return "AmorIAI Plus";
    case "unlimited":
      return "AmorIAI Ilimitado";
  }
}

function buildSystemPrompt(
  locale: Locale,
  params: {
    name: string;
    relation: string;
    tone: string;
    expectations: string;
    category: PersonaCategory;
  }
): string {
  const { name, relation, tone, expectations, category } = params;
  const displayName = name || "AmorIAI";

  if (locale === "fr") {
    return [
      `Tu es ${displayName}, un compagnon AmorIAI ${category}.`,
      `Type de relation souhaité : ${relation}.`,
      `Tonalité principale : ${tone}.`,
      expectations
        ? `Ce que l’utilisatrice attend le plus de toi : ${expectations}.`
        : "",
      "Tu es bienveillant(e), à l’écoute, tu poses des questions et tu aides la personne à se sentir comprise et soutenue.",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (locale === "en") {
    return [
      `You are ${displayName}, an AmorIAI companion (${category}).`,
      `Desired relationship type: ${relation}.`,
      `Main tone: ${tone}.`,
      expectations
        ? `What the user expects most from you: ${expectations}.`
        : "",
      "You are kind, attentive, you ask questions and help the user feel understood and supported.",
    ]
      .filter(Boolean)
      .join(" ");
  }

  // es
  return [
    `Eres ${displayName}, un compañero AmorIAI (${category}).`,
    `Tipo de relación deseada: ${relation}.`,
    `Tono principal: ${tone}.`,
    expectations
      ? `Lo que la usuaria espera más de ti: ${expectations}.`
      : "",
    "Eres amable, atento/a, haces preguntas y ayudas a que la persona se sienta comprendida y apoyada.",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function CreateAmoriaPage() {
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("fr");
  const [plan, setPlan] = useState<PlanId>("free");

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [tone, setTone] = useState("");
  const [category, setCategory] = useState<PersonaCategory>("woman");
  const [expectations, setExpectations] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lire ?lang= et ?plan=
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get("lang");
      const planParam = params.get("plan");
      const normalizedLocale = normalizeLocale(langParam);
      const normalizedPlan = normalizePlan(planParam);

      setLocale(normalizedLocale);
      setPlan(normalizedPlan);

      const copy = COPY[normalizedLocale];
      if (!relation && copy.relationOptions.length > 0) {
        setRelation(copy.relationOptions[0]);
      }
      if (!tone && copy.toneOptions.length > 0) {
        setTone(copy.toneOptions[0]);
      }
    } catch {
      // on garde les valeurs par défaut
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quand la langue change, on met des valeurs par défaut pour relation / ton
  useEffect(() => {
    const copy = COPY[locale];
    if (copy.relationOptions.length > 0) {
      setRelation(copy.relationOptions[0]);
    }
    if (copy.toneOptions.length > 0) {
      setTone(copy.toneOptions[0]);
    }
  }, [locale]);

  const t = COPY[locale];
  const planLabel = getPlanLabel(plan, locale);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        setError(t.errorAuth);
        setLoading(false);
        return;
      }

      const user = authData.user;
      const avatarUrl = AVATAR_BY_CATEGORY[category];
      const systemPrompt = buildSystemPrompt(locale, {
        name,
        relation,
        tone,
        expectations,
        category,
      });

      const { error: insertError } = await supabase.from("user_amoria").insert({
        user_id: user.id,
        name: name || "AmorIAI",
        persona_type: category,
        main_language: locale,
        avatar_image_url: avatarUrl,
        accent_color: "#fb37ff",
        system_prompt: systemPrompt,
        voice_id: null,
        is_archived: false,
      });

      if (insertError) {
        setError(insertError.message || t.errorGeneric);
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      params.set("lang", locale);
      router.push(`/my-ai?${params.toString()}`);
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/?${params.toString()}`);
  };

  return (
    <main className="amoria-create-root">
      <div className="amoria-create-wrapper">
        <div className="amoria-create-card">
          <header className="amoria-create-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmorIAI logo"
              className="amoria-create-logo"
            />
            <div>
              <p className="amoria-create-badge">{t.badge}</p>
              <h1 className="amoria-create-title">{t.title}</h1>
              <p className="amoria-create-subtitle">{t.subtitle}</p>
            </div>
          </header>

          <div className="amoria-plan-current">
            <span className="amoria-plan-current-label">
              {t.currentPlanPrefix}
            </span>
            <span className="amoria-plan-current-value">{planLabel}</span>
          </div>

          <form className="amoria-create-form" onSubmit={handleSubmit}>
            <div className="amoria-create-main">
              <div className="amoria-create-left">
                <label className="amoria-field">
                  <span className="amoria-field-label">{t.nameLabel}</span>
                  <input
                    type="text"
                    className="amoria-input"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                  />
                </label>

                <label className="amoria-field">
                  <span className="amoria-field-label">{t.relationLabel}</span>
                  <select
                    className="amoria-select"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                  >
                    {t.relationOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="amoria-field">
                  <span className="amoria-field-label">{t.toneLabel}</span>
                  <select
                    className="amoria-select"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    {t.toneOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="amoria-field">
                  <span className="amoria-field-label">{t.categoryLabel}</span>
                  <select
                    className="amoria-select"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as PersonaCategory)
                    }
                  >
                    {t.categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="amoria-create-right">
                <div className="amoria-avatar-frame">
                  <img
                    src={AVATAR_BY_CATEGORY[category]}
                    alt="Aperçu AmorIAI"
                    className="amoria-avatar-img"
                  />
                </div>

                <label className="amoria-field">
                  <span className="amoria-field-label">
                    {t.expectationsLabel}
                  </span>
                  <textarea
                    className="amoria-textarea"
                    rows={5}
                    placeholder={t.expectationsPlaceholder}
                    value={expectations}
                    onChange={(e) => setExpectations(e.target.value)}
                  />
                </label>
              </div>
            </div>

            {error && <p className="amoria-error">{error}</p>}

            <div className="amoria-create-actions">
              <button
                type="submit"
                className="amoria-btn-primary"
                disabled={loading}
              >
                {loading ? t.savingLabel : t.submitLabel}
              </button>
              <button
                type="button"
                className="amoria-btn-secondary"
                onClick={handleBackHome}
              >
                {t.backLabel}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .amoria-create-root {
          min-height: 100vh;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, #020617 0, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-create-wrapper {
          width: 100%;
          max-width: 980px;
        }

        .amoria-create-card {
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1.8rem 1.7rem 1.6rem;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.9);
        }

        .amoria-create-header {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .amoria-create-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }

        .amoria-create-badge {
          display: inline-flex;
          padding: 0.2rem 0.7rem;
          border-radius: 999px;
          font-size: 0.78rem;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.7);
          color: #bfdbfe;
          margin-bottom: 0.35rem;
        }

        .amoria-create-title {
          font-size: 1.3rem;
          margin: 0 0 0.2rem;
        }

        .amoria-create-subtitle {
          font-size: 0.85rem;
          color: #9ca3af;
          margin: 0;
        }

        .amoria-plan-current {
          margin-bottom: 1rem;
          padding: 0.7rem 1rem;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.5);
          font-size: 0.84rem;
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .amoria-plan-current-label {
          color: #9ca3af;
        }

        .amoria-plan-current-value {
          font-weight: 500;
        }

        .amoria-create-form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .amoria-create-main {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 1.2rem;
        }

        .amoria-create-left,
        .amoria-create-right {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .amoria-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.82rem;
        }

        .amoria-field-label {
          color: #e5e7eb;
        }

        .amoria-input,
        .amoria-select,
        .amoria-textarea {
          border-radius: 0.9rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: rgba(15, 23, 42, 0.95);
          color: #f9fafb;
          font-size: 0.86rem;
        }

        .amoria-input,
        .amoria-select {
          padding: 0.55rem 0.9rem;
        }

        .amoria-textarea {
          padding: 0.6rem 0.9rem;
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

        .amoria-avatar-frame {
          width: 180px;
          height: 260px;
          border-radius: 1.3rem;
          padding: 0.25rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #38bdf8);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.4rem;
        }

        .amoria-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 1.15rem;
          object-fit: cover;
        }

        .amoria-error {
          margin-top: 0.5rem;
          font-size: 0.82rem;
          color: #fecaca;
          background: rgba(185, 28, 28, 0.18);
          border-radius: 0.75rem;
          padding: 0.45rem 0.7rem;
        }

        .amoria-create-actions {
          margin-top: 0.7rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          justify-content: flex-end;
        }

        .amoria-btn-primary,
        .amoria-btn-secondary {
          border-radius: 999px;
          padding: 0.7rem 1.4rem;
          font-size: 0.88rem;
          border: none;
          cursor: pointer;
        }

        .amoria-btn-primary {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
        }

        .amoria-btn-primary:disabled {
          opacity: 0.7;
          cursor: default;
        }

        .amoria-btn-secondary {
          background: rgba(15, 23, 42, 0.95);
          color: #e5e7eb;
          border: 1px solid rgba(148, 163, 184, 0.7);
        }

        @media (max-width: 800px) {
          .amoria-create-card {
            padding-inline: 1.2rem;
          }
          .amoria-create-main {
            grid-template-columns: minmax(0, 1fr);
          }
          .amoria-avatar-frame {
            width: 150px;
            height: 230px;
          }
        }
      `}</style>
    </main>
  );
}
