"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function PostLoginClient() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // 1️⃣ Session
      const { data: sessionData } = await supabase.auth.getSession();
      if (cancelled) return;

      const user = sessionData.session?.user;
      if (!user) {
        router.replace("/login");
        return;
      }

      // 2️⃣ Vérifier si une AmorAI existe
      const { data: amoria, error } = await supabase
        .from("amoria") // ✅ ta table
        .select("id")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Erreur lookup amoria", error);
        router.replace("/create-amoria");
        return;
      }

      // 3️⃣ Décision finale
      if (amoria?.id) {
        // ✅ IA existante → CHAT DIRECT
        router.replace(`/chat?amoria=${amoria.id}`);
      } else {
        // ❌ Pas d’IA → CRÉATION
        router.replace("/create-amoria");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  return <p>Connexion en cours…</p>;
}
