export const dynamic = "force-dynamic";

import { Suspense } from "react";
import MyAmoriaClient from "./MyAmoriaClient";

export default function MyAmoriaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-black text-white">
          Chargement de ton espace AmorIA…
        </main>
      }
    >
      <MyAmoriaClient />
    </Suspense>
  );
}
