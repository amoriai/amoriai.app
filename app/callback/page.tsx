"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const next = params.get("returnTo") || "/create-amoria";

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace(next);
      } else {
        router.replace("/login");
      }
    });
  }, [router, params]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: 40 }}>
      Connexion en cours…
    </div>
  );
}
