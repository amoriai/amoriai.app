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
  const lang = normalizeLocale(searchParams.get("lang"));

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    const checkAll = async () => {
      setLoading(true);

      // 1. Vérifier l'utilisateur connecté
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error("Erreur getUser() dans /my-amoria:", authError);
      }

      const user = authData?.user;

      if (!user) {
        console.log("Aucun user dans /my-amoria → retour login");
        const params = new URLSearchParams();
        params.set("lang", lang);
        router.replace(`/login?${params.toString()}`);
        return;
      }

      const userId = user.id;

      // 2. Vérifier si une AmorIA existe déjà
      const {
        data: ai,
        error: aiError,
      } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (aiError) {
        console.error("Erreur lecture user_amoria:", aiError);
      }

      if (ai?.id) {
        console.log("IA trouvée, redirection vers le chat", ai.id);
        const params = new URLSearchParams();
        params.set("iaId", ai.id);
        params.set("lang", lang);
        router.replace(`/chat?${params.toString()}`);
        return;
      }

      // 3. Lire le plan
      const {
        data: sub,
        error: subError,
      } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

      if (subError) {
        console.error("Erreur lecture user_subscriptions:", subError);
      }

      setPlan(sub?.plan ?? "free");
      setLoading(false);
    };

    void checkAll();
  }, [router, lang]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Chargement de ton espace AmorIA…
      </main>
    );
  }

  // CAS : connecté, mais aucune IA → page de transition “pro”
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
          <h2 className="text-xl font-semibold mb-2">Aucune IA détectée</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Tu es bien connectée, ton abonnement est actif, mais tu n’as pas
            encore créé ton AmorIA personnelle.
            <br />
            <br />
            Elle sera privée, sécurisée et adaptée à ton plan.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() =>
              router.push(`/create-amoria?plan=${plan}&lang=${lang}`)
            }
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-center font-semibold hover:opacity-90 transition"
          >
            Créer mon AmorIA maintenant
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl border border-zinc-700 text-center text-zinc-300 hover:text-white hover:border-zinc-500 transition"
          >
            Retour à la page d’accueil
          </button>
        </div>

        <p className="mt-8 text-xs text-zinc-500 text-center">
          Ton plan est automatiquement respecté (Free, Plus, Unlimited).
        </p>
      </div>
    </main>
  );
}
