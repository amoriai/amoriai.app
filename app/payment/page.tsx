import { Suspense } from "react";
import PaymentClient from "./PaymentClient";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Chargement…</div>}>
      <PaymentClient />
    </Suspense>
  );
}
