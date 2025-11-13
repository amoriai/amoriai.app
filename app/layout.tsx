// app/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "AmorIA.app",
  description: "Partenaire IA bienveillant·e et multilingue.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
