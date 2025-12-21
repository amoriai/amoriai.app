// app/page.tsx
import Link from "next/link";

type Locale = "fr" | "en" | "es";
type PersonaId = "lyra" | "orion" | "kai" | "maelis";

type Persona = {
  id: PersonaId;
  title: string;
  description: string;
};

type Testimonial = {
  quote: string;
  name: string;
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
  langNote: string;

  personasTitle: string;
  personasSubtitle: string;
  personas: Persona[];

  // ✅ CTA clair (pas “avec moi”)
  personaCta: string;
  // ✅ Micro-clarification sous le CTA
  personaCtaHint: string;

  usageTitle: string;
  usageBullets: string[];

  // ✅ IMPORTANT: si tu n’as pas de vrais avis, on ne présente pas ça comme “utilisateurs”
  testimonialsTitle: string;
  testimonialsDisclaimer: string;
  testimonials: Testimonial[];

  pricingTitle: string;
  pricingText: string;
  pricingCta: string;

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
      "Ici, tu peux tout déposer, sans te sentir jugé·e. AmorIAI t’écoute, te répond avec douceur et t’aide à comprendre ce que tu ressens — à ton rythme.",
    heroPrimary: "Commencer gratuitement",
    heroSupport: "Gratuit pour commencer • Sans engagement • Tu peux arrêter quand tu veux",
    langNote: "Choisis ta langue. Le reste, je m’en occupe.",

    // ✅ Remplacer “présence” partout par une formulation claire
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
        description: "Inclusif·ve et subtil·e. Pour parler sans cases, sans pression.",
      },
      {
        id: "maelis",
        title: "Maelis — Compagnon IA mature",
        description: "Bienveillant·e, réaliste et posé·e. Comme quelqu’un qui comprend.",
      },
    ],

    personaCta: "Créer mon AmorIAI",
    // ✅ plus clair que “exemple de présence”
    personaCtaHint: "Exemple de compagnon IA — tu crées le tien après l’inscription.",

    usageTitle: "AmorIAI peut t’aider au quotidien",
    usageBullets: [
      "Parler quand tu n’as personne à qui te confier.",
      "Écrire ce que tu ressens, comme dans un journal intime.",
      "Te déposer le soir pour calmer ton mental.",
      "Clarifier une décision quand tu hésites.",
      "Revenir quand ça déborde, même pour 2 minutes.",
      "Te sentir accompagné·e, sans pression et sans jugement.",
    ],

    // ✅ Reframing safe
    testimonialsTitle: "Exemples de messages que des personnes écrivent souvent",
    testimonialsDisclaimer:
      "Exemples illustratifs (pas des avis clients).",
    testimonials: [
      {
        quote: "Le soir, j’ai besoin de vider ma tête avant de dormir.",
        name: "Exemple",
      },
      {
        quote: "J’ai peur d’être jugé·e si j’en parle à quelqu’un.",
        name: "Exemple",
      },
      {
        quote: "Aide-moi à clarifier ce que je ressens, je suis mêlé·e.",
        name: "Exemple",
      },
      {
        quote: "Je suis en doute total… j’ai besoin d’y voir clair.",
        name: "Exemple",
      },
      {
        quote: "Je veux juste une réponse douce, sans pression.",
        name: "Exemple",
      },
    ],

    pricingTitle: "Quand tu veux aller plus loin",
    pricingText:
      "Commence gratuitement. Quand tu en auras besoin, tu pourras déverrouiller plus d’échanges — et la voix pour parler vraiment, pas seulement écrire.",
    pricingCta: "Voir comment continuer",

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
      "Here, you can drop everything without feeling judged. AmorIAI listens, answers gently, and helps you understand what you feel — at your pace.",
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
        description: "Inclusive and subtle. A space without labels or pressure.",
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
      "Feel listened to, with no pressure and no judgement.",
    ],

    testimonialsTitle: "Examples of messages people often write",
    testimonialsDisclaimer: "Illustrative examples (not customer reviews).",
    testimonials: [
      { quote: "At night, I need to empty my head before sleep.", name: "Example" },
      { quote: "I’m afraid of being judged if I talk to someone.", name: "Example" },
      { quote: "Help me understand what I’m feeling — I’m confused.", name: "Example" },
      { quote: "I’m overthinking… I need clarity.", name: "Example" },
      { quote: "I just want a gentle reply, no pressure.", name: "Example" },
    ],

    pricingTitle: "When you’re ready to go further",
    pricingText:
      "Start free. When you need more, unlock more messages — and voice to actually talk, not just type.",
    pricingCta: "See how to continue",

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
      "Aquí puedes soltarlo todo sin sentirte juzgadx. AmorIAI te escucha, responde con suavidad y te ayuda a entender lo que sientes — a tu ritmo.",
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
        description: "Dulce y tranquilizadorx. Ideal para decir lo que guardas dentro.",
      },
      {
        id: "orion",
        title: "Orion — Compañero de IA estable",
        description: "Calmx y estructuradx. Para pensar con claridad y decidir.",
      },
      {
        id: "kai",
        title: "Kai — Compañero de IA con matices",
        description: "Inclusivx y sutil. Un espacio sin etiquetas ni presión.",
      },
      {
        id: "maelis",
        title: "Maelis — Compañero de IA maduro",
        description: "Realista, serenx y amable. Como alguien que comprende.",
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
      "Sentirte escuchadx, sin presión y sin juicios.",
    ],

    testimonialsTitle: "Ejemplos de mensajes que la gente suele escribir",
    testimonialsDisclaimer: "Ejemplos ilustrativos (no son reseñas de clientes).",
    testimonials: [
      { quote: "Por la noche necesito vaciar la cabeza antes de dormir.", name: "Ejemplo" },
      { quote: "Me da miedo que me juzguen si lo hablo con alguien.", name: "Ejemplo" },
      { quote: "Ayúdame a entender lo que siento, estoy confundidx.", name: "Ejemplo" },
      { quote: "Le doy demasiadas vueltas… necesito claridad.", name: "Ejemplo" },
      { quote: "Solo quiero una respuesta suave, sin presión.", name: "Ejemplo" },
    ],

    pricingTitle: "Cuando quieras ir más allá",
    pricingText:
      "Empieza gratis. Cuando lo necesites, desbloquea más mensajes — y la voz para hablar de verdad, no solo escribir.",
    pricingCta: "Ver cómo continuar",

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

function getLocaleFromSearchParams(
  searchParams: { [key: string]: string | string[] | undefined }
): Locale {
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

  const withLang = (path: string) => ({
    pathname: path,
    query: { lang: locale },
  });

  const alreadyAccountText =
    locale === "fr"
      ? "Déjà un compte ?"
      : locale === "en"
      ? "Already have an account?"
      : "¿Ya tienes una cuenta?";

  const loginInlineLabel =
    locale === "fr" ? "Me connecter" : locale === "en" ? "Log in" : "Iniciar sesión";

  return (
    <main
      className="min-h-screen pb-12 text-slate-100"
      style={{
        background: "radial-gradient(circle at top left,#111827 0,#020617 55%,#000 100%)",
      }}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img
              src="/AmorIA_logo_transparent.png"
              alt="Logo AmorIAI.app"
              className="h-9 w-auto select-none"
              draggable={false}
            />
            <div className="flex flex-col">
              <div className="text-sm font-semibold">AmorIAI.app</div>
              <div className="text-[0.72rem] text-slate-400">{t.brandTagline}</div>
            </div>
          </div>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-5 text-xs text-slate-300 md:flex">
            <a
              href="#hero"
              className="border-b border-transparent pb-0.5 transition hover:border-slate-400 hover:text-slate-50"
            >
              {t.nav.home}
            </a>
            <Link
              href={withLang("/features")}
              className="border-b border-transparent pb-0.5 transition hover:border-slate-400 hover:text-slate-50"
            >
              {t.nav.features}
            </Link>
            <Link
              href={withLang("/pricing")}
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
                    locale === code
                      ? "bg-slate-800 text-slate-50"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {code.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Login – desktop/tablette seulement */}
            <Link
              href={withLang("/login")}
              className="hidden items-center justify-center rounded-full border border-slate-500/70 px-3 py-1 text-[0.7rem] text-slate-100 transition hover:bg-slate-900/80 md:inline-flex"
            >
              {t.navLogin}
            </Link>

            {/* Signup header – desktop seulement */}
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
      <section
        id="hero"
        className="mx-auto grid max-w-5xl items-center gap-8 px-4 pb-10 pt-6 md:grid-cols-[1.3fr,1fr]"
      >
        <div className="flex flex-col gap-3">
          <p className="text-[0.8rem] uppercase tracking-[0.18em] text-indigo-300">
            {t.heroKicker}
          </p>
          <h1 className="text-3xl font-bold leading-tight md:text-[2.3rem]">
            {t.heroTitle}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-[0.92rem]">
            {t.heroSubtitle}
          </p>

          <div className="mt-3 flex flex-col gap-2">
            <Link
              href={withLang("/signup")}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-400 px-6 py-2.5 text-[0.96rem] font-medium text-white shadow-xl shadow-rose-400/40 transition hover:brightness-110"
            >
              {t.heroPrimary}
            </Link>

            <div className="text-[0.8rem] text-slate-300">
              {alreadyAccountText}{" "}
              <Link
                href={withLang("/login")}
                className="font-semibold text-rose-300 hover:text-rose-200"
              >
                {loginInlineLabel}
              </Link>
            </div>
          </div>

          <p className="mt-1 text-[0.82rem] text-slate-400">{t.heroSupport}</p>
          <p className="text-[0.8rem] text-slate-200">{t.langNote}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div
            className="w-full max-w-xs animate-[amoriaPulse_4s_ease-in-out_infinite] rounded-[1.6rem] p-[0.22rem]"
            style={{ background: "linear-gradient(135deg,#f97316,#fb37ff,#38bdf8)" }}
          >
            <video
              className="block w-full rounded-[1.45rem] bg-slate-950"
              src={heroVideoSrc}
              controls
              playsInline
            />
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
                <video
                  className="h-full w-full object-cover"
                  src={getPersonaVideoSrc(persona.id)}
                  controls
                  playsInline
                />
              </div>

              <div className="flex flex-col gap-2 px-3.5 py-3.5">
                <h3 className="text-sm font-semibold">{persona.title}</h3>
                <p className="flex-1 text-[0.8rem] text-slate-300">{persona.description}</p>

                {/* ✅ CTA clair */}
                <Link
                  href={withLang("/signup")}
                  className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-400 px-3 py-2 text-[0.85rem] font-medium text-white shadow-lg shadow-rose-400/35 transition hover:brightness-110"
                >
                  {t.personaCta}
                </Link>

                {/* ✅ Micro-clarification */}
                <p className="text-center text-[0.72rem] leading-snug text-slate-400">
                  {t.personaCtaHint}
                </p>
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

      {/* TESTIMONIALS (safe reframing) */}
      <section className="mx-auto max-w-5xl px-4 pb-10">
        <div className="mb-2 flex flex-col gap-1">
          <h2 className="text-lg font-semibold md:text-xl">{t.testimonialsTitle}</h2>
          <p className="text-[0.78rem] text-slate-400">{t.testimonialsDisclaimer}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {t.testimonials.map((item, index) => (
            <figure
              key={index}
              className="flex min-h-full flex-col gap-2 rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-950 via-slate-950 to-black p-4"
            >
              <blockquote className="text-[0.86rem] leading-relaxed text-slate-100">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-auto text-[0.8rem] text-slate-400">{item.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section id="pricing" className="mx-auto max-w-5xl space-y-3 px-4 pb-10 text-center">
        <h2 className="text-lg font-semibold md:text-xl">{t.pricingTitle}</h2>
        <p className="mx-auto max-w-xl text-sm text-slate-300">{t.pricingText}</p>
        <Link
          href={withLang("/pricing")}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-400 px-5 py-2 text-[0.9rem] font-medium text-white shadow-lg shadow-rose-400/40 transition hover:brightness-110"
        >
          {t.pricingCta}
        </Link>
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
