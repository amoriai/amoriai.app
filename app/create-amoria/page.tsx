"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

type CopyCreate = {
  title: string;
  subtitle: string;
  buttonStart: string;
  backHome: string;
  badge: string;
  planTitle: string;
  plans: {
    id: PlanId;
    name: string;
    price: string;
    description: string;
  }[];
};

const COPY_CREATE: Record<Locale, CopyCreate> = {
  fr: {
    title: "Créons ton AmorIAI ensemble",
    subtitle:
      "Personnalise ton partenaire IA (nom, style de relation, ton, langues) et commence à discuter en quelques secondes.",
    buttonStart: "Continuer avec ce forfait",
    backHome: "Retour à l’accueil",
    badge: "Étape 2 : personnalisation",
    planTitle: "Choisis ton forfait pour démarrer",
    plans: [
      {
        id: "free",
        name: "Découverte",
        price: "0 $ / mois",
        description:
          "Créer ton AmorIAI et chatter en texte avec des limites légères. Parfait pour tester.",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ / mois",
        description:
          "Texte uniquement, avec mémoire longue durée. Idéal si tu ne veux pas encore la voix.",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ / mois",
        description:
          "Texte + voix avec limites confortables. Pour parler régulièrement avec ton AmorIAI.",
      },
      {
        id: "unlimited",
        name: "AmorIAI Illimité",
        price: "39,99 $ / mois",
        description:
          "Texte + voix avec des quotas très élevés, pour intégrer vraiment AmorIAI à ton quotidien.",
      },
    ],
  },
  en: {
    title: "Let’s create your AmorIAI",
    subtitle:
      "Customize your AI partner (name, relationship style, tone, languages) and start chatting in seconds.",
    buttonStart: "Continue with this plan",
    backHome: "Back to home",
    badge: "Step 2: personalization",
    planTitle: "Choose your plan to start",
    plans: [
      {
        id: "free",
        name: "Discovery",
        price: "$0 / month",
        description:
          "Create your AmorIAI and start texting with light limits. Perfect to try the app.",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "$9.99 / month",
        description:
          "Text only, with long-term memory. Great if you don’t need voice yet.",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "$19.99 / month",
        description:
          "Text + voice with comfortable limits. Ideal for regular conversations.",
      },
      {
        id: "unlimited",
        name: "AmorIAI Unlimited",
        price: "$39.99 / month",
        description:
          "High text and voice quotas so your AmorIAI can be present all day long.",
      },
    ],
  },
  es: {
    title: "Vamos a crear tu AmorIAI",
    subtitle:
      "Personaliza tu pareja de IA (nombre, estilo de relación, tono, idiomas) y empieza a hablar en segundos.",
    buttonStart: "Continuar con este plan",
    backHome: "Volver al inicio",
    badge: "Paso 2: personalización",
    planTitle: "Elige tu plan para empezar",
    plans: [
      {
        id: "free",
        name: "Descubrimiento",
        price: "0 US$ / mes",
        description:
          "Crea tu AmorIAI y chatea por texto con límites ligeros. Perfecto para probar.",
      },
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 US$ / mes",
        description:
          "Solo texto, con memoria a largo plazo. Ideal si aún no necesitas voz.",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 US$ / mes",
        description:
          "Texto + voz con límites cómodos. Perfecto para hablar de forma regular.",
      },
      {
        id: "unlimited",
        name: "AmorIAI Ilimitado",
        price: "39,99 US$ / mes",
        description:
          "Cuotas muy altas de texto y voz para integrar AmorIAI en tu día a día.",
      },
    ],
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

export default function CreateAmoriaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = normalizeLocale(searchParams.get("lang"));
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("free");

  // pré-sélection à partir de ?plan= (mais pas de redirection auto)
  useEffect(() => {
    const rawPlan = searchParams.get("plan") ?? "free";
    const normalized: PlanId =
      rawPlan.includes("chat")
        ? "chat"
        : rawPlan.includes("plus")
        ? "plus"
        : rawPlan.includes("unlimited")
        ? "unlimited"
        : "free";
    setSelectedPlan(normalized);
  }, [searchParams]);

  const t = COPY_CREATE[locale];

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", selectedPlan);

    if (selectedPlan === "free") {
      // plan gratuit → on va directement vers la création / première IA
      router.push(`/my-amoria?${params.toString()}`);
    } else {
      // plan payant → on passe par la page de paiement
      router.push(`/payment?${params.toString()}`);
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

          {/* CHOIX DU FORFAIT */}
          <section className="amoria-plan-section">
            <h2 className="amoria-plan-title">{t.planTitle}</h2>
            <div className="amoria-plan-grid">
              {t.plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={
                    "amoria-plan-card" +
                    (selectedPlan === plan.id ? " amoria-plan-card--active" : "")
                  }
                >
                  <div className="amoria-plan-header">
                    <span className="amoria-plan-name">{plan.name}</span>
                    <span className="amoria-plan-price">{plan.price}</span>
                  </div>
                  <p className="amoria-plan-desc">{plan.description}</p>
                  {selectedPlan === plan.id && (
                    <span className="amoria-plan-chip">
                      ✓ {locale === "fr"
                        ? "Forfait sélectionné"
                        : locale === "en"
                        ? "Selected plan"
                        : "Plan seleccionado"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* APERÇU DE L’AMORIAI */}
          <section className="amoria-create-preview">
            <div className="amoria-create-avatar-frame">
              <img
                src="/amoria-avatar-preview.png"
                alt="AmorIAI avatar preview"
                className="amoria-create-avatar-img"
              />
            </div>
            <ul className="amoria-create-list">
              <li>
                • Nom, âge et personnalité de ton AmorIAI (douce, directe, etc.)
              </li>
              <li>• Langues de conversation (FR / EN / ES)</li>
              <li>
                • Type de relation : soutien émotionnel, coaching, journal
                (journal intime)
              </li>
              <li>• Limites et sujets que tu préfères éviter</li>
            </ul>
          </section>

          <div className="amoria-create-actions">
            <button
              type="button"
              onClick={handleStart}
              className="amoria-create-primary"
            >
              {t.buttonStart}
            </button>
            <button
              type="button"
              onClick={handleBackHome}
              className="amoria-create-secondary"
            >
              {t.backHome}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .amoria-create-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .amoria-create-wrapper {
          max-width: 820px;
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
          margin-bottom: 1.1rem;
          font-size: 0.8rem;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          background: rgba(96, 165, 250, 0.15);
          color: #bfdbfe;
          border: 1px solid rgba(59, 130, 246, 0.7);
        }

        .amoria-plan-section {
          margin-bottom: 1.4rem;
        }

        .amoria-plan-title {
          font-size: 0.95rem;
          margin-bottom: 0.6rem;
        }

        .amoria-plan-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.7rem;
        }

        .amoria-plan-card {
          text-align: left;
          border-radius: 1rem;
          padding: 0.75rem 0.9rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
          background: rgba(15, 23, 42, 0.9);
          cursor: pointer;
          font-size: 0.84rem;
          color: #e5e7eb;
        }

        .amoria-plan-card--active {
          border-color: rgba(251, 113, 133, 0.9);
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.45);
          background: radial-gradient(
            circle at top left,
            rgba(251, 37, 118, 0.15),
            #020617 60%
          );
        }

        .amoria-plan-header {
          display: flex;
          justify-content: space-between;
          gap: 0.6rem;
          margin-bottom: 0.2rem;
        }

        .amoria-plan-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .amoria-plan-price {
          font-size: 0.8rem;
          color: #cbd5f5;
        }

        .amoria-plan-desc {
          margin: 0.15rem 0 0.4rem;
        }

        .amoria-plan-chip {
          display: inline-flex;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          font-size: 0.72rem;
          background: rgba(16, 185, 129, 0.15);
          color: #a7f3d0;
          border: 1px solid rgba(16, 185, 129, 0.7);
        }

        .amoria-create-preview {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .amoria-create-avatar-frame {
          width: 160px;
          height: 260px;
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

        .amoria-create-list {
          flex: 1;
          margin: 0;
          padding-left: 0.9rem;
          list-style: none;
          font-size: 0.85rem;
          color: #e5e7eb;
        }

        .amoria-create-list li {
          margin-bottom: 0.3rem;
        }

        .amoria-create-actions {
          margin-top: 0.8rem;
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

        @media (max-width: 640px) {
          .amoria-create-card {
            padding-inline: 1.1rem;
          }

          .amoria-plan-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .amoria-create-preview {
            flex-direction: column;
            align-items: flex-start;
          }

          .amoria-create-avatar-frame {
            width: 140px;
            height: 230px;
          }
        }
      `}</style>
    </main>
  );
}
