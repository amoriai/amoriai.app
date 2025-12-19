"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited"
    ? raw
    : "free";
}

export default function PostLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lang = normalizeLocale(searchParams.get("lang"));
  const plan = normalizePlan(searchParams.get("plan"));

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // 1) session obligatoire
      const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
      if (cancelled) return;

      const session = sessionData?.session;

      if (sessErr || !session?.user) {
        const p = new URLSearchParams();
        p.set("error", "no_session");
        p.set("lang", lang);
        p.set("plan", plan);
        router.replace(`/login?${p.toString()}`);
        return;
      }

      const userId = session.user.id;

      // 2) si IA existe -> chat direct
      const { data: ai, error: aiErr } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      const p = new URLSearchParams();
      p.set("lang", lang);
      p.set("plan", plan);

      if (aiErr) {
        console.error("[post-login] user_amoria error:", aiErr);
        // en cas d'erreur (RLS, etc.), on envoie vers create-amoria pour éviter écran mort
        router.replace(`/create-amoria?${p.toString()}`);
        return;
      }

      if (ai?.id) {
        p.set("iaId", ai.id);
        router.replace(`/chat?${p.toString()}`);
        return;
      }

      // 3) sinon -> créer
      router.replace(`/create-amoria?${p.toString()}`);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router, lang, plan]);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <p>Connexion en cours…</p>
    </main>
  );
}
