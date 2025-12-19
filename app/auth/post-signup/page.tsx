import { Suspense } from "react";
import PostSignupClient from "./PostSignupClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PostSignupClient />
    </Suspense>
  );
}
