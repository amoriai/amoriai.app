"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    noData: string;
    nameLabel: string;
    goalLabel: string;
    backHome: string;
  }
> = {
  fr: {
    title: "Ton espace AmorIAI",
    subtitle:
      "Voici ton espace perso. Plus tard, cette page affichera ton IA, l’historique des conversations et les réglages.",
    noData:
      "Pour l’instant, on affiche une version démo. Quand tout sera branché, ton vrai profil sera ici.",
    nameLabel: "Nom de ton AmorIAI",
    goalLabel: "Mission principale",
    backHome: "← Retour à l’accueil",
  },
  en: {
    title: "Your AmorIAI space",
    subtitle:
      "This is your personal space. Later, this page will show your AI, chat history and settings.",
    noData:
      "For now this is a demo view. When everything is connected, your real profile will appear here.",
    nameLabel: "Your AmorIAI’s name",
    goalLabel: "Main mission",
    backHome: "← Back to home",
  },
  es: {
    title: "Tu espacio AmorIAI",
    subtitle:
      "Este es tu espacio personal. Más adelante verás aquí tu IA, el historial de chat y los ajustes.",
    noData:
      "Por ahora es una vista demo. Cuando todo esté conectado, tu perfil real aparecerá aquí.",
    nameLabel: "Nombre de tu AmorIAI",
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
  const [name, setName] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      setLocale(normalizeLocale(lang));

      const n = params.get("name");
      const g = params.get("goal");
      const avatar = params.get("avatar");

      if (n) setName(n);
      if (g) setGoal(g);
      if (avatar) setAvatarUrl(avatar);
    } catch {
      // rien, on laisse en mode démo
    }
  }, []);

  const t = STRINGS[locale];

  // ⚠️ Ici il manquait les backticks dans ta version
  const homeUrl = (() => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/?${params.toString()}`;
  })();

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
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
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
          {/* Bloc texte / infos IA */}
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

            {!name && !goal && !avatarUrl && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#9ca3af",
                  marginTop: "0.5rem",
                }}
              >
                {t.noData}
              </p>
            )}

            {name && (
              <div style={{ marginTop: "1rem" }}>
                <h2
                  style={{
                    fontSize: "1.05rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  {t.nameLabel}
                </h2>
                <p style={{ fontSize: "0.95rem" }}>{name}</p>
              </div>
            )}

            {goal && (
              <div style={{ marginTop: "1rem" }}>
                <h2
                  style={{
                    fontSize: "1.05rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  {t.goalLabel}
                </h2>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#e5e7eb",
                  }}
                >
                  {goal}
                </p>
              </div>
            )}
          </div>

          {/* Bloc avatar (statique ici) */}
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
              {avatarUrl ? (
                <div
                  style={{
                    borderRadius: "1.2rem",
                    overflow: "hidden",
                    border: "1px solid rgba(148,163,184,0.6)",
                  }}
                >
                  <img
                    src={avatarUrl}
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
