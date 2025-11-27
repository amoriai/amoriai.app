"use client";

import React, { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type PlanId = "free" | "chat" | "plus" | "unlimited";

const PLAN_LABELS: Record<PlanId, string> = {
  free: "Découverte (gratuit)",
  chat: "AmorIA Chat",
  plus: "AmorIA Plus",
  unlimited: "AmorIA Illimité",
};

export default function SignupClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // plan reçu depuis l’URL : /signup?plan=free|chat|plus|unlimited
  const initialPlan = (searchParams.get("plan") as PlanId) || "free";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan] = useState<PlanId>(initialPlan); // on garde le plan choisi

  const [loading, setLoading] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1) Création du compte dans Supabase
    const authRes = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const authData = await authRes.json();

    if (!authRes.ok || !authData.user_id) {
      alert(authData.error || "Erreur lors de la création du compte");
      setLoading(false);
      return;
    }

    const userId = authData.user_id as string;

    // 2) Plan gratuit → pas de Stripe
    if (plan === "free") {
      router.push("/create-amoria");
      return;
    }

    // 3) Plan payant → Stripe Checkout obligatoire
    const stripeRes = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        user_id: userId,
      }),
    });

    const stripeData = await stripeRes.json();

    if (stripeRes.ok && stripeData.url) {
      // redirection vers Stripe
      window.location.href = stripeData.url as string;
    } else {
      alert(stripeData.error || "Erreur avec le paiement Stripe");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          maxWidth: 420,
          width: "100%",
          background: "rgba(15,23,42,0.96)",
          borderRadius: 24,
          padding: "1.75rem 1.5rem 1.8rem",
          boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
          border: "1px solid rgba(148,163,184,0.35)",
        }}
      >
        <h1 style={{ fontSize: "1.3rem", marginBottom: "0.25rem" }}>
          Créer mon compte AmorIA
        </h1>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#9ca3af",
            marginBottom: "0.9rem",
          }}
        >
          Inscris-toi pour commencer avec ton AmorIA. Tu pourras changer de
          forfait plus tard.
        </p>

        <p
          style={{
            fontSize: "0.82rem",
            marginBottom: "0.9rem",
          }}
        >
          <strong>Forfait sélectionné :</strong> {PLAN_LABELS[plan]}
        </p>

        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            marginBottom: "0.3rem",
          }}
        >
          Adresse courriel
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 0.7rem",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.6)",
            background: "#020617",
            color: "#f9fafb",
            fontSize: "0.85rem",
            marginBottom: "0.7rem",
          }}
        />

        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            marginBottom: "0.3rem",
          }}
        >
          Mot de passe
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 0.7rem",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.6)",
            background: "#020617",
            color: "#f9fafb",
            fontSize: "0.85rem",
            marginBottom: "0.9rem",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            borderRadius: 999,
            border: "none",
            padding: "0.7rem 1rem",
            background:
              "linear-gradient(135deg, #fb37ff, #ff6b9c)",
            color: "#f9fafb",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
            marginBottom: "0.6rem",
          }}
        >
          {loading ? "En cours..." : "Créer mon compte"}
        </button>

        <p
          style={{
            fontSize: "0.78rem",
            color: "#9ca3af",
            textAlign: "center",
            marginTop: "0.4rem",
          }}
        >
          Tu as déjà un compte ?{" "}
          <a
            href="/login"
            style={{ color: "#e5e7eb", textDecoration: "underline" }}
          >
            Me connecter
          </a>
        </p>
      </form>
    </main>
  );
}
