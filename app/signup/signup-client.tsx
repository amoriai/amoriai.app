ch
"use client";

import { useState } from "react";

export default function SignupClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1. Création du compte
    const authRes = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const authData = await authRes.json();

    if (!authData.user_id) {
      alert("Erreur création compte");
      setLoading(false);
      return;
    }

    // 2. GRATUIT → PAS DE STRIPE
    if (plan === "free") {
      window.location.href = "/create-amoria";
      return;
    }

    // 3. PAYANT → STRIPE OBLIGATOIRE
    const stripeRes = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        plan,
        user_id: authData.user_id,
      }),
    });

    const stripeData = await stripeRes.json();

    if (stripeData.url) {
      window.location.href = stripeData.url;
    } else {
      alert("Erreur Stripe");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSignup} style={{ maxWidth: 400, margin: "auto", paddingTop: 100 }}>
      <h1>Créer mon compte</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <select value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="free">Découverte (gratuit)</option>
        <option value="chat">Chat 9.99$</option>
        <option value="plus">Plus 19.99$</option>
        <option value="unlimited">Unlimited 39.99$</option>
      </select>

      <button disabled={loading}>
        {loading ? "Envoi..." : "Créer mon compte"}
      </button>
    </form>
  );
}
