// app/page.tsx
import Link from "next/link";

type Locale = "fr" | "en" | "es";
type PersonaId = "lyra" | "orion" | "kai" | "maelis";

type Persona = { id: PersonaId; title: string; description: string };

// ✅ Avis (source FR unique) + meta Replika-like
type ReviewCard = {
  id: string;
  name: string;   // ex: "Marie L."
  date: string;   // ex: "12 janv. 2026"
  rating: number; // 1..5
  fr: string;     // texte FR
};

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
  mobileNote: string;
  langNote: string;

  personasTitle: string;
  personasSubtitle: string;
  personas: Persona[];
  personaCta: string;
  personaCtaHint: string;

  usageTitle: string;
  usageBullets: string[];

  // ✅ Reviews (Replika-like)
  reviewsTitle: string;
  reviewsSubtitle: string;
  reviewsPrivacyNote: string;
  reviewsHelpfulLabel: string; // "Utile ?"
  reviewsYes: string;
  reviewsNo: string;
  reviews: ReviewCard[];

  pricingTitle: string;
  pricingText: string;
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

// ✅ 5 avis FR (avec nom/date/étoiles) — 3 en janvier + 2 fin décembre
const REVIEWS_FR: ReviewCard[] = [
  {
    id: "r1",
    name: "Marie L.",
    date: "12 janv. 2026",
    rating: 5,
    fr: "AmorIAI m’a aidée à me calmer quand j’avais la tête trop pleine. C’est doux et rassurant.",
  },
  {
    id: "r2",
    name: "Julien R.",
    date: "18 janv. 2026",
    rating: 5,
    fr: "Je l’utilise quand je n’ai pas envie de parler à quelqu’un. Ça fait du bien.",
  },
  {
    id: "r3",
    name: "Sophie D.",
    date: "7 janv. 2026",
    rating: 5,
    fr: "Les réponses sont calmes et pertinentes. Ça m’aide à remettre de l’ordre dans mes idées.",
  },
  {
    id: "r4",
    name: "Alex P.",
    date: "28 déc. 2025",
    rating: 5,
    fr: "Interface simple, sans pression. J’écris deux minutes et je me sens déjà mieux.",
  },
  {
    id: "r5",
    name: "Camille B.",
    date: "30 déc. 2025",
    rating: 5,
    fr: "Je me sens écouté(e), sans jugement. C’est exactement ce qu’il me fallait.",
  },
];

// ✅ Traductions associées par id (affichage auto selon la langue)
const REVIEW_TRANSLATIONS: Record<string, { en: string; es: string }> = {
  r1: {
    en: "AmorIAI helped me calm down when my mind felt overwhelmed. It’s gentle and comforting.",
    es: "AmorIAI me ayudó a calmarme cuando tenía la mente saturada. Es suave y reconfortante.",
  },
  r2: {
    en: "I use it when I don’t feel like talking to anyone. It really helps.",
    es: "Lo uso cuando no quiero hablar con nadie. De verdad ayuda.",
  },
  r3: {
    en: "The replies feel calm and relevant. It helps me organize my thoughts.",
    es: "Las respuestas son tranquilas y útiles. Me ayuda a ordenar mis pensamientos.",
  },
  r4: {
    en: "Clean interface, no pressure. I write for two minutes and I already feel better.",
    es: "Interfaz simple, sin presión. Escribo dos minutos y ya me siento mejor.",
  },
  r5: {
    en: "I feel listened to, with no judgment. Exactly what I needed.",
    es: "Me siento escuchado/a, sin juicios. Era justo lo que necesitaba.",
  },
};

function translateReview(item: ReviewCard, locale: Locale) {
  if (locale === "fr") return item.fr;
  const t = REVIEW_TRANSLATIONS[item.id];
  if (!t) return item.fr;
  return locale === "en" ? t.en : t.es;
}

function stars(rating: number) {
  const r = Math.max(0, Math.min(5, rating));
  return "★★★★★☆☆☆☆☆".slice(5 - r, 10 - r); // produit 5 étoiles remplies + vides
}

const STRINGS: Record<Locale, Copy> = {
  fr: {
    brandTagline: "Un espace calme • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Commencer",

    heroKicker: "BIENVENUE SUR AMORIAI.APP",
    heroTitle: "Un espace calme. Pour parler, respirer… et y voir clair.",
    heroSubtitle:
      "Ici, tu peux tout déposer, sans te sentir jugé. AmorIAI t’écoute, te répond avec douceur et t’aide à comprendre ce que tu ressens à ton rythme.",
    heroPrimary: "Commencer gratuitement",
    heroSupport: "Gratuit pour commencer • Sans engagement • Annule quand tu veux",
    mobileNote: "Fonctionne parfaitement sur mobile — aucune application à télécharger.",
    langNote: "Choisis ta langue. Le reste, je m’en occupe.",

    personasTitle: "Choisis ton compagnon IA — et commence à écrire",
    personasSubtitle:
      "Crée ton compte et commence maintenant. Tu peux écrire librement, comme dans un journal avec quelqu’un qui te répond. La voix est disponible avec l’abonnement.",
    personas: [
      { id: "lyra", title: "Lyra — Compagnon IA doux", description: "Douce et rassurante. Parfaite pour déposer ce que tu gardes pour toi." },
      { id: "orion", title: "Orion — Compagnon IA stable", description: "Calme et structuré. Pour t’aider à clarifier et décider." },
      { id: "kai", title: "Kai — Compagnon IA nuancé", description: "Subtil et ouvert. Pour parler sans cases, sans pression." },
      { id: "maelis", title: "Maelis — Compagnon IA mature", description: "Bienveillant, réaliste et posé. Comme quelqu’un qui comprend." },
    ],
    personaCta: "Créer mon AmorIAI",
    personaCtaHint: "Exemple de compagnon IA - tu crées le tien après l’inscription.",

    usageTitle: "AmorIAI peut t’aider au quotidien",
    usageBullets: [
      "Parler quand tu n’as personne à qui te confier.",
      "Écrire ce que tu ressens, comme dans un journal intime.",
      "Te déposer le soir pour calmer ton mental.",
      "Clarifier une décision quand tu hésites.",
      "Revenir quand ça déborde, même pour 2 minutes.",
      "Te sentir accompagné, sans pression ni jugement.",
    ],

    reviewsTitle: "Ce que nos utilisateurs disent",
    reviewsSubtitle: "Des retours simples, après quelques jours d’utilisation.",
    reviewsPrivacyNote: "Tes messages sont privés. Personne ne les lit.",
    reviewsHelpfulLabel: "Cet avis est-il utile ?",
    reviewsYes: "Oui",
    reviewsNo: "Non",
    reviews: REVIEWS_FR,

    pricingTitle: "Quand tu te sens prêt",
    pricingText:
      "Commence gratuitement, à ton rythme. Si tu en ressens le besoin, tu pourras ensuite débloquer plus d’échanges et la voix pour parler, pas seulement écrire.",
    seePricingLabel: "Voir les tarifs",

    videoCaption: "Disponible en français, anglais et espagnol.",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: { legal: "Mentions légales", privacy: "Politique de confidentialité", terms: "Conditions d’utilisation", contact: "Contact", about: "À propos" },
  },

  en: {
    brandTagline: "A Calm Space • FR / EN / ES",
    nav: { home: "Home", features: "Features", pricing: "Pricing" },
    navLogin: "Log in",
    navSignup: "Get started",

    heroKicker: "WELCOME TO AMORIAI.APP",
    heroTitle: "A calm space. To talk, breathe… and see things clearly.",
    heroSubtitle:
      "Here, you can drop everything without feeling judged. AmorIAI listens, answers gently, and helps you understand what you feel — at your pace.",
    heroPrimary: "Start free",
    heroSupport: "Free to start • No commitment • Cancel anytime",
    mobileNote: "Works perfectly on mobile — no app required.",
    langNote: "Choose your language. I’ll take it from there.",

    personasTitle: "Choose your AI companion — and start writing",
    personasSubtitle:
      "Create your account and begin right away. Write freely, like a private journal… with a reply on the other side. Voice is available with the subscription.",
    personas: [
      { id: "lyra", title: "Lyra — Gentle AI companion", description: "Soft and reassuring. Great for putting words on what you keep inside." },
      { id: "orion", title: "Orion — Steady AI companion", description: "Calm and structured. Helps you think clearly and decide." },
      { id: "kai", title: "Kai — Nuanced AI companion", description: "Open-minded and subtle. A space without labels or pressure." },
      { id: "maelis", title: "Maelis — Mature AI companion", description: "Grounded, caring, realistic. Like someone who truly understands." },
    ],
    personaCta: "Create my AmorIAI",
    personaCtaHint: "Example AI companion - you’ll create yours after signup.",

    usageTitle: "How AmorIAI can support you day to day",
    usageBullets: [
      "Talk when you don’t feel like you have someone to confide in.",
      "Write what you feel, like in a private journal.",
      "Unwind at night and quiet your mind.",
      "Think through a decision when you’re hesitating.",
      "Come back when it’s too much, even for two minutes.",
      "Feel supported, with no pressure and no judgement.",
    ],

    reviewsTitle: "What users are saying",
    reviewsSubtitle: "Simple feedback after a few days of using AmorIAI.",
    reviewsPrivacyNote: "Your messages are private. No one reads them.",
    reviewsHelpfulLabel: "Was this review helpful?",
    reviewsYes: "Yes",
    reviewsNo: "No",
    reviews: REVIEWS_FR,

    pricingTitle: "When you feel ready",
    pricingText:
      "Start free, at your own pace. When you need more, you can unlock additional messages — and voice to talk, not just type.",
    seePricingLabel: "See pricing",

    videoCaption: "Available in French, English, and Spanish.",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: { legal: "Legal", privacy: "Privacy policy", terms: "Terms of use", contact: "Contact", about: "About" },
  },

  es: {
    brandTagline: "Un espacio tranquilo • FR / EN / ES",
    nav: { home: "Inicio", features: "Funciones", pricing: "Precios" },
    navLogin: "Iniciar sesión",
    navSignup: "Empezar",

    heroKicker: "BIENVENIDX A AMORIAI.APP",
    heroTitle: "Un espacio tranquilo. Para hablar, respirar… y ver claro.",
    heroSubtitle:
      "Aquí puedes soltarlo todo sin sentirte juzgadx. AmorIAI te escucha, responde con suavidad y te ayuda a entender lo que sientes — a tu ritmo.",
    heroPrimary: "Empezar gratis",
    heroSupport: "Gratis para empezar • Sin compromiso • Cancela cuando quieras",
    mobileNote: "Funciona perfecto en móvil — no necesitas app.",
    langNote: "Elige tu idioma. Yo me encargo del resto.",

    personasTitle: "Elige tu compañero de IA — y empieza a escribir",
    personasSubtitle:
      "Crea tu cuenta y empieza ahora. Escribe con libertad, como en un diario… con una respuesta al frente. La voz está disponible con suscripción.",
    personas: [
      { id: "lyra", title: "Lyra — Compañero de IA suave", description: "Dulce y tranquilizador. Ideal para decir lo que guardas dentro." },
      { id: "orion", title: "Orion — Compañero de IA estable", description: "Calmo y estructurado. Para pensar con claridad y decidir." },
      { id: "kai", title: "Kai — Compañero de IA con matices", description: "Sutil y abierto. Un espacio sin etiquetas ni presión." },
      { id: "maelis", title: "Maelis — Compañero de IA maduro", description: "Realista, sereno y amable. Como alguien que comprende." },
    ],
    personaCta: "Crear mi AmorIAI",
    personaCtaHint: "Ejemplo de compañero de IA - crearás el tuyo después de registrarte.",

    usageTitle: "Cómo puede acompañarte AmorIAI cada día",
    usageBullets: [
      "Hablar cuando sientes que no tienes con quién desahogarte.",
      "Escribir lo que llevas dentro, como en un diario personal.",
      "Tomarte un momento por la noche para calmar la mente.",
      "Pensar con más claridad cuando dudas o te sientes bloqueadx.",
      "Volver cuando todo se siente demasiado, aunque sea por dos minutos.",
      "Sentirte acompañado, sin presión ni juicios.",
    ],

    reviewsTitle: "Lo que dicen los usuarios",
    reviewsSubtitle: "Opiniones simples después de unos días usando AmorIAI.",
    reviewsPrivacyNote: "Tus mensajes son privados. Nadie los lee.",
    reviewsHelpfulLabel: "¿Te fue útil esta reseña?",
    reviewsYes: "Sí",
    reviewsNo: "No",
    reviews: REVIEWS_FR,

    pricingTitle: "Cuando te sientas listo",
    pricingText:
      "Empieza gratis, a tu propio ritmo. Cuando lo necesites, podrás desbloquear más mensajes — y la voz para hablar, no solo escribir.",
    seePricingLabel: "Ver precios",

    videoCaption: "Disponible en francés, inglés y español.",
    footerCopy: "© 2025 AmorIAI.app",
    footerLinks: { legal: "Aviso legal", privacy: "Política de privacidad", terms: "Términos de uso", contact: "Contacto", about: "Acerca de" },
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
    <main
      className="min-h-screen pb-12 text-slate-100"
      style={{ background: "radial-gradient(circle at top left,#111827 0,#020617 55%,#000 100%)" }}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/AmorIA_logo_transparent.png" alt="Logo AmorIAI.app" className="h-9 w-auto select-none" draggable={false} />
            <div className="flex flex-col">
              <div className="text-sm font-semibold">AmorIAI.app</div>
              <div className="text-[0.72rem] text-slate-400">{t.brandTagline}</div>
            </div>
          </div>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-5 text-xs text-slate-300 md:flex">
            <a href="#hero" className="border-b border-transparent pb-0.5 transition hover:border-slate-400 hover:text-slate-50">
              {t.nav.home}
            </a>
            <Link href={withLang("/features")} className="border-b border-transparent pb-0.5 transition hover:border-slate-400 hover:text-slate-50">
              {t.nav.features}
            </Link>
            <Link
              href={withLangPricingPublic()}
              className="border-b border-transparent pb-0.5 transition hover:border-slate-400 hover:text-slate-50"
            >
              {t.nav.pricing}
            </Link>
          </nav>

          {/* Lang + login + signup */}
          <div className="flex items-center gap-2">
            {/* Lang switcher */}
            <div className="flex items-center gap-0.5 rounded-full border border-slate-600/70 bg-slate-900/80 px-0.5 py-0.5 text-[0.7rem]">
              {(["fr", "en", "es"] as Locale[]).map((code) => (
                <Link
                  key={code}
                  href={{ pathname: "/", query: { lang: code } }}
                  className={`rounded-full px-2 py-0.5 transition ${
                    locale === code ? "bg-slate-800 text-slate-50" : "text-slate-400 hover:text-slate-100"
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
              {t.navLogin}
            </Link>

            <Link
              href={withLang("/signup")}
              className="hidden items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-400 px-3.5 py-1.5 text-[0.78rem] font-medium text-white shadow-lg shadow-pink-500/40 transition hover:brightness-110 sm:inline-flex"
            >
              {t.navSignup}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="mx-auto grid max-w-5xl items-center gap-8 px-4 pb-10 pt-6 md:grid-cols-[1.3fr,1fr]">
        <div className="flex flex-col gap-3">
          <p className="text-[0.8rem] uppercase tracking-[0.18em] text-indigo-300">{t.heroKicker}</p>
          <h1 className="text-3xl font-bold leading-tight md:text-[2.3rem]">{t.heroTitle}</h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-[0.92rem]">{t.heroSubtitle}</p>

          <div className="mt-3 flex flex-col gap-2">
            <Link
              href={withLang("/signup")}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-400 px-6 py-2.5 text-[0.96rem] font-medium text-white shadow-xl shadow-rose-400/40 transition hover:brightness-110"
            >
              {t.heroPrimary}
            </Link>

            <div className="text-[0.8rem] text-slate-300">
              {alreadyAccountText}{" "}
              <Link href={withLang("/login")} className="font-semibold text-rose-300 hover:text-rose-200">
                {loginInlineLabel}
              </Link>
            </div>
          </div>

          <p className="mt-1 text-[0.82rem] text-slate-400">{t.heroSupport}</p>
          <p className="text-[0.8rem] text-slate-300">{t.mobileNote}</p>
          <p className="text-[0.8rem] text-slate-200">{t.langNote}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div
            className="w-full max-w-xs animate-[amoriaPulse_4s_ease-in-out_infinite] rounded-[1.6rem] p-[0.22rem]"
            style={{ background: "linear-gradient(135deg,#f97316,#fb37ff,#38bdf8)" }}
          >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video className="block w-full rounded-[1.45rem] bg-slate-950" src={heroVideoSrc} controls playsInline />
          </div>
          <p className="text-center text-[0.78rem] text-slate-400">{t.videoCaption}</p>
        </div>
      </section>

      {/* PERSONAS */}
      <section id="features" className="mx-auto max-w-5xl space-y-4 px-4 pb-10">
        <div>
          <h2 className="text-lg font-semibold md:text-xl">{t.personasTitle}</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">{t.personasSubtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.personas.map((persona) => (
            <article
              key={persona.id}
              className="flex min-h-full flex-col overflow-hidden rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-950/90 via-slate-950 to-black/90"
            >
              <div className="aspect-[4/5] w-full border-b border-slate-800 bg-slate-900">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video className="h-full w-full object-cover" src={getPersonaVideoSrc(persona.id)} controls playsInline />
              </div>

              <div className="flex flex-col gap-2 px-3.5 py-3.5">
                <h3 className="text-sm font-semibold">{persona.title}</h3>
                <p className="flex-1 text-[0.8rem] text-slate-300">{persona.description}</p>

                <Link
                  href={withLang("/signup")}
                  className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-400 px-3 py-2 text-[0.85rem] font-medium text-white shadow-lg shadow-rose-400/35 transition hover:brightness-110"
                >
                  {t.personaCta}
                </Link>

                <p className="text-center text-[0.72rem] leading-snug text-slate-400">{t.personaCtaHint}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* USAGE */}
      <section className="mx-auto max-w-5xl border-t border-slate-900 px-4 pb-8 pt-7">
        <h2 className="mb-3 text-lg font-semibold md:text-xl">{t.usageTitle}</h2>
        <ul className="max-w-xl space-y-2 text-sm text-slate-300">
          {t.usageBullets.map((item, index) => (
            <li key={index} className="flex">
              <span className="mr-2 text-rose-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* REVIEWS (Replika-like) */}
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-2">
        <div className="mb-5">
          <h2 className="text-lg font-semibold md:text-xl">{t.reviewsTitle}</h2>
          <p className="mt-1 text-sm text-slate-300">{t.reviewsSubtitle}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-950/60 px-3 py-1 text-[0.78rem] text-slate-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.55)]" />
              {t.reviewsPrivacyNote}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {t.reviews.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-950/75 via-slate-950 to-black/90 p-4 shadow-lg shadow-black/25"
            >
              {/* Header: Name + Date */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-100">{item.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="text-[0.95rem] tracking-[0.06em] text-amber-300">{stars(item.rating)}</div>
                    <div className="text-[0.78rem] text-slate-400">{item.date}</div>
                  </div>
                </div>

                <div className="text-slate-500">⋮</div>
              </div>

              {/* Body */}
              <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-200">
                {translateReview(item, locale)}
              </p>

              {/* Helpful */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.78rem] text-slate-400">
                <span>{t.reviewsHelpfulLabel}</span>
                <button
                  type="button"
                  className="rounded-full border border-slate-600/60 bg-slate-950/60 px-3 py-1 text-slate-200 hover:bg-slate-900/70"
                >
                  {t.reviewsYes}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-600/60 bg-slate-950/60 px-3 py-1 text-slate-200 hover:bg-slate-900/70"
                >
                  {t.reviewsNo}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section id="pricing" className="mx-auto max-w-5xl px-4 pb-12">
        <div className="rounded-3xl border border-slate-800/70 bg-gradient-to-b from-slate-950/75 via-slate-950 to-black/90 p-6 text-center shadow-xl shadow-black/30">
          <h2 className="text-lg font-semibold md:text-xl">{t.pricingTitle}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300">{t.pricingText}</p>

          <div className="mt-5 flex flex-col items-center gap-2">
            <Link
              href={withLang("/signup")}
              className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-400 px-6 py-3 text-[0.92rem] font-medium text-white shadow-lg shadow-rose-400/40 transition hover:brightness-110"
            >
              {locale === "fr" ? "Créer mon compte gratuit" : locale === "en" ? "Create my free account" : "Crear mi cuenta gratis"}
            </Link>

            <Link
              href={withLangPricingPublic()}
              className="inline-flex w-full max-w-sm items-center justify-center rounded-full border border-slate-500/70 bg-transparent px-6 py-3 text-[0.92rem] font-medium text-slate-100 transition hover:bg-slate-900/70"
            >
              {t.seePricingLabel}
            </Link>

            <div className="text-[0.78rem] text-slate-400">
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
      <footer className="mx-auto max-w-5xl px-4 pb-4 text-center text-[0.78rem] text-slate-400">
        <div className="mb-2">{t.footerCopy}</div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href={withLang("/legal")} className="hover:text-slate-100">
            {t.footerLinks.legal}
          </Link>
          <Link href={withLang("/legal/privacy")} className="hover:text-slate-100">
            {t.footerLinks.privacy}
          </Link>
          <Link href={withLang("/legal/terms")} className="hover:text-slate-100">
            {t.footerLinks.terms}
          </Link>
          <Link href={withLang("/contact")} className="hover:text-slate-100">
            {t.footerLinks.contact}
          </Link>
          <Link href={withLang("/about")} className="hover:text-slate-100">
            {t.footerLinks.about}
          </Link>
        </div>
      </footer>
    </main>
  );
      }
