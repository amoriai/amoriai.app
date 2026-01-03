"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { maxAmoriaForPlan, planFromPricingName, type PlanId } from "@/lib/plan";

type Locale = "fr" | "en" | "es";

type AmoriaRow = {
  id: string;
  name: string | null;
  persona_type: string | null;
  avatar_image_url: string | null;
  created_at: string;
};

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

type Ui = {
  title: string;
  subtitle: string;
  loading: string;

  create: string;
  createDisabled: (max: number) => string;

  home: string;
  emptyTitle: string;
  emptyText: string;

  lastUsed: string;
  continue: string;

  hint: string;
};

const STRINGS: Record<Locale, Ui> = {
  fr: {
    title: "Choisis ton AmorIAI",
    subtitle: "Sélectionne une IA pour continuer",
    loading: "Chargement…",

    create: "Créer une nouvelle AmorIAI",
    createDisabled: (max) => `Limite atteinte (${max}).`,

    home: "Accueil",
    emptyTitle: "Aucune AmorIAI pour l’instant",
    emptyText: "Crée ta première AmorIAI pour commencer.",
    lastUsed: "Dernier utilisé",
    continue: "Reprendre la discussion →",

    hint: "Chaque AmorIAI a sa propre personnalité. Choisis celle qui te convient aujourd’hui.",
  },
  en: {
    title: "Choose your AmorIAI",
    subtitle: "Select an AI to continue",
    loading: "Loading…",

    create: "Create a new AmorIAI",
    createDisabled: (max) => `Limit reached (${max}).`,

    home: "Home",
    emptyTitle: "No AmorIAI yet",
    emptyText: "Create your first AmorIAI to get started.",
    lastUsed: "Last used",
    continue: "Continue the chat →",

    hint: "Each AmorIAI has its own personality. Pick the one that fits you today.",
  },
  es: {
    title: "Elige tu AmorIAI",
    subtitle: "Selecciona una IA para continuar",
    loading: "Cargando…",

    create: "Crear un nuevo AmorIAI",
    createDisabled: (max) => `Límite alcanzado (${max}).`,

    home: "Inicio",
    emptyTitle: "Aún no hay AmorIAI",
    emptyText: "Crea tu primera AmorIAI para empezar.",
    lastUsed: "Último usado",
    continue: "Continuar chat →",

    hint: "Cada AmorIAI tiene su propia personalidad. Elige la que encaje contigo hoy.",
  },
};

function safeGetLastId(): string | null {
  try {
    return window.localStorage.getItem("amoria_last_ia_id");
  } catch {
    return null;
  }
}
function safeSetLastId(id: string) {
  try {
    window.localStorage.setItem("amoria_last_ia_id", id);
  } catch {}
}

export default function MyAmoriaSelectClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const lang = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);
  const t = STRINGS[lang];

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanId>("free");
  const [list, setList] = useState<AmoriaRow[]>([]);
  const [lastUsedId, setLastUsedId] = useState<string | null>(null);

  const maxAllowed = useMemo(() => maxAmoriaForPlan(plan), [plan]);
  const limitReached = useMemo(() => list.length >= maxAllowed, [list.length, maxAllowed]);

  const goChat = useCallback(
    (id: string) => {
      safeSetLastId(id);
      router.push(`/chat?iaId=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`);
    },
    [router, lang]
  );

  const createUrl = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("lang", lang);
    qs.set("plan", plan);
    return `/create-amoria?${qs.toString()}`;
  }, [lang, plan]);

  const homeUrl = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("lang", lang);
    return `/?${qs.toString()}`;
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        if (!cancelled) router.replace(`/login?lang=${encodeURIComponent(lang)}`);
        return;
      }

      const last = safeGetLastId();
      if (!cancelled) setLastUsedId(last);

      // plan (via user_subscriptions -> pricing_plans.name)
      let p: PlanId = "free";
      try {
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("pricing_plan_id,current")
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        if (sub?.pricing_plan_id) {
          const { data: pricing } = await supabase
            .from("pricing_plans")
            .select("name")
            .eq("id", sub.pricing_plan_id)
            .maybeSingle();

          p = planFromPricingName(pricing?.name);
        }
      } catch {
        p = "free";
      }

      if (cancelled) return;
      setPlan(p);

      // list
      const { data } = await supabase
        .from("user_amoria")
        .select("id,name,persona_type,avatar_image_url,created_at")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(60);

      const rows = (data ?? []) as AmoriaRow[];

      // tri: last used en premier (si présent)
      const sorted = (() => {
        if (!last) return rows;
        const idx = rows.findIndex((x) => x.id === last);
        if (idx <= 0) return rows;
        const copy = rows.slice();
        const [item] = copy.splice(idx, 1);
        copy.unshift(item);
        return copy;
      })();

      if (!cancelled) {
        setList(sorted);
        setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [lang, router]);

  if (loading) {
    return (
      <main className="select-shell">
        <div className="loader" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <p className="loadingText">{t.loading}</p>

        <style jsx>{`
          .select-shell {
            height: 100dvh;
            display: grid;
            place-items: center;
            gap: 14px;
            padding: 28px 16px;
            color: rgba(226, 232, 240, 0.92);
            background: radial-gradient(1100px 700px at 50% -10%, rgba(251, 55, 255, 0.24), transparent 60%),
              radial-gradient(900px 700px at 90% 10%, rgba(56, 189, 248, 0.18), transparent 55%),
              radial-gradient(950px 700px at 10% 25%, rgba(249, 115, 22, 0.12), transparent 60%),
              linear-gradient(180deg, #020617, #000);
            overflow: hidden;
          }
          .loader {
            display: inline-flex;
            gap: 10px;
            align-items: center;
            justify-content: center;
            padding: 14px 18px;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.22);
            background: rgba(2, 6, 23, 0.55);
            box-shadow: 0 16px 60px rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(10px);
          }
          .dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: rgba(226, 232, 240, 0.85);
            animation: dot 900ms ease-in-out infinite;
          }
          .dot:nth-child(2) {
            animation-delay: 120ms;
          }
          .dot:nth-child(3) {
            animation-delay: 240ms;
          }
          .loadingText {
            margin: 0;
            font-size: 0.92rem;
            color: rgba(148, 163, 184, 0.9);
            text-align: center;
          }
          @keyframes dot {
            0%,
            100% {
              transform: translateY(0);
              opacity: 0.45;
            }
            50% {
              transform: translateY(-6px);
              opacity: 1;
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="wrap">
        <header className="head">
          <div className="headLeft">
            <h1 className="title">{t.title}</h1>
            <p className="subtitle">{t.subtitle}</p>
            <p className="hint">{t.hint}</p>
          </div>

          <div className="actions">
            <Link href={homeUrl} className="pill">
              {t.home}
            </Link>

            <button
              type="button"
              onClick={() => router.push(createUrl)}
              disabled={limitReached}
              className={limitReached ? "pill pill--disabled" : "pill pill--primary"}
              title={limitReached ? t.createDisabled(maxAllowed) : t.create}
            >
              {limitReached ? t.createDisabled(maxAllowed) : t.create}
            </button>
          </div>
        </header>

        {list.length === 0 ? (
          <div className="empty">
            <div className="emptyInner">
              <h2 className="emptyTitle">{t.emptyTitle}</h2>
              <p className="emptyText">{t.emptyText}</p>
            </div>
            <button type="button" onClick={() => router.push(createUrl)} className="pill pill--primary">
              {t.create}
            </button>
          </div>
        ) : (
          // ✅ scroll interne: ne dépend PAS du body
          <div className="listScroll">
            <div className="grid">
              {list.map((a) => {
                const name = (a.name && a.name.trim()) || "AmorIAI";
                const isLast = !!lastUsedId && a.id === lastUsedId;

                return (
                  <button
                    key={a.id}
                    type="button"
                    className={isLast ? "card card--last" : "card"}
                    onClick={() => goChat(a.id)}
                  >
                    {isLast && <div className="cardGlow" aria-hidden="true" />}

                    <div className="cardTop">
                      <div className="avatarRing">
                        <div className="avatar">
                          {a.avatar_image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={a.avatar_image_url} alt="" className="avatarImg" />
                          ) : (
                            <div className="avatarFallback">{name.charAt(0).toUpperCase()}</div>
                          )}
                        </div>
                      </div>

                      <div className="meta">
                        <div className="nameRow">
                          <div className="name">{name}</div>
                          {isLast && <span className="badge">{t.lastUsed}</span>}
                        </div>
                        <div className="type">{a.persona_type || "—"}</div>
                      </div>
                    </div>

                    <div className="ctaRow">
                      <span className="cta">{t.continue}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        :global(html) {
          color-scheme: dark;
        }

        /* ✅ pas de :global(body){overflow:hidden} ici :
           ça casse d’autres pages (pricing, chat, etc.)
           On rend la page elle-même “fixe” et scroll interne. */

        .page {
          --bg0: #000;
          --bg1: #020617;

          --line: rgba(148, 163, 184, 0.22);
          --text: rgba(226, 232, 240, 0.92);

          --g1: #fb37ff;
          --g2: #ff6b9c;
          --g3: #38bdf8;
          --g4: #f97316;

          height: 100dvh;
          overflow: hidden;

          padding: 22px 16px 18px;

          color: var(--text);
          background: radial-gradient(1100px 700px at 50% -10%, rgba(251, 55, 255, 0.24), transparent 60%),
            radial-gradient(900px 700px at 90% 10%, rgba(56, 189, 248, 0.18), transparent 55%),
            radial-gradient(950px 700px at 10% 25%, rgba(249, 115, 22, 0.12), transparent 60%),
            linear-gradient(180deg, var(--bg1), var(--bg0));
        }

        .wrap {
          height: 100%;
          width: 100%;
          max-width: 980px;
          margin: 0 auto;

          display: flex;
          flex-direction: column;
          gap: 14px;

          min-height: 0; /* ✅ critical pour scroll interne */
        }

        .head {
          flex: 0 0 auto;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          padding: 8px 4px;

          position: sticky;
          top: 0;
          z-index: 10;

          background: linear-gradient(180deg, rgba(2, 6, 23, 0.84), rgba(2, 6, 23, 0));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .headLeft {
          min-width: min(560px, 100%);
        }

        .title {
          margin: 0;
          font-size: 1.58rem;
          letter-spacing: -0.02em;
          font-weight: 800;
        }

        .subtitle {
          margin: 6px 0 0;
          font-size: 0.92rem;
          color: rgba(148, 163, 184, 0.92);
        }

        .hint {
          margin: 10px 0 0;
          font-size: 0.88rem;
          color: rgba(226, 232, 240, 0.82);
          max-width: 720px;
          line-height: 1.35;
        }

        .actions {
          display: inline-flex;
          gap: 10px;
          align-items: center;
        }

        .pill {
          font-size: 0.86rem;
          color: rgba(226, 232, 240, 0.92);
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: rgba(2, 6, 23, 0.35);
          backdrop-filter: blur(10px);
          transition: transform 120ms ease, border-color 120ms ease, filter 120ms ease, opacity 120ms ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          user-select: none;
          cursor: pointer;
        }
        .pill:hover {
          transform: translateY(-1px);
          border-color: rgba(148, 163, 184, 0.32);
          filter: brightness(1.02);
        }
        .pill--primary {
          border: none;
          background: linear-gradient(135deg, var(--g1), var(--g2), var(--g4));
          color: rgba(248, 250, 252, 0.98);
          box-shadow: 0 16px 42px rgba(248, 113, 113, 0.42);
        }
        .pill--disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none !important;
          filter: none !important;
        }

        /* ✅ la clé: scroll interne */
        .listScroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          padding-bottom: 8px;
        }

        .empty {
          flex: 1;
          min-height: 0;
          border-radius: 26px;
          border: 1px solid rgba(148, 163, 184, 0.26);
          background: radial-gradient(900px 600px at 50% 0%, rgba(251, 55, 255, 0.12), transparent 60%),
            radial-gradient(800px 520px at 80% 0%, rgba(56, 189, 248, 0.1), transparent 55%),
            linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(2, 6, 23, 0.78));
          padding: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          box-shadow: 0 26px 90px rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(12px);
        }
        .emptyInner {
          min-width: 0;
        }
        .emptyTitle {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 780;
        }
        .emptyText {
          margin: 6px 0 0;
          color: rgba(226, 232, 240, 0.86);
          line-height: 1.4;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        @media (max-width: 920px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 560px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .empty {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .card {
          text-align: left;
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 22px;
          padding: 14px;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.84), rgba(2, 6, 23, 0.75));
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
          cursor: pointer;
          transition: transform 140ms ease, border-color 140ms ease, filter 140ms ease;
          display: grid;
          gap: 10px;
          position: relative;
          overflow: hidden;
          outline: none;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: -2px;
          background: radial-gradient(650px 220px at 0% 0%, rgba(251, 55, 255, 0.16), transparent 55%),
            radial-gradient(650px 220px at 100% 0%, rgba(56, 189, 248, 0.12), transparent 55%);
          opacity: 0.55;
          pointer-events: none;
        }

        .card:hover {
          transform: translateY(-2px);
          border-color: rgba(148, 163, 184, 0.4);
          filter: brightness(1.02);
        }
        .card:active {
          transform: translateY(-1px);
        }
        .card:focus-visible {
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45), 0 0 0 2px rgba(56, 189, 248, 0.35);
        }

        .card--last {
          border-color: rgba(251, 55, 255, 0.38);
        }
        .cardGlow {
          position: absolute;
          inset: -40px -60px auto -60px;
          height: 120px;
          background: radial-gradient(circle at 40% 50%, rgba(251, 55, 255, 0.22), transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .cardTop {
          position: relative;
          display: flex;
          gap: 12px;
          align-items: center;
          z-index: 1;
        }

        .avatarRing {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          padding: 2px;
          background: conic-gradient(from 180deg, var(--g1), var(--g2), var(--g3), var(--g1));
          box-shadow: 0 14px 40px rgba(15, 23, 42, 0.65);
          flex: 0 0 auto;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 999px;
          background: rgba(2, 6, 23, 0.9);
          overflow: hidden;
          display: grid;
          place-items: center;
        }

        .avatarImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 20%;
          display: block;
        }

        .avatarFallback {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          color: rgba(226, 232, 240, 0.92);
          font-weight: 850;
        }

        .meta {
          min-width: 0;
          flex: 1;
        }

        .nameRow {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .name {
          font-weight: 780;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-size: 0.92rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge {
          font-size: 0.66rem;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(248, 250, 252, 0.18);
          background: rgba(2, 6, 23, 0.55);
          color: rgba(248, 250, 252, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        .type {
          margin-top: 4px;
          font-size: 0.8rem;
          color: rgba(148, 163, 184, 0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ctaRow {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: flex-end;
        }

        .cta {
          font-size: 0.84rem;
          color: rgba(248, 250, 252, 0.94);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>
    </main>
  );
}
}
