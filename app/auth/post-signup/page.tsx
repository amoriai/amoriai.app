import { Suspense } from "react";
import LoadingScreen from "./LoadingScreen";
import PostSignupClient from "./PostSignupClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          badge="Création de compte AmorIAI"
          title="Activation…"
          subtitle="On finalise ton inscription"
        />
      }
    >
      <PostSignupClient />
    </Suspense>
  );
}
