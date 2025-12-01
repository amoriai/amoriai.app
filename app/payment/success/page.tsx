"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Paiement réussi ✅</h1>
      <p>Merci pour ton abonnement.</p>
      {sessionId && <p>Session: {sessionId}</p>}

      <Link href="/my-amoria">
        <button style={{ marginTop: 20 }}>
          Accéder à mon AmorIA
        </button>
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
