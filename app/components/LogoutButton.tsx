"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<Locale, { logout: string; loggingOut: string }> = {
  fr: { logout: "Se déconnecter", loggingOut: "Déconnexion…" },
  en: { logout: "Log out", loggingOut: "Logging out…" },
  es: { logout: "Cerrar sesión", loggingOut: "Cerrando sesión…" },
};

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawLang = searchParams.get("lang");
  const locale: Locale = rawLang === "fr" || rawLang === "en" || rawLang === "es" ? rawLang : "fr";
  const t = STRINGS[locale];

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await supabase.auth.signOut();

      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }

      const params = new URLSearchParams();
      params.set("lang", locale);

      router.replace(`/login?${params.toString()}`);
    } catch (err) {
      console.error("logout error", err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        borderRadius: "999px",
        border: "1px solid rgba(148,163,184,0.6)",
        padding: "0.45rem 0.9rem",
        fontSize: "0.8rem",
        fontWeight: 500,
        background:
          "linear-gradient(90deg, rgba(148,163,184,0.15), rgba(148,163,184,0.03))",
        color: "#e5e7eb",
        cursor: loading ? "default" : "pointer",
        opacity: loading ? 0.7 : 1,
      }}
      aria-label={t.logout}
      title={t.logout}
    >
      {loading ? t.loggingOut : t.logout}
    </button>
  );
}
