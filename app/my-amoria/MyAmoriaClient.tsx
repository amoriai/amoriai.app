"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

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
  diagNoAi: string;
  diagUnknown: string;
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
      "Tu es bien connectée, mais aucune AmorIAI n’a été trouvée pour ce compte.",
    createNow: "Créer mon AmorIAI maintenant",
    backHome: "Retour à la page d’accueil",
    planHint: "Ton plan est automatiquement respecté (Free, Plus, Unlimited).",
    retry: "Réessayer",
    diagTitle: "Diagnostic",
    diagNoAccess:
      "Accès refusé à la base (RLS / policies). Vérifie les policies Supabase pour user_amoria et user_subscriptions.",
    diagNoAi:
      "Aucune ligne trouvée dans user_amoria pour ce user_id (ou IA archivée).",
    diagUnknown:
      "Une erreur est survenue. Regarde la console (F12) pour voir le détail.",
  },
  en: {
    title: "Your AmorIAI space",
    loading: "Loading your AmorIAI space…",
    activePlanLabel: "Active plan",
    noAiTitle: "No AI detected",
    noAiBody:
      "You are logged in, but we couldn’t find an AmorIAI for this account.",
    createNow: "Create my AmorIAI now",
    backHome: "Back to homepage",
    planHint: "Your plan is automatically enforced (Free, Plus, Unlimited).",
    retry: "Retry",
    diagTitle: "Diagnostics",
    diagNoAccess:
      "Access denied (RLS / policies). Check Supabase policies for user_amoria and user_subscriptions.",
    diagNoAi: "No row found in user_amoria for this user_id (or AI archived).",
    diagUnknown: "Something went wrong. Check the browser console (F12).",
  },
  es: {
    title: "Tu espacio AmorIAI",
    loading: "Cargando tu espacio AmorIAI…",
    activePlanLabel: "Plan activo",
    noAiTitle: "Ninguna IA detectada",
    noAiBody:
      "Estás conectada, pero no encontramos un AmorIAI para esta cuenta.",
    createNow: "Crear mi AmorIAI ahora",
    backHome: "Volver a la página de inicio",
    planHint: "Tu plan se respeta automáticamente (Free, Plus, Unlimited).",
    retry: "Reintentar",
    diagTitle: "Diagnóstico",
    diagNoAccess:
      "Acceso denegado (RLS / policies). Revisa las policies de Supabase para user_amoria y user_subscriptions.",
    diagNoAi:
      "No hay filas en user_amoria para este user_id (o IA archivada).",
    diagUnknown:
      "Ocurrió un error. Revisa la consola del navegador (F12).",
  },
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; plan: PlanId }
  | {
      status: "error";
      message: string;
      kind: "no_access" | "no_ai" | "unknown";
    };

function asPlanId(v: any): PlanId {
  if (v === "chat" || v === "plus" || v === "unlimited") return v;
  return "free";
}

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

  const lang = useMemo(
    () => normalizeLocale(searchParams.get("lang")),
    [searchParams]
  );
  const t = STRINGS[lang];

  const [state, setState] = useState<LoadState>({ status: "loading" });

  // ✅ Tunnel sécurisé: empêcher "retour"
  useEffect(() => {
    const preventBack = () =>
      window.history.pushState(null, "", window.location.href);

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);
    return () => window.removeEventListener("popstate", preventBack);
  }, []);

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

    // 2) IA (✅ ROBUSTE: pas de maybeSingle)
    const { data: aiList, error: aiErr } = await supabase
      .from("user_amoria")
      .select("id")
      .eq("user_id", userId)
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (aiErr) {
      console.error("user_amoria SELECT error:", aiErr);
      const rls = looksLikeRlsError(aiErr.message || "");
      setState({
        status: "error",
        kind: rls ? "no_access" : "unknown",
        message: rls ? t.diagNoAccess : t.diagUnknown,
      });
      return;
    }

    if (aiList && aiList.length > 0 && aiList[0]?.id) {
      router.replace(`/chat?iaId=${aiList[0].id}&lang=${lang}`);
      return;
    }

    // 3) Plan (ok de garder maybeSingle ici parce que 1 ligne max par user)
    const { data: sub, error: subErr } = await supabase
      .from("user_subscriptions")
      .select("plan")
      .eq("user_id", userId)
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

    const plan = asPlanId(sub?.plan);

    // Ici: aucune IA trouvée → écran "créer"
    setState({ status: "ready", plan });
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

  // state.status === "ready"
  const plan = state.plan;

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
