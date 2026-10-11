// De fire typografier fra design-systemet. next/font self-hoster fontene
// ved build — ingen runtime-kald til Google (jf. EU-kravet).
import { Caveat, Fraunces, Inter, Poppins } from "next/font/google";

// Fraunces, Inter og Caveat er VARIABLE fonte. De bedes derfor om uden
// weight, saa hele vaegtaksen kommer med i én fil. Bad man om faste vaegte
// paa en variabel font, faldt bygningen med
//   "An error occurred in next/font. TypeError: Cannot read properties of
//    null (reading '1')"
// fra @next/font/google/loader.js, fordi loaderen ikke kan finde en
// enkeltvaegtsfil at hente. Det braekkede produktionsbygningen 2/10-2026 og
// blokerede fire commits; lokalt gik det igennem paa en varm cache, saa
// fejlen var usynlig indtil en ren bygning.
//
// Poppins er IKKE variabel. Dér er weight paakraevet og skal blive staaende.
export const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
export const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "600", "700"] });
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const fontVariables = [fraunces.variable, poppins.variable, inter.variable, caveat.variable].join(" ");
