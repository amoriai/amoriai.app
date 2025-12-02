"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type PlanId = "chat" | "plus" | "unlimited";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const plan = (searchParams.get("plan") as PlanId | null) ?? null;
  const [status, setStatus] = useState<
    "init" | "loading" | "redirecting" | "error"
  >("init");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      // 1) Vérifier le plan
      if (!plan || !["chat", "plus", "unlimited"].includes(plan)) {
        setStatus("error");
        setError(
          "Aucun forfait valide n’a été trouvé. Retour à la page des tarifs…"
        );
        setTimeout(() => {
          router.push("/pricing?lang=fr");
        }, 2000);
        return;
      }

      setStatus("loading");
      setError(null);

      // 2) Récupérer l’utilisateur connecté
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data.user) {
        setStatus("error");
        setError(
          "Tu dois être connectée pour finaliser ton abonnement. Redirection vers la connexion…"
        );
        setTimeout(() => {
          router.push(`/login?lang=fr&plan=${plan}`);
        }, 2000);
        return;
      }

      try {
        // 3) Appeler l’API Stripe côté backend
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan,
            user_id: data.user.id,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Erreur inconnue côté serveur.");
        }

        const body = (await res.json()) as { url?: string };

        if (!body.url) {
          throw new Error("Aucune URL de paiement retournée par Stripe.");
        }

        // 4) Redirection vers Stripe
        setStatus("redirecting");
        window.location.href = body.url;
      } catch (err: any) {
        console.error("Erreur paiement Stripe :", err);
        setStatus("error");
        setError(
          err?.message ??
            "Une erreur est survenue lors de la création du paiement Stripe."
        );
      }
    };

    run();
  }, [plan, router]);

  const mainMessage =
    status === "redirecting"
      ? "Redirection vers Stripe…"
      : status === "loading"
      ? "Connexion sécurisée à Stripe…"
      : "Finaliser mon abonnement AmorIAI";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        color: "white",
        textAlign: "center",
        background:
          "radial-gradient(circle at top,#020617 0,#020617 45%,#000 100%)",
      }}
    >
      <div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: 12 }}>
          {mainMessage}
        </h1>

        {status === "init" || status === "loading" || status === "redirecting" ? (
          <>
            <p style={{ opacity: 0.9, marginTop: "0.75rem" }}>
              Tu es sur le point de t’abonner à ton forfait AmorIAI.
            </p>
            <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", opacity: 0.7 }}>
              Une fois le paiement complété sur Stripe, tu seras automatiquement
              redirigé(e) vers ton espace AmorIAI.
            </p>
          </>
        ) : null}

        {status === "error" && error && (
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.9rem",
              color: "#fecaca",
              maxWidth: 480,
            }}
          >
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
