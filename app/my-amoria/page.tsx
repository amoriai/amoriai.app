export const dynamic = "force-dynamic";

import { Suspense } from "react";
import MyAmoriaClient from "./MyAmoriaClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading…
        </main>
      }
    >
      <MyAmoriaClient />
    </Suspense>
  );
}
