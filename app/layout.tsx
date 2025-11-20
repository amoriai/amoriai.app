// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css"; // <-- IMPORTANT : on importe le CSS global

export const metadata = {
  title: "AmorIA.app",
  description: "Partenaire IA bienveillant·e et multilingue.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
