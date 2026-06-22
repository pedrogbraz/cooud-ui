"use client";

import type { Example } from "../../lib/examples/types";
import { ExampleBlock } from "./component-preview";

/**
 * Renders an ordered list of live examples for one component. Lives in its own
 * module so the lazily-loaded family views (`lib/examples/<family>.tsx`) can
 * share a single renderer without re-importing the catalog.
 */
export function ExampleList({ examples }: { examples: Example[] }) {
  return (
    <>
      {examples.map((example) => (
        <ExampleBlock key={example.id} example={example} />
      ))}
    </>
  );
}
