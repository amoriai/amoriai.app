import { Suspense } from "react";
import CreateAmoriaClient from "./create-amoria-client";

export default function CreateAmoriaPage() {
  return (
    <Suspense fallback={null}>
      <CreateAmoriaClient />
    </Suspense>
  );
}
