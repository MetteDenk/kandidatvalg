import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: "Psykologkompasset",
  description: "Hjemmesider til kandidater ved personvalget i Dansk Psykolog Forening.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className={fontVariables}>{children}</body>
    </html>
  );
}
