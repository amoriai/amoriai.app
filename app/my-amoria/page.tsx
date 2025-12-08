"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function MyAmoriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = normalizeLocale(searchParams.get("lang"));
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("free");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkAll = async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1. Vérifier utilisateur connecté
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("auth.getUser error", authError);
      }
      const user = authData?.user;

      if (!user) {
        console.log("[my-amoria] Aucun user → /login");
        router.replace(`/login?lang=${locale}`);
        return;
      }

      const userId = user.id;
      console.log("[my-amoria] user connecté :", userId, user.email);

      // 2. Vérifier s’il a déjà une IA
      const { data: ai, error: aiError } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (aiError) {
        console.error("user_amoria select error", aiError);
      } else {
        console.log("[my-amoria] IA trouvée ?", ai);
      }

      if (ai?.id) {
        // IA déjà créée → on envoie directement au chat
        const params = new URLSearchParams();
        params.set("iaId", ai.id);
        params.set("lang", locale);

        console.log("[my-amoria] Redirection vers /chat avec iaId =", ai.id);
        router.replace(`/chat?${params.toString()}`);
        return;
      }

      // 3. Lire son plan d’abonnement
      const { data: sub, error: subError } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

      if (subError) {
        console.error("user_subscriptions error", subError);
      }

      const effectivePlan = sub?.plan || "free";
      console.log("[my-amoria] plan détecté :", effectivePlan);

      if (!cancelled) {
        setPlan(effectivePlan);
        setLoading(false);
      }
    };

    checkAll();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams, locale]);

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

        <p className="text-center text-zinc-400 mb-6">
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

        {errorMsg && (
          <p className="text-xs text-rose-300 mb-4 text-center">{errorMsg}</p>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={() =>
              router.push(`/create-amoria?plan=${plan}&lang=${locale}`)
            }
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-center font-semibold hover:opacity-90 transition"
          >
            Créer mon AmorIA maintenant
          </button>

          <button
            onClick={() => router.push(`/logout?lang=${locale}`)}
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
