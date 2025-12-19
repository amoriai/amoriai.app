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
    router.replace(`/create-amoria?lang=${locale}&plan=${plan}`);
  }, [router, locale, plan]);

  return (
    <main style={styles.root}>
      <div style={styles.card}>
        <div style={styles.spinner} />
        <div style={styles.title}>Compte créé…</div>
        <div style={styles.sub}>On t’amène à la création de ton AmorIAI.</div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at top, #020617 0, #020617 40%, #000 85%), radial-gradient(circle at bottom, #020617, #000)",
    color: "#e5e7eb",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 24,
    padding: "28px 26px",
    background:
      "radial-gradient(circle at top left, rgba(248,113,113,0.22), transparent 55%), radial-gradient(circle at bottom right, rgba(59,130,246,0.22), transparent 55%), rgba(2,6,23,0.96)",
    border: "1px solid rgba(148,163,184,0.45)",
    boxShadow: "0 28px 80px rgba(15,23,42,0.9)",
    textAlign: "center",
  },
  spinner: {
    width: 28,
    height: 28,
    borderRadius: 999,
    border: "3px solid rgba(148,163,184,0.35)",
    borderTopColor: "rgba(251,113,133,0.95)",
    margin: "0 auto 14px",
    animation: "spin 0.9s linear infinite",
  },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 6 },
  sub: { fontSize: 13, color: "#9ca3af" },
};
