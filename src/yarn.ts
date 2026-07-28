/**
 * Yarn weight vocabulary, shared by the stash list and the yarn editor.
 *
 * The DB stores the raw value ("worsted"); everything user-facing goes through
 * `weightLabel` so the list and the editor can never disagree — and so the
 * stash list stops showing "dk" where it means "DK".
 */
import type { TFunc } from "./i18n";
import type { TranslationKey } from "./i18n/translations";

export const YARN_WEIGHTS = [
  "lace",
  "fingering",
  "sport",
  "dk",
  "worsted",
  "aran",
  "bulky",
  "super_bulky",
] as const;

export type YarnWeight = (typeof YARN_WEIGHTS)[number];

/**
 * Display name for a stored weight. Unknown values (older rows, hand-edited
 * data) are passed through rather than hidden, so nothing silently disappears.
 */
export function weightLabel(t: TFunc, weight: string | null | undefined): string {
  if (!weight) return "";
  const known = (YARN_WEIGHTS as readonly string[]).includes(weight);
  return known ? t(`weight.${weight}` as TranslationKey) : weight;
}

/** Options for the weight picker, in the order crafters expect (fine → chunky). */
export function weightOptions(t: TFunc): { label: string; value: string }[] {
  return YARN_WEIGHTS.map((w) => ({ label: t(`weight.${w}`), value: w }));
}
