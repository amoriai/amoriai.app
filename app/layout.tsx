// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) - Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17835849508"
          strategy="afterInteractive"
        />

        {/* Consent Mode v2: defaults = denied (avant toute mesure) */}
        <Script id="gtag-consent-default" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });

            gtag('config', 'AW-17835849508');
          `}
        </Script>
      </head>

      <body className="antialiased">
        {children}

        {/* PWA */}
        <RegisterSW />

        {/* Cookies */}
        <CookieBanner />
      </body>
    </html>
  );
}
