"use client";

import React, { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatClient />
    </Suspense>
  );
}

function ChatSkeleton() {
  return (
    <main className="chat-shell">
      <div className="chat-shell__loader" aria-label="Loading">
        <span className="chat-shell__dot" />
        <span className="chat-shell__dot" />
        <span className="chat-shell__dot" />
      </div>
      <p className="chat-shell__text">Chargement…</p>
    </main>
  );
}
