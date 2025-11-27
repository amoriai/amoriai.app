"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PersonaCategory = "woman" | "man" | "androgynous" | "50plus";

type Copy = {
  title: string;
  subtitle: string;
  badge: string;
  currentPlanLabel: string;
  nameLabel: string;
  relationLabel: string;
  toneLabel: string;
  categoryLabel: string;
  expectationsLabel: string;
  expectationsPlaceholder: string;
  createButton: string;
  backHome: string;
  currentPlanPrefix: string;
  relationOptions: string[];
  toneOptions: string[];
  categoryOptions: { value: PersonaCategory; label: string }[];
  errorGeneric: string;
  errorNotLogged: string;
  savedSuccess: string;
};

const STRINGS: Record<Locale, Copy> = {
  fr: {
    title: "Personnalise ton partenaire IA",
    subtitle:
      "Décris en quelques mots la personnalité et le rôle de ton AmorIAI. Tu pourras toujours ajuster les réglages plus tard.",
    badge: "Étape 2 · Crée ton AmorIAI",
    currentPlanLabel: "Forfait actuel",
    currentPlanPrefix: "Forfait",
    nameLabel: "Nom de ton AmorIAI",
    relationLabel: "Type de relation",
    toneLabel: "Ton préféré",
    categoryLabel: "Catégorie d’AmorIAI",
    expectationsLabel: "Ce que tu attends le plus de ton AmorIAI",
    expectationsPlaceholder:
      'Ex. : « M’aider à me sentir moins seule le soir », « Me motiver pour mes projets », « M’aider à gérer mon anxiété »…',
    createButton: "Créer mon AmorIAI",
    backHome: "Retour à l’accueil",
    relationOptions: [
      "Soutien émotionnel & confidences",
      "Ami(e) proche & discussions légères",
      "Coach motivation & objectifs",
      "Compagnon(ne) de vie virtuelle",
    ],
    toneOptions: [
      "Doux, rassurant",
      "Direct, honnête",
      "Enjoué, humoristique",
      "Posé, réfléchi",
    ],
    categoryOptions: [
      { value: "woman", valueLabel: "woman", label: "Femme" },
      { value: "man", valueLabel: "man", label: "Homme" },
      {
        value: "androgynous",
        valueLabel: "androgynous",
        label: "Androgyne / non-binaire",
      },
      {
        value: "50plus",
        valueLabel: "50plus",
        label: "50+ (apparence plus mature)",
      },
    ] as any,
    errorGeneric:
      "Une erreur est survenue pendant la création de ton AmorIAI. Réessaie dans quelques instants.",
    errorNotLogged:
      "Tu dois être connecté(e) pour créer ton AmorIAI. Reviens après connexion.",
    savedSuccess: "Ton AmorIAI a été créée avec succès.",
  } as any,
  en: {
    title: "Customize your AI partner",
    subtitle:
      "Describe your AmorIAI’s role and personality. You can always tweak everything later.",
    badge: "Step 2 · Create your AmorIAI",
    currentPlanLabel: "Current plan",
    currentPlanPrefix: "Plan",
    nameLabel: "Your AmorIAI’s name",
    relationLabel: "Relationship type",
    toneLabel: "Preferred tone",
    categoryLabel: "AmorIAI category",
    expectationsLabel: "What you expect the most from your AmorIAI",
    expectationsPlaceholder:
      'E.g.: “Help me feel less alone at night”, “Motivate me for my projects”, “Help me manage my anxiety”…',
    createButton: "Create my AmorIAI",
    backHome: "Back to home",
    relationOptions: [
      "Emotional support & confiding",
      "Close friend & light chats",
      "Motivation & goals coach",
      "Virtual life companion",
    ],
    toneOptions: [
      "Soft, reassuring",
      "Direct, honest",
      "Playful, humorous",
      "Calm, thoughtful",
    ],
    categoryOptions: [
      { value: "woman", label: "Woman" },
      { value: "man", label: "Man" },
      {
        value: "androgynous",
        label: "Androgynous / non-binary",
      },
      {
        value: "50plus",
        label: "50+ (more mature look)",
      },
    ],
    errorGeneric:
      "Something went wrong while creating your AmorIAI. Please try again.",
    errorNotLogged:
      "You must be logged in to create your AmorIAI. Please log in and come back.",
    savedSuccess: "Your AmorIAI has been created successfully.",
  },
  es: {
    title: "Personaliza tu pareja de IA",
    subtitle:
      "Describe el papel y la personalidad de tu AmorIAI. Siempre podrás ajustar los parámetros más tarde.",
    badge: "Paso 2 · Crea tu AmorIAI",
    currentPlanLabel: "Plan actual",
    currentPlanPrefix: "Plan",
    nameLabel: "Nombre de tu AmorIAI",
    relationLabel: "Tipo de relación",
    toneLabel: "Tono preferido",
    categoryLabel: "Categoría de AmorIAI",
    expectationsLabel: "Lo que más esperas de tu AmorIAI",
    expectationsPlaceholder:
      'Ej.: “Ayudarme a sentirme menos sola por la noche”, “Motivarme para mis proyectos”, “Ayudarme con la ansiedad”…',
    createButton: "Crear mi AmorIAI",
    backHome: "Volver al inicio",
    relationOptions: [
      "Apoyo emocional y confidencias",
      "Amigo/a cercano/a y charlas ligeras",
      "Coach de motivación y objetivos",
      "Compañero/a virtual de vida",
    ],
    toneOptions: [
      "Dulce, tranquilizador",
      "Directo, honesto",
      "Alegre, con humor",
      "Sereno, reflexivo",
    ],
    categoryOptions: [
      { value: "woman", label: "Mujer" },
      { value: "man", label: "Hombre" },
      {
        value: "androgynous",
        label: "Andrógino / no binario",
      },
      {
        value: "50plus",
        label: "50+ (apariencia más madura)",
      },
    ],
    errorGeneric:
      "Se ha producido un error al crear tu AmorIAI. Inténtalo de nuevo.",
    errorNotLogged:
      "Debes iniciar sesión para crear tu AmorIAI. Vuelve después de conectarte.",
    savedSuccess: "Tu AmorIAI se ha creado correctamente.",
  },
};

// petit helper pour le nom du forfait
function getPlanLabel(plan: string | null, locale: Locale): string {
  if (!plan || plan === "free") {
    return locale === "fr"
      ? "Forfait Découverte (gratuit)"
      : locale === "en"
      ? "Discovery plan (free)"
      : "Plan Descubrimiento (gratis)";
  }
  if (plan === "chat") {
    return "AmorIAI Chat";
  }
  if (plan === "plus") {
    return "AmorIAI Plus";
  }
  if (plan === "unlimited") {
    return locale === "fr"
      ? "AmorIAI illimité"
      : locale === "en"
      ? "AmorIAI Unlimited"
      : "AmorIAI Ilimitado";
  }
  return plan;
}

// avatar par défaut selon la catégorie
function getAvatarForCategory(cat: PersonaCategory): string {
  switch (cat) {
    case "woman":
      return "/amoria-rousse.png";
    case "man":
      return "/amoria-m-protecteur.png";
    case "androgynous":
      return "/echo-friend-androgynous.png";
    case "50plus":
      return "/amoria_50plus_woman_elegant.png";
    default:
      return "/amoria-rousse.png";
  }
}

// prompt système de base
function buildSystemPrompt(
  locale: Locale,
  name: string,
  relation: string,
  tone: string,
  expectations: string
): string {
  if (locale === "fr") {
    return `Tu es ${name}, un compagnon AmorIAI. Ton rôle principal : ${relation}. 
Ton ton préféré : ${tone}. 
Ta mission : ${expectations || "soutenir ton humain au quotidien"}. 
Réponds toujours avec empathie, clarté et bienveillance.`;
  }
  if (locale === "en") {
    return `You are ${name}, an AmorIAI companion. Your main role: ${relation}. 
Preferred tone: ${tone}. 
Your mission: ${expectations || "support your human in their daily life"}. 
Always answer with empathy, clarity and kindness.`;
  }
  return `Eres ${name}, un compañero AmorIAI. Tu papel principal: ${relation}. 
Tono preferido: ${tone}. 
Tu misión: ${expectations || "apoyar a tu humano en su día a día"}. 
Responde siempre con empatía, claridad y amabilidad.`;
}

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function CreateAmoriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = normalizeLocale(searchParams.get("lang"));
  const t = STRINGS[locale];

  const planParam = searchParams.get("plan");
  const planLabel = getPlanLabel(planParam, locale);

  const [name, setName] = useState("");
  const [relationType, setRelationType] = useState(t.relationOptions[0]);
  const [tone, setTone] = useState(t.toneOptions[0]);
  const [category, setCategory] = useState<PersonaCategory>("woman");
  const [expectations, setExpectations] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // met à jour les options quand la langue change
  useEffect(() => {
    setRelationType(STRINGS[locale].relationOptions[0]);
    setTone(STRINGS[locale].toneOptions[0]);
  }, [locale]);

  const avatarUrl = getAvatarForCategory(category);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError(t.errorNotLogged);
        setSaving(false);
        return;
      }

      const safeName = name.trim() || (locale === "fr" ? "AmorIAI" : "AmorIAI");
      const systemPrompt = buildSystemPrompt(
        locale,
        safeName,
        relationType,
        tone,
        expectations.trim()
      );

      const { error: insertError } = await supabase.from("user_amoria").insert({
        user_id: user.id,
        name: safeName,
        persona_type: category, // "woman" | "man" | "androgynous" | "50plus"
        main_language: locale,
        avatar_image_url: avatarUrl,
        accent_color: "#fb37ff",
        system_prompt: systemPrompt,
        voice_id: null,
      });

      if (insertError) {
        console.error(insertError);
        setError(t.errorGeneric);
        setSaving(false);
        return;
      }

      // tout est bon → on envoie vers la page "mon espace AmorIA"
      const params = new URLSearchParams();
      params.set("lang", locale);
      router.push(`/my-amoria?${params.toString()}`);
    } catch (err) {
      console.error(err);
      setError(t.errorGeneric);
      setSaving(false);
    }
  };

  const handleBackHome = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/?${params.toString()}`);
  };

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

          <section className="amoria-plan-current">
            <span className="amoria-plan-current-label">
              {t.currentPlanLabel}
            </span>
            <span className="amoria-plan-current-name">{planLabel}</span>
          </section>

          <form onSubmit={handleSubmit} className="amoria-create-grid">
            <div className="amoria-create-form">
              <label className="amoria-field">
                <span className="amoria-field-label">{t.nameLabel}</span>
                <input
                  type="text"
                  className="amoria-input"
                  placeholder="Ex : Léo, Amélia, Nova…"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="amoria-field">
                <span className="amoria-field-label">{t.relationLabel}</span>
                <select
                  className="amoria-input"
                  value={relationType}
                  onChange={(e) => setRelationType(e.target.value)}
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
                  className="amoria-input"
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
                  className="amoria-input"
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

              <label className="amoria-field">
                <span className="amoria-field-label">
                  {t.expectationsLabel}
                </span>
                <textarea
                  className="amoria-textarea"
                  rows={4}
                  placeholder={t.expectationsPlaceholder}
                  value={expectations}
                  onChange={(e) => setExpectations(e.target.value)}
                />
              </label>

              {error && <p className="amoria-error">{error}</p>}

              <div className="amoria-create-actions">
                <button
                  type="submit"
                  className="amoria-create-primary"
                  disabled={saving}
                >
                  {saving ? "..." : t.createButton}
                </button>
                <button
                  type="button"
                  className="amoria-create-secondary"
                  onClick={handleBackHome}
                  disabled={saving}
                >
                  {t.backHome}
                </button>
              </div>
            </div>

            <aside className="amoria-create-preview">
              <div className="amoria-create-avatar-frame">
                <img
                  src={avatarUrl}
                  alt="Aperçu Avatar AmorIAI"
                  className="amoria-create-avatar-img"
                />
              </div>
            </aside>
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
          background: radial-gradient(circle at top, #020617 0, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-create-wrapper {
          max-width: 960px;
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
          padding: 1.8rem 1.7rem 1.6rem;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.9);
        }

        .amoria-create-header {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: 1.1rem;
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
          margin-bottom: 1rem;
          font-size: 0.8rem;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          background: rgba(96, 165, 250, 0.15);
          color: #bfdbfe;
          border: 1px solid rgba(59, 130, 246, 0.7);
        }

        .amoria-plan-current {
          border-radius: 1rem;
          padding: 0.8rem 1rem;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.6);
          margin-bottom: 1.3rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .amoria-plan-current-label {
          color: #9ca3af;
        }

        .amoria-plan-current-name {
          font-weight: 500;
        }

        .amoria-create-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 1.5rem;
        }

        .amoria-create-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .amoria-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.82rem;
        }

        .amoria-field-label {
          color: #d1d5db;
        }

        .amoria-input {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 0.55rem 0.9rem;
          background: rgba(15, 23, 42, 0.9);
          color: #f9fafb;
          font-size: 0.85rem;
        }

        .amoria-input:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-textarea {
          border-radius: 0.9rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 0.7rem 0.9rem;
          background: rgba(15, 23, 42, 0.9);
          color: #f9fafb;
          font-size: 0.85rem;
          resize: vertical;
          min-height: 120px;
        }

        .amoria-textarea:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-error {
          font-size: 0.78rem;
          color: #fecaca;
          background: rgba(185, 28, 28, 0.18);
          border-radius: 0.75rem;
          padding: 0.45rem 0.6rem;
          margin-top: 0.3rem;
        }

        .amoria-create-actions {
          margin-top: 0.7rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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

        .amoria-create-preview {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .amoria-create-avatar-frame {
          width: 200px;
          height: 320px;
          border-radius: 1.2rem;
          padding: 0.25rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #38bdf8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-create-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 1rem;
        }

        @media (max-width: 768px) {
          .amoria-create-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-create-card {
            padding-inline: 1.1rem;
          }

          .amoria-create-preview {
            justify-content: flex-start;
          }

          .amoria-create-avatar-frame {
            width: 160px;
            height: 260px;
          }
        }
      `}</style>
    </main>
  );
}
