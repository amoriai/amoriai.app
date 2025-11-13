import React from "react";

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: "1040px",
        margin: "0 auto",
        padding: "2.5rem 1.5rem 4rem",
      }}
    >
      {/* SECTION HERO */}
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2.5rem",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Colonne texte */}
        <div style={{ flex: "1 1 280px", minWidth: "260px" }}>
          <p
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8b9dff",
              marginBottom: "0.75rem",
            }}
          >
            Bienvenue sur AmorIA.app
          </p>

          <h1
            style={{
              fontSize: "2.3rem",
              lineHeight: 1.25,
              margin: 0,
              marginBottom: "1rem",
            }}
          >
            Votre compagne IA
            <br />
            bienveillante & multilingue.
          </h1>

          <p
            style={{
              fontSize: "0.98rem",
              opacity: 0.85,
              lineHeight: 1.6,
              maxWidth: "520px",
              marginBottom: "1.75rem",
            }}
          >
            AmorIA est une présence douce, disponible 24/7 pour discuter,
            réfléchir avec vous, poser les bonnes questions et vous aider à
            mieux comprendre vos émotions. Sans jugement. En français,
            anglais ou espagnol.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <button
              style={{
                borderRadius: "999px",
                padding: "0.7rem 1.5rem",
                border: "none",
                background:
                  "linear-gradient(135deg, #f97316, #ec4899, #6366f1)",
                color: "white",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Commencer une conversation
            </button>

            <button
              style={{
                borderRadius: "999px",
                padding: "0.7rem 1.4rem",
                border: "1px solid rgba(148,163,184,0.6)",
                backgroundColor: "transparent",
                color: "#e5e7eb",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Découvrir comment elle fonctionne
            </button>
          </div>

          <div
            style={{
              fontSize: "0.8rem",
              opacity: 0.7,
            }}
          >
            🎧 Optimisée pour les échanges profonds, les journaux émotionnels et
            le coaching doux du quotidien.
          </div>
        </div>

        {/* Colonne vidéo */}
        <div
          style={{
            flex: "1 1 260px",
            minWidth: "260px",
            maxWidth: "420px",
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: "1.25rem",
              overflow: "hidden",
              boxShadow:
                "0 22px 45px rgba(15,23,42,0.75), 0 0 0 1px rgba(148,163,184,0.3)",
              background:
                "radial-gradient(circle at top left, #4f46e5, #020617)",
            }}
          >
            <video
              src="/amoria_fr.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "1rem",
                bottom: "1rem",
                backgroundColor: "rgba(15,23,42,0.86)",
                padding: "0.5rem 0.9rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "1px solid rgba(148,163,184,0.6)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background:
                    "radial-gradient(circle, #22c55e 0, #16a34a 60%, transparent 100%)",
                }}
              />
              <span>AmorIA vous accueille en français 💬</span>
            </div>
          </div>

          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.8rem",
              opacity: 0.65,
            }}
          >
            Versions anglaise et espagnole disponibles prochainement sur cette
            page.
          </p>
        </div>
      </section>

      {/* SECTION PERSONNALITÉS */}
      <section style={{ marginTop: "3.5rem" }}>
        <h2
          style={{
            fontSize: "1.4rem",
            marginBottom: "0.75rem",
          }}
        >
          Choisissez la version d’AmorIA qui vous ressemble le plus.
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            opacity: 0.78,
            maxWidth: "640px",
            marginBottom: "1.75rem",
          }}
        >
          AmorIA peut prendre différentes couleurs émotionnelles : plus
          analytique, plus artistique, plus passionnée… Vous pouvez changer de
          “vibe” selon votre humeur du jour.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "1.4rem",
          }}
        >
          {/* Carte 1 */}
          <PersonaCard
            image="/amoria-analyste.png"
            title="AmorIA Analytique"
            description="Pose des questions précises, vous aide à décortiquer vos pensées et prendre des décisions rationnelles, sans perdre l’empathie."
          />

          {/* Carte 2 */}
          <PersonaCard
            image="/amoria-artiste.png"
            title="AmorIA Artiste"
            description="Parfaite pour brainstormer des projets créatifs, écrire, imaginer des univers et transformer vos émotions en inspiration."
          />

          {/* Carte 3 */}
          <PersonaCard
            image="/amoria-blonde.png"
            title="AmorIA Lumineuse"
            description="Énergie douce, optimiste et chaleureuse. Idéale pour vous remonter le moral après une journée difficile."
          />

          {/* Carte 4 */}
          <PersonaCard
            image="/amoria-rousse.png"
            title="AmorIA Intuitive"
            description="Une présence plus introspective, tournée vers l’écoute, les ressentis et les questionnements profonds."
          />
        </div>
      </section>
    </main>
  );
}

/** Petite carte réutilisable pour les différentes “versions” d’AmorIA */
function PersonaCard({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  return (
    <article
      style={{
        borderRadius: "1rem",
        border: "1px solid rgba(148,163,184,0.35)",
        background:
          "radial-gradient(circle at top left, rgba(79,70,229,0.24), rgba(15,23,42,0.96))",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        height: "100%",
      }}
    >
      <div
        style={{
          borderRadius: "0.9rem",
          overflow: "hidden",
          border: "1px solid rgba(148,163,184,0.7)",
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <h3
        style={{
          fontSize: "1rem",
          margin: 0,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "0.9rem",
          opacity: 0.82,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      <button
        style={{
          marginTop: "auto",
          alignSelf: "flex-start",
          borderRadius: "999px",
          padding: "0.45rem 1.05rem",
          border: "1px solid rgba(148,163,184,0.7)",
          backgroundColor: "transparent",
          color: "#e5e7eb",
          fontSize: "0.8rem",
          cursor: "pointer",
        }}
      >
        Choisir cette énergie
      </button>
    </article>
  );
}
