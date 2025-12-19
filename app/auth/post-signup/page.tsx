"use client";

import { Suspense } from "react";
import PostSignupClient from "./PostSignupClient";

function Fallback() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <p>Redirection…</p>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <PostSignupClient />
    </Suspense>
  );
}
