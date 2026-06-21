import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cooud/ui", "@cooud/theme", "@cooud/tokens"],
  // Radix Select 2.3.1 trips React 19.2's StrictMode double-invoke into a dev-only
  // update loop (production is unaffected). Disable StrictMode for the showcase dev
  // server so the preview is usable; the library itself is verified clean in prod.
  reactStrictMode: false,
};

export default nextConfig;
