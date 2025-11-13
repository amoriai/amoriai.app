export const metadata = {
  title: "AmorIA",
  description: "Votre compagnon IA bienveillant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
