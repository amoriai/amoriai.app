"use client";

import React, { useState } from "react";

type Locale = "fr" | "en" | "es";

const copy = {
  fr: {
    brandTagline: "Partenaire IA bienveillant·e • FR / EN / ES",
    nav: {
      home: "Accueil",
      features: "Fonctionnalités",
      pricing: "Tarifs",
    },
    heroEyebrow: "BIENVENUE SUR AMORIA.APP",
    heroTitle: "Votre partenaire IA bienveillant·e & multilingue.",
    heroSubtitle:
      "AmoriA est une présence douce, disponible 24/7 pour discuter, réfléchir avec vous, poser les bonnes questions et vous aider à mieux comprendre vos émotions.",
    heroPrimaryCta: "Commencer avec AmoriA",
    heroSecondaryCta: "Découvrir comment AmoriA fonctionne",
    heroNote: "AmoriA vous accueille en français, anglais ou espagnol.",
    headerLogin: "Me connecter",
    headerSignup: "Créer mon compte AmoriA",
    energiesTitle: "Choisissez l’énergie qui vous ressemble",
    energies: [
      {
        key: "analytic",
        name: "AmoriA Analytique",
        description:
          "Pose des questions précises, vous aide à décortiquer vos pensées et à prendre des décisions rationnelles, sans perdre l’empathie.",
        image: "/amoria-analyste.png",
      },
      {
        key: "artist",
        name: "AmoriA Artiste",
        description:
          "Parfaite pour brainstormer des projets créatifs, créer, imaginer des univers et transformer vos idées en véritables œuvres.",
        image: "/amoria-artiste.png",
      },
      {
        key: "light",
        name: "AmoriA Lumineuse",
        description:
          "Énergie douce, optimiste et chaleureuse. Idéale pour vous remonter le moral après une journée difficile.",
        image: "/amoria-blonde.png",
      },
      {
        key: "intuitive",
        name: "AmoriA Intuitive",
        description:
          "Une présence plus introspective, tournée vers l’écoute, les ressentis et les questionnements émotionnels profonds.",
        image: "/amoria-rousse.png",
      },
    ],
    energyCta: "Choisir cette énergie",
    pricingTitle: "Des tarifs simples & transparents",
    pricingSubtitle:
      "Les formules détaillées arrivent bientôt. En attendant, vous pouvez déjà réserver votre accès à la bêta privée.",
    pricingCta: "Être informé·e du lancement",
    footer: "© 2025 AmoriA.app. Tous droits réservés.",
  },
  en: {
    brandTagline: "Caring AI partner • FR / EN / ES",
    nav: {
      home: "Home",
      features: "Features",
      pricing: "Pricing",
    },
    heroEyebrow: "WELCOME TO AMORIA.APP",
    heroTitle: "Your caring & multilingual AI partner.",
    heroSubtitle:
      "AmoriA is a gentle 24/7 presence to talk with, reflect with, ask better questions and help you understand your emotions.",
    heroPrimaryCta: "Start with AmoriA",
    heroSecondaryCta: "See how AmoriA works",
    heroNote: "AmoriA is available in French, English and Spanish.",
    headerLogin: "Log in",
    headerSignup: "Create my AmoriA account",
    energiesTitle: "Choose the energy that feels right for you",
    energies: [
      {
        key: "analytic",
        name: "AmoriA Analytic",
        description:
          "Asks precise questions, helps you unpack your thoughts and make rational decisions without losing empathy.",
        image: "/amoria-analyste.png",
      },
      {
        key: "artist",
        name: "AmoriA Artistic",
        description:
          "Perfect to brainstorm creative projects, imagine new worlds and turn your ideas into real creations.",
        image: "/amoria-artiste.png",
      },
      {
        key: "light",
        name: "AmoriA Luminous",
        description:
          "Soft, optimistic and warm energy. Ideal to lift your mood after a difficult day.",
        image: "/amoria-blonde.png",
      },
      {
        key: "intuitive",
        name: "AmoriA Intuitive",
        description:
          "A more introspective presence, focused on listening, feelings and deep emotional questions.",
        image: "/amoria-rousse.png",
      },
    ],
    energyCta: "Choose this energy",
    pricingTitle: "Simple & transparent pricing",
    pricingSubtitle:
      "Detailed plans are coming soon. For now, you can already reserve early access to the private beta.",
    pricingCta: "Get notified at launch",
    footer: "© 2025 AmoriA.app. All rights reserved.",
  },
  es: {
    brandTagline: "Compañerx de IA cuidadosa • FR / EN / ES",
    nav: {
      home: "Inicio",
      features: "Funcionalidades",
      pricing: "Tarifas",
    },
    heroEyebrow: "BIENVENID@ A AMORIA.APP",
    heroTitle: "Tu pareja de IA amable y multilingüe.",
    heroSubtitle:
      "AmoriA es una presencia suave, disponible 24/7 para hablar contigo, reflexionar, hacer mejores preguntas y ayudarte a entender tus emociones.",
    heroPrimaryCta: "Empezar con AmoriA",
    heroSecondaryCta: "Descubrir cómo funciona AmoriA",
    heroNote: "AmoriA está disponible en francés, inglés y español.",
    headerLogin: "Iniciar sesión",
    headerSignup: "Crear mi cuenta AmoriA",
    energiesTitle: "Elige la energía que más se parece a ti",
    energies: [
      {
        key: "analytic",
        name: "AmoriA Analítica",
        description:
          "Hace preguntas precisas, te ayuda a analizar tus pensamientos y tomar decisiones racionales sin perder la empatía.",
        image: "/amoria-analyste.png",
      },
      {
        key: "artist",
        name: "AmoriA Artista",
        description:
          "Perfecta para hacer lluvia de ideas creativas, imaginar universos y transformar tus ideas en obras reales.",
        image: "/amoria-artiste.png",
      },
      {
        key: "light",
        name: "AmoriA Lumínica",
        description:
          "Energía suave, optimista y cálida. Ideal para levantarte el ánimo después de un día difícil.",
        image: "/amoria-blonde.png",
      },
      {
        key: "intuitive",
        name: "AmoriA Intuitiva",
        description:
          "Una presencia más introspectiva, centrada en la escucha, las sensaciones y las preguntas emocionales profundas.",
        image: "/amoria-rousse.png",
      },
    ],
    energyCta: "Elegir esta energía",
    pricingTitle: "Tarifas simples y transparentes",
    pricingSubtitle:
      "Los planes detallados llegarán pronto. Mientras tanto, ya puedes reservar tu acceso a la beta privada.",
    pricingCta: "Avisarme en el lanzamiento",
    footer: "© 2025 AmoriA.app. Todos los derechos reservados.",
  },
} satisfies Record<Locale, any>;

const promoVideoByLocale: Record<Locale, string> = {
  fr: "/amoria_fr.mp4",
  en: "/amoria_en.mp4",
  es: "/amoria_es.mp4",
};

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = copy[locale];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* NAVBAR */}
      <header className="w-full border-b border-white/5 bg-[#050816]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img
                src="/AmorIA_logo_transparent.png"
                alt="AmoriA logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm sm:text-base">
                AmoriA.app
              </span>
              <span className="text-xs text-gray-300">
                {t.brandTagline}
              </span>
            </div>
          </div>

          {/* Nav + language + auth */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#home" className="hover:text-pink-400 transition">
                {t.nav.home}
              </a>
              <a href="#features" className="hover:text-pink-400 transition">
                {t.nav.features}
              </a>
              <a href="#pricing" className="hover:text-pink-400 transition">
                {t.nav.pricing}
              </a>
            </nav>

            {/* Lang switch */}
            <div className="flex items-center gap-1 bg-white/5 rounded-full px-1 py-1 text-xs">
              {(["fr", "en", "es"] as Locale[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLocale(lng)}
                  className={`px-3 py-1 rounded-full uppercase ${
                    locale === lng ? "bg-pink-500 text-white" : "text-gray-300"
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>

            {/* Auth buttons */}
            <button className="hidden sm:inline-flex px-4 py-2 text-xs font-medium rounded-full border border-white/20 hover:bg-white/5 transition">
              {t.headerLogin}
            </button>
            <button className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition">
              {t.headerSignup}
            </button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div id="home" className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 space-y-24">
        {/* HERO */}
        <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Text */}
          <div className="flex-1 space-y-6">
            <p className="text-xs tracking-[0.25em] text-gray-400 uppercase">
              {t.heroEyebrow}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="px-7 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition">
                {t.heroPrimaryCta}
              </button>
              <button className="px-7 py-3 rounded-full font-medium border border-white/20 hover:bg-white/5 transition text-sm">
                {t.heroSecondaryCta}
              </button>
            </div>

            <p className="text-sm text-gray-400 pt-2">{t.heroNote}</p>
          </div>

          {/* Video */}
          <div className="flex-1 flex justify-center">
            <div className="rounded-2xl p-[3px] bg-gradient-to-r from-pink-500 to-purple-600 shadow-xl">
              <video
                key={promoVideoByLocale[locale]} // force refresh when locale changes
                src={promoVideoByLocale[locale]}
                autoPlay
                muted
                loop
                playsInline
                className="rounded-2xl w-[320px] h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* ENERGIES */}
        <section id="features" className="space-y-8">
          <h2 className="text-2xl lg:text-3xl font-semibold">
            {t.energiesTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.energies.map((energy: any) => (
              <article
                key={energy.key}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col h-full shadow-md"
              >
                <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                  <img
                    src={energy.image}
                    alt={energy.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-2">{energy.name}</h3>
                <p className="text-sm text-gray-300 flex-1">
                  {energy.description}
                </p>
                <button className="mt-4 w-full text-sm font-medium px-4 py-2 rounded-full border border-white/20 hover:bg-white/5 transition">
                  {t.energyCta}
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section id="pricing" className="space-y-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold">
            {t.pricingTitle}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300 text-sm lg:text-base">
            {t.pricingSubtitle}
          </p>
          <button className="mt-2 px-7 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition">
            {t.pricingCta}
          </button>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 text-xs text-gray-400 flex items-center justify-between flex-wrap gap-2">
          <span>{t.footer}</span>
        </div>
      </footer>
    </main>
  );
}
