import { Suspense } from "react";
import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

export default function ChatPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const aiIdParam = searchParams.aiId;
  const langParam = searchParams.lang;

  const aiId =
    typeof aiIdParam === "string" ? aiIdParam : aiIdParam?.[0] || "";
  const lang =
    typeof langParam === "string" ? langParam : langParam?.[0] || "fr";

  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at top, #020617 0, #000000 70%)",
            color: "#e5e7eb",
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <p>Chargement du chat…</p>
        </main>
      }
    >
      <ChatClient aiId={aiId} initialLang={lang as "fr" | "en" | "es"} />
    </Suspense>
  );
}
