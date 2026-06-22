import { getComponentDisplayName, getComponentMeta } from "../../lib/components-index";
import { getExampleSections } from "../../lib/examples/sections";
import { Eyebrow } from "../showcase-ui";
import { CodeBlock } from "./code-block";
import { ComponentExamples } from "./component-examples";
import { Toc } from "./toc";

export function ComponentDocView({ slug }: { slug: string }) {
  const meta = getComponentMeta(slug);

  if (!meta) {
    return <div className="py-20 text-fg-tertiary">Unknown component: {slug}</div>;
  }

  // TOC + section anchors come from lightweight metadata (no preview modules),
  // so the eager example *families* (recharts, forms, overlays…) are never
  // pulled into this route — only the one family chunk loads, lazily, below.
  const sections = getExampleSections(slug);
  const displayName = getComponentDisplayName(meta.name);
  const toc = [{ id: "import", title: "Import" }, ...sections];

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
          <ComponentExamples slug={slug} displayName={displayName} />
        </div>
      </article>

      <Toc items={toc} />
    </div>
  );
}
