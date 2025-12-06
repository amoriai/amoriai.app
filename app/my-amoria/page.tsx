"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function MyAmoriaPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [hasIA, setHasIA] = useState(false);
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    const checkAll = async () => {
      setLoading(true);

      // ✅ 1. Vérifier utilisateur connecté
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        router.replace("/login");
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
        // ✅ Il a déjà son IA → on l’envoie au chat
        router.replace(`/chat?iaId=${ai.id}`);
        return;
      }

      // ✅ 3. Lire son plan
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

      if (sub?.plan) {
        setPlan(sub.plan);
      } else {
        setPlan("free");
      }

      setHasIA(false);
      setLoading(false);
    };

    checkAll();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Chargement de ton espace AmorIA…
      </main>
    );
  }

  // ✅ CAS : connecté MAIS AUCUNE IA → PAGE PRO
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
            Tu es bien connecté, ton abonnement est actif,  
            mais tu n’as pas encore créé ton AmorIA personnelle.
            <br />
            <br />
            Elle sera privée, sécurisée, et adaptée à ton plan.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push(`/create-amoria?plan=${plan}`)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-center font-semibold hover:opacity-90 transition"
          >
            Créer mon AmorIA maintenant
          </button>

          <button
            onClick={() => router.push("/logout")}
            className="w-full py-3 rounded-xl border border-zinc-700 text-center text-zinc-400 hover:text-white hover:border-zinc-500 transition"
          >
            Me déconnecter
          </button>
        </div>

        <p className="mt-8 text-xs text-zinc-500 text-center">
          Ton plan est automatiquement respecté (Free, Plus, Unlimited).
        </p>

      </div>
    </main>
  );
      }
