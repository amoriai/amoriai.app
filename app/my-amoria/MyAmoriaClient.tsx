"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { maxAmoriaForPlan, type PlanId } from "@/lib/plan";

type Locale = "fr" | "en" | "es";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

type LoadState =
  | { status: "loading" }
  | { status: "ready"; plan: PlanId; maxAllowed: number; aiCount: number }
  | { status: "error" };

export default function MyAmoriaClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const lang = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);

  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const run = async () => {
      setState({ status: "loading" });

      // 1) Auth
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        router.replace(`/login?lang=${lang}`);
        return;
      }

      // 2) Plan (via pricing_plans.code)
      let plan: PlanId = "free";
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select(`
          pricing_plans (
            code
          )
        `)
        .eq("user_id", user.id)
        .eq("current", true)
        .maybeSingle();

      const code = (sub as any)?.pricing_plans?.code;
      if (code === "free" || code === "chat" || code === "plus" || code === "unlimited") {
        plan = code;
      }

      const maxAllowed = maxAmoriaForPlan(plan);

      // 3) Compter les AmorIA
      const { count } = await supabase
        .from("user_amoria")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_archived", false);

      const aiCount = typeof count === "number" ? count : 0;

      // 0 IA -> rester sur /my-amoria (page.tsx affichera l'écran create)
      if (aiCount === 0) {
        setState({ status: "ready", plan, maxAllowed, aiCount });
        return;
      }

      // 1 IA -> chat direct
      if (aiCount === 1) {
        const { data: one } = await supabase
          .from("user_amoria")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_archived", false)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (one?.id) {
          router.replace(`/chat?iaId=${one.id}&lang=${lang}`);
          return;
        }
      }

      // 2+ IA -> sélection
      router.replace(`/my-amoria/select?lang=${lang}`);
    };

    void run();
  }, [lang, router]);

  // Fallback simple pendant le routing
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <p>Chargement…</p>
    </main>
  );
}
