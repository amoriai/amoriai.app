"use client";

import { useEffect, useState } from "react";

type Locale = "fr" | "en" | "es";

const TEXT: Record<
  Locale,
  { text: string; accept: string; decline: string }
> = {
  fr: {
    text: "Ce site utilise des cookies pour assurer son bon fonctionnement, améliorer ton expérience et analyser le trafic. Tu peux accepter ou refuser les cookies non essentiels.",
    accept: "Tout accepter",
    decline: "Refuser",
  },
  en: {
    text: "This site uses cookies to ensure proper operation, improve your experience and analyze traffic. You can accept or refuse non-essential cookies.",
    accept: "Accept all",
    decline: "Decline",
  },
  es: {
    text: "Este sitio utiliza cookies para garantizar su correcto funcionamiento, mejorar tu experiencia y analizar el tráfico. Puedes aceptar o rechazar las cookies no esenciales.",
    accept: "Aceptar todo",
    decline: "Rechazar",
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

  // ✅ Afficher le bandeau uniquement si aucun choix n’a été fait
  useEffect(() => {
    if (typeof window === "undefined") return;

    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  // ✅ Suivre la langue via l’URL ?lang=fr|en|es
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateLocale = () => {
      setLocale(getLocaleFromUrl());
    };

    // première lecture
    updateLocale();

    // navigation back/forward
    window.addEventListener("popstate", updateLocale);

    // patch léger pushState / replaceState
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
      // ✅ Mon ajout : valeur explicite pour "tout accepter"
      localStorage.setItem("cookieConsent", "all");
    }
    setVisible(false);
  };

  const declineCookies = () => {
    if (typeof window !== "undefined") {
      // ✅ Mon ajout : seulement les cookies essentiels
      localStorage.setItem("cookieConsent", "necessary");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.container}>
      <p style={styles.text}>{TEXT[locale].text}</p>

      <div style={styles.buttonsRow}>
        <button onClick={declineCookies} style={styles.secondaryButton}>
          {TEXT[locale].decline}
        </button>

        <button onClick={acceptCookies} style={styles.primaryButton}>
          {TEXT[locale].accept}
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
    padding: "14px 16px",
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
    minWidth: "110px",
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
    minWidth: "110px",
  },
};
