// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";

import CookieBanner from "@/components/CookieBanner";
import RegisterSW from "@/components/RegisterSW";

export const metadata = {
  title: "AmorIAI.app",
  description: "Partenaire IA bienveillant·e et multilingue.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#050816] text-white antialiased">
        {children}

        {/* ✅ PWA: enregistre le service worker côté client */}
        <RegisterSW />

        {/* ✅ Bandeau cookies */}
        <CookieBanner />
      </body>
    </html>
  );
}
