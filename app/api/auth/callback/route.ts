"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const locale = normalizeLocale(searchParams.get("lang"));

      // On force Supabase à finaliser la session si besoin
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("auth callback getUser error", error);
      } else {
        console.log("auth callback user", data?.user?.id);
      }

      // 👉 IMPORTANT : on envoie TOUJOURS vers /my-amoria
      router.replace(`/my-amoria?lang=${locale}`);
    };

    void run();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <p>Connexion en cours…</p>
    </main>
  );
}
