"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function parseParamsFromUrl(): { locale: Locale; plan: PlanId } {
  if (typeof window === "undefined") {
    return { locale: "fr", plan: "free" };
  }

  const sp = new URLSearchParams(window.location.search);
  const rawLang = sp.get("lang");
  const rawPlan = sp.get("plan");

  let locale: Locale = "fr";
  if (rawLang === "en" || rawLang === "es" || rawLang === "fr") {
    locale = rawLang;
  }

  let plan: PlanId = "free";
  if (rawPlan === "chat" || rawPlan === "plus" || rawPlan === "unlimited") {
    plan = rawPlan;
  }

  return { locale, plan };
}

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    loading: string;
    ctaBackHome: string;
  }
> = {
  fr: {
    title: "Créons ton premier AmorIA 💛",
    subtitle:
      "Ton compte est créé. Tu pourras personnaliser ton compagnon IA, choisir sa personnalité et sa langue principale.",
    loading: "Chargement de ton compte…",
    ctaBackHome: "Retour à l’accueil",
  },
  en: {
    title: "Let’s create your first AmorIA 💛",
    subtitle:
      "Your account is created. You can now personalize your AI companion, choose personality and main language.",
    loading: "Loading your account…",
    ctaBackHome: "Back to home",
  },
  es: {
    title: "Vamos a crear tu primer AmorIA 💛",
    subtitle:
      "Tu cuenta está creada. Ahora podrás personalizar tu compañero IA, elegir su personalidad y su idioma principal.",
    loading: "Cargando tu cuenta…",
    ctaBackHome: "Volver al inicio",
  },
};

export default function CreateAmoriaPage() {
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("fr");
  const [plan, setPlan] = useState<PlanId>("free");
  const [paramsReady, setParamsReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // 1) On lit les paramètres de l’URL côté client
  useEffect(() => {
    const { locale, plan } = parseParamsFromUrl();
    setLocale(locale);
    setPlan(plan);
    setParamsReady(true);
  }, []);

  // 2) Quand les paramètres sont prêts → on vérifie la session
  useEffect(() => {
    if (!paramsReady) return;

    (async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        const p = new URLSearchParams();
        p.set("plan", plan);
        p.set("lang", locale);
        router.replace(`/signup?${p.toString()}`);
        return;
      }

      setCheckingSession(false);
    })();
  }, [paramsReady, router, locale, plan]);

  const t = STRINGS[locale];

  // Loader tant qu’on n’a pas l’URL + la session
  if (!paramsReady || checkingSession) {
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
            d’AmorIA. Pour l’instant, on vérifie juste que la page
            fonctionne et ne renvoie plus à l’accueil.)
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
