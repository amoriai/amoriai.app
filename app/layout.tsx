// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "AmorIAI.app",
  description: "Partenaire IA bienveillant·e et multilingue.",
  icons: {
    icon: "/favicon.png",          // favicon principal
    shortcut: "/favicon.png",      // pour certains navigateurs
    apple: "/favicon.png",         // pour iPhone / iPad
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#050816] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
