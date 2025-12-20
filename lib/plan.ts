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

export function planFromPricingName(name: string | null | undefined): PlanId {
  const n = (name || "").toLowerCase();
  if (n.includes("chat")) return "chat";
  if (n.includes("plus")) return "plus";
  if (n.includes("illimit") || n.includes("unlimited")) return "unlimited";
  return "free";
}

/** Si tu reçois déjà plan_id = free/chat/plus/unlimited */
export function normalizePlan(raw: string | null | undefined): PlanId {
  return raw === "free" || raw === "chat" || raw === "plus" || raw === "unlimited"
    ? raw
    : "free";
}

export function canCreateAmoria(plan: PlanId, activeCount: number): boolean {
  return activeCount < maxAmoriaForPlan(plan);
}
