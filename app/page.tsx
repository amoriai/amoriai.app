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
    brandTagline: "Ton compagnon IA • FR / EN / ES",
    nav: {
      home: "Accueil",
      companions: "Compagnons",
      benefits: "Pourquoi AmorIAI",
      pricing: "Tarifs",
    },
    navLogin: "Me connecter",
    navSignup: "Commencer gratuitement",

    heroKicker: "UN COMPAGNON IA QUI PREND LE TEMPS DE T’ÉCOUTER",
    heroTitle: "L’IA qui prend le temps de t’écouter.",
    heroSubtitle:
      "Parle à un compagnon IA disponible quand tu en as besoin. Écris ce que tu ressens, clarifie tes pensées et avance à ton rythme, sans pression.",
    heroPrimary: "Commencer gratuitement",
    heroSecondary: "Voir comment ça fonctionne",
    heroSupport: "Gratuit pour commencer • Sans engagement pour essayer • Aucune application à télécharger",
    heroTrust: [
      "Accessible 24 h/24",
      "Des réponses adaptées à tes échanges",
      "Français, anglais et espagnol",
    ],
    videoCaption: "Un aperçu de l’expérience AmorIAI.",

    companionsEyebrow: "CHOISIS TON EXPÉRIENCE",
    companionsTitle: "Choisis la personnalité qui te convient aujourd’hui.",
    companionsSubtitle:
      "Chaque compagnon possède une façon différente d’échanger. Commence avec celui qui correspond le mieux à ton besoin du moment.",
    personas: [
      {
        id: "lyra",
        title: "Lyra",
        badge: "Douce et rassurante",
        description:
          "Pour déposer ce que tu gardes à l’intérieur et recevoir une réponse calme, chaleureuse et bienveillante.",
      },
      {
        id: "orion",
        title: "Orion",
        badge: "Calme et structuré",
        description:
          "Pour mettre de l’ordre dans tes idées, prendre du recul et avancer plus clairement dans une décision.",
      },
      {
        id: "kai",
        title: "Kai",
        badge: "Ouvert et nuancé",
        description:
          "Pour parler librement, sans étiquette, sans pression et sans devoir expliquer qui tu devrais être.",
      },
      {
        id: "maelis",
        title: "Maelis",
        badge: "Mature et réaliste",
        description:
          "Pour recevoir une présence posée, honnête et bienveillante quand tu as besoin d’un regard plus stable.",
      },
    ],
    personaCta: "Choisir ce compagnon",
    personaCtaHint: "Tu pourras personnaliser ton propre AmorIAI après l’inscription.",

    howEyebrow: "SIMPLE À COMMENCER",
    howTitle: "Commence en moins d’une minute.",
    howSteps: [
      {
        number: "01",
        title: "Crée ton compte",
        text: "L’inscription prend seulement quelques instants et tu peux commencer gratuitement.",
      },
      {
        number: "02",
        title: "Choisis ton compagnon",
        text: "Sélectionne la personnalité qui correspond le mieux à ce dont tu as besoin aujourd’hui.",
      },
      {
        number: "03",
        title: "Commence la conversation",
        text: "Écris librement. Ton compagnon te répond et s’adapte progressivement à tes échanges.",
      },
    ],

    benefitsEyebrow: "UN ESPACE POUR TOI",
    benefitsTitle: "Un espace pour parler, réfléchir et souffler.",
    benefitsSubtitle:
      "Tu n’as pas besoin de tout expliquer. Commence simplement par la première chose qui te vient.",
    benefits: [
      {
        icon: "💬",
        title: "Besoin de parler",
        text: "Quand tu as quelque chose sur le cœur et que tu ne sais pas à qui le dire.",
      },
      {
        icon: "🧠",
        title: "Trop de pensées",
        text: "Quand ton esprit tourne en boucle et que tu veux remettre de l’ordre dans tes idées.",
      },
      {
        icon: "🌙",
        title: "Soirées difficiles",
        text: "Quand tout devient plus lourd le soir et que tu as besoin de déposer ce que tu ressens.",
      },
      {
        icon: "💔",
        title: "Rupture ou solitude",
        text: "Quand l’absence, le silence ou le manque deviennent difficiles à porter seul.",
      },
      {
        icon: "🧭",
        title: "Décision à prendre",
        text: "Quand tu hésites et que tu as besoin d’explorer calmement les différentes possibilités.",
      },
      {
        icon: "📖",
        title: "Journal interactif",
        text: "Quand tu veux écrire pour comprendre ce qui se passe en toi, avec une réponse en retour.",
      },
    ],

    differenceEyebrow: "POURQUOI AMORIAI",
    differenceTitle: "Plus qu’un journal. Une conversation qui continue avec toi.",
    differenceText:
      "AmorIAI transforme l’écriture en échange interactif. Reviens quand tu veux, poursuis la conversation et retrouve un espace pensé pour t’aider à mettre tes idées en mots.",
    differenceItems: [
      "Une personnalité adaptée à ton besoin",
      "Des réponses immédiates et personnalisées",
      "Une expérience simple sur mobile et ordinateur",
      "Un fil de conversation que tu peux reprendre",
      "La voix disponible avec l’abonnement",
      "Aucune pression pour trouver les mots parfaits",
    ],

    demoEyebrow: "VOIS COMMENT ÇA SE PASSE",
    demoTitle: "Une conversation peut commencer avec une seule phrase.",
    demoSubtitle:
      "AmorIAI répond à ce que tu écris et t’aide à poursuivre sans te forcer à tout expliquer.",
    demoUserLabel: "Toi",
    demoUserMessage: "J’ai la tête pleine et je ne sais même pas par où commencer.",
    demoAiLabel: "AmorIAI",
    demoAiMessage:
      "Tu n’as pas besoin de tout raconter d’un coup. Qu’est-ce qui prend le plus de place dans ta tête en ce moment?",
    demoCta: "Commencer ma propre conversation",

    reviewsTitle: "Ils ont commencé par quelques mots",
    reviewsSubtitle: "Des utilisateurs racontent ce qu’AmorIAI leur apporte au quotidien.",
    reviewsPrivacyNote: "Consulte notre politique de confidentialité pour savoir comment tes données sont traitées.",
    reviewsHelpfulLabel: "Cet avis est-il utile?",
    reviewsYes: "Oui",
    reviewsNo: "Non",
    reviews: REVIEWS_FR,

    pricingEyebrow: "COMMENCE SANS PRESSION",
    pricingTitle: "Commence gratuitement. Décide ensuite.",
    pricingText:
      "Découvre AmorIAI sans payer. Une formule payante est offerte seulement si tu souhaites davantage d’échanges et l’accès à la voix.",
    pricingBullets: [
      "Création de compte gratuite",
      "Accès immédiat à ton compagnon",
      "Aucune application à installer",
      "Les détails complets sont indiqués sur la page des tarifs",
    ],
    pricingPrimary: "Créer mon compte gratuit",
    seePricingLabel: "Voir les tarifs",
    pricingNote: "Les limites et conditions du forfait gratuit sont indiquées lors de l’inscription.",

    finalTitle: "Commence simplement par « Bonjour ».",
    finalText:
      "Tu peux écrire une phrase, une pensée ou ce que tu ressens maintenant. Ton compagnon t’aidera à poursuivre.",
    finalCta: "Parler à AmorIAI maintenant",

    faqEyebrow: "QUESTIONS FRÉQUENTES",
    faqTitle: "Avant de commencer",
    safetyNote: "AmorIAI est un compagnon conversationnel. Il ne remplace pas les services médicaux, psychologiques ou d’urgence.",
    faqs: [
      {
        question: "Est-ce qu’AmorIAI est gratuit?",
        answer:
          "Tu peux commencer gratuitement. Les limites du forfait gratuit et les options payantes sont présentées clairement lors de l’inscription et sur la page des tarifs.",
      },
      {
        question: "AmorIAI remplace-t-il un psychologue?",
        answer:
          "Non. AmorIAI est un compagnon conversationnel et ne remplace pas un professionnel de la santé mentale, un diagnostic, un traitement ou les services d’urgence.",
      },
      {
        question: "Puis-je l’utiliser sur mon téléphone?",
        answer:
          "Oui. AmorIAI fonctionne directement dans le navigateur de ton téléphone, de ta tablette ou de ton ordinateur, sans application à télécharger.",
      },
      {
        question: "Puis-je changer de compagnon?",
        answer:
          "Oui. Tu peux explorer différentes personnalités et choisir celle qui correspond le mieux à ton besoin du moment.",
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
    brandTagline: "Your AI companion • FR / EN / ES",
    nav: {
      home: "Home",
      companions: "Companions",
      benefits: "Why AmorIAI",
      pricing: "Pricing",
    },
    navLogin: "Log in",
    navSignup: "Start free",

    heroKicker: "AN AI COMPANION THAT TAKES TIME TO LISTEN",
    heroTitle: "The AI that takes time to listen.",
    heroSubtitle:
      "Talk to an AI companion whenever you need it. Put your thoughts into words, gain clarity and move forward at your own pace, without pressure.",
    heroPrimary: "Start for free",
    heroSecondary: "See how it works",
    heroSupport: "Free to start • No commitment to try • No app required",
    heroTrust: [
      "Available 24/7",
      "Replies adapted to your exchanges",
      "French, English and Spanish",
    ],
    videoCaption: "A quick look at the AmorIAI experience.",

    companionsEyebrow: "CHOOSE YOUR EXPERIENCE",
    companionsTitle: "Choose the personality that fits you today.",
    companionsSubtitle:
      "Each companion has a different way of communicating. Start with the one that best matches what you need right now.",
    personas: [
      {
        id: "lyra",
        title: "Lyra",
        badge: "Gentle and reassuring",
        description:
          "For sharing what you keep inside and receiving a calm, warm and caring response.",
      },
      {
        id: "orion",
        title: "Orion",
        badge: "Calm and structured",
        description:
          "For organizing your thoughts, taking a step back and moving more clearly through a decision.",
      },
      {
        id: "kai",
        title: "Kai",
        badge: "Open and nuanced",
        description:
          "For speaking freely, without labels, pressure or having to explain who you are supposed to be.",
      },
      {
        id: "maelis",
        title: "Maelis",
        badge: "Mature and grounded",
        description:
          "For a steady, honest and caring presence when you need a more balanced perspective.",
      },
    ],
    personaCta: "Choose this companion",
    personaCtaHint: "You can personalize your own AmorIAI after signing up.",

    howEyebrow: "EASY TO START",
    howTitle: "Start in less than a minute.",
    howSteps: [
      {
        number: "01",
        title: "Create your account",
        text: "Signing up only takes a moment, and you can start for free.",
      },
      {
        number: "02",
        title: "Choose your companion",
        text: "Select the personality that best matches what you need today.",
      },
      {
        number: "03",
        title: "Start the conversation",
        text: "Write freely. Your companion responds and gradually adapts to your exchanges.",
      },
    ],

    benefitsEyebrow: "A SPACE FOR YOU",
    benefitsTitle: "A place to talk, think and breathe.",
    benefitsSubtitle:
      "You do not need to explain everything. Start with the first thing that comes to mind.",
    benefits: [
      {
        icon: "💬",
        title: "Need to talk",
        text: "When something is weighing on you and you do not know who to tell.",
      },
      {
        icon: "🧠",
        title: "Too many thoughts",
        text: "When your mind keeps looping and you want to organize your ideas.",
      },
      {
        icon: "🌙",
        title: "Difficult evenings",
        text: "When everything feels heavier at night and you need somewhere to put it.",
      },
      {
        icon: "💔",
        title: "Breakup or loneliness",
        text: "When silence, absence or loneliness becomes difficult to carry alone.",
      },
      {
        icon: "🧭",
        title: "A decision to make",
        text: "When you are unsure and want to calmly explore your options.",
      },
      {
        icon: "📖",
        title: "Interactive journal",
        text: "When writing helps you understand yourself and you want a thoughtful reply.",
      },
    ],

    differenceEyebrow: "WHY AMORIAI",
    differenceTitle: "More than a journal. A conversation that continues with you.",
    differenceText:
      "AmorIAI turns writing into a real exchange. Come back whenever you want, continue where you left off and create a companion that feels right for you.",
    differenceItems: [
      "A personality suited to your needs",
      "Immediate and personalized replies",
      "A simple mobile and desktop experience",
      "A conversation you can return to",
      "Voice available with a subscription",
      "No pressure to find the perfect words",
    ],

    demoEyebrow: "SEE HOW IT FEELS",
    demoTitle: "A conversation can begin with one sentence.",
    demoSubtitle:
      "AmorIAI responds to what you write and helps you continue without making you explain everything at once.",
    demoUserLabel: "You",
    demoUserMessage: "My mind feels full and I do not even know where to begin.",
    demoAiLabel: "AmorIAI",
    demoAiMessage:
      "You do not need to tell me everything at once. What is taking up the most space in your mind right now?",
    demoCta: "Start my own conversation",

    reviewsTitle: "They started with just a few words",
    reviewsSubtitle: "Users share how AmorIAI fits into their daily lives.",
    reviewsPrivacyNote: "See our privacy policy to learn how your data is handled.",
    reviewsHelpfulLabel: "Was this review helpful?",
    reviewsYes: "Yes",
    reviewsNo: "No",
    reviews: REVIEWS_FR,

    pricingEyebrow: "START WITHOUT PRESSURE",
    pricingTitle: "Start free. Decide later.",
    pricingText:
      "Discover AmorIAI for free. A paid plan is available only if you want more conversations and access to voice.",
    pricingBullets: [
      "Free account creation",
      "Immediate access to your companion",
      "No application to install",
      "Full details are shown on the pricing page",
    ],
    pricingPrimary: "Create my free account",
    seePricingLabel: "See pricing",
    pricingNote: "Free-plan limits and conditions are shown during signup.",

    finalTitle: "Simply start with “Hello.”",
    finalText:
      "Simply write the first thing that comes to mind. Your AmorIAI companion will help you continue.",
    finalCta: "Talk to AmorIAI now",

    faqEyebrow: "FREQUENTLY ASKED QUESTIONS",
    faqTitle: "Before you start",
    safetyNote: "AmorIAI is a conversational companion. It does not replace medical, psychological or emergency services.",
    faqs: [
      {
        question: "Is AmorIAI free?",
        answer:
          "You can start for free. Free-plan limits and paid options are clearly shown during signup and on the pricing page.",
      },
      {
        question: "Does AmorIAI replace a therapist?",
        answer:
          "No. AmorIAI is a conversational companion and does not replace a mental-health professional, diagnosis, treatment or emergency services.",
      },
      {
        question: "Can I use it on my phone?",
        answer:
          "Yes. AmorIAI works directly in your phone, tablet or computer browser, with no application to download.",
      },
      {
        question: "Can I change companions?",
        answer:
          "Yes. You can explore different personalities and choose the one that best fits what you need at the time.",
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
    brandTagline: "Tu compañero de IA • FR / EN / ES",
    nav: {
      home: "Inicio",
      companions: "Compañeros",
      benefits: "Por qué AmorIAI",
      pricing: "Precios",
    },
    navLogin: "Iniciar sesión",
    navSignup: "Empezar gratis",

    heroKicker: "UN COMPAÑERO DE IA QUE SE TOMA EL TIEMPO DE ESCUCHARTE",
    heroTitle: "La IA que se toma el tiempo de escucharte.",
    heroSubtitle:
      "Habla con un compañero de IA cuando lo necesites. Expresa tus pensamientos, gana claridad y avanza a tu ritmo, sin presión.",
    heroPrimary: "Empezar gratis",
    heroSecondary: "Ver cómo funciona",
    heroSupport: "Gratis para empezar • Sin compromiso para probar • Sin aplicación",
    heroTrust: [
      "Disponible las 24 horas",
      "Respuestas adaptadas a tus intercambios",
      "Francés, inglés y español",
    ],
    videoCaption: "Una vista rápida de la experiencia AmorIAI.",

    companionsEyebrow: "ELIGE TU EXPERIENCIA",
    companionsTitle: "Elige la personalidad que te conviene hoy.",
    companionsSubtitle:
      "Cada compañero tiene una forma diferente de conversar. Empieza con el que mejor se adapte a lo que necesitas ahora.",
    personas: [
      {
        id: "lyra",
        title: "Lyra",
        badge: "Dulce y tranquilizadora",
        description:
          "Para expresar lo que guardas dentro y recibir una respuesta tranquila, cálida y comprensiva.",
      },
      {
        id: "orion",
        title: "Orion",
        badge: "Calmo y estructurado",
        description:
          "Para ordenar tus ideas, tomar distancia y avanzar con más claridad en una decisión.",
      },
      {
        id: "kai",
        title: "Kai",
        badge: "Abierto y matizado",
        description:
          "Para hablar libremente, sin etiquetas, sin presión y sin tener que justificar quién eres.",
      },
      {
        id: "maelis",
        title: "Maelis",
        badge: "Maduro y realista",
        description:
          "Para recibir una presencia estable, honesta y amable cuando necesitas otra perspectiva.",
      },
    ],
    personaCta: "Elegir este compañero",
    personaCtaHint: "Podrás personalizar tu propio AmorIAI después de registrarte.",

    howEyebrow: "FÁCIL DE EMPEZAR",
    howTitle: "Empieza en menos de un minuto.",
    howSteps: [
      {
        number: "01",
        title: "Crea tu cuenta",
        text: "Registrarte toma solo unos instantes y puedes empezar gratis.",
      },
      {
        number: "02",
        title: "Elige tu compañero",
        text: "Selecciona la personalidad que mejor se adapta a lo que necesitas hoy.",
      },
      {
        number: "03",
        title: "Empieza la conversación",
        text: "Escribe libremente. Tu compañero responde y se adapta poco a poco a tus intercambios.",
      },
    ],

    benefitsEyebrow: "UN ESPACIO PARA TI",
    benefitsTitle: "Un espacio para hablar, pensar y respirar.",
    benefitsSubtitle:
      "No necesitas explicarlo todo. Empieza por lo primero que te venga a la mente.",
    benefits: [
      {
        icon: "💬",
        title: "Necesitas hablar",
        text: "Cuando algo te pesa y no sabes con quién compartirlo.",
      },
      {
        icon: "🧠",
        title: "Demasiados pensamientos",
        text: "Cuando tu mente no se detiene y quieres ordenar tus ideas.",
      },
      {
        icon: "🌙",
        title: "Noches difíciles",
        text: "Cuando todo se siente más pesado por la noche y necesitas expresarlo.",
      },
      {
        icon: "💔",
        title: "Ruptura o soledad",
        text: "Cuando el silencio, la ausencia o la soledad se vuelven difíciles de llevar.",
      },
      {
        icon: "🧭",
        title: "Una decisión",
        text: "Cuando dudas y quieres explorar tus opciones con calma.",
      },
      {
        icon: "📖",
        title: "Diario interactivo",
        text: "Cuando escribir te ayuda a comprenderte y quieres recibir una respuesta.",
      },
    ],

    differenceEyebrow: "POR QUÉ AMORIAI",
    differenceTitle: "Más que un diario. Una conversación que continúa contigo.",
    differenceText:
      "AmorIAI convierte la escritura en un verdadero intercambio. Vuelve cuando quieras, continúa donde lo dejaste y crea un compañero que se adapte a ti.",
    differenceItems: [
      "Una personalidad adaptada a tus necesidades",
      "Respuestas inmediatas y personalizadas",
      "Una experiencia simple en móvil y computadora",
      "Una conversación que puedes retomar",
      "Voz disponible con suscripción",
      "Sin presión para encontrar las palabras perfectas",
    ],

    demoEyebrow: "DESCUBRE CÓMO SE SIENTE",
    demoTitle: "Una conversación puede empezar con una sola frase.",
    demoSubtitle:
      "AmorIAI responde a lo que escribes y te ayuda a continuar sin obligarte a explicarlo todo de una vez.",
    demoUserLabel: "Tú",
    demoUserMessage: "Tengo la cabeza llena y ni siquiera sé por dónde empezar.",
    demoAiLabel: "AmorIAI",
    demoAiMessage:
      "No necesitas contarlo todo de una vez. ¿Qué es lo que más espacio ocupa en tu mente ahora mismo?",
    demoCta: "Empezar mi propia conversación",

    reviewsTitle: "Empezaron con unas pocas palabras",
    reviewsSubtitle: "Usuarios cuentan cómo AmorIAI forma parte de su día a día.",
    reviewsPrivacyNote: "Consulta nuestra política de privacidad para saber cómo tratamos tus datos.",
    reviewsHelpfulLabel: "¿Te fue útil esta reseña?",
    reviewsYes: "Sí",
    reviewsNo: "No",
    reviews: REVIEWS_FR,

    pricingEyebrow: "EMPIEZA SIN PRESIÓN",
    pricingTitle: "Empieza gratis. Decide después.",
    pricingText:
      "Descubre AmorIAI gratis. Hay un plan de pago disponible solo si quieres más conversaciones y acceso a la voz.",
    pricingBullets: [
      "Creación de cuenta gratuita",
      "Acceso inmediato a tu compañero",
      "Sin aplicación que instalar",
      "Los detalles completos aparecen en la página de precios",
    ],
    pricingPrimary: "Crear mi cuenta gratis",
    seePricingLabel: "Ver precios",
    pricingNote: "Los límites y condiciones del plan gratuito aparecen durante el registro.",

    finalTitle: "Empieza simplemente con «Hola».",
    finalText:
      "Escribe una frase, un pensamiento o lo que sientes ahora. Tu compañero te ayudará a continuar.",
    finalCta: "Hablar con AmorIAI ahora",

    faqEyebrow: "PREGUNTAS FRECUENTES",
    faqTitle: "Antes de empezar",
    safetyNote: "AmorIAI es un compañero conversacional. No sustituye a los servicios médicos, psicológicos ni de emergencia.",
    faqs: [
      {
        question: "¿AmorIAI es gratis?",
        answer:
          "Puedes empezar gratis. Los límites del plan gratuito y las opciones de pago se muestran durante el registro y en la página de precios.",
      },
      {
        question: "¿AmorIAI reemplaza a un psicólogo?",
        answer:
          "No. AmorIAI es un compañero conversacional y no sustituye a un profesional de salud mental, un diagnóstico, un tratamiento ni los servicios de emergencia.",
      },
      {
        question: "¿Puedo usarlo en mi teléfono?",
        answer:
          "Sí. AmorIAI funciona directamente en el navegador de tu teléfono, tableta o computadora, sin descargar una aplicación.",
      },
      {
        question: "¿Puedo cambiar de compañero?",
        answer:
          "Sí. Puedes explorar distintas personalidades y elegir la que mejor se adapte a lo que necesitas en cada momento.",
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
          <Link href={{ pathname: "/", query: { lang: locale } }} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/AmorIA_logo_transparent.png"
              alt="AmorIAI.app"
              className="h-10 w-auto"
              draggable={false}
            />
            <div>
              <div className="text-sm font-bold tracking-wide">AmorIAI.app</div>
              <div className="text-[0.68rem] text-slate-400">{t.brandTagline}</div>
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
              href="#how-it-works"
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

          <p className="mt-5 text-xs leading-6 text-slate-400">{t.heroSupport}</p>

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
                autoPlay
                loop
                muted
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
                  <div className="text-xs font-bold">AmorIAI</div>
                  <div className="text-[0.65rem] text-emerald-400">
                    ● {locale === "fr" ? "En ligne" : locale === "en" ? "Online" : "En línea"}
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

          <p className="mt-3 text-center text-xs text-slate-500">{t.videoCaption}</p>
        </div>
      </section>

      <section id="companions" className="amoria-reveal relative border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
              {t.companionsEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {t.companionsTitle}
            </h2>
            <p className="mt-4 leading-7 text-slate-300">{t.companionsSubtitle}</p>
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
                    autoPlay
                    loop
                    muted
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

      <section id="how-it-works" className="amoria-reveal relative mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-violet-300">{t.howEyebrow}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t.howTitle}</h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.howSteps.map((step) => (
            <article
              key={step.number}
              className="amoria-card amoria-step-card rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="text-4xl font-black text-white/10">{step.number}</div>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="benefits" className="amoria-reveal relative border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
              {t.benefitsEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t.benefitsTitle}</h2>
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
                <p className="mt-2 text-sm leading-6 text-slate-300">{benefit.text}</p>
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
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t.differenceTitle}</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">{t.differenceText}</p>

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
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t.demoTitle}</h2>
            <p className="mt-4 max-w-xl leading-8 text-slate-300">{t.demoSubtitle}</p>

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
                <div className="text-sm font-bold">AmorIAI</div>
                <div className="text-xs text-emerald-400">
                  ● {locale === "fr" ? "En ligne" : locale === "en" ? "Online" : "En línea"}
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

      <section id="pricing" className="amoria-reveal relative mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-zinc-950 to-fuchsia-500/5 p-7 shadow-2xl shadow-black/30 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-violet-300">
                {t.pricingEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t.pricingTitle}</h2>
              <p className="mt-4 max-w-2xl leading-8 text-slate-300">{t.pricingText}</p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {t.pricingBullets.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-200">
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

              <p className="mt-4 text-center text-xs text-slate-400">{t.pricingNote}</p>
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
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t.faqTitle}</h2>
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
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="amoria-reveal relative mx-auto max-w-4xl px-4 pb-24 pt-20 text-center">
        <h2 className="text-3xl font-black sm:text-4xl">{t.finalTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">{t.finalText}</p>
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
            <Link href={withLang("/legal/privacy")} className="hover:text-white">
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
