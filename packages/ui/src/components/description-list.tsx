import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn.js";

/* ------------------------------------------------------------------ *
 * DescriptionList (root)
 * ------------------------------------------------------------------ */

/**
 * Layout recipes for the `<dl>` root. Every layout styles either supported
 * composition from the parent: raw alternating `<dt>`/`<dd>` children, or
 * pairs grouped in a {@link DescriptionItem} (or any plain `<div>` — valid
 * inside a `<dl>` per the HTML spec). Use one composition per list — the spec
 * forbids mixing raw pairs with div-wrapped groups in the same `<dl>`.
 */
const descriptionListVariants = cva("w-full min-w-0", {
  variants: {
    layout: {
      // Terms sit above their details; groups separate vertically (spacing
      // lives in the size compounds below).
      stacked: "[&_dd]:mt-1",
      // Classic definition list: two aligned columns, one divider per row.
      // Raw dt/dd children flow straight into the grid tracks; row wrappers
      // become subgrid rows so their cells align to the same tracks.
      horizontal: cn(
        "grid grid-cols-[fit-content(50%)_minmax(0,1fr)]",
        "[&>div]:col-span-2 [&>div]:grid [&>div]:grid-cols-subgrid",
        "[&_dt]:col-start-1 [&_dd]:col-start-2",
        // divide-y equivalent that draws one continuous line per row in either
        // composition (whole wrappers, or a raw dt plus its adjacent dd).
        "[&>div:not(:first-child)]:border-t [&>div:not(:first-child)]:border-border",
        "[&>dt:not(:first-child)]:border-t [&>dt:not(:first-child)]:border-border",
        "[&>dt:not(:first-child)+dd]:border-t [&>dt:not(:first-child)+dd]:border-border",
      ),
      // Responsive card tiles — group each pair with `DescriptionItem` (or a
      // plain <div>) so every tile carries one term/details pair.
      grid: cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "[&>div]:rounded-lg [&>div]:border [&>div]:border-border [&>div]:bg-surface-raised",
        "[&_dd]:mt-1",
      ),
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
    striped: { true: "", false: "" },
    bordered: {
      true: "overflow-hidden rounded-lg border border-border",
      false: "",
    },
    detailsAlign: {
      start: "",
      end: "[&_dd]:text-end",
    },
  },
  compoundVariants: [
    // Vertical rhythm between stacked groups (row wrappers or raw pairs).
    {
      layout: "stacked",
      size: "md",
      class: "[&>div:not(:first-child)]:mt-4 [&>dt:not(:first-child)]:mt-4",
    },
    {
      layout: "stacked",
      size: "sm",
      class: "[&>div:not(:first-child)]:mt-3 [&>dt:not(:first-child)]:mt-3",
    },
    // Horizontal row padding. The term's `pe-*` doubles as the column gutter —
    // a real grid gap would slice the row dividers into two segments.
    { layout: "horizontal", size: "md", class: "[&_dt]:pe-6 [&_dt]:py-3 [&_dd]:py-3" },
    { layout: "horizontal", size: "sm", class: "[&_dt]:pe-4 [&_dt]:py-2 [&_dd]:py-2" },
    // Grid tile spacing.
    { layout: "grid", size: "md", class: "gap-4 [&>div]:p-4" },
    { layout: "grid", size: "sm", class: "gap-3 [&>div]:p-3" },
    // Zebra tint on alternate grouped rows, with an inset so the wash never
    // touches the text (logical padding keeps it RTL-safe). `nth-of-type`
    // counts only the <div> row wrappers, so raw dt/dd children can never
    // skew the row parity (they don't participate in the zebra at all).
    {
      layout: "stacked",
      striped: true,
      class: "[&>div]:rounded-md [&>div]:p-3 [&>div:nth-of-type(even)]:bg-surface-inset",
    },
    {
      layout: "horizontal",
      striped: true,
      class: "[&>div:nth-of-type(even)]:bg-surface-inset [&_dt]:ps-3 [&_dd]:pe-3",
    },
    { layout: "grid", striped: true, class: "[&>div:nth-of-type(even)]:bg-surface-inset" },
    // Inset the content away from the outer border.
    { layout: "stacked", bordered: true, class: "p-4" },
    { layout: "horizontal", bordered: true, class: "[&_dt]:ps-3 [&_dd]:pe-3" },
    { layout: "grid", bordered: true, class: "p-4" },
  ],
  defaultVariants: {
    layout: "stacked",
    size: "md",
    striped: false,
    bordered: false,
    detailsAlign: "start",
  },
});

export interface DescriptionListProps
  extends HTMLAttributes<HTMLDListElement>,
    VariantProps<typeof descriptionListVariants> {
  /**
   * How term/details pairs are arranged. `stacked` places each term above its
   * details; `horizontal` aligns them into classic two-column rows with a
   * divider between rows; `grid` spreads grouped pairs across a responsive
   * 1 → 2 → 3 column set of card tiles.
   * @default "stacked"
   */
  layout?: "stacked" | "horizontal" | "grid";
  /**
   * Density preset controlling the type scale and spacing.
   * @default "md"
   */
  size?: "sm" | "md";
  /**
   * Tints alternate rows for scannability. The zebra counts only div-wrapped
   * rows — wrap each pair in a {@link DescriptionItem} row (or a plain
   * `<div>`); raw `<dt>`/`<dd>` pairs are never counted or tinted.
   * @default false
   */
  striped?: boolean;
  /**
   * Wraps the list in a rounded outer border and insets the content.
   * @default false
   */
  bordered?: boolean;
  /**
   * Alignment of the details column. Logical (`text-start`/`text-end`), so
   * `end` stays correct in RTL.
   * @default "start"
   */
  detailsAlign?: "start" | "end";
}

/**
 * Semantic `<dl>` for label/value content — detail panes, order summaries and
 * settings review screens. Purely presentational and SSR-safe: all three
 * layouts are driven from this root, so the children stay simple primitives.
 * Compose raw pairs, or group each pair with {@link DescriptionItem} (required
 * for the `grid` layout and for `striped` rows). Use one composition per list —
 * the HTML spec forbids mixing raw `<dt>`/`<dd>` pairs with div-wrapped groups
 * in the same `<dl>`:
 *
 * ```tsx
 * <DescriptionList layout="horizontal">
 *   <DescriptionItem term="Order">#10245</DescriptionItem>
 *   <DescriptionItem term="Status">Paid</DescriptionItem>
 * </DescriptionList>
 * ```
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(
  ({ className, layout, size, striped, bordered, detailsAlign, ...props }, ref) => {
    return (
      <dl
        ref={ref}
        data-slot="description-list"
        className={cn(
          descriptionListVariants({ layout, size, striped, bordered, detailsAlign }),
          className,
        )}
        {...props}
      />
    );
  },
);
DescriptionList.displayName = "DescriptionList";

/* ------------------------------------------------------------------ *
 * DescriptionTerm / DescriptionDetails
 * ------------------------------------------------------------------ */

/** The label of a pair — a `<dt>` (exposed to assistive tech as a term). */
export const DescriptionTerm = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <dt
        ref={ref}
        data-slot="description-term"
        className={cn("font-medium text-fg-secondary", className)}
        {...props}
      />
    );
  },
);
DescriptionTerm.displayName = "DescriptionTerm";

/** The value of a pair — a `<dd>` (exposed to assistive tech as a definition). */
export const DescriptionDetails = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <dd
        ref={ref}
        data-slot="description-details"
        className={cn("min-w-0 break-words text-fg", className)}
        {...props}
      />
    );
  },
);
DescriptionDetails.displayName = "DescriptionDetails";

/* ------------------------------------------------------------------ *
 * DescriptionItem (convenience pair wrapper)
 * ------------------------------------------------------------------ */

export interface DescriptionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** The label rendered in the pair's {@link DescriptionTerm}. */
  term: ReactNode;
}

/**
 * Convenience wrapper that groups one term/details pair in a `<div>` (valid
 * `<dl>` structure per the HTML spec). The pair renders as
 * `<dt>{term}</dt><dd>{children}</dd>`; the parent {@link DescriptionList}
 * styles the wrapper per layout (a subgrid row in `horizontal`, a card tile in
 * `grid`, a zebra row when `striped`).
 */
export const DescriptionItem = forwardRef<HTMLDivElement, DescriptionItemProps>(
  ({ term, className, children, ...props }, ref) => {
    return (
      <div ref={ref} data-slot="description-item" className={cn("min-w-0", className)} {...props}>
        <DescriptionTerm>{term}</DescriptionTerm>
        <DescriptionDetails>{children}</DescriptionDetails>
      </div>
    );
  },
);
DescriptionItem.displayName = "DescriptionItem";

export { descriptionListVariants };
