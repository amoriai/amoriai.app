"use client";

import { useSearchParams } from "next/navigation";

type Locale = "fr" | "en" | "es";

const STRINGS: Record<
  Locale,
  {
    title: string;
    content: JSX.Element;
    footerCopy: string;
    footerLinks: {
      legal: string;
      privacy: string;
      terms: string;
      contact: string;
      about: string;
    };
  }
> = {
  fr: {
    title: "Mentions légales",
    content: (
      <>
        <p>Ces informations concernent l’utilisation du site AmoriA.app.</p>
        <p>Éditeur : AmoriA.app — Canada</p>
        <p>Contact : contactamoriai@gmail.com</p>
      </>
    ),
    footerCopy: "© 2025 AmoriA.app",
    footerLinks: {
      legal: "Mentions légales",
      privacy: "Confidentialité",
      terms: "Conditions d’utilisation",
      contact: "Contact",
      about: "À propos",
    },
  },

  en: {
    title: "Legal Notice",
    content: (
      <>
        <p>These details concern the use of the AmoriA.app website.</p>
        <p>Publisher: AmoriA.app — Canada</p>
        <p>Contact: contactamoriai@gmail.com</p>
      </>
    ),
    footerCopy: "© 2025 AmoriA.app",
    footerLinks: {
      legal: "Legal notice",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      contact: "Contact",
      about: "About",
    },
  },

  es: {
    title: "Aviso legal",
    content: (
      <>
        <p>Esta información concierne el uso del sitio AmoriA.app.</p>
        <p>Editor: AmoriA.app — Canadá</p>
        <p>Contacto: contactamoriai@gmail.com</p>
      </>
    ),
    footerCopy: "© 2025 AmoriA.app",
    footerLinks: {
      legal: "Aviso legal",
      privacy: "Privacidad",
      terms: "Condiciones de uso",
      contact: "Contacto",
      about: "Acerca de",
    },
  },
};

export default function LegalPage() {
  const params = useSearchParams();
  const lang = (params.get("lang") as Locale) || "fr";
  const t = STRINGS[lang];

  const withLang = (path: string) => `${path}?lang=${lang}`;

  return (
    <main className="amoria-root">

      {/* HEADER IDENTIQUE À TA VITRINE */}
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIA.app"
            className="amoria-logo-full"
          />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmoriA.app</div>
            <div className="amoria-logo-tagline">
              Partenaire IA bienveillant·e • FR / EN / ES
            </div>
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <section className="amoria-section">
        <h1 className="amoria-section-title">{t.title}</h1>
        <div className="amoria-legal-content">{t.content}</div>
      </section>

      {/* FOOTER IDENTIQUE */}
      <footer className="amoria-footer">
        <div className="amoria-footer-top">
          <span>{t.footerCopy}</span>
        </div>

        <div className="amoria-footer-links">
          <a href={withLang("/legal")}>{t.footerLinks.legal}</a>
          <a href={withLang("/legal/privacy")}>{t.footerLinks.privacy}</a>
          <a href={withLang("/legal/terms")}>{t.footerLinks.terms}</a>
          <a href={withLang("/contact")}>{t.footerLinks.contact}</a>
          <a href={withLang("/about")}>{t.footerLinks.about}</a>
        </div>
      </footer>

      <style jsx global>{`
        .amoria-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .amoria-section-title {
          font-size: 1.7rem;
          margin-bottom: 1rem;
        }
        .amoria-legal-content {
          font-size: 1rem;
          color: #d1d5db;
          line-height: 1.7;
        }
        .amoria-footer-links a {
          margin-right: 1rem;
          color: #9ca3af;
          text-decoration: none;
        }
        .amoria-footer-links a:hover {
          color: white;
        }
      `}</style>
    </main>
  );
}
