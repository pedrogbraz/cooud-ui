import type { ReactNode } from "react";

/** A block's live preview plus the exact source that renders it. */
export interface BlockContent {
  /** The rendered block (composed from @cooud/ui). */
  preview: ReactNode;
  /** The full source shown in the Usage code block (should match `preview`). */
  code: string;
}

/** slug → block content. */
export type BlockContentMap = Record<string, BlockContent>;
