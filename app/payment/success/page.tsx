"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>✅ Paiement réussi</h1>
      <p>Merci pour ton abonnement !</p>

      {sessionId && (
        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          Session Stripe : {sessionId}
        </p>
      )}

      <a
        href="/my-amoriai"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 20px",
          background: "#000",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Accéder à mon Amoriai
      </a>
    </div>
  );
}
