"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PaymentContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "chat";

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
      }}
    >
      <div>
        <h1>Finaliser mon abonnement AmorIAI</h1>
        <p style={{ opacity: 0.8, marginTop: "0.75rem" }}>
          Tu es sur le point de t’abonner au forfait{" "}
          <strong>{plan}</strong>.
        </p>

        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", opacity: 0.7 }}>
          Une fois le paiement complété sur Stripe, tu seras
          automatiquement redirigé(e) vers ton espace AmorIAI.
        </p>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ color: "white" }}>Chargement…</div>}>
      <PaymentContent />
    </Suspense>
  );
}
