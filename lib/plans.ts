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
