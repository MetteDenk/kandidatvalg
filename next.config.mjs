import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Scalingo kører "next start". Standalone-output bruges kun af Dockerfilen,
  // hvis appen en dag skal køre i en container (NEXT_STANDALONE=1).
  output: process.env.NEXT_STANDALONE ? "standalone" : undefined,
  outputFileTracingRoot: __dirname,
  experimental: { serverActions: { bodySizeLimit: "1mb" } },
};

export default nextConfig;
