"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    helper: string;
    button: string;
  }
> = {
  fr: {
    title: "Connexion AmorIA",
    subtitle:
      "La page de connexion complète (Google, email, mot de passe) arrive bientôt.",
    helper:
      "Pour l’instant, tu peux déjà créer ton compte gratuit sur la page d’inscription.",
    button: "Créer mon compte gratuit",
  },
  en: {
    title: "AmorIA login",
    subtitle:
      "The full login page (Google, email, password) is coming soon.",
    helper:
      "For now, you can already create your free account on the sign-up page.",
    button: "Create my free account",
  },
  es: {
    title: "Inicio de sesión AmorIA",
    subtitle:
      "La página completa de inicio de sesión (Google, email, contraseña) llegará pronto.",
    helper:
      "Por ahora, ya puedes crear tu cuenta gratuita en la página de registro.",
    button: "Crear mi cuenta gratuita",
  },
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as Locale) || "fr";
  const t = STRINGS[lang] ?? STRINGS.fr;

  return (
    <main className="amoria-auth-root">
      <div className="amoria-auth-card">
        <h1 className="amoria-auth-title">{t.title}</h1>
        <p className="amoria-auth-subtitle">{t.subtitle}</p>
        <p className="amoria-auth-helper">{t.helper}</p>

        <a
          href={`/signup?lang=${lang}`}
          className="amoria-btn amoria-btn--primary amoria-auth-btn"
        >
          {t.button}
        </a>
      </div>

      <style jsx global>{`
        .amoria-auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Helvetica Neue", Arial, sans-serif;
          color: #e5e7eb;
        }

        .amoria-auth-card {
          max-width: 520px;
          width: 100%;
          background: #02081f;
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.5);
          padding: 2.2rem 2.4rem 2.4rem;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.7);
          text-align: center;
        }

        .amoria-auth-title {
          font-size: 1.6rem;
          margin: 0 0 0.75rem;
        }

        .amoria-auth-subtitle {
          font-size: 0.95rem;
          margin: 0 0 0.9rem;
          color: #e5e7eb;
          font-weight: 500;
        }

        .amoria-auth-helper {
          font-size: 0.85rem;
          margin: 0 0 1.7rem;
          color: #9ca3af;
        }

        .amoria-auth-btn {
          display: inline-flex;
          margin: 0 auto;
        }

        /* On réutilise le style général des boutons AmorIA */
        .amoria-btn {
          border-radius: 999px;
          border: 1px solid transparent;
          font-size: 0.9rem;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-btn--primary {
          padding: 0.8rem 1.7rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        @media (max-width: 640px) {
          .amoria-auth-card {
            padding: 1.8rem 1.6rem 2rem;
          }

          .amoria-auth-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </main>
  );
}
