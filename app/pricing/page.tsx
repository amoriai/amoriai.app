"use client";

import React, { useState } from "react";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    tiers: {
      id: string;
      name: string;
      price: string;
      description: string;
      cta: string;
    }[];
  }
> = {
  fr: {
    title: "Des forfaits simples et transparents",
    subtitle:"Choisis ton niveau d’accès : texte gratuit, voix limitée ou illimitée.",
    tiers: [
      {
        id: "free",
        name: "Gratuit",
        price: "0 $ / mois",
        description: "Messages texte limités · Pas de mémoire · Pas de voix.",
        cta: "Choisir gratuit",
      },
      {
        id: "plus",
        name: "AmorIA+",
        price: "19,99 $ / mois",
        description: "Texte illimité · Mémoire courte · Voix limitée.",
        cta: "Choisir AmorIA+",
      },
      {
        id: "premium",
        name: "AmorIA Premium",
        price: "39,99 $ / mois",
        description: "Voix illimitée · Mémoire longue · IA plus intelligente.",
        cta: "Choisir Premium",
      },
    ],
  },

  en: {
    title: "Simple & Transparent Pricing",
    subtitle:"Choose your level: free text, limited voice or full unlimited access.",
    tiers: [
      { id: "free", name: "Free", price: "$0 / month", description: "Limited text · No memory · No voice.", cta: "Choose Free" },
      {
        id: "plus",
        name: "AmorIA+",
        price: "$19.99 / month",
        description: "Unlimited text · Short memory · Limited voice.",
        cta: "Choose AmorIA+",
      },
      {
        id: "premium",
        name: "AmorIA Premium",
        price: "$39.99 / month",
        description: "Unlimited voice · Long memory · Smarter IA.",
        cta: "Choose Premium",
      },
    ],
  },

  es: {
    title: "Precios simples y transparentes",
    subtitle:"Acceso gratis por texto, voz limitada o ilimitada.",
    tiers: [
      { id: "free", name: "Gratis", price: "0 $ / mes", description: "Texto limitado · Sin memoria · Sin voz.", cta: "Elegir Gratis" },
      {
        id: "plus",
        name: "AmorIA+",
        price: "19,99 $ / mes",
        description: "Texto ilimitado · Memoria corta · Voz limitada.",
        cta: "Elegir AmorIA+",
      },
      {
        id: "premium",
        name: "AmorIA Premium",
        price: "39,99 $ / mes",
        description: "Voz ilimitada · Memoria larga · IA avanzada.",
        cta: "Elegir Premium",
      },
    ],
  },
};

export default function PricingPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = STRINGS[locale];

  return (
    <main className="pricing-root">

      {/* LANG SWITCH */}
      <div className="lang-switch">
        {(["fr", "en", "es"] as Locale[]).map((code) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            className={locale === code ? "active" : ""}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TITLE */}
      <h1>{t.title}</h1>
      <p className="subtitle">{t.subtitle}</p>

      {/* PRICING GRID */}
      <div className="grid">
        {t.tiers.map((tier) => (
          <div key={tier.id} className="card">
            <h2>{tier.name}</h2>
            <p className="price">{tier.price}</p>
            <p className="desc">{tier.description}</p>
            <a href={`/signup?plan=${tier.id}`} className="cta">
              {tier.cta}
            </a>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pricing-root { padding:40px; text-align:center; }
        .lang-switch { display:flex; gap:8px; justify-content:center; margin-bottom:20px; }
        button { padding:4px 10px; border-radius:8px; border:1px solid #555; background:none; color:white; }
        .active { background:#fff; color:#000; }
        .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; max-width:900px; margin:40px auto; }
        .card { padding:24px; border:1px solid #555; border-radius:12px; background:#0a0a0f; }
        .price { font-size:28px; margin:10px 0; }
        .cta { display:inline-block; margin-top:12px; padding:8px 18px; background:#fb37ff; color:black; border-radius:30px; text-decoration:none; font-weight:600;}
      `}</style>
    </main>
  );
}
