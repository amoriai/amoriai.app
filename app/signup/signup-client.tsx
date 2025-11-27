"use client";

import React, { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

  const plan = (searchParams.get("plan") as PlanId) || "free";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ EMAIL + PASSWORD
  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user?.id) {
      alert(error?.message || "Erreur création compte");
      setLoading(false);
      return;
    }

    await handlePostSignup(data.user.id);
  }

  // ✅ GOOGLE SIGNUP
  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/oauth-callback?plan=${plan}`,
      },
    });

    if (error) alert(error.message);
  }

  // ✅ APRES INSCRIPTION (EMAIL OU GOOGLE)
  async function handlePostSignup(userId: string) {
    if (plan === "free") {
      router.push("/create-amoria");
      return;
    }

    // ✅ STRIPE
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
      window.location.href = stripeData.url;
    } else {
      alert("Erreur Stripe");
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h1 style={styles.title}>Créer mon compte AmorIA</h1>

        <p style={styles.text}>
          Forfait sélectionné : <strong>{PLAN_LABELS[plan]}</strong>
        </p>

        <input
          style={styles.input}
          type="email"
          placeholder="Adresse courriel"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button style={styles.primary} type="submit" disabled={loading}>
          {loading ? "En cours..." : "Créer mon compte"}
        </button>

        {/* ✅ GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          style={styles.google}
        >
          Continuer avec Google
        </button>

        <p style={styles.small}>
          Tu as déjà un compte ?{" "}
          <a href="/login" style={{ color: "#fff", textDecoration: "underline" }}>
            Me connecter
          </a>
        </p>
      </form>
    </main>
  );
}

const styles: any = {
  main: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    background: "#0f172a",
    padding: "2rem",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
    border: "1px solid rgba(148,163,184,0.3)",
  },
  title: {
    color: "#fff",
    marginBottom: "0.5rem",
  },
  text: {
    fontSize: "0.85rem",
    color: "#9ca3af",
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    borderRadius: "999px",
    border: "1px solid #555",
    marginBottom: "0.7rem",
    background: "#020617",
    color: "#fff",
  },
  primary: {
    width: "100%",
    padding: "0.7rem",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #fb37ff, #ff6b9c)",
    color: "#fff",
    border: "none",
    marginBottom: "0.7rem",
  },
  google: {
    width: "100%",
    padding: "0.7rem",
    borderRadius: "999px",
    background: "#fff",
    color: "#000",
    border: "none",
    fontWeight: "600",
  },
  small: {
    fontSize: "0.75rem",
    color: "#aaa",
    marginTop: "1rem",
  },
};
