"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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

function resolveLocale(langParam: string | null): Locale {
  if (langParam === "en") return "en";
  if (langParam === "es") return "es";
  return "fr";
}

export default function CookieBanner() {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Vérifie si l’utilisateur a déjà accepté
    const consent = typeof window !== "undefined"
      ? localStorage.getItem("cookieConsent")
      : null;

    if (!consent) {
      setVisible(true);
    }
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
