import {
  DM_Serif_Display,
  DM_Sans,
  Caveat,
  Instrument_Serif,
  Geist,
  Fraunces,
  Newsreader,
  Gloock,
  Space_Grotesk,
  Shrikhand,
  Plus_Jakarta_Sans,
  Geist_Mono,
} from "next/font/google";

// -- Shared / utility -------------------------------------------------------
export const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// -- Editorial pairing: Instrument Serif + Geist ----------------------------
export const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const geist = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

// -- Kuwentuhan (default): DM Serif Display + Caveat + DM Sans --------------
export const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// -- Pinoy: Fraunces + Newsreader -------------------------------------------
export const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const newsreader = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600"],
});

// -- Retro: Gloock + Space Grotesk ------------------------------------------
export const gloock = Gloock({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// -- Signpainter: Shrikhand + Plus Jakarta Sans -----------------------------
export const shrikhand = Shrikhand({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ---------------------------------------------------------------------------
// Helper: return CSS variable classnames for a given pairing name
// ---------------------------------------------------------------------------
export function getFontClasses(pairing: string): string {
  switch (pairing) {
    case "editorial":
      return `${instrumentSerif.variable} ${geist.variable} ${geistMono.variable}`;
    case "kuwentuhan":
      return `${dmSerifDisplay.variable} ${caveat.variable} ${dmSans.variable} ${geistMono.variable}`;
    case "pinoy":
      return `${fraunces.variable} ${newsreader.variable} ${geistMono.variable}`;
    case "retro":
      return `${gloock.variable} ${spaceGrotesk.variable} ${geistMono.variable}`;
    case "signpainter":
      return `${shrikhand.variable} ${plusJakartaSans.variable} ${geistMono.variable}`;
    default:
      return `${dmSerifDisplay.variable} ${caveat.variable} ${dmSans.variable} ${geistMono.variable}`;
  }
}
