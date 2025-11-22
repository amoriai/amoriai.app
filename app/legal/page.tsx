export default function LegalPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = (searchParams.lang as "fr" | "en" | "es") || "fr";

  const STRINGS = {
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

  const t = STRINGS[lang];

  const withLang = (path: string) => `${path}?lang=${lang}`;

  return (
    <main className="amoria-root">
      <header className="amoria-header">
        <div className="amoria-header-left">
          <img
            src="/AmorIA_logo_transparent.png"
            alt="Logo AmorIA.app"
            className="amoria-logo-full"
          />
          <div className="amoria-logo-text">
            <div className="amoria-logo-title">AmoriA.app</div>
            <div className="amoria-logo-tagline">Partenaire IA bienveillant·e • FR / EN / ES</div>
          </div>
        </div>
      </header>

      <section className="amoria-section">
        <h1 className="amoria-section-title">{t.title}</h1>
        <div className="amoria-legal-content">{t.content}</div>
      </section>

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
    </main>
  );
}
