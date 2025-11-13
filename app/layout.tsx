import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AmorIA.app",
  description: "Votre partenaire IA bienveillant·e & multilingue.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-[#0f1224] text-white`}>
        {/* HEADER */}
        <header className="w-full border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/AmorIA_logo_transparent.png"
                alt="AmorIA Logo"
                width={42}
                height={42}
                className="rounded-full"
              />
              <span className="text-lg font-semibold">AmorIA.app</span>
            </Link>

            {/* NAVIGATION */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="hover:text-pink-400 transition">Accueil</Link>
              <Link href="/features" className="hover:text-pink-400 transition">Fonctionnalités</Link>
              <Link href="/pricing" className="hover:text-pink-400 transition">Tarifs</Link>
            </nav>

            {/* LANGUES + CTA */}
            <div className="flex items-center gap-3">

              {/* LANG SELECT */}
              <div className="flex gap-2 bg-white/10 rounded-full px-3 py-1">
                <button className="text-sm hover:text-pink-400 transition">FR</button>
                <button className="text-sm hover:text-pink-400 transition">EN</button>
                <button className="text-sm hover:text-pink-400 transition">ES</button>
              </div>

              {/* LOGIN */}
              <Link
                href="/login"
                className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition text-sm"
              >
                Me connecter
              </Link>

              {/* SIGNUP */}
              <Link
                href="/register"
                className="px-4 py-2 text-sm rounded-md bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition"
              >
                Créer mon compte AmorIA
              </Link>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="min-h-screen">{children}</main>

        {/* FOOTER */}
        <footer className="border-t border-white/10 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-white/60">
            © 2025 AmorIA.app — Tous droits réservés.
          </div>
        </footer>
      </body>
    </html>
  );
}
