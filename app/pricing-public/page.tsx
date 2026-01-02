// app/pricing/page.tsx
import Link from "next/link";

type Locale = "fr" | "en" | "es";

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

function getLocale(sp: PageProps["searchParams"]): Locale {
  const raw = sp["lang"];
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "fr" || v === "en" || v === "es" ? v : "fr";
}

type LayoutStrings = {
  brandTagline: string;
  nav: { home: string; features: string; pricing: string };
  navLogin: string;
  navSignup: string;
  footerCopy: string;
  footerLinks: { legal: string; privacy: string; terms: string; contact: string; about: string };
};

const LAYOUT_STRINGS: Record<Locale, LayoutStrings> = {
  fr: {
    brandTagline: "Partenaire AmorIAI bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: {
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      terms: "Conditions d’utilisation",
      contact: "Contact",
      about: "À propos",
    },
  },
  en: {
    brandTagline: "Caring AmorIAI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my free account",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: { legal: "Legal", privacy: "Privacy", terms: "Terms", contact: "Contact", about: "About" },
  },
  es: {
    brandTagline: "Compañerx AmorIAI amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta gratuita",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: { legal: "Aviso legal", privacy: "Privacidad", terms: "Términos", contact: "Contacto", about: "Acerca de" },
  },
};

type Plan = {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  badge?: "popular" | "value";
};

type Copy = {
  title: string;
  subtitle: string;
  billingNote: string;
  usdNote: string;
  lockNote: string;
  ctaSignup: string;
  ctaLogin: string;
  plans: Plan[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
};

const COPY: Record<Locale, Copy> = {
  fr: {
    title: "Choisis le forfait qui te convient",
    subtitle:
      "Cette page est publique et sert à te montrer les options. Crée ton compte gratuitement, puis tu pourras activer un abonnement quand tu seras prête — depuis ton compte.",
    billingNote: "Paiements sécurisés via Stripe (uniquement après connexion) · Annule ou change en tout temps",
    usdNote: "Les prix sont en dollars américains (USD).",
    lockNote: "Pour activer un forfait, connecte-toi ou crée un compte.",
    ctaSignup: "Créer mon compte gratuit",
    ctaLogin: "Me connecter",
    plans: [
      {
        name: "Découverte",
        price: "Gratuit",
        tagline: "Découvre AmorIAI en douceur.",
        features: ["1 AmorIAI", "Texte (expérience de base)", "FR / EN / ES"],
      },
      {
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        tagline: "Pour écrire à ton AmorIAI chaque jour.",
        features: ["Jusqu’à 2 AmorIAI", "Conversations régulières", "Mémoire longue durée", "FR / EN / ES"],
      },
      {
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        tagline: "Texte + voix, pour une présence plus réelle.",
        features: ["Jusqu’à 10 AmorIAI", "Voix IA", "Conversations approfondies", "Priorité légère"],
        badge: "popular",
      },
      {
        name: "AmorIAI Illimité",
        price: "39,99 $ USD / mois",
        tagline: "Pour une expérience maximale (voix + extras).",
        features: ["Jusqu’à 30 AmorIAI", "Texte + voix", "Utilisation fluide et sans interruption", "Priorité maximale"],
        badge: "value",
      },
    ],
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "Puis-je annuler quand je veux ?", a: "Oui. Tu peux annuler ou changer de forfait à tout moment depuis ton compte." },
      { q: "Pourquoi je ne vois pas Stripe ici ?", a: "Cette page est publique. Le paiement se fait uniquement après connexion, pour rester propre et sécuritaire." },
      { q: "Je peux commencer gratuit ?", a: "Oui. Le forfait Découverte est gratuit." },
    ],
  },
  en: {
    title: "Choose the plan that fits you",
    subtitle:
      "This page is public and shows your options. Create a free account first, then activate a subscription whenever you’re ready — from your account.",
    billingNote: "Secure billing via Stripe (after login only) · Cancel or change anytime",
    usdNote: "Prices are in USD.",
    lockNote: "To activate a plan, log in or create an account.",
    ctaSignup: "Create my free account",
    ctaLogin: "Log in",
    plans: [
      { name: "Discovery", price: "Free", tagline: "A gentle start.", features: ["1 AmorIAI", "Text (basic)", "FR / EN / ES"] },
      {
        name: "AmorIAI Chat",
        price: "$9.99 USD / month",
        tagline: "Text your AmorIAI daily.",
        features: ["Up to 2 AmorIAI", "Regular conversations", "Long-term memory", "FR / EN / ES"],
      },
      {
        name: "AmorIAI Plus",
        price: "$19.99 USD / month",
        tagline: "Text + voice, more real presence.",
        features: ["Up to 10 AmorIAI", "AI voice", "Deeper conversations", "Light priority"],
        badge: "popular",
      },
      {
        name: "AmorIAI Unlimited",
        price: "$39.99 USD / month",
        tagline: "Maximum experience (voice + extras).",
        features: ["Up to 30 AmorIAI", "Text + voice", "Smooth, uninterrupted use", "Max priority"],
        badge: "value",
      },
    ],
    faqTitle: "FAQ",
    faqs: [
      { q: "Can I cancel anytime?", a: "Yes. Cancel or change anytime from your account." },
      { q: "Why no Stripe here?", a: "This page is public. Checkout happens after login only." },
      { q: "Can I start for free?", a: "Yes — Discovery is free." },
    ],
  },
  es: {
    title: "Elige el plan ideal",
    subtitle:
      "Esta página es pública y muestra las opciones. Crea una cuenta gratis y activa la suscripción cuando quieras — desde tu cuenta.",
    billingNote: "Pago seguro con Stripe (solo después de iniciar sesión) · Cancela o cambia cuando quieras",
    usdNote: "Precios en USD.",
    lockNote: "Para activar un plan, inicia sesión o crea una cuenta.",
    ctaSignup: "Crear mi cuenta gratis",
    ctaLogin: "Iniciar sesión",
    plans: [
      { name: "Descubrimiento", price: "Gratis", tagline: "Empezar con calma.", features: ["1 AmorIAI", "Texto (básico)", "FR / EN / ES"] },
      {
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mes",
        tagline: "Escribe cada día.",
        features: ["Hasta 2 AmorIAI", "Conversaciones regulares", "Memoria a largo plazo", "FR / EN / ES"],
      },
      {
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mes",
        tagline: "Texto + voz, más presencia real.",
        features: ["Hasta 10 AmorIAI", "Voz IA", "Conversaciones más profundas", "Prioridad ligera"],
        badge: "popular",
      },
      {
        name: "AmorIAI Ilimitado",
        price: "39,99 $ USD / mes",
        tagline: "Experiencia máxima (voz + extras).",
        features: ["Hasta 30 AmorIAI", "Texto + voz", "Uso fluido y sin interrupciones", "Prioridad máxima"],
        badge: "value",
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Puedo cancelar cuando quiera?", a: "Sí. Cancela o cambia cuando quieras desde tu cuenta." },
      { q: "¿Por qué no hay Stripe aquí?", a: "Esta página es pública. El pago se hace solo después de iniciar sesión." },
      { q: "¿Puedo empezar gratis?", a: "Sí — Descubrimiento es gratis." },
    ],
  },
};

function BadgeLabel({ lang, badge }: { lang: Locale; badge: "popular" | "value" }) {
  const label =
    badge === "popular"
      ? lang === "fr"
        ? "POPULAIRE"
        : lang === "en"
          ? "POPULAR"
          : "POPULAR"
      : lang === "fr"
        ? "VALEUR"
        : lang === "en"
          ? "BEST VALUE"
          : "MEJOR VALOR";

  const cls =
    badge === "popular"
      ? "bg-gradient-to-tr from-fuchsia-500 to-rose-400 text-white shadow-pink-500/30"
      : "bg-gradient-to-tr from-emerald-400 to-lime-300 text-emerald-950 shadow-emerald-400/20";

  return (
    <div className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide shadow ${cls}`}>
      {label}
    </div>
  );
}

export default function PricingPage({ searchParams }: PageProps) {
  const lang = getLocale(searchParams);
  const ui = LAYOUT_STRINGS[lang];
  const t = COPY[lang];

  const withLang = (path: string) => ({ pathname: path, query: { lang } });

  return (
    <main
      className="min-h-screen pb-12 text-slate-100"
      style={{ background: "radial-gradient(circle at top left,#111827 0,#020617 55%,#000 100%)" }}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIAI.app"
              className="h-9 w-auto select-none"
              draggable={false}
            />
            <div className="flex flex-col">
              <div className="text-sm font-semibold">AmorIAI.app</div>
              <div className="text-[0.72rem] text-slate-400">{ui.brandTagline}</div>
            </div>
          </div>

          <nav className="hidden items-center gap-5 text-xs text-slate-300 md:flex">
            <Link
              href={withLang("/")}
              className="border-b border-transparent pb-0.5 transition hover:border-slate-400 hover:text-slate-50"
            >
              {ui.nav.home}
            </Link>
            <Link
              href={withLang("/features")}
              className="border-b border-transparent pb-0.5 transition hover:border-slate-400 hover:text-slate-50"
            >
              {ui.nav.features}
            </Link>
            <span className="border-b border-slate-100/90 pb-0.5 text-slate-50">{ui.nav.pricing}</span>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-full border border-slate-600/70 bg-slate-900/80 px-0.5 py-0.5 text-[0.7rem]">
              {(["fr", "en", "es"] as Locale[]).map((code) => (
                <Link
                  key={code}
                  href={{ pathname: "/pricing", query: { lang: code } }}
                  className={`rounded-full px-2 py-0.5 transition ${
                    lang === code ? "bg-slate-800 text-slate-50" : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {code.toUpperCase()}
                </Link>
              ))}
            </div>

            <Link
              href={withLang("/login")}
              className="hidden items-center justify-center rounded-full border border-slate-500/70 px-3 py-1 text-[0.7rem] text-slate-100 transition hover:bg-slate-900/80 md:inline-flex"
            >
              {ui.navLogin}
            </Link>

            <Link
              href={withLang("/signup")}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-400 px-3.5 py-1.5 text-[0.78rem] font-medium text-white shadow-lg shadow-pink-500/40 transition hover:brightness-110"
            >
              {ui.navSignup}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-4 pb-6 pt-8 text-center">
        <h1 className="text-3xl font-bold md:text-[2.2rem]">{t.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 md:text-[0.95rem]">{t.subtitle}</p>

        <div className="mx-auto mt-4 inline-flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-slate-700/60 bg-slate-950/50 px-3 py-1 text-[0.78rem] text-slate-300">
            {t.usdNote}
          </span>
          <span className="rounded-full border border-slate-700/60 bg-slate-950/50 px-3 py-1 text-[0.78rem] text-slate-300">
            {t.billingNote}
          </span>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Link
            href={withLang("/signup")}
            className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-400 px-6 py-3 text-[0.98rem] font-medium text-white shadow-lg shadow-rose-400/40 transition hover:brightness-110"
          >
            {t.ctaSignup}
          </Link>
          <Link
            href={withLang("/login")}
            className="inline-flex w-full max-w-sm items-center justify-center rounded-full border border-slate-500/70 bg-transparent px-6 py-3 text-[0.92rem] font-medium text-slate-100 transition hover:bg-slate-900/70"
          >
            {t.ctaLogin}
          </Link>
          <p className="mt-1 text-[0.8rem] text-slate-400">{t.lockNote}</p>
        </div>
      </section>

      {/* PLANS */}
      <section className="mx-auto max-w-5xl px-4 pb-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.plans.map((p) => (
            <article
              key={p.name}
              className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-950/80 via-slate-950 to-black/90 p-5 shadow-lg shadow-black/30"
            >
              {p.badge && <BadgeLabel lang={lang} badge={p.badge} />}

              <h3 className="text-sm font-semibold">{p.name}</h3>
              <div className="mt-2 text-xl font-semibold">{p.price}</div>
              <p className="mt-1 text-[0.82rem] text-slate-300">{p.tagline}</p>

              <ul className="mt-4 space-y-2 text-[0.82rem] text-slate-300">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-0.5 text-rose-400">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* IMPORTANT: pas de CTA Stripe ici */}
              <div className="mt-5">
                <Link
                  href={withLang("/signup")}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-800/60 px-4 py-2.5 text-[0.85rem] font-medium text-slate-100 transition hover:bg-slate-800/80"
                >
                  {lang === "fr" ? "Créer un compte" : lang === "en" ? "Create account" : "Crear cuenta"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 pb-10">
        <h2 className="text-lg font-semibold md:text-xl">{t.faqTitle}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {t.faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-4">
              <div className="text-sm font-semibold">{f.q}</div>
              <p className="mt-2 text-[0.82rem] text-slate-300">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-5xl px-4 pb-4 text-center text-[0.78rem] text-slate-400">
        <div className="mb-2">{ui.footerCopy}</div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={withLang("/legal")} className="hover:text-slate-100">
            {ui.footerLinks.legal}
          </Link>
          <Link href={withLang("/legal/privacy")} className="hover:text-slate-100">
            {ui.footerLinks.privacy}
          </Link>
          <Link href={withLang("/legal/terms")} className="hover:text-slate-100">
            {ui.footerLinks.terms}
          </Link>
          <Link href={withLang("/contact")} className="hover:text-slate-100">
            {ui.footerLinks.contact}
          </Link>
          <Link href={withLang("/about")} className="hover:text-slate-100">
            {ui.footerLinks.about}
          </Link>
        </div>
      </footer>
    </main>
  );
            }
