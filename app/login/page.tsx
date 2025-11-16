"use client";

import React, { useEffect, useState, FormEvent } from "react";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    emailLabel: string;
    passwordLabel: string;
    submit: string;
    noAccount: string;
    createAccount: string;
  }
> = {
  fr: {
    title: "Connexion à mon compte",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    submit: "Me connecter",
    noAccount: "Pas encore de compte ?",
    createAccount: "Créer mon compte",
  },
  en: {
    title: "Log in to my account",
    emailLabel: "Email address",
    passwordLabel: "Password",
    submit: "Log in",
    noAccount: "Don't have an account?",
    createAccount: "Create an account",
  },
  es: {
    title: "Iniciar sesión",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    submit: "Iniciar sesión",
    noAccount: "¿No tienes cuenta?",
    createAccount: "Crear cuenta",
  },
};

export default function LoginPage() {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    if (lang === "fr" || lang === "en" || lang === "es") {
      setLocale(lang);
    }
  }, []);

  const t = STRINGS[locale];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // plus tard: appel auth

    // après login → page IA
    window.location.href = `/create-ai?lang=${locale}`;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #111827 0, #020617 45%, #000 100%)",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.94))",
          padding: "2rem",
          borderRadius: "1.5rem",
          border: "1px solid rgba(148,163,184,0.4)",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t.title}</h1>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "0.3rem" }}>
            {t.emailLabel}
          </label>
          <input
            type="email"
            required
            style={{
              width: "100%",
              padding: "0.7rem",
              marginBottom: "1rem",
              background: "#020617",
              border: "1px solid rgba(148,163,184,0.6)",
              borderRadius: "0.75rem",
              color: "#fff",
            }}
          />

          <label style={{ display: "block", marginBottom: "0.3rem" }}>
            {t.passwordLabel}
          </label>
          <input
            type="password"
            required
            style={{
              width: "100%",
              padding: "0.7rem",
              marginBottom: "1.2rem",
              background: "#020617",
              border: "1px solid rgba(148,163,184,0.6)",
              borderRadius: "0.75rem",
              color: "#fff",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.8rem",
              background:
                "linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316)",
              borderRadius: "999px",
              border: "none",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {t.submit}
          </button>
        </form>

        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.85rem",
            textAlign: "center",
            color: "#9ca3af",
          }}
        >
          {t.noAccount}{" "}
          <a
            href={`/signup?lang=${locale}`}
            style={{ color: "#f9a8d4", textDecoration: "none" }}
          >
            {t.createAccount}
          </a>
        </p>
      </div>
    </main>
  );
}
