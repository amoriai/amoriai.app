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

  const url = window.location.href;

  if (url.includes("lang=en")) return "en";
  if (url.includes("lang=es")) return "es";
  return "fr";
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    // ✅ Lire la langue UNE FOIS côté client
    setLocale(getLocaleFromUrl());

    // ✅ Vérifier le consentement
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);

    // ✅ Écouter les changements de langue (FR/EN/ES)
    const onChange = () => setLocale(getLocaleFromUrl());
    window.addEventListener("popstate", onChange);

    return () => window.removeEventListener("popstate", onChange);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
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
