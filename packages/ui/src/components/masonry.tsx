import { type CSSProperties, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6;

export interface MasonryColumns {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface MasonryProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns, either a fixed count or a responsive map keyed by breakpoint. */
  columns?: number | MasonryColumns;
  /** CSS length used for both the column gap and the vertical gap between items. */
  gap?: string;
}

const BASE_COLUMNS: Record<ColumnCount, string> = {
  1: "columns-1",
  2: "columns-2",
  3: "columns-3",
  4: "columns-4",
  5: "columns-5",
  6: "columns-6",
};

const SM_COLUMNS: Record<ColumnCount, string> = {
  1: "sm:columns-1",
  2: "sm:columns-2",
  3: "sm:columns-3",
  4: "sm:columns-4",
  5: "sm:columns-5",
  6: "sm:columns-6",
};

const MD_COLUMNS: Record<ColumnCount, string> = {
  1: "md:columns-1",
  2: "md:columns-2",
  3: "md:columns-3",
  4: "md:columns-4",
  5: "md:columns-5",
  6: "md:columns-6",
};

const LG_COLUMNS: Record<ColumnCount, string> = {
  1: "lg:columns-1",
  2: "lg:columns-2",
  3: "lg:columns-3",
  4: "lg:columns-4",
  5: "lg:columns-5",
  6: "lg:columns-6",
};

const XL_COLUMNS: Record<ColumnCount, string> = {
  1: "xl:columns-1",
  2: "xl:columns-2",
  3: "xl:columns-3",
  4: "xl:columns-4",
  5: "xl:columns-5",
  6: "xl:columns-6",
};

function clampCount(value: number | undefined): ColumnCount | undefined {
  if (value === undefined) return undefined;
  const rounded = Math.round(value);
  if (rounded < 1) return 1;
  if (rounded > 6) return 6;
  return rounded as ColumnCount;
}

const DEFAULT_COLUMNS: MasonryColumns = { base: 1, sm: 2, lg: 3 };

function resolveColumnClasses(columns: number | MasonryColumns): string[] {
  const config: MasonryColumns = typeof columns === "number" ? { base: columns } : columns;
  const classes: string[] = [];

  const base = clampCount(config.base);
  if (base) classes.push(BASE_COLUMNS[base]);

  const sm = clampCount(config.sm);
  if (sm) classes.push(SM_COLUMNS[sm]);

  const md = clampCount(config.md);
  if (md) classes.push(MD_COLUMNS[md]);

  const lg = clampCount(config.lg);
  if (lg) classes.push(LG_COLUMNS[lg]);

  const xl = clampCount(config.xl);
  if (xl) classes.push(XL_COLUMNS[xl]);

  return classes;
}

export const Masonry = forwardRef<HTMLDivElement, MasonryProps>(
  ({ className, columns = DEFAULT_COLUMNS, gap = "1rem", style, ...props }, ref) => {
    const columnClasses = resolveColumnClasses(columns);

    return (
      <div
        ref={ref}
        data-slot="masonry"
        className={cn(
          ...columnClasses,
          "[&>*]:mb-[var(--masonry-gap)] [&>*]:break-inside-avoid",
          className,
        )}
        style={
          {
            columnGap: gap,
            "--masonry-gap": gap,
            ...style,
          } as CSSProperties
        }
        {...props}
      />
    );
  },
);
Masonry.displayName = "Masonry";
