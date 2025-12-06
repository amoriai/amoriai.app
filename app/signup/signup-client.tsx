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

    // 🔁 Adapte ce path si ta page a un autre chemin
    const url = `/amoria/create?lang=${lang}`;
    router.replace(url);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1) Création du compte Supabase
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
        // 2) Tout le monde commence sur le plan "free"
        const selectedPlan: PlanId = "free";

        const { data: pricingPlan, error: pricingError } = await supabase
          .from("pricing_plans")
          .select("id")
          .eq("code", selectedPlan)
          .maybeSingle();

        if (!pricingError && pricingPlan?.id) {
          // 3) On crée la ligne dans user_subscriptions
          await supabase.from("user_subscriptions").insert({
            user_id: user.id,
            pricing_plan_id: pricingPlan.id,
            current: true,
          });
        } else {
          console.error("Impossible de trouver le plan:", selectedPlan);
        }
      } else {
        console.warn(
          "Aucun user retourné par signUp (email de confirmation activé ?)"
        );
      }

      // 4) Nouveau flow : on va directement vers la création de l’Amoriai
      redirectAfterSignup();
    } catch (err: unknown) {
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

  /**
   * Google OAuth
   * → passe par /auth/callback qui termine la session
   * (la création de la ligne user_subscriptions se fera là-bas)
   */
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
    } catch (err: unknown) {
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
    const lang =
      localeParam === "fr" || localeParam === "en" || localeParam === "es"
        ? localeParam
        : "fr";
    router.push(`/login?lang=${lang}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Badge étape */}
        <div className="mb-4 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-xs font-medium tracking-wide text-pink-200">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
            Étape 1 sur 2 • Création de ton accès AmorIAI
          </span>
        </div>

        {/* Carte principale */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-7 shadow-2xl shadow-pink-500/20 backdrop-blur">
          <header className="mb-6 space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">
              Créer ton <span className="text-pink-400">AmorIAI</span> gratuit
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Crée ton accès en quelques secondes, puis personnalise ton premier
              Amoriai gratuit avant de décider si tu veux débloquer les options
              premium.
            </p>
          </header>

          {/* Erreur */}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          {/* Bouton Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-slate-800/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <span className="text-[10px] font-bold text-slate-900">G</span>
            </span>
            Continuer avec Google
          </button>

          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-700" />
            <span>ou avec ton courriel</span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          {/* Formulaire email */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                Adresse courriel
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex. mon.adresse@email.com"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                  @
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choisis un mot de passe sécurisé"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 pr-16 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-xl bg-slate-800/80 px-2.5 text-[11px] font-medium text-slate-200 hover:bg-slate-700/90"
                >
                  {showPassword ? "Cacher" : "Afficher"}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Minimum 6 caractères. Ne partage jamais ton mot de passe.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Création de ton accès..."
                : "Créer mon Amoriai gratuit"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 flex flex-col gap-2 text-center text-xs text-slate-400">
            <p>
              En créant un compte, tu acceptes nos{" "}
              <span className="text-pink-300 underline underline-offset-2">
                conditions d’utilisation
              </span>{" "}
              et notre{" "}
              <span className="text-pink-300 underline underline-offset-2">
                politique de confidentialité
              </span>
              .
            </p>
            <p className="text-sm">
              Tu as déjà un compte ?{" "}
              <button
                type="button"
                onClick={goToLogin}
                className="font-medium text-pink-300 hover:text-pink-200 underline underline-offset-4"
              >
                Me connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
