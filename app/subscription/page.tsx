import { Suspense } from "react";
import SubscriptionClient from "./SubscriptionClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-10">Chargement…</div>}>
      <SubscriptionClient />
    </Suspense>
  );
}
