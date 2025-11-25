"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type PricingPlan = {
  id: string;
  name: string;
  price: number | null;          // 0, 9, 19, 39 (pour .99$ on gère dans l’affichage)
  ai_limit: number | null;
  message_limit: number | null;
  stripe_price_id: string | null;
  has_voice: boolean | null;
  voice_limit: number | null;
};

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // Charger les plans depuis Supabase
  useEffect(() => {
    const loadPlans = async () => {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("price", { ascending: true });

      if (error) {
        console.error(error);
        setError("Impossible de charger les forfaits. Réessaie plus tard.");
      } else if (data) {
        setPlans(data as PricingPlan[]);
      }

      setLoading(false);
    };

    loadPlans();
  }, []);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!plan.stripe_price_id) {
      alert("Ce forfait n’est pas encore configuré avec Stripe.");
      return;
    }

    try {
      setLoadingPlanId(plan.id);

      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.stripe_price_id,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(body);
        alert("Erreur lors de la création de la session de paiement.");
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirection vers Stripe Checkout
      } else {
        alert("Réponse inattendue de l’API de paiement.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue. Réessaie plus tard.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <main
      style={{
        padding: "3rem 1.5rem",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Choisis ton forfait AmorIA
      </h1>

      <p
        style={{
          textAlign: "center",
          maxWidth: "640px",
          margin: "0 auto 2.5rem",
          opacity: 0.8,
        }}
      >
        Tous les forfaits utilisent la même IA de base. Tu payes en fonction de
        la quantité de messages, du nombre d’AmorIA personnalisés et de la voix.
      </p>

      {loading && <p style={{ textAlign: "center" }}>Chargement des forfaits…</p>}
      {error && (
        <p style={{ textAlign: "center", color: "#e11d48", marginBottom: "1rem" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {plans.map((plan) => {
            const priceLabel =
              plan.price === 0
                ? "Gratuit"
                : `${plan.price?.toString() ?? "?"},99 $ US / mois`;

            const isFree = plan.price === 0;

            const hasVoice = !!plan.has_voice;
            const voiceText = hasVoice
              ? plan.voice_limit && plan.voice_limit > 0
                ? `Conversations vocales limitées (~${plan.voice_limit} échanges / mois)`
                : "Conversations vocales incluses (usage équitable)"
              : "Pas de voix dans ce forfait";

            const messagesText =
              plan.message_limit && plan.message_limit >= 10000
                ? "Messages texte illimités (usage équitable)"
                : plan.message_limit
                ? `${plan.message_limit} messages texte / mois`
                : "Messages texte (limite non définie)";

            const aisText =
              plan.ai_limit && plan.ai_limit > 0
                ? `Jusqu’à ${plan.ai_limit} AmorIA personnalisés`
                : "1 AmorIA personnalisé";

            return (
              <div
                key={plan.id}
                style={{
                  borderRadius: "18px",
                  padding: "1.75rem 1.5rem",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    "0 18px 45px rgba(15, 23, 42, 0.45)",
                  background:
                    "radial-gradient(circle at top left, rgba(236,72,153,0.13), transparent 55%), radial-gradient(circle at bottom right, rgba(59,130,246,0.16), #020617)",
                  color: "white",
                  backdropFilter: "blur(20px)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    marginBottom: "0.6rem",
                  }}
                >
                  {plan.name}
                </h2>

                <p
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    marginBottom: "0.25rem",
                  }}
                >
                  {priceLabel}
                </p>

                {!isFree && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      opacity: 0.7,
                      marginBottom: "1rem",
                    }}
                  >
                    Facturé mensuellement, résiliable en tout temps.
                  </p>
                )}

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 1.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  <li style={{ marginBottom: "0.4rem" }}>• {aisText}</li>
                  <li style={{ marginBottom: "0.4rem" }}>• {messagesText}</li>
                  <li style={{ marginBottom: "0.4rem" }}>• {voiceText}</li>
                </ul>

                <button
                  onClick={() => !isFree && handleSubscribe(plan)}
                  disabled={loadingPlanId === plan.id || (!plan.stripe_price_id && !isFree)}
                  style={{
                    width: "100%",
                    borderRadius: "999px",
                    border: "none",
                    padding: "0.75rem 1rem",
                    fontWeight: 600,
                    cursor: isFree ? "default" : "pointer",
                    fontSize: "0.95rem",
                    background: isFree
                      ? "rgba(148, 163, 184, 0.2)"
                      : "linear-gradient(90deg, #ec4899, #6366f1)",
                    color: "white",
                    opacity:
                      loadingPlanId === plan.id || (!plan.stripe_price_id && !isFree)
                        ? 0.7
                        : 1,
                  }}
                >
                  {isFree
                    ? "Inclus avec ton compte"
                    : loadingPlanId === plan.id
                    ? "Redirection vers Stripe…"
                    : "Choisir ce forfait"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
