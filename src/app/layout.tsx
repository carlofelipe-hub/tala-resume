import type { Metadata, Viewport } from "next";
import { getFontClasses } from "@/lib/fonts";
import { ThemeProvider } from "@/components/tala/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tala — Filipino AI Resume Builder",
  description:
    "Tala interviews you kuwentuhan-style, pulls out the wins you'd usually forget to mention, and turns them into a resume that lands.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontClasses = getFontClasses("kuwentuhan");

  return (
    <html lang="en" className={`${fontClasses} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          palette="sun-gold"
          typography="kuwentuhan"
          motif="subtle"
          density="regular"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
