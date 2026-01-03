export const dynamic = "force-dynamic";

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const SUBS_TABLE = "user_subscriptions";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function StripeReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const lang = searchParams.get("lang") || "fr";
      const sessionId = searchParams.get("session_id") || "";

      // 1️⃣ Attendre que l’utilisateur soit connecté
      let userId: string | null = null;

      for (let i = 0; i < 20; i++) {
        if (cancelled) return;

        const { data } = await supabase.auth.getSession();
        const user = data?.session?.user;

        if (user?.id) {
          userId = user.id;
          break;
        }

        await sleep(250);
      }

      // Pas loggé → login
      if (!userId) {
        router.replace(`/login?lang=${lang}`);
        return;
      }

      // 2️⃣ Attendre que le webhook Stripe écrive dans Supabase
      for (let i = 0; i < 30; i++) {
        if (cancelled) return;

        const { data, error } = await supabase
          .from(SUBS_TABLE)
          .select("current, stripe_status")
          .eq("user_id", userId)
          .maybeSingle();

        if (!error && data) {
          if (data.current === true || data.stripe_status === "active") {
            router.replace(`/my-amoria?lang=${lang}`);
            return;
          }
        }

        await sleep(500);
      }

      // 3️⃣ Fallback sécurité (on laisse passer)
      router.replace(`/my-amoria?lang=${lang}`);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "#e5e7eb",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 18 }}>Finalisation du paiement…</p>
        <p style={{ opacity: 0.7, fontSize: 13 }}>
          Merci de patienter quelques secondes.
        </p>
      </div>
    </main>
  );
}
