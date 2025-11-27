"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

// Catégories d’IA, avec séparation femme / homme 50+
type PersonaType = "woman" | "man" | "woman50" | "man50" | "androgynous";

// -------------------- AVATARS PAR CATÉGORIE --------------------

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

// -------------------- TEXTES --------------------

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
  expectationLabel: string;
  expectationPlaceholder: string;
  notLoggedBanner: string;
  helperText: string;
  createButton: string;
  backHome: string;
  saving: string;
  genericError: string;
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
    expectationLabel: "Ce que tu attends le plus de ton AmorIAI",
    expectationPlaceholder:
      'Ex. : « M’aider à me sentir moins seule le soir », « Me motiver pour mes projets », « Me coacher émotionnellement »…',
    notLoggedBanner:
      "Tu dois être connectée pour créer ton AmorIAI. Reviens après t’être inscrite / connectée.",
    helperText:
      "Tu peux ajuster la personnalité, le style et la voix de ton AmorIAI plus tard depuis ton espace.",
    createButton: "Créer mon AmorIAI",
    backHome: "Retour à l’accueil",
    saving: "Création en cours…",
    genericError:
      "Une erreur est survenue pendant la création de ton AmorIAI. Merci de réessayer.",
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
    expectationLabel: "What you expect most from your AmorIAI",
    expectationPlaceholder:
      `"Help me feel less alone at night", "Motivate me for my projects", "Emotionally coach me"…`,
    notLoggedBanner:
      "You must be logged in to create your AmorIAI. Please come back after signing up / logging in.",
    helperText:
      "You’ll be able to adjust personality, style and voice later from your space.",
    createButton: "Create my AmorIAI",
    backHome: "Back to home",
    saving: "Creating your AmorIAI…",
    genericError:
      "Something went wrong while creating your AmorIAI. Please try again.",
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
    expectationLabel: "Lo que más esperas de tu AmorIAI",
    expectationPlaceholder:
      'Ej.: « Ayudarme a sentirme menos sola por la noche », « Motivarme con mis proyectos », « Acompañarme emocionalmente »…',
    notLoggedBanner:
      "Debes estar conectada para crear tu AmorIAI. Vuelve después de registrarte / iniciar sesión.",
    helperText:
      "Podrás ajustar la personalidad, el estilo y la voz de tu AmorIAI más adelante desde tu espacio.",
    createButton: "Crear mi AmorIAI",
    backHome: "Volver al inicio",
    saving: "Creando tu AmorIAI…",
    genericError:
      "Ocurrió un error al crear tu AmorIAI. Inténtalo de nuevo, por favor.",
  },
};

// -------------------- OPTIONS UI --------------------

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
  {
    value: "woman",
    label: { fr: "Femme", en: "Woman", es: "Mujer" },
  },
  {
    value: "man",
    label: { fr: "Homme", en: "Man", es: "Hombre" },
  },
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

// -------------------- COMPOSANT --------------------

export default function CreateAmoriaPage() {
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("fr");
  const [plan, setPlan] = useState<PlanId>("free");

  const [name, setName] = useState("");
  const [relationType, setRelationType] = useState("");
  const [tone, setTone] = useState("");
  const [category, setCategory] = useState<PersonaType>("woman");
  const [expectation, setExpectation] = useState("");

  const [avatarUrl, setAvatarUrl] = useState<string>(randomAvatar("woman"));

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auth : on vérifie la session côté client
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Lire ?lang= et ?plan= côté client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    const langParam = params.get("lang");
    if (langParam === "fr" || langParam === "en" || langParam === "es") {
      setLocale(langParam);
    }

    const planParam = params.get("plan");
    if (
      planParam === "free" ||
      planParam === "chat" ||
      planParam === "plus" ||
      planParam === "unlimited"
    ) {
      setPlan(planParam);
    }
  }, []);

  // Vérifier la session Supabase (utile après Google OAuth)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session?.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } finally {
        setAuthChecked(true);
      }
    };

    checkSession();
  }, []);

  const t = STRINGS[locale];
  const relationOptions = RELATION_OPTIONS[locale];
  const toneOptions = TONE_OPTIONS[locale];

  // changement de catégorie => nouvel avatar random
  const handleCategoryChange = (value: PersonaType) => {
    setCategory(value);
    setAvatarUrl(randomAvatar(value));
  };

  const categoryLabel = useMemo(() => {
    const found = CATEGORY_OPTIONS.find((c) => c.value === category);
    return found ? found.label[locale] : category;
  }, [category, locale]);

  const handleBackHome = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push("/?" + params.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg(
        locale === "fr"
          ? "Donne un prénom à ton AmorIAI."
          : locale === "en"
          ? "Please give your AmorIAI a name."
          : "Ponle un nombre a tu AmorIAI."
      );
      return;
    }

    setSaving(true);

    try {
      // On vérifie la session au moment du clic (plus fiable après OAuth)
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData?.session?.user) {
        setIsLoggedIn(false);
        setErrorMsg(t.notLoggedBanner);
        setSaving(false);
        return;
      }

      setIsLoggedIn(true);
      const userId = sessionData.session.user.id;

      const systemPrompt = `
Tu es ${name}, une AmorIAI de type "${categoryLabel}".
- Type de relation : ${relationType || "non précisé"}.
- Ton préféré : ${tone || "non précisé"}.
- Ce que l’utilisateur attend le plus de toi : ${expectation || "non précisé"}.

Ta mission est d’apporter soutien, écoute et accompagnement bienveillant,
sans jugement, en respectant les limites de l’utilisateur.
      `.trim();

      const { error } = await supabase.from("user_amoria").insert({
        user_id: userId,
        name,
        persona_type: category,
        main_language: locale,
        avatar_image_url: avatarUrl,
        accent_color: "#fb37ff",
        system_prompt: systemPrompt,
        voice_id: null,
        is_archived: false,
      });

      if (error) {
        console.error("insert error", error);
        setErrorMsg(t.genericError);
        setSaving(false);
        return;
      }

      const params = new URLSearchParams();
      params.set("lang", locale);
      router.push("/my-ai?" + params.toString());
    } catch (err) {
      console.error(err);
      setErrorMsg(t.genericError);
      setSaving(false);
    }
  };

  const isDisabled = saving;

  const showBanner = errorMsg || (authChecked && !isLoggedIn);

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

          {showBanner && (
            <div className="amoria-banner amoria-banner--error">
              {errorMsg ?? t.notLoggedBanner}
            </div>
          )}

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
                    handleCategoryChange(e.target.value as PersonaType)
                  }
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label[locale]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="amoria-right">
              <div className="amoria-avatar-frame">
                <img
                  src={avatarUrl}
                  alt="Aperçu AmorIAI"
                  className="amoria-avatar-img"
                />
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
          </form>

          <footer className="amoria-footer">
            <p className="amoria-helper">{t.helperText}</p>

            <div className="amoria-actions">
              <button
                type="button"
                className="amoria-btn amoria-btn--secondary"
                onClick={handleBackHome}
              >
                {t.backHome}
              </button>

              <button
                type="submit"
                className="amoria-btn amoria-btn--primary"
                onClick={handleSubmit}
                disabled={isDisabled}
              >
                {saving ? t.saving : t.createButton}
              </button>
            </div>
          </footer>
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

        .amoria-avatar-frame {
          border-radius: 1.2rem;
          padding: 0.25rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #38bdf8);
          display: flex;
          justify-content: center;
        }

        .amoria-avatar-img {
          width: 100%;
          max-width: 210px;
          border-radius: 1rem;
          object-fit: cover;
          display: block;
        }

        .amoria-footer {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 0.4rem;
        }

        .amoria-helper {
          font-size: 0.78rem;
          color: #9ca3af;
          max-width: 420px;
        }

        .amoria-actions {
          display: flex;
          gap: 0.6rem;
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
          opacity: 0.6;
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

          .amoria-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }

        @media (max-width: 520px) {
          .amoria-footer {
            flex-direction: column;
            align-items: flex-start;
          }
          .amoria-actions {
            width: 100%;
            justify-content: stretch;
          }
          .amoria-btn {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
