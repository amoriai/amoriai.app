export const dynamic = "force-dynamic";

import { Suspense } from "react";
import MyAmoriaSelectClient from "./MyAmoriaSelectClient";

export default function MyAmoriaSelectPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-black text-white">
          Chargement…
        </main>
      }
    >
      <MyAmoriaSelectClient />
    </Suspense>
  );
}
