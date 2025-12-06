"use client";

import React, { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Locale = "fr" | "en" | "es";
type PlanId = "free" | "chat" | "plus" | "unlimited";

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const localeParam = (searchParams.get("lang") as Locale) || "fr";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /** Après création → on envoie directement vers la page de création d’Amoriai */
  const redirectAfterSignup = () => {
    const lang: Locale =
      localeParam === "fr" || localeParam === "en" || localeParam === "es"
        ? localeParam
        : "fr";

    // 🔒 ICI : chemin clair vers ta page "Créer mon Amoriai"
    const url = `/create-amoria?lang=${lang}`;
    router.replace(url);
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
        setErrorMsg(
          error.message || "Une erreur est survenue. Merci de réessayer."
        );
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
          console.error("Impossible de trouver le plan:", selectedPlan);
        }
      } else {
        console.warn("Aucun user retourné par signUp");
      }

      // 👉 On force maintenant la redirection vers Create Amoriai
      redirectAfterSignup();
    } catch (err) {
      console.error("signup error", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création du compte."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const lang: Locale =
        localeParam === "fr" || localeParam === "en" || localeParam === "es"
          ? localeParam
          : "fr";

      const plan: PlanId = "free";

      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?lang=${lang}&plan=${plan}`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        setErrorMsg(
          error.message || "Une erreur est survenue. Merci de réessayer."
        );
      }
    } catch (err) {
      console.error("google oauth error", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la connexion Google."
      );
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

  // ... (JSX identique à ton composant actuel : badge, formulaire, etc.)
}
