"use client";

import React, { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const locale = searchParams.get("lang") ?? "fr";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const redirectAfterAuth = () => {
    const url = `/create-ai?lang=${locale}`;
    window.location.href = url;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoadingEmail(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Si tu veux obliger la confirmation par email, garde ça.
          // L’utilisateur sera redirigé ici après avoir cliqué dans le courriel.
          emailRedirectTo: `${window.location.origin}/create-ai?lang=${locale}`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // Si tu désactives la confirmation email dans Supabase,
        // tu peux rediriger directement :
        redirectAfterAuth();
        // Sinon, affiche un message :
        // setInfo("Vérifie ta boîte courriel pour confirmer ton compte.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Erreur inconnue");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setInfo(null);
    setLoadingGoogle(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/create-ai?lang=${locale}`,
        },
      });

      if (error) {
        setError(error.message);
        setLoadingGoogle(false);
      }
      // Aucun redirect manuel ici : Google/Supabase gère la redirection.
    } catch (err: any) {
      setError(err?.message ?? "Erreur inconnue");
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] px-4">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0b1020] to-[#050816] p-[1px] shadow-2xl">
        <div className="rounded-3xl bg-[#050816] px-8 py-10">
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="text-sm text-slate-400 mb-6 hover:text-white"
          >
            ← Retour à la page d’accueil
          </button>

          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
            Créer mon compte gratuit
          </h1>
          <p className="text-sm text-slate-400 mb-8">
            Crée ton compte gratuitement et commence à texter avec l’IA de ton
            choix. La voix (parler avec ton AmorIA) est disponible uniquement
            avec l’abonnement payant.
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loadingGoogle || loadingEmail}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-slate-900 font-medium py-3 mb-4 hover:bg-slate-100 disabled:opacity-60"
          >
            {loadingGoogle ? "Connexion avec Google..." : "Continuer avec Google"}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-xs text-slate-400">ou</span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          {/* Formulaire email */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Adresse courriel
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-[#0b1020] border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="toi@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-[#0b1020] border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-700/40 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {info && (
              <p className="text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-700/40 rounded-xl px-3 py-2">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={loadingEmail || loadingGoogle}
              className="mt-2 w-full rounded-full bg-gradient-to-r from-pink-500 to-orange-400 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 hover:brightness-110 disabled:opacity-60"
            >
              {loadingEmail ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Tu as déjà un compte ?{" "}
            <button
              type="button"
              onClick={() =>
                (window.location.href = `/login?lang=${locale}`)
              }
              className="text-pink-400 hover:text-pink-300 font-medium"
            >
              Me connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
