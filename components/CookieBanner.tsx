"use client";

import { useEffect, useMemo, useState } from "react";

type Locale = "fr" | "en" | "es";

type Copy = {
  text: string;
  accept: string;
  decline: string;
  settings: string;
  settingsTitle: string;
  settingsDesc: string;
  essentialLabel: string;
  analyticsLabel: string;
  save: string;
};

const TEXT: Record<Locale, Copy> = {
  fr: {
    text: "Ce site utilise des cookies pour assurer son bon fonctionnement, améliorer ton expérience et analyser le trafic. Tu peux accepter ou refuser les cookies non essentiels.",
    accept: "Tout accepter",
    decline: "Refuser",
    settings: "Paramétrer",
    settingsTitle: "Paramètres des cookies",
    settingsDesc:
      "Tu peux choisir si tu acceptes les cookies d’analyse. Les cookies essentiels sont toujours activés pour que le site fonctionne correctement.",
    essentialLabel: "Cookies essentiels (obligatoires)",
    analyticsLabel: "Cookies d’analyse et de mesure d’audience",
    save: "Enregistrer mes préférences",
  },
  en: {
    text: "This site uses cookies to ensure proper operation, improve your experience and analyze traffic. You can accept or refuse non-essential cookies.",
    accept: "Accept all",
    decline: "Decline",
    settings: "Settings",
    settingsTitle: "Cookie settings",
    settingsDesc:
      "You can choose whether to allow analytics cookies. Essential cookies are always enabled so the site can function properly.",
    essentialLabel: "Essential cookies (required)",
    analyticsLabel: "Analytics and audience measurement cookies",
    save: "Save my preferences",
  },
  es: {
    text: "Este sitio utiliza cookies para garantizar su correcto funcionamiento, mejorar tu experiencia y analizar el tráfico. Puedes aceptar o rechazar las cookies no esenciales.",
    accept: "Aceptar todo",
    decline: "Rechazar",
    settings: "Configurar",
    settingsTitle: "Configuración de cookies",
    settingsDesc:
      "Puedes elegir si permites las cookies de analítica. Las cookies esenciales siempre están activadas para que el sitio funcione correctamente.",
    essentialLabel: "Cookies esenciales (obligatorias)",
    analyticsLabel: "Cookies de análisis y medición de audiencia",
    save: "Guardar mis preferencias",
  },
};

// ✅ versionne la clé (si tu modifies le bandeau, ça peut re-s’afficher proprement)
const CONSENT_KEY = "amoriai_cookie_consent_v1"; // values: "all" | "necessary"

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function readLocaleFromUrl(): Locale {
  if (typeof window === "undefined") return "fr";
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  return lang === "en" || lang === "es" || lang === "fr" ? lang : "fr";
}

function readConsent(): "all" | "necessary" | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === "all" || v === "necessary") return v;
    return null;
  } catch {
    return null;
  }
}

function writeConsent(v: "all" | "necessary") {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    // ignore
  }
}

/**
 * ✅ Consent Mode (Google Ads / Analytics via gtag)
 * - allowAnalytics = true  => granted
 * - allowAnalytics = false => denied
 */
function pushGtagConsent(allowAnalytics: boolean) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("consent", "update", {
    ad_storage: allowAnalytics ? "granted" : "denied",
    analytics_storage: allowAnalytics ? "granted" : "denied",
    ad_user_data: allowAnalytics ? "granted" : "denied",
    ad_personalization: allowAnalytics ? "granted" : "denied",
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [locale, setLocale] = useState<Locale>("fr");

  // ✅ au montage : locale + consent (et applique le consent si déjà enregistré)
  useEffect(() => {
    if (typeof window === "undefined") return;

    setLocale(readLocaleFromUrl());

    const consent = readConsent();

    if (!consent) {
      setVisible(true);
      setAnalyticsAllowed(true); // juste pour cocher la case dans Settings
      return;
    }

    const allow = consent === "all";
    setAnalyticsAllowed(allow);
    pushGtagConsent(allow);
    setVisible(false);
  }, []);

  // ✅ met à jour la langue si l’URL change (?lang=)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setLocale(readLocaleFromUrl());

    window.addEventListener("popstate", update);

    const push = history.pushState;
    const replace = history.replaceState;

    history.pushState = function (...args) {
      push.apply(this, args as any);
      update();
    };
    history.replaceState = function (...args) {
      replace.apply(this, args as any);
      update();
    };

    return () => {
      window.removeEventListener("popstate", update);
      history.pushState = push;
      history.replaceState = replace;
    };
  }, []);

  const t = useMemo(() => TEXT[locale], [locale]);

  const acceptAll = () => {
    writeConsent("all");
    setAnalyticsAllowed(true);
    pushGtagConsent(true);
    setShowSettings(false);
    setVisible(false);
  };

  const decline = () => {
    writeConsent("necessary");
    setAnalyticsAllowed(false);
    pushGtagConsent(false);
    setShowSettings(false);
    setVisible(false);
  };

  const save = () => {
    const allow = analyticsAllowed;
    writeConsent(allow ? "all" : "necessary");
    pushGtagConsent(allow);
    setShowSettings(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: "auto 0 0 0",
        zIndex: 2147483647,
        padding: "14px 16px 18px",
        background: "rgba(2,6,23,0.98)",
        borderTop: "1px solid rgba(148,163,184,0.4)",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: 13, textAlign: "center", lineHeight: 1.4, margin: 0 }}>
          {t.text}
        </p>

        {showSettings && (
          <div
            style={{
              width: "100%",
              maxWidth: 980,
              background: "rgba(15,23,42,0.98)",
              border: "1px solid rgba(148,163,184,0.6)",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 4, fontSize: 13, fontWeight: 700 }}>
              {t.settingsTitle}
            </h3>
            <p style={{ margin: 0, marginBottom: 10, fontSize: 12, opacity: 0.9 }}>
              {t.settingsDesc}
            </p>

            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked readOnly />
              <span style={{ fontSize: 12 }}>{t.essentialLabel}</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={analyticsAllowed}
                onChange={(e) => setAnalyticsAllowed(e.target.checked)}
              />
              <span style={{ fontSize: 12 }}>{t.analyticsLabel}</span>
            </label>

            <button
              onClick={save}
              style={{
                marginTop: 6,
                background: "rgba(59,130,246,0.95)",
                border: "none",
                borderRadius: 999,
                padding: "7px 16px",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {t.save}
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => setShowSettings((v) => !v)}
            style={{
              background: "rgba(15,23,42,0.9)",
              borderRadius: 999,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#e5e7eb",
              cursor: "pointer",
              border: "1px solid rgba(148,163,184,0.7)",
              minWidth: 130,
            }}
          >
            {t.settings}
          </button>

          <button
            onClick={decline}
            style={{
              background: "transparent",
              borderRadius: 999,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#e5e7eb",
              cursor: "pointer",
              border: "1px solid rgba(148,163,184,0.7)",
              minWidth: 130,
            }}
          >
            {t.decline}
          </button>

          <button
            onClick={acceptAll}
            style={{
              background: "linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316)",
              border: "none",
              borderRadius: 999,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 800,
              color: "#fff",
              cursor: "pointer",
              minWidth: 130,
            }}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
