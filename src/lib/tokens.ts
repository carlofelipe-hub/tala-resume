// ---------------------------------------------------------------------------
// Tala Design Tokens
// ---------------------------------------------------------------------------

// -- Palettes ---------------------------------------------------------------
export const palettes = {
  "sun-gold": {
    bg: "oklch(0.985 0.008 85)",
    surface: "#ffffff",
    ink: "oklch(0.22 0.015 60)",
    muted: "oklch(0.55 0.01 60)",
    faint: "oklch(0.75 0.008 60)",
    rule: "oklch(0.90 0.005 85)",
    accent: "oklch(0.78 0.14 75)",
    accentInk: "oklch(0.35 0.08 60)",
    accentWash: "oklch(0.95 0.04 75)",
  },
  calamansi: {
    bg: "oklch(0.985 0.008 120)",
    surface: "#ffffff",
    ink: "oklch(0.23 0.02 150)",
    muted: "oklch(0.55 0.01 150)",
    faint: "oklch(0.75 0.008 150)",
    rule: "oklch(0.90 0.005 120)",
    accent: "oklch(0.72 0.16 135)",
    accentInk: "oklch(0.32 0.08 135)",
    accentWash: "oklch(0.95 0.04 135)",
  },
  sampaguita: {
    bg: "oklch(0.985 0.005 280)",
    surface: "#ffffff",
    ink: "oklch(0.22 0.02 270)",
    muted: "oklch(0.55 0.01 270)",
    faint: "oklch(0.75 0.008 270)",
    rule: "oklch(0.90 0.005 280)",
    accent: "oklch(0.55 0.14 265)",
    accentInk: "oklch(0.30 0.08 265)",
    accentWash: "oklch(0.95 0.04 265)",
  },
  terracotta: {
    bg: "oklch(0.98 0.01 50)",
    surface: "#ffffff",
    ink: "oklch(0.22 0.02 40)",
    muted: "oklch(0.55 0.01 40)",
    faint: "oklch(0.75 0.008 40)",
    rule: "oklch(0.90 0.005 50)",
    accent: "oklch(0.60 0.15 40)",
    accentInk: "oklch(0.30 0.08 40)",
    accentWash: "oklch(0.95 0.04 40)",
  },
} as const;

export type PaletteName = keyof typeof palettes;

// -- Typography Pairings ----------------------------------------------------
export const typographyPairings = {
  editorial: {
    display: "Instrument Serif",
    body: "Geist",
    hand: null,
  },
  kuwentuhan: {
    display: "DM Serif Display",
    body: "DM Sans",
    hand: "Caveat",
  },
  pinoy: {
    display: "Fraunces",
    body: "Newsreader",
    hand: null,
  },
  retro: {
    display: "Gloock",
    body: "Space Grotesk",
    hand: null,
  },
  signpainter: {
    display: "Shrikhand",
    body: "Plus Jakarta Sans",
    hand: null,
  },
} as const;

export type TypographyName = keyof typeof typographyPairings;

// -- Motif & Density -------------------------------------------------------
export type MotifName = "none" | "subtle" | "bold";
export type DensityName = "compact" | "regular" | "spacious";

// -- Animations -------------------------------------------------------------
export const animations = {
  spin: "spin 1s linear infinite",
  pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
  blink: "blink 1s step-end infinite",
  typing: "typing 3.5s steps(40,end), blink 0.75s step-end infinite",
} as const;

export const keyframes = {
  spin: { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
  pulse: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".5" } },
  blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
  typing: { from: { width: "0" }, to: { width: "100%" } },
} as const;
