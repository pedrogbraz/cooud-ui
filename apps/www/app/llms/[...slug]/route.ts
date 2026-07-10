import { markdownForPath, markdownStaticParams } from "../../../lib/llms";

/**
 * Markdown mirrors of the documentation, one URL per page:
 *
 *   /llms/components/button.md   /llms/blocks/waitlist.md   /llms/docs/theming.md
 *
 * Every known page is prerendered at build time; anything else resolves to
 * undefined and 404s without touching the filesystem.
 */
export const dynamic = "force-static";

export function generateStaticParams(): { slug: string[] }[] {
  return markdownStaticParams();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
): Promise<Response> {
  const { slug } = await params;
  const markdown = markdownForPath(slug);
  if (!markdown) return new Response("Not found", { status: 404 });
  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
