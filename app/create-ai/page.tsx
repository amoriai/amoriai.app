"use client";

import React, { useEffect, useState, FormEvent } from "react";

type Locale = "fr" | "en" | "es";
type CategoryId = "woman" | "man" | "androgynous" | "50plus";

type PersonalityDef = {
  id: string;
  label: string;
  short: string;
};

const STRINGS: Record<
  Locale,
  {
    backHome: string;
    langNote: string;
    stepLabel: (step: number, total: number) => string;
    wizardTitle: string;
    wizardSubtitle: string;
    steps: {
      oneTitle: string;
      oneSubtitle: string;
      twoTitle: string;
      twoSubtitle: string;
      threeTitle: string;
      threeSubtitle: string;
    };
    categories: Record<
      CategoryId,
      {
        name: string;
        description: string;
      }
    >;
    personalitiesTitle: string;
    personalitiesNote: string;
    nameLabel: string;
    goalLabel: string;
    goalPlaceholder: string;
    submit: string;
    submitting: string;
    errorCategory: string;
    errorPersonality: string;
    errorGeneric: string;
    previewTitle: string;
    previewCategory: string;
    previewPersonality: string;
    previewGoal: string;
    previewNameLabel: string;
  }
> = {
  fr: {
    backHome: "← Retour à l’accueil",
    langNote:
      "La langue suit celle choisie sur la page principale (français, anglais ou espagnol).",
    stepLabel: (step, total) => `Étape ${step} sur ${total}`,
    wizardTitle: "Crée ton AmorIA en quelques clics",
    wizardSubtitle:
      "Choisis le type d’IA, sa personnalité et sa mission. L’apparence visuelle sera générée automatiquement dans ton espace personnel après la création.",
    steps: {
      oneTitle: "Choisis le type d’IA",
      oneSubtitle:
        "Préférence de genre et de style global. Tu pourras recréer une autre AmorIA plus tard.",
      twoTitle: "Choisis sa personnalité",
      twoSubtitle:
        "On ne montre pas encore le visuel : tu définis surtout le tempérament et la vibe.",
      threeTitle: "Personnalise ton AmorIA",
      threeSubtitle:
        "Donne-lui un prénom et une mission principale. Tu pourras modifier plus tard.",
    },
    categories: {
      woman: {
        name: "IA féminine",
        description:
          "Énergie féminine douce, empathique ou affirmée. Parfaite comme alliée du quotidien.",
      },
      man: {
        name: "IA masculine",
        description:
          "Présence masculine stable, protectrice, charismatique ou intellectuelle.",
      },
      androgynous: {
        name: "IA androgyne / non genrée",
        description:
          "Ni vraiment homme ni femme : une présence fluide, inclusive et moderne.",
      },
      "50plus": {
        name: "50 ans et plus",
        description:
          "Une IA avec un visage plus mature, sage, pro ou charismatique, pour un lien plus réaliste.",
      },
    },
    personalitiesTitle: "Choisis sa personnalité principale",
    personalitiesNote:
      "Le style visuel précis sera généré automatiquement à la fin, selon tes choix.",
    nameLabel: "Prénom de ton AmorIA",
    goalLabel: "Mission principale de ton AmorIA",
    goalPlaceholder:
      "Exemples : m’aider à gérer mon anxiété, être mon partenaire d’écriture, coach de vie doux, etc.",
    submit: "Terminer et accéder à mon compte",
    submitting: "Création en cours…",
    errorCategory: "Choisis d’abord un type d’IA pour continuer.",
    errorPersonality: "Choisis au moins une personnalité pour continuer.",
    errorGeneric:
      "Impossible de créer ton AmorIA pour le moment. Réessaie dans quelques instants.",
    previewTitle: "Aperçu rapide de ton AmorIA",
    previewCategory: "Type d’IA",
    previewPersonality: "Personnalité principale",
    previewGoal: "Mission principale",
    previewNameLabel: "Prénom choisi",
  },
  en: {
    backHome: "← Back to home",
    langNote:
      "Language follows what you selected on the main page (French, English or Spanish).",
    stepLabel: (step, total) => `Step ${step} of ${total}`,
    wizardTitle: "Create your AmorIA in a few clicks",
    wizardSubtitle:
      "Choose the AI type, personality and mission. The visual avatar will be generated automatically in your personal space after creation.",
    steps: {
      oneTitle: "Choose your AI type",
      oneSubtitle:
        "Gender preference and overall vibe. You’ll be able to create other AmorIAs later.",
      twoTitle: "Choose its personality",
      twoSubtitle:
        "We’re not showing the visual yet: you mainly define temperament and vibe.",
      threeTitle: "Customize your AmorIA",
      threeSubtitle:
        "Give it a name and a main mission. You can edit this later.",
    },
    categories: {
      woman: {
        name: "Feminine AI",
        description:
          "Soft, empathic or confident feminine energy. Perfect as a daily ally.",
      },
      man: {
        name: "Masculine AI",
        description:
          "Stable, protective, charismatic or intellectual masculine presence.",
      },
      androgynous: {
        name: "Androgynous / non-gendered AI",
        description:
          "Not really male or female: a fluid, inclusive and modern presence.",
      },
      "50plus": {
        name: "50+ years look",
        description:
          "A more mature, wise, professional or charismatic face for a realistic connection.",
      },
    },
    personalitiesTitle: "Choose its main personality",
    personalitiesNote:
      "The exact visual style will be generated automatically at the end, based on your choices.",
    nameLabel: "Your AmorIA’s first name",
    goalLabel: "Main mission of your AmorIA",
    goalPlaceholder:
      "Examples: help me manage my anxiety, be my writing partner, gentle life coach, etc.",
    submit: "Finish and go to my account",
    submitting: "Creating your AmorIA…",
    errorCategory: "Please choose a type of AI first.",
    errorPersonality: "Please choose at least one personality.",
    errorGeneric:
      "We couldn’t create your AmorIA right now. Please try again in a moment.",
    previewTitle: "Quick preview of your AmorIA",
    previewCategory: "AI type",
    previewPersonality: "Main personality",
    previewGoal: "Main mission",
    previewNameLabel: "Chosen name",
  },
  es: {
    backHome: "← Volver al inicio",
    langNote:
      "El idioma sigue el que elegiste en la página principal (francés, inglés o español).",
    stepLabel: (step, total) => `Paso ${step} de ${total}`,
    wizardTitle: "Crea tu AmorIA en pocos clics",
    wizardSubtitle:
      "Elige el tipo de IA, su personalidad y su misión. El avatar visual se generará automáticamente en tu espacio personal después de la creación.",
    steps: {
      oneTitle: "Elige el tipo de IA",
      oneSubtitle:
        "Preferencia de género y estilo global. Podrás crear otras AmorIA más adelante.",
      twoTitle: "Elige su personalidad",
      twoSubtitle:
        "Todavía no mostramos el visual: defines sobre todo el temperamento y la vibra.",
      threeTitle: "Personaliza tu AmorIA",
      threeSubtitle:
        "Ponle un nombre y una misión principal. Podrás editarlo después.",
    },
    categories: {
      woman: {
        name: "IA femenina",
        description:
          "Energía femenina suave, empática o segura de sí. Ideal como aliada diaria.",
      },
      man: {
        name: "IA masculina",
        description:
          "Presencia masculina estable, protectora, carismática o intelectual.",
      },
      androgynous: {
        name: "IA andrógina / sin género",
        description:
          "Ni hombre ni mujer: una presencia fluida, inclusiva y moderna.",
      },
      "50plus": {
        name: "Apariencia 50+",
        description:
          "Un rostro más maduro, sabio, profesional o carismático para una conexión realista.",
      },
    },
    personalitiesTitle: "Elige su personalidad principal",
    personalitiesNote:
      "El estilo visual exacto se generará automáticamente al final, según tus elecciones.",
    nameLabel: "Nombre de tu AmorIA",
    goalLabel: "Misión principal de tu AmorIA",
    goalPlaceholder:
      "Ejemplos: ayudarme con la ansiedad, ser mi compañero de escritura, coach de vida suave, etc.",
    submit: "Terminar e ir a mi cuenta",
    submitting: "Creando tu AmorIA…",
    errorCategory: "Primero elige un tipo de IA.",
    errorPersonality: "Elige al menos una personalidad.",
    errorGeneric:
      "No hemos podido crear tu AmorIA ahora. Vuelve a intentarlo en unos instantes.",
    previewTitle: "Vista rápida de tu AmorIA",
    previewCategory: "Tipo de IA",
    previewPersonality: "Personalidad principal",
    previewGoal: "Misión principal",
    previewNameLabel: "Nombre elegido",
  },
};

const PERSONALITIES: Record<CategoryId, PersonalityDef[]> = {
  woman: [
    {
      id: "soft_support",
      label: "Douce & rassurante",
      short: "Idéale pour parler de tout sans jugement.",
    },
    {
      id: "creative",
      label: "Créative & intuitive",
      short: "Parfaite pour brainstormer et imaginer des projets.",
    },
    {
      id: "coach",
      label: "Coach de vie",
      short: "Te pousse doucement à passer à l’action.",
    },
  ],
  man: [
    {
      id: "friend",
      label: "Ami bienveillant",
      short: "Présent, calme, bon confident.",
    },
    {
      id: "strategist",
      label: "Stratège",
      short: "Très logique, aide à prendre des décisions.",
    },
    {
      id: "charismatic",
      label: "Charismatique",
      short: "Plus séducteur, sûr de lui, énergique.",
    },
  ],
  androgynous: [
    {
      id: "neutral_friend",
      label: "Présence neutre",
      short: "Ni homme ni femme, très empathique et fluide.",
    },
    {
      id: "mindset",
      label: "Coach mindset",
      short: "Focus confiance, clarté mentale et sérénité.",
    },
    {
      id: "deep",
      label: "Profond & introspectif",
      short: "Parle beaucoup de sens, valeurs, identité.",
    },
  ],
  "50plus": [
    {
      id: "mentor",
      label: "Mentor expérimenté",
      short: "Beaucoup de vécu, conseils posés et réalistes.",
    },
    {
      id: "warm_sage",
      label: "Sage chaleureux",
      short: "Écoute, douceur, humour discret.",
    },
    {
      id: "pro",
      label: "Profil très pro",
      short: "Idéal pour parler carrière, business et organisation.",
    },
  ],
};

export default function CreateAIPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [personalityId, setPersonalityId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Langue depuis ?lang=
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      if (lang === "fr" || lang === "en" || lang === "es") {
        setLocale(lang);
      }
    } catch {
      // ignore
    }
  }, []);

  const t = STRINGS[locale];

  const handleNextFromStep1 = () => {
    if (!category) {
      setError(t.errorCategory);
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!personalityId) {
      setError(t.errorPersonality);
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!category) {
      setError(t.errorCategory);
      return;
    }
    if (!personalityId) {
      setError(t.errorPersonality);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/create-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          personalityId,
          name,
          goal,
          locale,
        }),
      });

      if (!res.ok) {
        let msg: string | undefined;
        try {
          const data = await res.json();
          msg = data?.error;
        } catch {
          // ignore
        }
        setError(msg || t.errorGeneric);
        setIsSubmitting(false);
        return;
      }

      const params = new URLSearchParams();
      params.set("lang", locale);
      window.location.href = `/my-ai?${params.toString()}`;
    } catch {
      setError(t.errorGeneric);
      setIsSubmitting(false);
    }
  };

  const activePersonalities: PersonalityDef[] =
    category ? PERSONALITIES[category] : [];

  const selectedPersonality =
    category && personalityId
      ? activePersonalities.find((p) => p.id === personalityId) ?? null
      : null;

  return (
    <main className="amoria-create-root">
      <header className="amoria-create-header">
        <div className="amoria-create-header-left">
          <a href="/" className="amoria-create-back">
            {t.backHome}
          </a>
          <span className="amoria-create-lang-note">{t.langNote}</span>
        </div>
      </header>

      <section className="amoria-create-main">
        <div className="amoria-create-left">
          <p className="amoria-step-label">{t.stepLabel(step, 3)}</p>
          <h1 className="amoria-create-title">{t.wizardTitle}</h1>
          <p className="amoria-create-subtitle">{t.wizardSubtitle}</p>

          <div className="amoria-steps-indicator">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={
                  "amoria-step-dot" +
                  (s === step
                    ? " amoria-step-dot--active"
                    : s < step
                    ? " amoria-step-dot--done"
                    : "")
                }
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 className="amoria-step-title">{t.steps.oneTitle}</h2>
              <p className="amoria-step-subtitle">{t.steps.oneSubtitle}</p>

              <div className="amoria-category-grid">
                {(
                  ["woman", "man", "androgynous", "50plus"] as CategoryId[]
                ).map((cat) => {
                  const def = t.categories[cat];
                  const isActive = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setPersonalityId(null);
                        setError(null);
                      }}
                      className={
                        "amoria-category-card" +
                        (isActive ? " amoria-category-card--active" : "")
                      }
                    >
                      <div className="amoria-category-pill">{def.name}</div>
                      <p className="amoria-category-desc">
                        {def.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {error && <p className="amoria-error">{error}</p>}

              <div className="amoria-step-actions">
                <button
                  type="button"
                  className="amoria-btn amoria-btn--primary"
                  onClick={handleNextFromStep1}
                >
                  {locale === "fr"
                    ? "Continuer"
                    : locale === "en"
                    ? "Continue"
                    : "Continuar"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="amoria-step-title">{t.steps.twoTitle}</h2>
              <p className="amoria-step-subtitle">{t.steps.twoSubtitle}</p>

              <p className="amoria-personality-note">
                {t.personalitiesNote}
              </p>

              <div className="amoria-personality-grid">
                {activePersonalities.map((p) => {
                  const isSelected = personalityId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPersonalityId(p.id);
                        setError(null);
                      }}
                      className={
                        "amoria-personality-card" +
                        (isSelected ? " amoria-personality-card--active" : "")
                      }
                    >
                      <div className="amoria-personality-label">
                        {p.label}
                      </div>
                      <p className="amoria-personality-short">{p.short}</p>
                    </button>
                  );
                })}
              </div>

              {error && <p className="amoria-error">{error}</p>}

              <div className="amoria-step-actions">
                <button
                  type="button"
                  className="amoria-btn amoria-btn--ghost"
                  onClick={() => {
                    setStep(1);
                    setError(null);
                  }}
                >
                  {locale === "fr"
                    ? "← Retour"
                    : locale === "en"
                    ? "← Back"
                    : "← Volver"}
                </button>
                <button
                  type="button"
                  className="amoria-btn amoria-btn--primary"
                  onClick={handleNextFromStep2}
                >
                  {locale === "fr"
                    ? "Continuer"
                    : locale === "en"
                    ? "Continue"
                    : "Continuar"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="amoria-step-title">{t.steps.threeTitle}</h2>
              <p className="amoria-step-subtitle">{t.steps.threeSubtitle}</p>

              <label className="amoria-form-label">{t.nameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="amoria-input"
              />

              <label className="amoria-form-label amoria-form-label--mt">
                {t.goalLabel}
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={4}
                placeholder={t.goalPlaceholder}
                className="amoria-textarea"
              />

              {error && <p className="amoria-error">{error}</p>}

              <div className="amoria-step-actions">
                <button
                  type="button"
                  className="amoria-btn amoria-btn--ghost"
                  onClick={() => {
                    setStep(2);
                    setError(null);
                  }}
                >
                  {locale === "fr"
                    ? "← Retour"
                    : locale === "en"
                    ? "← Back"
                    : "← Volver"}
                </button>
                <button
                  type="submit"
                  className="amoria-btn amoria-btn--primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.submitting : t.submit}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="amoria-create-right">
          <div className="amoria-preview-card">
            <h3 className="amoria-preview-title">{t.previewTitle}</h3>

            <div className="amoria-preview-row">
              <span className="amoria-preview-label">
                {t.previewCategory}
              </span>
              <span className="amoria-preview-value">
                {category ? t.categories[category].name : "—"}
              </span>
            </div>

            <div className="amoria-preview-row amoria-preview-row--column">
              <span className="amoria-preview-label">
                {t.previewPersonality}
              </span>
              <span className="amoria-preview-value">
                {selectedPersonality ? selectedPersonality.label : "…"}
              </span>
            </div>

            <div className="amoria-preview-row amoria-preview-row--column">
              <span className="amoria-preview-label">{t.previewGoal}</span>
              <span className="amoria-preview-value">
                {goal ||
                  (locale === "fr"
                    ? "Tu peux définir la mission principale à l’étape 3."
                    : locale === "en"
                    ? "You can define the main mission at step 3."
                    : "Puedes definir la misión principal en el paso 3.")}
              </span>
            </div>

            <div className="amoria-preview-row amoria-preview-row--column">
              <span className="amoria-preview-label">
                {t.previewNameLabel}
              </span>
              <span className="amoria-preview-value">
                {name || "—"}
              </span>
            </div>

            <div className="amoria-preview-placeholder-block">
              <div className="amoria-preview-silhouette" />
              <p className="amoria-preview-placeholder">
                {locale === "fr"
                  ? "Le visuel final de ton AmorIA sera généré automatiquement quand tu entreras dans ton compte."
                  : locale === "en"
                  ? "Your AmorIA’s final visual will be generated automatically when you enter your account."
                  : "El visual final de tu AmorIA se generará automáticamente cuando entres en tu cuenta."}
              </p>
            </div>
          </div>
        </aside>
      </section>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: radial-gradient(circle at top, #020617 0, #000 70%);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .amoria-create-root {
          min-height: 100vh;
          padding: 1.5rem 1.5rem 2.5rem;
        }

        .amoria-create-header {
          max-width: 1120px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .amoria-create-header-left {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .amoria-create-back {
          font-size: 0.8rem;
          color: #9ca3af;
          text-decoration: none;
        }

        .amoria-create-back:hover {
          color: #e5e7eb;
        }

        .amoria-create-lang-note {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-create-main {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr);
          gap: 2rem;
          align-items: flex-start;
        }

        .amoria-create-left {
          background: radial-gradient(circle at top, #020617, #020617 40%, #000);
          border-radius: 1.5rem;
          padding: 1.6rem 1.7rem 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.85);
        }

        .amoria-create-right {
          display: flex;
          justify-content: stretch;
        }

        .amoria-preview-card {
          width: 100%;
          max-width: 360px;
          margin-left: auto;
          background: radial-gradient(circle at top, #020617, #020617 40%, #020617);
          border-radius: 1.4rem;
          padding: 1.4rem 1.3rem;
          border: 1px solid rgba(148, 163, 184, 0.35);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.85);
        }

        .amoria-step-label {
          font-size: 0.78rem;
          color: #a5b4fc;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .amoria-create-title {
          margin-top: 0.6rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .amoria-create-subtitle {
          margin-top: 0.4rem;
          font-size: 0.88rem;
          color: #9ca3af;
          max-width: 34rem;
        }

        .amoria-steps-indicator {
          display: flex;
          gap: 0.35rem;
          margin: 1rem 0 1.1rem;
        }

        .amoria-step-dot {
          flex: 1;
          height: 4px;
          border-radius: 999px;
          background: rgba(31, 41, 55, 0.9);
        }

        .amoria-step-dot--active {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
        }

        .amoria-step-dot--done {
          background: #22c55e;
        }

        .amoria-step-title {
          font-size: 1.1rem;
          margin-bottom: 0.35rem;
        }

        .amoria-step-subtitle {
          font-size: 0.85rem;
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .amoria-category-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .amoria-category-card {
          text-align: left;
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: radial-gradient(circle at top, #020617, #020617 50%, #000);
          padding: 0.85rem 0.95rem;
          cursor: pointer;
        }

        .amoria-category-card--active {
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.6);
        }

        .amoria-category-pill {
          display: inline-flex;
          padding: 0.12rem 0.6rem;
          border-radius: 999px;
          font-size: 0.76rem;
          background: rgba(15, 23, 42, 0.96);
          color: #e5e7eb;
          border: 1px solid rgba(148, 163, 184, 0.7);
          margin-bottom: 0.4rem;
        }

        .amoria-category-desc {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-personality-note {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 0.7rem;
        }

        .amoria-personality-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .amoria-personality-card {
          text-align: left;
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: #020617;
          padding: 0.75rem 0.8rem;
          cursor: pointer;
        }

        .amoria-personality-card--active {
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.6);
        }

        .amoria-personality-label {
          font-size: 0.86rem;
          margin-bottom: 0.25rem;
        }

        .amoria-personality-short {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-form-label {
          font-size: 0.8rem;
          margin-bottom: 0.25rem;
          display: block;
        }

        .amoria-form-label--mt {
          margin-top: 1rem;
        }

        .amoria-input,
        .amoria-textarea {
          width: 100%;
          border-radius: 0.8rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: #020617;
          color: #e5e7eb;
          font-size: 0.86rem;
          padding: 0.6rem 0.8rem;
        }

        .amoria-textarea {
          resize: vertical;
          min-height: 110px;
        }

        .amoria-step-actions {
          margin-top: 1.2rem;
          display: flex;
          gap: 0.7rem;
          justify-content: flex-end;
        }

        .amoria-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          font-size: 0.86rem;
          cursor: pointer;
          white-space: nowrap;
          padding: 0.55rem 1.2rem;
        }

        .amoria-btn--primary {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          box-shadow: 0 14px 34px rgba(248, 113, 113, 0.45);
        }

        .amoria-btn--ghost {
          background: transparent;
          color: #e5e7eb;
          border-color: rgba(148, 163, 184, 0.6);
        }

        .amoria-error {
          margin-top: 0.7rem;
          font-size: 0.8rem;
          color: #f97373;
        }

        .amoria-preview-title {
          font-size: 0.9rem;
          margin-bottom: 0.7rem;
        }

        .amoria-preview-row {
          display: flex;
          justify-content: space-between;
          gap: 0.6rem;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .amoria-preview-row--column {
          flex-direction: column;
          align-items: flex-start;
        }

        .amoria-preview-label {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .amoria-preview-value {
          font-size: 0.86rem;
        }

        .amoria-preview-placeholder-block {
          margin-top: 1rem;
          border-radius: 1rem;
          border: 1px dashed rgba(148, 163, 184, 0.5);
          padding: 0.8rem;
          display: flex;
          gap: 0.8rem;
          align-items: center;
        }

        .amoria-preview-silhouette {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background: radial-gradient(
            circle at 30% 20%,
            #f9a8d4,
            #1f2937 70%
          );
          opacity: 0.8;
        }

        .amoria-preview-placeholder {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        @media (max-width: 960px) {
          .amoria-create-main {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-preview-card {
            max-width: none;
            margin-top: 1.5rem;
          }

          .amoria-personality-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .amoria-create-root {
            padding-inline: 1rem;
          }

          .amoria-create-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .amoria-category-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-personality-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </main>
  );
}
