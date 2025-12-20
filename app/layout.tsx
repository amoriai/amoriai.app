// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import RegisterSW from "@/components/RegisterSW"; // ✅ ICI

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
        {/* ✅ ENREGISTRE LE SERVICE WORKER */}
        <RegisterSW />

        {children}

        {/* ✅ BANDEAU COOKIES */}
        <CookieBanner />
      </body>
    </html>
  );
}
