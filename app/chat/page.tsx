// app/chat/page.tsx
import { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at top, #020617 0, #000 65%)",
            color: "#e5e7eb",
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <p>Chargement…</p>
        </main>
      }
    >
      <ChatClient />
    </Suspense>
  );
}
