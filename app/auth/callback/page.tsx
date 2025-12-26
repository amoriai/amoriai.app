"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    (async () => {
      const lang = sp.get("lang") ?? "fr";
      const plan = sp.get("plan") ?? "free";
      const returnToRaw = sp.get("returnTo") ?? "/create-amoria";

      // Sécurité: accepte seulement les chemins internes
      const returnTo =
        returnToRaw.startsWith("/") && !returnToRaw.startsWith("//") && !returnToRaw.includes("\\")
          ? returnToRaw
          : "/create-amoria";

      // 1) Consomme le hash (#access_token...) et stocke la session
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

      if (error) {
        router.replace(
          `/login?lang=${encodeURIComponent(lang)}&error=${encodeURIComponent(error.message)}`
        );
        return;
      }

      // 2) Vérifie session
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace(`/login?lang=${encodeURIComponent(lang)}&error=no_session_after_callback`);
        return;
      }

      // 3) Redirect final (gère ? ou &)
      const sep = returnTo.includes("?") ? "&" : "?";
      router.replace(
        `${returnTo}${sep}lang=${encodeURIComponent(lang)}&plan=${encodeURIComponent(plan)}`
      );
    })();
  }, [router, sp]);

  return null;
}
