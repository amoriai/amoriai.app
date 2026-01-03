import Link from "next/link";

type Locale = "fr" | "en" | "es";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

const STRINGS: Record<
  Locale,
  { title: string; text: string; ctaChat: string; ctaHome: string }
> = {
  fr: {
    title: "Paiement réussi ✅",
    text: "Merci ! Ton abonnement est actif. Tu peux reprendre la discussion.",
    ctaChat: "Aller au chat",
    ctaHome: "Accueil",
  },
  en: {
    title: "Payment successful ✅",
    text: "Thanks! Your subscription is now active. You can continue the chat.",
    ctaChat: "Go to chat",
    ctaHome: "Home",
  },
  es: {
    title: "Pago completado ✅",
    text: "¡Gracias! Tu suscripción está activa. Puedes continuar el chat.",
    ctaChat: "Ir al chat",
    ctaHome: "Inicio",
  },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const lang = normalizeLocale(typeof sp.lang === "string" ? sp.lang : null);
  const t = STRINGS[lang];

  // Stripe ajoute souvent session_id, on le garde si présent (pas obligatoire)
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : null;

  const chatHref = sessionId
    ? `/chat?lang=${encodeURIComponent(lang)}&session_id=${encodeURIComponent(sessionId)}`
    : `/chat?lang=${encodeURIComponent(lang)}`;

  const homeHref = `/?lang=${encodeURIComponent(lang)}`;

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.h1}>{t.title}</h1>
        <p style={styles.p}>{t.text}</p>

        <div style={styles.row}>
          <Link href={chatHref} style={{ ...styles.btn, ...styles.btnPrimary }}>
            {t.ctaChat}
          </Link>
          <Link href={homeHref} style={styles.btn}>
            {t.ctaHome}
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    display: "grid",
    placeItems: "center",
    padding: 20,
    color: "rgba(248,250,252,0.95)",
    background:
      "radial-gradient(1100px 700px at 50% -10%, rgba(251,55,255,0.20), transparent 60%)," +
      "radial-gradient(900px 700px at 90% 10%, rgba(56,189,248,0.16), transparent 55%)," +
      "linear-gradient(180deg, #020617, #000)",
  },
  card: {
    width: "min(720px, 100%)",
    borderRadius: 22,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.60)",
    backdropFilter: "blur(12px)",
    padding: 22,
    boxShadow: "0 30px 100px rgba(0,0,0,0.65)",
  },
  h1: { margin: 0, fontSize: 26, fontWeight: 850, letterSpacing: "-0.02em" },
  p: { margin: "10px 0 0", color: "rgba(226,232,240,0.88)", lineHeight: 1.5 },
  row: { display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.35)",
    color: "rgba(248,250,252,0.95)",
    textDecoration: "none",
    fontWeight: 700,
  },
  btnPrimary: {
    border: "none",
    background: "linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316)",
  },
};
