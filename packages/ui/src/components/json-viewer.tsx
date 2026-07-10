"use client";

import { ChevronRight } from "lucide-react";
import { forwardRef, type HTMLAttributes, type ReactNode, useMemo, useState } from "react";
import { cn } from "../lib/cn.js";
import { CopyButton } from "./copy-button.js";

/* ------------------------------------------------------------------ *
 * Value helpers (pure + synchronous, so rendering is SSR-safe)
 * ------------------------------------------------------------------ */

/** A container value the tree can recurse into: a plain object or an array. */
type BranchValue = Record<string, unknown> | readonly unknown[];

function isBranchValue(value: unknown): value is BranchValue {
  return typeof value === "object" && value !== null;
}

/**
 * The visible entries of a branch: index/value pairs for arrays, own
 * enumerable string-keyed entries (insertion order) for objects.
 */
function branchEntries(value: BranchValue): Array<[string, unknown]> {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index), item]);
  }
  return Object.entries(value);
}

/**
 * Rebuild `value` as a plain JSON-serializable clone. Ancestors are tracked in
 * a `WeakSet` that is entered before and left after each object, so genuine
 * cycles become a `"[Circular]"` token while mere shared references (the same
 * object appearing under two siblings) serialize normally. Bigints keep an `n`
 * suffix instead of throwing.
 */
function toSerializable(value: unknown, ancestors: WeakSet<object>): unknown {
  if (typeof value === "bigint") return `${value}n`;
  if (!isBranchValue(value)) return value;
  if (ancestors.has(value)) return "[Circular]";
  ancestors.add(value);
  const clone = Array.isArray(value)
    ? value.map((item) => toSerializable(item, ancestors))
    : Object.fromEntries(
        Object.entries(value).map(([key, entry]) => [key, toSerializable(entry, ancestors)]),
      );
  ancestors.delete(value);
  return clone;
}

/**
 * Serialize any value for the copy button. Falls back to `String(value)` for
 * values `JSON.stringify` cannot represent at the top level (undefined,
 * functions, symbols).
 */
function stringifyValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (typeof value === "bigint") return `${value}n`;
  const json = JSON.stringify(toSerializable(value, new WeakSet()), null, 2);
  return json ?? String(value);
}

/** Map a primitive to its display text + semantic color token. */
function formatPrimitive(value: unknown): { text: string; className: string } {
  if (value === null) return { text: "null", className: "text-fg-muted" };
  if (value === undefined) return { text: "undefined", className: "text-fg-muted" };
  switch (typeof value) {
    case "string":
      // JSON.stringify supplies the quotes and escapes embedded ones.
      return { text: JSON.stringify(value), className: "text-success" };
    case "number":
      return { text: String(value), className: "text-info tabular-nums" };
    case "bigint":
      return { text: `${value}n`, className: "text-info tabular-nums" };
    case "boolean":
      return { text: String(value), className: "text-warning" };
    default:
      // Functions and symbols are not JSON; render a compact muted token.
      return {
        text: typeof value === "function" ? "ƒ ()" : String(value),
        className: "text-fg-muted italic",
      };
  }
}

function copyLabelFor(name: string | undefined): string {
  return name === undefined ? "Copy value" : `Copy value of ${name}`;
}

/* ------------------------------------------------------------------ *
 * Row building blocks
 * ------------------------------------------------------------------ */

/** Punctuation ({}, [], commas, colons) in the tertiary foreground token. */
function Punct({ children }: { children: ReactNode }) {
  return <span className="text-fg-tertiary">{children}</span>;
}

/** Chevron-width placeholder that keeps leaf rows aligned with branch rows. */
function ControlSpacer() {
  return <span aria-hidden="true" className="size-5 shrink-0" />;
}

/** Property key (quoted for objects, bare index for arrays) plus its colon. */
function KeyLabel({ name, quoted }: { name: string; quoted: boolean }) {
  return (
    <>
      <span data-slot="json-viewer-key" className="text-fg-secondary">
        {quoted ? JSON.stringify(name) : name}
      </span>
      <Punct>{": "}</Punct>
    </>
  );
}

interface JsonRowProps {
  /** The leading control: a chevron button for branches, a spacer for leaves. */
  control: ReactNode;
  /** Text written to the clipboard by the row's copy button. */
  copyText: string;
  /** Stable accessible name for the row's copy button. */
  copyLabel: string;
  children: ReactNode;
}

/**
 * One visual line of the tree. The copy button is always rendered (so it is
 * keyboard-reachable and the layout never shifts) but kept at `opacity-0`
 * until the row is hovered or anything inside the row holds focus.
 */
function JsonRow({ control, copyText, copyLabel, children }: JsonRowProps) {
  return (
    <div data-slot="json-viewer-row" className="group/row flex items-start gap-1">
      {control}
      <span className="min-w-0 flex-1 break-words">{children}</span>
      <CopyButton
        value={copyText}
        copyLabel={copyLabel}
        variant="ghost"
        size="icon-sm"
        className="mt-0.5 size-5 shrink-0 rounded-md opacity-0 transition-opacity duration-150 focus-visible:opacity-100 group-focus-within/row:opacity-100 group-hover/row:opacity-100 motion-reduce:transition-none [&_svg]:size-3"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Recursive nodes
 * ------------------------------------------------------------------ */

interface JsonNodeProps {
  /** Property key (objects) or index (arrays); undefined for the root value. */
  name?: string;
  /** Whether the key renders quoted (object keys) or bare (array indices). */
  quotedName: boolean;
  value: unknown;
  /** 0-based depth of this node; the root value is depth 0. */
  depth: number;
  defaultExpandedDepth: number;
  /** Object ancestry of this node, used to break rendering on cycles. */
  ancestors: readonly object[];
  /** Last sibling — suppresses the trailing comma. */
  isLast: boolean;
}

function JsonNode(props: JsonNodeProps) {
  const { value, ancestors } = props;
  if (isBranchValue(value)) {
    if (ancestors.includes(value)) {
      return <JsonCircularLeaf {...props} />;
    }
    return <JsonBranch {...props} value={value} />;
  }
  return <JsonLeaf {...props} />;
}

/** A value that references one of its own ancestors — never recurse into it. */
function JsonCircularLeaf({ name, quotedName, isLast }: JsonNodeProps) {
  return (
    <JsonRow control={<ControlSpacer />} copyText="[Circular]" copyLabel={copyLabelFor(name)}>
      {name !== undefined && <KeyLabel name={name} quoted={quotedName} />}
      <span data-slot="json-viewer-value" className="text-fg-muted italic">
        {"[Circular]"}
      </span>
      {!isLast && <Punct>,</Punct>}
    </JsonRow>
  );
}

function JsonLeaf({ name, quotedName, value, isLast }: JsonNodeProps) {
  const { text, className } = formatPrimitive(value);
  // Strings copy their raw contents (most useful); everything else copies its
  // JSON representation.
  const copyText = typeof value === "string" ? value : stringifyValue(value);
  return (
    <JsonRow control={<ControlSpacer />} copyText={copyText} copyLabel={copyLabelFor(name)}>
      {name !== undefined && <KeyLabel name={name} quoted={quotedName} />}
      <span data-slot="json-viewer-value" className={cn("break-all", className)}>
        {text}
      </span>
      {!isLast && <Punct>,</Punct>}
    </JsonRow>
  );
}

interface JsonBranchProps extends JsonNodeProps {
  value: BranchValue;
}

function JsonBranch({
  name,
  quotedName,
  value,
  depth,
  defaultExpandedDepth,
  ancestors,
  isLast,
}: JsonBranchProps) {
  // Expansion is per branch and uncontrolled, seeded from the depth budget, so
  // toggling one node re-renders only its own subtree.
  const [expanded, setExpanded] = useState(depth < defaultExpandedDepth);
  const entries = useMemo(() => branchEntries(value), [value]);
  const copyText = useMemo(() => stringifyValue(value), [value]);
  const childAncestors = useMemo(() => [...ancestors, value], [ancestors, value]);

  const isArray = Array.isArray(value);
  const [openToken, closeToken] = isArray ? ["[", "]"] : ["{", "}"];
  const count = entries.length;
  const noun = isArray ? (count === 1 ? "item" : "items") : count === 1 ? "key" : "keys";

  // Empty containers have nothing to expand — render them as a single leaf row.
  if (count === 0) {
    return (
      <JsonRow control={<ControlSpacer />} copyText={copyText} copyLabel={copyLabelFor(name)}>
        {name !== undefined && <KeyLabel name={name} quoted={quotedName} />}
        <Punct>
          {openToken}
          {closeToken}
        </Punct>
        {!isLast && <Punct>,</Punct>}
      </JsonRow>
    );
  }

  return (
    <div data-slot="json-viewer-branch">
      <JsonRow
        control={
          <button
            type="button"
            data-slot="json-viewer-toggle"
            data-state={expanded ? "open" : "closed"}
            aria-expanded={expanded}
            // Stable accessible name; the open/closed state is conveyed by
            // `aria-expanded`, not by mutating the label.
            aria-label={`Toggle ${name ?? "root"}`}
            onClick={() => setExpanded((previous) => !previous)}
            className={cn(
              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md text-fg-tertiary outline-none",
              "transition-[background,color] duration-150 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
              "hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <ChevronRight
              aria-hidden="true"
              className={cn(
                "size-3.5 transition-transform duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
                expanded && "rotate-90",
              )}
            />
          </button>
        }
        copyText={copyText}
        copyLabel={copyLabelFor(name)}
      >
        {name !== undefined && <KeyLabel name={name} quoted={quotedName} />}
        <Punct>{openToken}</Punct>
        {!expanded && (
          <>
            <span
              data-slot="json-viewer-summary"
              className="text-fg-muted tabular-nums"
            >{` … ${count} ${noun} `}</span>
            <Punct>{closeToken}</Punct>
            {!isLast && <Punct>,</Punct>}
          </>
        )}
      </JsonRow>

      {expanded && (
        <>
          {/* Indent guide: the left border sits under the chevron's center. */}
          <div data-slot="json-viewer-children" className="ml-2.5 border-border border-l pl-3.5">
            {entries.map(([childName, childValue], index) => (
              <JsonNode
                key={childName}
                name={childName}
                quotedName={!isArray}
                value={childValue}
                depth={depth + 1}
                defaultExpandedDepth={defaultExpandedDepth}
                ancestors={childAncestors}
                isLast={index === count - 1}
              />
            ))}
          </div>
          <div data-slot="json-viewer-closer" className="flex items-start gap-1">
            <ControlSpacer />
            <span className="min-w-0 flex-1">
              <Punct>{closeToken}</Punct>
              {!isLast && <Punct>,</Punct>}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Root
 * ------------------------------------------------------------------ */

export interface JsonViewerProps extends HTMLAttributes<HTMLDivElement> {
  /** The value to render. Objects and arrays become collapsible branches. */
  data: unknown;
  /**
   * How many levels start expanded. The root value is depth 0, so the default
   * of 1 shows the root's entries with every nested branch collapsed. Pass
   * `Number.POSITIVE_INFINITY` to expand everything.
   */
  defaultExpandedDepth?: number;
}

/**
 * A collapsible JSON tree viewer. Any `unknown` value renders as a recursive,
 * monospaced tree: objects and arrays become branches with a real chevron
 * `<button>` (`aria-expanded`, focus ring) and a muted child-count summary
 * while collapsed; primitives are colored purely by semantic tokens (strings
 * `text-success`, numbers `text-info` + `tabular-nums`, booleans
 * `text-warning`, null/undefined `text-fg-muted`), keys use
 * `text-fg-secondary` and punctuation `text-fg-tertiary`, with `border-border`
 * indent guides.
 *
 * Expansion state lives per branch (seeded from `defaultExpandedDepth`), so
 * toggling a node only re-renders its own subtree, and collapsed subtrees are
 * not mounted at all. Every row reveals a clipboard button on hover or focus
 * — string leaves copy their raw contents, everything else copies
 * pretty-printed JSON. Both rendering and serialization are cycle-safe:
 * values that reference their own ancestors render/serialize as a
 * `"[Circular]"` token instead of recursing forever. Fully keyboard operable
 * (chevrons and copy buttons are native buttons), reduced-motion safe, and
 * SSR-safe (no DOM reads, no time- or random-dependent output).
 */
export const JsonViewer = forwardRef<HTMLDivElement, JsonViewerProps>(
  ({ data, defaultExpandedDepth = 1, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="json-viewer"
      className={cn(
        "overflow-x-auto rounded-xl border border-border bg-surface-inset p-4 font-mono text-fg text-sm leading-6",
        className,
      )}
      {...props}
    >
      <JsonNode
        value={data}
        quotedName={false}
        depth={0}
        defaultExpandedDepth={defaultExpandedDepth}
        ancestors={[]}
        isLast
      />
    </div>
  ),
);
JsonViewer.displayName = "JsonViewer";
