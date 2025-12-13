"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "chat" | "plus" | "unlimited";

function isLocale(v: string | null): v is Locale {
  return v === "fr" || v === "en" || v === "es";
}

function isPlan(v: string | null): v is PlanId {
  return v === "chat" || v === "plus" || v === "unlimited";
}

export default function PaymentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planParam = searchParams.get("plan");
  const langParam = searchParams.get("lang");

  const plan = useMemo(() => (isPlan(planParam) ? planParam : null), [planParam]);
  const lang = useMemo<Locale>(() => (isLocale(langParam) ? langParam : "fr"), [langParam]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setError(null);

      if (!plan) {
        router.replace(`/pricing?lang=${lang}`);
        return;
      }

      const { data, error: userErr } = await supabase.auth.getUser();
      if (userErr) console.error("supabase.auth.getUser error:", userErr);

      const user = data?.user;
      if (!user) {
        router.replace(`/login?lang=${lang}&plan=${plan}`);
        return;
      }

      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,              // chat | plus | unlimited
            user_id: user.id,  // ✅ obligatoire pour TON api/checkout
          }),
        });

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg =
            typeof body?.error === "string"
              ? body.error
              : "Erreur Stripe : impossible de créer la session.";
          if (!cancelled) setError(msg);
          return;
        }

        if (!body?.url || typeof body.url !== "string") {
          if (!cancelled) setError("Erreur Stripe : URL de redirection manquante.");
          return;
        }

        window.location.href = body.url;
      } catch (e) {
        console.error("checkout fetch error:", e);
        if (!cancelled) setError("Erreur réseau : impossible de joindre le serveur.");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [plan, lang, router]);

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center px-6">
        <h1 className="text-xl font-semibold mb-4">Redirection vers Stripe…</h1>
        <p className="text-sm text-gray-300">
          Ne ferme pas cette page. Si rien ne se passe, retourne sur la page Tarifs.
        </p>

        {error && (
          <div className="mt-6">
            <p className="text-red-400">{error}</p>
            <button
              className="mt-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15"
              onClick={() => router.push(`/pricing?lang=${lang}`)}
            >
              Retour aux tarifs
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
