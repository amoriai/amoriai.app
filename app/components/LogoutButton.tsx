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

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();

  const locale = normalizeLocale(sp.get("lang"));
  const t = STRINGS[locale];

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("supabase signOut error:", error);
        return;
      }

      // Optionnel: si tu veux vraiment nettoyer, fais-le de façon ciblée
      // (évite localStorage.clear())
      try {
        if (typeof window !== "undefined") {
          // Supabase v2 (selon config) utilise souvent ces clés:
          // supabase.auth.token / sb-<project-ref>-auth-token / etc.
          // Ici on ne touche à rien par défaut.
        }
      } catch {}

      router.replace(`/login?lang=${locale}`);
      router.refresh(); // ✅ optionnel mais souvent utile avec Next app router
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
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
