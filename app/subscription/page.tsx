"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("price", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setPlans(data || []);
      }
      setLoading(false);
    }

    loadPlans();
  }, []);

  const goToCheckout = async (priceId: string) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur : impossible d’ouvrir Stripe.");
    }
  };

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <main style={{ padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Choisir un forfait</h1>
      <p>Sélectionne ton abonnement AmorIA</p>

      <div style={{ marginTop: "30px" }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              border: "1px solid #444",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "12px",
            }}
          >
            <h2>{plan.name}</h2>
            <p>
              <strong>{plan.price} $ / mois</strong>
            </p>

            <ul style={{ marginTop: "10px" }}>
              <li>Chat : {plan.message_limit ?? "∞"} messages</li>
              <li>IA : {plan.ai_limit ?? "∞"} IA personnalisées</li>
              <li>
                Voix :{" "}
                {plan.has_voice
                  ? `${plan.voice_limit ?? "∞"} minutes`
                  : "Non inclus"}
              </li>
            </ul>

            <button
              style={{
                marginTop: "15px",
                padding: "10px 18px",
                borderRadius: "8px",
                background: "#ff4fb8",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => goToCheckout(plan.stripe_price_id)}
            >
              Choisir ce forfait
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
