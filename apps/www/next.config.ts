import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cooud-ui/ui", "@cooud-ui/theme", "@cooud-ui/tokens", "@cooud-ui/stack"],
};

export default nextConfig;
