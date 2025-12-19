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
    // ✅ Signup = toujours flow gratuit -> création du 1er AmorIAI
    // On force plan=free ici pour rester cohérent avec ton idée (upgrade ailleurs).
    const params = new URLSearchParams();
    params.set("lang", lang);
    params.set("plan", "free");

    router.replace(`/create-amoria?${params.toString()}`);
  }, [router, lang]);

  return (
    <main className="auth-root">
      <div className="auth-gradient-orbit" />
      <div className="auth-gradient-orbit auth-gradient-orbit--right" />

      <div className="auth-card">
        <div className="auth-badge">Création de compte</div>
        <div className="auth-title">Redirection…</div>
        <div className="auth-subtitle">On t’amène à l’étape “Créer mon AmorIAI”.</div>

        <div className="auth-loader" aria-hidden="true" />
      </div>

      <style jsx>{`
        .auth-root {
          min-height: 100vh;
          margin: 0;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 85%),
            radial-gradient(circle at bottom, #020617, #000);
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue",
            Arial, sans-serif;
        }

        .auth-gradient-orbit {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          background: radial-gradient(circle at 20% 20%, rgba(251, 113, 133, 0.55), transparent 60%);
          opacity: 0.6;
          filter: blur(4px);
          top: -120px;
          left: -120px;
          pointer-events: none;
        }

        .auth-gradient-orbit--right {
          top: auto;
          bottom: -160px;
          left: auto;
          right: -140px;
          background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.55), transparent 65%);
        }

        .auth-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          border-radius: 1.9rem;
          padding: 2.3rem 2.5rem 2.1rem;
          background: radial-gradient(circle at top left, rgba(248, 113, 113, 0.28), transparent 55%),
            radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.28), transparent 55%),
            rgba(2, 6, 23, 0.98);
          box-shadow: 0 32px 90px rgba(15, 23, 42, 0.95), 0 0 0 1px rgba(148, 163, 184, 0.35);
          border: 1px solid rgba(148, 163, 184, 0.55);
          backdrop-filter: blur(20px);
          z-index: 1;
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
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 0.35rem;
          letter-spacing: 0.02em;
        }

        .auth-subtitle {
          margin: 0 0 1.2rem;
          font-size: 0.92rem;
          color: #9ca3af;
          line-height: 1.4;
        }

        .auth-loader {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: 3px solid rgba(148, 163, 184, 0.28);
          border-top-color: #fb7185;
          margin: 0 auto;
          animation: spin 0.9s linear infinite;
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
