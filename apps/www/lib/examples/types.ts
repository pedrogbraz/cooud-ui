import type { ReactNode } from "react";

/** One documented example: a live preview plus the exact source that renders it. */
export interface Example {
  /** Anchor id used by the on-this-page TOC, e.g. "variants". */
  id: string;
  /** Section heading, e.g. "Variants". */
  title: string;
  description?: string;
  /** The JSX snippet shown in the code block (should match `preview`). */
  code: string;
  /** The rendered example. */
  preview: ReactNode;
}

/** slug → ordered examples. */
export type ExampleMap = Record<string, Example[]>;
