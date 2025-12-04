"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient"; // lib à la racine

export default function SignupClient() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const redirectAfterSignup = () => {
    router.replace("/pricing");
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setErrorMsg(error.message || "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    redirectAfterSignup();
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setErrorMsg(error.message || "Une erreur est survenue.");
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-900 to-black px-4 text-white">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Créer mon compte AmorIAI</h1>
          <p className="text-sm text-slate-300">
            Étape 1 : crée ton compte. Ensuite tu arrives sur la page des
            forfaits pour choisir ton plan.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 text-sm p-2 rounded">
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border border-slate-600 bg-slate-800 hover:bg-slate-700 transition rounded-lg py-2 text-sm font-medium"
        >
          Continuer avec Google
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-700" />
          <span>ou</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Adresse courriel</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex. mon.adresse@email.com"
              className="w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              className="w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 rounded-lg py-2 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-300">
          Tu as déjà un compte ?{" "}
          <button
            type="button"
            onClick={goToLogin}
            className="text-pink-400 underline"
          >
            Me connecter
          </button>
        </div>
      </div>
    </div>
  );
}
