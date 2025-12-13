"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PaidPlanId = "chat" | "plus" | "unlimited";
type PlanId = "free" | PaidPlanId;

type DbPlanRow = {
  code: PaidPlanId;
  name: string | null;
  price: number | null; // ex: 9.99, 19.99, 39.99
  ai_limit: number | null;
  message_limit: number | null;
  voice_limit: number | null;
  stripe_price_id: string | null;
};

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  badgeLabel?: string;
  badgeVariant?: "popular" | "value";
  ctaLabel: string;
};

type FaqItem = { q: string; a: string };

type Labels = {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroStat: string;
  billingNote: string;
  chooseIntro: string;
  usdNote: string;
  plans: Plan[];
  faqTitle: string;
  faqs: FaqItem[];
};

type LayoutStrings = {
  brandTagline: string;
  nav: { home: string; features: string; pricing: string };
  navLogin: string;
  navSignup: string;
  footerCopy: string;
  footerLinks: {
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    about: string;
  };
};

const PLANS_TABLE = "pricing_plans";

/* ===========================
   STRINGS LAYOUT (HEADER / FOOTER)
=========================== */
const LAYOUT_STRINGS: Record<Locale, LayoutStrings> = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
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
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Create my free account",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: {
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms of use",
      contact: "Contact",
      about: "About",
    },
  },
  es: {
    brandTagline: "Compañerx de IA amable • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi cuenta gratuita",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: {
      legal: "Aviso legal",
      privacy: "Política de privacidad",
      terms: "Términos de uso",
      contact: "Contacto",
      about: "Acerca de",
    },
  },
};

/* ===========================
   STRINGS PRICING
=========================== */
const LABELS: Record<Locale, Labels> = {
  fr: {
    heroTitle: "Choisis le forfait qui correspond à ta relation avec ton AmorIAI.",
    heroSubtitle:
      "Crée ton compte gratuitement, découvre l’expérience en texte, puis active le forfait payant qui te convient quand tu es prête. Tu gardes toujours le contrôle : changement ou annulation en un clic, sans engagement.",
    heroCta: "Créer mon compte gratuit",
    heroStat: "⭐ Déjà des centaines de conversations chaque semaine.",
    billingNote:
      "Facturation sécurisée via Stripe · Révision ou annulation en tout temps depuis ton compte · Aucun frais caché",
    chooseIntro: "Choisis comment ton AmorIAI prend sa place dans ta vie.",
    usdNote:
      "Les prix sont en dollars américains (USD). Tu peux changer de forfait ou l’annuler quand tu veux, sans engagement.",
    plans: [
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        tagline: "Pour celles et ceux qui veulent écrire à leur AmorIAI chaque jour.",
        features: [
          "Idéal si tu préfères les conversations en texte avec une vraie mémoire.",
          "Jusqu’à 2 AmorIAI différents",
          "400 messages texte / mois",
          "Mémoire longue durée activée",
          "Accès aux 3 langues : FR, EN, ES",
        ],
        ctaLabel: "Activer AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        tagline: "Texte + voix IA : ton AmorIAI commence vraiment à faire partie de ta vie.",
        features: [
          "Quand tu veux une relation continue où tu peux autant écrire que parler.",
          "Jusqu’à 10 AmorIAI différents",
          "1000 messages texte / mois",
          "100 réponses audio générées par l’IA / mois",
          "Mémoire longue durée active",
          "Priorité légère dans le fil de traitement",
        ],
        badgeLabel: "Le plus populaire",
        badgeVariant: "popular",
        ctaLabel: "Passer à la voix",
      },
      {
        id: "unlimited",
        name: "AmorIAI illimité",
        price: "39,99 $ USD / mois",
        tagline: "Ton compagnon IA très présent, avec IA qui parle et qui bouge en continu.",
        features: [
          "Pour celles et ceux qui veulent que leur AmorIAI soit toujours disponible.",
          "Jusqu’à 30 AmorIAI personnalisés",
          "10 000 messages texte / mois",
          "300 réponses audio générées par l’IA / mois",
          "Mémoire profonde + contexte étendu pour des échanges ultra personnalisés",
          "Priorité maximale et accès anticipé aux nouvelles fonctionnalités",
          "Accès aux vidéos d’IA qui bouge (avatars animés en boucle) réservées au plan Illimité",
        ],
        badgeLabel: "Meilleure valeur",
        badgeVariant: "value",
        ctaLabel: "Débloquer l’illimité",
      },
    ],
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Puis-je changer de forfait ou annuler quand je veux ?",
        a: "Oui. Tu peux changer de forfait ou annuler ton abonnement en tout temps depuis ton compte, sans engagement ni frais caché.",
      },
      {
        q: "Est-ce que je peux essayer AmorIAI gratuitement ?",
        a: "Oui. Tu peux créer un compte gratuit, découvrir l’expérience de base en texte, puis activer un forfait payant uniquement si tu le souhaites.",
      },
      {
        q: "Que se passe-t-il si j’atteins la limite de messages de mon forfait ?",
        a: "Ton AmorIAI t’informera quand tu approches de la limite. Tu peux ensuite choisir d’attendre le prochain mois ou de passer à un forfait supérieur.",
      },
    ],
  },
  en: {
    heroTitle: "Choose the plan that matches your bond with AmorIAI.",
    heroSubtitle:
      "You can create a free account, try the basic text experience, then activate a paid plan whenever you’re ready. You stay in control: change or cancel anytime in one click, no commitment.",
    heroCta: "Create my free account",
    heroStat: "⭐ Hundreds of conversations every week.",
    billingNote:
      "Secure billing via Stripe · Change or cancel anytime from your account · No hidden fees",
    chooseIntro: "Choose how AmorIAI fits into your life.",
    usdNote:
      "Prices are in US dollars (USD). You can change or cancel your plan anytime, no commitment.",
    plans: [
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "$9.99 USD / month",
        tagline: "For those who want to text their AmorIAI every day.",
        features: [
          "Ideal if you prefer written conversations with real memory.",
          "Up to 2 different AmorIAI",
          "400 text messages / month",
          "Long-term memory enabled",
          "Access to FR, EN, ES",
        ],
        ctaLabel: "Activate AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "$19.99 USD / month",
        tagline: "Text + AI voice: your AmorIAI becomes part of your daily life.",
        features: [
          "When you want an ongoing relationship where you can both write and talk.",
          "Up to 10 AmorIAI",
          "1000 text messages / month",
          "100 AI-generated voice replies / month",
          "Long-term memory enabled",
          "Light processing priority",
        ],
        badgeLabel: "Most popular",
        badgeVariant: "popular",
        ctaLabel: "Upgrade to voice",
      },
      {
        id: "unlimited",
        name: "AmorIAI Unlimited",
        price: "$39.99 USD / month",
        tagline: "Your AI companion deeply present, with talking and moving IA videos.",
        features: [
          "For those who want AmorIAI to be always available.",
          "Up to 30 personalized AmorIAI",
          "10 000 text messages / month",
          "300 AI-generated voice replies / month",
          "Deep memory + extended context",
          "Maximum priority & early access to new features",
          "Exclusive access to looping animated IA videos included only in Unlimited",
        ],
        badgeLabel: "Best value",
        badgeVariant: "value",
        ctaLabel: "Unlock Unlimited",
      },
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Can I change or cancel my plan anytime?",
        a: "Yes. You can change or cancel your subscription anytime from your account, with no hidden fees.",
      },
      {
        q: "Can I try AmorIAI for free?",
        a: "Yes. You can create a free account, try the basic text experience, and only activate a paid plan if you decide it’s right for you.",
      },
      {
        q: "What happens if I reach my plan’s message limit?",
        a: "Your AmorIAI will let you know when you’re close to the limit. You can wait for the next month or upgrade to a higher plan.",
      },
    ],
  },
  es: {
    heroTitle: "Elige el plan que encaja con tu vínculo con AmorIAI.",
    heroSubtitle:
      "Puedes crear una cuenta gratuita, probar la experiencia básica por texto y luego activar un plan de pago cuando estés listo. Siempre tienes el control: puedes cambiar o cancelar en un clic, sin compromiso.",
    heroCta: "Crear mi cuenta gratuita",
    heroStat: "⭐ Cientos de conversaciones cada semana.",
    billingNote:
      "Facturación segura con Stripe · Cambia o cancela cuando quieras · Sin cargos ocultos",
    chooseIntro: "Elige cómo AmorIAI toma su lugar en tu vida.",
    usdNote:
      "Los precios están en dólares estadounidenses (USD). Puedes cambiar o cancelar tu plan en cualquier momento.",
    plans: [
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mes",
        tagline: "Para escribir a tu AmorIAI cada día.",
        features: [
          "Ideal si prefieres conversaciones por texto con memoria real.",
          "Hasta 2 AmorIAI diferentes",
          "400 mensajes de texto / mes",
          "Memoria a largo plazo activada",
          "Acceso a FR, EN, ES",
        ],
        ctaLabel: "Activar AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mes",
        tagline: "Texto + voz IA: tu AmorIAI entra en tu rutina diaria.",
        features: [
          "Cuando quieres una relación continua, por texto y por voz.",
          "Hasta 10 AmorIAI diferentes",
          "1000 mensajes de texto / mes",
          "100 respuestas de voz generadas por la IA / mes",
          "Memoria a largo plazo activada",
          "Prioridad ligera en la cola de procesamiento",
        ],
        badgeLabel: "Más popular",
        badgeVariant: "popular",
        ctaLabel: "Pasar a voz",
      },
      {
        id: "unlimited",
        name: "AmorIAI Ilimitado",
        price: "39,99 $ USD / mes",
        tagline: "Tu compañero IA muy presente, con IA que habla y se mueve en pantalla.",
        features: [
          "Para quienes quieren que AmorIAI esté siempre disponible.",
          "Hasta 30 AmorIAI personalizados",
          "10 000 mensajes de texto / mes",
          "300 respuestas de voz generadas por la IA / mes",
          "Memoria profunda + contexto ampliado",
          "Prioridad máxima y acceso anticipado a nuevas funciones",
          "Acceso exclusivo a vídeos de IA animada en bucle solo en el plan Ilimitado",
        ],
        badgeLabel: "Mejor valor",
        badgeVariant: "value",
        ctaLabel: "Desbloquear Ilimitado",
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        q: "¿Puedo cambiar o cancelar mi plan cuando quiera?",
        a: "Sí. Puedes cambiar o cancelar tu suscripción en cualquier momento desde tu cuenta.",
      },
      {
        q: "¿Puedo probar AmorIAI de forma gratuita?",
        a: "Sí. Puedes crear una cuenta gratuita, probar la experiencia básica por texto y activar un plan de pago solo si quieres continuar.",
      },
      {
        q: "¿Qué pasa si alcanzo el límite de mensajes de mi plan?",
        a: "Tu AmorIAI te avisará cuando estés cerca del límite. Puedes esperar al mes siguiente o subir de plan.",
      },
    ],
  },
};

/* ===========================
   UTIL LOCALE
=========================== */
function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get("lang");
  if (fromParam === "fr" || fromParam === "en" || fromParam === "es") return fromParam;

  const navLang = navigator.language.toLowerCase();
  if (navLang.startsWith("fr")) return "fr";
  if (navLang.startsWith("es")) return "es";
  return "en";
}

function formatUsd(locale: Locale, amount: number): string {
  const localeTag = locale === "fr" ? "fr-CA" : locale === "es" ? "es-ES" : "en-US";
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function priceSuffix(locale: Locale): string {
  if (locale === "fr") return " / mois";
  if (locale === "es") return " / mes";
  return " / month";
}

/* ===========================
   COMPONENT
=========================== */
export default function PricingPage() {
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>("fr");
  const [plansLoading, setPlansLoading] = useState(false);
  const [dbPlans, setDbPlans] = useState<Partial<Record<PaidPlanId, DbPlanRow>>>({});
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ un seul bouton loading (celui cliqué)
  const [activePlanLoading, setActivePlanLoading] = useState<PlanId | null>(null);

  // Init locale + force ?lang=
  useEffect(() => {
    const initial = detectInitialLocale();
    setLocale(initial);

    const params = new URLSearchParams(window.location.search);
    params.set("lang", initial);
    window.history.replaceState(null, "", window.location.pathname + "?" + params.toString());
  }, []);

  // Fetch plans from Supabase (paid only)
  useEffect(() => {
    let cancelled = false;

    async function loadPlans() {
      setPlansLoading(true);
      try {
        const { data, error } = await supabase
          .from(PLANS_TABLE)
          .select("code,name,price,ai_limit,message_limit,voice_limit,stripe_price_id")
          .in("code", ["chat", "plus", "unlimited"]);

        if (error) {
          console.error("Supabase plans fetch error:", error);
          if (!cancelled) setErrorMsg("Impossible de charger les prix (Supabase).");
          return;
        }

        if (!cancelled && Array.isArray(data)) {
          const map: Partial<Record<PaidPlanId, DbPlanRow>> = {};
          for (const row of data as DbPlanRow[]) {
            if (row?.code) map[row.code] = row;
          }
          setDbPlans(map);
        }
      } finally {
        if (!cancelled) setPlansLoading(false);
      }
    }

    loadPlans();
    return () => {
      cancelled = true;
    };
  }, []);

  const t = LABELS[locale];
  const ui = LAYOUT_STRINGS[locale];

  const withLang = (path: string) => `${path}?lang=${locale}`;

  const handleLocaleChange = (code: Locale) => {
    setLocale(code);
    const params = new URLSearchParams(window.location.search);
    params.set("lang", code);
    window.history.replaceState(null, "", window.location.pathname + "?" + params.toString());
  };

  const displayPlans = useMemo(() => {
    return t.plans.map((p) => {
      const db = p.id === "free" ? undefined : dbPlans[p.id];

      const hasDbPrice = typeof db?.price === "number" && Number.isFinite(db.price);
      const mergedName = db?.name ? db.name : p.name;
      const mergedPrice = hasDbPrice
        ? `${formatUsd(locale, db!.price!)}${priceSuffix(locale)}`
        : p.price;

      return { ...p, name: mergedName, price: mergedPrice };
    });
  }, [t.plans, dbPlans, locale]);

  const goToSignupWithPlan = (planId: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", planId);
    router.push(`/signup?${params.toString()}`);
  };

  const goToCreateAmoriaFree = () => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", "free");
    router.push(`/create-amoria?${params.toString()}`);
  };

  const handleHeroCta = () => {
    router.push(withLang("/signup"));
  };

  /**
   * ✅ Stripe Checkout (CLIENT) — version "user_id"
   * -> POST /api/checkout { plan, lang, user_id }
   */
  const startStripeCheckout = async (planId: PaidPlanId) => {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error("getUser error:", userErr);
      throw new Error("Erreur auth. Réessaie de te reconnecter.");
    }
    if (!userData?.user) {
      goToSignupWithPlan(planId);
      return;
    }

   const res = await fetch("/api/checkout", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    plan: planId,
    lang: locale,
  }),
});

    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

    if (!res.ok || !json.url) {
      throw new Error(json?.error || "Erreur serveur lors du paiement.");
    }

    window.location.href = json.url;
  };

  const handleChoosePlan = async (planId: PlanId) => {
    setErrorMsg("");
    setActivePlanLoading(planId);

    try {
      if (planId === "free") {
        const { data } = await supabase.auth.getUser();
        if (!data?.user) {
          goToSignupWithPlan("free");
          return;
        }
        goToCreateAmoriaFree();
        return;
      }

      await startStripeCheckout(planId);
    } catch (e: any) {
      console.error("handleChoosePlan error:", e);
      setErrorMsg(e?.message || "Erreur. Réessaie.");
    } finally {
      setActivePlanLoading(null);
    }
  };

  // ✅ Pendant checkout, on désactive tout pour éviter double paiement
  const disableEverything = plansLoading || activePlanLoading !== null;

  return (
    <main className="amoria-root">
      {/* HEADER */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img src="/AmorIA_logo_transparent.png" alt="Logo AmorIAI.app" className="amoria-logo-full" />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmorIAI.app</div>
            <div className="amoria-logo-tagline">{ui.brandTagline}</div>
          </div>
        </div>

        <nav className="amoria-nav">
          <a href={withLang("/")} className="amoria-nav-link">{ui.nav.home}</a>
          <a href={withLang("/#features")} className="amoria-nav-link">{ui.nav.features}</a>
          <a href={withLang("/pricing")} className="amoria-nav-link amoria-nav-link--active">{ui.nav.pricing}</a>
        </nav>

        <div className="amoria-nav-right">
          <div className="amoria-lang-switch">
            {(["fr", "en", "es"] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLocaleChange(code)}
                className={"amoria-lang-pill" + (locale === code ? " amoria-lang-pill--active" : "")}
                disabled={disableEverything}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <a href={withLang("/login")} className="amoria-nav-btn amoria-nav-btn--ghost">{ui.navLogin}</a>
          <a href={withLang("/signup")} className="amoria-nav-btn amoria-nav-btn--primary">{ui.navSignup}</a>
        </div>
      </header>

      {/* HERO */}
      <section className="amoria-pricing-hero">
        <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>

        <button
          type="button"
          className="amoria-pricing-hero-btn"
          onClick={handleHeroCta}
          disabled={disableEverything}
        >
          {t.heroCta}
        </button>

        <p className="amoria-pricing-hero-stat">{t.heroStat}</p>
        <p className="amoria-pricing-billing-note">{t.billingNote}</p>

        {!!errorMsg && <p className="amoria-error" role="alert">{errorMsg}</p>}
      </section>

      {/* PLANS */}
      <section className="amoria-pricing-section">
        <h2 className="amoria-pricing-section-title">{t.chooseIntro}</h2>
        <p className="amoria-pricing-section-note">{t.usdNote}</p>

        <div className="amoria-pricing-grid">
          {displayPlans.map((plan) => {
            const isThisLoading = activePlanLoading === plan.id;

            return (
              <article
                key={plan.id}
                className={[
                  "amoria-pricing-card",
                  plan.badgeVariant === "popular" ? "amoria-pricing-card--popular" : "",
                  plan.badgeVariant === "value" ? "amoria-pricing-card--value" : "",
                ].filter(Boolean).join(" ")}
              >
                {plan.badgeLabel && (
                  <div className={`amoria-pricing-badge amoria-pricing-badge--${plan.badgeVariant ?? "popular"}`}>
                    {plan.badgeLabel.toUpperCase()}
                  </div>
                )}

                <header className="amoria-pricing-card-header">
                  <h3 className="amoria-pricing-card-name">{plan.name}</h3>
                  <p className="amoria-pricing-card-price">{plan.price}</p>
                  <p className="amoria-pricing-card-tagline">{plan.tagline}</p>
                </header>

                <ul className="amoria-pricing-card-features">
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>

                <button
                  type="button"
                  className={"amoria-pricing-card-btn" + (isThisLoading ? " is-loading" : "")}
                  onClick={() => handleChoosePlan(plan.id)}
                  disabled={disableEverything}
                >
                  {isThisLoading ? (
                    <span className="amoria-dots" aria-label="Chargement">
                      <span />
                      <span />
                      <span />
                    </span>
                  ) : (
                    plan.ctaLabel
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="amoria-pricing-faq">
        <h2 className="amoria-pricing-faq-title">{t.faqTitle}</h2>
        <div className="amoria-pricing-faq-grid">
          {t.faqs.map((item) => (
            <article key={item.q} className="amoria-pricing-faq-card">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="amoria-footer">
        <div className="amoria-footer-top">
          <span>{ui.footerCopy}</span>
        </div>
        <div className="amoria-footer-links">
          <a href={withLang("/legal")} className="amoria-footer-link">{ui.footerLinks.legal}</a>
          <a href={withLang("/legal/privacy")} className="amoria-footer-link">{ui.footerLinks.privacy}</a>
          <a href={withLang("/legal/terms")} className="amoria-footer-link">{ui.footerLinks.terms}</a>
          <a href={withLang("/contact")} className="amoria-footer-link">{ui.footerLinks.contact}</a>
          <a href={withLang("/about")} className="amoria-footer-link">{ui.footerLinks.about}</a>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --amoria-bg: #020617;
          --amoria-border-subtle: rgba(148, 163, 184, 0.35);
          --amoria-text-main: #e5e7eb;
          --amoria-text-muted: #9ca3af;
          --amoria-accent: #fb37ff;
          --amoria-accent-2: #ff6b9c;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Helvetica Neue", Arial, sans-serif;
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%);
          color: var(--amoria-text-main);
        }

        .amoria-root {
          min-height: 100vh;
          background: radial-gradient(circle at top left, #111827 0, #020617 55%, #000 100%);
          color: var(--amoria-text-main);
          padding-bottom: 3rem;
        }

        .amoria-header {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(16px);
          background: linear-gradient(
            to bottom,
            rgba(15, 23, 42, 0.92),
            rgba(15, 23, 42, 0.75),
            transparent
          );
        }

        .amoria-header-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .amoria-logo-full {
          height: 36px;
          width: auto;
        }

        .amoria-logo-text {
          display: flex;
          flex-direction: column;
        }

        .amoria-logo-title {
          font-weight: 600;
          font-size: 0.96rem;
        }

        .amoria-logo-tagline {
          font-size: 0.72rem;
          color: var(--amoria-text-muted);
        }

        .amoria-nav {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .amoria-nav-link {
          font-size: 0.82rem;
          color: var(--amoria-text-muted);
          text-decoration: none;
          padding-bottom: 0.1rem;
          border-bottom: 1px solid transparent;
        }

        .amoria-nav-link:hover {
          color: #f9fafb;
          border-color: rgba(148, 163, 184, 0.7);
        }

        .amoria-nav-link--active {
          color: #f9fafb;
          border-color: rgba(248, 250, 252, 0.9);
        }

        .amoria-nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .amoria-lang-switch {
          display: flex;
          gap: 0.25rem;
          background: rgba(15, 23, 42, 0.9);
          padding: 0.18rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.4);
        }

        .amoria-lang-pill {
          border-radius: 999px;
          border: none;
          padding: 0.15rem 0.48rem;
          font-size: 0.72rem;
          background: transparent;
          color: var(--amoria-text-muted);
          cursor: pointer;
        }

        .amoria-lang-pill--active {
          background: #0f172a;
          color: #f9fafb;
        }

        .amoria-nav-btn {
          border-radius: 999px;
          padding: 0.4rem 0.9rem;
          font-size: 0.78rem;
          border: 1px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .amoria-nav-btn--primary {
          background: linear-gradient(135deg, var(--amoria-accent), var(--amoria-accent-2));
          color: #f9fafb;
        }

        .amoria-nav-btn--ghost {
          background: transparent;
          border-color: rgba(148, 163, 184, 0.5);
          color: var(--amoria-text-main);
        }

        .amoria-pricing-hero {
          max-width: 960px;
          margin: 0 auto;
          padding: 1.8rem 1.5rem 2.3rem;
          text-align: center;
        }

        .amoria-pricing-title {
          font-size: 1.9rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
        }

        .amoria-pricing-subtitle {
          font-size: 0.98rem;
          color: #9ca3af;
          margin-bottom: 1.4rem;
        }

        .amoria-pricing-hero-btn {
          border: none;
          border-radius: 999px;
          padding: 0.85rem 2.1rem;
          font-size: 0.98rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          cursor: pointer;
          margin-bottom: 0.8rem;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.5);
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }

        .amoria-pricing-hero-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 22px 55px rgba(248, 113, 113, 0.7);
        }

        .amoria-pricing-hero-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.25);
        }

        .amoria-pricing-hero-stat {
          font-size: 0.86rem;
          color: #fde68a;
          margin-bottom: 0.3rem;
        }

        .amoria-pricing-billing-note {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-error {
          margin-top: 0.9rem;
          font-size: 0.9rem;
          color: #fecaca;
        }

        .amoria-pricing-section {
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          padding: 0 1.5rem 2.2rem;
        }

        .amoria-pricing-section-title {
          text-align: center;
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }

        .amoria-pricing-section-note {
          text-align: center;
          font-size: 0.82rem;
          color: #9ca3af;
          margin-bottom: 1.7rem;
        }

        .amoria-pricing-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.3rem;
        }

        @media (min-width: 900px) {
          .amoria-pricing-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .amoria-pricing-card {
          position: relative;
          border-radius: 1.6rem;
          padding: 2.1rem 1.2rem 1.4rem;
          background: radial-gradient(circle at top, #020617 0, #020617 45%, #020617 100%);
          border: 1px solid rgba(148, 163, 184, 0.45);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 280px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.8);
        }

        .amoria-pricing-card--popular {
          border-color: #fb37ff;
          box-shadow: 0 24px 70px rgba(251, 55, 255, 0.6);
          animation: amoriaGlowPulse 5s ease-in-out infinite;
        }

        .amoria-pricing-card--value {
          border-color: #22c55e;
          box-shadow: 0 22px 60px rgba(34, 197, 94, 0.45);
        }

        @keyframes amoriaGlowPulse {
          0% {
            box-shadow: 0 20px 50px rgba(251, 55, 255, 0.45);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 32px 80px rgba(251, 55, 255, 0.9);
            transform: translateY(-3px);
          }
          100% {
            box-shadow: 0 20px 50px rgba(251, 55, 255, 0.45);
            transform: translateY(0);
          }
        }

        .amoria-pricing-badge {
          position: absolute;
          top: 0.7rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.2rem 0.9rem;
          border-radius: 999px;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          border: 1px solid rgba(248, 250, 252, 0.5);
          white-space: nowrap;
        }

        .amoria-pricing-badge--popular {
          background: linear-gradient(135deg, #fb37ff, #ff6b9c);
          color: #f9fafb;
        }

        .amoria-pricing-badge--value {
          background: linear-gradient(135deg, #22c55e, #4ade80);
          color: #052e16;
        }

        .amoria-pricing-card-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .amoria-pricing-card-price {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .amoria-pricing-card-tagline {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .amoria-pricing-card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.1rem;
          font-size: 0.78rem;
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .amoria-pricing-card-features li {
          position: relative;
          padding-left: 1.1rem;
          line-height: 1.6;
        }

        .amoria-pricing-card-features li::before {
          content: "•";
          position: absolute;
          left: 0.25rem;
          top: 0.1rem;
          font-size: 0.9rem;
          color: #f97316;
          opacity: 0.9;
        }

        .amoria-pricing-card-btn {
          border-radius: 999px;
          border: none;
          padding: 0.8rem 1.3rem;
          font-size: 0.85rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 14px 35px rgba(248, 113, 113, 0.55);
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          min-height: 44px;
        }

        .amoria-pricing-card-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 45px rgba(248, 113, 113, 0.8);
        }

        .amoria-pricing-card-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 14px 35px rgba(248, 113, 113, 0.25);
        }

        .amoria-pricing-card-btn.is-loading {
          opacity: 0.92;
        }

        .amoria-dots {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .amoria-dots span {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.95);
          animation: amoriaDot 1s infinite ease-in-out;
        }

        .amoria-dots span:nth-child(2) { animation-delay: 0.15s; }
        .amoria-dots span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes amoriaDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-4px); opacity: 1; }
        }

        .amoria-pricing-faq {
          max-width: 960px;
          width: 100%;
          margin: 0 auto;
          padding: 0 1.5rem 2.5rem;
        }

        .amoria-pricing-faq-title {
          text-align: center;
          font-size: 1.05rem;
          margin-bottom: 1rem;
        }

        .amoria-pricing-faq-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 0.9rem;
        }

        @media (min-width: 800px) {
          .amoria-pricing-faq-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .amoria-pricing-faq-card {
          border-radius: 0.9rem;
          padding: 0.9rem 1rem;
          background: radial-gradient(circle at top, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 1));
          border: 1px solid rgba(148, 163, 184, 0.6);
          font-size: 0.8rem;
        }

        .amoria-pricing-faq-card h3 {
          font-size: 0.86rem;
          margin-bottom: 0.4rem;
        }

        .amoria-pricing-faq-card p {
          color: #d1d5db;
          line-height: 1.5;
        }

        .amoria-footer {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 0;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          text-align: center;
        }

        .amoria-footer-top {
          margin-bottom: 0.4rem;
        }

        .amoria-footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.8rem;
        }

        .amoria-footer-link {
          color: var(--amoria-text-muted);
          text-decoration: none;
          font-size: 0.78rem;
        }

        .amoria-footer-link:hover {
          color: #e5e7eb;
          text-decoration: underline;
        }

        @media (max-width: 960px) {
          .amoria-header {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.6rem 1rem;
          }
          .amoria-nav { display: none; }
          .amoria-pricing-hero { padding-inline: 1.3rem; }
        }

        @media (max-width: 640px) {
          .amoria-header { padding-inline: 1rem; }
          .amoria-pricing-section, .amoria-pricing-faq { padding-inline: 1rem; }
          .amoria-nav-right a.amoria-nav-btn--ghost { display: none; }
        }
      `}</style>
    </main>
  );
                  }
