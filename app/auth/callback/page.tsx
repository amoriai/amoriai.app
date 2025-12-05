"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const finalizeAuth = async () => {
      const lang = searchParams.get("lang") || "fr";
      const plan = searchParams.get("plan") || "free";

      // On vérifie la session après Google
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace(`/pricing?lang=${lang}&plan=${plan}`);
      } else {
        router.replace(`/signup?lang=${lang}&plan=${plan}`);
      }
    };

    finalizeAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      Connexion en cours...
    </div>
  );
}
