"use client";

import Link from "next/link";

export default function CancelPage() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Paiement annulé ❌</h1>
      <p>Tu peux réessayer quand tu veux.</p>

      <Link href="/pricing">
        <button style={{ marginTop: 20 }}>
          Revenir aux forfaits
        </button>
      </Link>
    </div>
  );
}
