/**
 * Free-tier limits. Reaching any of these prompts the paywall. Loop Plus
 * removes all of them. Tuned to be generous enough to feel useful but tight
 * enough that an active crafter bumps into it within a project or two.
 */
export const FREE_LIMITS = {
  projects: 2,
  countersPerProject: 3,
  yarns: 10,
  patterns: 2,
} as const;

export type LimitKind = keyof typeof FREE_LIMITS;

export const LIMIT_COPY: Record<LimitKind, { label: string; blurb: string }> = {
  projects: { label: "projects", blurb: "Create unlimited projects" },
  countersPerProject: { label: "counters", blurb: "Add as many counters as your pattern needs" },
  yarns: { label: "yarns", blurb: "Catalogue your whole stash" },
  patterns: { label: "patterns", blurb: "Save every pattern in one place" },
};

export const PLUS_BENEFITS = [
  "Unlimited projects & counters",
  "Unlimited yarn stash & patterns",
  "Every future Plus feature included",
];

/** Marketing prices shown in DEV mode (real prices come from the store). */
export const DEV_PRICES = {
  monthly: "$4.99 / month",
  yearly: "$29.99 / year",
};
