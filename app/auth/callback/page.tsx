"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      try {
        // Supabase termine la connexion Google avec le code dans l’URL
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (error) {
          console.error("OAuth callback error", error);
        }
      } catch (err) {
        console.error("Unexpected callback error", err);
      }

      const lang = (searchParams.get("lang") as Locale) || "fr";
      const plan = (searchParams.get("plan") as PlanId) || "free";

      // Une fois la session créée, retour vers la page pricing
      router.replace(`/pricing?lang=${lang}&plan=${plan}`);
    };

    run();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-slate-200">
      <p>Connexion en cours…</p>
    </div>
  );
}
