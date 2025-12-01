"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main style={{ color: "white", textAlign: "center", padding: "3rem" }}>
      <h1>✅ Paiement réussi</h1>
      <p>Merci d’avoir choisi <strong>AmorIAI</strong></p>

      {sessionId && (
        <p style={{ fontSize: "12px", opacity: 0.6 }}>
          Session Stripe : {sessionId}
        </p>
      )}

      <a href="/my-amoria">Accéder à mon AmorIAI</a>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Chargement…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
