import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cooud/ui", "@cooud/theme", "@cooud/tokens"],
};

export default nextConfig;
