"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

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

export default function PostLoginClient() {
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
        go(`/login?${p.toString()}`);
        return;
      }

      // 2) on charge max 2 lignes pour distinguer 0 / 1 / 2+
      const { data: list, error: qErr } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(2);

      if (qErr) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/my-amoria?${p.toString()}`);
        return;
      }

      const count = list?.length ?? 0;

      // 0 -> create
      if (count === 0) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/create-amoria?${p.toString()}`);
        return;
      }

      // 2+ -> my-amoria (choix)
      if (count >= 2) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/my-amoria?${p.toString()}`);
        return;
      }

      // 1 -> chat direct
      const iaId = list![0].id;
      const p = new URLSearchParams();
      p.set("iaId", iaId);
      p.set("lang", locale);
      p.set("plan", plan);
      go(`/chat?${p.toString()}`);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, locale, plan]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <p>Connexion…</p>
    </main>
  );
}
