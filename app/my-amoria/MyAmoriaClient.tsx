"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { maxAmoriaForPlan, type PlanId } from "@/lib/plan";

type Locale = "fr" | "en" | "es";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

function normalizePlan(raw: any): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited" ? raw : "free";
}

export default function MyAmoriaClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const lang = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);

  useEffect(() => {
    let cancelled = false;

    const go = (url: string) => {
      if (cancelled) return;
      router.replace(url);
    };

    const run = async () => {
      // 1) Auth
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        go(`/login?lang=${lang}`);
        return;
      }

      // 2) Plan
      let plan: PlanId = "free";
      try {
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select(
            `
            pricing_plans (
              code
            )
          `
          )
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        plan = normalizePlan((sub as any)?.pricing_plans?.code);
      } catch {
        plan = "free";
      }

      const maxAllowed = maxAmoriaForPlan(plan);

      // 3) Count IA actives
      const countRes = await supabase
        .from("user_amoria")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_archived", false);

      const aiCount = typeof countRes.count === "number" ? countRes.count : 0;

      // 0 IA -> rester sur /my-amoria (page.tsx affichera l'écran create)
      if (aiCount === 0) return;

      // helper: route vers chat
      const toChat = (iaId: string) => go(`/chat?iaId=${encodeURIComponent(iaId)}&lang=${lang}`);

      // 4) Si plan payant (chat/plus/unlimited) :
      //    -> ouvrir DIRECT le chat sur la dernière IA utilisée (localStorage)
      //    -> sinon ouvrir la plus récente
      //    -> sinon fallback sélection
      if (plan !== "free") {
        // a) last used
        let lastId: string | null = null;
        try {
          lastId = window.localStorage.getItem("amoria_last_ia_id");
        } catch {}

        if (lastId) {
          const { data: last } = await supabase
            .from("user_amoria")
            .select("id")
            .eq("id", lastId)
            .eq("user_id", user.id)
            .eq("is_archived", false)
            .maybeSingle();

          if (last?.id) {
            toChat(last.id);
            return;
          }
        }

        // b) most recent (créée récemment)
        const { data: recent } = await supabase
          .from("user_amoria")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_archived", false)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (recent?.id) {
          toChat(recent.id);
          return;
        }

        go(`/my-amoria/select?lang=${lang}`);
        return;
      }

      // 5) Plan free :
      //    -> 1 IA : chat direct
      //    -> sinon : sélection (si jamais tu permets + d’une IA en free, sinon ça n’arrivera pas)
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
          toChat(one.id);
          return;
        }
      }

      go(`/my-amoria/select?lang=${lang}`);
      return;
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [lang, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <p>Ouverture…</p>
    </main>
  );
}
