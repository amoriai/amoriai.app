"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { maxAmoriaForPlan, planFromPricingName, type PlanId } from "@/lib/plans";

type Locale = "fr" | "en" | "es";

type AmoriaRow = {
  id: string;
  name: string | null;
  persona_type: string | null;
  avatar_image_url: string | null;
  created_at: string;
};

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

type Ui = {
  title: string;
  loading: string;
  choose: string;
  create: string;
  createDisabled: (max: number) => string;
  back: string;
};

const STRINGS: Record<Locale, Ui> = {
  fr: {
    title: "Choisis ton AmorIAI",
    loading: "Chargement…",
    choose: "Sélectionne une IA pour continuer",
    create: "Créer une nouvelle AmorIAI",
    createDisabled: (max) => `Limite atteinte (${max}).`,
    back: "Retour",
  },
  en: {
    title: "Choose your AmorIAI",
    loading: "Loading…",
    choose: "Select an AI to continue",
    create: "Create a new AmorIAI",
    createDisabled: (max) => `Limit reached (${max}).`,
    back: "Back",
  },
  es: {
    title: "Elige tu AmorIAI",
    loading: "Cargando…",
    choose: "Selecciona una IA para continuar",
    create: "Crear un nuevo AmorIAI",
    createDisabled: (max) => `Límite alcanzado (${max}).`,
    back: "Volver",
  },
};

export default function MyAmoriaSelectClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const lang = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);
  const t = STRINGS[lang];

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanId>("free");
  const [list, setList] = useState<AmoriaRow[]>([]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        router.replace(`/login?lang=${lang}`);
        return;
      }

      // plan
      let p: PlanId = "free";
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("pricing_plan_id,current")
        .eq("user_id", user.id)
        .eq("current", true)
        .maybeSingle();

      if (sub?.pricing_plan_id) {
        const { data: pricing } = await supabase
          .from("pricing_plans")
          .select("name")
          .eq("id", sub.pricing_plan_id)
          .maybeSingle();
        p = planFromPricingName(pricing?.name);
      }

      setPlan(p);

      // list
      const { data } = await supabase
        .from("user_amoria")
        .select("id,name,persona_type,avatar_image_url,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50); // 30 max sur unlimited, mais 50 safe

      setList((data ?? []) as AmoriaRow[]);
      setLoading(false);
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const maxAllowed = maxAmoriaForPlan(plan);
  const limitReached = list.length >= maxAllowed;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>{t.loading}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <section className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-gray-300 text-sm">{t.choose}</p>
        </header>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => router.push(`/create-amoria?plan=${plan}&lang=${lang}`)}
            disabled={limitReached}
            className={`px-5 py-3 rounded-full font-semibold ${
              limitReached
                ? "bg-gray-800 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600"
            }`}
          >
            {limitReached ? t.createDisabled(maxAllowed) : t.create}
          </button>

          <button
            onClick={() => router.push(`/my-amoria?lang=${lang}`)}
            className="px-5 py-3 rounded-full border border-gray-600"
          >
            {t.back}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((a) => (
            <button
              key={a.id}
              onClick={() => router.push(`/chat?iaId=${a.id}&lang=${lang}`)}
              className="text-left bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
                  {a.avatar_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.avatar_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-300 text-sm">AI</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">
                    {(a.name && a.name.trim()) || "AmorIAI"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {a.persona_type || "—"}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
