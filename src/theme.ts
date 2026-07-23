/**
 * Loop design system.
 *
 * Tuned for the core crochet/knitting demographic (largely 45+): warm and
 * cozy rather than techy, generous type sizes, high contrast text, and big
 * touch targets. Think "yarn shop", not "SaaS dashboard".
 */

export const colors = {
  // Warm paper background, like undyed wool.
  bg: "#FBF4EA",
  bgDeep: "#F4E9D8",

  // Cards / surfaces.
  surface: "#FFFFFF",
  surfaceMuted: "#FFFBF5",

  // Primary accent — a warm terracotta/yarn-rust.
  primary: "#C85D4D",
  primaryDark: "#A8442F",
  primarySoft: "#F6DAD1",

  // A sage secondary for balance.
  sage: "#7C9070",
  sageSoft: "#E4EADD",

  // Text.
  text: "#3B2F2A", // warm near-black
  textMuted: "#8A7A6D",
  textFaint: "#B6A899",

  // Lines & borders.
  border: "#EADFCF",
  borderStrong: "#DCCBB3",

  // States.
  danger: "#B23A3A",
  white: "#FFFFFF",
} as const;

export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
} as const;

export const type = {
  display: 96, // the big counter number
  title: 30,
  heading: 22,
  body: 18,
  label: 15,
} as const;

// Soft, warm shadow used on cards and the big tap button.
export const shadow = {
  shadowColor: "#7A5A3A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 14,
  elevation: 4,
} as const;
