"use client";

import React, { useEffect, useMemo } from "react";
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

export default function MyAiClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = useMemo(() => normalizeLocale(searchParams.get("lang")), [searchParams]);
  const plan = useMemo(() => normalizePlan(searchParams.get("plan")), [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const go = (path: string) => {
      if (!cancelled) router.replace(path);
    };

    const boot = async () => {
      // 1) Session
      const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (sessErr) console.error("[my-ai] getSession error:", sessErr);

      if (!user) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/login?${p.toString()}`);
        return;
      }

      // 2) Dernier AmorIAI actif
      const { data: amoria, error } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      // Si erreur ou pas d'IA -> create
      if (error || !amoria?.id) {
        if (error) console.error("[my-ai] user_amoria error:", error);

        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/create-amoria?${p.toString()}`);
        return;
      }

      // ✅ IA existe -> chat direct
      const p = new URLSearchParams();
      p.set("iaId", amoria.id);
      p.set("lang", locale);
      p.set("plan", plan);
      go(`/chat?${p.toString()}`);
    };

    boot();

    // Si logout -> login
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        router.replace(`/login?${p.toString()}`);
      }
    });

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe();
    };
  }, [router, locale, plan]);

  // Page de transition (tu ne la verras presque pas)
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <p>Redirection…</p>
    </main>
  );
}
