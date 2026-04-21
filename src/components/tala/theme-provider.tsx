"use client";

import { useEffect, type ReactNode } from "react";
import {
  palettes,
  type PaletteName,
  type TypographyName,
  type MotifName,
  type DensityName,
  typographyPairings,
} from "@/lib/tokens";

interface ThemeProviderProps {
  palette?: PaletteName;
  typography?: TypographyName;
  motif?: MotifName;
  density?: DensityName;
  children: ReactNode;
}

export function ThemeProvider({
  palette = "sun-gold",
  typography = "kuwentuhan",
  motif = "subtle",
  density = "regular",
  children,
}: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    const p = palettes[palette];

    // Set palette CSS vars
    root.style.setProperty("--tala-bg", p.bg);
    root.style.setProperty("--tala-surface", p.surface);
    root.style.setProperty("--tala-ink", p.ink);
    root.style.setProperty("--tala-muted", p.muted);
    root.style.setProperty("--tala-faint", p.faint);
    root.style.setProperty("--tala-rule", p.rule);
    root.style.setProperty("--tala-accent", p.accent);
    root.style.setProperty("--tala-accent-ink", p.accentInk);
    root.style.setProperty("--tala-accent-wash", p.accentWash);

    // Set data attributes for motif / density
    root.dataset.motif = motif;
    root.dataset.density = density;
    root.dataset.palette = palette;
    root.dataset.typography = typography;
  }, [palette, typography, motif, density]);

  // We don't set font-family here because next/font injects the CSS vars
  // at a higher level (layout.tsx). The globals.css maps --font-display etc.
  void typographyPairings[typography]; // ensure valid key

  return <>{children}</>;
}
