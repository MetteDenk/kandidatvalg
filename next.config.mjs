import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Selvhostet på Coolify/Hetzner. Standalone output giver en lille serverbundle til Docker.
  output: "standalone",
  outputFileTracingRoot: __dirname,
  experimental: { serverActions: { bodySizeLimit: "1mb" } },
};

export default nextConfig;
