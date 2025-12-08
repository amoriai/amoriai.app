"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    const checkAll = async () => {
      setLoading(true);

      // ✅ 1. Vérifier utilisateur connecté
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        router.replace(`/login?lang=${locale}`);
        return;
      }

      const userId = user.id;

      // ✅ 2. Vérifier s’il a déjà une IA
      const { data: ai } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (ai?.id) {
        router.replace(`/chat?iaId=${ai.id}&lang=${locale}`);
        return;
      }

      // ✅ 3. Lire son plan
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

      setPlan(sub?.plan || "free");
      setLoading(false);
    };

    checkAll();
  }, [router, locale]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Chargement de ton espace AmorIA…
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="max-w-2xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-4">
          Ton espace AmorIA
        </h1>

        <p className="text-center text-zinc-400 mb-8">
          Ton plan actif :
          <span className="text-pink-400 font-semibold ml-2 uppercase">
            {plan}
          </span>
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Aucune IA détectée
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Tu es bien connecté mais tu n’as pas encore créé ton AmorIA.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() =>
              router.push(`/create-amoria?plan=${plan}&lang=${locale}`)
            }
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold"
          >
            Créer mon AmorIA maintenant
          </button>

          <button
            onClick={() => router.push(`/`)}
            className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-300"
          >
            Retour à l’accueil
          </button>
        </div>

      </div>
    </main>
  );
}
