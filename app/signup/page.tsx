"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

function getLocaleFromSearchParams(): Locale {
  if (typeof window === "undefined") return "fr";
  const searchParams = new URLSearchParams(window.location.search);
  const raw = searchParams.get("lang");
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

function getSelectedPlan(): PlanId {
  if (typeof window === "undefined") return "free";
  const searchParams = new URLSearchParams(window.location.search);
  const raw = searchParams.get("plan");
  if (raw === "chat" || raw === "plus" || raw === "unlimited") return raw;
  return "free";
}

const PLAN_LABELS: Record<
  Locale,
  Record<PlanId, { title: string; badge: string }>
> = {
  fr: {
    free: {
      title: "Découverte (gratuit)",
      badge: "Forfait sélectionné : Découverte (gratuit)",
    },
    chat: {
      title: "AmorIA Chat",
      badge: "Forfait sélectionné : AmorIA Chat",
    },
    plus: {
      title: "AmorIA Plus",
      badge: "Forfait sélectionné : AmorIA Plus",
    },
    unlimited: {
      title: "AmorIA Illimité",
      badge: "Forfait sélectionné : AmorIA Illimité",
    },
  },
  en: {
    free: {
      title: "Discovery (free)",
      badge: "Selected plan: Discovery (free)",
    },
    chat: {
      title: "AmorIA Chat",
      badge: "Selected plan: AmorIA Chat",
    },
    plus: {
      title: "AmorIA Plus",
      badge: "Selected plan: AmorIA Plus",
    },
    unlimited: {
      title: "AmorIA Unlimited",
      badge: "Selected plan: AmorIA Unlimited",
    },
  },
  es: {
    free: {
      title: "Descubrimiento (gratis)",
      badge: "Plan seleccionado: Descubrimiento (gratis)",
    },
    chat: {
      title: "AmorIA Chat",
      badge: "Plan seleccionado: AmorIA Chat",
    },
    plus: {
      title: "AmorIA Plus",
      badge: "Plan seleccionado: AmorIA Plus",
    },
    unlimited: {
      title: "AmorIA Ilimitado",
      badge: "Plan seleccionado: AmorIA Ilimitado",
    },
  },
};

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    passwordHint: string;
    submit: string;
    or: string;
    google: string;
    loginLink: string;
    already: string;
  }
> = {
  fr: {
    title: "Créer mon compte AmorIA",
    subtitle:
      "Inscris-toi pour commencer avec ton AmorIA. Tu pourras changer de forfait plus tard.",
    emailLabel: "Adresse courriel",
    passwordLabel: "Mot de passe",
    passwordHint: "Minimum 6 caractères.",
    submit: "Créer mon compte et passer au paiement",
    or: "ou",
    google: "Continuer avec Google",
    loginLink: "Me connecter",
    already: "Tu as déjà un compte ?",
  },
  en: {
    title: "Create your AmorIA account",
    subtitle:
      "Sign up to start with your AmorIA. You can change your plan later.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    passwordHint: "Minimum 6 characters.",
    submit: "Create my account and go to payment",
    or: "or",
    google: "Continue with Google",
    loginLink: "Log in",
    already: "Already have an account?",
  },
  es: {
    title: "Crear mi cuenta AmorIA",
    subtitle:
      "Regístrate para empezar con tu AmorIA. Podrás cambiar de plan más adelante.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    passwordHint: "Mínimo 6 caracteres.",
    submit: "Crear mi cuenta e ir al pago",
    or: "o",
    google: "Continuar con Google",
    loginLink: "Iniciar sesión",
    already: "¿Ya tienes una cuenta?",
  },
};

export default function SignupPage() {
  const locale = getLocaleFromSearchParams();
  const selectedPlan = getSelectedPlan();
  const planLabel = PLAN_LABELS[locale][selectedPlan];
  const t = STRINGS[locale];

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          initial_plan: selectedPlan, // pour que tu le retrouves côté serveur
        },
      },
    });

    setLoadingEmail(false);

    if (error) {
      setError(error.message);
      return;
    }

    // ✅ Redirection directe vers la page de paiement
    const params = new URLSearchParams();
    params.set("plan", selectedPlan);
    params.set("lang", locale);
    router.push(`/payment?${params.toString()}`);
  };

  const handleGoogle = async () => {
    setError(null);
    setLoadingGoogle(true);

    const origin =
      typeof window !== "undefined" ? window.location.origin : "";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // ✅ Quand Google a fini → retour direct sur /payment
        redirectTo: `${origin}/payment?plan=${selectedPlan}&lang=${locale}`,
      },
    });

    setLoadingGoogle(false);

    if (error) {
      setError(error.message);
    }
  };

  const buildLoginUrl = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    return `/login?${params.toString()}`;
  };

  return (
    <main className="amoria-root amoria-auth-root">
      <div className="amoria-auth-wrapper">
        <div className="amoria-auth-card">
          {/* Logo + titre */}
          <div className="amoria-auth-header">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIA"
              className="amoria-auth-logo"
            />
            <div>
              <h1 className="amoria-auth-title">{t.title}</h1>
              <p className="amoria-auth-subtitle">{t.subtitle}</p>
            </div>
          </div>

          {/* Badge plan */}
          <div className="amoria-auth-plan-badge">
            {planLabel.badge}
          </div>

          {/* Message d’erreur */}
          {error && <p className="amoria-auth-error">{error}</p>}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="amoria-auth-form">
            <label className="amoria-auth-label">
              <span>{t.emailLabel}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="amoria-auth-input"
              />
            </label>

            <label className="amoria-auth-label">
              <span>{t.passwordLabel}</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="amoria-auth-input"
              />
              <span className="amoria-auth-hint">
                {t.passwordHint}
              </span>
            </label>

            <button
              type="submit"
              disabled={loadingEmail}
              className="amoria-auth-submit"
            >
              {loadingEmail ? "…" : t.submit}
            </button>
          </form>

          {/* Séparateur */}
          <div className="amoria-auth-separator">
            <span></span>
            <p>{t.or}</p>
            <span></span>
          </div>

          {/* Bouton Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="amoria-auth-google"
          >
            {loadingGoogle ? "…" : t.google}
          </button>

          {/* Lien connexion */}
          <p className="amoria-auth-footer">
            {t.already}{" "}
            <a href={buildLoginUrl()} className="amoria-auth-link">
              {t.loginLink}
            </a>
          </p>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .amoria-auth-root {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1.5rem;
        }

        .amoria-auth-wrapper {
          max-width: 480px;
          width: 100%;
        }

        .amoria-auth-card {
          background: radial-gradient(
            circle at top,
            #020617,
            #020617 40%,
            #000 100%
          );
          border-radius: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.4);
          padding: 1.8rem 1.7rem 1.6rem;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.9);
        }

        .amoria-auth-header {
          display: flex;
          gap: 0.9rem;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .amoria-auth-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }

        .amoria-auth-title {
          font-size: 1.2rem;
          margin: 0 0 0.2rem;
        }

        .amoria-auth-subtitle {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amoria-auth-plan-badge {
          display: inline-flex;
          margin-bottom: 1.1rem;
          font-size: 0.8rem;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          background: rgba(248, 113, 113, 0.12);
          color: #fecaca;
          border: 1px solid rgba(248, 113, 113, 0.6);
        }

        .amoria-auth-error {
          margin: 0 0 0.5rem;
          padding: 0.5rem 0.7rem;
          border-radius: 0.6rem;
          background: rgba(248, 113, 113, 0.12);
          color: #fecaca;
          font-size: 0.78rem;
        }

        .amoria-auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .amoria-auth-label {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.82rem;
        }

        .amoria-auth-input {
          border-radius: 0.7rem;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(15, 23, 42, 0.9);
          padding: 0.55rem 0.7rem;
          color: #e5e7eb;
          font-size: 0.86rem;
        }

        .amoria-auth-input:focus {
          outline: none;
          border-color: #fb37ff;
          box-shadow: 0 0 0 1px rgba(251, 55, 255, 0.4);
        }

        .amoria-auth-hint {
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .amoria-auth-submit {
          margin-top: 0.4rem;
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 0.7rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
          box-shadow: 0 12px 30px rgba(248, 113, 113, 0.35);
        }

        .amoria-auth-separator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1.1rem 0 0.7rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .amoria-auth-separator span {
          flex: 1;
          height: 1px;
          background: rgba(148, 163, 184, 0.5);
        }

        .amoria-auth-google {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.7);
          padding: 0.6rem 1rem;
          font-size: 0.86rem;
          cursor: pointer;
          background: rgba(15, 23, 42, 0.9);
          color: #e5e7eb;
        }

        .amoria-auth-footer {
          margin-top: 0.9rem;
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
        }

        .amoria-auth-link {
          color: #c4b5fd;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .amoria-auth-card {
            padding-inline: 1.1rem;
          }
        }
      `}</style>
    </main>
  );
}
