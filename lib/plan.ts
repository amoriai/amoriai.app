export type PlanId = "free" | "chat" | "plus" | "unlimited";

export function maxAmoriaForPlan(plan: PlanId): number {
  switch (plan) {
    case "free":
      return 1;
    case "chat":
      return 2;
    case "plus":
      return 10;
    case "unlimited":
      return 30;
    default:
      return 1;
  }
}

/**
 * Si tu reçois un nom marketing (ex: "AmorIAI Plus", "AmorIAI Illimité")
 * -> on map vers un plan.
 */
export function planFromPricingName(name: string | null | undefined): PlanId {
  const n = String(name ?? "")
    .toLowerCase()
    .trim();

  // Unlimited / Illimité
  if (n.includes("illimit") || n.includes("unlimited")) return "unlimited";

  // Plus
  // on évite "surplus" etc. en checkant " plus" ou "plus " ou "-plus" etc.
  if (/\bplus\b/.test(n)) return "plus";

  // Chat
  if (/\bchat\b/.test(n)) return "chat";

  return "free";
}

/** Si tu reçois déjà plan_id = free/chat/plus/unlimited */
export function normalizePlan(raw: string | null | undefined): PlanId {
  const v = String(raw ?? "")
    .toLowerCase()
    .trim();

  return v === "free" || v === "chat" || v === "plus" || v === "unlimited" ? (v as PlanId) : "free";
}

export function canCreateAmoria(plan: PlanId, activeCount: number): boolean {
  return activeCount < maxAmoriaForPlan(plan);
}
