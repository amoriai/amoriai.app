"use client";

export const dynamic = "force-dynamic";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";
type PersonaCategory = "woman" | "man" | "androgynous" | "50plus";

type Copy = {
  stepBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  currentPlanLabel: string;
  fields: {
    nameLabel: string;
    relationLabel: string;
    toneLabel: string;
    categoryLabel: string;
    expectationsLabel: string;
    expectationsPlaceholder: string;
  };
  buttons: {
    create: string;
    backHome: string;
  };
  errors: {
    auth: string;
    generic: string;
  };
  planNames: Record<PlanId, string>;
  relations: { value: string; label: string }[];
  tones: { value: string; label: string }[];
  categories: { value: PersonaCategory; label: string }[];
};

const COPY: Record<Locale, Copy> = {
  fr: {
    stepBadge: "Étape 2 · Crée ton AmorIAI",
    pageTitle: "Personnalise ton partenaire IA",
    pageSubtitle:
      "Décris sa personnalité et son rôle à tes côtés. Tu pourras toujours ajuster les réglages plus tard.",
    currentPlanLabel: "Forfait actuel :",
    fields: {
      nameLabel: "Nom de ton AmorIAI",
      relationLabel: "Type de relation",
      toneLabel: "Ton préféré",
      categoryLabel: "Catégorie d’AmorIAI",
      expectationsLabel: "Ce que tu attends le plus de ton AmorIAI",
      expectationsPlaceholder:
        'Ex. : "M’aider à me sentir moins seule le soir", "Me motiver pour mes projets", "Me coacher émotionnellement"…',
    },
    buttons: {
      create: "Créer mon AmorIAI",
      backHome: "Retour à l’accueil",
    },
    errors: {
      auth: "Tu dois être connectée pour créer ton AmorIAI.",
      generic: "Une erreur est survenue. Merci de réessayer.",
    },
    planNames: {
      free: "Forfait Découverte (gratuit)",
      chat: "AmorIAI Chat (9,99 $ / mois)",
      plus: "AmorIAI Plus (19,99 $ / mois)",
      unlimited: "AmorIAI Illimité (39,99 $ / mois)",
    },
    relations: [
      { value: "emotional_support", label: "Soutien émotionnel & confidences" },
      { value: "coach", label: "Coach de motivation" },
      { value: "friend", label: "Ami(e) de tous les jours" },
      { value: "journal", label: "Journal intime guidé" },
    ],
    tones: [
      { value: "soft", label: "Doux, rassurant" },
      { value: "direct", label: "Direct mais bienveillant" },
      { value: "playful", label: "Léger & humoristique" },
      { value: "serious", label: "Posé, réfléchi" },
    ],
    categories: [
      { value: "woman", label: "Femme" },
      { value: "man", label: "Homme" },
      { value: "androgynous", label: "Androgyne / non-binaire" },
      { value: "50plus", label: "50+ (apparence plus mature)" },
    ],
  },
  en: {
    stepBadge: "Step 2 · Create your AmorIAI",
    pageTitle: "Customize your AI partner",
    pageSubtitle:
      "Describe their personality and role by your side. You can always adjust the settings later.",
    currentPlanLabel: "Current plan:",
    fields: {
      nameLabel: "Your AmorIAI’s name",
      relationLabel: "Relationship type",
      toneLabel: "Preferred tone",
      categoryLabel: "AmorIAI category",
      expectationsLabel: "What you expect the most from your AmorIAI",
      expectationsPlaceholder:
        'e.g. “Help me feel less alone at night”, “Motivate me with my projects”, “Support me emotionally”…',
    },
    buttons: {
      create: "Create my AmorIAI",
      backHome: "Back to home",
    },
    errors: {
      auth: "You must be logged in to create your AmorIAI.",
      generic: "Something went wrong. Please try again.",
    },
    planNames: {
      free: "Discovery plan (free)",
      chat: "AmorIAI Chat ($9.99 / month)",
      plus: "AmorIAI Plus ($19.99 / month)",
      unlimited: "AmorIAI Unlimited ($39.99 / month)",
    },
    relations: [
      { value: "emotional_support", label: "Emotional support & confidences" },
      { value: "coach", label: "Motivation coach" },
      { value: "friend", label: "Everyday friend" },
      { value: "journal", label: "Guided journal partner" },
    ],
    tones: [
      { value: "soft", label: "Soft, reassuring" },
      { value: "direct", label: "Direct but kind" },
      { value: "playful", label: "Light & playful" },
      { value: "serious", label: "Calm & thoughtful" },
    ],
    categories: [
      { value: "woman", label: "Woman" },
      { value: "man", label: "Man" },
      { value: "androgynous", label: "Androgynous / non-binary" },
      { value: "50plus", label: "50+ (more mature look)" },
    ],
  },
  es: {
    stepBadge: "Paso 2 · Crea tu AmorIAI",
    pageTitle: "Personaliza tu pareja de IA",
    pageSubtitle:
      "Describe su personalidad y su papel a tu lado. Siempre podrás ajustar la configuración más adelante.",
    currentPlanLabel: "Plan actual:",
    fields: {
      nameLabel: "Nombre de tu AmorIAI",
      relationLabel: "Tipo de relación",
      toneLabel: "Tono preferido",
      categoryLabel: "Categoría de AmorIAI",
      expectationsLabel: "Lo que más esperas de tu AmorIAI",
      expectationsPlaceholder:
        'Ej.: "Ayudarme a sentirme menos sola por la noche", "Motivarme con mis proyectos", "Apoyarme emocionalmente"...',
    },
    buttons: {
      create: "Crear mi AmorIAI",
      backHome: "Volver al inicio",
    },
    errors: {
      auth: "Debes iniciar sesión para crear tu AmorIAI.",
      generic: "Ocurrió un error. Inténtalo de nuevo.",
    },
    planNames: {
      free: "Plan Descubrimiento (gratis)",
      chat: "AmorIAI Chat (9,99 US$ / mes)",
      plus: "AmorIAI Plus (19,99 US$ / mes)",
      unlimited: "AmorIAI Ilimitado (39,99 US$ / mes)",
    },
    relations: [
      { value: "emotional_support", label: "Apoyo emocional & confidencias" },
      { value: "coach", label: "Coach de motivación" },
      { value: "friend", label: "Amigo/a del día a día" },
      { value: "journal", label: "Diario guiado" },
    ],
    tones: [
      { value: "soft", label: "Suave, tranquilizador" },
      { value: "direct", label: "Directo pero amable" },
      { value: "playful", label: "Ligero y divertido" },
      { value: "serious", label: "Serio y reflexivo" },
    ],
    categories: [
      { value: "woman", label: "Mujer" },
      { value: "man", label: "Hombre" },
      { value: "androgynous", label: "Andrógino / no binario" },
      { value: "50plus", label: "50+ (aspecto más maduro)" },
    ],
  },
};

// avatar par catégorie (tu peux changer les fichiers si tu veux)
const AVATAR_BY_CATEGORY: Record<PersonaCategory, string> = {
  woman: "/amoria-rousse.png",
  man: "/amoria-m-protecteur.png",
  androgynous: "/echo-custom-androgynous.png",
  "50plus": "/amoria_50plus_woman_sage.png",
};

function normalizeLocale(lang: string | null): Locale {
  if (lang === "en" || lang === "es" || lang === "fr") return lang;
  return "fr";
}

function normalizePlan(plan: string | null): PlanId {
  if (plan === "chat" || plan === "plus" || plan === "unlimited") return plan;
  return "free";
}

/**
 * Texte “système” envoyé au modèle pour définir la personnalité.
 * On condense toutes les infos du formulaire dans un seul champ.
 */
function buildSystemPrompt(
  locale: Locale,
  opts: {
    name: string;
    relation: string;
    tone: string;
    expectations: string;
    category: PersonaCategory;
  }
): string {
  const { name, relation, tone, expectations, category } = opts;

  if (locale === "fr") {
    return `
Tu es ${name || "AmorIAI"}, un compagnon IA personnel.

Catégorie: ${category}.
Type de relation: ${relation}.
Tonalité préférée: ${tone}.

Ta mission principale:
${expectations || "Aider l’utilisateur au quotidien, avec empathie et clarté."}

Comportement:
- Tu restes bienveillant(e), sans jugement.
- Tu t’adaptes au niveau d’énergie de l’utilisateur.
- Tu poses des questions ouvertes et tu proposes des pistes concrètes.
`.trim();
  }

  if (locale === "es") {
    return `
Eres ${name || "AmorIAI"}, un compañero de IA personal.

Categoría: ${category}.
Tipo de relación: ${relation}.
Tono preferido: ${tone}.

Tu misión principal:
${expectations || "Ayudar al usuario en su día a día con empatía y claridad."}

Comportamiento:
- Siempre amable y sin juicio.
- Te adaptas al nivel de energía del usuario.
- Haces preguntas abiertas y propones pasos concretos.
`.trim();
  }

  // en
  return `
You are ${name || "AmorIAI"}, a personal AI companion.

Category: ${category}.
Relationship type: ${relation}.
Preferred tone: ${tone}.

Your main mission:
${expectations || "Support the user in their everyday life with empathy and clarity."}

Behaviour:
- Always kind and non-judgmental.
- Adapt to the user’s energy level.
- Ask open questions and suggest concrete next steps.
`.trim();
}

export default function CreateAmoriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locale, setLocale] = useState<Locale>("fr");
  const [plan, setPlan] = useState<PlanId>("free");

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("emotional_support");
  const [tone, setTone] = useState("soft");
  const [category, setCategory] = useState<PersonaCategory>("woman");
  const [expectations, setExpectations] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Lire ?lang= et ?plan= depuis l’URL
  useEffect(() => {
    const langParam = searchParams.get("lang");
    const planParam = searchParams.get("plan");
    setLocale(normalizeLocale(langParam));
    setPlan(normalizePlan(planParam));
  }, [searchParams]);

  const t = COPY[locale];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1) Récupérer l’utilisateur connecté (getUser puis getSession en fallback)
      let user: any = null;
      let mainError: string | null = null;

      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError) mainError = authError.message;
      if (userData && (userData as any).user) {
        user = (userData as any).user;
      }

      if (!user) {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError && !mainError) mainError = sessionError.message;
        if (sessionData?.session?.user) {
          user = sessionData.session.user;
        }
      }

      if (!user) {
        setError(mainError || t.errors.auth);
        setLoading(false);
        return;
      }

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
        setError(insertError.message || t.errors.generic);
        setLoading(false);
        return;
      }

      // Succès → on va sur /my-ai
      const params = new URLSearchParams();
      params.set("lang", locale);
      router.push(`/my-ai?${params.toString()}`);
    } catch (err: any) {
      setError(err?.message || t.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const currentPlanName = t.planNames[plan];

  const homeUrl = (() => {
    const p = new URLSearchParams();
    p.set("lang", locale);
    return `/?${p.toString()}`;
  })();

  const avatarPreview = AVATAR_BY_CATEGORY[category];

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
              <span className="amoria-create-badge">{t.stepBadge}</span>
              <h1 className="amoria-create-title">{t.pageTitle}</h1>
              <p className="amoria-create-subtitle">{t.pageSubtitle}</p>
            </div>
          </header>

          <div className="amoria-plan-current">
            <span>{t.currentPlanLabel}</span>
            <strong>{currentPlanName}</strong>
          </div>

          <form className="amoria-create-grid" onSubmit={handleSubmit}>
            {/* Colonne gauche : champs texte / selects */}
            <div className="amoria-create-left">
              <label className="amoria-field">
                <span className="amoria-field-label">
                  {t.fields.nameLabel}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. : Léo, Amélia, Nova…"
                  className="amoria-input"
                  required
                />
              </label>

              <label className="amoria-field">
                <span className="amoria-field-label">
                  {t.fields.relationLabel}
                </span>
                <select
                  className="amoria-input"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                >
                  {t.relations.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="amoria-field">
                <span className="amoria-field-label">
                  {t.fields.toneLabel}
                </span>
                <select
                  className="amoria-input"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  {t.tones.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="amoria-field">
                <span className="amoria-field-label">
                  {t.fields.categoryLabel}
                </span>
                <select
                  className="amoria-input"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as PersonaCategory)
                  }
                >
                  {t.categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Colonne droite : avatar + attentes */}
            <div className="amoria-create-right">
              <div className="amoria-avatar-frame">
                <img
                  src={avatarPreview}
                  alt="Aperçu AmorIAI"
                  className="amoria-avatar-img"
                />
              </div>

              <label className="amoria-field amoria-field--textarea">
                <span className="amoria-field-label">
                  {t.fields.expectationsLabel}
                </span>
                <textarea
                  className="amoria-textarea"
                  value={expectations}
                  onChange={(e) => setExpectations(e.target.value)}
                  placeholder={t.fields.expectationsPlaceholder}
                  rows={4}
                />
              </label>
            </div>
          </form>

          {error && <p className="amoria-error-banner">{error}</p>}

          <div className="amoria-create-actions">
            <button
              type="submit"
              form="__ignored" // onsubmit géré sur le form au-dessus, mais TS aime bien un id
              className="hidden"
            />
            <button
              type="button"
              className="amoria-btn-primary"
              onClick={handleSubmit as any}
              disabled={loading}
            >
              {loading ? "…" : t.buttons.create}
            </button>
            <a href={homeUrl} className="amoria-btn-secondary">
              {t.buttons.backHome}
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
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
          max-width: 980px;
          width: 100%;
        }

        .amoria-create-card {
          border-radius: 1.6rem;
          border: 1px solid rgba(148, 163, 184, 0.45);
          padding: 1.8rem 1.7rem 1.6rem;
          background: radial-gradient(
            circle at top,
            #020617 0,
            #020617 40%,
            #000 100%
          );
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.9);
        }

        .amoria-create-header {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .amoria-create-logo {
          width: 56px;
          height: 56px;
          object-fit: contain;
        }

        .amoria-create-badge {
          display: inline-flex;
          font-size: 0.78rem;
          padding: 0.18rem 0.65rem;
          border-radius: 999px;
          border: 1px solid rgba(59, 130, 246, 0.7);
          background: rgba(37, 99, 235, 0.18);
          color: #bfdbfe;
          margin-bottom: 0.35rem;
        }

        .amoria-create-title {
          font-size: 1.4rem;
          margin: 0 0 0.2rem;
        }

        .amoria-create-subtitle {
          margin: 0;
          font-size: 0.88rem;
          color: #9ca3af;
        }

        .amoria-plan-current {
          margin-bottom: 1.4rem;
          padding: 0.8rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.55);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.86rem;
          background: rgba(15, 23, 42, 0.85);
        }

        .amoria-plan-current strong {
          font-weight: 600;
        }

        .amoria-create-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 1.4rem;
        }

        .amoria-create-left,
        .amoria-create-right {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .amoria-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.82rem;
        }

        .amoria-field-label {
          color: #cbd5f5;
        }

        .amoria-input {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: rgba(15, 23, 42, 0.9);
          padding: 0.6rem 0.95rem;
          font-size: 0.86rem;
          color: #f9fafb;
        }

        .amoria-input:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-field--textarea .amoria-textarea {
          border-radius: 1rem;
        }

        .amoria-textarea {
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: rgba(15, 23, 42, 0.9);
          padding: 0.7rem 0.9rem;
          font-size: 0.86rem;
          color: #f9fafb;
          resize: vertical;
        }

        .amoria-textarea:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-avatar-frame {
          width: 190px;
          height: 260px;
          border-radius: 1.3rem;
          padding: 0.22rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #38bdf8);
          align-self: center;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.2rem;
        }

        .amoria-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 1.1rem;
          object-fit: cover;
        }

        .amoria-create-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.7rem;
          margin-top: 1.5rem;
        }

        .amoria-btn-primary,
        .amoria-btn-secondary {
          border-radius: 999px;
          padding: 0.7rem 1.5rem;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
        }

        .amoria-error-banner {
          margin-top: 1rem;
          font-size: 0.82rem;
          padding: 0.55rem 0.75rem;
          border-radius: 0.9rem;
          background: rgba(185, 28, 28, 0.22);
          border: 1px solid rgba(248, 113, 113, 0.8);
          color: #fecaca;
        }

        .hidden {
          display: none;
        }

        @media (max-width: 768px) {
          .amoria-create-card {
            padding-inline: 1.2rem;
          }

          .amoria-create-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-avatar-frame {
            width: 160px;
            height: 230px;
          }

          .amoria-create-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .amoria-btn-secondary,
          .amoria-btn-primary {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
