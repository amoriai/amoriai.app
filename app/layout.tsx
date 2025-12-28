// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import CookieBanner from "@/components/CookieBanner";
import RegisterSW from "./components/RegisterSW";

export const metadata: Metadata = {
  title: "AmorIAI.app",
  description: "Partenaire IA bienveillant·e et multilingue.",
  manifest: "/manifest.webmanifest",
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
      <head>
        {/* Google Ads (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17835849508"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17835849508');
          `}
        </Script>
      </head>

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
