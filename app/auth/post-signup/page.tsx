import { Suspense } from "react";
import type { Metadata } from "next";
import PostSignupClient from "./PostSignupClient";

export const metadata: Metadata = {
  title: "Création du compte…",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <PostSignupClient />
    </Suspense>
  );
}

function Fallback() {
  return (
    <main style={styles.root}>
      <div style={styles.card}>
        <div style={styles.spinner} />
        <div style={styles.title}>Création du compte…</div>
        <div style={styles.sub}>Chargement en cours.</div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#020617",
    color: "#e5e7eb",
  },
  card: {
    padding: "24px",
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.35)",
    background: "rgba(2,6,23,.95)",
    textAlign: "center",
  },
  spinner: {
    width: 26,
    height: 26,
    borderRadius: 999,
    border: "3px solid rgba(148,163,184,.3)",
    borderTopColor: "#fb7185",
    margin: "0 auto 12px",
    animation: "spin .9s linear infinite",
  },
  title: { fontWeight: 700 },
  sub: { fontSize: 13, opacity: 0.7 },
};
