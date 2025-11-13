import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "AmorIA.app",
  description: "Partenaire IA bienveillant·e • FR / EN / ES",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
