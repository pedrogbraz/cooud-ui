"use client";

import { Check, ChevronRight, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BLOCKS } from "../../lib/blocks";
import { getBlockMeta } from "../../lib/blocks-index";
import { CodeBlock } from "../docs/code-block";
import { Eyebrow } from "../showcase-ui";
import { BlockPreview } from "./block-preview";
import { InstallTabs } from "./install-tabs";

export function BlockView({ slug }: { slug: string }) {
  const meta = getBlockMeta(slug);
  const block = BLOCKS[slug];

  if (!meta || !block) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }

  const markdown = `# ${meta.name}\n\n${meta.description}\n\n## Usage\n\n\`\`\`tsx\n${block.code}\n\`\`\`\n`;

  return (
    <div className="lg:grid lg:grid-cols-2">
      {/* Left — scrollable docs */}
      <div className="px-6 py-10 sm:px-10 lg:py-16">
        <div className="mx-auto max-w-xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-fg-tertiary"
          >
            <Link
              href="/blocks"
              className="rounded outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              Blocks
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-fg-secondary">{meta.name}</span>
          </nav>

          <Eyebrow className="mt-8">{meta.category}</Eyebrow>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-fg">
            {meta.name}
          </h1>
          <p className="mt-4 text-lg text-fg-secondary">{meta.description}</p>

          <div className="mt-6">
            <CopyMarkdownButton markdown={markdown} />
          </div>

          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
              Installation
            </h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Install the Cooud UI packages, then paste the block below.
            </p>
            <div className="mt-4">
              <InstallTabs packages="@cooud/ui @cooud/tokens @cooud/theme" />
            </div>
          </section>

          <section className="mt-12 pb-8">
            <h2 className="font-display text-xl font-semibold tracking-tight text-fg">Usage</h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Copy the source — every class is a semantic token, so it re-themes with your app.
            </p>
            <div className="mt-4">
              <CodeBlock code={block.code} expandable />
            </div>
          </section>
        </div>
      </div>

      {/* Right — sticky live preview */}
      <div className="border-border/60 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-l">
        <div className="h-[70vh] lg:h-full">
          <BlockPreview>{block.preview}</BlockPreview>
        </div>
      </div>
    </div>
  );
}

function CopyMarkdownButton({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3.5 py-2 text-sm text-fg-secondary outline-none transition-colors hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
    >
      {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      {copied ? "Copied" : "Copy as Markdown"}
    </button>
  );
}
