import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone-output bruges af Dockerfilen (NEXT_STANDALONE=1).
  output: process.env.NEXT_STANDALONE ? "standalone" : undefined,
  outputFileTracingRoot: __dirname,
  experimental: { serverActions: { bodySizeLimit: "1mb" } },
  // Beder søgemaskiner og AI-robotter om at holde sig fra alle sider.
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] }];
  },
};

export default nextConfig;
