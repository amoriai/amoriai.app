"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

    const p = new URLSearchParams();
    p.set("lang", locale);
    p.set("plan", plan);

    // ✅ Objectif signup: toujours aller créer 1 AmorIAI (gratuit)
    const next = `/create-amoria?${p.toString()}`;

    if (!cancelled) router.replace(next);

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
