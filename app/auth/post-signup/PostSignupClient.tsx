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
    const params = new URLSearchParams();
    params.set("lang", lang);
    params.set("plan", "free");

    // Signup = toujours créer le 1er AmorIAI
    router.replace(`/create-amoria?${params.toString()}`);
  }, [router, lang]);

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
          background: #020617;
          color: white;
          font-family: system-ui;
          padding: 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: rgba(2, 6, 23, 0.98);
          border-radius: 24px;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.35);
        }

        .auth-badge {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.75;
          margin-bottom: 1rem;
        }

        .auth-title {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 0.4rem;
        }

        .auth-subtitle {
          font-size: 0.9rem;
          opacity: 0.75;
          margin: 0 0 1.2rem;
        }

        .loader {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: #fb7185;
          animation: spin 0.8s linear infinite;
          margin: auto;
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
