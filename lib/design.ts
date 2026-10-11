// ---------------------------------------------------------------------------
// Designsystemet for kandidatsiderne: 4 layouts, 9 farvepaletter, 4 typografier.
// Paletter og typografier er de samme som i Fagspejlet (kopieret, ikke delt).
// ---------------------------------------------------------------------------

export type LayoutId = "enside" | "anker" | "mosaik" | "hub";

export const LAYOUTS: { id: LayoutId; name: string; tag: string }[] = [
  { id: "enside", name: "Én side", tag: "Alt på én side, man ruller ned. Godt til deling på sociale medier" },
  { id: "anker", name: "Anker-profil", tag: "Portræt i en sidebjælke på alle sider, undersider i menuen" },
  { id: "mosaik", name: "Mærkesags-mosaik", tag: "Pointerne som fliser på forsiden, hver med link til sin mærkesag" },
  { id: "hub", name: "Spørgsmålshub", tag: "Pointerne stillet som spørgsmål med svaret lige under" },
];

export type Palette = {
  id: string;
  name: string;
  desc: string;
  bg: string;
  bgCss: string;
  text: string;
  accent: string;
  secondary: string;
};

export const PALETTES: Palette[] = [
  { id: "skovgroen", name: "Skov og ro", desc: "Dæmpet grøn på hvid", bg: "#FFFFFF", bgCss: "#FFFFFF", text: "#2B2B2B", accent: "#2F6B45", secondary: "#E8F2EC" },
  { id: "skarp", name: "Skarp og professionel", desc: "Klar blå", bg: "#EEF4FB", bgCss: "linear-gradient(160deg, #EAF2FC 0%, #D3E6F7 100%)", text: "#15283C", accent: "#1E63B8", secondary: "#CFE2F4" },
  { id: "morkdirekte", name: "Mørk og direkte", desc: "Tung og seriøs", bg: "#1A1D21", bgCss: "#1A1D21", text: "#EDEDED", accent: "#5B8CB8", secondary: "#2C2F33" },
  { id: "rolig", name: "Gylden og varm", desc: "Solid og imødekommende", bg: "#FFF9E8", bgCss: "#FFF9E8", text: "#3A2E14", accent: "#C68A2E", secondary: "#F2E4BE" },
  { id: "varm", name: "Varm og personlig", desc: "Jordfarve", bg: "#FCF6EF", bgCss: "#FCF6EF", text: "#3B2A22", accent: "#A84E36", secondary: "#EFDFC9" },
  { id: "jordnaer", name: "Jordnær og rolig", desc: "Sand og oliven", bg: "#F3EEE4", bgCss: "#F3EEE4", text: "#3A3626", accent: "#6B7A4A", secondary: "#E4DCC6" },
  { id: "lysleg", name: "Lys og legende", desc: "Varm og energisk", bg: "#FFF6F0", bgCss: "linear-gradient(160deg, #FFF8F2 0%, #FCDCC4 100%)", text: "#3A2A1C", accent: "#F2703C", secondary: "#FCE0CC" },
  { id: "frisk", name: "Frisk og nutidig", desc: "Klar og energisk", bg: "#FFFFFF", bgCss: "#FFFFFF", text: "#132B2B", accent: "#1E9E8C", secondary: "#DCF2EE" },
  { id: "dybelegant", name: "Dyb og lilla", desc: "Rig og eftertænksom", bg: "#F8F4F7", bgCss: "linear-gradient(160deg, #FBF7FA 0%, #EAD9E6 100%)", text: "#2B1F29", accent: "#6B3F63", secondary: "#E9DCE6" },
];

export const FONTS: { id: string; name: string; css: string; weight: number }[] = [
  { id: "classic", name: "Klassisk og rolig", css: "var(--font-fraunces), Georgia, serif", weight: 600 },
  { id: "warm", name: "Varm og rund", css: "var(--font-poppins), system-ui, sans-serif", weight: 600 },
  { id: "sharp", name: "Skarp og professionel", css: "var(--font-inter), system-ui, sans-serif", weight: 700 },
  { id: "handwritten", name: "Personlig håndskrift", css: "var(--font-caveat), cursive", weight: 700 },
];

export const paletteById = (id: string) => PALETTES.find((p) => p.id === id) ?? PALETTES[0];
export const fontById = (id: string) => FONTS.find((f) => f.id === id) ?? FONTS[0];
export const layoutById = (id: string) => LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
