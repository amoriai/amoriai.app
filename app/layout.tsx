import React from "react";

export const metadata = {
  title: "AmorIA.app – Compagne IA bienveillante",
  description:
    "AmorIA est une compagne IA bienveillante et multilingue (FR/EN/ES) pour discuter, se confier et explorer votre monde intérieur.",
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
            "-apple-system, BlinkMacSystemFont, system-ui, -sans-serif, 'Segoe UI'",
          backgroundColor: "#050816",
          color: "#f5f5f5",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            backdropFilter: "blur(12px)",
            background:
              "linear-gradient(to right, rgba(5,8,22,0.95), rgba(12,17,35,0.95))",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              maxWidth: "1040px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <img
                src="/AmorIA_logo_transparent.png"
                alt="Logo AmorIA"
                style={{ height: "38px", width: "auto" }}
              />
              <div>
                <div style={{ fontWeight: 600, letterSpacing: "0.05em" }}>
                  AmorIA.app
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    opacity: 0.7,
                  }}
                >
                  Compagne IA bienveillante • FR / EN / ES
                </div>
              </div>
            </div>

            <nav
              style={{
                display: "flex",
                gap: "1.25rem",
                fontSize: "0.9rem",
                opacity: 0.85,
              }}
            >
              <span>Accueil</span>
              <span>Fonctionnalités</span>
              <span>Tarifs</span>
            </nav>
          </div>
        </header>

        {children}

        <footer
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            marginTop: "3rem",
          }}
        >
          <div
            style={{
              maxWidth: "1040px",
              margin: "0 auto",
              padding: "1.5rem",
              fontSize: "0.8rem",
              opacity: 0.7,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <span>© {new Date().getFullYear()} AmorIA.app</span>
            <span>Créé avec bienveillance au Québec 🤍</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
