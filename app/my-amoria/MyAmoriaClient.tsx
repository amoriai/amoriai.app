"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function MyAmoriaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = normalizeLocale(searchParams.get("lang"));

  useEffect(() => {
    const run = async () => {
      // 1) Vérifier que l'utilisateur est connecté
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        router.replace(`/login?lang=${locale}`);
        return;
      }

      const userId = user.id;

      // 2) Vérifier s’il a déjà une AmorIA
      const { data: ai } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (ai?.id) {
        // ✅ AmorIA déjà créée → on va au chat
        router.replace(`/chat?iaId=${ai.id}&lang=${locale}`);
        return;
      }

      // 3) Sinon, on lit son plan pour préparer la création
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

      const plan = sub?.plan || "free";

      // ✅ Pas d’IA → on envoie direct sur la page "Créer mon AmorIA"
      router.replace(`/create-amoria?plan=${plan}&lang=${locale}`);
    };

    run();
  }, [router, locale]);

  // Petit écran d’attente le temps de décider où aller
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">
          Préparation de ton espace AmorIA…
        </h1>
        <p className="text-sm text-zinc-400">
          On vérifie ton compte et on t’envoie vers ton IA personnelle.
        </p>
      </div>
    </main>
  );
}
