"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

type Amoria = {
  id: string;
  name: string;
  system_prompt: string | null;
  avatar_image_url: string | null;
};

const STRINGS: Record<Locale, any> = {
  fr: {
    title: "Ton espace AmorIAI",
    subtitle:
      "Voici ton espace perso. Cette page affiche ton IA réelle.",
    noData: "Aucun AmorIA n’a encore été créé.",
    nameLabel: "Nom de ton AmorIAI",
    goalLabel: "Mission principale",
    backHome: "← Retour à l’accueil",
  },
  en: {
    title: "Your AmorIAI space",
    subtitle: "This is your real AmorIA dashboard.",
    noData: "No AmorIA created yet.",
    nameLabel: "Your AmorIA’s name",
    goalLabel: "Main mission",
    backHome: "← Back to home",
  },
  es: {
    title: "Tu espacio AmorIAI",
    subtitle: "Este es tu panel real de AmorIA.",
    noData: "Aún no has creado ningún AmorIA.",
    nameLabel: "Nombre de tu AmorIA",
    goalLabel: "Misión principal",
    backHome: "← Volver al inicio",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

export default function MyAmoriaPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [amoria, setAmoria] = useState<Amoria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setLocale(normalizeLocale(params.get("lang")));
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_amoria")
        .select("id, name, system_prompt, avatar_image_url")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .maybeSingle();

      setAmoria(data ?? null);
      setLoading(false);
    };

    load();
  }, []);

  const t = STRINGS[locale];

  const homeUrl = `/?lang=${locale}`;

  return (
    <main style={{ minHeight: "100vh", padding: "1.5rem", background: "#020617", color: "#e5e7eb" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <a href={homeUrl} style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          {t.backHome}
        </a>

        <h1 style={{ marginTop: "1rem" }}>{t.title}</h1>
        <p style={{ color: "#9ca3af" }}>{t.subtitle}</p>

        {loading && <p>Chargement…</p>}

        {!loading && !amoria && (
          <p style={{ color: "#9ca3af" }}>{t.noData}</p>
        )}

        {amoria && (
          <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2rem" }}>
            <div>
              <h2>{t.nameLabel}</h2>
              <p>{amoria.name}</p>

              {amoria.system_prompt && (
                <>
                  <h2 style={{ marginTop: "1rem" }}>{t.goalLabel}</h2>
                  <p>{amoria.system_prompt}</p>
                </>
              )}
            </div>

            <div>
              {amoria.avatar_image_url ? (
                <img
                  src={amoria.avatar_image_url}
                  style={{ width: "100%", borderRadius: "1rem" }}
                />
              ) : (
                <p style={{ color: "#9ca3af" }}>
                  Aucun avatar enregistré.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
