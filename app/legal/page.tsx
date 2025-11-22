"use client";

export default function LegalPage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
        Mentions légales
      </h1>

      <p>
        Les présentes informations concernent l’utilisation du site et de
        l’application AmorIA.app.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Éditeur du site</h2>
      <p>
        <strong>AmorIA.app</strong><br />
        Les Entreprises Kema inc.<br />
        Canada
      </p>

      <h2 style={{ marginTop: "2rem" }}>Responsable de la publication</h2>
      <p>Les Entreprises Kema inc.</p>

      <h2 style={{ marginTop: "2rem" }}>Contact</h2>
      <p>
        Pour toute question :<br />
        <strong>contactamoriai@gmail.com</strong>
      </p>

      <h2 style={{ marginTop: "2rem" }}>Hébergement</h2>
      <p>
        <strong>Vercel Inc.</strong><br />
        440 N Barranca Ave #4133<br />
        Covina, CA 91723<br />
        États-Unis<br />
        <a href="https://vercel.com" style={{ color: "#9ecbff" }}>
          https://vercel.com
        </a>
      </p>

      <h2 style={{ marginTop: "2rem" }}>Données personnelles</h2>
      <p>
        AmorIA.app recueille uniquement les données nécessaires au fonctionnement
        du service : création de compte, préférences linguistiques, IA créée par
        l’utilisateur et communications internes.  
        Aucune donnée n’est vendue ou partagée à des tiers.
      </p>

      <p>
        Le détail complet est disponible dans notre{" "}
        <a href="/legal/privacy" style={{ color: "#9ecbff" }}>
          Politique de confidentialité
        </a>.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Limitation de responsabilité</h2>
      <p>
        AmorIA.app est un service de divertissement et de soutien émotionnel
        léger.  
        Les réponses générées par l’IA ne constituent en aucun cas un avis
        médical, psychologique ou professionnel.  
        Pour tout problème urgent, il est recommandé de contacter les services
        d’urgence locaux.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Propriété intellectuelle</h2>
      <p>
        L’ensemble du contenu (textes, interface, éléments graphiques, vidéos,
        IA et contenus générés) est protégé par les lois canadiennes et
        internationales.  
        Toute reproduction non autorisée est interdite.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Modifications</h2>
      <p>
        AmorIA.app se réserve le droit de modifier les présentes mentions
        légales à tout moment.  
        La version en vigueur est celle affichée sur cette page.
      </p>

      <p style={{ marginTop: "2rem", opacity: 0.6 }}>
        © {new Date().getFullYear()} AmorIA.app – Tous droits réservés.
      </p>
    </main>
  );
}
