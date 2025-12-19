"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase/client";
import styles from "./LoginClient.module.css";

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
    errorInvalid: "Courriel ou mot de passe invalide.",
    errorRecaptcha: "Connexion refusée (vérification de sécurité). Recharge la page et réessaie.",
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
    missingKey: "Falta la clave reCAPTCHA (NEXT_PUBLIC_RECAPTCHA_SITE_KEY).",
  },
};

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}
function normalizePlan(raw: string | null): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited" ? raw : "free";
}
function safeReturnTo(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v.startsWith("/")) return null;
  if (v.startsWith("//")) return null;
  if (v.includes("\\")) return null;
  return v;
}

export default function LoginClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const locale = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);
  const plan = useMemo(() => normalizePlan(sp.get("plan")), [sp]);
  const returnTo = useMemo(() => safeReturnTo(sp.get("returnTo")), [sp]);
  const t = STRINGS[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

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
        g.ready(() => !cancelled && setRecaptchaReady(true));
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
          resolve(await g.execute(RECAPTCHA_SITE_KEY, { action }));
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

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loadingEmail || loadingGoogle) return;

    setLoadingEmail(true);
    setErrorMsg(null);

    try {
      if (!RECAPTCHA_SITE_KEY) {
        setErrorMsg(t.missingKey);
        return;
      }

      const token = await getRecaptchaToken("login");
      if (!token) {
        setErrorMsg(t.errorRecaptcha);
        return;
      }

      const { ok, json } = await verifyRecaptcha(token, "login");
      if (!ok) {
        console.error("reCAPTCHA verify failed:", json);
        setErrorMsg(t.errorRecaptcha);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = (error.message || "").toLowerCase();
        const looksAuthError = msg.includes("invalid") || msg.includes("credentials") || msg.includes("user not found");
        setErrorMsg(looksAuthError ? t.errorInvalid : t.errorGeneric);
        return;
      }

      // ✅ après login email -> UN SEUL TREMPLIN: /auth/post-login
      if (returnTo) {
        router.replace(returnTo);
        return;
      }
      router.replace(`/auth/post-login?lang=${locale}&plan=${plan}`);
    } catch (err) {
      console.error("login error", err);
      setErrorMsg(t.errorGeneric);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loadingEmail || loadingGoogle) return;

    setLoadingGoogle(true);
    setErrorMsg(null);

    try {
      const origin = window.location.origin;

      // ✅ on encode lang/plan/returnTo dans redirectTo
      const callback = new URL(`${origin}/api/auth/callback`);
      callback.searchParams.set("lang", locale);
      callback.searchParams.set("plan", plan);
      if (returnTo) callback.searchParams.set("returnTo", returnTo);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callback.toString(),
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) {
        console.error("google oauth error", error);
        setErrorMsg(t.errorGeneric);
      }
    } catch (err) {
      console.error("google login error", err);
      setErrorMsg(t.errorGeneric);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const isBusy = loadingEmail || loadingGoogle;

  return (
    <>
      {RECAPTCHA_SITE_KEY ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`}
          strategy="afterInteractive"
        />
      ) : null}

      <main className={styles.authRoot}>
        <div className={styles.orbit} />
        <div className={`${styles.orbit} ${styles.orbitRight}`} />

        <div className={styles.card}>
          <div className={styles.badge}>{t.badge}</div>

          <header className={styles.header}>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </header>

          <button type="button" onClick={handleGoogleLogin} disabled={isBusy} className={styles.googleBtn}>
            <span className={styles.googleIcon}>
              <Image src="/google-g.png" alt="Google" width={18} height={18} />
            </span>
            <span>{loadingGoogle ? t.googleLoading : t.google}</span>
          </button>

          <div className={styles.divider}>
            <span className={styles.divLine} />
            <span className={styles.divLabel}>{t.or}</span>
            <span className={styles.divLine} />
          </div>

          <form onSubmit={handleEmailLogin} noValidate className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>{t.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className={styles.input}
                autoComplete="email"
                disabled={isBusy}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t.passwordLabel}</label>
              <div className={styles.passWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className={`${styles.input} ${styles.inputPass}`}
                  autoComplete="current-password"
                  disabled={isBusy}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={styles.passToggle}
                  disabled={isBusy}
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </div>
            </div>

            {errorMsg && <p className={styles.error}>{errorMsg}</p>}

            <button type="submit" disabled={isBusy || !recaptchaReady} className={styles.submit}>
              {loadingEmail ? t.submitting : t.submit}
            </button>
          </form>

          <div className={styles.footer}>
            {t.noAccount}{" "}
            <button type="button" onClick={goToSignup} className={styles.linkBtn} disabled={isBusy}>
              {t.signupLink}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
