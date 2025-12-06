"use client";

import React, { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

// 🔁 Modifie ce chemin SEULEMENT si ta vraie page est ailleurs
const CREATE_AMORIA_PATH = "/amoria/create";

export default function SignupClient(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") as Locale) || "fr";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ REDIRECTION FINALE : PLUS JAMAIS VERS /PRICING
  const redirectAfterSignup = () => {
    const lang: Locale =
      localeParam === "fr" || localeParam === "en" || localeParam === "es"
        ? localeParam
        : "fr";

    router.replace(`${CREATE_AMORIA_PATH}?lang=${lang}`);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Erreur de création de compte.");
        return;
      }

      const user = data?.user;

      if (user) {
        const selectedPlan: PlanId = "free";

        const { data: pricingPlan, error: pricingError } = await supabase
          .from("pricing_plans")
          .select("id")
          .eq("code", selectedPlan)
          .maybeSingle();

        if (!pricingError && pricingPlan?.id) {
          await supabase.from("user_subscriptions").insert({
            user_id: user.id,
            pricing_plan_id: pricingPlan.id,
            current: true,
          });
        } else {
          console.error("Plan FREE introuvable");
        }
      }

      redirectAfterSignup();
    } catch (err) {
      console.error("signup error", err);
      setErrorMsg("Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    const lang: Locale =
      localeParam === "fr" || localeParam === "en" || localeParam === "es"
        ? localeParam
        : "fr";

    router.push(`/login?lang=${lang}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-4 bg-slate-900 p-6 rounded-2xl shadow"
      >
        <h1 className="text-xl font-bold text-center">
          Créer ton AmorIAI gratuit
        </h1>

        {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

        <input
          type="email"
          required
          placeholder="Adresse courriel"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-slate-800"
        />

        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={6}
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-slate-800"
        />

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="text-xs underline"
        >
          {showPassword ? "Cacher" : "Afficher"}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 py-2 rounded font-semibold"
        >
          {loading ? "Création..." : "Créer mon accès gratuit"}
        </button>

        <button
          type="button"
          onClick={goToLogin}
          className="w-full underline text-sm"
        >
          Me connecter
        </button>
      </form>
    </div>
  );
}
