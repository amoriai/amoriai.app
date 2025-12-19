"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}
function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited" ? raw : "free";
}

export default function MyAiClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = useMemo(() => normalizeLocale(searchParams.get("lang")), [searchParams]);
  const plan = useMemo(() => normalizePlan(searchParams.get("plan")), [searchParams]);

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [amoriaId, setAmoriaId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      setLoading(true);

      // 1) Session côté client
      const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (sessErr) console.error("[my-ai] getSession error:", sessErr);

      if (!session?.user) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        router.replace(`/login?${p.toString()}`);
        return;
      }

      if (cancelled) return;

      setEmail(session.user.email ?? null);

      // 2) Dernier AmorIAI actif
      const { data: amoria, error } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("[my-ai] user_amoria error:", error);

        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        router.replace(`/create-amoria?${p.toString()}`);
        return;
      }

      if (!amoria?.id) {
        const p = new URLSearchParams();
        p.set("lang", locale);
        p.set("plan", plan);
        router.replace(`/create-amoria?${p.toString()}`);
        return;
      }

      setAmoriaId(amoria.id);
      setLoading(false);
    }

    boot();

    // réagit si logout
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

  return (
    <main className="myai-root">
      <div className="orb orb-left" />
      <div className="orb orb-right" />

      <div className="card">
        {loading ? (
          <>
            <div className="title">Chargement…</div>
            <div className="sub">Vérification de ta session et de ton AmorIAI</div>
            <div className="spinner" />
          </>
        ) : (
          <>
            <div className="title">Mon AI</div>
            <div className="sub">
              Connecté : <span className="mono">{email ?? "—"}</span>
            </div>

            <div className="box">
              <div className="boxTitle">AmorIAI actif</div>
              <div className="mono">{amoriaId}</div>
            </div>

            <button
              className="btn"
              onClick={() => {
                // ✅ IMPORTANT: il faut passer iaId au chat
                const p = new URLSearchParams();
                if (amoriaId) p.set("iaId", amoriaId);
                p.set("lang", locale);
                p.set("plan", plan);
                router.push(`/chat?${p.toString()}`);
              }}
            >
              Aller au chat
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .myai-root {
          min-height: 100vh;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 85%),
            radial-gradient(circle at bottom, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Helvetica Neue", Arial, sans-serif;
        }

        .orb {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          opacity: 0.55;
          filter: blur(4px);
          pointer-events: none;
        }
        .orb-left {
          top: -120px;
          left: -120px;
          background: radial-gradient(circle at 20% 20%, rgba(251, 113, 133, 0.55), transparent 60%);
        }
        .orb-right {
          bottom: -160px;
          right: -140px;
          background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.55), transparent 65%);
        }

        .card {
          width: 100%;
          max-width: 520px;
          border-radius: 1.9rem;
          padding: 2.2rem 2.4rem;
          background: radial-gradient(circle at top left, rgba(248, 113, 113, 0.24), transparent 55%),
            radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.24), transparent 55%),
            rgba(2, 6, 23, 0.98);
          border: 1px solid rgba(148, 163, 184, 0.55);
          box-shadow: 0 28px 80px rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
        }

        .title {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 0.4rem;
        }
        .sub {
          color: #9ca3af;
          margin-bottom: 1.2rem;
          line-height: 1.4;
        }
        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
            "Courier New", monospace;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 3px solid rgba(148, 163, 184, 0.3);
          border-top-color: rgba(248, 113, 113, 0.9);
          animation: spin 0.9s linear infinite;
          margin-top: 0.6rem;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .box {
          margin-top: 0.9rem;
          padding: 1rem;
          border-radius: 1rem;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(148, 163, 184, 0.25);
        }
        .boxTitle {
          font-weight: 700;
          margin-bottom: 0.35rem;
        }

        .btn {
          width: 100%;
          margin-top: 1.2rem;
          border-radius: 999px;
          border: none;
          padding: 0.85rem 1rem;
          font-weight: 800;
          color: #f9fafb;
          cursor: pointer;
          background-image: linear-gradient(120deg, #fb7185, #f97316, #fb7185);
          box-shadow: 0 18px 48px rgba(248, 113, 113, 0.55);
          transition: transform 0.12s ease, box-shadow 0.18s ease;
        }
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 24px 60px rgba(248, 113, 113, 0.8);
        }
      `}</style>
    </main>
  );
}
