"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const MIN_RECAPTCHA_SCORE = 0.5;

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

type Strings = {
  title: string;
  subtitle: string;
  badge: string;

  google: string;
  googleLoading: string;

  or: string;

  emailLabel: string;
  emailPlaceholder: string;

  passwordLabel: string;
  passwordPlaceholder: string;

  show: string;
  hide: string;

  submit: string;
  submitting: string;

  noAccount: string;
  signupLink: string;

  errorGeneric: string;
  errorInvalid: string;
  errorRecaptcha: string;
  errorRls: string;
  missingKey: string;
};

const STRINGS: Record<Locale, Strings> = {
  fr: {
    title: "Me connecter",
    subtitle: "Accède à ton AmorIAI personnel et reprends la conversation.",
    badge: "Connexion à AmorIAI",

    google: "Continuer avec Google",
    googleLoading: "Redirection…",

    or: "ou",

    emailLabel: "Adresse courriel",
    emailPlaceholder: "ex. mon.adresse@email.com",

    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Ton mot de passe AmorIAI",

    show: "Afficher",
    hide: "Masquer",

    submit: "Me connecter",
    submitting: "Connexion…",

    noAccount: "Pas encore de compte ?",
    signupLink: "Créer mon compte",

    errorGeneric: "Une erreur est survenue. Réessaie dans un instant.",
    errorInvalid: "Courriel ou mot de passe invalide. Vérifie tes infos ou crée un compte.",
    errorRecaptcha: "Connexion refusée (vérification de sécurité). Recharge la page et réessaie.",
    errorRls:
      "Connexion OK, mais accès refusé à la table user_amoria (RLS). Il faut ajouter la policy SELECT pour lire tes propres lignes.",
    missingKey: "Clé reCAPTCHA manquante (NEXT_PUBLIC_RECAPTCHA_SITE_KEY).",
  },
  en: {
    title: "Log in",
    subtitle: "Access your personal AmorIAI and resume your conversation.",
    badge: "Sign in to AmorIAI",

    google: "Continue with Google",
    googleLoading: "Redirecting…",

    or: "or",

    emailLabel: "Email address",
    emailPlaceholder: "e.g. my.address@email.com",

    passwordLabel: "Password",
    passwordPlaceholder: "Your AmorIAI password",

    show: "Show",
    hide: "Hide",

    submit: "Log in",
    submitting: "Logging in…",

    noAccount: "Don’t have an account yet?",
    signupLink: "Create my account",

    errorGeneric: "Something went wrong. Please try again.",
    errorInvalid: "Invalid email or password.",
    errorRecaptcha: "Login blocked (security check). Refresh the page and try again.",
    errorRls:
      "Login OK, but access denied to user_amoria table (RLS). Add a SELECT policy so users can read their own rows.",
    missingKey: "Missing reCAPTCHA key (NEXT_PUBLIC_RECAPTCHA_SITE_KEY).",
  },
  es: {
    title: "Iniciar sesión",
    subtitle: "Accede a tu AmorIAI personal y continúa la conversación.",
    badge: "Conectarte a AmorIAI",

    google: "Continuar con Google",
    googleLoading: "Redirigiendo…",

    or: "o",

    emailLabel: "Correo electrónico",
    emailPlaceholder: "ej. mi.direccion@email.com",

    passwordLabel: "Contraseña",
    passwordPlaceholder: "Tu contraseña de AmorIAI",

    show: "Mostrar",
    hide: "Ocultar",

    submit: "Iniciar sesión",
    submitting: "Conectando…",

    noAccount: "¿Todavía no tienes cuenta?",
    signupLink: "Crear mi cuenta",

    errorGeneric: "Ocurrió un error. Inténtalo de nuevo.",
    errorInvalid: "Correo o contraseña inválidos.",
    errorRecaptcha: "Inicio bloqueado (verificación de seguridad). Recarga la página e inténtalo de nuevo.",
    errorRls:
      "Login OK, pero acceso denegado a la tabla user_amoria (RLS). Agrega una policy SELECT para leer tus filas.",
    missingKey: "Falta la clave reCAPTCHA (NEXT_PUBLIC_RECAPTCHA_SITE_KEY).",
  },
};

function normalizeLocale(raw: string | null): Locale {
  if (raw === "fr" || raw === "en" || raw === "es") return raw;
  return "fr";
}

function normalizePlan(raw: string | null): PlanId {
  if (raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited") return raw;
  return "free";
}

// ✅ sécurité: returnTo doit être interne (évite open redirect)
function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/")) return null;
  if (raw.startsWith("//")) return null;
  return raw;
}

export default function LoginClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = useMemo(() => normalizeLocale(searchParams.get("lang")), [searchParams]);
  const plan = useMemo(() => normalizePlan(searchParams.get("plan")), [searchParams]);
  const returnTo = useMemo(() => safeReturnTo(searchParams.get("returnTo")), [searchParams]);
  const t = STRINGS[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // ✅ reCAPTCHA ready (utilisé pour email/password seulement)
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

  const goToSignup = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", plan);
    if (returnTo) params.set("returnTo", returnTo);
    router.push(`/signup?${params.toString()}`);
  };

  const getRecaptchaToken = async (action: "login") => {
    if (!RECAPTCHA_SITE_KEY) return null;

    const g = (window as any)?.grecaptcha;
    if (!g?.execute || !g?.ready) return null;

    return new Promise<string | null>((resolve) => {
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

  // ✅ redirection après login EMAIL
  const redirectAfterEmailLogin = async () => {
    // 1) priorité au returnTo (ex: /chat?... )
    if (returnTo) {
      router.replace(returnTo);
      return;
    }

    // 2) sinon: logique safe (my-amoria ou create-amoria)
    const params = new URLSearchParams();
    params.set("lang", locale);

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      router.replace(`/login?${params.toString()}`);
      return;
    }

    const { data: amoria, error } = await supabase
      .from("user_amoria")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("user_amoria lookup error:", error);

      const msg = String((error as any)?.message ?? "").toLowerCase();
      const code = String((error as any)?.code ?? "");
      const looksLikeRls =
        code === "42501" ||
        msg.includes("permission") ||
        msg.includes("not allowed") ||
        msg.includes("row level security") ||
        msg.includes("rls");

      if (looksLikeRls) {
        setErrorMsg(t.errorRls);
        return;
      }

      router.replace(`/create-amoria?${params.toString()}`);
      return;
    }

    if (!amoria) {
      router.replace(`/create-amoria?${params.toString()}`);
      return;
    }

    router.replace(`/my-amoria?${params.toString()}`);
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loadingEmail || loadingGoogle) return;

    setLoadingEmail(true);
    setErrorMsg(null);

    try {
      if (!RECAPTCHA_SITE_KEY) {
        setErrorMsg(t.missingKey);
        setLoadingEmail(false);
        return;
      }

      const token = await getRecaptchaToken("login");
      if (!token) {
        setErrorMsg(t.errorRecaptcha);
        setLoadingEmail(false);
        return;
      }

      const { ok, json } = await verifyRecaptcha(token, "login");
      if (!ok) {
        console.error("reCAPTCHA verify failed:", json);
        setErrorMsg(t.errorRecaptcha);
        setLoadingEmail(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error("supabase signIn error", error);
        const msg = (error.message || "").toLowerCase();
        const looksAuthError =
          msg.includes("invalid") || msg.includes("user not found") || msg.includes("credentials");

        setErrorMsg(looksAuthError ? t.errorInvalid : t.errorGeneric);
        setLoadingEmail(false);
        return;
      }

      await redirectAfterEmailLogin();
    } catch (err) {
      console.error("login error", err);
      setErrorMsg(t.errorGeneric);
      setLoadingEmail(false);
    }
  };

  // ✅ Google OAuth: on passe lang + plan + returnTo au callback
  const handleGoogleLogin = async () => {
    if (loadingEmail || loadingGoogle) return;

    setLoadingGoogle(true);
    setErrorMsg(null);

    try {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "";

      const cbParams = new URLSearchParams();
      cbParams.set("lang", locale);
      cbParams.set("plan", plan);
      if (returnTo) cbParams.set("returnTo", returnTo);

      const redirectTo = `${origin}/auth/callback?${cbParams.toString()}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          // ✅ optionnel (mais aide certains flows)
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) {
        console.error("google oauth error", error);
        setErrorMsg(t.errorGeneric);
        setLoadingGoogle(false);
        return;
      }
      // Supabase redirige automatiquement
    } catch (err) {
      console.error("google login error", err);
      setErrorMsg(t.errorGeneric);
      setLoadingGoogle(false);
    }
  };

  const isBusy = loadingEmail || loadingGoogle;

  return (
    <>
      {/* reCAPTCHA V3 (utilisé pour email/password) */}
      {RECAPTCHA_SITE_KEY ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`}
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

          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isBusy}
            className="auth-google-btn"
          >
            <span className="auth-google-icon">
              <Image
                src="/google-g.png"
                alt="Google"
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", objectFit: "contain" }}
              />
            </span>
            <span>{loadingGoogle ? t.googleLoading : t.google}</span>
          </button>

          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-label">{t.or}</span>
            <span className="auth-divider-line" />
          </div>

          {/* EMAIL */}
          <form onSubmit={handleEmailLogin} noValidate className="auth-form">
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
                disabled={isBusy}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">{t.passwordLabel}</label>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="auth-input auth-input-password"
                  autoComplete="current-password"
                  disabled={isBusy}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="auth-password-toggle"
                  disabled={isBusy}
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </div>
            </div>

            {errorMsg && <p className="auth-error">{errorMsg}</p>}

            <button
              type="submit"
              disabled={isBusy || !recaptchaReady}
              className="auth-submit-btn"
              title={!recaptchaReady ? "reCAPTCHA pas prêt" : undefined}
            >
              {loadingEmail ? t.submitting : t.submit}
            </button>
          </form>

          <div className="auth-footer">
            {t.noAccount}{" "}
            <button type="button" onClick={goToSignup} className="auth-link-btn" disabled={isBusy}>
              {t.signupLink}
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
              rgba(251, 113, 133, 0.5),
              transparent 60%
            );
            opacity: 0.55;
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
              rgba(59, 130, 246, 0.5),
              transparent 65%
            );
          }
          .auth-card {
            position: relative;
            width: 100%;
            max-width: 430px;
            border-radius: 1.9rem;
            padding: 2.2rem 2.4rem 2rem;
            background: radial-gradient(
                circle at top left,
                rgba(248, 113, 113, 0.24),
                transparent 55%
              ),
              radial-gradient(
                circle at bottom right,
                rgba(59, 130, 246, 0.24),
                transparent 55%
              ),
              rgba(2, 6, 23, 0.98);
            box-shadow: 0 28px 80px rgba(15, 23, 42, 0.95),
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
            margin: 0 0 0.4rem;
            letter-spacing: 0.02em;
          }
          .auth-subtitle {
            margin: 0;
            font-size: 0.98rem;
            line-height: 1.45;
            color: #9ca3af;
          }
          .auth-google-btn {
            width: 100%;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.85);
            padding: 0.7rem 1rem;
            background: radial-gradient(
              circle at top left,
              rgba(15, 23, 42, 0.9),
              rgba(15, 23, 42, 1)
            );
            color: #e5e7eb;
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.55rem;
            cursor: pointer;
            transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease,
              border-color 0.15s ease;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.9);
          }
          .auth-google-btn:disabled {
            opacity: 0.75;
            cursor: default;
            box-shadow: none;
          }
          .auth-google-btn:not(:disabled):hover {
            background: radial-gradient(
              circle at top left,
              rgba(15, 23, 42, 0.95),
              rgba(15, 23, 42, 1)
            );
            transform: translateY(-1px);
            border-color: rgba(248, 250, 252, 0.7);
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.95);
          }
          .auth-google-icon {
            width: 1.4rem;
            height: 1.4rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: transparent;
          }
          .auth-divider {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin: 1.4rem 0 1.2rem;
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
            gap: 0.9rem;
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
            padding: 0.6rem 0.95rem;
            font-size: 0.9rem;
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
            padding-right: 2.7rem;
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
            padding: 0.2rem 0.5rem;
            cursor: pointer;
            transition: color 0.15s ease, background 0.15s ease;
          }
          .auth-password-toggle:hover {
            color: #e5e7eb;
            background: rgba(15, 23, 42, 0.9);
          }
          .auth-error {
            font-size: 0.8rem;
            color: #fecaca;
            margin: 0.2rem 0 0.1rem;
          }
          .auth-submit-btn {
            width: 100%;
            margin-top: 0.3rem;
            border-radius: 999px;
            border: none;
            padding: 0.78rem 1rem;
            font-size: 0.95rem;
            font-weight: 600;
            color: #f9fafb;
            cursor: pointer;
            background-image: linear-gradient(120deg, #fb7185, #f97316, #fb7185);
            box-shadow: 0 18px 48px rgba(248, 113, 113, 0.7);
            transition: transform 0.1s ease, box-shadow 0.15s ease, filter 0.1s ease;
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
            font-size: 0.85rem;
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
            font-size: 0.85rem;
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .auth-link-btn:disabled {
            opacity: 0.6;
            cursor: default;
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
