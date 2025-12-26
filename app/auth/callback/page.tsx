"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    (async () => {
      const hash = window.location.hash.replace("#", "");
      const params = new URLSearchParams(hash);

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      const lang = sp.get("lang") ?? "fr";
      const plan = sp.get("plan") ?? "free";
      const returnToRaw = sp.get("returnTo") ?? "/create-amoria";

      const returnTo =
        returnToRaw.startsWith("/") &&
        !returnToRaw.startsWith("//") &&
        !returnToRaw.includes("\\")
          ? returnToRaw
          : "/create-amoria";

      // 🔴 Si Google n'a rien renvoyé
      if (!access_token || !refresh_token) {
        router.replace(`/login?lang=${lang}&error=missing_tokens`);
        return;
      }

      // ✅ Crée la session Supabase (API v2 officielle)
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        router.replace(
          `/login?lang=${lang}&error=${encodeURIComponent(error.message)}`
        );
        return;
      }

      // ✅ Vérifie session
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace(`/login?lang=${lang}&error=no_session_after_set`);
        return;
      }

      // ✅ Redirect final
      const sep = returnTo.includes("?") ? "&" : "?";
      router.replace(
        `${returnTo}${sep}lang=${encodeURIComponent(lang)}&plan=${encodeURIComponent(plan)}`
      );
    })();
  }, [router, sp]);

  return null;
}
