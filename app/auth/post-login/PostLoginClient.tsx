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
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/login?${p.toString()}`);
        return;
      }

      const { data: amoria } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (amoria?.id) {
        const p = new URLSearchParams();
        p.set("iaId", amoria.id);
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/chat?${p.toString()}`);
      } else {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/create-amoria?${p.toString()}`);
      }
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
