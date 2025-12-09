"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

type UiStrings = {
  title: string;
  loading: string;
  activePlanLabel: string;
  noAiTitle: string;
  noAiBody: string;
  createNow: string;
  backHome: string;
  planHint: string;
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

const STRINGS: Record<Locale, UiStrings> = {
  fr: {
    title: "Ton espace AmorIAI",
    loading: "Chargement de ton espace AmorIAI…",
    activePlanLabel: "Plan actif",
    noAiTitle: "Aucune IA détectée",
    noAiBody:
      "Tu es bien connectée et ton abonnement est actif, mais tu n’as pas encore créé ton AmorIAI personnelle. Elle sera privée, sécurisée et adaptée à ton plan.",
    createNow: "Créer mon AmorIAI maintenant",
    backHome: "Retour à la page d’accueil",
    planHint: "Ton plan est automatiquement respecté (Free, Plus, Unlimited).",
  },
  en: {
    title: "Your AmorIAI space",
    loading: "Loading your AmorIAI space…",
    activePlanLabel: "Active plan",
    noAiTitle: "No AI detected",
    noAiBody:
      "You’re logged in and your subscription is active, but you haven’t created your personal AmorIAI yet. It will be private, secure and adapted to your plan.",
    createNow: "Create my AmorIAI now",
    backHome: "Back to homepage",
    planHint: "Your plan is automatically enforced (Free, Plus, Unlimited).",
  },
  es: {
    title: "Tu espacio AmorIAI",
    loading: "Cargando tu espacio AmorIAI…",
    activePlanLabel: "Plan activo",
    noAiTitle: "Ninguna IA detectada",
    noAiBody:
      "Estás conectada y tu suscripción está activa, pero aún no has creado tu AmorIAI personal. Será privada, segura y adaptada a tu plan.",
    createNow: "Crear mi AmorIAI ahora",
    backHome: "Volver a la página de inicio",
    planHint: "Tu plan se respeta automáticamente (Free, Plus, Unlimited).",
  },
};

export default function MyAmoriaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = normalizeLocale(searchParams.get("lang"));

  const t = STRINGS[lang];

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    const checkAll = async () => {
      setLoading(true);

      // 1. Vérifier l'utilisateur connecté
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error("Erreur getUser() dans /my-amoria:", authError);
      }

      const user = authData?.user;

      if (!user) {
        const params = new URLSearchParams();
        params.set("lang", lang);
        router.replace(`/login?${params.toString()}`);
        return;
      }

      const userId = user.id;

      // 2. Vérifier si une AmorIAI existe déjà
      const {
        data: ai,
        error: aiError,
      } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (aiError) {
        console.error("Erreur lecture user_amoria:", aiError);
      }

      if (ai?.id) {
        const params = new URLSearchParams();
        params.set("iaId", ai.id);
        params.set("lang", lang);
        router.replace(`/chat?${params.toString()}`);
        return;
      }

      // 3. Lire le plan (ex: "free", "plus", "unlimited")
      const {
        data: sub,
        error: subError,
      } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

      if (subError) {
        console.error("Erreur lecture user_subscriptions:", subError);
      }

      setPlan(sub?.plan ?? "free");
      setLoading(false);
    };

    void checkAll();
  }, [router, lang]);

  if (loading) {
    return (
      <main className="my-root">
        <p className="my-loading">{t.loading}</p>
        <style jsx>{`
          .my-root {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
              radial-gradient(circle at top, #020617 0, #020617 40%, #000 85%),
              radial-gradient(circle at bottom, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          }
          .my-loading {
            font-size: 0.95rem;
            color: #9ca3af;
          }
        `}</style>
      </main>
    );
  }

  // CAS : connecté, mais aucune IA → page de transition
  return (
    <main className="my-root">
      <div className="my-gradient-orbit" />
      <div className="my-gradient-orbit my-gradient-orbit--right" />

      <section className="my-card">
        <header className="my-header">
          <h1 className="my-title">{t.title}</h1>

          <div className="my-plan-badge">
            <span className="my-plan-label">{t.activePlanLabel}</span>
            <span className="my-plan-value">{plan?.toUpperCase()}</span>
          </div>
        </header>

        <article className="my-empty-card">
          <h2 className="my-empty-title">{t.noAiTitle}</h2>
          <p className="my-empty-body">{t.noAiBody}</p>
        </article>

        <div className="my-actions">
          <button
            onClick={() =>
              router.push(`/create-amoria?plan=${plan}&lang=${lang}`)
            }
            className="my-primary-btn"
          >
            {t.createNow}
          </button>

          <button
            onClick={() => router.push("/")}
            className="my-secondary-btn"
          >
            {t.backHome}
          </button>
        </div>

        <p className="my-plan-hint">{t.planHint}</p>
      </section>

      <style jsx>{`
        .my-root {
          min-height: 100vh;
          margin: 0;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top, #020617 0, #020617 40%, #000 85%),
            radial-gradient(circle at bottom, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }

        .my-gradient-orbit {
          position: absolute;
          width: 580px;
          height: 580px;
          border-radius: 999px;
          background: radial-gradient(
            circle at 20% 20%,
            rgba(251, 113, 133, 0.45),
            transparent 60%
          );
          opacity: 0.6;
          filter: blur(6px);
          top: -140px;
          left: -140px;
          pointer-events: none;
        }

        .my-gradient-orbit--right {
          top: auto;
          bottom: -180px;
          left: auto;
          right: -160px;
          background: radial-gradient(
            circle at 80% 20%,
            rgba(59, 130, 246, 0.5),
            transparent 65%
          );
        }

        .my-card {
          position: relative;
          width: 100%;
          max-width: 720px;
          border-radius: 2rem;
          padding: 2.3rem 2.4rem 2rem;
          background:
            radial-gradient(
              circle at top left,
              rgba(248, 113, 113, 0.22),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(59, 130, 246, 0.22),
              transparent 55%
            ),
            rgba(2, 6, 23, 0.98);
          box-shadow:
            0 32px 90px rgba(15, 23, 42, 0.95),
            0 0 0 1px rgba(148, 163, 184, 0.35);
          border: 1px solid rgba(148, 163, 184, 0.55);
          backdrop-filter: blur(20px);
          z-index: 1;
        }

        .my-header {
          text-align: center;
          margin-bottom: 1.8rem;
        }

        .my-title {
          font-size: 1.9rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .my-plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.55rem;
          padding: 0.18rem 0.9rem;
          border-radius: 999px;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          background: rgba(34, 197, 94, 0.16);
          color: #bbf7d0;
          border: 1px solid rgba(34, 197, 94, 0.55);
        }

        .my-plan-label {
          opacity: 0.9;
        }

        .my-plan-value {
          font-weight: 600;
        }

        .my-empty-card {
          border-radius: 1.3rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: radial-gradient(
              circle at top left,
              rgba(148, 163, 184, 0.18),
              rgba(15, 23, 42, 0.98)
            );
          padding: 1.6rem 1.8rem;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.9);
          margin-bottom: 1.6rem;
        }

        .my-empty-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.4rem;
        }

        .my-empty-body {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.5;
          color: #cbd5f5;
        }

        .my-actions {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          margin-top: 0.4rem;
        }

        .my-primary-btn {
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.86rem 1rem;
          font-size: 0.96rem;
          font-weight: 600;
          color: #f9fafb;
          cursor: pointer;
          background-image: linear-gradient(
            120deg,
            #ec4899,
            #a855f7,
            #6366f1
          );
          box-shadow: 0 20px 52px rgba(168, 85, 247, 0.6);
          transition:
            transform 0.1s ease,
            box-shadow 0.15s ease,
            filter 0.1s ease;
        }

        .my-primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 26px 68px rgba(168, 85, 247, 0.8);
        }

        .my-secondary-btn {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 0.72rem 1rem;
          font-size: 0.88rem;
          font-weight: 500;
          background: transparent;
          color: #e5e7eb;
          cursor: pointer;
          transition:
            border-color 0.15s ease,
            color 0.15s ease,
            background 0.15s ease;
        }

        .my-secondary-btn:hover {
          border-color: rgba(148, 163, 184, 0.8);
          color: #f9fafb;
          background: rgba(15, 23, 42, 0.9);
        }

        .my-plan-hint {
          margin-top: 1.2rem;
          font-size: 0.78rem;
          text-align: center;
          color: #9ca3af;
        }

        @media (max-width: 640px) {
          .my-card {
            padding-inline: 1.6rem;
          }
          .my-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </main>
  );
}
