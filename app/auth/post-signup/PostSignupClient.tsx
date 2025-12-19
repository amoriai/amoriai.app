"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}
function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited"
    ? raw
    : "free";
}

export default function PostSignupClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const locale = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);
  const plan = useMemo(() => normalizePlan(sp.get("plan")), [sp]);

  useEffect(() => {
    let cancelled = false;
    const go = (path: string) => {
      if (!cancelled) router.replace(path);
    };

    (async () => {
      // 1) session
      const { data, error } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user || error) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/signup?${p.toString()}`);
        return;
      }

      // 2) vérifier si la personne a déjà des AmorIAI (edge-case)
      const { data: list, error: qErr } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1);

      if (qErr) {
        // En cas de doute, on amène sur create (flux signup)
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/create-amoria?${p.toString()}`);
        return;
      }

      const count = list?.length ?? 0;

      // ✅ flux signup: créer le 1er AmorIAI
      if (count === 0) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/create-amoria?${p.toString()}`);
        return;
      }

      // Edge-case: déjà 1+ => on laisse choisir
      const p = new URLSearchParams();
      p.set("lang", locale);
      p.set("plan", plan);
      go(`/my-amoria?${p.toString()}`);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, locale, plan]);

  return (
    <LoadingScreen
      badge="Création de compte AmorIAI"
      title="Activation…"
      subtitle="On finalise ton inscription"
    />
  );
}
