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
  const searchParams = useSearchParams();

  const locale = useMemo(() => normalizeLocale(searchParams.get("lang")), [searchParams]);
  const plan = useMemo(() => normalizePlan(searchParams.get("plan")), [searchParams]);

  // ✅ only redirect when /my-ai?auto=1
  const auto = searchParams.get("auto") === "1";

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [amoriaId, setAmoriaId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const go = (path: string) => {
      if (!cancelled) router.replace(path);
    };

    const boot = async () => {
      setLoading(true);

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

      if (cancelled) return;

      setEmail(user.email ?? null);

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

      // Pas d'IA -> create (seulement si auto=1)
      if (error || !amoria?.id) {
        if (error) console.error("[my-ai] user_amoria error:", error);

        if (auto) {
          const p = new URLSearchParams();
          p.set("lang", locale);
          p.set("plan", plan);
          go(`/create-amoria?${p.toString()}`);
          return;
        }

        // mode normal: on reste sur /my-ai et on affiche l'info
        setAmoriaId(null);
        setLoading(false);
        return;
      }

      // IA trouvée
      setAmoriaId(amoria.id);

      // ✅ Redirige vers chat uniquement si auto=1
      if (auto) {
        const p = new URLSearchParams();
        p.set("iaId", amoria.id);
        p.set("lang", locale);
        p.set("plan", plan);
        go(`/chat?${p.toString()}`);
        return;
      }

      // mode normal: on affiche la page
      setLoading(false);
    };

    boot();

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
  }, [router, locale, plan, auto]);

  // ✅ UI simple
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
              if (!amoriaId) {
                const p = new URLSearchParams();
                p.set("lang", locale);
                p.set("plan", plan);
                router.push(`/create-amoria?${p.toString()}`);
                return;
              }
              const p = new URLSearchParams();
              p.set("iaId", amoriaId);
              p.set("lang", locale);
              p.set("plan", plan);
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
