"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, FormEvent } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const [locale, setLocale] = useState("fr");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get("lang");
      if (lang) setLocale(lang);
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    const { error } = await supabase.auth.signUp({ email, password });
    setLoadingEmail(false);

    if (error) return setError(error.message);

    window.location.href = `/create-ai?lang=${locale}`;
  };

  const handleGoogle = async () => {
    setError(null);
    setLoadingGoogle(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    setLoadingGoogle(false);
    if (error) return setError(error.message);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-[#0a0121] to-[#18012f] text-white relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-pink-600/20 blur-[140px]" />
        <div className="absolute -bottom-20 right-0 w-[300px] h-[300px] rounded-full bg-purple-600/20 blur-[140px]" />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">

          <a href="/" className="text-xs text-white/60 hover:text-white">
            ← Retour à l’accueil
          </a>

          <h1 className="text-3xl font-semibold mt-4 mb-2">Créer mon compte gratuit</h1>
          <p className="text-sm text-white/70 mb-6">
            Crée un compte gratuitement et commence à texter avec ton IA préférée.
          </p>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-full text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            <span className="text-lg">🌐</span>
            {loadingGoogle ? "Connexion..." : "Continuer avec Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-xs text-white/40 uppercase tracking-widest">OU</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm text-white/80">Adresse courriel</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-black/30 border border-white/20 placeholder-white/40 focus:border-pink-400 outline-none"
                placeholder="exemple@email.com"
              />
            </div>

            <div>
              <label className="text-sm text-white/80">Mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-black/30 border border-white/20 placeholder-white/40 focus:border-pink-400 outline-none"
                placeholder="******"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/40 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingEmail}
              className="w-full mt-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 py-3 text-sm font-bold shadow-lg shadow-pink-500/30 disabled:opacity-60"
            >
              {loadingEmail ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-xs mt-6 text-white/60">
            Tu as déjà un compte ?{" "}
            <a href="/login" className="text-pink-400 hover:underline">
              Me connecter
            </a>
          </p>

        </div>
      </div>
    </main>
  );
}
