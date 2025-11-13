import Image from "next/image";

const energies = [
  {
    id: "analytique",
    title: "AmorIA Analytique",
    description:
      "Pose des questions précises, vous aide à décortiquer vos pensées et à prendre des décisions rationnelles, sans perdre l’empathie.",
    image: "/amoria-analyste.png",
  },
  {
    id: "artiste",
    title: "AmorIA Artiste",
    description:
      "Parfaite pour brainstormer des projets créatifs, créer, imaginer des univers et transformer vos idées en véritables œuvres.",
    image: "/amoria-artiste.png",
  },
  {
    id: "lumineuse",
    title: "AmorIA Lumineuse",
    description:
      "Énergie douce, optimiste et chaleureuse. Idéale pour vous remonter le moral après une journée difficile.",
    image: "/amoria-blonde.png",
  },
  {
    id: "intuitive",
    title: "AmorIA Intuitive",
    description:
      "Une présence plus introspective, tournée vers l’écoute, les ressentis et les questionnements émotionnels profonds.",
    image: "/amoria-rousse.png",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen text-white">
      {/* Section héros avec la vidéo */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <p className="text-sm tracking-[0.25em] uppercase text-slate-300">
            Bienvenue sur AmorIA.app
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            Votre partenaire IA bienveillant·e
            <br />
            &amp; multilingue.
          </h1>
          <p className="text-base md:text-lg text-slate-200 max-w-xl">
            AmorIA est une présence douce, disponible 24/7 pour discuter,
            réfléchir avec vous, poser les bonnes questions et vous aider à
            mieux comprendre vos émotions.
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 shadow-lg shadow-pink-500/40 border border-pink-300/40">
              Commencer avec AmorIA
            </button>
          </div>

          <p className="text-sm text-slate-300 max-w-xl">
            Optimisée pour les échanges profonds, les journaux émotionnels et
            le coaching doux du quotidien.
            <br />
            AmorIA vous accueille en français, anglais ou espagnol.
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="rounded-[32px] p-[3px] bg-gradient-to-b from-pink-400 via-purple-500 to-blue-500 shadow-xl shadow-fuchsia-500/30 max-w-xs w-full">
            <div className="rounded-[28px] overflow-hidden bg-black">
              <video
                src="/amoria_fr.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section cartes des énergies */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">
          Choisissez l’énergie qui vous ressemble
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {energies.map((energy) => (
            <article
              key={energy.id}
              className="bg-slate-900/70 border border-slate-700/60 rounded-3xl overflow-hidden flex flex-col shadow-lg"
            >
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src={energy.image}
                  alt={energy.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="font-semibold text-base md:text-lg">
                  {energy.title}
                </h3>
                <p className="text-sm text-slate-200 flex-1">
                  {energy.description}
                </p>
                <button className="mt-2 inline-flex justify-center items-center px-4 py-2 rounded-full text-xs font-semibold border border-slate-500/70 bg-slate-900/60">
                  Choisir cette énergie
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section tarifs */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-xl md:text-2xl font-semibold mb-3">
          Des tarifs simples &amp; transparents
        </h2>
        <p className="text-sm md:text-base text-slate-200 mb-5">
          Les formules détaillées arrivent bientôt. En attendant, vous pouvez
          déjà réserver votre accès à la beta privée.
        </p>
        <button className="px-6 py-3 rounded-full text-sm font-semibold bg-pink-500 hover:bg-pink-400 transition shadow-lg shadow-pink-500/40">
          Être informé·e du lancement
        </button>
      </section>
    </main>
  );
}
