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

// Limit-reason copy and Plus benefit bullets are now localized — see the
// translation keys `units.*`, `paywall.*`, and `plus.*` in src/i18n.

/** Marketing prices shown in DEV mode (real prices come from the store). */
export const DEV_PRICES = {
  monthly: "$4.99 / month",
  yearly: "$29.99 / year",
};
