"use client";

import type { Example } from "../../lib/examples/types";
import { PreviewFrame } from "../showcase-ui";
import { CodeBlock } from "./code-block";

export function ExampleBlock({ example }: { example: Example }) {
  return (
    <section id={example.id} className="scroll-mt-24">
      <h2 className="font-display text-xl font-semibold tracking-tight text-fg">{example.title}</h2>
      {example.description && (
        <p className="mt-1.5 max-w-2xl text-sm text-fg-secondary">{example.description}</p>
      )}
      <div className="mt-4 flex flex-col gap-3">
        <PreviewFrame>{example.preview}</PreviewFrame>
        <CodeBlock code={example.code} expandable />
      </div>
    </section>
  );
}
