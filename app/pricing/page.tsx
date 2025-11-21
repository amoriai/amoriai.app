"use client";

import { useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    monthly: string;
    choose: string;
    popular: string;
    plans: {
      free: {
        name: string;
        price: string;
        features: string[];
      };
      premium: {
        name: string;
        price: string;
        features: string[];
      };
      elite: {
        name: string;
        price: string;
        features: string[];
      };
    };
  }
> = {
  fr: {
    title: "Choisis ton forfait AmoriA",
    subtitle:
      "Commence gratuitement, puis active la voix ou l’illimité quand tu veux.",
    monthly: "/mois",
    choose: "Choisir ce forfait",
    popular: "Le plus populaire",
    plans: {
      free: {
        name: "Gratuit",
        price: "0 $",
        features: [
          "Messages texte illimités",
          "IA standard",
          "Aucune mémoire longue",
          "Voix non incluse",
        ],
      },
      premium: {
        name: "Premium",
        price: "19,99 $",
        features: [
          "Messages texte illimités",
          "120 messages Voix / mois",
          "Mémoire longue activée",
          "IA plus intelligente",
          "Réponses plus rapides",
        ],
      },
      elite: {
        name: "Élite",
        price: "39,99 $",
        features: [
          "Texte illimité",
          "Voix illimitée",
          "Mémoire profonde continue",
          "IA avancée optimisée",
          "Support prioritaire",
        ],
      },
    },
  },

  en: {
    title: "Choose your AmoriA plan",
    subtitle:
      "Start free, upgrade anytime to unlock voice or unlimited features.",
    monthly: "/month",
    choose: "Choose this plan",
    popular: "Most popular",
    plans: {
      free: {
        name: "Free",
        price: "$0",
        features: [
          "Unlimited text messages",
          "Standard AI",
          "No long-term memory",
          "Voice not included",
        ],
      },
      premium: {
        name: "Premium",
        price: "$19.99",
        features: [
          "Unlimited text messages",
          "120 Voice messages / month",
          "Long memory enabled",
          "Smarter AI",
          "Faster responses",
        ],
      },
      elite: {
        name: "Elite",
        price: "$39.99",
        features: [
          "Unlimited text",
          "Unlimited voice",
          "Deep continuous memory",
          "Advanced optimized AI",
          "Priority support",
        ],
      },
    },
  },

  es: {
    title: "Elige tu plan AmoriA",
    subtitle:
      "Empieza gratis y activa la voz o lo ilimitado cuando quieras.",
    monthly: "/mes",
    choose: "Elegir este plan",
    popular: "Más popular",
    plans: {
      free: {
        name: "Gratis",
        price: "0 $",
        features: [
          "Mensajes de texto ilimitados",
          "IA estándar",
          "Sin memoria larga",
          "Voz no incluida",
        ],
      },
      premium: {
        name: "Premium",
        price: "19,99 $",
        features: [
          "Mensajes ilimitados",
          "120 mensajes de voz / mes",
          "Memoria larga activada",
          "IA más inteligente",
          "Respuestas más rápidas",
        ],
      },
      elite: {
        name: "Élite",
        price: "39,99 $",
        features: [
          "Texto ilimitado",
          "Voz ilimitada",
          "Memoria profunda continua",
          "IA avanzada optimizada",
          "Soporte prioritario",
        ],
      },
    },
  },
};

export default function PricingPage() {
  const params = useSearchParams();
  const locale = (params.get("lang") as Locale) || "fr";
  const t = STRINGS[locale];

  const planOrder = ["free", "premium", "elite"] as const;

  return (
    <main className="min-h-screen bg-[#050816] text-white px-5 py-14 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t.title}
        </h1>
        <p className="text-center text-white/70 mb-12">{t.subtitle}</p>

        {/* GRID */}
        <div className="grid gap-8 md:grid-cols-3">
          {planOrder.map((key) => {
            const plan = t.plans[key];

            const isPopular = key === "premium";

            return (
              <div
                key={key}
                className={`relative p-7 rounded-3xl border bg-[#0b0f1f]/80 backdrop-blur-xl shadow-2xl 
                  ${
                    isPopular
                      ? "border-pink-400 shadow-pink-500/40 scale-[1.03]"
                      : "border-white/10"
                  }
                `}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs px-4 py-1 rounded-full shadow-lg">
                    {t.popular}
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-5">
                  {plan.price}
                  <span className="text-base font-normal text-white/70">
                    {t.monthly}
                  </span>
                </div>

                <ul className="space-y-2 mb-8 text-sm text-white/80">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>

                <a
                  href={`/signup?lang=${locale}&plan=${key}`}
                  className={`block text-center w-full py-3 rounded-full font-semibold transition 
                    ${
                      isPopular
                        ? "bg-pink-500 text-white hover:bg-pink-400"
                        : "bg-white text-black hover:bg-gray-200"
                    }
                  `}
                >
                  {t.choose}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
