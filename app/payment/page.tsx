"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background:
          "radial-gradient(circle at top, #020617 0, #000000 65%, #020617 100%)",
        color: "#e5e7eb",
      }}
    >
      <section
        style={{
          maxWidth: 480,
          width: "100%",
          padding: "2rem",
          borderRadius: "1.5rem",
          background: "#020617",
          border: "1px solid rgba(148,163,184,0.5)",
          textAlign: "center",
        }}
      >
        <h1>✅ Paiement réussi</h1>

        <p>
          Merci d’avoir choisi <strong>AmorIAI</strong> 💖  
          Ton abonnement est maintenant actif.
        </p>

        {sessionId && (
          <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>
            Session Stripe : {sessionId}
          </p>
        )}

        <a
          href="/my-amoria"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "0.8rem 1.5rem",
            borderRadius: "999px",
            background: "#fb37ff",
            color: "white",
            textDecoration: "none",
          }}
        >
          Accéder à mon AmorIAI
        </a>
      </section>
    </main>
  );
}
