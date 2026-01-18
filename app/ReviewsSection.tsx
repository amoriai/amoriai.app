"use client";

import React, { useEffect, useMemo, useState } from "react";

type Locale = "fr" | "en" | "es";

type ReviewCard = {
  id: string;
  name: string;
  date: string;
  rating: number; // 1..5
  text: string;   // déjà traduit (FR/EN/ES selon locale)
};

type Props = {
  locale: Locale;

  title: string;
  subtitle: string;
  privacyNote: string;

  helpfulLabel: string;
  yesLabel: string;
  noLabel: string;

  thanksTitle: string;
  thanksHint: string;

  reviews: ReviewCard[];
};

type Vote = "yes" | "no";

function stars(rating: number) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return "★★★★★☆☆☆☆☆".slice(5 - r, 10 - r);
}

export default function ReviewsSection(props: Props) {
  const storageKey = useMemo(() => `amoria_votes_${props.locale}`, [props.locale]);

  const [votes, setVotes] = useState<Record<string, Vote>>({});

  // Charger votes (persist)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, Vote>;
      if (parsed && typeof parsed === "object") setVotes(parsed);
    } catch {
      // ignore
    }
  }, [storageKey]);

  // Sauvegarder votes (persist)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(votes));
    } catch {
      // ignore
    }
  }, [storageKey, votes]);

  const onVote = (id: string, v: Vote) => {
    setVotes((prev) => {
      if (prev[id]) return prev; // 1 seul vote
      return { ...prev, [id]: v };
    });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-12 pt-2">
      <div className="mb-5">
        <h2 className="text-lg font-semibold md:text-xl">{props.title}</h2>
        <p className="mt-1 text-sm text-slate-300">{props.subtitle}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-950/60 px-3 py-1 text-[0.78rem] text-slate-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.55)]" />
            {props.privacyNote}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {props.reviews.map((item) => {
          const voted = votes[item.id];

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-950/75 via-slate-950 to-black/90 p-4 shadow-lg shadow-black/25"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-100">{item.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="text-[0.95rem] tracking-[0.06em] text-amber-300">{stars(item.rating)}</div>
                    <div className="text-[0.78rem] text-slate-400">{item.date}</div>
                  </div>
                </div>

                <div className="text-slate-500" aria-hidden="true">⋮</div>
              </div>

              {/* Body avec fade */}
              <div className="relative mt-3">
                <p
                  className="text-[0.92rem] leading-relaxed text-slate-200 overflow-hidden"
                  style={{
                    maxHeight: 110,
                    WebkitMaskImage: "linear-gradient(180deg, #000 72%, transparent 100%)",
                    maskImage: "linear-gradient(180deg, #000 72%, transparent 100%)",
                  }}
                >
                  {item.text}
                </p>
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-black/55 to-transparent" />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-3 text-[0.78rem] text-slate-400">
                  <span className="whitespace-nowrap">{props.helpfulLabel}</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!!voted}
                      onClick={() => onVote(item.id, "yes")}
                      className={`rounded-full border px-3 py-1 transition border-slate-600/60 bg-slate-950/60 text-slate-200
                        ${voted ? "cursor-not-allowed opacity-50" : "hover:bg-slate-900/70"}
                      `}
                    >
                      {props.yesLabel}
                    </button>

                    <button
                      type="button"
                      disabled={!!voted}
                      onClick={() => onVote(item.id, "no")}
                      className={`rounded-full border px-3 py-1 transition border-slate-600/60 bg-slate-950/60 text-slate-200
                        ${voted ? "cursor-not-allowed opacity-50" : "hover:bg-slate-900/70"}
                      `}
                    >
                      {props.noLabel}
                    </button>
                  </div>
                </div>

                {voted && (
                  <div className="mt-2 text-[0.78rem] text-slate-400">
                    <span className="text-slate-200">{props.thanksTitle}</span>{" "}
                    <span>{props.thanksHint}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
