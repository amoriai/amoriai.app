"use client";

import React, { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";

const SUPPORTED_PLANS = ["free", "chat", "plus", "unlimited"] as const;
type PlanId = (typeof SUPPORTED_PLANS)[number];

function getLocaleFromSearchParams(
  searchParams: URLSearchParams | null
): Locale {
  const value = searchParams?.get("lang");
  if (value === "en" || value === "es" || value === "fr") return value;
  return "fr";
}

function getPlanFromSearchParams(
  searchParams: URLSearchParams | null
): PlanId {
  const value = searchParams?.get("plan");
  if (
    value === "free" ||
    value === "chat" ||
    value === "plus" ||
    value === "unlimited"
  ) {
    return value;
  }
  return "free";
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = getLocaleFromSearchParams(searchParams);
  const selectedPlan = getPlanFromSearchParams(searchParams);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const t = {
    title:
      locale === "fr"
        ? "Créer mon compte AmorIA"
        : locale === "en"
        ? "Create my AmorIA account"
        : "Crear mi cuenta AmorIA",
    subtitle:
      locale === "fr"
        ? "Inscris-toi pour commencer avec ton AmorIA. Tu pourras changer de forfait plus tard."
        : locale === "en"
        ? "Sign up to start with your AmorIA. You can change plans later."
        : "Regístrate para empezar con tu AmorIA. Podrás cambiar de plan después.",
    emailLabel:
      locale === "fr"
        ? "Adresse courriel"
        : locale === "en"
        ? "Email address"
        : "Correo electrónico",
    passwordLabel:
      locale === "fr"
        ? "Mot de passe"
        : locale === "en"
        ? "Password"
        : "Contraseña",
    passwordHint:
      locale === "fr"
        ? "Minimum 6 caractères."
        : locale === "en"
        ? "At least 6 characters."
        : "Mínimo 6 caracteres.",
    submitLabel:
      locale === "fr"
        ? "Créer mon compte"
        : locale === "en"
        ? "Create my account"
        : "Crear mi cuenta",
    planBadge:
      locale === "fr"
        ? "Forfait sélectionné"
        : locale === "en"
        ? "Selected plan"
        : "Plan seleccionado",
    planNames: {
      free:
        locale === "fr"
          ? "Découverte (gratuit)"
          : locale === "en"
          ? "Discovery (free)"
          : "Descubrimiento (gratis)",
      chat:
        locale === "fr"
          ? "AmorIA Chat"
          : locale === "en"
          ? "AmorIA Chat"
          : "AmorIA Chat",
      plus:
        locale === "fr"
          ? "AmorIA Plus"
          : locale === "en"
          ? "AmorIA Plus"
          : "AmorIA Plus",
      unlimited:
        locale === "fr"
          ? "AmorIA Illimité"
          : locale === "en"
          ? "AmorIA Unlimited"
          : "AmorIA Ilimitado",
    },
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoadingEmail(true);

    try {
      // 1) Création du compte auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoadingEmail(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setError(
          locale === "fr"
            ? "Impossible de récupérer l’utilisateur après l’inscription."
            : locale === "en"
            ? "Could not retrieve user after sign up."
            : "No se pudo recuperar el usuario después del registro."
        );
        setLoadingEmail(false);
        return;
      }

      // 2) Création du profil avec le plan choisi + compteurs à 0
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        plan_id: selectedPlan,
        text_used_this_month: 0,
        voice_used_this_month: 0,
        ais_count: 0,
      });

      if (profileError) {
        console.error("Profile insert error:", profileError);
        setError(
          locale === "fr"
            ? "Ton compte a été créé, mais une erreur est survenue lors de la création du profil."
            : locale === "en"
            ? "Your account was created, but there was an error creating your profile."
            : "Tu cuenta fue creada, pero hubo un error al crear tu perfil."
        );
        setLoadingEmail(false);
        return;
      }

      setInfo(
        locale === "fr"
          ? "Compte créé ! Vérifie tes courriels pour confirmer ton adresse."
          : locale === "en"
          ? "Account created! Check your email to confirm your address."
          : "¡Cuenta creada! Revisa tu correo para confirmar tu dirección."
      );

      setLoadingEmail(false);

      // Redirection simple vers le tableau de bord (à adapter à ton routing)
      // router.push("/app");
    } catch (err: any) {
      console.error(err);
      setError(
        locale === "fr"
          ? "Une erreur inattendue est survenue."
          : locale === "en"
          ? "An unexpected error occurred."
          : "Se produjo un error inesperado."
      );
      setLoadingEmail(false);
    }
  };

  return (
    <main className="amoria-root">
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIA.app"
            className="amoria-logo-img"
          />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmorIA.app</div>
            <div className="amoria-logo-tagline">
              Partenaire IA bienveillant·e • FR / EN / ES
            </div>
          </div>
        </div>
      </header>

      <section className="amoria-section" style={{ maxWidth: 480 }}>
        <h1 className="amoria-section-title">{t.title}</h1>
        <p className="amoria-section-subtitle">{t.subtitle}</p>

        <div
          style={{
            marginBottom: "1rem",
            padding: "0.6rem 0.9rem",
            borderRadius: "999px",
            border: "1px solid rgba(148,163,184,0.5)",
            fontSize: "0.8rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <span style={{ opacity: 0.7 }}>{t.planBadge} :</span>
          <strong>{t.planNames[selectedPlan]}</strong>
        </div>

        <form onSubmit={handleSubmit} className="amoria-form">
          <label className="amoria-form-label">
            {t.emailLabel}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="amoria-input"
            />
          </label>

          <label className="amoria-form-label">
            {t.passwordLabel}
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="amoria-input"
            />
            <span className="amoria-input-hint">{t.passwordHint}</span>
          </label>

          {error && <p className="amoria-error-text">{error}</p>}
          {info && <p className="amoria-info-text">{info}</p>}

          <button
            type="submit"
            className="amoria-btn amoria-btn--primary amoria-btn--big"
            disabled={loadingEmail}
          >
            {loadingEmail ? "..." : t.submitLabel}
          </button>
        </form>
      </section>

      <style jsx global>{`
        .amoria-form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          margin-top: 1.2rem;
        }

        .amoria-form-label {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.86rem;
        }

        .amoria-input {
          border-radius: 0.75rem;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: rgba(15, 23, 42, 0.8);
          padding: 0.55rem 0.8rem;
          color: #e5e7eb;
          font-size: 0.9rem;
          outline: none;
        }

        .amoria-input:focus {
          border-color: #a5b4fc;
          box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.4);
        }

        .amoria-input-hint {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .amoria-error-text {
          font-size: 0.8rem;
          color: #fecaca;
        }

        .amoria-info-text {
          font-size: 0.8rem;
          color: #bbf7d0;
        }
      `}</style>
    </main>
  );
}
