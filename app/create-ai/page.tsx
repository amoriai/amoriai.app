      "use client";

import React, { useEffect, useState, FormEvent } from "react";

type Locale = "fr" | "en" | "es";
type CategoryId = "woman" | "man" | "androgynous" | "50plus";

type AvatarDef = {
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
    nameLabel: string;
    goalLabel: string;
    goalPlaceholder: string;
    submit: string;
    submitting: string;
    errorCategory: string;
    errorAvatar: string;
    previewTitle: string;
    previewCategory: string;
    previewAvatar: string;
    previewGoal: string;
    hiddenAvatarInfo: string;
    doneMessage: string;
  }
> = {
  fr: {
    backHome: "← Retour à l’accueil",
    langNote:
      "Tu peux créer ton AmorIA en français, anglais ou espagnol. La langue vient de ta sélection sur la page principale.",
    stepLabel: (step, total) => `Étape ${step} sur ${total}`,
    wizardTitle: "Crée ton AmorIA en quelques clics",
    wizardSubtitle:
      "Choisis le type d’IA, la vibe de ton avatar et personnalise sa mission. L’avatar final apparaîtra dans ton compte après la création.",
    steps: {
      oneTitle: "Choisis le type d’IA",
      oneSubtitle:
        "Préférence de genre et de style global. Tu pourras affiner ensuite.",
      twoTitle: "Choisis la vibe de ton AmorIA",
      twoSubtitle:
        "Sélectionne le style de personnalité. L’image finale sera générée après.",
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
    nameLabel: "Prénom de ton AmorIA",
    goalLabel: "Mission principale de ton AmorIA",
    goalPlaceholder:
      "Exemples : m’aider à gérer mon anxiété, être mon partenaire d’écriture, coach de vie doux, etc.",
    submit: "Terminer et accéder à mon AmorIA",
    submitting: "Création en cours…",
    errorCategory: "Choisis d’abord un type d’IA pour continuer.",
    errorAvatar: "Choisis un style d’IA avant de passer à l’étape suivante.",
    previewTitle: "Aperçu rapide",
    previewCategory: "Type d’IA",
    previewAvatar: "Style choisi",
    previewGoal: "Mission principale",
    hiddenAvatarInfo:
      "L’avatar visuel sera généré à partir de ces choix et apparaîtra dans ton compte.",
    doneMessage:
      "Ton AmorIA est créée (démo). Tu pourras brancher la vraie logique plus tard.",
  },
  en: {
    backHome: "← Back to home",
    langNote:
      "You can create your AmorIA in French, English or Spanish. The language comes from your choice on the main page.",
    stepLabel: (step, total) => `Step ${step} of ${total}`,
    wizardTitle: "Create your AmorIA in a few clicks",
    wizardSubtitle:
      "Choose the AI type, pick its vibe and define its main mission. The final avatar will appear in your account after creation.",
    steps: {
      oneTitle: "Choose your AI type",
      oneSubtitle:
        "Gender preference and overall vibe. You can adjust later if needed.",
      twoTitle: "Choose your AmorIA’s vibe",
      twoSubtitle:
        "Pick the personality style. The visual avatar will be generated after.",
      threeTitle: "Customize your AmorIA",
      threeSubtitle:
        "Give it a name and a main mission. You’ll be able to edit all this later.",
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
    nameLabel: "Your AmorIA’s first name",
    goalLabel: "Main mission of your AmorIA",
    goalPlaceholder:
      "Examples: help me manage my anxiety, be my writing partner, gentle life coach, etc.",
    submit: "Finish and open my AmorIA",
    submitting: "Creating your AmorIA…",
    errorCategory: "Please choose a type of AI first.",
    errorAvatar: "Please choose a style before continuing.",
    previewTitle: "Quick preview",
    previewCategory: "AI type",
    previewAvatar: "Selected style",
    previewGoal: "Main mission",
    hiddenAvatarInfo:
      "The visual avatar will be generated from these choices and appear in your account.",
    doneMessage:
      "Your AmorIA has been created (demo). You’ll plug the real logic later.",
  },
  es: {
    backHome: "← Volver al inicio",
    langNote:
      "Puedes crear tu AmorIA en francés, inglés o español. El idioma viene de tu elección en la página principal.",
    stepLabel: (step, total) => `Paso ${step} de ${total}`,
    wizardTitle: "Crea tu AmorIA en pocos clics",
    wizardSubtitle:
      "Elige el tipo de IA, define su estilo y su misión principal. El avatar final aparecerá en tu cuenta después de la creación.",
    steps: {
      oneTitle: "Elige el tipo de IA",
      oneSubtitle:
        "Preferencia de género y estilo global. Podrás ajustarlo más tarde.",
      twoTitle: "Elige el estilo de tu AmorIA",
      twoSubtitle:
        "Selecciona el tipo de personalidad. El avatar visual se generará después.",
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
        name: "50 años o más",
        description:
          "Una IA con aspecto más maduro, sabio, profesional o carismático.",
      },
    },
    nameLabel: "Nombre de tu AmorIA",
    goalLabel: "Misión principal de tu AmorIA",
    goalPlaceholder:
      "Ejemplos: ayudarme con la ansiedad, ser mi compañera de escritura, coach de vida suave, etc.",
    submit: "Terminar y abrir mi AmorIA",
    submitting: "Creando tu AmorIA…",
    errorCategory: "Primero elige un tipo de IA.",
    errorAvatar: "Elige un estilo antes de continuar.",
    previewTitle: "Vista rápida",
    previewCategory: "Tipo de IA",
    previewAvatar: "Estilo elegido",
    previewGoal: "Misión principal",
    hiddenAvatarInfo:
      "El avatar visual se generará a partir de estas elecciones y aparecerá en tu cuenta.",
    doneMessage:
      "Tu AmorIA ha sido creada (demo). Conectarás la lógica real más adelante.",
  },
};

const AVATARS: Record<CategoryId, AvatarDef[]> = {
  woman: [
    {
      id: "woman_blonde",
      label: "Lumière chaleureuse",
      short: "Féminine, douce et optimiste.",
    },
    {
      id: "woman_rousse",
      label: "Créative & intuitive",
      short: "Parfaite pour brainstormer et écrire.",
    },
    {
      id: "woman_mystique",
      label: "Mystique",
      short: "Plus spirituelle, un peu mystérieuse.",
    },
    {
      id: "woman_passionnee",
      label: "Passionnée",
      short: "Énergique, motivante, très engagée.",
    },
    {
      id: "woman_analyste",
      label: "Analytique",
      short: "Posée, rationnelle, structurée.",
    },
    {
      id: "woman_artiste",
      label: "Artiste",
      short: "Axée projets créatifs et imagination.",
    },
  ],
  man: [
    {
      id: "man_ami",
      label: "Ami bienveillant",
      short: "Doux, présent, bon confident.",
    },
    {
      id: "man_intellectuel",
      label: "Intellectuel",
      short: "Réfléchi, analytique, très logique.",
    },
    {
      id: "man_passionne",
      label: "Passionné",
      short: "Énergique, motivant, beaucoup d’enthousiasme.",
    },
    {
      id: "man_protecteur",
      label: "Protecteur",
      short: "Calme, sécurisant, rassurant.",
    },
    {
      id: "man_rebelle",
      label: "Rebelle",
      short: "Franc, direct, zéro bullshit.",
    },
    {
      id: "man_romantique",
      label: "Romantique",
      short: "Plus doux, sensible, axé connexion.",
    },
  ],
  androgynous: [
    {
      id: "andro_romantic",
      label: "Romantique",
      short: "Androgyne doux, chaleureux, relationnel.",
    },
    {
      id: "andro_echo",
      label: "Coach personnalisé",
      short: "Aligné sur tes objectifs personnels.",
    },
    {
      id: "andro_eko",
      label: "Ami neutre",
      short: "Présence non genrée, très empathique.",
    },
    {
      id: "andro_lumen",
      label: "Sensuel·le",
      short: "Énergie douce et magnétique.",
    },
    {
      id: "andro_nova",
      label: "Mystérieux·se",
      short: "Vibe plus profonde, introspective.",
    },
    {
      id: "andro_sora",
      label: "Coach mental",
      short: "Focus mindset, confiance et clarté.",
    },
  ],
  "50plus": [
    {
      id: "50_man_charm",
      label: "Homme charismatique 50+",
      short: "Chaleureux, confiant, un peu séducteur.",
    },
    {
      id: "50_man_elegant",
      label: "Homme élégant 50+",
      short: "Style très soigné, vibe mentor.",
    },
    {
      id: "50_man_empathic",
      label: "Homme empathique 50+",
      short: "À l’écoute, rassurant, patient.",
    },
    {
      id: "50_man_mysterious",
      label: "Homme mystérieux 50+",
      short: "Plus réservé, profond, observateur.",
    },
    {
      id: "50_man_thoughtful",
      label: "Homme réfléchi 50+",
      short: "Analytique, posé, très rationnel.",
    },
    {
      id: "50_man_warm",
      label: "Homme chaleureux 50+",
      short: "Très accessible, humour léger.",
    },
    {
      id: "50_woman_charisma",
      label: "Femme charismatique 50+",
      short: "Présence forte, inspirante.",
    },
    {
      id: "50_woman_elegant",
      label: "Femme élégante 50+",
      short: "Professionnelle, structurée, mentor.",
    },
    {
      id: "50_woman_pro",
      label: "Femme pro 50+",
      short: "Business, organisation, carrière.",
    },
    {
      id: "50_woman_sage",
      label: "Femme sage 50+",
      short: "Beaucoup d’expérience, conseils posés.",
    },
    {
      id: "50_woman_spiritual",
      label: "Femme spirituelle 50+",
      short: "Intuitive, orientée bien-être.",
    },
    {
      id: "50_woman_whitehair",
      label: "Femme cheveux blancs 50+",
      short: "Très assumée, vibe grand mentor.",
    },
  ],
};

export default function CreateAIPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Langue provenant de ?lang=fr|en|es
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
    if (!avatarId) {
      setError(t.errorAvatar);
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Ici tu brancheras Supabase plus tard.
    setTimeout(() => {
      alert(t.doneMessage);
      window.location.href = "/";
    }, 800);
  };

  const activeAvatars: AvatarDef[] = category ? AVATARS[category] : [];
  const selectedAvatar =
    category && avatarId
      ? activeAvatars.find((a) => a.id === avatarId) ?? null
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
        {/* plus de switch de langue ici */}
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
              <p className="amoria-step-subtitle">
                {t.steps.oneSubtitle}
              </p>

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
                      onClick={() => setCategory(cat)}
                      className={
                        "amoria-category-card" +
                        (isActive ? " amoria-category-card--active" : "")
                      }
                    >
                      <div className="amoria-category-pill">
                        {def.name}
                      </div>
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
                  {step === 1 ? "Continuer" : "Suivant"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="amoria-step-title">{t.steps.twoTitle}</h2>
              <p className="amoria-step-subtitle">
                {t.steps.twoSubtitle}
              </p>

              <div className="amoria-avatar-grid">
                {activeAvatars.map((avatar) => {
                  const isSelected = avatarId === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setAvatarId(avatar.id)}
                      className={
                        "amoria-avatar-card" +
                        (isSelected ? " amoria-avatar-card--active" : "")
                      }
                    >
                      {/* PAS D’IMAGE ICI, seulement du texte */}
                      <div className="amoria-avatar-text">
                        <h3 className="amoria-avatar-label">
                          {avatar.label}
                        </h3>
                        <p className="amoria-avatar-short">
                          {avatar.short}
                        </p>
                      </div>
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
                  ← Retour
                </button>
                <button
                  type="button"
                  className="amoria-btn amoria-btn--primary"
                  onClick={handleNextFromStep2}
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="amoria-step-title">{t.steps.threeTitle}</h2>
              <p className="amoria-step-subtitle">
                {t.steps.threeSubtitle}
              </p>

              <label className="amoria-form-label">
                {t.nameLabel}
              </label>
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

              <div className="amoria-step-actions">
                <button
                  type="button"
                  className="amoria-btn amoria-btn--ghost"
                  onClick={() => {
                    setStep(2);
                    setError(null);
                  }}
                >
                  ← Retour
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
            <h3 className="amoria-preview-title">
              {t.previewTitle}
            </h3>

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
                {t.previewAvatar}
              </span>
              <span className="amoria-preview-value">
                {selectedAvatar ? selectedAvatar.label : "—"}
              </span>
            </div>

            <div className="amoria-preview-row amoria-preview-row--column">
              <span className="amoria-preview-label">
                {t.previewGoal}
              </span>
              <span className="amoria-preview-value">
                {goal || "Tu peux définir la mission principale à l’étape 3."}
              </span>
            </div>

            <p className="amoria-preview-hidden-info">
              {t.hiddenAvatarInfo}
            </p>

            {name && (
              <div className="amoria-preview-row amoria-preview-row--column">
                <span className="amoria-preview-label">Nom</span>
                <span className="amoria-preview-value">{name}</span>
              </div>
            )}
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

        .amoria-avatar-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.9rem;
        }

        .amoria-avatar-card {
          border-radius: 1.1rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: #020617;
          cursor: pointer;
          text-align: left;
          display: flex;
          flex-direction: column;
          padding: 0.7rem 0.75rem;
        }

        .amoria-avatar-card--active {
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.6);
        }

        .amoria-avatar-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .amoria-avatar-label {
          font-size: 0.86rem;
        }

        .amoria-avatar-short {
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

        .amoria-preview-hidden-info {
          margin-top: 0.8rem;
          font-size: 0.78rem;
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

          .amoria-avatar-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </main>
  );
}
