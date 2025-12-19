"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

const CREATE_AMORIA_PATH = "/create-amoria";
const AUTH_CALLBACK_PATH = "/api/auth/callback";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const MIN_RECAPTCHA_SCORE = 0.5;

// ✅ 24h pour que l’utilisateur puisse confirmer son email plus tard
const SIGNUP_COOKIE_MAX_AGE = 86400;

/* ===========================
   TEXTES PAR LANGUE
=========================== */

type Strings = {
  badge: string;
  title: string;
  subtitle: string;
  google: string;
  googleLoading: string;
  or: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordHint: string;
  submit: string;
  submitting: string;
  haveAccount: string;
  loginLink: string;
  errorGeneric: string;
  errorGoogle: string;
  errorRecaptcha: string;
  confirmTitle: string;
  confirmBody: string;
  show: string;
  hide: string;
  missingKey: string;
};

const STRINGS: Record<Locale, Strings> = {
  fr: {
    badge: "Création de compte AmorIAI",
    title: "Créer ton compte",
    subtitle: "Active ton accès gratuit, puis crée ton premier AmorIAI en quelques secondes.",
    google: "Continuer avec Google",
    googleLoading: "Redirection…",
    or: "ou",
    emailLabel: "Adresse courriel",
    emailPlaceholder: "ex. mon.adresse@email.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Choisis un mot de passe sécurisé",
    passwordHint: "Minimum 6 caractères. Ne partage jamais ton mot de passe.",
    submit: "Créer mon accès gratuit",
    submitting: "Création de ton accès…",
    haveAccount: "Tu as déjà un compte ?",
    loginLink: "Me connecter",
    errorGeneric: "Une erreur est survenue. Merci de réessayer.",
    errorGoogle: "Une erreur est survenue avec la connexion Google.",
    errorRecaptcha: "La vérification de sécurité (reCAPTCHA) a échoué. Merci de réessayer.",
    confirmTitle: "✅ Ton compte a bien été créé.",
    confirmBody:
      "📩 Vérifie ton courriel pour confirmer ton inscription.\nUne fois confirmé, tu seras redirigé automatiquement pour créer ton AmorIAI.",
    show: "Afficher",
    hide: "Cacher",
    missingKey: "Clé reCAPTCHA manquante (NEXT_PUBLIC_RECAPTCHA_SITE_KEY).",
  },
  en: {
    badge: "Create your AmorIAI account",
    title: "Create your account",
    subtitle: "Activate your free access, then create your first AmorIAI in a few seconds.",
    google: "Continue with Google",
    googleLoading: "Redirecting…",
    or: "or",
    emailLabel: "Email address",
    emailPlaceholder: "e.g. my.address@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Choose a secure password",
    passwordHint: "Minimum 6 characters. Never share your password.",
    submit: "Create my free access",
    submitting: "Creating your access…",
    haveAccount: "Already have an account?",
    loginLink: "Log in",
    errorGeneric: "Something went wrong. Please try again.",
    errorGoogle: "Something went wrong with Google sign-in.",
    errorRecaptcha: "Security check (reCAPTCHA) failed. Please try again.",
    confirmTitle: "✅ Your account has been created.",
    confirmBody:
      "📩 Check your email to confirm your registration.\nOnce confirmed, you’ll be redirected automatically to create your AmorIAI.",
    show: "Show",
    hide: "Hide",
    missingKey: "Missing reCAPTCHA key (NEXT_PUBLIC_RECAPTCHA_SITE_KEY).",
  },
  es: {
    badge: "Crear tu cuenta AmorIAI",
    title: "Crear tu cuenta",
    subtitle: "Activa tu acceso gratuito y luego crea tu primer AmorIAI en segundos.",
    google: "Continuar con Google",
    googleLoading: "Redirigiendo…",
    or: "o",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "ej. mi.direccion@email.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Elige una contraseña segura",
    passwordHint: "Mínimo 6 caracteres. Nunca compartas tu contraseña.",
    submit: "Crear mi acceso gratuito",
    submitting: "Creando tu acceso…",
    haveAccount: "¿Ya tienes cuenta?",
    loginLink: "Iniciar sesión",
    errorGeneric: "Ocurrió un error. Inténtalo de nuevo.",
    errorGoogle: "Ocurrió un error con el inicio de sesión de Google.",
    errorRecaptcha: "La verificación de seguridad (reCAPTCHA) ha fallado. Inténtalo de nuevo.",
    confirmTitle: "✅ Tu cuenta ha sido creada.",
    confirmBody:
      "📩 Revisa tu correo para confirmar tu inscripción.\nUna vez confirmada, serás redirigido automáticamente para crear tu AmorIAI.",
    show: "Mostrar",
    hide: "Ocultar",
    missingKey: "Falta la clave reCAPTCHA (NEXT_PUBLIC_RECAPTCHA_SITE_KEY).",
  },
};

/* ===========================
   HELPERS
=========================== */

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited" ? raw : "free";
}

function buildRedirectParams(locale: Locale, plan: PlanId) {
  const params = new URLSearchParams();
  params.set("lang", locale);
  params.set("plan", plan);
  return params;
}

function setTempCookie(name: string, value: string, maxAgeSeconds = 600) {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

/* ===========================
   COMPONENT
=========================== */

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const locale = useMemo(() => normalizeLocale(searchParams.get("lang")), [searchParams]);
  const plan = useMemo(() => normalizePlan(searchParams.get("plan")), [searchParams]);
  const t = STRINGS[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [waitingConfirmation, setWaitingConfirmation] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // reCAPTCHA ready
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      setRecaptchaReady(false);
      return;
    }

    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const g = (window as any)?.grecaptcha;
      if (g?.ready && g?.execute) {
        g.ready(() => {
          if (!cancelled) setRecaptchaReady(true);
        });
        return;
      }
      setTimeout(tick, 150);
    };

    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  const runRecaptcha = async (action: "signup"): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY) return null;
    const g = (window as any)?.grecaptcha;
    if (!g?.execute || !g?.ready) return null;

    return new Promise((resolve) => {
      g.ready(async () => {
        try {
          const token = await g.execute(RECAPTCHA_SITE_KEY, { action });
          resolve(token);
        } catch {
          resolve(null);
        }
      });
    });
  };

  const verifyRecaptcha = async (token: string, action: string) => {
    const res = await fetch("/api/verify-recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action }),
    });

    const json = await res.json().catch(() => ({}));

    const ok =
      res.ok &&
      (json as any)?.success === true &&
      typeof (json as any)?.score === "number" &&
      (json as any).score >= MIN_RECAPTCHA_SCORE;

    return { ok, json };
  };

  const goToLogin = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", plan);
    router.push(`/login?${params.toString()}`);
  };

  /* ===========================
     Email Signup
     Objectif: FINIR sur /create-amoria
  =========================== */
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);
    setWaitingConfirmation(false);

    try {
      if (!RECAPTCHA_SITE_KEY) {
        setErrorMsg(t.missingKey);
        return;
      }

      const token = await runRecaptcha("signup");
      if (!token) {
        setErrorMsg(t.errorRecaptcha);
        return;
      }

      const { ok, json } = await verifyRecaptcha(token, "signup");
      if (!ok) {
        console.error("verify-recaptcha failed:", json);
        setErrorMsg(t.errorRecaptcha);
        return;
      }

      const origin = window.location.origin;
      const params = buildRedirectParams(locale, plan);

      // ✅ destination finale signup
      const finalPath = `${CREATE_AMORIA_PATH}?${params.toString()}`;

      // ✅ cookies 24h (important pour la confirmation email)
      setTempCookie("amoria_lang", locale, SIGNUP_COOKIE_MAX_AGE);
      setTempCookie("amoria_plan", plan, SIGNUP_COOKIE_MAX_AGE);
      setTempCookie("amoria_returnTo", finalPath, SIGNUP_COOKIE_MAX_AGE);

      // ✅ Supabase reviendra sur /api/auth/callback (sans query)
      const emailRedirectTo = `${origin}${AUTH_CALLBACK_PATH}`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      });

      if (error) {
        console.error("supabase signUp error", error);
        setErrorMsg(error.message || t.errorGeneric);
        return;
      }

      // ✅ confirmation email requise (cas normal)
      if (!data?.session) {
        setWaitingConfirmation(true);
        return;
      }

      // ✅ session immédiate (rare)
      router.replace(finalPath);
    } catch (err) {
      console.error("signup error", err);
      setErrorMsg(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     Google OAuth Signup
     Objectif: FINIR sur /create-amoria
  =========================== */
  const handleGoogle = async () => {
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);
    setWaitingConfirmation(false);

    try {
      const origin = window.location.origin;
      const params = buildRedirectParams(locale, plan);
      const finalPath = `${CREATE_AMORIA_PATH}?${params.toString()}`;

      // ✅ cookies 24h (utile aussi)
      setTempCookie("amoria_lang", locale, SIGNUP_COOKIE_MAX_AGE);
      setTempCookie("amoria_plan", plan, SIGNUP_COOKIE_MAX_AGE);
      setTempCookie("amoria_returnTo", finalPath, SIGNUP_COOKIE_MAX_AGE);

      // ✅ redirectTo => callback SANS query
      const redirectTo = `${origin}${AUTH_CALLBACK_PATH}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) {
        console.error("google oauth error", error);
        setErrorMsg(t.errorGoogle);
        return;
      }
      // pas de router.replace ici
    } catch (err) {
      console.error("google oauth error", err);
      setErrorMsg(t.errorGoogle);
    } finally {
      setLoading(false);
    }
  };

  const submitDisabled = loading || !recaptchaReady || waitingConfirmation;

  return (
    <>
      {RECAPTCHA_SITE_KEY ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
            RECAPTCHA_SITE_KEY
          )}`}
          strategy="afterInteractive"
        />
      ) : null}

      <main className="auth-root">
        <div className="auth-gradient-orbit" />
        <div className="auth-gradient-orbit auth-gradient-orbit--right" />

        <div className="auth-card">
          <div className="auth-badge">{t.badge}</div>

          <header className="auth-header">
            <h1 className="auth-title">{t.title}</h1>
            <p className="auth-subtitle">{t.subtitle}</p>
          </header>

          {waitingConfirmation && (
            <div className="auth-confirm-box" role="status" aria-live="polite">
              <div className="auth-confirm-title">{t.confirmTitle}</div>
              <div className="auth-confirm-body">{t.confirmBody}</div>
            </div>
          )}

          {errorMsg && <p className="auth-error auth-error--block">{errorMsg}</p>}

          <button type="button" onClick={handleGoogle} disabled={loading} className="auth-google-btn">
            <span className="auth-google-icon" aria-hidden="true">
              <img src="/google-g.png" alt="" className="auth-google-img" />
            </span>
            <span>{loading ? t.googleLoading : t.google}</span>
          </button>

          <div className="auth-divider" aria-hidden="true">
            <span className="auth-divider-line" />
            <span className="auth-divider-label">{t.or}</span>
            <span className="auth-divider-line" />
          </div>

          <form onSubmit={handleSignup} noValidate className="auth-form">
            <div className="auth-field">
              <label className="auth-label">{t.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="auth-input"
                autoComplete="email"
                disabled={loading || waitingConfirmation}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">{t.passwordLabel}</label>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="auth-input auth-input-password"
                  autoComplete="new-password"
                  disabled={loading || waitingConfirmation}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="auth-password-toggle"
                  disabled={loading || waitingConfirmation}
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </div>
              <p className="auth-password-hint">{t.passwordHint}</p>
            </div>

            <button
              type="submit"
              disabled={submitDisabled}
              className="auth-submit-btn"
              title={!recaptchaReady ? "reCAPTCHA pas prêt" : undefined}
            >
              {loading ? t.submitting : t.submit}
            </button>
          </form>

          <div className="auth-footer">
            {t.haveAccount}{" "}
            <button type="button" onClick={goToLogin} className="auth-link-btn" disabled={loading}>
              {t.loginLink}
            </button>
          </div>
        </div>

        <style jsx>{`
          .auth-root {
            min-height: 100vh;
            margin: 0;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 85%),
              radial-gradient(circle at bottom, #020617, #000);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
              "Helvetica Neue", Arial, sans-serif;
          }

          .auth-gradient-orbit {
            position: absolute;
            width: 520px;
            height: 520px;
            border-radius: 999px;
            background: radial-gradient(
              circle at 20% 20%,
              rgba(251, 113, 133, 0.55),
              transparent 60%
            );
            opacity: 0.6;
            filter: blur(4px);
            top: -120px;
            left: -120px;
            pointer-events: none;
          }

          .auth-gradient-orbit--right {
            top: auto;
            bottom: -160px;
            left: auto;
            right: -140px;
            background: radial-gradient(
              circle at 80% 20%,
              rgba(59, 130, 246, 0.55),
              transparent 65%
            );
          }

          .auth-card {
            position: relative;
            width: 100%;
            max-width: 440px;
            border-radius: 1.9rem;
            padding: 2.3rem 2.5rem 2.1rem;
            background: radial-gradient(
                circle at top left,
                rgba(248, 113, 113, 0.28),
                transparent 55%
              ),
              radial-gradient(
                circle at bottom right,
                rgba(59, 130, 246, 0.28),
                transparent 55%
              ),
              rgba(2, 6, 23, 0.98);
            box-shadow: 0 32px 90px rgba(15, 23, 42, 0.95),
              0 0 0 1px rgba(148, 163, 184, 0.35);
            border: 1px solid rgba(148, 163, 184, 0.55);
            backdrop-filter: blur(20px);
            z-index: 1;
          }

          .auth-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.2rem 0.9rem;
            border-radius: 999px;
            font-size: 0.7rem;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            background: rgba(15, 23, 42, 0.96);
            border: 1px solid rgba(148, 163, 184, 0.7);
            color: #9ca3af;
            margin-bottom: 1rem;
          }

          .auth-header {
            margin-bottom: 1.5rem;
          }

          .auth-title {
            font-size: 1.7rem;
            font-weight: 700;
            margin: 0 0 0.35rem;
            letter-spacing: 0.02em;
          }

          .auth-subtitle {
            margin: 0;
            font-size: 0.9rem;
            color: #9ca3af;
            line-height: 1.4;
          }

          .auth-confirm-box {
            background: rgba(34, 197, 94, 0.12);
            border: 1px solid rgba(34, 197, 94, 0.6);
            padding: 0.9rem 1rem;
            border-radius: 0.9rem;
            font-size: 0.85rem;
            color: #bbf7d0;
            margin-bottom: 1rem;
            text-align: center;
          }

          .auth-confirm-title {
            font-weight: 700;
            margin-bottom: 0.25rem;
          }

          .auth-confirm-body {
            font-size: 0.82rem;
            white-space: pre-line;
            line-height: 1.35;
          }

          .auth-google-btn {
            width: 100%;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.9);
            padding: 0.72rem 1rem;
            background: radial-gradient(
              circle at top left,
              rgba(15, 23, 42, 0.9),
              rgba(15, 23, 42, 1)
            );
            color: #e5e7eb;
            font-size: 0.92rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.55rem;
            cursor: pointer;
            transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease,
              border-color 0.15s ease, opacity 0.15s ease;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.7);
          }

          .auth-google-btn:disabled {
            opacity: 0.7;
            cursor: default;
            box-shadow: none;
          }

          .auth-google-btn:not(:disabled):hover {
            transform: translateY(-1px);
            border-color: rgba(248, 250, 252, 0.7);
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.85);
          }

          .auth-google-icon {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .auth-google-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .auth-divider {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin: 1.35rem 0 1.15rem;
          }

          .auth-divider-line {
            flex: 1;
            height: 1px;
            background: linear-gradient(
              to right,
              transparent,
              rgba(148, 163, 184, 0.7),
              transparent
            );
          }

          .auth-divider-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: #6b7280;
          }

          .auth-form {
            display: flex;
            flex-direction: column;
            gap: 0.95rem;
          }

          .auth-field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .auth-label {
            font-size: 0.8rem;
            color: #e5e7eb;
          }

          .auth-input {
            width: 100%;
            border-radius: 999px;
            border: 1px solid rgba(55, 65, 81, 0.95);
            background: radial-gradient(
              circle at top left,
              rgba(15, 23, 42, 0.9),
              rgba(15, 23, 42, 1)
            );
            padding: 0.62rem 0.95rem;
            font-size: 0.92rem;
            color: #e5e7eb;
            outline: none;
            transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          }

          .auth-input::placeholder {
            color: #6b7280;
          }

          .auth-input:focus {
            border-color: #f97316;
            box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.65),
              0 14px 38px rgba(15, 23, 42, 0.9);
          }

          .auth-password-wrapper {
            position: relative;
          }

          .auth-input-password {
            padding-right: 2.9rem;
          }

          .auth-password-toggle {
            position: absolute;
            right: 0.7rem;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 999px;
            border: none;
            background: transparent;
            color: #9ca3af;
            font-size: 0.75rem;
            padding: 0.2rem 0.55rem;
            cursor: pointer;
            transition: color 0.15s ease, background 0.15s ease;
          }

          .auth-password-toggle:hover {
            color: #e5e7eb;
            background: rgba(15, 23, 42, 0.9);
          }

          .auth-password-hint {
            font-size: 0.75rem;
            color: #9ca3af;
            margin-top: 0.25rem;
            line-height: 1.25;
          }

          .auth-error {
            font-size: 0.82rem;
            color: #fecaca;
          }

          .auth-error--block {
            margin-bottom: 0.85rem;
          }

          .auth-submit-btn {
            width: 100%;
            margin-top: 0.25rem;
            border-radius: 999px;
            border: none;
            padding: 0.8rem 1rem;
            font-size: 0.96rem;
            font-weight: 700;
            color: #f9fafb;
            cursor: pointer;
            background-image: linear-gradient(120deg, #fb7185, #f97316, #fb7185);
            box-shadow: 0 18px 48px rgba(248, 113, 113, 0.7);
            transition: transform 0.1s ease, box-shadow 0.15s ease, filter 0.1s ease,
              opacity 0.15s ease;
          }

          .auth-submit-btn:disabled {
            opacity: 0.75;
            cursor: default;
            box-shadow: none;
            filter: grayscale(0.1);
          }

          .auth-submit-btn:not(:disabled):hover {
            transform: translateY(-1px);
            box-shadow: 0 24px 60px rgba(248, 113, 113, 0.9);
          }

          .auth-footer {
            margin-top: 1.15rem;
            font-size: 0.86rem;
            text-align: center;
            color: #9ca3af;
          }

          .auth-link-btn {
            border: none;
            background: none;
            padding: 0;
            margin: 0;
            color: #f9a8d4;
            cursor: pointer;
            font-size: 0.86rem;
            text-decoration: underline;
            text-underline-offset: 2px;
          }

          .auth-link-btn:disabled {
            opacity: 0.65;
            cursor: default;
          }

          .auth-input,
          .auth-input:focus,
          .auth-input:active {
            color: #e5e7eb;
          }

          .auth-input:-webkit-autofill,
          .auth-input:-webkit-autofill:hover,
          .auth-input:-webkit-autofill:focus {
            -webkit-text-fill-color: #e5e7eb;
            transition: background-color 9999s ease-out 0s;
          }

          @media (max-width: 480px) {
            .auth-root {
              padding-inline: 1.1rem;
            }
            .auth-card {
              padding-inline: 1.6rem;
            }
          }
        `}</style>
      </main>
    </>
  );
}
