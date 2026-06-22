"use client";

import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Columns3,
  Download,
  PlusCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { type ComponentType, type ReactNode, useId, useMemo, useState } from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Checkbox } from "./checkbox.js";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";
import { Input } from "./input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";
import { Skeleton } from "./skeleton.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table.js";

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

/** Cell padding density. `comfortable` matches the historical Table look. */
export type DataTableDensity = "comfortable" | "compact";

/** Option used to build a faceted (multi-select) column filter. */
export interface DataTableFacetOption {
  label: string;
  value: string;
  /** Optional leading icon rendered before the label. */
  icon?: ComponentType<{ className?: string }>;
}

/** Configuration for a single faceted column filter rendered in the toolbar. */
export interface DataTableFacetedFilter {
  /** `id` of the column the filter targets. */
  columnId: string;
  /** Visible button label. */
  title: string;
  options: DataTableFacetOption[];
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  /* ---- Toolbar / global filter (opt-in) ---- */
  /** Show the toolbar with a global search field. */
  searchable?: boolean;
  /** Placeholder for the global search field. Defaults to "Search…". */
  searchPlaceholder?: string;
  /** Controlled global filter value. Implies a controlled toolbar search. */
  globalFilter?: string;
  /** Called when the global filter changes (controlled or uncontrolled). */
  onGlobalFilterChange?: OnChangeFn<string>;
  /** Faceted (multi-select) column filters rendered in the toolbar. */
  facetedFilters?: DataTableFacetedFilter[];
  /** Extra nodes rendered on the left side of the toolbar. */
  toolbarStart?: ReactNode;
  /** Extra nodes rendered on the right side of the toolbar (before the View menu). */
  toolbarEnd?: ReactNode;

  /* ---- Column visibility (opt-in) ---- */
  /** Show the "View" menu that toggles column visibility. */
  enableColumnVisibility?: boolean;
  /** Controlled column visibility state. */
  columnVisibility?: VisibilityState;
  /** Called when column visibility changes. */
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

  /* ---- Sorting ---- */
  /** Controlled sorting state. */
  sorting?: SortingState;
  /** Called when sorting changes. */
  onSortingChange?: OnChangeFn<SortingState>;
  /** Server-side sorting: skip the client sort model. */
  manualSorting?: boolean;

  /* ---- Column filtering ---- */
  /** Controlled column filters state. */
  columnFilters?: ColumnFiltersState;
  /** Called when column filters change. */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  /** Server-side filtering: skip the client filter model. */
  manualFiltering?: boolean;

  /* ---- Pagination (opt-in) ---- */
  /** Show the pagination footer. */
  pagination?: boolean;
  /** Controlled pagination state. */
  paginationState?: PaginationState;
  /** Called when pagination changes (controlled). */
  onPaginationChange?: OnChangeFn<PaginationState>;
  /** Server-side pagination: provide `pageCount` or `rowCount`. */
  manualPagination?: boolean;
  /** Total page count for server-side pagination. */
  pageCount?: number;
  /** Total row count for server-side pagination (used to derive `pageCount`). */
  rowCount?: number;
  /** Initial page size when uncontrolled. Defaults to 10. */
  initialPageSize?: number;
  /** Page-size options offered in the footer select. Defaults to [10, 20, 30, 50]. */
  pageSizeOptions?: number[];

  /* ---- Row selection (opt-in) ---- */
  /** Render a leading checkbox column with header select-all. */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  /** Controlled row-selection state. */
  rowSelection?: RowSelectionState;
  /** Called when row selection changes. */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /**
   * Render slot for bulk actions. Receives the currently selected rows; shown
   * in a bar above the table only while at least one row is selected.
   */
  bulkActions?: (rows: Row<TData>[]) => ReactNode;

  /* ---- Density (opt-in) ---- */
  /** Cell padding density. Defaults to "comfortable" (historical look). */
  density?: DataTableDensity;
  /** Show a comfortable/compact density toggle in the toolbar. */
  enableDensityToggle?: boolean;

  /* ---- CSV export (opt-in) ---- */
  /** Show a CSV export button in the toolbar. */
  enableCsvExport?: boolean;
  /** Download file name (without extension). Defaults to "export". */
  csvFileName?: string;

  /* ---- Async states ---- */
  /** Render skeleton rows instead of data. */
  loading?: boolean;
  /** Number of skeleton rows while `loading`. Defaults to the page size or 5. */
  loadingRowCount?: number;
  /** Render an error state with an optional retry button. */
  error?: ReactNode;
  /** Called when the error-state retry button is pressed. */
  onRetry?: () => void;
  /** Custom empty-state content. Defaults to "No results.". */
  emptyState?: ReactNode;

  /** Class applied to the outer wrapper. */
  className?: string;
  /** Accessible label for the toolbar region. Defaults to "Table controls". */
  toolbarLabel?: string;
}

/* -------------------------------------------------------------------------------------------------
 * Constants & helpers
 * -----------------------------------------------------------------------------------------------*/

const DENSITY_CELL: Record<DataTableDensity, string> = {
  comfortable: "",
  compact: "py-1.5",
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

/** Reserved column id for the built-in selection checkbox column. */
export const SELECTION_COLUMN_ID = "__select__";

/**
 * Case-insensitive "includes" global filter used by the toolbar search. It is
 * exported so server-side callers can reuse the same matching semantics.
 */
export const fuzzyTextFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (value == null) return false;
  return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
};

const arrIncludesSomeFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const selected = filterValue as string[];
  if (!selected?.length) return true;
  return selected.includes(String(row.getValue(columnId)));
};

/**
 * Build the leading checkbox selection column. Exposed so callers who supply
 * their own `columns` can prepend an identical, accessible selection column
 * instead of relying on `enableRowSelection` injection.
 */
export function createSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: SELECTION_COLUMN_ID,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => {
      const all = table.getIsAllPageRowsSelected();
      const some = table.getIsSomePageRowsSelected();
      return (
        <Checkbox
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
          aria-label="Select all rows on this page"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        aria-label="Select row"
      />
    ),
  };
}

/** Convert the visible (filtered/sorted) rows of a table to a CSV string. */
export function tableRowsToCsv<TData>(table: TanstackTable<TData>): string {
  const visibleLeafColumns = table
    .getVisibleLeafColumns()
    .filter((c) => c.id !== SELECTION_COLUMN_ID);

  const escapeCell = (value: unknown): string => {
    const str = value == null ? "" : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const header = visibleLeafColumns
    .map((c) => {
      const raw = c.columnDef.header;
      return escapeCell(typeof raw === "string" ? raw : c.id);
    })
    .join(",");

  const selected = table.getFilteredSelectedRowModel().rows;
  const source = selected.length ? selected : table.getFilteredRowModel().rows;

  const body = source
    .map((row) => visibleLeafColumns.map((c) => escapeCell(row.getValue(c.id))).join(","))
    .join("\n");

  return `${header}\n${body}`;
}

function downloadCsv(csv: string, fileName: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------------------------------------------
 * DataTableColumnHeader — sortable header with affordance icon
 * -----------------------------------------------------------------------------------------------*/

export interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

/**
 * Sortable header cell with a sort-state icon. Falls back to plain text when
 * the column cannot sort, so it is safe to use everywhere.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={cn("font-medium text-fg-secondary", className)}>{title}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(sorted === "asc")}
      aria-label={
        sorted === "asc"
          ? `Sorted by ${title} ascending. Activate to sort descending.`
          : sorted === "desc"
            ? `Sorted by ${title} descending. Activate to clear sorting.`
            : `Sort by ${title}.`
      }
      className="-ml-3 h-8 text-fg-secondary data-[state=open]:bg-surface-overlay"
    >
      <span>{title}</span>
      {sorted === "asc" ? (
        <ArrowUp aria-hidden />
      ) : sorted === "desc" ? (
        <ArrowDown aria-hidden />
      ) : (
        <ChevronsUpDown aria-hidden className="opacity-60" />
      )}
    </Button>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Faceted filter (opt-in)
 * -----------------------------------------------------------------------------------------------*/

function DataTableFacetedFilterControl<TData>({
  column,
  title,
  options,
}: {
  column: Column<TData, unknown> | undefined;
  title: string;
  options: DataTableFacetOption[];
}) {
  const facets = column?.getFacetedUniqueValues();
  const selected = new Set((column?.getFilterValue() as string[] | undefined) ?? []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          <PlusCircle aria-hidden />
          {title}
          {selected.size > 0 ? (
            <>
              <span className="mx-1 h-4 w-px bg-border" aria-hidden />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {selected.size}
              </Badge>
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => {
          const isSelected = selected.has(option.value);
          const Icon = option.icon;
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={() => {
                const next = new Set(selected);
                if (isSelected) next.delete(option.value);
                else next.add(option.value);
                const values = Array.from(next);
                column?.setFilterValue(values.length ? values : undefined);
              }}
            >
              {Icon ? <Icon className="size-4 text-fg-tertiary" /> : null}
              <span>{option.label}</span>
              {facets?.get(option.value) ? (
                <span className="ml-auto text-xs text-fg-tertiary">{facets.get(option.value)}</span>
              ) : null}
            </DropdownMenuCheckboxItem>
          );
        })}
        {selected.size > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => column?.setFilterValue(undefined)}
              className="justify-center"
            >
              Clear filter
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Toolbar (opt-in)
 * -----------------------------------------------------------------------------------------------*/

interface DataTableToolbarProps<TData> {
  table: TanstackTable<TData>;
  label: string;
  searchable: boolean;
  searchPlaceholder: string;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  facetedFilters?: DataTableFacetedFilter[];
  enableColumnVisibility: boolean;
  density: DataTableDensity;
  enableDensityToggle: boolean;
  onDensityChange: (density: DataTableDensity) => void;
  enableCsvExport: boolean;
  onExportCsv: () => void;
  toolbarStart?: ReactNode;
  toolbarEnd?: ReactNode;
}

function DataTableToolbar<TData>({
  table,
  label,
  searchable,
  searchPlaceholder,
  globalFilter,
  onGlobalFilterChange,
  facetedFilters,
  enableColumnVisibility,
  density,
  enableDensityToggle,
  onDensityChange,
  enableCsvExport,
  onExportCsv,
  toolbarStart,
  toolbarEnd,
}: DataTableToolbarProps<TData>) {
  const searchId = useId();
  const isFiltered = table.getState().columnFilters.length > 0 || globalFilter.length > 0;

  return (
    <div
      role="toolbar"
      aria-label={label}
      aria-orientation="horizontal"
      className="flex flex-wrap items-center gap-2"
    >
      {toolbarStart}

      {searchable ? (
        <div className="relative w-full max-w-[16rem]">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
          />
          <label htmlFor={searchId} className="sr-only">
            {searchPlaceholder}
          </label>
          <Input
            id={searchId}
            type="search"
            value={globalFilter}
            onChange={(event) => onGlobalFilterChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 pl-9"
          />
        </div>
      ) : null}

      {facetedFilters?.map((filter) => (
        <DataTableFacetedFilterControl
          key={filter.columnId}
          column={table.getColumn(filter.columnId)}
          title={filter.title}
          options={filter.options}
        />
      ))}

      {isFiltered ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            table.resetColumnFilters();
            onGlobalFilterChange("");
          }}
        >
          Reset
          <X aria-hidden />
        </Button>
      ) : null}

      <div className="ml-auto flex items-center gap-2">
        {toolbarEnd}

        {enableDensityToggle ? (
          <Button
            variant="outline"
            size="sm"
            aria-pressed={density === "compact"}
            onClick={() => onDensityChange(density === "compact" ? "comfortable" : "compact")}
          >
            <SlidersHorizontal aria-hidden />
            {density === "compact" ? "Comfortable" : "Compact"}
          </Button>
        ) : null}

        {enableCsvExport ? (
          <Button variant="outline" size="sm" onClick={onExportCsv}>
            <Download aria-hidden />
            Export
          </Button>
        ) : null}

        {enableColumnVisibility ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 aria-hidden />
                View
                <ChevronDown aria-hidden className="opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={(value) => column.toggleVisibility(value === true)}
                    className="capitalize"
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Pagination footer (opt-in)
 * -----------------------------------------------------------------------------------------------*/

function DataTablePagination<TData>({
  table,
  pageSizeOptions,
}: {
  table: TanstackTable<TData>;
  pageSizeOptions: number[];
}) {
  const pageSizeId = useId();
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getRowCount();
  const pageCount = table.getPageCount();

  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-1 py-2">
      <p className="text-sm text-fg-tertiary" aria-live="polite">
        {firstRow}&ndash;{lastRow} of {totalRows}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor={pageSizeId} className="text-sm text-fg-secondary">
            Rows per page
          </label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id={pageSizeId} className="h-8 w-[4.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-fg-secondary">
          Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
        </p>

        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <ChevronsLeft aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeft aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <ChevronRight aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <ChevronsRight aria-hidden />
          </Button>
        </nav>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DataTable
 * -----------------------------------------------------------------------------------------------*/

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    columns,
    data,
    searchable = false,
    searchPlaceholder = "Search…",
    globalFilter: globalFilterProp,
    onGlobalFilterChange,
    facetedFilters,
    toolbarStart,
    toolbarEnd,
    enableColumnVisibility = false,
    columnVisibility: columnVisibilityProp,
    onColumnVisibilityChange,
    sorting: sortingProp,
    onSortingChange,
    manualSorting,
    columnFilters: columnFiltersProp,
    onColumnFiltersChange,
    manualFiltering,
    pagination = false,
    paginationState: paginationProp,
    onPaginationChange,
    manualPagination,
    pageCount,
    rowCount,
    initialPageSize = 10,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    enableRowSelection,
    rowSelection: rowSelectionProp,
    onRowSelectionChange,
    bulkActions,
    density: densityProp,
    enableDensityToggle = false,
    enableCsvExport = false,
    csvFileName = "export",
    loading = false,
    loadingRowCount,
    error,
    onRetry,
    emptyState,
    className,
    toolbarLabel = "Table controls",
  } = props;

  /* ---- Uncontrolled fallbacks (only used when the matching prop is absent) ---- */
  const [sortingState, setSortingState] = useState<SortingState>([]);
  const [columnFiltersState, setColumnFiltersState] = useState<ColumnFiltersState>([]);
  const [globalFilterState, setGlobalFilterState] = useState("");
  const [columnVisibilityState, setColumnVisibilityState] = useState<VisibilityState>({});
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({});
  const [paginationStateInternal, setPaginationStateInternal] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [densityState, setDensityState] = useState<DataTableDensity>("comfortable");

  const sorting = sortingProp ?? sortingState;
  const columnFilters = columnFiltersProp ?? columnFiltersState;
  const globalFilter = globalFilterProp ?? globalFilterState;
  const columnVisibility = columnVisibilityProp ?? columnVisibilityState;
  const rowSelection = rowSelectionProp ?? rowSelectionState;
  const paginationStateValue = paginationProp ?? paginationStateInternal;
  const density = densityProp ?? densityState;

  const selectionEnabled = Boolean(enableRowSelection);

  /* ---- Compose columns: prepend selection column when enabled ---- */
  const resolvedColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!selectionEnabled) return columns;
    return [createSelectionColumn<TData>() as ColumnDef<TData, TValue>, ...columns];
  }, [columns, selectionEnabled]);

  /* ---- Feature detection: only wire optional models/state when used ---- */
  const filteringEnabled =
    searchable || Boolean(facetedFilters?.length) || Boolean(columnFiltersProp);
  const paginationEnabled = pagination || Boolean(manualPagination);

  const derivedPageCount =
    pageCount ??
    (rowCount != null
      ? Math.max(1, Math.ceil(rowCount / Math.max(1, paginationStateValue.pageSize)))
      : undefined);

  const table = useReactTable<TData>({
    data,
    columns: resolvedColumns,
    state: {
      sorting,
      ...(filteringEnabled ? { columnFilters, globalFilter } : {}),
      ...(enableColumnVisibility ? { columnVisibility } : {}),
      ...(selectionEnabled ? { rowSelection } : {}),
      ...(paginationEnabled ? { pagination: paginationStateValue } : {}),
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: onSortingChange ?? setSortingState,
    manualSorting,

    ...(filteringEnabled
      ? {
          getFilteredRowModel: getFilteredRowModel(),
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
          onColumnFiltersChange: onColumnFiltersChange ?? setColumnFiltersState,
          onGlobalFilterChange: onGlobalFilterChange ?? setGlobalFilterState,
          globalFilterFn: fuzzyTextFilter as FilterFn<TData>,
          manualFiltering,
        }
      : {}),

    ...(enableColumnVisibility
      ? { onColumnVisibilityChange: onColumnVisibilityChange ?? setColumnVisibilityState }
      : {}),

    ...(selectionEnabled
      ? {
          enableRowSelection,
          onRowSelectionChange: onRowSelectionChange ?? setRowSelectionState,
        }
      : {}),

    ...(paginationEnabled
      ? {
          onPaginationChange: onPaginationChange ?? setPaginationStateInternal,
          manualPagination,
          ...(manualPagination
            ? { pageCount: derivedPageCount, rowCount }
            : { getPaginationRowModel: getPaginationRowModel() }),
        }
      : {}),

    filterFns: { arrIncludesSome: arrIncludesSomeFilter as FilterFn<TData> },
  });

  /* ---- Derived render state ---- */
  const showToolbar =
    searchable ||
    Boolean(facetedFilters?.length) ||
    enableColumnVisibility ||
    enableDensityToggle ||
    enableCsvExport ||
    Boolean(toolbarStart) ||
    Boolean(toolbarEnd);

  const rows = table.getRowModel().rows;
  const colSpan = resolvedColumns.length || 1;
  const densityClass = DENSITY_CELL[density];

  const selectedRows = selectionEnabled ? table.getFilteredSelectedRowModel().rows : [];
  const skeletonRows = loadingRowCount ?? (paginationEnabled ? paginationStateValue.pageSize : 5);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {showToolbar ? (
        <DataTableToolbar
          table={table}
          label={toolbarLabel}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          globalFilter={globalFilter}
          onGlobalFilterChange={(value) => (onGlobalFilterChange ?? setGlobalFilterState)(value)}
          {...(facetedFilters ? { facetedFilters } : {})}
          enableColumnVisibility={enableColumnVisibility}
          density={density}
          enableDensityToggle={enableDensityToggle}
          onDensityChange={(value) => setDensityState(value)}
          enableCsvExport={enableCsvExport}
          onExportCsv={() => downloadCsv(tableRowsToCsv(table), csvFileName)}
          {...(toolbarStart ? { toolbarStart } : {})}
          {...(toolbarEnd ? { toolbarEnd } : {})}
        />
      ) : null}

      {selectionEnabled && bulkActions && selectedRows.length > 0 ? (
        <section
          aria-label="Bulk actions"
          className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-inset px-3 py-2"
        >
          <span className="text-sm text-fg-secondary" aria-live="polite">
            {selectedRows.length} selected
          </span>
          <div className="ml-auto flex items-center gap-2">{bulkActions(selectedRows)}</div>
        </section>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable identity.
                <TableRow key={`skeleton-${rowIndex}`}>
                  {resolvedColumns.map((_column, cellIndex) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable identity.
                    <TableCell key={`skeleton-cell-${cellIndex}`} className={densityClass}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error != null ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-fg-secondary">
                    <AlertCircle aria-hidden className="size-6 text-error" />
                    <div role="alert" className="text-sm">
                      {error}
                    </div>
                    {onRetry ? (
                      <Button variant="outline" size="sm" onClick={onRetry}>
                        <RefreshCw aria-hidden />
                        Retry
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={densityClass}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-24 text-center text-fg-tertiary">
                  {emptyState ?? "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationEnabled && !loading && error == null ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {selectionEnabled ? (
            <p className="text-sm text-fg-tertiary" aria-live="polite">
              {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </p>
          ) : (
            <span />
          )}
          <div className="ml-auto">
            <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
          </div>
        </div>
      ) : selectionEnabled && !loading && error == null ? (
        <p className="text-sm text-fg-tertiary" aria-live="polite">
          {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </p>
      ) : null}
    </div>
  );
}
