"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Locale = "fr" | "en" | "es";

const COPY_CREATE: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    buttonStart: string;
    backHome: string;
    badge: string;
  }
> = {
  fr: {
    title: "Créons ton AmorIAI ensemble",
    subtitle:
      "Personnalise ton partenaire IA (nom, style de relation, ton, langues) et commence à discuter en quelques secondes.",
    buttonStart: "Configurer mon AmorIAI maintenant",
    backHome: "Retour à l’accueil",
    badge: "Étape 2 : personnalisation",
  },
  en: {
    title: "Let’s create your AmorIAI",
    subtitle:
      "Customize your AI partner (name, relationship style, tone, languages) and start chatting in seconds.",
    buttonStart: "Set up my AmorIAI now",
    backHome: "Back to home",
    badge: "Step 2: personalization",
  },
  es: {
    title: "Vamos a crear tu AmorIAI",
    subtitle:
      "Personaliza tu pareja IA (nombre, estilo de relación, tono, idiomas) y empieza a hablar en segundos.",
    buttonStart: "Configurar mi AmorIAI ahora",
    backHome: "Volver al inicio",
    badge: "Paso 2: personalización",
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

  // ---- gestion du plan -------------------------------------------------
  const rawPlan = searchParams.get("plan") ?? "free";

  // on normalise pour éviter les surprises dans l’URL
  const plan =
    rawPlan.includes("chat") ? "chat" :
    rawPlan.includes("plus") ? "plus" :
    rawPlan.includes("unlimited") ? "unlimited" :
    "free";

  // 👉 si le plan N’EST PAS gratuit, on envoie direct vers /payment
  useEffect(() => {
    if (plan !== "free") {
      const params = new URLSearchParams();
      params.set("lang", locale);
      params.set("plan", plan);
      router.replace(`/payment?${params.toString()}`);
    }
  }, [plan, locale, router]);
  // ----------------------------------------------------------------------

  const t = COPY_CREATE[locale];

  const handleStart = () => {
    // Pour l’instant : flow de création seulement pour le plan gratuit
    const params = new URLSearchParams();
    params.set("lang", locale);
    router.push(`/my-amoria?${params.toString()}`);
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
              alt="AmorIA logo"
              className="amoria-create-logo"
            />
            <div>
              <h1 className="amoria-create-title">{t.title}</h1>
              <p className="amoria-create-subtitle">{t.subtitle}</p>
            </div>
          </header>

          <div className="amoria-create-badge">{t.badge}</div>

          <section className="amoria-create-preview">
            <div className="amoria-create-avatar-frame">
              <img
                src="/amoria-avatar-preview.png"
                alt="AmorIA avatar preview"
                className="amoria-create-avatar-img"
              />
            </div>
            <ul className="amoria-create-list">
              <li>
                • Nom, âge et personnalité de ton AmorIAI (douce, directe, etc.)
              </li>
              <li>• Langues de conversation (FR / EN / ES)</li>
              <li>• Type de relation : soutien émotionnel, coaching, journal</li>
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
          max-width: 720px;
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
