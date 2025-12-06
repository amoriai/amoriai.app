"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Après connexion : on l’envoie vers son espace perso
    router.replace("/my-amoria");
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErrorMsg("");

    const redirectUrl = `${window.location.origin}/my-amoria`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      setErrorMsg("Erreur avec la connexion Google.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        {/* Titre */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Me connecter</h1>
          <p className="text-sm text-zinc-400 mt-2">
            Accède à ton AmorIA personnel et reprends la conversation.
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full mb-5 py-3 rounded-xl border border-zinc-700 hover:border-zinc-500 transition text-sm flex items-center justify-center gap-2"
        >
          <span>Continuer avec Google</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="mx-3 text-xs text-zinc-500">OU</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-xs text-zinc-400 mb-1">
            Adresse courriel
          </label>
          <input
            type="email"
            placeholder="ex. mon.adresse@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Mot de passe */}
        <div className="mb-2">
          <label className="block text-xs text-zinc-400 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="Ton mot de passe AmorIA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500"
          />
        </div>

        {errorMsg && (
          <p className="text-red-500 text-xs mb-4 text-center">
            {errorMsg}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold hover:opacity-90 transition mt-2"
        >
          {loading ? "Connexion en cours…" : "Me connecter"}
        </button>

        <p className="mt-6 text-xs text-zinc-500 text-center">
          Pas encore de compte ?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-pink-400 cursor-pointer hover:underline"
          >
            Créer mon compte
          </span>
        </p>
      </div>
    </main>
  );
}
