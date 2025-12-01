export default function PaymentCancelPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#000",
        color: "#e5e7eb",
      }}
    >
      <section
        style={{
          maxWidth: 480,
          width: "100%",
          padding: "2rem",
          borderRadius: "1.5rem",
          background: "#020617",
          border: "1px solid rgba(148,163,184,0.5)",
          textAlign: "center",
        }}
      >
        <h1>❌ Paiement annulé</h1>

        <p>
          Aucun montant n’a été prélevé.  
          Tu peux revenir aux forfaits <strong>AmorIAI</strong> quand tu veux.
        </p>

        <a
          href="/pricing"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "0.8rem 1.5rem",
            borderRadius: "999px",
            border: "1px solid white",
            color: "white",
            textDecoration: "none",
          }}
        >
          Revenir aux forfaits AmorIAI
        </a>
      </section>
    </main>
  );
}
