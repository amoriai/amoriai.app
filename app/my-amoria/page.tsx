"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

type AmoriaRow = {
  id: string;
  name: string;
  system_prompt: string;
  avatar_image_url: string | null;
  persona_type: string;
};

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    noData: string;
    nameLabel: string;
    goalLabel: string;
    backHome: string;
    loading: string;
    createCta: string;
  }
> = {
  fr: {
    title: "Ton espace AmorIAI",
    subtitle:
      "Voici ton espace perso. Tu verras ici ton AmorIAI principale, sa mission et son avatar.",
    noData:
      "Tu n’as pas encore créé d’AmorIAI. Commence par personnaliser ton partenaire IA.",
    nameLabel: "Nom de ton AmorIAI",
    goalLabel: "Mission principale",
    backHome: "← Retour à l’accueil",
    loading: "Chargement de ton AmorIAI…",
    createCta: "Créer mon AmorIAI",
  },
  en: {
    title: "Your AmorIAI space",
    subtitle:
      "This is your personal space. You’ll see here your main AmorIAI, its mission and avatar.",
    noData: "You haven’t created any AmorIAI yet.",
    nameLabel: "Your AmorIAI’s name",
    goalLabel: "Main mission",
    backHome: "← Back to home",
    loading: "Loading your AmorIAI…",
    createCta: "Create my AmorIAI",
  },
  es: {
    title: "Tu espacio AmorIAI",
    subtitle:
      "Este es tu espacio personal. Aquí verás tu AmorIAI principal, su misión y su avatar.",
    noData: "Todavía no has creado ninguna AmorIAI.",
    nameLabel: "Nombre de tu AmorIAI",
    goalLabel: "Misión principal",
    backHome: "← Volver al inicio",
    loading: "Cargando tu AmorIAI…",
    createCta: "Crear mi AmorIAI",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

export default function MyAmoriaPage() {
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<Locale>("fr");
  const [loading, setLoading] = useState(true);
  const [amoria, setAmoria] = useState<AmoriaRow | null>(null);

  useEffect(() => {
    const lang = normalizeLocale(searchParams.get("lang"));
    setLocale(lang);
  }, [searchParams]);

  const t = STRINGS[locale];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setAmoria(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("user_amoria")
          .select("id, name, system_prompt, avatar_image_url, persona_type")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error || !data) {
          setAmoria(null);
        } else {
          setAmoria(data as AmoriaRow);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const buildUrlWithLang = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `${path}?${params.toString()}`;
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at top, #020617 0, #000 70%)",
          color: "#e5e7eb",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <p>{t.loading}</p>
      </main>
    );
  }

  if (!amoria) {
    const createUrl = buildUrlWithLang("/create-amoria");
    const homeUrl = buildUrlWithLang("/");

    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "1.5rem",
          background: "radial-gradient(circle at top, #020617 0, #000 70%)",
          color: "#e5e7eb",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center" }}>
          <a
            href={homeUrl}
            style={{
              fontSize: "0.85rem",
              color: "#9ca3af",
              textDecoration: "none",
            }}
          >
            {t.backHome}
          </a>
          <h1 style={{ fontSize: "1.6rem", margin: "1rem 0 0.4rem" }}>
            {t.title}
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#9ca3af",
              marginBottom: "1.4rem",
            }}
          >
            {t.subtitle}
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              marginBottom: "1.4rem",
            }}
          >
            {t.noData}
          </p>
          <a
            href={createUrl}
            style={{
              display: "inline-flex",
              padding: "0.7rem 1.6rem",
              borderRadius: 999,
              background:
                "linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316)",
              color: "#f9fafb",
              textDecoration: "none",
              fontSize: "0.9rem",
              boxShadow: "0 14px 34px rgba(248,113,113,0.45)",
            }}
          >
            {t.createCta}
          </a>
        </div>
      </main>
    );
  }

  const homeUrl = buildUrlWithLang("/");
  const chatParams = new URLSearchParams();
  chatParams.set("iaId", amoria.id);
  chatParams.set("lang", locale);
  const chatUrl = `/chat?${chatParams.toString()}`;

  const shortGoal =
    amoria.system_prompt.length > 220
      ? amoria.system_prompt.slice(0, 220) + "…"
      : amoria.system_prompt;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "1.5rem",
        background: "radial-gradient(circle at top, #020617 0, #000 70%)",
        color: "#e5e7eb",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <a
            href={homeUrl}
            style={{
              fontSize: "0.85rem",
              color: "#9ca3af",
              textDecoration: "none",
            }}
          >
            {t.backHome}
          </a>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            gap: "2rem",
          }}
        >
          <div
            style={{
              background:
                "radial-gradient(circle at top, #020617, #020617 40%, #000)",
              borderRadius: "1.5rem",
              padding: "1.7rem 1.8rem 1.6rem",
              border: "1px solid rgba(148,163,184,0.4)",
              boxShadow: "0 24px 60px rgba(15,23,42,0.85)",
            }}
          >
            <h1 style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>
              {t.title}
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#9ca3af",
                marginBottom: "1.2rem",
              }}
            >
              {t.subtitle}
            </p>

            <div style={{ marginTop: "1rem" }}>
              <h2
                style={{
                  fontSize: "1.05rem",
                  marginBottom: "0.4rem",
                }}
              >
                {t.nameLabel}
              </h2>
              <p style={{ fontSize: "0.95rem" }}>{amoria.name}</p>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <h2
                style={{
                  fontSize: "1.05rem",
                  marginBottom: "0.4rem",
                }}
              >
                {t.goalLabel}
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#e5e7eb" }}>
                {shortGoal}
              </p>
            </div>

            <div style={{ marginTop: "1.4rem" }}>
              <a
                href={chatUrl}
                style={{
                  display: "inline-flex",
                  padding: "0.7rem 1.6rem",
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316)",
                  color: "#f9fafb",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  boxShadow: "0 14px 34px rgba(248,113,113,0.45)",
                }}
              >
                Chatter avec {amoria.name}
              </a>
            </div>
          </div>

          <aside>
            <div
              style={{
                borderRadius: "1.4rem",
                padding: "1.4rem 1.3rem",
                border: "1px solid rgba(148,163,184,0.35)",
                boxShadow: "0 18px 45px rgba(15,23,42,0.85)",
                background:
                  "radial-gradient(circle at top, #020617, #020617 40%, #020617)",
              }}
            >
              {amoria.avatar_image_url ? (
                <div
                  style={{
                    borderRadius: "1.2rem",
                    overflow: "hidden",
                    border: "1px solid rgba(148,163,184,0.6)",
                  }}
                >
                  <img
                    src={amoria.avatar_image_url}
                    alt="Ton AmorIAI"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#9ca3af",
                  }}
                >
                  L’avatar de ton AmorIAI apparaîtra ici.
                </p>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
