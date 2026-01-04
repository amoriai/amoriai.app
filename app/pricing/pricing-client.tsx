
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Locale = "fr" | "en" | "es";
type PaidPlanId = "chat" | "plus" | "unlimited";
type PlanId = "free" | PaidPlanId;

type DbPlanRow = {
  code: PaidPlanId;
  name: string | null;
  price: number | null; // USD
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
  lockNote: string;
  lockCta: string;
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
   STRINGS LAYOUT
=========================== */
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
    footerLinks: {
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms of use",
      contact: "Contact",
      about: "About",
    },
  },
  es: {
    brandTagline: "Compañerx AmorIAI amable • FR / EN / ES",
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
   ✅ Version "3 plans" = chat / plus / unlimited
   ✅ AUCUN quota visible
=========================== */
const LABELS: Record<Locale, Labels> = {
  fr: {
    heroTitle: "Choisis le forfait qui correspond à ton rythme avec ton AmorIAI.",
    heroSubtitle:
      "Crée ton compte gratuitement, puis active un forfait quand tu es prête. Tu peux changer ou annuler en tout temps depuis ton compte, sans engagement.",
    heroCta: "Créer mon compte gratuit",
    heroStat: "⭐ Une communauté qui grandit chaque semaine.",
    billingNote:
      "Facturation sécurisée via Stripe · Changement ou annulation en tout temps · Aucun frais caché",
    chooseIntro: "3 forfaits simples, selon ton usage.",
    usdNote: "Les prix sont en dollars américains (USD). L’activation se fait après connexion.",
    lockNote: "Connecte-toi ou crée un compte pour activer un forfait.",
    lockCta: "Créer mon compte gratuit",
    plans: [
      {
        id: "chat",
        name: "AmorIAI Chat",
        price: "9,99 $ USD / mois",
        tagline: "Pour écrire à ton AmorIAI chaque jour.",
        features: ["Jusqu’à 2 AmorIAI différents", "Conversations régulières", "Mémoire longue durée", "FR / EN / ES"],
        ctaLabel: "Activer AmorIAI Chat",
      },
      {
        id: "plus",
        name: "AmorIAI Plus",
        price: "19,99 $ USD / mois",
        tagline: "Texte + voix : une présence plus réelle.",
        features: ["Jusqu’à 10 AmorIAI différents", "Voix IA", "Conversations approfondies", "Mémoire longue durée", "Priorité légère"],
        badgeLabel: "Le plus populaire",
        badgeVariant: "popular",
        ctaLabel: "Passer à la voix",
      },
      {
        id: "unlimited",
        name: "AmorIAI Illimité",
        price: "39,99 $ USD / mois",
        tagline: "L’expérience maximale (voix + extras).",
        features: [
          "Jusqu’à 30 AmorIAI personnalisés",
          "Texte + voix",
          "Utilisation fluide et sans interruption",
          "Mémoire profonde + contexte étendu",
          "Priorité maximale et accès anticipé",
          "Avatars animés (réservé au plan Illimité)",
        ],
        badgeLabel: "Meilleure valeur",
        badgeVariant: "value",
        ctaLabel: "Débloquer l’illimité",
      },
    ],
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "Puis-je changer de forfait ou annuler quand je veux ?", a: "Oui. Tu peux changer ou annuler à tout moment depuis ton compte, sans engagement." },
      { q: "Pourquoi je ne vois pas Stripe ici ?", a: "Le paiement se fait après connexion, pour rester sécuritaire et propre." },
      { q: "Je peux commencer gratuit ?", a: "Oui. Crée ton compte gratuitement, puis active un forfait si tu le souhaites." },
    ],
  },
  en: {
    heroTitle: "Choose the plan that matches your pace with AmorIAI.",
    heroSubtitle:
      "Create a free account, then activate a plan whenever you’re ready. Change or cancel anytime from your account, no commitment.",
    heroCta: "Create my free account",
    heroStat: "⭐ A community that grows every week.",
    billingNote: "Secure billing via Stripe · Change or cancel anytime · No hidden fees",
    chooseIntro: "3 simple plans, based on your usage.",
    usdNote: "Prices are in USD. Activation happens after login.",
    lockNote: "Log in or create an account to activate a plan.",
    lockCta: "Create my free account",
    plans: [
      { id: "chat", name: "AmorIAI Chat", price: "$9.99 USD / month", tagline: "Text your AmorIAI daily.", features: ["Up to 2 AmorIAI", "Regular conversations", "Long-term memory", "FR / EN / ES"], ctaLabel: "Activate AmorIAI Chat" },
      { id: "plus", name: "AmorIAI Plus", price: "$19.99 USD / month", tagline: "Text + voice: more real presence.", features: ["Up to 10 AmorIAI", "AI voice", "Deeper conversations", "Long-term memory", "Light priority"], badgeLabel: "Most popular", badgeVariant: "popular", ctaLabel: "Upgrade to voice" },
      {
        id: "unlimited",
        name: "AmorIAI Unlimited",
        price: "$39.99 USD / month",
        tagline: "Maximum experience (voice + extras).",
        features: ["Up to 30 personalized AmorIAI", "Text + voice", "Smooth, uninterrupted use", "Deep memory + extended context", "Max priority & early access", "Animated avatars (Unlimited only)"],
        badgeLabel: "Best value",
        badgeVariant: "value",
        ctaLabel: "Unlock Unlimited",
      },
    ],
    faqTitle: "FAQ",
    faqs: [
      { q: "Can I cancel anytime?", a: "Yes. Change or cancel anytime from your account." },
      { q: "Why no Stripe here?", a: "Checkout happens after login for security and cleanliness." },
      { q: "Can I start for free?", a: "Yes. Create your free account first, then activate a plan if you want." },
    ],
  },
  es: {
    heroTitle: "Elige el plan que encaja con tu ritmo con AmorIAI.",
    heroSubtitle:
      "Crea una cuenta gratuita y activa un plan cuando quieras. Cambia o cancela en cualquier momento desde tu cuenta, sin compromiso.",
    heroCta: "Crear mi cuenta gratuita",
    heroStat: "⭐ Una comunidad que crece cada semana.",
    billingNote: "Pago seguro con Stripe · Cambia o cancela cuando quieras · Sin cargos ocultos",
    chooseIntro: "3 planes simples, según tu uso.",
    usdNote: "Precios en USD. La activación es después de iniciar sesión.",
    lockNote: "Inicia sesión o crea una cuenta para activar un plan.",
    lockCta: "Crear mi cuenta gratis",
    plans: [
      { id: "chat", name: "AmorIAI Chat", price: "9,99 $ USD / mes", tagline: "Escribe cada día.", features: ["Hasta 2 AmorIAI", "Conversaciones regulares", "Memoria a largo plazo", "FR / EN / ES"], ctaLabel: "Activar AmorIAI Chat" },
      { id: "plus", name: "AmorIAI Plus", price: "19,99 $ USD / mes", tagline: "Texto + voz: más presencia real.", features: ["Hasta 10 AmorIAI", "Voz IA", "Conversaciones más profundas", "Memoria a largo plazo", "Prioridad ligera"], badgeLabel: "Más popular", badgeVariant: "popular", ctaLabel: "Pasar a voz" },
      {
        id: "unlimited",
        name: "AmorIAI Ilimitado",
        price: "39,99 $ USD / mes",
        tagline: "Experiencia máxima (voz + extras).",
        features: ["Hasta 30 AmorIAI personalizados", "Texto + voz", "Uso fluido y sin interrupciones", "Memoria profunda + contexto ampliado", "Prioridad máxima y acceso anticipado", "Avatares animados (solo Ilimitado)"],
        badgeLabel: "Mejor valor",
        badgeVariant: "value",
        ctaLabel: "Desbloquear Ilimitado",
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Puedo cancelar cuando quiera?", a: "Sí. Cambia o cancela cuando quieras desde tu cuenta." },
      { q: "¿Por qué no hay Stripe aquí?", a: "El pago se hace después de iniciar sesión por seguridad." },
      { q: "¿Puedo empezar gratis?", a: "Sí. Primero crea tu cuenta gratis y luego activa un plan si quieres." },
    ],
  },
};

/* ===========================
   UTIL
=========================== */
function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
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
   PAGE
=========================== */
export default function PricingPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const locale = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);

  const ui = LAYOUT_STRINGS[locale];
  const t = LABELS[locale];

  const [plansLoading, setPlansLoading] = useState(false);
  const [dbPlans, setDbPlans] = useState<Partial<Record<PaidPlanId, DbPlanRow>>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [activePlanLoading, setActivePlanLoading] = useState<PaidPlanId | null>(null);

  const disableEverything = activePlanLoading !== null;
  const disablePlanCtas = disableEverything;

  // ✅ Garde lang + from dans tous les liens
  const withLang = (path: string) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    const from = sp.get("from");
    if (from) params.set("from", from);
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  };

  const handleLocaleChange = (code: Locale) => {
    const params = new URLSearchParams();
    params.set("lang", code);
    const from = sp.get("from");
    if (from) params.set("from", from);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  useEffect(() => {
    let cancelled = false;

    async function loadPlans() {
      setPlansLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from(PLANS_TABLE)
        .select("code,name,price,ai_limit,message_limit,voice_limit,stripe_price_id")
        .in("code", ["chat", "plus", "unlimited"]);

      if (error) {
        console.error("Supabase plans fetch error:", error);
        if (!cancelled) {
          setErrorMsg(locale === "fr" ? "Impossible de charger les prix (Supabase)." : "Unable to load pricing (Supabase).");
          setPlansLoading(false);
        }
        return;
      }

      if (!cancelled && Array.isArray(data)) {
        const map: Partial<Record<PaidPlanId, DbPlanRow>> = {};
        for (const row of data as DbPlanRow[]) {
          if (row?.code) map[row.code] = row;
        }
        setDbPlans(map);
      }

      if (!cancelled) setPlansLoading(false);
    }

    loadPlans();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  // ✅ 3 plans payants, avec prix DB si dispo, sans afficher les quotas
  const displayPaidPlans = useMemo(() => {
    return t.plans.map((p) => {
      const db = dbPlans[p.id as PaidPlanId];
      const hasDbPrice = typeof db?.price === "number" && Number.isFinite(db.price);

      const mergedName = db?.name ? db.name : p.name;
      const mergedPrice = hasDbPrice ? `${formatUsd(locale, db!.price!)}${priceSuffix(locale)}` : p.price;

      return { ...p, name: mergedName, price: mergedPrice };
    });
  }, [t.plans, dbPlans, locale]);

  const goToSignupWithPlan = (planId: PlanId) => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("plan", planId);
    router.push(`/signup?${params.toString()}`);
  };

  const startStripeCheckout = async (planId: PaidPlanId) => {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error("getUser error:", userErr);
      throw new Error(locale === "fr" ? "Erreur auth. Réessaie de te reconnecter." : "Auth error. Please log in again.");
    }

    if (!userData?.user) {
      goToSignupWithPlan(planId);
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planId, lang: locale, user_id: userData.user.id }),
    });

    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };

    if (!res.ok || !json.url) {
      throw new Error(json?.error || (locale === "fr" ? "Erreur serveur lors du paiement." : "Server error during checkout."));
    }

    window.location.href = json.url;
  };

  const handleChoosePaidPlan = async (planId: PaidPlanId) => {
    setErrorMsg("");
    setActivePlanLoading(planId);

    try {
      await startStripeCheckout(planId);
    } catch (e: any) {
      console.error("handleChoosePaidPlan error:", e);
      setErrorMsg(e?.message || (locale === "fr" ? "Erreur. Réessaie." : "Error. Try again."));
    } finally {
      setActivePlanLoading(null);
    }
  };

  return (
    <main className="amoria-root">
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img src="/AmorIA_logo_transparent.png" alt="Logo AmorIAI.app" className="amoria-logo-full" draggable={false} />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmorIAI.app</div>
            <div className="amoria-logo-tagline">{ui.brandTagline}</div>
          </div>
        </div>

        <nav className="amoria-nav" aria-label="Primary">
          <Link href={withLang("/")} className="amoria-nav-link">
            {ui.nav.home}
          </Link>
          <Link href={withLang("/#features")} className="amoria-nav-link">
            {ui.nav.features}
          </Link>
          <Link href={withLang("/pricing")} className="amoria-nav-link amoria-nav-link--active">
            {ui.nav.pricing}
          </Link>
        </nav>

        <div className="amoria-nav-right">
          <div className="amoria-lang-switch" aria-label="Language">
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

          <Link href={withLang("/login")} className="amoria-nav-btn amoria-nav-btn--ghost">
            {ui.navLogin}
          </Link>
          <Link href={withLang("/signup")} className="amoria-nav-btn amoria-nav-btn--primary">
            {ui.navSignup}
          </Link>
        </div>
      </header>

      <section className="amoria-pricing-hero">
        <h1 className="amoria-pricing-title">{t.heroTitle}</h1>
        <p className="amoria-pricing-subtitle">{t.heroSubtitle}</p>

        <Link href={withLang("/signup")} className="amoria-pricing-hero-btn" aria-disabled={disableEverything}>
          {t.heroCta}
        </Link>

        <p className="amoria-pricing-hero-stat">{t.heroStat}</p>
        <p className="amoria-pricing-billing-note">{t.billingNote}</p>

        {plansLoading && (
          <p className="amoria-pricing-billing-note" style={{ marginTop: "0.6rem" }}>
            …
          </p>
        )}

        {!!errorMsg && (
          <p className="amoria-error" role="alert">
            {errorMsg}
          </p>
        )}
      </section>

      <section className="amoria-pricing-section">
        <h2 className="amoria-pricing-section-title">{t.chooseIntro}</h2>
        <p className="amoria-pricing-section-note">{t.usdNote}</p>

        <div className="amoria-pricing-grid">
          {displayPaidPlans.map((plan) => {
            const isThisLoading = activePlanLoading === (plan.id as PaidPlanId);

            return (
              <article
                key={plan.id}
                className={[
                  "amoria-pricing-card",
                  plan.badgeVariant === "popular" ? "amoria-pricing-card--popular" : "",
                  plan.badgeVariant === "value" ? "amoria-pricing-card--value" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
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
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={"amoria-pricing-card-btn" + (isThisLoading ? " is-loading" : "")}
                  onClick={() => handleChoosePaidPlan(plan.id as PaidPlanId)}
                  disabled={disablePlanCtas}
                  aria-disabled={disablePlanCtas}
                >
                  {isThisLoading ? (
                    <span className="amoria-dots" aria-label="Loading">
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

      <footer className="amoria-footer">
        <div className="amoria-footer-top">
          <span>{ui.footerCopy}</span>
        </div>
        <div className="amoria-footer-links">
          <Link href={withLang("/legal")} className="amoria-footer-link">
            {ui.footerLinks.legal}
          </Link>
          <Link href={withLang("/legal/privacy")} className="amoria-footer-link">
            {ui.footerLinks.privacy}
          </Link>
          <Link href={withLang("/legal/terms")} className="amoria-footer-link">
            {ui.footerLinks.terms}
          </Link>
          <Link href={withLang("/contact")} className="amoria-footer-link">
            {ui.footerLinks.contact}
          </Link>
          <Link href={withLang("/about")} className="amoria-footer-link">
            {ui.footerLinks.about}
          </Link>
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
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%);
          color: var(--amoria-text-main);
        }

        .amoria-root {
          min-height: 100vh;
          background: radial-gradient(circle at top left, #111827 0, #020617 55%, #000 100%);
          color: var(--amoria-text-main);
          padding-bottom: 3rem;
        }

        .amoria-header,
        .amoria-pricing-hero,
        .amoria-pricing-section,
        .amoria-pricing-faq,
        .amoria-footer {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
        }

        .amoria-header {
          padding: 1rem 1.1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(16px);
          background: linear-gradient(to bottom, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.75), transparent);
        }

        .amoria-header-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 220px;
        }

        .amoria-logo-full {
          height: 36px;
          width: auto;
        }

        .amoria-logo-title {
          font-weight: 600;
          font-size: 0.96rem;
          line-height: 1.1;
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
          gap: 0.7rem;
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
          padding: 1.2rem 1rem 1.4rem;
          text-align: center;
        }

        .amoria-pricing-title {
          font-size: clamp(1.35rem, 3.6vw, 1.9rem);
          font-weight: 600;
          margin: 0 auto 0.8rem;
          max-width: 980px;
          line-height: 1.15;
        }

        .amoria-pricing-subtitle {
          font-size: 0.95rem;
          color: #9ca3af;
          margin: 0 auto 1.2rem;
          max-width: 860px;
          line-height: 1.6;
        }

        .amoria-pricing-hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.85rem 2.1rem;
          font-size: 0.98rem;
          background: linear-gradient(135deg, #fb37ff, #ff6b9c, #f97316);
          color: #f9fafb;
          text-decoration: none;
          margin-bottom: 0.75rem;
          box-shadow: 0 16px 40px rgba(248, 113, 113, 0.5);
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }

        .amoria-pricing-hero-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 22px 55px rgba(248, 113, 113, 0.7);
        }

        .amoria-pricing-hero-stat {
          font-size: 0.86rem;
          color: #fde68a;
          margin: 0.2rem 0 0.2rem;
        }

        .amoria-pricing-billing-note {
          font-size: 0.8rem;
          color: #9ca3af;
          margin: 0.1rem 0;
        }

        .amoria-error {
          margin-top: 0.9rem;
          font-size: 0.9rem;
          color: #fecaca;
        }

        .amoria-pricing-section {
          width: 100%;
          padding: 0.5rem 1rem 2.2rem;
        }

        .amoria-pricing-section-title {
          text-align: center;
          font-size: 1.1rem;
          margin: 0 0 0.4rem;
        }

        .amoria-pricing-section-note {
          text-align: center;
          font-size: 0.82rem;
          color: #9ca3af;
          margin: 0 0 1.1rem;
        }

        /* ✅ GRID COMPACT (fini le gros espace) */
        .amoria-pricing-grid {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          align-items: stretch;
        }

        @media (min-width: 820px) {
          .amoria-pricing-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.25rem;
          }
        }

        @media (min-width: 1120px) {
          .amoria-pricing-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.35rem;
          }
        }

        /* ✅ CARD: prend toute la cellule (plus de vide) */
        .amoria-pricing-card {
          position: relative;
          border-radius: 1.6rem;
          padding: 2.1rem 1.25rem 1.35rem;
          background: radial-gradient(circle at top, #020617 0, #020617 45%, #020617 100%);
          border: 1px solid rgba(148, 163, 184, 0.45);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 520px;

          width: 100%;
          max-width: none;
          margin: 0;

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
          margin: 0 0 0.25rem;
        }

        .amoria-pricing-card-price {
          font-size: 1.05rem;
          font-weight: 600;
          margin: 0 0 0.4rem;
        }

        .amoria-pricing-card-tagline {
          font-size: 0.8rem;
          color: #9ca3af;
          margin: 0;
          line-height: 1.6;
        }

        .amoria-pricing-card-features {
          list-style: none;
          padding: 0;
          margin: 1.1rem 0 1.2rem;
          font-size: 0.78rem;
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
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
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease, filter 0.15s ease;
          min-height: 44px;
        }

        .amoria-pricing-card-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 45px rgba(248, 113, 113, 0.8);
        }

        .amoria-pricing-card-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 14px 35px rgba(248, 113, 113, 0.25);
          filter: grayscale(0.2);
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

        .amoria-dots span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .amoria-dots span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes amoriaDot {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          40% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        .amoria-pricing-faq {
          width: 100%;
          padding: 0 1rem 2.5rem;
        }

        .amoria-pricing-faq-title {
          text-align: center;
          font-size: 1.05rem;
          margin: 0 0 1rem;
        }

        .amoria-pricing-faq-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.9rem;
          max-width: 960px;
          margin: 0 auto;
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
          margin: 0 0 0.4rem;
        }

        .amoria-pricing-faq-card p {
          color: #d1d5db;
          line-height: 1.5;
          margin: 0;
        }

        .amoria-footer {
          padding: 1.5rem 1rem 0;
          font-size: 0.78rem;
          color: var(--amoria-text-muted);
          text-align: center;
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

        /* ✅ Mobile */
        @media (max-width: 960px) {
          .amoria-header {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.6rem 1rem;
          }
          .amoria-nav {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .amoria-nav-right a.amoria-nav-btn--ghost {
            display: none;
          }
          .amoria-nav-btn {
            padding: 0.42rem 0.78rem;
          }
          .amoria-header-left {
            min-width: unset;
          }
        }
      `}</style>
    </main>
  );
    }
