// app/page.tsx

import Link from "next/link";
import ReviewsSection from "./ReviewsSection";
import "./home.css";

type Locale = "fr" | "en" | "es";
type PersonaId = "lyra" | "orion" | "kai" | "maelis";

type Persona = {
  id: PersonaId;
  title: string;
  badge: string;
  description: string;
};

type ReviewCard = {
  id: string;
  name: string;
  date: string;
  rating: number;
  fr: string;
};

type Copy = {
  brandTagline: string;
  nav: {
    home: string;
    companions: string;
    benefits: string;
    pricing: string;
  };
  navLogin: string;
  navSignup: string;

  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimary: string;
  heroSecondary: string;
  heroSupport: string;
  heroTrust: string[];
  videoCaption: string;

  companionsEyebrow: string;
  companionsTitle: string;
  companionsSubtitle: string;
  personas: Persona[];
  personaCta: string;
  personaCtaHint: string;

  howEyebrow: string;
  howTitle: string;
  howSteps: {
    number: string;
    title: string;
    text: string;
  }[];

  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefits: {
    icon: string;
    title: string;
    text: string;
  }[];

  differenceEyebrow: string;
  differenceTitle: string;
  differenceText: string;
  differenceItems: string[];

  demoEyebrow: string;
  demoTitle: string;
  demoSubtitle: string;
  demoUserLabel: string;
  demoUserMessage: string;
  demoAiLabel: string;
  demoAiMessage: string;
  demoCta: string;

  reviewsTitle: string;
  reviewsSubtitle: string;
  reviewsPrivacyNote: string;
  reviewsHelpfulLabel: string;
  reviewsYes: string;
  reviewsNo: string;
  reviews: ReviewCard[];

  pricingEyebrow: string;
  pricingTitle: string;
  pricingText: string;
  pricingBullets: string[];
  pricingPrimary: string;
  seePricingLabel: string;
  pricingNote: string;

  finalTitle: string;
  finalText: string;
  finalCta: string;

  faqEyebrow: string;
  faqTitle: string;
  safetyNote: string;
  faqs: {
    question: string;
    answer: string;
  }[];

  footerCopy: string;
  footerLinks: {
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    about: string;
  };
};

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

  const translation = REVIEW_TRANSLATIONS[item.id];
  if (!translation) return item.fr;

  return locale === "en" ? translation.en : translation.es;
}

const STRINGS: Record<Locale, Copy> = {
  fr: {
    brandTagline: "Crée ton compagnon IA • FR / EN / ES",
    nav: {
      home: "Accueil",
      companions: "Exemples",
      benefits: "Pourquoi AmorIAI",
      pricing: "Tarifs",
    },
    navLogin: "Me connecter",
    navSignup: "Créer mon AmorIAI",

    heroKicker: "CRÉE TON PROPRE COMPAGNON IA",
    heroTitle: "Imagine-le. Personnalise-le. Fais-en ton AmorIAI.",
    heroSubtitle:
      "Choisis la personnalité et la façon de communiquer qui te conviennent. Les compagnons présentés ici sont des exemples : après ton inscription, tu peux personnaliser ton propre AmorIAI et commencer à discuter.",
    heroPrimary: "Créer mon AmorIAI gratuitement",
    heroSecondary: "Voir des exemples",
    heroSupport:
      "Gratuit pour commencer • Personnalisable • Aucune application à télécharger",
    heroTrust: [
      "Ton propre compagnon",
      "Accessible 24 h/24",
      "Français, anglais et espagnol",
    ],
    videoCaption: "Un aperçu de l’expérience AmorIAI.",

    companionsEyebrow: "DES EXEMPLES POUR T’INSPIRER",
    companionsTitle:
      "Voici quelques AmorIAI possibles. Le tien peut être différent.",
    companionsSubtitle:
      "Lyra, Orion, Kai et Maelis sont des exemples de personnalités. Explore-les pour découvrir l’expérience, puis crée et personnalise ton propre AmorIAI.",
    personas: [
      {
        id: "lyra",
        title: "Lyra",
        badge: "Douce et rassurante",
        description:
          "Un exemple de compagnon chaleureux, calme et bienveillant pour les moments où tu as simplement envie de parler.",
      },
      {
        id: "orion",
        title: "Orion",
        badge: "Calme et structuré",
        description:
          "Un exemple de compagnon posé et structuré, avec une façon claire et réfléchie de poursuivre la conversation.",
      },
      {
        id: "kai",
        title: "Kai",
        badge: "Ouvert et nuancé",
        description:
          "Un exemple de compagnon ouvert, naturel et sans étiquette, pensé pour une conversation plus libre.",
      },
      {
        id: "maelis",
        title: "Maelis",
        badge: "Mature et réaliste",
        description:
          "Un exemple de compagnon posé, honnête et bienveillant, avec une personnalité plus mature.",
      },
    ],
    personaCta: "Créer le mien",
    personaCtaHint:
      "Exemple seulement • Tu peux personnaliser ton propre AmorIAI après l’inscription.",

    howEyebrow: "CRÉE TON EXPÉRIENCE",
    howTitle: "Ton AmorIAI en trois étapes.",
    howSteps: [
      {
        number: "01",
        title: "Crée ton compte",
        text: "L’inscription prend seulement quelques instants et tu peux commencer gratuitement.",
      },
      {
        number: "02",
        title: "Crée ton AmorIAI",
        text: "Personnalise ton compagnon et choisis la personnalité et la façon de communiquer qui te conviennent.",
      },
      {
        number: "03",
        title: "Commence à discuter",
        text: "Écris librement. Ton compagnon te répond et adapte progressivement ses échanges à votre conversation.",
      },
    ],

    benefitsEyebrow: "TON COMPAGNON, À TA FAÇON",
    benefitsTitle:
      "Une expérience plus personnelle qu’un simple chat avec une IA.",
    benefitsSubtitle:
      "Les personnages que tu vois sur cette page servent d’exemples. Le but d’AmorIAI est de te permettre de créer une expérience qui te convient.",
    benefits: [
      {
        icon: "✨",
        title: "Ton propre AmorIAI",
        text: "Après l’inscription, personnalise ton compagnon au lieu d’être limité aux personnages d’exemple.",
      },
      {
        icon: "🎭",
        title: "Sa personnalité",
        text: "Choisis une personnalité et une façon de communiquer qui correspondent à l’expérience que tu recherches.",
      },
      {
        icon: "💬",
        title: "Des échanges personnalisés",
        text: "Ton compagnon répond à ce que tu écris et adapte progressivement la conversation à vos échanges.",
      },
      {
        icon: "🕒",
        title: "Disponible quand tu veux",
        text: "Retrouve ton compagnon sur mobile, tablette ou ordinateur, directement dans ton navigateur.",
      },
      {
        icon: "🎙️",
        title: "La voix avec l’abonnement",
        text: "Selon la formule choisie, tu peux aussi accéder aux fonctions vocales d’AmorIAI.",
      },
      {
        icon: "🌍",
        title: "Trois langues",
        text: "Utilise AmorIAI en français, en anglais ou en espagnol.",
      },
    ],

    differenceEyebrow: "POURQUOI AMORIAI",
    differenceTitle:
      "Pas un personnage imposé. Un compagnon que tu peux personnaliser.",
    differenceText:
      "Les compagnons affichés sur la page te montrent différentes possibilités. Après ton inscription, l’expérience ne s’arrête pas à Lyra, Orion, Kai ou Maelis : tu peux personnaliser ton propre AmorIAI et poursuivre la conversation à ta façon.",
    differenceItems: [
      "Des personnages d’exemple pour découvrir l’expérience",
      "Ton propre compagnon personnalisable après l’inscription",
      "Une personnalité et une façon de communiquer adaptées à tes préférences",
      "Des réponses immédiates et personnalisées",
      "Un fil de conversation que tu peux reprendre",
      "La voix disponible selon l’abonnement",
    ],

    demoEyebrow: "UNE CONVERSATION QUI TE RESSEMBLE",
    demoTitle: "Ton AmorIAI parle avec la personnalité que tu as choisie.",
    demoSubtitle:
      "Tu n’as pas besoin d’utiliser un compagnon prédéfini. Crée le tien, puis commence simplement à discuter.",
    demoUserLabel: "Toi",
    demoUserMessage:
      "J’ai envie de parler un peu, mais de quelque chose de léger ce soir.",
    demoAiLabel: "Ton AmorIAI",
    demoAiMessage:
      "Avec plaisir. On garde ça léger. Tu veux me raconter ta journée ou partir sur quelque chose de plus amusant?",
    demoCta: "Créer mon propre AmorIAI",

    reviewsTitle: "Ils ont commencé par quelques mots",
    reviewsSubtitle:
      "Des utilisateurs racontent ce qu’AmorIAI leur apporte au quotidien.",
    reviewsPrivacyNote:
      "Consulte notre politique de confidentialité pour savoir comment tes données sont traitées.",
    reviewsHelpfulLabel: "Cet avis est-il utile?",
    reviewsYes: "Oui",
    reviewsNo: "Non",
    reviews: REVIEWS_FR,

    pricingEyebrow: "COMMENCE GRATUITEMENT",
    pricingTitle: "Crée ton AmorIAI. Décide ensuite.",
    pricingText:
      "Tu peux commencer gratuitement. Une formule payante est offerte si tu souhaites davantage d’échanges et l’accès à certaines fonctions comme la voix.",
    pricingBullets: [
      "Création de compte gratuite",
      "Personnalisation de ton propre compagnon",
      "Aucune application à installer",
      "Détails complets sur la page des tarifs",
    ],
    pricingPrimary: "Créer mon AmorIAI gratuitement",
    seePricingLabel: "Voir les tarifs",
    pricingNote:
      "Les limites et conditions du forfait gratuit sont indiquées lors de l’inscription.",

    finalTitle: "Ton AmorIAI n’existe pas encore. Crée-le.",
    finalText:
      "Commence avec les exemples si tu veux t’inspirer, puis personnalise ton propre compagnon et lance votre première conversation.",
    finalCta: "Créer mon AmorIAI",

    faqEyebrow: "QUESTIONS FRÉQUENTES",
    faqTitle: "Avant de créer ton AmorIAI",
    safetyNote:
      "AmorIAI est un compagnon conversationnel. Il ne remplace pas les services médicaux, psychologiques ou d’urgence.",
    faqs: [
      {
        question: "Est-ce que Lyra, Orion, Kai et Maelis sont mes seuls choix?",
        answer:
          "Non. Ce sont des exemples de compagnons. Après ton inscription, tu peux personnaliser ton propre AmorIAI.",
      },
      {
        question: "Puis-je créer mon propre compagnon?",
        answer:
          "Oui. AmorIAI te permet de personnaliser ton propre compagnon et sa façon d’échanger avec toi.",
      },
      {
        question: "Est-ce qu’AmorIAI est gratuit?",
        answer:
          "Tu peux commencer gratuitement. Les limites du forfait gratuit et les options payantes sont présentées lors de l’inscription et sur la page des tarifs.",
      },
      {
        question: "Puis-je l’utiliser sur mon téléphone?",
        answer:
          "Oui. AmorIAI fonctionne directement dans le navigateur de ton téléphone, de ta tablette ou de ton ordinateur, sans application à télécharger.",
      },
      {
        question: "AmorIAI remplace-t-il un psychologue?",
        answer:
          "Non. AmorIAI est un compagnon conversationnel et ne remplace pas un professionnel de la santé mentale, un diagnostic, un traitement ou les services d’urgence.",
      },
      {
        question: "Comment mes données sont-elles traitées?",
        answer:
          "Les détails sur la collecte, l’utilisation et la conservation des données se trouvent dans la politique de confidentialité d’AmorIAI.",
      },
    ],

    footerCopy: `© ${new Date().getFullYear()} AmorIAI.app`,
    footerLinks: {
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      terms: "Conditions d’utilisation",
      contact: "Contact",
      about: "À propos",
    },
  },

  en: {
    brandTagline: "Create your AI companion • FR / EN / ES",
    nav: {
      home: "Home",
      companions: "Examples",
      benefits: "Why AmorIAI",
      pricing: "Pricing",
    },
    navLogin: "Log in",
    navSignup: "Create my AmorIAI",

    heroKicker: "CREATE YOUR OWN AI COMPANION",
    heroTitle: "Imagine them. Personalize them. Make them your AmorIAI.",
    heroSubtitle:
      "Choose the personality and communication style that feel right for you. The companions shown here are examples: after signing up, you can personalize your own AmorIAI and start chatting.",
    heroPrimary: "Create my AmorIAI for free",
    heroSecondary: "See examples",
    heroSupport: "Free to start • Customizable • No app required",
    heroTrust: [
      "Your own companion",
      "Available 24/7",
      "French, English and Spanish",
    ],
    videoCaption: "A quick look at the AmorIAI experience.",

    companionsEyebrow: "EXAMPLES TO INSPIRE YOU",
    companionsTitle:
      "Here are a few possible AmorIAI companions. Yours can be different.",
    companionsSubtitle:
      "Lyra, Orion, Kai and Maelis are examples of different personalities. Explore them to discover the experience, then create and personalize your own AmorIAI.",
    personas: [
      {
        id: "lyra",
        title: "Lyra",
        badge: "Gentle and reassuring",
        description:
          "An example of a warm, calm and caring companion for moments when you simply feel like talking.",
      },
      {
        id: "orion",
        title: "Orion",
        badge: "Calm and structured",
        description:
          "An example of a thoughtful and structured companion with a clear, grounded way of continuing the conversation.",
      },
      {
        id: "kai",
        title: "Kai",
        badge: "Open and nuanced",
        description:
          "An example of an open, natural companion designed for a freer, less formal kind of conversation.",
      },
      {
        id: "maelis",
        title: "Maelis",
        badge: "Mature and grounded",
        description:
          "An example of a steady, honest and caring companion with a more mature personality.",
      },
    ],
    personaCta: "Create mine",
    personaCtaHint:
      "Example only • You can personalize your own AmorIAI after signing up.",

    howEyebrow: "CREATE YOUR EXPERIENCE",
    howTitle: "Your AmorIAI in three steps.",
    howSteps: [
      {
        number: "01",
        title: "Create your account",
        text: "Signing up only takes a moment, and you can start for free.",
      },
      {
        number: "02",
        title: "Create your AmorIAI",
        text: "Personalize your companion and choose the personality and communication style that feel right for you.",
      },
      {
        number: "03",
        title: "Start chatting",
        text: "Write freely. Your companion responds and gradually adapts the conversation to your exchanges.",
      },
    ],

    benefitsEyebrow: "YOUR COMPANION, YOUR WAY",
    benefitsTitle:
      "A more personal experience than a simple AI chat.",
    benefitsSubtitle:
      "The characters you see on this page are examples. AmorIAI is designed to let you create an experience that fits you.",
    benefits: [
      {
        icon: "✨",
        title: "Your own AmorIAI",
        text: "After signing up, personalize your companion instead of being limited to the example characters.",
      },
      {
        icon: "🎭",
        title: "Their personality",
        text: "Choose a personality and communication style that match the experience you want.",
      },
      {
        icon: "💬",
        title: "Personalized exchanges",
        text: "Your companion responds to what you write and gradually adapts the conversation to your exchanges.",
      },
      {
        icon: "🕒",
        title: "Available when you want",
        text: "Return to your companion on mobile, tablet or computer, directly in your browser.",
      },
      {
        icon: "🎙️",
        title: "Voice with a subscription",
        text: "Depending on your plan, you can also access AmorIAI voice features.",
      },
      {
        icon: "🌍",
        title: "Three languages",
        text: "Use AmorIAI in French, English or Spanish.",
      },
    ],

    differenceEyebrow: "WHY AMORIAI",
    differenceTitle:
      "Not a character chosen for you. A companion you can personalize.",
    differenceText:
      "The companions shown on this page demonstrate different possibilities. After signing up, the experience is not limited to Lyra, Orion, Kai or Maelis: you can personalize your own AmorIAI and continue the conversation your way.",
    differenceItems: [
      "Example characters to discover the experience",
      "Your own customizable companion after signup",
      "A personality and communication style based on your preferences",
      "Immediate and personalized replies",
      "A conversation you can return to",
      "Voice available depending on your plan",
    ],

    demoEyebrow: "A CONVERSATION THAT FEELS LIKE YOURS",
    demoTitle: "Your AmorIAI speaks with the personality you chose.",
    demoSubtitle:
      "You do not have to use a predefined companion. Create your own, then simply start chatting.",
    demoUserLabel: "You",
    demoUserMessage:
      "I feel like talking for a bit, but I want to keep things light tonight.",
    demoAiLabel: "Your AmorIAI",
    demoAiMessage:
      "Absolutely. We can keep it light. Want to tell me about your day, or should we switch to something more fun?",
    demoCta: "Create my own AmorIAI",

    reviewsTitle: "They started with just a few words",
    reviewsSubtitle: "Users share how AmorIAI fits into their daily lives.",
    reviewsPrivacyNote:
      "See our privacy policy to learn how your data is handled.",
    reviewsHelpfulLabel: "Was this review helpful?",
    reviewsYes: "Yes",
    reviewsNo: "No",
    reviews: REVIEWS_FR,

    pricingEyebrow: "START FOR FREE",
    pricingTitle: "Create your AmorIAI. Decide later.",
    pricingText:
      "You can start for free. A paid plan is available if you want more conversations and access to certain features such as voice.",
    pricingBullets: [
      "Free account creation",
      "Personalize your own companion",
      "No application to install",
      "Full details on the pricing page",
    ],
    pricingPrimary: "Create my AmorIAI for free",
    seePricingLabel: "See pricing",
    pricingNote:
      "Free-plan limits and conditions are shown during signup.",

    finalTitle: "Your AmorIAI does not exist yet. Create them.",
    finalText:
      "Start with the examples if you want inspiration, then personalize your own companion and begin your first conversation.",
    finalCta: "Create my AmorIAI",

    faqEyebrow: "FREQUENTLY ASKED QUESTIONS",
    faqTitle: "Before creating your AmorIAI",
    safetyNote:
      "AmorIAI is a conversational companion. It does not replace medical, psychological or emergency services.",
    faqs: [
      {
        question: "Are Lyra, Orion, Kai and Maelis my only choices?",
        answer:
          "No. They are example companions. After signing up, you can personalize your own AmorIAI.",
      },
      {
        question: "Can I create my own companion?",
        answer:
          "Yes. AmorIAI lets you personalize your own companion and the way they communicate with you.",
      },
      {
        question: "Is AmorIAI free?",
        answer:
          "You can start for free. Free-plan limits and paid options are shown during signup and on the pricing page.",
      },
      {
        question: "Can I use it on my phone?",
        answer:
          "Yes. AmorIAI works directly in your phone, tablet or computer browser, with no application to download.",
      },
      {
        question: "Does AmorIAI replace a therapist?",
        answer:
          "No. AmorIAI is a conversational companion and does not replace a mental-health professional, diagnosis, treatment or emergency services.",
      },
      {
        question: "How is my data handled?",
        answer:
          "Details about data collection, use and retention are available in AmorIAI’s privacy policy.",
      },
    ],

    footerCopy: `© ${new Date().getFullYear()} AmorIAI.app`,
    footerLinks: {
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms of use",
      contact: "Contact",
      about: "About",
    },
  },

  es: {
    brandTagline: "Crea tu compañero de IA • FR / EN / ES",
    nav: {
      home: "Inicio",
      companions: "Ejemplos",
      benefits: "Por qué AmorIAI",
      pricing: "Precios",
    },
    navLogin: "Iniciar sesión",
    navSignup: "Crear mi AmorIAI",

    heroKicker: "CREA TU PROPIO COMPAÑERO DE IA",
    heroTitle: "Imagínalo. Personalízalo. Hazlo tu AmorIAI.",
    heroSubtitle:
      "Elige la personalidad y la forma de comunicarse que mejor se adapten a ti. Los compañeros que aparecen aquí son ejemplos: después de registrarte, puedes personalizar tu propio AmorIAI y empezar a conversar.",
    heroPrimary: "Crear mi AmorIAI gratis",
    heroSecondary: "Ver ejemplos",
    heroSupport: "Gratis para empezar • Personalizable • Sin aplicación",
    heroTrust: [
      "Tu propio compañero",
      "Disponible las 24 horas",
      "Francés, inglés y español",
    ],
    videoCaption: "Una vista rápida de la experiencia AmorIAI.",

    companionsEyebrow: "EJEMPLOS PARA INSPIRARTE",
    companionsTitle:
      "Estos son algunos AmorIAI posibles. El tuyo puede ser diferente.",
    companionsSubtitle:
      "Lyra, Orion, Kai y Maelis son ejemplos de distintas personalidades. Explóralos para descubrir la experiencia y después crea y personaliza tu propio AmorIAI.",
    personas: [
      {
        id: "lyra",
        title: "Lyra",
        badge: "Dulce y tranquilizadora",
        description:
          "Un ejemplo de compañera cálida, tranquila y comprensiva para esos momentos en los que simplemente quieres hablar.",
      },
      {
        id: "orion",
        title: "Orion",
        badge: "Calmo y estructurado",
        description:
          "Un ejemplo de compañero reflexivo y estructurado, con una forma clara y serena de continuar la conversación.",
      },
      {
        id: "kai",
        title: "Kai",
        badge: "Abierto y matizado",
        description:
          "Un ejemplo de compañero abierto y natural, pensado para una conversación más libre y sin etiquetas.",
      },
      {
        id: "maelis",
        title: "Maelis",
        badge: "Maduro y realista",
        description:
          "Un ejemplo de compañero estable, honesto y comprensivo, con una personalidad más madura.",
      },
    ],
    personaCta: "Crear el mío",
    personaCtaHint:
      "Solo es un ejemplo • Puedes personalizar tu propio AmorIAI después de registrarte.",

    howEyebrow: "CREA TU EXPERIENCIA",
    howTitle: "Tu AmorIAI en tres pasos.",
    howSteps: [
      {
        number: "01",
        title: "Crea tu cuenta",
        text: "Registrarte toma solo unos instantes y puedes empezar gratis.",
      },
      {
        number: "02",
        title: "Crea tu AmorIAI",
        text: "Personaliza tu compañero y elige la personalidad y la forma de comunicarse que mejor se adapten a ti.",
      },
      {
        number: "03",
        title: "Empieza a conversar",
        text: "Escribe libremente. Tu compañero responde y adapta poco a poco la conversación a vuestros intercambios.",
      },
    ],

    benefitsEyebrow: "TU COMPAÑERO, A TU MANERA",
    benefitsTitle:
      "Una experiencia más personal que un simple chat con IA.",
    benefitsSubtitle:
      "Los personajes que ves en esta página son ejemplos. AmorIAI está pensado para que puedas crear una experiencia que se adapte a ti.",
    benefits: [
      {
        icon: "✨",
        title: "Tu propio AmorIAI",
        text: "Después de registrarte, personaliza tu compañero en lugar de limitarte a los personajes de ejemplo.",
      },
      {
        icon: "🎭",
        title: "Su personalidad",
        text: "Elige una personalidad y una forma de comunicarse que coincidan con la experiencia que buscas.",
      },
      {
        icon: "💬",
        title: "Intercambios personalizados",
        text: "Tu compañero responde a lo que escribes y adapta poco a poco la conversación a vuestros intercambios.",
      },
      {
        icon: "🕒",
        title: "Disponible cuando quieras",
        text: "Vuelve a tu compañero desde el móvil, la tableta o la computadora, directamente en tu navegador.",
      },
      {
        icon: "🎙️",
        title: "Voz con suscripción",
        text: "Según el plan elegido, también puedes acceder a las funciones de voz de AmorIAI.",
      },
      {
        icon: "🌍",
        title: "Tres idiomas",
        text: "Utiliza AmorIAI en francés, inglés o español.",
      },
    ],

    differenceEyebrow: "POR QUÉ AMORIAI",
    differenceTitle:
      "No un personaje impuesto. Un compañero que puedes personalizar.",
    differenceText:
      "Los compañeros de esta página muestran diferentes posibilidades. Después de registrarte, la experiencia no se limita a Lyra, Orion, Kai o Maelis: puedes personalizar tu propio AmorIAI y continuar la conversación a tu manera.",
    differenceItems: [
      "Personajes de ejemplo para descubrir la experiencia",
      "Tu propio compañero personalizable después del registro",
      "Una personalidad y una forma de comunicarse según tus preferencias",
      "Respuestas inmediatas y personalizadas",
      "Una conversación que puedes retomar",
      "Voz disponible según el plan",
    ],

    demoEyebrow: "UNA CONVERSACIÓN QUE SE ADAPTA A TI",
    demoTitle: "Tu AmorIAI habla con la personalidad que elegiste.",
    demoSubtitle:
      "No tienes que usar un compañero predefinido. Crea el tuyo y después empieza simplemente a conversar.",
    demoUserLabel: "Tú",
    demoUserMessage:
      "Quiero hablar un poco, pero esta noche prefiero algo ligero.",
    demoAiLabel: "Tu AmorIAI",
    demoAiMessage:
      "Claro. Lo mantenemos ligero. ¿Quieres contarme cómo fue tu día o prefieres que hablemos de algo más divertido?",
    demoCta: "Crear mi propio AmorIAI",

    reviewsTitle: "Empezaron con unas pocas palabras",
    reviewsSubtitle:
      "Usuarios cuentan cómo AmorIAI forma parte de su día a día.",
    reviewsPrivacyNote:
      "Consulta nuestra política de privacidad para saber cómo tratamos tus datos.",
    reviewsHelpfulLabel: "¿Te fue útil esta reseña?",
    reviewsYes: "Sí",
    reviewsNo: "No",
    reviews: REVIEWS_FR,

    pricingEyebrow: "EMPIEZA GRATIS",
    pricingTitle: "Crea tu AmorIAI. Decide después.",
    pricingText:
      "Puedes empezar gratis. Hay un plan de pago si quieres más conversaciones y acceso a determinadas funciones, como la voz.",
    pricingBullets: [
      "Creación de cuenta gratuita",
      "Personaliza tu propio compañero",
      "Sin aplicación que instalar",
      "Todos los detalles en la página de precios",
    ],
    pricingPrimary: "Crear mi AmorIAI gratis",
    seePricingLabel: "Ver precios",
    pricingNote:
      "Los límites y condiciones del plan gratuito aparecen durante el registro.",

    finalTitle: "Tu AmorIAI todavía no existe. Créalo.",
    finalText:
      "Empieza con los ejemplos si buscas inspiración, después personaliza tu propio compañero y comienza vuestra primera conversación.",
    finalCta: "Crear mi AmorIAI",

    faqEyebrow: "PREGUNTAS FRECUENTES",
    faqTitle: "Antes de crear tu AmorIAI",
    safetyNote:
      "AmorIAI es un compañero conversacional. No sustituye a los servicios médicos, psicológicos ni de emergencia.",
    faqs: [
      {
        question: "¿Lyra, Orion, Kai y Maelis son mis únicas opciones?",
        answer:
          "No. Son compañeros de ejemplo. Después de registrarte, puedes personalizar tu propio AmorIAI.",
      },
      {
        question: "¿Puedo crear mi propio compañero?",
        answer:
          "Sí. AmorIAI te permite personalizar tu propio compañero y la forma en que se comunica contigo.",
      },
      {
        question: "¿AmorIAI es gratis?",
        answer:
          "Puedes empezar gratis. Los límites del plan gratuito y las opciones de pago se muestran durante el registro y en la página de precios.",
      },
      {
        question: "¿Puedo usarlo en mi teléfono?",
        answer:
          "Sí. AmorIAI funciona directamente en el navegador de tu teléfono, tableta o computadora, sin descargar una aplicación.",
      },
      {
        question: "¿AmorIAI reemplaza a un psicólogo?",
        answer:
          "No. AmorIAI es un compañero conversacional y no sustituye a un profesional de salud mental, un diagnóstico, un tratamiento ni los servicios de emergencia.",
      },
      {
        question: "¿Cómo se tratan mis datos?",
        answer:
          "Los detalles sobre la recopilación, el uso y la conservación de datos se encuentran en la política de privacidad de AmorIAI.",
      },
    ],

    footerCopy: `© ${new Date().getFullYear()} AmorIAI.app`,
    footerLinks: {
      legal: "Aviso legal",
      privacy: "Política de privacidad",
      terms: "Términos de uso",
      contact: "Contacto",
      about: "Acerca de",
    },
  },
};

function getLocaleFromSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}): Locale {
  const raw = searchParams.lang;
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (value === "fr" || value === "en" || value === "es") {
    return value;
  }

  return "fr";
}

type PageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
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

  const withLangPricingPublic = () => ({
    pathname: "/pricing-public",
    query: { lang: locale },
  });

  const mappedReviews = t.reviews.map((review) => ({
    id: review.id,
    name: review.name,
    date: review.date,
    rating: review.rating,
    text: translateReview(review, locale),
  }));

  const thanksTitle =
    locale === "fr" ? "Merci!" : locale === "en" ? "Thanks!" : "¡Gracias!";

  const thanksHint =
    locale === "fr"
      ? "Ton vote a été enregistré."
      : locale === "en"
        ? "Your vote has been saved."
        : "Tu voto se ha guardado.";

  const alreadyAccountText =
    locale === "fr"
      ? "Déjà un compte?"
      : locale === "en"
        ? "Already have an account?"
        : "¿Ya tienes una cuenta?";

  const loginInlineLabel =
    locale === "fr"
      ? "Me connecter"
      : locale === "en"
        ? "Log in"
        : "Iniciar sesión";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "AmorIAI",
        url: "https://www.amoriai.app",
        inLanguage: locale,
      },
      {
        "@type": "Organization",
        name: "AmorIAI",
        url: "https://www.amoriai.app",
        logo: "https://www.amoriai.app/AmorIA_logo_transparent.png",
      },
      {
        "@type": "FAQPage",
        mainEntity: t.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="amoria-page min-h-screen overflow-hidden text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div
        className="amoria-page-glow pointer-events-none fixed inset-0"
        aria-hidden="true"
      />

      <header className="amoria-header sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href={{ pathname: "/", query: { lang: locale } }}
            className="flex items-center gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmorIAI.app"
              className="h-10 w-auto"
              draggable={false}
            />
            <div>
              <div className="text-sm font-bold tracking-wide">AmorIAI.app</div>
              <div className="text-[0.68rem] text-slate-400">
                {t.brandTagline}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
            <a href="#hero" className="transition hover:text-white">
              {t.nav.home}
            </a>
            <a href="#companions" className="transition hover:text-white">
              {t.nav.companions}
            </a>
            <a href="#benefits" className="transition hover:text-white">
              {t.nav.benefits}
            </a>
            <a href="#pricing" className="transition hover:text-white">
              {t.nav.pricing}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-[0.68rem]">
              {(["fr", "en", "es"] as Locale[]).map((code) => (
                <Link
                  key={code}
                  href={{ pathname: "/", query: { lang: code } }}
                  className={`rounded-full px-2.5 py-1 font-semibold transition ${
                    locale === code
                      ? "bg-white text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {code.toUpperCase()}
                </Link>
              ))}
            </div>

            <Link
              href={withLang("/login")}
              className="hidden rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 md:inline-flex"
            >
              {t.navLogin}
            </Link>

            <Link
              href={withLang("/signup")}
              className="amoria-nav-cta hidden rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-500/20 sm:inline-flex"
            >
              {t.navSignup}
            </Link>
          </div>
        </div>
      </header>

      <section
        id="hero"
        className="amoria-hero relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:pt-20"
      >
        <div className="amoria-hero-copy relative z-10">
          <div className="mb-5 inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-[0.72rem] font-bold tracking-[0.16em] text-violet-200">
            {t.heroKicker}
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {t.heroTitle}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {t.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={withLang("/signup")}
              className="amoria-button amoria-button-primary inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/25"
            >
              {t.heroPrimary}
            </Link>

            <a
              href="#companions"
              className="amoria-button amoria-button-secondary inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white"
            >
              {t.heroSecondary}
            </a>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            {alreadyAccountText}{" "}
            <Link
              href={withLang("/login")}
              className="font-bold text-violet-300 hover:text-violet-200"
            >
              {loginInlineLabel}
            </Link>
          </div>

          <p className="mt-5 text-xs leading-6 text-slate-400">
            {t.heroSupport}
          </p>

          <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
            {t.heroTrust.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.035] px-3 py-3 text-xs text-slate-300"
              >
                <span className="text-emerald-400">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="amoria-hero-visual relative mx-auto w-full max-w-2xl">
          <div className="amoria-hero-halo absolute -inset-8 rounded-[3rem]" />

          <div className="relative grid gap-5 sm:grid-cols-[0.95fr_1.05fr]">
            <div className="amoria-hero-video overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 p-2 shadow-2xl shadow-black/50">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                className="block aspect-[4/5] w-full rounded-[1.55rem] bg-black object-cover"
                src={heroVideoSrc}
                controls
                loop
                playsInline
                preload="metadata"
              />
            </div>

            <div className="amoria-hero-chat self-center rounded-[2rem] border border-white/10 bg-zinc-950/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-black">
                  A
                </div>
                <div>
                  <div className="text-xs font-bold">{t.demoAiLabel}</div>
                  <div className="text-[0.65rem] text-emerald-400">
                    ●{" "}
                    {locale === "fr"
                      ? "En ligne"
                      : locale === "en"
                        ? "Online"
                        : "En línea"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="amoria-message amoria-message-user ml-auto max-w-[92%]">
                  <div className="rounded-2xl rounded-br-md bg-white px-3.5 py-2.5 text-xs leading-5 text-zinc-950">
                    {t.demoUserMessage}
                  </div>
                </div>

                <div className="amoria-message amoria-message-ai max-w-[95%]">
                  <div className="rounded-2xl rounded-bl-md border border-violet-400/15 bg-violet-500/10 px-3.5 py-2.5 text-xs leading-5 text-slate-100">
                    {t.demoAiMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-slate-500">
            {t.videoCaption}
          </p>
        </div>
      </section>

      <section
        id="companions"
        className="amoria-reveal relative border-y border-white/5 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
              {t.companionsEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {t.companionsTitle}
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              {t.companionsSubtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {t.personas.map((persona) => (
              <article
                key={persona.id}
                className="amoria-card amoria-persona-card group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-xl shadow-black/20"
              >
                <div className="aspect-[4/5] overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    src={getPersonaVideoSrc(persona.id)}
                    controls
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>

                <div className="p-5">
                  <div className="inline-flex rounded-full bg-violet-500/10 px-3 py-1 text-[0.68rem] font-bold text-violet-200">
                    {persona.badge}
                  </div>
                  <h3 className="mt-3 text-xl font-black">{persona.title}</h3>
                  <p className="mt-2 min-h-[6rem] text-sm leading-6 text-slate-300">
                    {persona.description}
                  </p>

                  <Link
                    href={withLang("/signup")}
                    className="amoria-button amoria-button-primary mt-5 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white"
                  >
                    {t.personaCta}
                  </Link>

                  <p className="mt-3 text-center text-[0.7rem] leading-5 text-slate-500">
                    {t.personaCtaHint}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="amoria-reveal relative mx-auto max-w-6xl px-4 py-20"
      >
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
            {t.howEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            {t.howTitle}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.howSteps.map((step) => (
            <article
              key={step.number}
              className="amoria-card amoria-step-card rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="text-4xl font-black text-white/10">
                {step.number}
              </div>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="benefits"
        className="amoria-reveal relative border-y border-white/5 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
              {t.benefitsEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {t.benefitsTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {t.benefitsSubtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="amoria-card amoria-benefit-card rounded-3xl border border-white/10 bg-zinc-950/80 p-6"
              >
                <div className="text-3xl" aria-hidden="true">
                  {benefit.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="amoria-reveal relative mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
            {t.differenceEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            {t.differenceTitle}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            {t.differenceText}
          </p>

          <Link
            href={withLang("/signup")}
            className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
          >
            {t.heroPrimary}
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {t.differenceItems.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-200"
            >
              <span className="mt-0.5 text-emerald-400">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="amoria-reveal relative border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
              {t.demoEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {t.demoTitle}
            </h2>
            <p className="mt-4 max-w-xl leading-8 text-slate-300">
              {t.demoSubtitle}
            </p>

            <Link
              href={withLang("/signup")}
              className="amoria-button amoria-button-primary mt-7 inline-flex rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/20"
            >
              {t.demoCta}
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/30 sm:p-7">
            <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-black">
                A
              </div>
              <div>
                <div className="text-sm font-bold">{t.demoAiLabel}</div>
                <div className="text-xs text-emerald-400">
                  ●{" "}
                  {locale === "fr"
                    ? "En ligne"
                    : locale === "en"
                      ? "Online"
                      : "En línea"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="ml-auto max-w-[85%]">
                <div className="mb-1 text-right text-[0.68rem] font-bold text-slate-500">
                  {t.demoUserLabel}
                </div>
                <div className="rounded-2xl rounded-br-md bg-white px-4 py-3 text-sm leading-6 text-slate-950">
                  {t.demoUserMessage}
                </div>
              </div>

              <div className="max-w-[88%]">
                <div className="mb-1 text-[0.68rem] font-bold text-violet-300">
                  {t.demoAiLabel}
                </div>
                <div className="rounded-2xl rounded-bl-md border border-violet-400/15 bg-violet-500/10 px-4 py-3 text-sm leading-6 text-slate-100">
                  {t.demoAiMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative border-y border-white/5 bg-white/[0.02]">
        <ReviewsSection
          locale={locale}
          title={t.reviewsTitle}
          subtitle={t.reviewsSubtitle}
          privacyNote={t.reviewsPrivacyNote}
          helpfulLabel={t.reviewsHelpfulLabel}
          yesLabel={t.reviewsYes}
          noLabel={t.reviewsNo}
          thanksTitle={thanksTitle}
          thanksHint={thanksHint}
          reviews={mappedReviews}
        />
      </div>

      <section
        id="pricing"
        className="amoria-reveal relative mx-auto max-w-6xl px-4 py-20"
      >
        <div className="overflow-hidden rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-zinc-950 to-fuchsia-500/5 p-7 shadow-2xl shadow-black/30 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
                {t.pricingEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                {t.pricingTitle}
              </h2>
              <p className="mt-4 max-w-2xl leading-8 text-slate-300">
                {t.pricingText}
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {t.pricingBullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-200"
                  >
                    <span className="text-emerald-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <Link
                href={withLang("/signup")}
                className="amoria-button amoria-button-primary inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-500/20"
              >
                {t.pricingPrimary}
              </Link>

              <Link
                href={withLangPricingPublic()}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {t.seePricingLabel}
              </Link>

              <p className="mt-4 text-center text-xs text-slate-400">
                {t.pricingNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="amoria-reveal relative border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
              {t.faqEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {t.faqTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              {t.safetyNote}
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {t.faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-white">
                  <span>{item.question}</span>
                  <span className="text-lg font-light text-violet-300 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="amoria-reveal relative mx-auto max-w-4xl px-4 pb-24 pt-20 text-center">
        <h2 className="text-3xl font-black sm:text-4xl">{t.finalTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">
          {t.finalText}
        </p>
        <Link
          href={withLang("/signup")}
          className="mt-7 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
        >
          {t.finalCta}
        </Link>
      </section>

      <footer className="relative border-t border-white/5 bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-xs text-slate-400 md:flex-row md:text-left">
          <div>{t.footerCopy}</div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href={withLang("/legal")} className="hover:text-white">
              {t.footerLinks.legal}
            </Link>
            <Link
              href={withLang("/legal/privacy")}
              className="hover:text-white"
            >
              {t.footerLinks.privacy}
            </Link>
            <Link href={withLang("/legal/terms")} className="hover:text-white">
              {t.footerLinks.terms}
            </Link>
            <Link href={withLang("/contact")} className="hover:text-white">
              {t.footerLinks.contact}
            </Link>
            <Link href={withLang("/about")} className="hover:text-white">
              {t.footerLinks.about}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
