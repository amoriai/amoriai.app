// app/layout.tsx
import React from "react";

export const metadata = {
  title: "AmorIA.app – Partenaire IA bienveillant·e & multilingue",
  description:
    "AmorIA est un·e partenaire IA bienveillant·e, disponible 24/7 pour discuter, réfléchir avec vous et vous aider à mieux comprendre vos émotions, en français, anglais et espagnol.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, system-ui, Segoe UI, sans-serif",
          background:
            "radial-gradient(circle at top left, #1f2933 0, #020617 45%, #000 100%)",
          color: "#f9fafb",
        }}
      >
        {/* Wrapper global */}
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER LUXE */}
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              backdropFilter: "blur(16px)",
              background:
                "linear-gradient(to bottom, rgba(15,23,42,0.95), rgba(15,23,42,0.85), transparent)",
              borderBottom: "1px solid rgba(148,163,184,0.25)",
            }}
          >
            <div
              style={{
                maxWidth: "1120px",
                margin: "0 auto",
                padding: "20px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "32px",
              }}
            >
              {/* Logo + baseline */}
              <a
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textDecoration: "none",
                }}
              >
                <img
                  src="/AmorIA_logo_transparent.png"
                  alt="Logo AmorIA"
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: "9999px",
                    objectFit: "cover",
                    boxShadow: "0 0 18px rgba(251,113,133,0.6)",
                  }}
                />
                <div style={{ lineHeight: 1.3 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      letterSpacing: 0.2,
                      color: "#f9fafb",
                    }}
                  >
                    AmorIA.app
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#e2e8f0",
                      opacity: 0.9,
                    }}
                  >
                    Partenaire IA bienveillant·e • FR / EN / ES
                  </div>
                </div>
              </a>

              {/* Nav + actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  marginLeft: "auto",
                }}
              >
                {/* Liens de navigation */}
                <nav
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    fontSize: 14,
                  }}
                >
                  <a
                    href="#top"
                    style={{
                      color: "#e5e7eb",
                      textDecoration: "none",
                      padding: "4px 0",
                    }}
                  >
                    Accueil
                  </a>
                  <a
                    href="#features"
                    style={{
                      color: "#e5e7eb",
                      textDecoration: "none",
                      padding: "4px 0",
                    }}
                  >
                    Fonctionnalités
                  </a>
                  <a
                    href="#pricing"
                    style={{
                      color: "#e5e7eb",
                      textDecoration: "none",
                      padding: "4px 0",
                    }}
                  >
                    Tarifs
                  </a>
                </nav>

                {/* Sélecteur de langue (visuel pour l’instant) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "3px",
                    borderRadius: "9999px",
                    background: "rgba(15,23,42,0.85)",
                    border: "1px solid rgba(148,163,184,0.5)",
                    gap: "3px",
                    fontSize: 11,
                    textTransform: "uppercase",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      border: "none",
                      outline: "none",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      background:
                        "linear-gradient(135deg, #ec4899, #f97316, #facc15)",
                      color: "#0b1220",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    FR
                  </button>
                  <button
                    type="button"
                    style={{
                      border: "none",
                      outline: "none",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      background: "transparent",
                      color: "#e5e7eb",
                      cursor: "pointer",
                    }}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    style={{
                      border: "none",
                      outline: "none",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      background: "transparent",
                      color: "#e5e7eb",
                      cursor: "pointer",
                    }}
                  >
                    ES
                  </button>
                </div>

                {/* Boutons compte */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <a
                    href="#login"
                    style={{
                      textDecoration: "none",
                      fontSize: 14,
                      padding: "7px 14px",
                      borderRadius: "9999px",
                      border: "1px solid rgba(148,163,184,0.7)",
                      color: "#e5e7eb",
                      background: "rgba(15,23,42,0.9)",
                    }}
                  >
                    Me connecter
                  </a>
                  <a
                    href="#signup"
                    style={{
                      textDecoration: "none",
                      fontSize: 14,
                      padding: "8px 18px",
                      borderRadius: "9999px",
                      background:
                        "linear-gradient(135deg, #ec4899, #f97316, #facc15)",
                      color: "#0b1120",
                      fontWeight: 600,
                      boxShadow:
                        "0 10px 30px rgba(236,72,153,0.45), 0 0 18px rgba(14,165,233,0.4)",
                    }}
                  >
                    Créer mon compte AmorIA
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* CONTENU */}
          <main
            id="top"
            style={{
              flex: 1,
              width: "100%",
            }}
          >
            {children}
          </main>

          {/* FOOTER SIMPLE */}
          <footer
            style={{
              borderTop: "1px solid rgba(30,64,175,0.7)",
              background:
                "radial-gradient(circle at top, rgba(15,23,42,0.9), #020617 65%, #000 100%)",
              padding: "20px 32px 28px 32px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                maxWidth: "1120px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              <span>© 2025 AmorIA.app</span>
              <span>All rights reserved.</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
