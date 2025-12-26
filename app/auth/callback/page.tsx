import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export const dynamic = "force-dynamic"; // évite le prerender/export sur cette route

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackClient />
    </Suspense>
  );
}
