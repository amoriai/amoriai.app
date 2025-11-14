"use client";

import React, { useEffect, useState, FormEvent } from "react";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    withGoogle: string;
    or: string;
    emailLabel: string;
    passwordLabel: string;
    submit: string;
    already: string;
    loginLink: string;
  }
> = {
  fr: {
    title: "Créer mon compte gratuit",
    subtitle:
      "Crée ton compte gratuitement et commence à texter avec l’IA de ton choix. La voix (parler avec ton AmorIA) est disponible uniquement avec l’abonnement payant.",
    withGoogle: "Continuer avec Google",
    or: "ou",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    submit: "Créer mon compte",
    already: "Tu as déjà un compte ?",
    loginLink: "Me connecter",
  },
  en: {
    title: "Create my free account",
    subtitle:
      "Create your free account and start texting with the AI of your choice. Voice conversations are only available with the paid plan.",
    withGoogle: "Continue with Google",
    or: "or",
    emailLabel: "Email address",
    passwordLabel: "Password",
    submit: "Create my account",
    already: "Already have an account?",
    loginLink: "Log in",
  },
  es: {
    title: "Crear mi cuenta gratuita",
    subtitle:
      "Crea tu cuenta gratis y empieza a chatear por texto con la IA que elijas. Las conversaciones por voz están disponibles solo con el plan de pago.",
    withGoogle: "Continuar con Google",
    or: "o",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    submit: "Crear mi cuenta",
    already: "¿Ya tienes una cuenta?",
    loginLink: "Iniciar sesión",
  },
};

export default function SignupPage() {
  const [locale, setLocale] = useState<Locale>("fr");

  // On lit ?lang=fr|en|es côté client seulement
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      if (lang === "fr" || lang === "en" || lang === "es") {
        setLocale(lang);
      }
    } catch {
      // on ignore si jamais ça plante (très improbable)
    }
  }, []);

  const t = STRINGS[locale];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Ici tu brancheras plus tard ton vrai système d’auth
    alert("Inscription démo – la logique d’auth sera branchée plus tard.");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "2rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #111827 0, #020617 45%, #000 100%)",
        color: "#e5e7eb",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.94))",
          borderRadius: "1.5rem",
          padding: "2rem 1.75rem",
          boxShadow: "0 24px 60px rgba(15,23,42,0.9)",
          border: "1px solid rgba(148,163,184,0.45)",
        }}
      >
        {/* Petit lien retour en haut */}
        <a
          href="/"
          style={{
            fontSize: "0.78rem",
            color: "#9ca3af",
            textDecoration: "none",
          }}
        >
          ← Retour à la page d’accueil
        </a>

        <h1
          style={{
            marginTop: "1.25rem",
            marginBottom: "0.75rem",
            fontSize: "1.4rem",
            fontWeight: 600,
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            fontSize: "0.85rem",
            color: "#9ca3af",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}
        >
          {t.subtitle}
        </p>

        {/* Bouton Google */}
        <button
          type="button"
          style={{
            width: "100%",
            padding: "0.7rem 1rem",
            borderRadius: "999px",
            border: "1px solid rgba(148,163,184,0.6)",
            background: "#020617",
            color: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            fontSize: "0.86rem",
            cursor: "pointer",
          }}
        >
          {/* Icône Google simplifiée (placeholder) */}
          <span
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "999px",
              background: "#fff",
              display: "inline-block",
            }}
          />
          <span>{t.withGoogle}</span>
        </button>

        {/* Séparateur "ou" */}
        <div
          style={{
            margin: "1.4rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.75rem",
            color: "#6b7280",
          }}
        >
          <div
            style={{
              height: "1px",
              flex: 1,
              background:
                "linear-gradient(to right, transparent, rgba(148,163,184,0.6), transparent)",
            }}
          />
          <span>{t.or}</span>
          <div
            style={{
              height: "1px",
              flex: 1,
              background:
                "linear-gradient(to right, transparent, rgba(148,163,184,0.6), transparent)",
            }}
          />
        </div>

        {/* Formulaire email + mot de passe */}
        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              marginBottom: "0.25rem",
            }}
          >
            {t.emailLabel}
          </label>
          <input
            type="email"
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(148,163,184,0.6)",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: "0.86rem",
              marginBottom: "0.9rem",
            }}
          />

          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              marginBottom: "0.25rem",
            }}
          >
            {t.passwordLabel}
          </label>
          <input
            type="password"
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(148,163,184,0.6)",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: "0.86rem",
              marginBottom: "1.2rem",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem 1.2rem",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 500,
              background:
                "linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316)",
              color: "#f9fafb",
              boxShadow: "0 16px 40px rgba(248, 113, 113, 0.45)",
            }}
          >
            {t.submit}
          </button>
        </form>

        {/* Lien "déjà un compte" */}
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.8rem",
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          {t.already}{" "}
          <a
            href={`/login?lang=${locale}`}
            style={{
              color: "#f9a8d4",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {t.loginLink}
          </a>
        </p>
      </div>
    </main>
  );
}
