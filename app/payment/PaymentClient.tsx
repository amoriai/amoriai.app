"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type PlanId = "chat" | "plus" | "unlimited";

export default function PaymentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const plan = (searchParams.get("plan") as PlanId | null) ?? null;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!plan || !["chat", "plus", "unlimited"].includes(plan)) {
        router.push("/pricing?lang=fr");
        return;
      }

      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push(`/login?lang=fr&plan=${plan}`);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          user_id: data.user.id,
        }),
      });

      const body = await res.json();

      if (!body.url) {
        setError("Erreur Stripe : impossible de créer la session.");
        return;
      }

      window.location.href = body.url;
    };

    run();
  }, [plan, router]);

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-4">
          Redirection vers Stripe…
        </h1>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </main>
  );
}
