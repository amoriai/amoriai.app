"use client";

import { Suspense } from "react";
import PostLoginClient from "./PostLoginClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Connexion…</p>}>
      <PostLoginClient />
    </Suspense>
  );
}

