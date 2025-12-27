// app/page.tsx
import Link from "next/link";
import styles from "./page.module.css";

type Locale = "fr" | "en" | "es";
type PersonaId = "lyra" | "orion" | "kai" | "maelis";

type Persona = {
  id: PersonaId;
  title: string;
  description: string;
};

type StartChip = { label: string };

type Copy = {
  brandTagline: string;
  nav: { home: string; features: string; pricing: string };
  navLogin: string;
  navSignup: string;

  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimary: string;
  heroSupport: string;
  langNote: string;

  personasTitle: string;
  personasSubtitle: string;
  personas: Persona[];

  personaCta: string;
  personaCtaHint: string;

  usageTitle: string;
  usageBullets: string[];

  // ✅ NEW: replaced "messages" section
  startTitle: string;
  startSubtitle: string;
  startPrivacyNote: string;
  startChips: StartChip[];
  startPrimaryCta: string;
  startSecondaryCta: string;

  pricingTitle: string;
  pricingText: string;
  pricingCta: string;
  pricingCtaHint?: string;
  seePricingLabel: string;

  videoCaption: string;

  footerCopy: string;
  footerLinks: {
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    about: string;
  };
};

const STRINGS: Record<Locale, Copy> = {
  fr: {
    brandTagline: "Un espace calme • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Commencer",

    heroKicker: "BIENVENUE SUR AMORIAI.APP",
    heroTitle: "Un espace calme. Pour parler, respirer… et y voir clair.",
    heroSubtitle:
      "Ici, tu peux déposer ce que tu as en tête, sans pression. AmorIAI répond avec douceur et t’aide à clarifier — à ton rythme.",
    heroPrimary: "Commencer gratuitement",
    heroSupport: "Gratuit pour commencer • Sans engagement • Tu peux arrêter quand tu veux",
    langNote: "Choisis ta langue. Le reste, je m’en occupe.",

    personasTitle: "Choisis ton compagnon IA — et commence à écrire",
    personasSubtitle:
      "Crée ton compte et commence maintenant. Tu peux écrire librement, comme dans un journal… avec une réponse en face. La voix est disponible avec l’abonnement.",
    personas: [
      {
        id: "lyra",
        title: "Lyra — Compagnon IA doux",
        description: "Douce et rassurante. Parfaite pour déposer ce que tu gardes pour toi.",
      },
      {
        id: "orion",
        title: "Orion — Compagnon IA stable",
        description: "Calme et structuré. Pour t’aider à clarifier et décider.",
      },
      {
        id: "kai",
        title: "Kai — Compagnon IA nuancé",
        description: "Subtil et ouvert. Pour parler sans cases, sans pression.",
      },
      {
        id: "maelis",
        title: "Maelis — Compagnon IA mature",
        description: "Bienveillant, réaliste et posé. Comme quelqu’un qui comprend.",
      },
    ],
    personaCta: "Créer mon AmorIAI",
    personaCtaHint: "Exemple de compagnon IA — tu crées le tien après l’inscription.",

    usageTitle: "AmorIAI peut t’aider au quotidien",
    usageBullets: [
      "Parler quand tu n’as personne à qui te confier.",
      "Écrire ce que tu ressens, comme dans un journal intime.",
      "Te déposer le soir pour calmer ton mental.",
      "Clarifier une décision quand tu hésites.",
      "Revenir quand ça déborde, même pour 2 minutes.",
      "Te sentir accompagné, sans pression ni jugement.",
    ],

    // ✅ NEW SECTION (trust + no fake testimonials)
    startTitle: "Commence simplement",
    startSubtitle: "Une phrase, un mot, ou même rien de précis — c’est correct.",
    startPrivacyNote: "Tes messages restent privés. Personne ne les lit.",
    startChips: [
      { label: "J’ai la tête pleine." },
      { label: "J’ai besoin d’y voir clair." },
      { label: "Je veux juste écrire un peu." },
      { label: "Je reviens plus tard si ça déborde." },
      { label: "Je veux une réponse calme." },
      { label: "Je ne sais pas par où commencer." },
    ],
    startPrimaryCta: "Commencer maintenant",
    startSecondaryCta: "Me connecter",

    pricingTitle: "Quand tu te sens prêt",
    pricingText:
      "Commence gratuitement. Si tu en ressens le besoin, tu pourras débloquer plus d’échanges — et la voix pour parler, pas seulement écrire.",
    pricingCta: "Créer un compte pour s’abonner",
    pricingCtaHint: "Crée ton compte gratuit d’abord. Ensuite tu pourras choisir un forfait.",
    seePricingLabel: "Voir les tarifs",

    videoCaption: "Disponible en français, anglais et espagnol.",
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
    brandTagline: "A Calm Space • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Get started",

    heroKicker: "WELCOME TO AMORIAI.APP",
    heroTitle: "A calm space. To talk, breathe… and see things clearly.",
    heroSubtitle:
      "Here, you can put down what’s on your mind without pressure. AmorIAI replies gently and helps you clarify — at your pace.",
    heroPrimary: "Start free",
    heroSupport: "Free to start • No commitment • Cancel anytime",
    langNote: "Choose your language. I’ll take it from there.",

    personasTitle: "Choose your AI companion — and start writing",
    personasSubtitle:
      "Create your account and begin right away. Write freely, like a private journal… with a reply on the other side. Voice is available with the subscription.",
    personas: [
      {
        id: "lyra",
        title: "Lyra — Gentle AI companion",
        description: "Soft and reassuring. Great for putting words on what you keep inside.",
      },
      {
        id: "orion",
        title: "Orion — Steady AI companion",
        description: "Calm and structured. Helps you think clearly and decide.",
      },
      {
        id: "kai",
        title: "Kai — Nuanced AI companion",
        description: "Open-minded and subtle. A space without labels or pressure.",
      },
      {
        id: "maelis",
        title: "Maelis — Mature AI companion",
        description: "Grounded, caring, realistic. Like someone who truly understands.",
      },
    ],
    personaCta: "Create my AmorIAI",
    personaCtaHint: "Example AI companion — you’ll create yours after signup.",

    usageTitle: "How AmorIAI can support you day to day",
    usageBullets: [
      "Talk when you don’t feel like you have someone to confide in.",
      "Write what you feel, like in a private journal.",
      "Unwind at night and quiet your mind.",
      "Think through a decision when you’re hesitating.",
      "Come back when it’s too much, even for two minutes.",
      "Feel supported, with no pressure and no judgement.",
    ],

    startTitle: "Start simple",
    startSubtitle: "One line, one word, or nothing specific — that’s okay.",
    startPrivacyNote: "Your messages stay private. No one reads them.",
    startChips: [
      { label: "My mind feels full." },
      { label: "I need clarity." },
      { label: "I just want to write a bit." },
      { label: "I’ll come back later if it’s too much." },
      { label: "I want a calm reply." },
      { label: "I don’t know where to start." },
    ],
    startPrimaryCta: "Start now",
    startSecondaryCta: "Log in",

    pricingTitle: "When you feel ready",
    pricingText: "Start free. When you need more, unlock more messages — and voice to actually talk, not just type.",
    pricingCta: "Create an account to subscribe",
    pricingCtaHint: "Create your free account first. Then you can pick a plan.",
    seePricingLabel: "See pricing",

    videoCaption: "Available in French, English, and Spanish.",
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
    brandTagline: "Un espacio tranquilo • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Empezar",

    heroKicker: "BIENVENIDx A AMORIAI.APP",
    heroTitle: "Un espacio tranquilo. Para hablar, respirar… y ver claro.",
    heroSubtitle:
      "Aquí puedes soltar lo que tienes en la mente sin presión. AmorIAI responde con suavidad y te ayuda a aclarar — a tu ritmo.",
    heroPrimary: "Empezar gratis",
    heroSupport: "Gratis para empezar • Sin compromiso • Cancela cuando quieras",
    langNote: "Elige tu idioma. Yo me encargo del resto.",

    personasTitle: "Elige tu compañero de IA — y empieza a escribir",
    personasSubtitle:
      "Crea tu cuenta y empieza ahora. Escribe con libertad, como en un diario… con una respuesta al frente. La voz está disponible con suscripción.",
    personas: [
      {
        id: "lyra",
        title: "Lyra — Compañero de IA suave",
        description: "Dulce y tranquilizador. Ideal para decir lo que guardas dentro.",
      },
      {
        id: "orion",
        title: "Orion — Compañero de IA estable",
        description: "Calmo y estructurado. Para pensar con claridad y decidir.",
      },
      {
        id: "kai",
        title: "Kai — Compañero de IA con matices",
        description: "Sutil y abierto. Un espacio sin etiquetas ni presión.",
      },
      {
        id: "maelis",
        title: "Maelis — Compañero de IA maduro",
        description: "Realista, sereno y amable. Como alguien que comprende.",
      },
    ],
    personaCta: "Crear mi AmorIAI",
    personaCtaHint: "Ejemplo de compañero de IA — crearás el tuyo después de registrarte.",

    usageTitle: "Cómo puede acompañarte AmorIAI cada día",
    usageBullets: [
      "Hablar cuando sientes que no tienes con quién desahogarte.",
      "Escribir lo que sientes, como en un diario íntimo.",
      "Relajarte por la noche y calmar la mente.",
      "Pensar una decisión cuando dudas.",
      "Volver cuando te sobrepasa, aunque sea dos minutos.",
      "Sentirte acompañado, sin presión y sin juicios.",
    ],

    startTitle: "Empieza simple",
    startSubtitle: "Una frase, una palabra, o nada específico — está bien.",
    startPrivacyNote: "Tus mensajes son privados. Nadie los lee.",
    startChips: [
      { label: "Tengo la cabeza llena." },
      { label: "Necesito claridad." },
      { label: "Solo quiero escribir un poco." },
      { label: "Vuelvo luego si me supera." },
      { label: "Quiero una respuesta tranquila." },
      { label: "No sé por dónde empezar." },
    ],
    startPrimaryCta: "Empezar ahora",
    startSecondaryCta: "Iniciar sesión",

    pricingTitle: "Cuando te sientas listo",
    pricingText:
      "Empieza gratis. Cuando lo necesites, desbloquea más mensajes — y la voz para hablar de verdad, no solo escribir.",
    pricingCta: "Crear cuenta para suscribirme",
    pricingCtaHint: "Primero crea tu cuenta gratis. Luego podrás elegir un plan.",
    seePricingLabel: "Ver precios",

    videoCaption: "Disponible en francés, inglés y español.",
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

function getLocaleFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }): Locale {
  const raw = searchParams["lang"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "en" || value === "es" || value === "fr") return value;
  return "fr";
}

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function HomePage({ searchParams }: PageProps) {
  const locale = getLocaleFromSearchParams(searchParams);
  const t = STRINGS[locale];

  const heroVideoSrc = `/amoria_${locale}.mp4`;
  const getPersonaVideoSrc = (id: PersonaId) => `/amoria_${id}_${locale}.mp4`;

  const withLang = (path: string) => ({ pathname: path, query: { lang: locale } });
  const withLangPricingPublic = () => ({ pathname: "/pricing-public", query: { lang: locale } });

  const alreadyAccountText =
    locale === "fr" ? "Déjà un compte ?" : locale === "en" ? "Already have an account?" : "¿Ya tienes una cuenta?";
  const loginInlineLabel = locale === "fr" ? "Me connecter" : locale === "en" ? "Log in" : "Iniciar sesión";

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/AmorIA_logo_transparent.png" alt="Logo AmorIAI.app" className={styles.logo} draggable={false} />
            <div className={styles.brandText}>
              <div className={styles.brandName}>AmorIAI.app</div>
              <div className={styles.brandTagline}>{t.brandTagline}</div>
            </div>
          </div>

          <nav className={styles.navDesktop}>
            <a href="#hero" className={styles.navLink}>
              {t.nav.home}
            </a>
            <Link href={withLang("/features")} className={styles.navLink}>
              {t.nav.features}
            </Link>
            <Link href={withLangPricingPublic()} className={styles.navLink}>
              {t.nav.pricing}
            </Link>
          </nav>

          <div className={styles.actions}>
            <div className={styles.langPill}>
              {(["fr", "en", "es"] as Locale[]).map((code) => (
                <Link
                  key={code}
                  href={{ pathname: "/", query: { lang: code } }}
                  className={`${styles.langBtn} ${locale === code ? styles.langActive : ""}`}
                >
                  {code.toUpperCase()}
                </Link>
              ))}
            </div>

            <Link href={withLang("/login")} className={styles.loginBtn}>
              {t.navLogin}
            </Link>

            <Link href={withLang("/signup")} className={styles.signupBtn}>
              {t.navSignup}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.kicker}>{t.heroKicker}</p>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>

          <div className={styles.heroCtas}>
            <Link href={withLang("/signup")} className={styles.primaryCta}>
              {t.heroPrimary}
            </Link>

            <div className={styles.inlineLogin}>
              {alreadyAccountText}{" "}
              <Link href={withLang("/login")} className={styles.inlineLoginLink}>
                {loginInlineLabel}
              </Link>
            </div>
          </div>

          <p className={styles.heroSupport}>{t.heroSupport}</p>
          <p className={styles.langNote}>{t.langNote}</p>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.videoFrame}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video className={styles.video} src={heroVideoSrc} controls playsInline />
          </div>
          <p className={styles.videoCaption}>{t.videoCaption}</p>
        </div>
      </section>

      {/* PERSONAS */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>{t.personasTitle}</h2>
          <p className={styles.p}>{t.personasSubtitle}</p>
        </div>

        <div className={styles.personaGrid}>
          {t.personas.map((persona) => (
            <article key={persona.id} className={styles.card}>
              <div className={styles.cardMedia}>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video className={styles.cardVideo} src={getPersonaVideoSrc(persona.id)} controls playsInline />
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.h3}>{persona.title}</h3>
                <p className={styles.cardText}>{persona.description}</p>

                <Link href={withLang("/signup")} className={styles.cardCta}>
                  {t.personaCta}
                </Link>

                <p className={styles.mutedCenter}>{t.personaCtaHint}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* USAGE */}
      <section className={`${styles.section} ${styles.sectionDivider}`}>
        <h2 className={styles.h2}>{t.usageTitle}</h2>
        <ul className={styles.bullets}>
          {t.usageBullets.map((item, index) => (
            <li key={index} className={styles.bulletItem}>
              <span className={styles.bulletDot}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ✅ NEW: START SIMPLE (replaces fake "people write" quotes) */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>{t.startTitle}</h2>
          <p className={styles.p}>{t.startSubtitle}</p>

          <div className={styles.privacyPill}>
            <span className={styles.privacyDot} />
            <span>{t.startPrivacyNote}</span>
          </div>
        </div>

        <div className={styles.chipsGrid}>
          {t.startChips.map((c, i) => (
            <div key={i} className={styles.chip}>
              <span className={styles.chipStar}>✦</span>
              <span className={styles.chipText}>{c.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.startCtas}>
          <Link href={withLang("/signup")} className={styles.primaryCtaWide}>
            {t.startPrimaryCta}
          </Link>
          <Link href={withLang("/login")} className={styles.secondaryCtaWide}>
            {t.startSecondaryCta}
          </Link>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section id="pricing" className={styles.section}>
        <div className={styles.pricingBox}>
          <h2 className={styles.h2}>{t.pricingTitle}</h2>
          <p className={styles.pCenter}>{t.pricingText}</p>

          <div className={styles.pricingCtas}>
            <Link href={withLang("/signup")} className={styles.primaryCtaWide}>
              {locale === "fr" ? "Créer mon compte gratuit" : locale === "en" ? "Create my free account" : "Crear mi cuenta gratis"}
            </Link>

            <Link href={withLangPricingPublic()} className={styles.secondaryCtaWide}>
              {t.seePricingLabel}
            </Link>

            <div className={styles.mutedCenter}>
              {locale === "fr"
                ? "Gratuit • Sans engagement • Annule quand tu veux"
                : locale === "en"
                ? "Free • No commitment • Cancel anytime"
                : "Gratis • Sin compromiso • Cancela cuando quieras"}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerCopy}>{t.footerCopy}</div>
        <div className={styles.footerLinks}>
          <Link href={withLang("/legal")}>{t.footerLinks.legal}</Link>
          <Link href={withLang("/legal/privacy")}>{t.footerLinks.privacy}</Link>
          <Link href={withLang("/legal/terms")}>{t.footerLinks.terms}</Link>
          <Link href={withLang("/contact")}>{t.footerLinks.contact}</Link>
          <Link href={withLang("/about")}>{t.footerLinks.about}</Link>
        </div>
      </footer>
    </main>
  );
}
