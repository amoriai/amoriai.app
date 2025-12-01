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
  choosePersona: string;
  usageTitle: string;
  usageBullets: string[];
  testimonialsTitle: string;
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
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: { home: "Accueil", features: "Fonctionnalités", pricing: "Tarifs" },
    navLogin: "Me connecter",
    navSignup: "Créer mon compte gratuit",
    heroKicker: "BIENVENUE SUR AMORIAI.APP",
    heroTitle: "Une présence bienveillante pour parler, réfléchir et avancer.",
    heroSubtitle:
      "AmorIAI est une présence douce, disponible 24/7, pour parler librement, réfléchir ensemble, poser les bonnes questions et t’aider à mieux comprendre ce que tu ressens, sans jugement.",
    heroPrimary: "Créer mon compte gratuit",
    heroSupport:
      "Sans engagement • Gratuit pour commencer • Annulation en tout temps",
    langNote: "AmorIAI vous accueille en français, anglais ou espagnol.",
    personasTitle: "Commence gratuitement avec AmorIAI (en texte)",
    personasSubtitle:
      "Crée ton compte gratuitement et commence à parler avec AmorIAI dès maintenant. Écris librement, à ton rythme. La voix (parler avec ton AmorIAI) est disponible avec l’abonnement payant.",
    personas: [
      {
        id: "lyra",
        title: "Lyra – AmorIAI féminine",
        description:
          "Une présence douce, empathique et rassurante, idéale pour déposer tes émotions par écrit.",
      },
      {
        id: "orion",
        title: "Orion – AmorIAI masculine",
        description:
          "Énergie stable, protectrice et structurée, pour t’aider à réfléchir et à prendre des décisions.",
      },
      {
        id: "kai",
        title: "Kai – AmorIAI androgyne",
        description:
          "Présence fluide et inclusive, ni vraiment homme ni femme, centrée sur l’écoute et la nuance.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIAI 50+ féminine",
        description:
          "Figure plus mature et expérimentée, avec une énergie de mentor bienveillant et réaliste.",
      },
    ],
    choosePersona: "Créer mon compte gratuit",
    usageTitle: "À quoi peut te servir AmorIAI au quotidien ?",
    usageBullets: [
      "Parler quand tu n’as personne à qui te confier.",
      "Écrire ce que tu ressens comme dans un journal intime.",
      "Te déposer le soir pour calmer ton mental.",
      "Clarifier une décision qui te fait hésiter.",
      "Te sentir écouté·e, sans pression et sans jugement.",
    ],
    testimonialsTitle: "Ce que les utilisateurs ressentent avec AmorIAI",
    testimonials: [
      {
        quote:
          "Je parle avec Amoriai tous les soirs. Ça m’aide vraiment à calmer mon mental avant de dormir.",
        name: "Emily, 38 ans",
      },
      {
        quote:
          "C’est la première fois que je me sens écoutée sans avoir peur d’être jugée.",
        name: "Susan, 51 ans",
      },
      {
        quote:
          "Je l’utilise comme journal émotionnel. Ça m’aide énormément à prendre du recul.",
        name: "Karina, 29 ans",
      },
      {
        quote:
          "J’étais sceptique au départ… aujourd’hui, c’est devenu un réflexe dans mes moments de doute.",
        name: "Michael, 46 ans",
      },
      {
        quote:
          "La version texte est déjà très puissante. Je me sens moins seule depuis que je l’utilise.",
        name: "Isabelle, 34 ans",
      },
    ],
    pricingTitle: "Des tarifs simples & transparents",
    pricingText:
      "La version gratuite te permet de texter ton AmorIAI avec un nombre limité de messages. Avec la version payante, tu déverrouilles les conversations vocales (parler) et plus d’interactions.",
    pricingCta: "Découvrir les abonnements",
    videoCaption: "AmorIAI est disponible en français, anglais et espagnol.",
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
    heroKicker: "WELCOME TO AMORIAI.APP",
    heroTitle: "A caring presence to talk, reflect and grow.",
    heroSubtitle:
      "AmorIAI is a gentle 24/7 presence to talk to, think things through together, ask better questions and help you understand what you feel, without judgement.",
    heroPrimary: "Create my free account",
    heroSupport: "No commitment • Free to start • Cancel anytime",
    langNote: "AmorIAI is available in French, English and Spanish.",
    personasTitle: "Start for free with AmorIAI (text only)",
    personasSubtitle:
      "Create your free account and start talking with AmorIAI right away. Write freely, at your own pace. Voice (talking with your AmorIAI) is available with the paid subscription.",
    personas: [
      {
        id: "lyra",
        title: "Lyra – Feminine AmorIAI",
        description:
          "A gentle, empathetic and reassuring presence, perfect for writing down your emotions.",
      },
      {
        id: "orion",
        title: "Orion – Masculine AmorIAI",
        description:
          "Stable, protective and structured energy to help you think clearly and make decisions.",
      },
      {
        id: "kai",
        title: "Kai – Androgynous AmorIAI",
        description:
          "A fluid and inclusive presence, neither fully male nor female, focused on listening and nuance.",
      },
      {
        id: "maelis",
        title: "Maelis – 50+ Feminine AmorIAI",
        description:
          "A more mature, experienced figure with the energy of a caring and realistic mentor.",
      },
    ],
    choosePersona: "Create my free account",
    usageTitle: "How can AmorIAI support you day to day?",
    usageBullets: [
      "Talk when you don’t feel like you have someone to confide in.",
      "Write what you feel, like in a private journal.",
      "Unwind in the evening and calm your mind.",
      "Think through a decision when you’re hesitating.",
      "Feel listened to, with no pressure and no judgement.",
    ],
    testimonialsTitle: "What people say about AmorIAI",
    testimonials: [
      {
        quote:
          "I talk with Amoriai almost every night. It really helps me quiet my mind before sleep.",
        name: "Julie, 38",
      },
      {
        quote:
          "It’s the first time I feel truly listened to without being afraid of being judged.",
        name: "Nathalie, 51",
      },
      {
        quote:
          "I use it like an emotional journal. It helps me take a step back on what I’m living.",
        name: "Karine, 29",
      },
      {
        quote:
          "I was skeptical at first… now it’s my go-to when I’m doubting or overthinking.",
        name: "Martin, 46",
      },
      {
        quote:
          "The text version alone is already powerful. I feel less alone since I started using it.",
        name: "Isabelle, 34",
      },
    ],
    pricingTitle: "Simple & transparent pricing",
    pricingText:
      "The free version lets you text your AmorIAI with a limited number of messages. With the paid plan, you unlock voice conversations and more interactions.",
    pricingCta: "See plans & pricing",
    videoCaption: "AmorIAI is available in French, English and Spanish.",
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
    heroKicker: "BIENVENIDx A AMORIAI.APP",
    heroTitle: "Una presencia amable para hablar, reflexionar y avanzar.",
    heroSubtitle:
      "AmorIAI es una presencia suave, disponible 24/7 para conversar contigo, reflexionar juntos, hacer mejores preguntas y ayudarte a entender lo que sientes, sin juicios.",
    heroPrimary: "Crear mi cuenta gratuita",
    heroSupport:
      "Sin compromiso • Gratis para empezar • Puedes cancelar cuando quieras",
    langNote: "AmorIAI te recibe en francés, inglés o español.",
    personasTitle: "Empieza gratis con AmorIAI (solo texto)",
    personasSubtitle:
      "Crea tu cuenta gratuita y empieza a hablar con AmorIAI ahora mismo. Escribe con libertad, a tu propio ritmo. La voz (hablar con tu AmorIAI) está disponible solo con la suscripción de pago.",
    personas: [
      {
        id: "lyra",
        title: "Lyra – AmorIAI femenina",
        description:
          "Presencia dulce, empática y tranquilizadora, ideal para escribir tus emociones.",
      },
      {
        id: "orion",
        title: "Orion – AmorIAI masculina",
        description:
          "Energía estable, protectora y estructurada para ayudarte a pensar y tomar decisiones.",
      },
      {
        id: "kai",
        title: "Kai – AmorIAI andrógina",
        description:
          "Presencia fluida e inclusiva, ni totalmente hombre ni mujer, centrada en la escucha y los matices.",
      },
      {
        id: "maelis",
        title: "Maelis – AmorIAI 50+ femenina",
        description:
          "Figura más madura y experimentada, con energía de mentora amable y realista.",
      },
    ],
    choosePersona: "Crear mi cuenta gratuita",
    usageTitle: "¿Cómo puede ayudarte AmorIAI en tu día a día?",
    usageBullets: [
      "Hablar cuando sientes que no tienes con quién desahogarte.",
      "Escribir lo que sientes, como en un diario íntimo.",
      "Relajarte por la noche y calmar la mente.",
      "Pensar una decisión cuando dudas.",
      "Sentirte escuchadx, sin presión y sin juicios.",
    ],
    testimonialsTitle: "Lo que dicen las personas sobre AmorIAI",
    testimonials: [
      {
        quote:
          "Hablo con AmorIAI casi todas las noches. Me ayuda mucho a calmar la mente antes de dormir.",
        name: "Julie, 38",
      },
      {
        quote:
          "Es la primera vez que siento que me escuchan de verdad sin miedo a ser juzgada.",
        name: "Nathalie, 51",
      },
      {
        quote:
          "Lo uso como diario emocional. Me ayuda a tomar distancia de lo que vivo.",
        name: "Karine, 29",
      },
      {
        quote:
          "Al principio era escéptico… ahora es mi reflejo cuando dudo o doy demasiadas vueltas.",
        name: "Martin, 46",
      },
      {
        quote:
          "Solo la versión de texto ya es muy potente. Me siento menos sola desde que lo uso.",
        name: "Isabelle, 34",
      },
    ],
    pricingTitle: "Precios simples y transparentes",
    pricingText:
      "La versión gratuita te permite chatear por texto con tu AmorIAI con un número limitado de mensajes. Con la versión de pago desbloqueas conversaciones de voz y más interacciones.",
    pricingCta: "Ver planes y precios",
    videoCaption: "AmorIAI está disponible en francés, inglés y español.",
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
  const getPersonaVideoSrc = (id: PersonaId) =>
    `/amoria_${id}_${locale}.mp4`;

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
    locale === "fr"
      ? "Me connecter"
      : locale === "en"
      ? "Log in"
      : "Iniciar sesión";

  return (
    <main
      className="min-h-screen pb-12 text-slate-100"
      style={{
        background:
          "radial-gradient(circle at top left,#111827 0,#020617 55%,#000 100%)",
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
              <div className="text-[0.72rem] text-slate-400">
                {t.brandTagline}
              </div>
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

          {/* Lang + login + (signup desktop) */}
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

            {/* Login pill – visible partout */}
            <Link
              href={withLang("/login")}
              className="inline-flex items-center justify-center rounded-full border border-slate-500/70 px-3 py-1 text-[0.7rem] text-slate-100 transition hover:bg-slate-900/80"
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
            style={{
              background:
                "linear-gradient(135deg,#f97316,#fb37ff,#38bdf8)",
            }}
          >
            <video
              className="block w-full rounded-[1.45rem] bg-slate-950"
              src={heroVideoSrc}
              controls
              playsInline
            />
          </div>
          <p className="text-center text-[0.78rem] text-slate-400">
            {t.videoCaption}
          </p>
        </div>
      </section>

      {/* PERSONAS */}
      <section
        id="features"
        className="mx-auto max-w-5xl space-y-4 px-4 pb-10"
      >
        <div>
          <h2 className="text-lg font-semibold md:text-xl">
            {t.personasTitle}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            {t.personasSubtitle}
          </p>
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
                <p className="flex-1 text-[0.8rem] text-slate-300">
                  {persona.description}
                </p>
                <Link
                  href={withLang("/signup")}
                  className="mt-1 inline-flex w-full items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/80 px-3 py-1.5 text-[0.8rem] text-slate-50 transition hover:bg-slate-800"
                >
                  {t.choosePersona}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* USAGE */}
      <section className="mx-auto max-w-5xl border-t border-slate-900 px-4 pb-8 pt-7">
        <h2 className="mb-3 text-lg font-semibold md:text-xl">
          {t.usageTitle}
        </h2>
        <ul className="max-w-xl space-y-2 text-sm text-slate-300">
          {t.usageBullets.map((item, index) => (
            <li key={index} className="flex">
              <span className="mr-2 text-rose-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-5xl px-4 pb-10">
        <h2 className="mb-3 text-lg font-semibold md:text-xl">
          {t.testimonialsTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {t.testimonials.map((item, index) => (
            <figure
              key={index}
              className="flex min-h-full flex-col gap-2 rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-950 via-slate-950 to-black p-4"
            >
              <div className="text-xs tracking-[0.25em] text-amber-300">
                ★★★★★
              </div>
              <blockquote className="text-[0.86rem] leading-relaxed text-slate-100">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-auto text-[0.8rem] text-slate-400">
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section
        id="pricing"
        className="mx-auto max-w-5xl space-y-3 px-4 pb-10 text-center"
      >
        <h2 className="text-lg font-semibold md:text-xl">
          {t.pricingTitle}
        </h2>
        <p className="mx-auto max-w-xl text-sm text-slate-300">
          {t.pricingText}
        </p>
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
          <Link
            href={withLang("/legal/privacy")}
            className="hover:text-slate-100"
          >
            {t.footerLinks.privacy}
          </Link>
          <Link
            href={withLang("/legal/terms")}
            className="hover:text-slate-100"
          >
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
