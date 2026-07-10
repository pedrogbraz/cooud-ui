/**
 * Canonical public origin of the showcase, used by the SEO surface
 * (sitemap, robots, Open Graph). Override with `NEXT_PUBLIC_SITE_URL`.
 */
const FALLBACK_SITE_URL = "https://ui.testcooud.cloud";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/+$/, "");

/** Absolute URL for a site path: `absoluteUrl("/components/button")`. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
