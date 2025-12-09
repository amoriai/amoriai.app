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
      "Tu es bien connectée et ton abonnement est actif, mais tu n’as pas encore créé ton AmorIAI personnelle.",
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
      "You are logged in and your subscription is active, but you haven’t created your personal AmorIAI yet.",
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
      "Estás conectada y tu suscripción está activa, pero aún no has creado tu AmorIAI personal.",
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

  // ✅ BLOCAGE TOTAL DU BOUTON RETOUR (TUNNEL SÉCURISÉ)
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);

  useEffect(() => {
    const checkAll = async () => {
      setLoading(true);

      // ✅ 1. Vérifier l'utilisateur connecté
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        router.replace(`/login?lang=${lang}`);
        return;
      }

      const userId = user.id;

      // ✅ 2. Vérifier si une IA existe déjà
      const { data: ai } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (ai?.id) {
        router.replace(`/chat?iaId=${ai.id}&lang=${lang}`);
        return;
      }

      // ✅ 3. Lire le plan
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

      setPlan(sub?.plan ?? "free");
      setLoading(false);
    };

    void checkAll();
  }, [router, lang]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>{t.loading}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <section className="max-w-xl w-full bg-gray-900 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        <h1 className="text-2xl font-bold">{t.title}</h1>

        <div className="text-sm uppercase tracking-widest text-green-400">
          {t.activePlanLabel} : {plan.toUpperCase()}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="font-semibold">{t.noAiTitle}</h2>
          <p className="text-gray-300 mt-2">{t.noAiBody}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() =>
              router.push(`/create-amoria?plan=${plan}&lang=${lang}`)
            }
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-semibold"
          >
            {t.createNow}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-2 rounded-full border border-gray-500 text-sm"
          >
            {t.backHome}
          </button>
        </div>

        <p className="text-xs text-gray-400">{t.planHint}</p>
      </section>
    </main>
  );
}
