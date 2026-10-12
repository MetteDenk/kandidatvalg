import type { MetadataRoute } from "next";

// Siden er indtil videre lukket for søgemaskiner og AI-robotter. Alt afvises.
// Når siden skal åbnes, lempes reglerne her (fx kun kandidaternes egne sider).
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
