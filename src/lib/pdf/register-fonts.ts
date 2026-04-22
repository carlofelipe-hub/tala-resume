import { Font } from "@react-pdf/renderer";

// Editorial: Instrument Serif + Geist
Font.register({
  family: "Instrument Serif",
  src: "https://fonts.gstatic.com/s/instrumentserif/v4/jizBRFtNs2ka5fXjeivQ4LroWlx-2zIZj1bIkNo.woff2",
});
Font.register({
  family: "Geist",
  src: "https://fonts.gstatic.com/s/geist/v1/gyBhhwUxIdKoE5NaTOQr.woff2",
});

// Kuwentuhan: DM Serif Display + DM Sans
Font.register({
  family: "DM Serif Display",
  src: "https://fonts.gstatic.com/s/dmserifdisplay/v15/-nFnOHM81r4j6k0gjAW3mujVU2B2G_5x0ujy.woff2",
});
Font.register({
  family: "DM Sans",
  src: "https://fonts.gstatic.com/s/dmsans/v15/rP2Yp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxRR23w.woff2",
});

// Pinoy: Fraunces + Newsreader
Font.register({
  family: "Fraunces",
  src: "https://fonts.gstatic.com/s/fraunces/v31/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib14c7qv8o.woff2",
});
Font.register({
  family: "Newsreader",
  src: "https://fonts.gstatic.com/s/newsreader/v20/cY9qfjOCX1hbuyalUrK439vogqC9yFZCYg7oRZaLP4obnf7fTXglsMz-.woff2",
});

// Retro: Gloock + Space Grotesk
Font.register({
  family: "Gloock",
  src: "https://fonts.gstatic.com/s/gloock/v1/Iurb6YFw84WUY4Pnoz_9pQ.woff2",
});
Font.register({
  family: "Space Grotesk",
  src: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2",
});

// Signpainter: Shrikhand + Plus Jakarta Sans
Font.register({
  family: "Shrikhand",
  src: "https://fonts.gstatic.com/s/shrikhand/v15/a8IbNovqLWfZWU7gam5.woff2",
});
Font.register({
  family: "Plus Jakarta Sans",
  src: "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIoa08I4iJmwzhcB9XqrR4J_j4z4z12r42D.woff2",
});

// Monospace fallback
Font.register({
  family: "Geist Mono",
  src: "https://fonts.gstatic.com/s/geistmono/v1/gyBthhwUxIdKoE5NaTOQrE4P5ClP5wU5PqU.woff2",
});

export const pdfFontMap: Record<string, { display: string; body: string; mono: string }> = {
  editorial: { display: "Instrument Serif", body: "Geist", mono: "Geist Mono" },
  kuwentuhan: { display: "DM Serif Display", body: "DM Sans", mono: "Geist Mono" },
  pinoy: { display: "Fraunces", body: "Newsreader", mono: "Geist Mono" },
  retro: { display: "Gloock", body: "Space Grotesk", mono: "Geist Mono" },
  signpainter: { display: "Shrikhand", body: "Plus Jakarta Sans", mono: "Geist Mono" },
};
