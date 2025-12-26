"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    (async () => {
      // 🔑 Lit le #access_token renvoyé par Google
      const { error } = await supabase.auth.getSessionFromUrl({
        storeSession: true,
      });

      const lang = sp.get("lang") ?? "fr";
      const plan = sp.get("plan") ?? "free";
      const returnTo = sp.get("returnTo") ?? "/create-amoria";

      if (error) {
        router.replace(`/login?lang=${lang}&error=${encodeURIComponent(error.message)}`);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace(`/login?lang=${lang}&error=no_session`);
        return;
      }

      router.replace(`${returnTo}?lang=${lang}&plan=${plan}`);
    })();
  }, [router, sp]);

  return null;
}
