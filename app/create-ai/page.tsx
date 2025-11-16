"use client";

import React, { useEffect, useState } from "react";

type Locale = "fr" | "en" | "es";
type BaseType = "woman" | "man" | "androgynous" | "over50";

type ProfileKey =
  | "warm"
  | "mysterious"
  | "charm"
  | "elegant"
  | "pro"
  | "sage"
  | "spiritual"
  | "whitehair"
  | "empathetic"
  | "thoughtful";

// ---------------------
// IMAGES (cachées aux users)
// ---------------------

const FIFTY_PLUS_WOMEN: Record<ProfileKey, string> = {
  warm: "/amoria_50plus_woman_charisma.png",
  mysterious: "/amoria_50plus_woman_elegant.png",
  charm: "/amoria_50plus_woman_pro.png",
  elegant: "/amoria_50plus_woman_elegant.png",
  pro: "/amoria_50plus_woman_pro.png",
  sage: "/amoria_50plus_woman_sage.png",
  spiritual: "/amoria_50plus_woman_spiritual.png",
  whitehair: "/amoria_50plus_woman_whitehair.png",
  empathetic: "/amoria_50plus_woman_spiritual.png",
  thoughtful: "/amoria_50plus_woman_sage.png",
};

const FIFTY_PLUS_MEN: Record<ProfileKey, string> = {
  warm: "/amoria_50plus_man_warm.png",
  mysterious: "/amoria_50plus_man_mysterious.png",
  charm: "/amoria_50plus_man_charm.png",
  elegant: "/amoria_50plus_man_elegant.png",
  pro: "/amoria_50plus_man_thoughtful.png",
  sage: "/amoria_50plus_man_thoughtful.png",
  spiritual: "/amoria_50plus_man_empathetic.png",
  whitehair: "/amoria_50plus_man_mysterious.png",
  empathetic: "/amoria_50plus_man_empathetic.png",
  thoughtful: "/amoria_50plus_man_thoughtful.png",
};

// Tes autres images existantes
const WOMEN_BASE: string[] = [
  "/amoria-blonde.png",
  "/amoria-rousse.png",
  "/amoria-passionnee.png",
];

const MEN_BASE: string[] = [
  "/amoria-m-ami.png",
  "/amoria-m-protecteur.png",
  "/amoria-m-rebelle.png",
];

const ANDROGYNOUS_BASE: string[] = [
  "/amor-romantic-androgynous.png",
  "/echo-custom-androgynous.png",
  "/lumen-sensual-androgynous.png",
  "/nova-mysterious-androgynous.png",
  "/sora-mentalcoach-androgynous.png",
];

// ---------------------
// TEXTES MULTILINGUES
// ---------------------

const STRINGS: Record<
  Locale,
  {
    title: string;
    step1: string;
    step2: string;
    typeWoman: string;
    typeMan: string;
    typeAndrogynous: string;
    typeOver50: string;
    vibesLabel: string;
    vibes: { key: ProfileKey; label: string }[];
    next: string;
    back: string;
    confirmTitle: string;
    confirmText: string;
    startChat: string;
  }
> = {
  fr: {
    title: "Construis ton AmorIA",
    step1: "Étape 1 • Qui veux-tu comme AmorIA ?",
    step2: "Étape 2 • Quel type d’énergie te ressemble le plus ?",
    typeWoman: "Femme",
    typeMan: "Homme",
    typeAndrogynous: "Androgyne / non genré·e",
    typeOver50: "50 ans et plus",
    vibesLabel: "Choisis l’ambiance principale",
    vibes: [
      { key: "warm", label: "Chaleureux / chaleureux" },
      { key: "mysterious", label: "Mystérieux·se" },
      { key: "empathetic", label: "Très empathique" },
      { key: "pro", label: "Posé·e et professionnel·le" },
      { key: "sage", label: "Sage et réfléchi·e" },
      { key: "spiritual", label: "Spirituel·le / connecté·e" },
    ],
    next: "Continuer",
    back: "Retour",
    confirmTitle: "Ton AmorIA est prêt·e 💫",
    confirmText:
      "Tu pourras bientôt commencer à texter et parler avec cette présence. Pour l’instant, nous sauvegardons simplement tes préférences.",
    startChat: "Retour à l’accueil",
  },
  en: {
    title: "Build your AmorIA",
    step1: "Step 1 • Who do you want as your AmorIA?",
    step2: "Step 2 • What kind of energy fits you best?",
    typeWoman: "Woman",
    typeMan: "Man",
    typeAndrogynous: "Androgynous / non-gendered",
    typeOver50: "50+ years old",
    vibesLabel: "Choose the main vibe",
    vibes: [
      { key: "warm", label: "Warm & friendly" },
      { key: "mysterious", label: "Mysterious" },
      { key: "empathetic", label: "Very empathetic" },
      { key: "pro", label: "Calm & professional" },
      { key: "sage", label: "Wise and thoughtful" },
      { key: "spiritual", label: "Spiritual / connected" },
    ],
    next: "Continue",
    back: "Back",
    confirmTitle: "Your AmorIA is ready 💫",
    confirmText:
      "Soon you’ll be able to text and talk with this presence. For now we just save your preferences.",
    startChat: "Back to home",
  },
  es: {
    title: "Crea tu AmorIA",
    step1: "Paso 1 • ¿Quién quieres que sea tu AmorIA?",
    step2: "Paso 2 • ¿Qué tipo de energía va más contigo?",
    typeWoman: "Mujer",
    typeMan: "Hombre",
    typeAndrogynous: "Andróginx / sin género",
    typeOver50: "50 años o más",
    vibesLabel: "Elige la vibra principal",
    vibes: [
      { key: "warm", label: "Cálido/a y amigable" },
      { key: "mysterious", label: "Misterioso/a" },
      { key: "empathetic", label: "Muy empático/a" },
      { key: "pro", label: "Calmo/a y profesional" },
      { key: "sage", label: "Sabio/a y reflexivo/a" },
      { key: "spiritual", label: "Espiritual / conectado/a" },
    ],
    next: "Continuar",
    back: "Atrás",
    confirmTitle: "Tu AmorIA está listo/a 💫",
    confirmText:
      "Pronto podrás chatear y hablar con esta presencia. Por ahora solo guardamos tus preferencias.",
    startChat: "Volver al inicio",
  },
};

export default function CreateAIPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [baseType, setBaseType] = useState<BaseType | null>(null);
  const [vibe, setVibe] = useState<ProfileKey | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);

  // lire ?lang=fr|en|es
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

  const computeImage = () => {
    if (!baseType) return null;

    // 50 et plus
    if (baseType === "over50") {
      const key: ProfileKey = vibe ?? "warm";
      if (Math.random() > 0.5) {
        return FIFTY_PLUS_WOMEN[key];
      }
      return FIFTY_PLUS_MEN[key];
    }

    // femme / homme / androgyne “normaux”
    if (baseType === "woman") {
      return WOMEN_BASE[Math.floor(Math.random() * WOMEN_BASE.length)];
    }
    if (baseType === "man") {
      return MEN_BASE[Math.floor(Math.random() * MEN_BASE.length)];
    }
    return ANDROGYNOUS_BASE[
      Math.floor(Math.random() * ANDROGYNOUS_BASE.length)
    ];
  };

  const handleNext = () => {
    if (step === 1 && baseType) {
      setStep(2);
    } else if (step === 2 && vibe) {
      const img = computeImage();
      setFinalImage(img);
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        background:
          "radial-gradient(circle at top, #111827 0, #020617 45%, #000 100%)",
        color: "#e5e7eb",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "rgba(15,23,42,0.98)",
          borderRadius: "1.5rem",
          padding: "2rem 1.75rem",
          border: "1px solid rgba(148,163,184,0.45)",
          boxShadow: "0 24px 60px rgba(15,23,42,0.9)",
        }}
      >
        <a
          href="/"
          style={{
            fontSize: "0.78rem",
            color: "#9ca3af",
            textDecoration: "none",
          }}
        >
          ← AmorIA.app
        </a>

        <h1
          style={{
            marginTop: "1.2rem",
            marginBottom: "0.4rem",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          {t.title}
        </h1>

        {step === 1 && (
          <>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#9ca3af",
                marginBottom: "1.3rem",
              }}
            >
              {t.step1}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                gap: "0.9rem",
              }}
            >
              <button
                type="button"
                onClick={() => setBaseType("woman")}
                style={pillStyle(baseType === "woman")}
              >
                {t.typeWoman}
              </button>
              <button
                type="button"
                onClick={() => setBaseType("man")}
                style={pillStyle(baseType === "man")}
              >
                {t.typeMan}
              </button>
              <button
                type="button"
                onClick={() => setBaseType("androgynous")}
                style={pillStyle(baseType === "androgynous")}
              >
                {t.typeAndrogynous}
              </button>
              <button
                type="button"
                onClick={() => setBaseType("over50")}
                style={pillStyle(baseType === "over50")}
              >
                {t.typeOver50}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#9ca3af",
                marginBottom: "1.3rem",
              }}
            >
              {t.step2}
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#cbd5f5",
                marginBottom: "0.8rem",
              }}
            >
              {t.vibesLabel}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: "0.7rem",
              }}
            >
              {t.vibes.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVibe(v.key)}
                  style={pillStyle(vibe === v.key)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)",
              gap: "1.6rem",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "0.6rem",
                }}
              >
                {t.confirmTitle}
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#9ca3af",
                  lineHeight: 1.6,
                  marginBottom: "1.2rem",
                }}
              >
                {t.confirmText}
              </p>

              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.75rem 1.4rem",
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg,#fb37ff,#ff6b9c,#f97316)",
                  color: "#f9fafb",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  boxShadow: "0 16px 40px rgba(248,113,113,0.45)",
                }}
              >
                {t.startChat}
              </a>
            </div>

            {finalImage && (
              <div
                style={{
                  borderRadius: "1.5rem",
                  padding: "0.25rem",
                  background:
                    "linear-gradient(135deg,#f97316,#fb37ff,#38bdf8)",
                }}
              >
                <img
                  src={finalImage}
                  alt="AmorIA preview"
                  style={{
                    width: "100%",
                    display: "block",
                    borderRadius: "1.4rem",
                    objectFit: "cover",
                    maxHeight: 380,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Boutons bas de page */}
        <div
          style={{
            marginTop: "1.8rem",
            display: "flex",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            style={{
              opacity: step === 1 ? 0.3 : 1,
              cursor: step === 1 ? "default" : "pointer",
              borderRadius: 999,
              padding: "0.55rem 1.1rem",
              border: "1px solid rgba(148,163,184,0.6)",
              background: "transparent",
              color: "#e5e7eb",
              fontSize: "0.82rem",
            }}
          >
            {t.back}
          </button>

          {step !== 3 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 1 && !baseType) || (step === 2 && !vibe)
              }
              style={{
                borderRadius: 999,
                padding: "0.6rem 1.4rem",
                border: "none",
                fontSize: "0.86rem",
                cursor:
                  (step === 1 && !baseType) || (step === 2 && !vibe)
                    ? "default"
                    : "pointer",
                background:
                  (step === 1 && !baseType) || (step === 2 && !vibe)
                    ? "rgba(148,163,184,0.4)"
                    : "linear-gradient(135deg,#fb37ff,#ff6b9c,#f97316)",
                color: "#f9fafb",
                boxShadow:
                  (step === 1 && !baseType) || (step === 2 && !vibe)
                    ? "none"
                    : "0 12px 30px rgba(248,113,113,0.4)",
              }}
            >
              {t.next}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    width: "100%",
    borderRadius: 999,
    padding: "0.65rem 0.9rem",
    border: active
      ? "1px solid rgba(251,191,36,0.9)"
      : "1px solid rgba(148,163,184,0.6)",
    background: active ? "rgba(30,64,175,0.9)" : "rgba(15,23,42,0.9)",
    color: active ? "#f9fafb" : "#e5e7eb",
    fontSize: "0.82rem",
    textAlign: "left",
    cursor: "pointer",
  };
}
