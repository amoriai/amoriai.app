"use client";

import { useEffect, useState } from "react";

type Locale = "fr" | "en" | "es";

const TEXT: Record<Locale, { text: string; accept: string }> = {
  fr: {
    text: "Ce site utilise des cookies pour assurer son bon fonctionnement, améliorer ton expérience et analyser le trafic. En continuant, tu acceptes l'utilisation des cookies.",
    accept: "Tout accepter",
  },
  en: {
    text: "This site uses cookies to ensure proper operation, improve your experience and analyze traffic. By continuing, you agree to the use of cookies.",
    accept: "Accept all",
  },
  es: {
    text: "Este sitio utiliza cookies para garantizar su correcto funcionamiento, mejorar tu experiencia y analizar el tráfico. Al continuar, aceptas el uso de cookies.",
    accept: "Aceptar todo",
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

  // 1) Gérer le consentement (afficher ou non le bandeau)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  // 2) Suivre la langue en fonction de l’URL, sans useSearchParams
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateLocale = () => {
      setLocale(getLocaleFromUrl());
    };

    // première lecture
    updateLocale();

    // écouter les changements d’URL (back/forward)
    window.addEventListener("popstate", updateLocale);

    // patch léger sur pushState / replaceState pour capter les changements de langue
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
      localStorage.setItem("cookieConsent", "true");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.container}>
      <p style={styles.text}>{TEXT[locale].text}</p>
      <button onClick={acceptCookies} style={styles.button}>
        {TEXT[locale].accept}
      </button>
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

  button: {
    background: "linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316)",
    border: "none",
    borderRadius: "999px",
    padding: "6px 18px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
  },
};
