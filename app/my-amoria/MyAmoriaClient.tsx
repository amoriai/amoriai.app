"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { maxAmoriaForPlan, planFromPricingName, type PlanId } from "@/lib/plan";

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

  retry: string;
  diagTitle: string;
  diagNoAccess: string;
  diagUnknown: string;

  // NEW
  limitReachedTitle: string;
  limitReachedBody: (max: number) => string;
};

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

const STRINGS: Record<Locale, UiStrings> = {
  fr: {
    title: "Ton espace AmorIAI",
    loading: "Chargement de ton espace AmorIAI…",
    activePlanLabel: "Plan actif",

    noAiTitle: "Aucune IA détectée",
    noAiBody: "Tu es bien connectée, mais aucune AmorIAI n’a été trouvée pour ce compte.",
    createNow: "Créer mon AmorIAI maintenant",
    backHome: "Retour à la page d’accueil",
    planHint: "Ton plan est automatiquement respecté (Free, Chat, Plus, Unlimited).",

    retry: "Réessayer",
    diagTitle: "Diagnostic",
    diagNoAccess: "Accès refusé à la base (RLS / policies). Vérifie les policies Supabase.",
    diagUnknown: "Une erreur est survenue. Regarde la console (F12) pour voir le détail.",

    limitReachedTitle: "Limite atteinte",
    limitReachedBody: (max) => `Tu as atteint la limite de ton plan (${max} AmorIA max).`,
  },
  en: {
    title: "Your AmorIAI space",
    loading: "Loading your AmorIAI space…",
    activePlanLabel: "Active plan",

    noAiTitle: "No AI detected",
    noAiBody: "You are logged in, but we couldn’t find an AmorIAI for this account.",
    createNow: "Create my AmorIAI now",
    backHome: "Back to homepage",
    planHint: "Your plan is automatically enforced (Free, Chat, Plus, Unlimited).",

    retry: "Retry",
    diagTitle: "Diagnostics",
    diagNoAccess: "Access denied (RLS / policies). Check Supabase policies.",
    diagUnknown: "Something went wrong. Check the browser console (F12).",

    limitReachedTitle: "Limit reached",
    limitReachedBody: (max) => `You reached your plan limit (${max} max AmorIA).`,
  },
  es: {
    title: "Tu espacio AmorIAI",
    loading: "Cargando tu espacio AmorIAI…",
    activePlanLabel: "Plan activo",

    noAiTitle: "Ninguna IA detectada",
    noAiBody: "Estás conectada, pero no encontramos un AmorIAI para esta cuenta.",
    createNow: "Crear mi AmorIAI ahora",
    backHome: "Volver a la página de inicio",
    planHint: "Tu plan se respeta automáticamente (Free, Chat, Plus, Unlimited).",

    retry: "Reintentar",
    diagTitle: "Diagnóstico",
    diagNoAccess: "Acceso denegado (RLS / policies).",
    diagUnknown: "Ocurrió un error. Revisa la consola (F12).",

    limitReachedTitle: "Límite alcanzado",
    limitReachedBody: (max) => `Alcanzaste el límite de tu plan (${max} AmorIA máx).`,
  },
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; plan: PlanId; maxAllowed: number; aiCount: number }
  | { status: "error"; message: string; kind: "no_access" | "unknown" };

function looksLikeRlsError(message: string) {
  const msg = (message || "").toLowerCase();
  return (
    msg.includes("permission") ||
    msg.includes("not allowed") ||
    msg.includes("rls") ||
    msg.includes("policy") ||
    msg.includes("violates row-level security")
  );
}

export default function MyAmoriaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lang = useMemo(() => normalizeLocale(searchParams.get("lang")), [searchParams]);
  const t = STRINGS[lang];

  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = async () => {
    setState({ status: "loading" });

    // 1) Auth
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr) console.error("auth.getUser error:", authErr);

    const user = authData?.user;
    if (!user) {
      router.replace(`/login?lang=${lang}`);
      return;
    }

    const userId = user.id;

    // 2) Plan (subscription -> pricing -> name)
    let plan: PlanId = "free";

    const { data: sub, error: subErr } = await supabase
      .from("user_subscriptions")
      .select("pricing_plan_id,current")
      .eq("user_id", userId)
      .eq("current", true)
      .maybeSingle();

    if (subErr) {
      console.error("user_subscriptions SELECT error:", subErr);
      const rls = looksLikeRlsError(subErr.message || "");
      setState({
        status: "error",
        kind: rls ? "no_access" : "unknown",
        message: rls ? t.diagNoAccess : t.diagUnknown,
      });
      return;
    }

    if (sub?.pricing_plan_id) {
      const { data: pricing, error: pricingErr } = await supabase
        .from("pricing_plans")
        .select("name")
        .eq("id", sub.pricing_plan_id)
        .maybeSingle();

      if (pricingErr) {
        console.error("pricing_plans SELECT error:", pricingErr);
        const rls = looksLikeRlsError(pricingErr.message || "");
        setState({
          status: "error",
          kind: rls ? "no_access" : "unknown",
          message: rls ? t.diagNoAccess : t.diagUnknown,
        });
        return;
      }

      plan = planFromPricingName(pricing?.name);
    }

    const maxAllowed = maxAmoriaForPlan(plan);

    // 3) IA count (rapide) + redirect logique
    // ⚠️ Note: Supabase count exact peut être un peu plus lent mais ok ici.
    const { count, error: countErr } = await supabase
      .from("user_amoria")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countErr) {
      console.error("user_amoria COUNT error:", countErr);
      const rls = looksLikeRlsError(countErr.message || "");
      setState({
        status: "error",
        kind: rls ? "no_access" : "unknown",
        message: rls ? t.diagNoAccess : t.diagUnknown,
      });
      return;
    }

    const aiCount = typeof count === "number" ? count : 0;

    // 0 IA -> écran create
    if (aiCount === 0) {
      setState({ status: "ready", plan, maxAllowed, aiCount });
      return;
    }

    // 1 IA -> récupérer 1 id et aller chat direct
    if (aiCount === 1) {
      const { data: one, error: oneErr } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (oneErr || !one?.id) {
        console.error("user_amoria SELECT 1 error:", oneErr);
        setState({ status: "ready", plan, maxAllowed, aiCount: 0 });
        return;
      }

      router.replace(`/chat?iaId=${one.id}&lang=${lang}`);
      return;
    }

    // 2+ IA -> page select
    router.replace(`/my-amoria/select?lang=${lang}`);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  if (state.status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>{t.loading}</p>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <section className="max-w-xl w-full bg-gray-900 p-8 rounded-2xl shadow-2xl text-center space-y-6">
          <h1 className="text-2xl font-bold">{t.title}</h1>

          <div className="bg-gray-800 p-4 rounded-xl text-left">
            <h2 className="font-semibold mb-2">{t.diagTitle}</h2>
            <p className="text-gray-300 text-sm">{state.message}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => void load()}
              className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-semibold"
            >
              {t.retry}
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full py-2 rounded-full border border-gray-500 text-sm"
            >
              {t.backHome}
            </button>
          </div>
        </section>
      </main>
    );
  }

  // READY state (0 IA)
  const { plan, maxAllowed, aiCount } = state;

  const limitReached = aiCount >= maxAllowed;

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <section className="max-w-xl w-full bg-gray-900 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        <h1 className="text-2xl font-bold">{t.title}</h1>

        <div className="text-sm uppercase tracking-widest text-green-400">
          {t.activePlanLabel} : {plan.toUpperCase()}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="font-semibold">{limitReached ? t.limitReachedTitle : t.noAiTitle}</h2>
          <p className="text-gray-300 mt-2">
            {limitReached ? t.limitReachedBody(maxAllowed) : t.noAiBody}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/create-amoria?plan=${plan}&lang=${lang}`)}
            disabled={limitReached}
            className={`w-full py-3 rounded-full font-semibold ${
              limitReached
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600"
            }`}
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
