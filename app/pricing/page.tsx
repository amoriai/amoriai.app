import { Suspense } from "react";
import PricingClient from "./pricing-client";

export const dynamic = "force-dynamic";

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <PricingClient />
    </Suspense>
  );
}
