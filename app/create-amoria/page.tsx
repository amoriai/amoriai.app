"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";
type Gender = "female" | "male" | "androgynous";
type AgeBand = "18-34" | "35-49" | "50plus";

type CopyCreate = {
  badge: string;
  title: string;
  subtitle: string;
  currentPlanLabel: string;
  fields: {
    nameLabel: string;
    namePlaceholder: string;
    relationLabel: string;
    relationOptions: { value: string; label: string }[];
    toneLabel: string;
    toneOptions: { value: string; label: string }[];
    genderLabel: string;
    genderOptions: { value: Gender; label: string }[];
    ageLabel: string;
    ageOptions: { value: AgeBand; label: string }[];
    languageLabel: string;
    goalLabel: string;
    goalPlaceholder: string;
  };
  buttonCreate: string;
  backHome: string;
  errorName: string;
};

const PLAN_LABELS: Record<Locale, Record<PlanId, string>> = {
  fr: {
    free: "Forfait Découverte (gratuit)",
    chat: "Forfait AmorIAI Chat",
    plus: "Forfait AmorIAI Plus",
    unlimited: "Forfait AmorIAI Illimité",
  },
  en: {
    free: "Discovery plan (free)",
    chat: "AmorIAI Chat plan",
    plus: "AmorIAI Plus plan",
    unlimited: "AmorIAI Unlimited plan",
  },
  es: {
    free: "Plan Descubrimiento (gratis)",
    chat: "Plan AmorIAI Chat",
    plus: "Plan AmorIAI Plus",
    unlimited: "Plan AmorIAI Ilimitado",
  },
};

const COPY_CREATE: Record<Locale, CopyCreate> = {
  fr: {
    badge: "Étape 2 · Crée ton AmorIAI",
    title: "Personnalise ton partenaire IA",
    subtitle:
      "Décris en quelques mots la personnalité et le rôle de ton AmorIAI. Tu pourras toujours ajuster les réglages plus tard.",
    currentPlanLabel: "Forfait actuel",
    fields: {
      nameLabel: "Nom de ton AmorIAI",
      namePlaceholder: "Ex. : Léo, Amélia, Nova…",
      relationLabel: "Type de relation",
      relationOptions: [
        { value: "support", label: "Soutien émotionnel & confidences" },
        { value: "coach", label: "Coach mindset & motivation" },
        { value: "journal", label: "Journal intime guidé" },
        { value: "friend", label: "Ami·e proche du quotidien" },
      ],
      toneLabel: "Ton préféré",
      toneOptions: [
        { value: "gentle", label: "Doux, rassurant" },
        { value: "direct", label: "Direct, honnête" },
        { value: "playful", label: "Léger, taquin" },
        { value: "mystic", label: "Mystique / spirituel" },
      ],
      genderLabel: "Apparence / genre de ton AmorIAI",
      genderOptions: [
        { value: "female", label: "Femme" },
        { value: "male", label: "Homme" },
        { value: "androgynous", label: "Androgyne / non-binaire" },
      ],
      ageLabel: "Tranche d’âge apparente",
      ageOptions: [
        { value: "18-34", label: "18–34 ans" },
        { value: "35-49", label: "35–49 ans" },
        { value: "50plus", label: "50+ ans" },
      ],
      languageLabel: "Langue principale de discussion",
      goalLabel: "Ce que tu attends le plus de ton AmorIAI",
      goalPlaceholder:
        "Ex. : « M’aider à me sentir moins seule le soir », « Me motiver pour mes projets »…",
    },
    buttonCreate: "Créer mon AmorIAI",
    backHome: "Retour à l’accueil",
    errorName: "Merci de choisir un prénom pour ton AmorIAI.",
  },
  en: {
    badge: "Step 2 · Create your AmorIAI",
    title: "Customize your AI partner",
    subtitle:
      "Describe your AmorIAI’s personality and role in a few words. You can always adjust settings later.",
    currentPlanLabel: "Current plan",
    fields: {
      nameLabel: "Your AmorIAI’s name",
      namePlaceholder: "e.g. Leo, Amelia, Nova…",
      relationLabel: "Relationship style",
      relationOptions: [
        { value: "support", label: "Emotional support & confiding" },
        { value: "coach", label: "Mindset & motivation coach" },
        { value: "journal", label: "Guided journal companion" },
        { value: "friend", label: "Close everyday friend" },
      ],
      toneLabel: "Preferred tone",
      toneOptions: [
        { value: "gentle", label: "Gentle, reassuring" },
        { value: "direct", label: "Direct, honest" },
        { value: "playful", label: "Light, playful" },
        { value: "mystic", label: "Mystical / spiritual" },
      ],
      genderLabel: "AmorIAI gender / appearance",
      genderOptions: [
        { value: "female", label: "Female" },
        { value: "male", label: "Male" },
        { value: "androgynous", label: "Androgynous / non-binary" },
      ],
      ageLabel: "Apparent age range",
      ageOptions: [
        { value: "18-34", label: "18–34" },
        { value: "35-49", label: "35–49" },
        { value: "50plus", label: "50+ years" },
      ],
      languageLabel: "Main conversation language",
      goalLabel: "What you want most from your AmorIAI",
      goalPlaceholder:
        "e.g. “Help me feel less lonely at night”, “Push me to focus on my goals”…",
    },
    buttonCreate: "Create my AmorIAI",
    backHome: "Back to home",
    errorName: "Please choose a name for your AmorIAI.",
  },
  es: {
    badge: "Paso 2 · Crea tu AmorIAI",
    title: "Personaliza tu pareja de IA",
    subtitle:
      "Describe en pocas palabras la personalidad y el rol de tu AmorIAI. Podrás ajustar la configuración más tarde.",
    currentPlanLabel: "Plan actual",
    fields: {
      nameLabel: "Nombre de tu AmorIAI",
      namePlaceholder: "Ej.: Leo, Amelia, Nova…",
      relationLabel: "Tipo de relación",
      relationOptions: [
        { value: "support", label: "Apoyo emocional & confidencias" },
        { value: "coach", label: "Coach de mindset & motivación" },
        { value: "journal", label: "Diario guiado" },
        { value: "friend", label: "Amigo/a del día a día" },
      ],
      toneLabel: "Tono preferido",
      toneOptions: [
        { value: "gentle", label: "Suave, tranquilizador" },
        { value: "direct", label: "Directo, honesto" },
        { value: "playful", label: "Ligero, juguetón" },
        { value: "mystic", label: "Místico / espiritual" },
      ],
      genderLabel: "Género / apariencia de tu AmorIAI",
      genderOptions: [
        { value: "female", label: "Mujer" },
        { value: "male", label: "Hombre" },
        { value: "androgynous", label: "Andrógino / no binario" },
      ],
      ageLabel: "Rango de edad aparente",
      ageOptions: [
        { value: "18-34", label: "18–34 años" },
        { value: "35-49", label: "35–49 años" },
        { value: "50plus", label: "50+ años" },
      ],
      languageLabel: "Idioma principal de conversación",
      goalLabel: "Lo que más esperas de tu AmorIAI",
      goalPlaceholder:
        "Ej.: « Sentirme menos sola por la noche », « Motivarme con mis proyectos »…",
    },
    buttonCreate: "Crear mi AmorIAI",
    backHome: "Volver al inicio",
    errorName: "Elige un nombre para tu AmorIAI.",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (raw === "chat" || raw === "plus" || raw === "unlimited") return raw;
  return "free";
}

export default function CreateAmoriaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get("lang"));
  const plan = normalizePlan(searchParams.get("plan"));
  const t = COPY_CREATE[locale];

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("support");
  const [tone, setTone] = useState("gentle");
  const [gender, setGender] = useState<Gender>("female");
  const [ageBand, setAgeBand] = useState<AgeBand>("35-49");
  const [language, setLanguage] = useState<Locale>(locale);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(t.errorName);
      return;
    }

    setLoading(true);

    try {
      // ➜ Ici tu pourras appeler ton API / Supabase pour sauvegarder
      // l’AmorIAI (nom, relation, ton, genre, âge, langue, objectif, plan).
      //
      // await fetch("/api/amoria", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, relation, tone, gender, ageBand, language, goal, plan }),
      // });

      const params = new URLSearchParams();
      params.set("lang", locale);
      params.set("plan", plan);
      router.push(`/my-amoria?${params.toString()}`);
    } catch (e) {
      setError(
        locale === "fr"
          ? "Une erreur est survenue. Réessaie dans quelques instants."
          : locale === "es"
          ? "Se produjo un error. Inténtalo de nuevo en unos instantes."
          : "Something went wrong. Please try again in a moment."
      );
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/?${params.toString()}`);
  };

  const planLabel = PLAN_LABELS[locale][plan];

  return (
    <main className="amoria-root amoria-create-root">
      <div className="amoria-create-wrapper">
        <div className="amoria-create-card">
          <header className="amoria-create-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmorIAI logo"
              className="amoria-create-logo"
            />
            <div>
              <h1 className="amoria-create-title">{t.title}</h1>
              <p className="amoria-create-subtitle">{t.subtitle}</p>
            </div>
          </header>

          <div className="amoria-create-badge">{t.badge}</div>

          {/* Forfait actuel */}
          <section className="amoria-plan-current">
            <p className="amoria-plan-current-label">{t.currentPlanLabel}</p>
            <p className="amoria-plan-current-value">{planLabel}</p>
          </section>

          {/* Formulaire création */}
          <form className="amoria-create-form" onSubmit={handleSubmit}>
            <div className="amoria-create-main">
              <div className="amoria-create-left">
                <label className="amoria-field">
                  <span className="amoria-field-label">
                    {t.fields.nameLabel}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.fields.namePlaceholder}
                    className="amoria-input"
                  />
                </label>

                <label className="amoria-field">
                  <span className="amoria-field-label">
                    {t.fields.relationLabel}
                  </span>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="amoria-select"
                  >
                    {t.fields.relationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="amoria-field">
                  <span className="amoria-field-label">
                    {t.fields.toneLabel}
                  </span>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="amoria-select"
                  >
                    {t.fields.toneOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="amoria-field">
                  <span className="amoria-field-label">
                    {t.fields.genderLabel}
                  </span>
                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as Gender)
                    }
                    className="amoria-select"
                  >
                    {t.fields.genderOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="amoria-field">
                  <span className="amoria-field-label">
                    {t.fields.ageLabel}
                  </span>
                  <select
                    value={ageBand}
                    onChange={(e) =>
                      setAgeBand(e.target.value as AgeBand)
                    }
                    className="amoria-select"
                  >
                    {t.fields.ageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="amoria-field">
                  <span className="amoria-field-label">
                    {t.fields.languageLabel}
                  </span>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as Locale)
                    }
                    className="amoria-select"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </label>
              </div>

              <div className="amoria-create-right">
                <div className="amoria-create-avatar-frame">
                  <img
                    src="/amoria-avatar-preview.png"
                    alt="AmorIAI avatar preview"
                    className="amoria-create-avatar-img"
                  />
                </div>

                <label className="amoria-field amoria-field-textarea">
                  <span className="amoria-field-label">
                    {t.fields.goalLabel}
                  </span>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={t.fields.goalPlaceholder}
                    className="amoria-textarea"
                    rows={4}
                  />
                </label>
              </div>
            </div>

            {error && <p className="amoria-create-error">{error}</p>}

            <div className="amoria-create-actions">
              <button
                type="submit"
                className="amoria-create-primary"
                disabled={loading}
              >
                {loading ? "..." : t.buttonCreate}
              </button>
              <button
                type="button"
                onClick={handleBackHome}
                className="amoria-create-secondary"
                disabled={loading}
              >
                {t.backHome}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .amoria-create-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #000 100%);
          color: #e5e7eb;
        }

        .amoria-create-wrapper {
          max-width: 900px;
          width: 100%;
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
          padding: 1.8rem 1.7rem 1.7rem;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.9);
        }

        .amoria-create-header {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .amoria-create-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }

        .amoria-create-title {
          font-size: 1.3rem;
          margin: 0 0 0.2rem;
        }

        .amoria-create-subtitle {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amoria-create-badge {
          display: inline-flex;
          align-items: center;
          margin-bottom: 0.9rem;
          font-size: 0.8rem;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          background: rgba(96, 165, 250, 0.15);
          color: #bfdbfe;
          border: 1px solid rgba(59, 130, 246, 0.7);
        }

        .amoria-plan-current {
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.6);
          margin-bottom: 1.1rem;
        }

        .amoria-plan-current-label {
          font-size: 0.78rem;
          color: #9ca3af;
          margin: 0 0 0.15rem;
        }

        .amoria-plan-current-value {
          margin: 0;
          font-size: 0.9rem;
        }

        .amoria-create-form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .amoria-create-main {
          display: flex;
          gap: 1.1rem;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .amoria-create-left,
        .amoria-create-right {
          flex: 1;
          min-width: 0;
        }

        .amoria-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.6rem;
          font-size: 0.82rem;
        }

        .amoria-field-label {
          color: #e5e7eb;
        }

        .amoria-input,
        .amoria-select,
        .amoria-textarea {
          border-radius: 0.75rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          background: rgba(15, 23, 42, 0.95);
          color: #f9fafb;
          font-size: 0.82rem;
          padding: 0.5rem 0.7rem;
        }

        .amoria-input:focus,
        .amoria-select:focus,
        .amoria-textarea:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-textarea {
          resize: vertical;
        }

        .amoria-create-avatar-frame {
          width: 180px;
          height: 280px;
          border-radius: 1.2rem;
          padding: 0.25rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #38bdf8);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.6rem;
        }

        .amoria-create-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 1rem;
        }

        .amoria-create-error {
          margin: 0.2rem 0 0;
          padding: 0.4rem 0.6rem;
          border-radius: 0.6rem;
          background: rgba(248, 113, 113, 0.16);
          color: #fecaca;
          font-size: 0.78rem;
        }

        .amoria-create-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.6rem;
        }

        .amoria-create-primary {
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-create-secondary {
          width: 100%;
          border-radius: 999px;
          padding: 0.65rem 1rem;
          font-size: 0.86rem;
          cursor: pointer;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
        }

        @media (max-width: 640px) {
          .amoria-create-card {
            padding-inline: 1.1rem;
          }

          .amoria-create-main {
            flex-direction: column;
          }

          .amoria-create-avatar-frame {
            width: 150px;
            height: 240px;
          }
        }
      `}</style>
    </main>
  );
}
