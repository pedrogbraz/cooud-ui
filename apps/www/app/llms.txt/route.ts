import { buildLlmsTxt } from "../../lib/llms";

// The whole document is derived from committed indices, so it is baked once
// at build time — no filesystem access ever happens on a live request.
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
