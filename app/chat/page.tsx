import { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{color:"white",padding:"40px"}}>Chargement…</div>}>
      <ChatClient />
    </Suspense>
  );
}
