"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

type Props = {
  children: ReactNode;
};

export default function RequireAuthClient({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      const lang =
        (searchParams.get("lang") as "fr" | "en" | "es") || "fr";

      if (!data.session?.user) {
        router.replace(`/login?lang=${lang}`);
        return;
      }

      setHasSession(true);
      setChecking(false);
    };

    checkSession();
  }, [router, searchParams]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        Vérification de ta connexion...
      </div>
    );
  }

  if (!hasSession) return null;

  return <>{children}</>;
}
