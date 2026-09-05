import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces .next/standalone + .next/static for minimal Docker deployment
  output: "standalone",
};

export default nextConfig;
