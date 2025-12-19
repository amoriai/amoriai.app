"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

export default function PostSignupClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const lang = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);

  useEffect(() => {
    const p = new URLSearchParams();
    p.set("lang", lang);
    p.set("plan", "free");
    router.replace(`/create-amoria?${p.toString()}`);
  }, [router, lang]);

  // IMPORTANT: on rend la même UI que le fallback, pour éviter le flash
  return (
    <main className="auth-root">
      <div className="auth-card">
        <div className="auth-badge">Création du compte</div>
        <h1 className="auth-title">Redirection…</h1>
        <p className="auth-subtitle">On prépare ton AmorIAI</p>
        <div className="loader" />
      </div>

      <style jsx>{`
        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 85%),
            radial-gradient(circle at bottom, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue",
            Arial, sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          border-radius: 1.9rem;
          padding: 2.3rem 2.5rem 2.1rem;
          background: rgba(2, 6, 23, 0.98);
          box-shadow: 0 32px 90px rgba(15, 23, 42, 0.95),
            0 0 0 1px rgba(148, 163, 184, 0.35);
          border: 1px solid rgba(148, 163, 184, 0.55);
          text-align: center;
        }

        .auth-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem 0.9rem;
          border-radius: 999px;
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: rgba(15, 23, 42, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.7);
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .auth-title {
          font-size: 1.7rem;
          font-weight: 700;
          margin: 0 0 0.35rem;
          letter-spacing: 0.02em;
        }

        .auth-subtitle {
          margin: 0 0 1.3rem;
          font-size: 0.9rem;
          color: #9ca3af;
          line-height: 1.4;
        }

        .loader {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 3px solid rgba(255, 255, 255, 0.18);
          border-top-color: #fb7185;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
