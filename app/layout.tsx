// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "AmorIA.app",
  description: "Partenaire IA bienveillant·e et multilingue.",
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
