// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

import CookieBanner from "@/components/CookieBanner";
import RegisterSW from "./components/RegisterSW";

export const metadata: Metadata = {
  title: "AmorIAI.app",
  description: "Partenaire IA bienveillant·e et multilingue.",
  manifest: "/manifest.webmanifest", // ✅ important pour l’install PWA
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#050816] text-white antialiased">
        {children}

        {/* PWA */}
        <RegisterSW />

        {/* Cookies */}
        <CookieBanner />
      </body>
    </html>
  );
}
