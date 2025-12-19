"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  const sp = useSearchParams();

  const locale = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);
  const plan = useMemo(() => normalizePlan(sp.get("plan")), [sp]);

  // ✅ redirect ONLY when you explicitly come with auto=1
  const auto = sp.get("auto") === "1";

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [amoriaId, setAmoriaId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const replaceWithParams = (path: string, extra?: Record<string, string>) => {
      const p = new URLSearchParams();
      p.set("lang", locale);
      p.set("plan", plan);
      if (extra) Object.entries(extra).forEach(([k, v]) => p.set(k, v));
      router.replace(`${path}?${p.toString()}`);
    };

    const boot = async () => {
      setLoading(true);

      // 1) session
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (cancelled) return;

      if (!user) {
        replaceWithParams("/login");
        return;
      }

      setEmail(user.email ?? null);

      // 2) last active AI
      const { data: row, error } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (error || !row?.id) {
        setAmoriaId(null);

        // auto=1: on force create
        if (auto) {
          replaceWithParams("/create-amoria");
          return;
        }

        // sinon on affiche la page
        setLoading(false);
        return;
      }

      setAmoriaId(row.id);

      // auto=1: on force chat
      if (auto) {
        replaceWithParams("/chat", { iaId: row.id });
        return;
      }

      // sinon on affiche la page
      setLoading(false);
    };

    boot();

    return () => {
      cancelled = true;
    };
  }, [router, locale, plan, auto]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div style={{ maxWidth: 520, width: "100%" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Mon AI</h1>
          <p style={{ opacity: 0.8, marginBottom: 16 }}>Connecté : {email ?? "—"}</p>

          <div style={{ padding: 12, border: "1px solid #333", borderRadius: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>AmorIAI actif</div>
            <div style={{ fontFamily: "monospace" }}>{amoriaId ?? "Aucune IA"}</div>
          </div>

          <button
            style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 999 }}
            onClick={() => {
              const p = new URLSearchParams();
              p.set("lang", locale);
              p.set("plan", plan);

              if (!amoriaId) {
                router.push(`/create-amoria?${p.toString()}`);
                return;
              }

              p.set("iaId", amoriaId);
              router.push(`/chat?${p.toString()}`);
            }}
          >
            Aller au chat
          </button>
        </div>
      )}
    </main>
  );
}
