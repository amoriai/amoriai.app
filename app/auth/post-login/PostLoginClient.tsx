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
      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;

      if (error || !data.session?.user) {
        router.replace("/login?error=no_session");
        return;
      }

      const userId = data.session.user.id;

      // 🔎 Vérifie si l'utilisateur a déjà une AmorAI
      const { data: amoria, error: amoriaErr } = await supabase
        .from("amoria")          // <-- adapte si ton nom de table est différent
        .select("id")
        .eq("user_id", userId)
        .eq("is_archived", false)
        .maybeSingle();

      if (cancelled) return;

      if (amoriaErr) {
        // En prod tu peux logger, mais on redirige vers une page safe
        router.replace("/my-amoria?error=amoria_lookup");
        return;
      }

      // ✅ Déjà une AI -> chat
      if (amoria?.id) {
        router.replace(`/chat?amoria=${amoria.id}`); // ou ta route réelle de chat
        return;
      }

      // ✅ Sinon -> créer
      router.replace("/create-amoria");
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  return <p>Connexion en cours…</p>;
}
