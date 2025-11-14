"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    withGoogle: string;
    withApple: string;
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
    withApple: "Continuer avec Apple",
    or: "ou",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    submit: "Créer mon compte",
    already: "Déjà un compte ?",
    loginLink: "Me connecter",
  },
  en: {
    title: "Create my free account",
    subtitle:
      "Create your free account and start texting with the AI of your choice. Voice (talking with your AmoriA) is only available with the paid subscription.",
    withGoogle: "Continue with Google",
    withApple: "Continue with Apple",
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
      "Crea tu cuenta gratis y empieza a chatear por texto con la IA que elijas. La voz (hablar con tu AmoriA) está disponible solo con la suscripción de pago.",
    withGoogle: "Continuar con Google",
    withApple: "Continuar con Apple",
    or: "o",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    submit: "Crear mi cuenta",
    already: "¿Ya tienes una cuenta?",
    loginLink: "Iniciar sesión",
  },
};

export default function SignupPage() {
  const searchParams = useSearchParams();
  const urlLang = searchParams.get("lang");
  const initialLocale: Locale =
    urlLang === "en" || urlLang === "es" || urlLang === "fr" ? urlLang : "fr";

  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = STRINGS[locale];

  // Si on change manuellement ?lang dans l’URL, on met à jour la page
  useEffect(() => {
    if (urlLang === "en" || urlLang === "es" || urlLang === "fr") {
      setLocale(urlLang);
    }
  }, [urlLang]);

  return (
    <main className="amoria-root">
      <section className="amoria-section">
        <div
          className="amoria-signup-container"
          style={{
            maxWidth: "480px",
            margin: "3rem auto",
            background:
              "radial-gradient(circle at top, #020617, #020617 40%, #000 100%)",
            borderRadius: "1.5rem",
            border: "1px solid rgba(148,163,184,0.35)",
            padding: "2rem 2.2rem",
            boxShadow: "0 20px 45px rgba(15,23,42,0.7)",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              marginBottom: "0.6rem",
              fontWeight: 700,
            }}
          >
            {t.title}
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#9ca3af",
              marginBottom: "1.4rem",
            }}
          >
            {t.subtitle}
          </p>

          {/* Boutons Google / Apple – à brancher plus tard sur ton auth */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <button
              type="button"
              className="amoria-btn amoria-btn--full"
              style={{
                borderRadius: "999px",
                border: "1px solid rgba(148,163,184,0.4)",
                padding: "0.6rem 1rem",
                background: "#020617",
                color: "#e5e7eb",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              {/* Icône Google à ajouter plus tard si tu veux */}
              {t.withGoogle}
            </button>

            <button
              type="button"
              className="amoria-btn amoria-btn--full"
              style={{
                borderRadius: "999px",
                border: "1px solid rgba(148,163,184,0.4)",
                padding: "0.6rem 1rem",
                background: "#020617",
                color: "#e5e7eb",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              {/* Icône Apple à ajouter plus tard si tu veux */}
              {t.withApple}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: "1.2rem 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(148,163,184,0.35)",
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{t.or}</span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(148,163,184,0.35)",
              }}
            />
          </div>

          {/* Formulaire email + mot de passe */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Ici tu brancheras ton vrai signup (Supabase, Auth.js, etc.)
              console.log("Submit signup form");
            }}
            style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label
                htmlFor="email"
                style={{ fontSize: "0.8rem", color: "#e5e7eb" }}
              >
                {t.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                required
                style={{
                  borderRadius: "0.65rem",
                  border: "1px solid rgba(148,163,184,0.5)",
                  padding: "0.55rem 0.75rem",
                  background: "#020617",
                  color: "#e5e7eb",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label
                htmlFor="password"
                style={{ fontSize: "0.8rem", color: "#e5e7eb" }}
              >
                {t.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                required
                style={{
                  borderRadius: "0.65rem",
                  border: "1px solid rgba(148,163,184,0.5)",
                  padding: "0.55rem 0.75rem",
                  background: "#020617",
                  color: "#e5e7eb",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              className="amoria-btn amoria-btn--primary amoria-btn--full"
              style={{
                marginTop: "0.5rem",
                borderRadius: "999px",
                border: "none",
                padding: "0.7rem 1.4rem",
                background:
                  "linear-gradient(135deg, #fb37ff, #ff6b9c)",
                color: "#f9fafb",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(248,113,113,0.35)",
              }}
            >
              {t.submit}
            </button>
          </form>

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
      </section>
    </main>
  );
}
