"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { maxAmoriaForPlan, type PlanId } from "@/lib/plan";

type Locale = "fr" | "en" | "es";

function normalizeLocale(raw: string | null): Locale {
  return raw === "fr" || raw === "en" || raw === "es" ? raw : "fr";
}

function normalizePlan(raw: unknown): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited" ? raw : "free";
}

export default function MyAmoriaClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const lang = useMemo(() => normalizeLocale(sp.get("lang")), [sp]);

  const cancelledRef = useRef(false);
  const redirectedRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    redirectedRef.current = false;

    const safeReplace = (url: string) => {
      if (cancelledRef.current) return;
      if (redirectedRef.current) return;
      redirectedRef.current = true;
      router.replace(url);
    };

    const run = async () => {
      // 1) Auth
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (cancelledRef.current) return;

      const user = authData?.user ?? null;

      if (authErr || !user) {
        safeReplace(`/login?lang=${encodeURIComponent(lang)}`);
        return;
      }

      // 2) Plan (current=true sinon status=active)
      let plan: PlanId = "free";

      try {
        let sub: any = null;

        const q1 = await supabase
          .from("user_subscriptions")
          .select(
            `
            pricing_plans (
              code
            )
          `
          )
          .eq("user_id", user.id)
          .eq("current", true)
          .maybeSingle();

        if (!q1.error && q1.data) sub = q1.data;

        if (!sub) {
          const q2 = await supabase
            .from("user_subscriptions")
            .select(
              `
              pricing_plans (
                code
              )
            `
            )
            .eq("user_id", user.id)
            .eq("status", "active")
            .maybeSingle();

          if (!q2.error && q2.data) sub = q2.data;
        }

        const rawPlans: any = sub?.pricing_plans;
        const code = Array.isArray(rawPlans) ? rawPlans[0]?.code : rawPlans?.code;

        plan = normalizePlan(code);
      } catch {
        plan = "free";
      }

      if (cancelledRef.current) return;

      // (optionnel) maxAllowed si tu l’utilises ailleurs
      const maxAllowed = maxAmoriaForPlan(plan);
      void maxAllowed;

      // 3) Count IA actives
      const countRes = await supabase
        .from("user_amoria")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_archived", false);

      if (cancelledRef.current) return;

      // ✅ En cas d’erreur, on envoie vers create (meilleure UX que rester bloqué)
      if (countRes.error) {
        console.error("user_amoria count error:", countRes.error);
        safeReplace(`/create-amoria?lang=${encodeURIComponent(lang)}`);
        return;
      }

      const aiCount = typeof countRes.count === "number" ? countRes.count : 0;

      // ✅ FIX: 0 IA => redirection DIRECTE vers /create-amoria
      if (aiCount === 0) {
        safeReplace(`/create-amoria?lang=${encodeURIComponent(lang)}`);
        return;
      }

      const toChat = (iaId: string) =>
        safeReplace(`/chat?iaId=${encodeURIComponent(iaId)}&lang=${encodeURIComponent(lang)}`);

      // 4) Plans payants: chat direct (last used -> most recent -> select)
      if (plan !== "free") {
        // a) last used
        let lastId: string | null = null;
        try {
          lastId = window.localStorage.getItem("amoria_last_ia_id");
        } catch {}

        if (lastId) {
          const { data: last } = await supabase
            .from("user_amoria")
            .select("id")
            .eq("id", lastId)
            .eq("user_id", user.id)
            .eq("is_archived", false)
            .maybeSingle();

          if (cancelledRef.current) return;

          if (last?.id) {
            toChat(last.id);
            return;
          }
        }

        // b) most recent
        const { data: recent } = await supabase
          .from("user_amoria")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_archived", false)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cancelledRef.current) return;

        if (recent?.id) {
          toChat(recent.id);
          return;
        }

        safeReplace(`/my-amoria/select?lang=${encodeURIComponent(lang)}`);
        return;
      }

      // 5) Plan free: on ne montre jamais /select.
      // S'il existe au moins 1 IA, on ouvre toujours la première.
      const { data: first } = await supabase
        .from("user_amoria")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: true }) // première IA créée
        .limit(1)
        .maybeSingle();

      if (cancelledRef.current) return;

      if (first?.id) {
        toChat(first.id);
        return;
      }

      // fallback rare
      safeReplace(`/create-amoria?lang=${encodeURIComponent(lang)}`);
    };

    void run();

    return () => {
      cancelledRef.current = true;
    };
  }, [lang, router]);

  return (
    <main className="boot">
      <div className="boot__box" aria-live="polite">
        <div className="boot__dots" aria-hidden="true">
          <span className="boot__dot" />
          <span className="boot__dot" />
          <span className="boot__dot" />
        </div>
        <p className="boot__text">Ouverture…</p>
      </div>

      <style jsx>{`
        :global(html) {
          color-scheme: dark;
        }
        :global(body) {
          margin: 0;
          height: 100%;
        }

        .boot {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px 16px;
          color: rgba(226, 232, 240, 0.92);
          background: radial-gradient(
              1100px 700px at 50% -10%,
              rgba(251, 55, 255, 0.22),
              transparent 60%
            ),
            radial-gradient(900px 700px at 90% 10%, rgba(56, 189, 248, 0.16), transparent 55%),
            radial-gradient(950px 700px at 10% 25%, rgba(249, 115, 22, 0.12), transparent 60%),
            linear-gradient(180deg, #020617, #000);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
            "Apple Color Emoji", "Segoe UI Emoji";
        }

        .boot__box {
          display: grid;
          gap: 12px;
          justify-items: center;
          padding: 18px 18px 16px;
          border-radius: 22px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: rgba(2, 6, 23, 0.55);
          box-shadow: 0 16px 60px rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
        }

        .boot__dots {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: rgba(2, 6, 23, 0.35);
        }

        .boot__dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(226, 232, 240, 0.85);
          animation: bootDot 900ms ease-in-out infinite;
        }
        .boot__dot:nth-child(2) {
          animation-delay: 120ms;
        }
        .boot__dot:nth-child(3) {
          animation-delay: 240ms;
        }

        .boot__text {
          margin: 0;
          font-size: 0.9rem;
          color: rgba(148, 163, 184, 0.9);
          text-align: center;
        }

        @keyframes bootDot {
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
