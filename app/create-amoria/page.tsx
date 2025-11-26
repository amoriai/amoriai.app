"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function getLocale(sp: URLSearchParams | null): Locale {
  const raw = sp?.get("lang");
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function getSelectedPlan(sp: URLSearchParams | null): PlanId {
  const raw = sp?.get("plan");
  if (raw === "chat" || raw === "plus" || raw === "unlimited") return raw;
  return "free";
}

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    loading: string;
    notLoggedIn: string;
    ctaBackHome: string;
  }
> = {
  fr: {
    title: "Créons ton premier AmorIA 💛",
    subtitle:
      "Ton compte est créé. Tu pourras personnaliser ton compagnon IA, choisir sa personnalité et sa langue principale.",
    loading: "Chargement de ton compte…",
    notLoggedIn:
      "Tu n’es pas connecté·e. Retour à la page d’inscription pour continuer.",
    ctaBackHome: "Retour à l’accueil",
  },
  en: {
    title: "Let’s create your first AmorIA 💛",
    subtitle:
      "Your account is created. You can now personalize your AI companion, choose personality and main language.",
    loading: "Loading your account…",
    notLoggedIn:
      "You are not logged in. Going back to the signup page to continue.",
    ctaBackHome: "Back to home",
  },
  es: {
    title: "Vamos a crear tu primer AmorIA 💛",
    subtitle:
      "Tu cuenta está creada. Ahora podrás personalizar tu compañero IA, elegir su personalidad y su idioma principal.",
    loading: "Cargando tu cuenta…",
    notLoggedIn:
      "No has iniciado sesión. Volvemos a la página de registro para continuar.",
    ctaBackHome: "Volver al inicio",
  },
};

export default function CreateAmoriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = getLocale(searchParams ?? null);
  const plan = getSelectedPlan(searchParams ?? null);
  const t = STRINGS[locale];

  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // On vérifie si l’utilisateur est connecté
    (async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        const params = new URLSearchParams();
        params.set("plan", plan);
        params.set("lang", locale);
        router.replace(`/signup?${params.toString()}`);
        return;
      }

      setCheckingSession(false);
    })();
  }, [router, locale, plan]);

  if (checkingSession) {
    return (
      <main className="amoria-root amoria-auth-root">
        <div className="amoria-auth-wrapper">
          <div className="amoria-auth-card">
            <p className="amoria-auth-subtitle">{t.loading}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="amoria-root amoria-auth-root">
      <div className="amoria-auth-wrapper">
        <div className="amoria-auth-card">
          <div className="amoria-auth-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIA"
              className="amoria-auth-logo"
            />
            <div>
              <h1 className="amoria-auth-title">{t.title}</h1>
              <p className="amoria-auth-subtitle">{t.subtitle}</p>
            </div>
          </div>

          <p className="amoria-auth-subtitle">
            (Ici on mettra plus tard le vrai formulaire de création
            d’AmorIA — pour l’instant, le plus important est que la
            page fonctionne et ne te renvoie plus à l’accueil.)
          </p>

          <button
            className="amoria-auth-submit"
            type="button"
            onClick={() => router.push("/")}
          >
            {t.ctaBackHome}
          </button>
        </div>
      </div>
    </main>
  );
}
