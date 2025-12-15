"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function PostLogin() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (cancelled) return;

      if (error || !data.session) {
        router.replace("/login?error=no_session");
        return;
      }

      router.replace("/my-amoria");
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <p>Connexion en cours…</p>
    </main>
  );
}
