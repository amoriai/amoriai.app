"use client";

import { useEffect, useState } from "react";

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

function getLocaleFromUrl(): Locale {
  if (typeof window === "undefined") return "fr";

  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");

  if (lang === "en" || lang === "es" || lang === "fr") {
    return lang;
  }
  return "fr";
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");

  // panneau "Paramétrer"
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);

  // Afficher le bandeau uniquement si aucun choix n’a été fait
  useEffect(() => {
    if (typeof window === "undefined") return;

    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    } else {
      // si déjà accepté -> analyticsAllowed = true, sinon false
      setAnalyticsAllowed(consent === "all");
    }
  }, []);

  // Suivre la langue via ?lang=fr|en|es (sans useSearchParams)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateLocale = () => {
      setLocale(getLocaleFromUrl());
    };

    updateLocale();

    window.addEventListener("popstate", updateLocale);

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args as any);
      updateLocale();
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args as any);
      updateLocale();
    };

    return () => {
      window.removeEventListener("popstate", updateLocale);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  const acceptCookies = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookieConsent", "all");
    }
    setAnalyticsAllowed(true);
    setVisible(false);
  };

  const declineCookies = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookieConsent", "necessary");
    }
    setAnalyticsAllowed(false);
    setVisible(false);
  };

  const saveSettings = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookieConsent", analyticsAllowed ? "all" : "necessary");
    }
    setVisible(false);
  };

  if (!visible) return null;

  const t = TEXT[locale];

  return (
    <div style={styles.container}>
      <p style={styles.text}>{t.text}</p>

      {/* Panneau de réglages si "Paramétrer" est cliqué */}
      {showSettings && (
        <div style={styles.settingsBox}>
          <h3 style={styles.settingsTitle}>{t.settingsTitle}</h3>
          <p style={styles.settingsDesc}>{t.settingsDesc}</p>

          <div style={styles.settingsRow}>
            <input
              type="checkbox"
              checked={true}
              readOnly
              style={styles.checkbox}
            />
            <span style={styles.settingsLabel}>{t.essentialLabel}</span>
          </div>

          <div style={styles.settingsRow}>
            <input
              type="checkbox"
              checked={analyticsAllowed}
              onChange={(e) => setAnalyticsAllowed(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.settingsLabel}>{t.analyticsLabel}</span>
          </div>

          <button onClick={saveSettings} style={styles.saveButton}>
            {t.save}
          </button>
        </div>
      )}

      <div style={styles.buttonsRow}>
        <button
          onClick={() => setShowSettings((v) => !v)}
          style={styles.settingsButton}
        >
          {t.settings}
        </button>

        <button onClick={declineCookies} style={styles.secondaryButton}>
          {t.decline}
        </button>

        <button onClick={acceptCookies} style={styles.primaryButton}>
          {t.accept}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    width: "100%",
    background: "rgba(2,6,23,0.98)",
    color: "#e5e7eb",
    padding: "14px 16px 18px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    borderTop: "1px solid rgba(148,163,184,0.4)",
  },

  text: {
    fontSize: "13px",
    textAlign: "center" as const,
    maxWidth: "900px",
    lineHeight: 1.4,
  },

  buttonsRow: {
    display: "flex",
    flexDirection: "row" as const,
    gap: "10px",
    justifyContent: "center" as const,
    flexWrap: "wrap" as const,
  },

  primaryButton: {
    background: "linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316)",
    border: "none",
    borderRadius: "999px",
    padding: "6px 18px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
    minWidth: "120px",
  },

  secondaryButton: {
    background: "transparent",
    borderRadius: "999px",
    padding: "6px 18px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#e5e7eb",
    cursor: "pointer",
    border: "1px solid rgba(148,163,184,0.7)",
    minWidth: "120px",
  },

  settingsButton: {
    background: "rgba(15,23,42,0.9)",
    borderRadius: "999px",
    padding: "6px 18px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#e5e7eb",
    cursor: "pointer",
    border: "1px solid rgba(148,163,184,0.7)",
    minWidth: "120px",
  },

  settingsBox: {
    marginTop: "6px",
    marginBottom: "4px",
    maxWidth: "900px",
    width: "100%",
    background: "rgba(15,23,42,0.98)",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.6)",
    padding: "10px 12px",
    fontSize: "13px",
  },

  settingsTitle: {
    margin: 0,
    marginBottom: "4px",
    fontSize: "13px",
    fontWeight: 600,
  },

  settingsDesc: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "12px",
    opacity: 0.9,
  },

  settingsRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "6px",
  },

  checkbox: {
    width: "14px",
    height: "14px",
  },

  settingsLabel: {
    fontSize: "12px",
  },

  saveButton: {
    marginTop: "6px",
    background: "rgba(59,130,246,0.9)",
    border: "none",
    borderRadius: "999px",
    padding: "6px 16px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
  },
};
