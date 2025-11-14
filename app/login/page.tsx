"use client";

import React from "react";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "#e5e7eb",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          padding: "2rem 2.5rem",
          borderRadius: "1.2rem",
          background: "#02081f",
          border: "1px solid rgba(148,163,184,0.45)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
          Connexion AmorIA
        </h1>
        <p style={{ fontSize: "0.9rem", marginBottom: "1.5rem", color: "#9ca3af" }}>
          La page de connexion complète (Google, email, mot de passe) arrive bientôt.
        </p>

        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
          Pour l’instant, tu peux déjà créer ton compte gratuit sur la page d’inscription.
        </p>

        <a
          href="/signup?lang=fr"
          style={{
            marginTop: "1.5rem",
            display: "inline-flex",
            padding: "0.7rem 1.4rem",
            borderRadius: "999px",
            background:
              "linear-gradient(135deg, #fb37ff, #ff6b9c)",
            color: "#f9fafb",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          Créer mon compte gratuit
        </a>
      </div>
    </main>
  );
}
