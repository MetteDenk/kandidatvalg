import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";

// Ingen beskrivelse og ingen indeksering: siden skal ikke dukke op i
// søgemaskiner eller AI-svar, så længe den kun er for få personer.
export const metadata: Metadata = {
  title: "Psykologkompasset",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className={fontVariables}>{children}</body>
    </html>
  );
}
