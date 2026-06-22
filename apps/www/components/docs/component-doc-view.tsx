"use client";

import { getComponentDisplayName, getComponentMeta } from "../../lib/components-index";
import { EXAMPLES } from "../../lib/examples";
import { Eyebrow } from "../showcase-ui";
import { CodeBlock } from "./code-block";
import { ExampleBlock } from "./component-preview";
import { Toc } from "./toc";

export function ComponentDocView({ slug }: { slug: string }) {
  const meta = getComponentMeta(slug);
  const examples = EXAMPLES[slug] ?? [];

  if (!meta) {
    return <div className="py-20 text-fg-tertiary">Unknown component: {slug}</div>;
  }

  const displayName = getComponentDisplayName(meta.name);
  const toc = [
    { id: "import", title: "Import" },
    ...examples.map((example) => ({ id: example.id, title: example.title })),
  ];

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_13rem]">
      <article className="min-w-0 py-10">
        <Eyebrow>{meta.category}</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fg">
          {displayName}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-fg-secondary">{meta.description}</p>

        <section id="import" className="mt-10 scroll-mt-24">
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">Import</h2>
          <div className="mt-4 flex flex-col gap-3">
            <CodeBlock code={`import { ${meta.importName ?? meta.name} } from "@cooud/ui";`} />
            <CodeBlock code={`npx cooud-ui add ${slug}`} language="bash" />
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-12">
          {examples.map((example) => (
            <ExampleBlock key={example.id} example={example} />
          ))}
          {examples.length === 0 && (
            <p className="rounded-xl border border-dashed border-border bg-surface-inset/40 px-6 py-10 text-center text-sm text-fg-tertiary">
              Interactive examples for {displayName} are coming soon.
            </p>
          )}
        </div>
      </article>

      <Toc items={toc} />
    </div>
  );
}
