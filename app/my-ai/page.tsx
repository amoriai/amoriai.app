import React, { Suspense } from "react";
import MyAIClient from "./my-ai-client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<MyAILoading />}>
      <MyAIClient />
    </Suspense>
  );
}

function MyAILoading() {
  return (
    <main style={styles.root}>
      <p style={styles.text}>Chargement…</p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top, #020617, #000)",
    color: "#e5e7eb",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    padding: "1.5rem",
  },
  text: { fontSize: "1rem" },
};

