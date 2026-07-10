import { buildShadcnRegistry } from "../../../lib/shadcn-registry";

// The registry is committed JSON, so the document is baked once at build
// time — no filesystem access ever happens on a live request.
export const dynamic = "force-static";

export function GET(): Response {
  return Response.json(buildShadcnRegistry());
}
