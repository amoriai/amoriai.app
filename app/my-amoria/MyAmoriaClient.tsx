"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { maxAmoriaForPlan, type PlanId } from "@/lib/plan";

type Locale = "fr" | "en" | "es";

type UiStrings = {
  title: string;
  loading: string;
  activePlanLabel: string;

  noAiTitle: string;
  noAiBody: string;
  createNow: string;
  backHome: string;
  planHint: string;

  retry: string;
  diagTitle: string;
  diagNoAccess: string;
  diagUnknown: string;

  limitReachedTitle: string;
  limitReachedBody: (max: number) => string;
};

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

const STRINGS: Record<Locale, UiStrings> = {
  fr: {
    title: "Ton espace AmorIAI",
    loading: "Chargement de ton espace AmorIAI…",
    activePlanLabel: "Plan actif",

    noAiTitle: "Aucune IA détectée",
    noAiBody: "Tu es bien connectée, mais aucune AmorIAI n’a été trouvée pour ce compte.",
    createNow: "Créer mon AmorIAI maintenant",
    backHome: "Retour à la page d’accueil",
    planHint: "Ton plan est appliqué automatiquement (Free, Chat, Plus, Unlimited).",

    retry: "Réessayer",
    diagTitle: "Diagnostic",
    diagNoAccess: "Accès refusé à la base (RLS / policies). Vérifie les policies Supabase.",
    diagUnknown: "Une erreur est survenue. Regarde la console (F12) pour voir le détail.",

    limitReachedTitle: "Limite atteinte",
    limitReachedBody: (max) => `Tu as atteint la limite de ton plan (${max} AmorIA max).`,
  },
  en: {
    title: "Your AmorIAI space",
    loading: "Loading your AmorIAI space…",
    activePlanLabel: "Active plan",

    noAiTitle: "No AI detected",
    noAiBody: "You are logged in, but we couldn’t find an AmorIAI for this account.",
    createNow: "Create my AmorIAI now",
    backHome: "Back to homepage",
    planHint: "Your plan is automatically enforced (Free, Chat, Plus, Unlimited).",

    retry: "Retry",
    diagTitle: "Diagnostics",
    diagNoAccess: "Access denied (RLS / policies). Check Supabase policies.",
    diagUnknown: "Something went wrong. Check the browser console (F12).",

    limitReachedTitle: "Limit reached",
    limitReachedBody: (max) => `You reached your plan limit (${max} max AmorIA).`,
  },
  es: {
    title: "Tu espacio AmorIAI",
    loading: "Cargando tu espacio AmorIAI…",
    activePlanLabel: "Plan activo",

    noAiTitle: "Ninguna IA detectada",
    noAiBody: "Estás conectada, pero no encontramos un AmorIAI para esta cuenta.",
    createNow: "Crear mi AmorIAI ahora",
    backHome: "Volver a la página de inicio",
    planHint: "Tu plan se respeta automáticamente (Free, Chat, Plus, Unlimited).",

    retry: "Reintentar",
    diagTitle: "Diagnóstico",
    diagNoAccess: "Acceso denegado (RLS / policies).",
    diagUnknown: "Ocurrió un error. Revisa la consola (F12).",

    limitReachedTitle: "Límite alcanzado",
    limitReachedBody: (max) => `Alcanzaste el límite de tu plan (${max} AmorIA máx).`,
  },
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; plan: PlanId; maxAllowed: number; aiCount: number }
  | { status: "error"; message: string; kind: "no_access" | "unknown" };

function looksLikeRlsError(message: string) {
  const msg = (message || "").toLowerCase();
  return (
    msg.includes("permission") ||
    msg.includes("not allowed") ||
    msg.includes("rls") ||
    msg.includes("policy") ||
    msg.includes("violates row-level security")
  );
}

function normalizePlanCode(raw: any): PlanId {
  const v = String(raw ?? "").toLowerCase().trim();
  return v === "free" || v === "chat" || v === "plus" || v === "unlimited" ? (v as PlanId) : "free";
}

export default function MyAmoriaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lang = useMemo(() => normalizeLocale(searchParams.get("lang")), [searchParams]);
  const t = STRINGS[lang];

  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = async () => {
    setState({ status: "loading" });

    // 1) Auth
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr) console.error("auth.getUser error:", authErr);

    const user = authData?.user;
    if (!user) {
      router.replace(`/login?lang=${lang}`);
      return;
    }

    const userId = user.id;

    // 2) Plan (current=true) + join pricing_plans(code)
    let plan: PlanId = "free";

    const { data: sub, error: subErr } = await supabase
      .from("user_subscriptions")
      .select(
        `
          pricing_plan_id,
          current,
          pricing_plans:pricing_plan_id (
            code
          )
        `
      )
      .eq("user_id", userId)
      .eq("current", true)
      .maybeSingle();

    if (subErr) {
      console.error("user_subscriptions SELECT error:", subErr);
      const rls = looksLikeRlsError(subErr.message || "");
      setState({
        status: "error",
        kind: rls ? "no_access" : "unknown",
        message: rls ? t.diagNoAccess : t.diagUnknown,
      });
      return;
    }

    const planCode: any = (sub as any)?.pricing_plans?.code;
    plan = normalizePlanCode(planCode);

    const maxAllowed = maxAmoriaForPlan(plan);

    // 3) IA count
    const { count, error: countErr } = await supabase
      .from("user_amoria")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_archived", false);

    if (countErr) {
      console.error("user_amoria COUNT error:", countErr);
      const rls = looksLikeRlsError(countErr.message || "");
      setState({
        status: "error",
        kind: rls ? "no_access" : "unknown",
        message: rls ? t.diagNoAccess : t.diagUnknown,
      });
      return;
    }

    const aiCount = typeof count === "number" ? count : 0;

    // 0 IA -> écran create
    if (aiCount === 0) {
      setState({ status: "ready", plan, maxAllowed, aiCount });
      return;
    }

    // 1 IA -> récupérer 1 id et aller chat direct
    if (aiCount === 1) {
      const { data: one, error: oneErr } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", userId)
        .eq("is_archived", false)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (oneErr || !one?.id) {
        console.error("user_amoria SELECT 1 error:", oneErr);
        setState({ status: "ready", plan, maxAllowed, aiCount: 0 });
        return;
      }

      router.replace(`/chat?iaId=${one.id}&lang=${lang}`);
      return;
    }

    // 2+ IA -> page select
    router.replace(`/my-amoria/select?lang=${lang}`);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // ---------- UI (no Tailwind) ----------
  if (state.status === "loading") {
    return (
      <main className="page">
        <div className="loader">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <p className="hint">{t.loading}</p>

        <style jsx>{styles}</style>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="page">
        <section className="card">
          <header className="head">
            <div className="badge">AMORIAI</div>
            <h1 className="title">{t.title}</h1>
          </header>

          <div className="panel">
            <h2 className="panelTitle">{t.diagTitle}</h2>
            <p className="panelText">{state.message}</p>
          </div>

          <div className="actions">
            <button className="btn btnPrimary" onClick={() => void load()}>
              {t.retry}
            </button>

            <button className="btn btnGhost" onClick={() => router.push("/")}>
              {t.backHome}
            </button>
          </div>
        </section>

        <style jsx>{styles}</style>
      </main>
    );
  }

  // READY state (0 IA)
  const { plan, maxAllowed, aiCount } = state;
  const limitReached = aiCount >= maxAllowed;

  return (
    <main className="page">
      <section className="card">
        <header className="head">
          <div className="badge">AMORIAI</div>
          <h1 className="title">{t.title}</h1>
          <div className="plan">
            <span className="planLabel">{t.activePlanLabel}</span>
            <span className="planPill">{plan.toUpperCase()}</span>
          </div>
        </header>

        <div className="panel">
          <h2 className="panelTitle">{limitReached ? t.limitReachedTitle : t.noAiTitle}</h2>
          <p className="panelText">{limitReached ? t.limitReachedBody(maxAllowed) : t.noAiBody}</p>
        </div>

        <div className="actions">
          {/* IMPORTANT: on ne met pas plan dans l’URL */}
          <button
            className={limitReached ? "btn btnDisabled" : "btn btnPrimary"}
            onClick={() => router.push(`/create-amoria?lang=${lang}`)}
            disabled={limitReached}
          >
            {t.createNow}
          </button>

          <button className="btn btnGhost" onClick={() => router.push("/")}>
            {t.backHome}
          </button>
        </div>

        <p className="footnote">{t.planHint}</p>
      </section>

      <style jsx>{styles}</style>
    </main>
  );
}

const styles = `
  :global(html){ color-scheme: dark; }
  :global(body){
    margin: 0;
    height: 100%;
    overflow: hidden;
    background: #000;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }

  .page{
    --bg0: #000;
    --bg1: #020617;
    --glass: rgba(2,6,23,.55);
    --line: rgba(148,163,184,.22);
    --text: rgba(226,232,240,.92);

    --g1: #fb37ff;
    --g2: #ff6b9c;
    --g3: #38bdf8;
    --g4: #f97316;

    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 22px 14px;
    color: var(--text);

    background:
      radial-gradient(1100px 700px at 50% -10%, rgba(251,55,255,.24), transparent 60%),
      radial-gradient(900px 700px at 90% 10%, rgba(56,189,248,.18), transparent 55%),
      radial-gradient(950px 700px at 10% 25%, rgba(249,115,22,.12), transparent 60%),
      linear-gradient(180deg, var(--bg1), var(--bg0));
  }

  .card{
    width: min(720px, 100%);
    border-radius: 26px;
    border: 1px solid rgba(148,163,184,.26);
    background:
      radial-gradient(900px 600px at 50% 0%, rgba(251,55,255,.14), transparent 60%),
      radial-gradient(800px 520px at 80% 0%, rgba(56,189,248,.10), transparent 55%),
      linear-gradient(180deg, rgba(15,23,42,.86), rgba(2,6,23,.78));
    box-shadow: 0 26px 90px rgba(0,0,0,.75);
    padding: 18px 18px 14px;
    backdrop-filter: blur(12px);
  }

  .head{
    display: grid;
    gap: 10px;
    justify-items: center;
    text-align: center;
    margin-bottom: 14px;
  }

  .badge{
    font-size: .7rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    padding: 7px 10px;
    border-radius: 999px;
    border: 1px solid rgba(248,250,252,.18);
    background: rgba(2,6,23,.55);
    width: fit-content;
  }

  .title{
    margin: 0;
    font-size: 1.4rem;
    font-weight: 780;
  }

  .plan{
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 2px;
    color: rgba(148,163,184,.95);
    font-size: .86rem;
  }
  .planLabel{
    opacity: .95;
  }
  .planPill{
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid rgba(148,163,184,.22);
    background: rgba(2,6,23,.45);
    color: rgba(226,232,240,.92);
    font-weight: 700;
    letter-spacing: .06em;
  }

  .panel{
    border-radius: 18px;
    border: 1px solid rgba(148,163,184,.22);
    background:
      radial-gradient(800px 420px at 50% 0%, rgba(56,189,248,.06), transparent 55%),
      linear-gradient(180deg, rgba(2,6,23,.50), rgba(2,6,23,.66));
    padding: 14px 14px;
    box-shadow: inset 0 0 0 1px rgba(2,6,23,.25);
  }

  .panelTitle{
    margin: 0;
    font-size: 1.02rem;
    font-weight: 760;
  }

  .panelText{
    margin: 8px 0 0;
    color: rgba(148,163,184,.92);
    line-height: 1.4;
    font-size: .92rem;
  }

  .actions{
    display: grid;
    gap: 10px;
    margin-top: 14px;
  }

  .btn{
    width: 100%;
    border-radius: 999px;
    padding: 12px 14px;
    font-weight: 720;
    font-size: .95rem;
    cursor: pointer;
    user-select: none;
    transition: transform 120ms ease, filter 120ms ease, opacity 120ms ease, border-color 120ms ease;
  }
  .btn:hover{
    transform: translateY(-1px);
    filter: brightness(1.02);
  }

  .btnPrimary{
    border: none;
    color: rgba(248,250,252,.98);
    background: linear-gradient(135deg, var(--g1), var(--g2), var(--g4));
    box-shadow: 0 16px 46px rgba(248,113,113,.38);
  }

  .btnGhost{
    border: 1px solid rgba(148,163,184,.28);
    background: rgba(2,6,23,.45);
    color: rgba(226,232,240,.92);
  }

  .btnDisabled{
    border: 1px solid rgba(148,163,184,.18);
    background: rgba(148,163,184,.12);
    color: rgba(148,163,184,.75);
    cursor: not-allowed;
    box-shadow: none;
  }
  .btnDisabled:hover{
    transform: none;
    filter: none;
  }

  .footnote{
    margin: 12px 0 0;
    text-align: center;
    font-size: .78rem;
    color: rgba(148,163,184,.75);
    line-height: 1.35;
  }

  .loader{
    display: inline-flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 14px 18px;
    border-radius: 999px;
    border: 1px solid rgba(148,163,184,.22);
    background: rgba(2,6,23,.55);
    box-shadow: 0 16px 60px rgba(15,23,42,.9);
    backdrop-filter: blur(10px);
  }
  .dot{
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(226,232,240,.85);
    animation: dot 900ms ease-in-out infinite;
  }
  .dot:nth-child(2){ animation-delay: 120ms; }
  .dot:nth-child(3){ animation-delay: 240ms; }

  .hint{
    margin: 14px 0 0;
    font-size: .9rem;
    color: rgba(148,163,184,.9);
    text-align: center;
  }

  @keyframes dot{
    0%,100%{ transform: translateY(0); opacity: .45; }
    50%{ transform: translateY(-6px); opacity: 1; }
  }

  @media (max-width: 520px){
    .card{ padding: 16px 14px 12px; border-radius: 24px; }
    .title{ font-size: 1.25rem; }
    .btn{ padding: 12px 14px; }
  }
`;
