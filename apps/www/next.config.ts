import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cooud-ui/ui", "@cooud-ui/theme", "@cooud-ui/tokens"],
};

export default nextConfig;
