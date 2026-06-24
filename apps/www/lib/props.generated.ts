// GENERATED FILE — do not edit; run `bun run props` to regenerate.
//
// Props/API tables extracted from the exported `*Props` interfaces of every
// @cooud-ui/ui component via the TypeScript compiler API (no module execution),
// so the documented API can never drift from the source.

export interface PropDef {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  default?: string;
}

export interface PropsDoc {
  interfaceName: string;
  extends?: string;
  props: PropDef[];
}

export const COMPONENT_PROPS: Record<string, PropsDoc[]> = {
  button: [
    {
      interfaceName: "ButtonProps",
      extends:
        "Extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "variant",
          type: '"primary" | "gradient" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
          required: false,
          default: '"primary"',
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg" | "icon" | "icon-sm"',
          required: false,
          default: '"md"',
        },
      ],
    },
  ],
  "animated-button": [
    {
      interfaceName: "AnimatedButtonProps",
      extends: "Extends ButtonProps",
      props: [],
    },
  ],
  toggle: [
    {
      interfaceName: "ToggleProps",
      extends:
        "Extends ComponentPropsWithoutRef<typeof TogglePrimitive.Root>, VariantProps<typeof toggleVariants>",
      props: [
        {
          name: "variant",
          type: '"default" | "outline"',
          required: false,
          default: '"default"',
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          required: false,
          default: '"md"',
        },
      ],
    },
  ],
  "copy-button": [
    {
      interfaceName: "CopyButtonProps",
      extends: 'Extends Omit<ButtonProps, "value" | "children">',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "Text written to the clipboard when the button is pressed.",
        },
        {
          name: "timeout",
          type: "number",
          required: false,
          description:
            'Milliseconds the "copied" state stays visible before reverting. Defaults to 1500.',
          default: "1500",
        },
        {
          name: "copyLabel",
          type: "string",
          required: false,
          description:
            'Accessible label shown to assistive tech in the idle state. Defaults to "Copy".',
          default: '"Copy"',
        },
        {
          name: "copiedLabel",
          type: "string",
          required: false,
          description: 'Accessible label announced after a successful copy. Defaults to "Copied".',
          default: '"Copied"',
        },
      ],
    },
  ],
  input: [
    {
      interfaceName: "InputProps",
      extends: "Extends InputHTMLAttributes<HTMLInputElement>",
      props: [
        {
          name: "invalid",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  textarea: [
    {
      interfaceName: "TextareaProps",
      extends: "Extends TextareaHTMLAttributes<HTMLTextAreaElement>",
      props: [
        {
          name: "invalid",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  combobox: [
    {
      interfaceName: "ComboboxProps",
      props: [
        {
          name: "options",
          type: "ComboboxOption[]",
          required: true,
          description: "The list of selectable options.",
        },
        {
          name: "value",
          type: "string",
          required: false,
          description: "Controlled selected value. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial value for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          required: false,
          description: "Called with the new value when the selection changes.",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Text shown on the trigger when nothing is selected.",
          default: '"Select an option…"',
        },
        {
          name: "searchPlaceholder",
          type: "string",
          required: false,
          description: "Placeholder for the search input inside the popover.",
          default: '"Search…"',
        },
        {
          name: "emptyText",
          type: "string",
          required: false,
          description: "Message rendered when no option matches the search.",
          default: '"No results found."',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the trigger entirely.",
          default: "false",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the trigger button.",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover content.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the trigger when there is no visible label.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "ID of an element labelling the trigger.",
        },
      ],
    },
  ],
  "multi-select": [
    {
      interfaceName: "MultiSelectProps",
      props: [
        {
          name: "options",
          type: "MultiSelectOption[]",
          required: true,
          description: "Options shown in the searchable list.",
        },
        {
          name: "value",
          type: "string[]",
          required: false,
          description: "Controlled selection. Provide together with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "string[]",
          required: false,
          description: "Uncontrolled initial selection.",
        },
        {
          name: "onValueChange",
          type: "(value: string[]) => void",
          required: false,
          description: "Called with the next selection whenever it changes.",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Text shown in the trigger when nothing is selected.",
          default: '"Select…"',
        },
        {
          name: "searchPlaceholder",
          type: "string",
          required: false,
          description: "Placeholder for the search input inside the popover.",
          default: '"Search…"',
        },
        {
          name: "emptyText",
          type: "string",
          required: false,
          description: "Text shown when the search yields no results.",
          default: '"No results found."',
        },
        {
          name: "maxDisplay",
          type: "number",
          required: false,
          description:
            'Maximum number of chips to render before collapsing the rest into a "+N" badge. When omitted, every selected chip is rendered.',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disable the whole control.",
          default: "false",
        },
        {
          name: "removeLastOnBackspace",
          type: "boolean",
          required: false,
          description:
            "When true (default), pressing Backspace with an empty search removes the last selected item.",
          default: "true",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the trigger button.",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover content.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible label for the trigger when no visible label is associated.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "id of an element that labels the trigger.",
        },
        {
          name: "aria-invalid",
          type: 'boolean | "true" | "false"',
          required: false,
          description:
            "Marks the trigger as invalid (e.g. from a Form layer), applying error styling.",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controls the popover open state (controlled).",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Initial popover open state (uncontrolled).",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
          description: "Called when the popover open state changes.",
        },
      ],
    },
  ],
  "file-dropzone": [
    {
      interfaceName: "FileDropzoneProps",
      props: [
        {
          name: "onFiles",
          type: "(files: File[]) => void",
          required: true,
        },
        {
          name: "accept",
          type: "string",
          required: false,
        },
        {
          name: "multiple",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "className",
          type: "string",
          required: false,
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
  ],
  "number-input": [
    {
      interfaceName: "NumberInputProps",
      props: [
        {
          name: "value",
          type: "number | null",
          required: false,
          description: "Controlled value. Pair with `onValueChange`. Use `null` for empty.",
        },
        {
          name: "defaultValue",
          type: "number | null",
          required: false,
          description: "Initial value for uncontrolled usage.",
          default: "null",
        },
        {
          name: "onValueChange",
          type: "(value: number | null) => void",
          required: false,
          description: "Called with the new value (or `null` when cleared) on every change.",
        },
        {
          name: "min",
          type: "number",
          required: false,
          description: "Minimum allowed value. The decrement stepper disables at this bound.",
        },
        {
          name: "max",
          type: "number",
          required: false,
          description: "Maximum allowed value. The increment stepper disables at this bound.",
        },
        {
          name: "step",
          type: "number",
          required: false,
          description: "Increment for steppers and Arrow keys. Defaults to `1`.",
          default: "1",
        },
        {
          name: "largeStep",
          type: "number",
          required: false,
          description: "Larger increment for PageUp / PageDown. Defaults to `step * 10`.",
        },
        {
          name: "precision",
          type: "number",
          required: false,
          description: "Number of decimal places to round and display the committed value to.",
        },
        {
          name: "format",
          type: "(value: number) => string",
          required: false,
          description: "Custom formatter for the displayed value when not focused.",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the input and both steppers.",
          default: "false",
        },
        {
          name: "invalid",
          type: "boolean",
          required: false,
          description: "Marks the field as invalid (forwarded to the underlying Input).",
          default: "false",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Placeholder shown when the field is empty.",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the wrapper element.",
        },
        {
          name: "inputClassName",
          type: "string",
          required: false,
          description: "Extra classes for the underlying input.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the spinbutton when there is no visible label.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "ID of an element labelling the spinbutton.",
        },
        {
          name: "aria-describedby",
          type: "string",
          required: false,
          description: "ID of an element describing the spinbutton.",
        },
        {
          name: "id",
          type: "string",
          required: false,
          description: "Native id for the input.",
        },
        {
          name: "name",
          type: "string",
          required: false,
          description: "Native name for the input (form submission).",
        },
        {
          name: "onBlur",
          type: "(event: FocusEvent<HTMLInputElement>) => void",
          required: false,
          description: "Called when the input loses focus.",
        },
      ],
    },
  ],
  autocomplete: [
    {
      interfaceName: "AutocompleteProps",
      extends:
        'Extends Omit< InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "onSelect" | "role" >',
      props: [
        {
          name: "options",
          type: "AutocompleteOption[]",
          required: false,
          description:
            "Static suggestions. When omitted, provide `onSearch` to fetch suggestions for the current query asynchronously.",
        },
        {
          name: "onSearch",
          type: "(query: string) => Promise<AutocompleteOption[]>",
          required: false,
          description:
            "Async resolver invoked (debounced) with the current query. Return the suggestions to render. Use together with `loading` for the busy state, or let the component manage `loading` automatically when `options` is omitted.",
        },
        {
          name: "value",
          type: "string",
          required: false,
          description: "Controlled free-text value. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial value for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          required: false,
          description: "Called with the new free-text value on every keystroke or selection.",
        },
        {
          name: "onSelect",
          type: "(option: AutocompleteOption) => void",
          required: false,
          description: "Called when a suggestion is committed (click / Enter on a highlight).",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Placeholder for the text input.",
          default: '"Type to search…"',
        },
        {
          name: "emptyText",
          type: "string",
          required: false,
          description: "Message rendered when there are no suggestions for the query.",
          default: '"No results found."',
        },
        {
          name: "loading",
          type: "boolean",
          required: false,
          description:
            "Forces the busy state (spinner + skeletons). When `onSearch` is provided and this is left undefined, the component tracks pending searches itself.",
        },
        {
          name: "debounceMs",
          type: "number",
          required: false,
          description: "Debounce, in ms, before `onSearch` fires or local filtering re-runs.",
          default: "200",
        },
        {
          name: "allowCustomValue",
          type: "boolean",
          required: false,
          description:
            "When true (default), the committed value can be free text that is not in the suggestion list. When false, blurring or Enter with non-matching text reverts to the last valid value.",
          default: "true",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disable the whole control.",
          default: "false",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover content.",
        },
        {
          name: "loadingSkeletonRows",
          type: "number",
          required: false,
          description: "Number of skeleton rows to show while loading.",
          default: "3",
        },
      ],
    },
  ],
  stepper: [
    {
      interfaceName: "StepperProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">',
      props: [
        {
          name: "value",
          type: "number",
          required: false,
          description:
            "Controlled active step index. When provided the stepper is fully controlled.",
        },
        {
          name: "defaultValue",
          type: "number",
          required: false,
          description: "Initial active step index for the uncontrolled case. Defaults to `0`.",
          default: "0",
        },
        {
          name: "onValueChange",
          type: "(value: number) => void",
          required: false,
          description: "Called whenever a step should become active (controlled or not).",
        },
        {
          name: "orientation",
          type: "StepperOrientation",
          required: false,
          description: 'Layout axis. Defaults to `"horizontal"`.',
          default: '"horizontal"',
        },
      ],
    },
    {
      interfaceName: "StepperItemProps",
      extends: "Extends HTMLAttributes<HTMLLIElement>",
      props: [
        {
          name: "step",
          type: "number",
          required: true,
          description:
            "This step's zero-based index. Required so the item can derive its state (completed / active / upcoming) from the stepper's active value.",
        },
        {
          name: "completed",
          type: "boolean",
          required: false,
          description: 'Mark the step done explicitly. Overrides the index-derived "completed".',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disable interaction + dim the step.",
          default: "false",
        },
      ],
    },
    {
      interfaceName: "StepperIndicatorProps",
      extends:
        'Extends HTMLAttributes<HTMLSpanElement>, Omit<VariantProps<typeof stepperIndicatorVariants>, "state">',
      props: [
        {
          name: "children",
          type: 'HTMLAttributes<HTMLSpanElement>["children"]',
          required: false,
          description: "Override the auto-rendered content (step number / check).",
        },
      ],
    },
    {
      interfaceName: "StepperTriggerProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
  ],
  badge: [
    {
      interfaceName: "BadgeProps",
      extends: "Extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants>",
      props: [
        {
          name: "variant",
          type: '"default" | "primary" | "secondary" | "outline" | "success" | "warning" | "destructive" | "error" | "info"',
          required: false,
          default: '"default"',
        },
      ],
    },
  ],
  "data-table": [
    {
      interfaceName: "DataTableProps",
      props: [
        {
          name: "columns",
          type: "ColumnDef<TData, TValue>[]",
          required: true,
        },
        {
          name: "data",
          type: "TData[]",
          required: true,
        },
        {
          name: "searchable",
          type: "boolean",
          required: false,
          description: "Show the toolbar with a global search field.",
        },
        {
          name: "searchPlaceholder",
          type: "string",
          required: false,
          description: 'Placeholder for the global search field. Defaults to "Search…".',
        },
        {
          name: "globalFilter",
          type: "string",
          required: false,
          description: "Controlled global filter value. Implies a controlled toolbar search.",
        },
        {
          name: "onGlobalFilterChange",
          type: "OnChangeFn<string>",
          required: false,
          description: "Called when the global filter changes (controlled or uncontrolled).",
        },
        {
          name: "facetedFilters",
          type: "DataTableFacetedFilter[]",
          required: false,
          description: "Faceted (multi-select) column filters rendered in the toolbar.",
        },
        {
          name: "toolbarStart",
          type: "ReactNode",
          required: false,
          description: "Extra nodes rendered on the left side of the toolbar.",
        },
        {
          name: "toolbarEnd",
          type: "ReactNode",
          required: false,
          description:
            "Extra nodes rendered on the right side of the toolbar (before the View menu).",
        },
        {
          name: "enableColumnVisibility",
          type: "boolean",
          required: false,
          description: 'Show the "View" menu that toggles column visibility.',
        },
        {
          name: "columnVisibility",
          type: "VisibilityState",
          required: false,
          description: "Controlled column visibility state.",
        },
        {
          name: "onColumnVisibilityChange",
          type: "OnChangeFn<VisibilityState>",
          required: false,
          description: "Called when column visibility changes.",
        },
        {
          name: "sorting",
          type: "SortingState",
          required: false,
          description: "Controlled sorting state.",
        },
        {
          name: "onSortingChange",
          type: "OnChangeFn<SortingState>",
          required: false,
          description: "Called when sorting changes.",
        },
        {
          name: "manualSorting",
          type: "boolean",
          required: false,
          description: "Server-side sorting: skip the client sort model.",
        },
        {
          name: "columnFilters",
          type: "ColumnFiltersState",
          required: false,
          description: "Controlled column filters state.",
        },
        {
          name: "onColumnFiltersChange",
          type: "OnChangeFn<ColumnFiltersState>",
          required: false,
          description: "Called when column filters change.",
        },
        {
          name: "manualFiltering",
          type: "boolean",
          required: false,
          description: "Server-side filtering: skip the client filter model.",
        },
        {
          name: "pagination",
          type: "boolean",
          required: false,
          description: "Show the pagination footer.",
        },
        {
          name: "paginationState",
          type: "PaginationState",
          required: false,
          description: "Controlled pagination state.",
        },
        {
          name: "onPaginationChange",
          type: "OnChangeFn<PaginationState>",
          required: false,
          description: "Called when pagination changes (controlled).",
        },
        {
          name: "manualPagination",
          type: "boolean",
          required: false,
          description: "Server-side pagination: provide `pageCount` or `rowCount`.",
        },
        {
          name: "pageCount",
          type: "number",
          required: false,
          description: "Total page count for server-side pagination.",
        },
        {
          name: "rowCount",
          type: "number",
          required: false,
          description: "Total row count for server-side pagination (used to derive `pageCount`).",
        },
        {
          name: "initialPageSize",
          type: "number",
          required: false,
          description: "Initial page size when uncontrolled. Defaults to 10.",
        },
        {
          name: "pageSizeOptions",
          type: "number[]",
          required: false,
          description:
            "Page-size options offered in the footer select. Defaults to [10, 20, 30, 50].",
        },
        {
          name: "enableRowSelection",
          type: "boolean | ((row: Row<TData>) => boolean)",
          required: false,
          description: "Render a leading checkbox column with header select-all.",
        },
        {
          name: "rowSelection",
          type: "RowSelectionState",
          required: false,
          description: "Controlled row-selection state.",
        },
        {
          name: "onRowSelectionChange",
          type: "OnChangeFn<RowSelectionState>",
          required: false,
          description: "Called when row selection changes.",
        },
        {
          name: "bulkActions",
          type: "(rows: Row<TData>[]) => ReactNode",
          required: false,
          description:
            "Render slot for bulk actions. Receives the currently selected rows; shown in a bar above the table only while at least one row is selected.",
        },
        {
          name: "density",
          type: "DataTableDensity",
          required: false,
          description:
            "Controlled cell padding density. When provided, the toolbar toggle becomes controlled and you must update it via . Omit it to let the table manage density internally (see ).",
        },
        {
          name: "onDensityChange",
          type: "(density: DataTableDensity) => void",
          required: false,
          description: "Called when the density toggle is pressed (controlled or uncontrolled).",
        },
        {
          name: "initialDensity",
          type: "DataTableDensity",
          required: false,
          description: 'Initial density when uncontrolled. Defaults to "comfortable".',
        },
        {
          name: "enableDensityToggle",
          type: "boolean",
          required: false,
          description: "Show a comfortable/compact density toggle in the toolbar.",
        },
        {
          name: "enableCsvExport",
          type: "boolean",
          required: false,
          description: "Show a CSV export button in the toolbar.",
        },
        {
          name: "csvFileName",
          type: "string",
          required: false,
          description: 'Download file name (without extension). Defaults to "export".',
        },
        {
          name: "loading",
          type: "boolean",
          required: false,
          description: "Render skeleton rows instead of data.",
        },
        {
          name: "loadingRowCount",
          type: "number",
          required: false,
          description: "Number of skeleton rows while `loading`. Defaults to the page size or 5.",
        },
        {
          name: "error",
          type: "ReactNode",
          required: false,
          description: "Render an error state with an optional retry button.",
        },
        {
          name: "onRetry",
          type: "() => void",
          required: false,
          description: "Called when the error-state retry button is pressed.",
        },
        {
          name: "emptyState",
          type: "ReactNode",
          required: false,
          description: 'Custom empty-state content. Defaults to "No results.".',
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Class applied to the outer wrapper.",
        },
        {
          name: "toolbarLabel",
          type: "string",
          required: false,
          description: 'Accessible label for the toolbar region. Defaults to "Table controls".',
        },
      ],
    },
    {
      interfaceName: "DataTableColumnHeaderProps",
      props: [
        {
          name: "column",
          type: "Column<TData, TValue>",
          required: true,
        },
        {
          name: "title",
          type: "string",
          required: true,
        },
        {
          name: "className",
          type: "string",
          required: false,
        },
      ],
    },
  ],
  metric: [
    {
      interfaceName: "MetricDeltaProps",
      extends: "Extends HTMLAttributes<HTMLSpanElement>",
      props: [
        {
          name: "trend",
          type: '"up" | "down" | "neutral"',
          required: false,
          default: '"neutral"',
        },
      ],
    },
  ],
  "code-block": [
    {
      interfaceName: "CodeBlockProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "children">',
      props: [
        {
          name: "code",
          type: "string",
          required: true,
          description: "Raw source to render and copy.",
        },
        {
          name: "language",
          type: "string",
          required: false,
          description: "Language label rendered as a Badge in the header.",
        },
        {
          name: "filename",
          type: "string",
          required: false,
          description: "File name rendered in the header.",
        },
        {
          name: "showLineNumbers",
          type: "boolean",
          required: false,
          description: "Render a gutter with 1-based line numbers. Defaults to false.",
          default: "false",
        },
      ],
    },
  ],
  "aspect-ratio": [
    {
      interfaceName: "AspectRatioProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "ratio",
          type: "number",
          required: false,
          description:
            "The desired width-to-height ratio, expressed as a number (e.g. `16 / 9`, `1`, `4 / 3`). Defaults to `16 / 9`.",
          default: "16 / 9",
        },
      ],
    },
  ],
  alert: [
    {
      interfaceName: "AlertProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants>",
      props: [
        {
          name: "variant",
          type: '"default" | "info" | "success" | "warning" | "destructive"',
          required: false,
          default: '"default"',
        },
      ],
    },
  ],
  spinner: [
    {
      interfaceName: "SpinnerProps",
      extends: "Extends SVGAttributes<SVGSVGElement>, VariantProps<typeof spinnerVariants>",
      props: [
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          required: false,
          default: '"md"',
        },
      ],
    },
  ],
  sonner: [
    {
      interfaceName: "ToasterProps",
      extends: "Extends React.ComponentProps<typeof Sonner>",
      props: [],
    },
  ],
  sheet: [
    {
      interfaceName: "SheetContentProps",
      extends:
        "Extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants>",
      props: [
        {
          name: "side",
          type: '"top" | "right" | "bottom" | "left"',
          required: false,
          default: '"right"',
        },
      ],
    },
  ],
  command: [
    {
      interfaceName: "CommandDialogProps",
      extends: "Extends ComponentProps<typeof Dialog>",
      props: [
        {
          name: "title",
          type: "string",
          required: false,
          default: '"Command Menu"',
        },
        {
          name: "description",
          type: "string",
          required: false,
          default: '"Search for a command to run..."',
        },
      ],
    },
  ],
  breadcrumb: [
    {
      interfaceName: "BreadcrumbLinkProps",
      extends: "Extends AnchorHTMLAttributes<HTMLAnchorElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  pagination: [
    {
      interfaceName: "PaginationLinkProps",
      extends: "Extends AnchorHTMLAttributes<HTMLAnchorElement>",
      props: [
        {
          name: "isActive",
          type: "boolean",
          required: false,
        },
        {
          name: "size",
          type: "PaginationLinkSize",
          required: false,
        },
      ],
    },
  ],
  sidebar: [
    {
      interfaceName: "SidebarProviderProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Default desktop open state when uncontrolled.",
          default: "true",
        },
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controlled desktop open state.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
        },
        {
          name: "enableKeyboardShortcut",
          type: "boolean",
          required: false,
          description: "Enable the Ctrl/Cmd+B toggle shortcut.",
          default: "true",
        },
      ],
    },
    {
      interfaceName: "SidebarProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "side",
          type: '"left" | "right"',
          required: false,
          default: '"left"',
        },
        {
          name: "variant",
          type: '"sidebar" | "floating" | "inset"',
          required: false,
          default: '"sidebar"',
        },
        {
          name: "collapsible",
          type: '"offcanvas" | "icon" | "none"',
          required: false,
          default: '"icon"',
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible label for the navigation landmark.",
        },
      ],
    },
    {
      interfaceName: "SidebarTriggerProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          description: "Render through a custom element while keeping the toggle behavior.",
          default: "false",
        },
      ],
    },
    {
      interfaceName: "SidebarGroupLabelProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
    {
      interfaceName: "SidebarMenuButtonProps",
      extends:
        "Extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof sidebarMenuButtonVariants>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "isActive",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "tooltip",
          type: "ReactNode | ComponentPropsWithoutRef<typeof TooltipContent>",
          required: false,
          description:
            "Tooltip content shown only when the sidebar is collapsed to icons on desktop. Accepts a string or full `TooltipContent` props.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          required: false,
          default: '"md"',
        },
      ],
    },
    {
      interfaceName: "SidebarMenuSubButtonProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "isActive",
          type: "boolean",
          required: false,
          default: "false",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          required: false,
          default: '"md"',
        },
      ],
    },
  ],
  "app-shell": [
    {
      interfaceName: "AppShellProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "sidebar",
          type: "ReactNode",
          required: true,
          description:
            "The sidebar element. Pass a `<Sidebar>` (and its trigger/menus). Rendered as the first child of the provider so it sits beside the content region.",
        },
        {
          name: "header",
          type: "ReactNode",
          required: false,
          description:
            'Optional topbar content rendered inside a sticky `<header role="banner">` at the top of the content region. Omit for a header-less shell.',
        },
        {
          name: "providerProps",
          type: 'Omit<SidebarProviderProps, "children">',
          required: false,
          description: "Props forwarded to the underlying `SidebarProvider`.",
        },
        {
          name: "inset",
          type: "boolean",
          required: false,
          description:
            'When `true`, wraps the content region in `SidebarInset` for the rounded, inset surface that pairs with `variant="inset" | "floating"` sidebars.',
          default: "false",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the content region wrapper.",
        },
        {
          name: "headerClassName",
          type: "string",
          required: false,
          description: "Extra classes for the sticky header.",
        },
      ],
    },
  ],
  resizable: [
    {
      interfaceName: "ResizableHandleProps",
      extends: "Extends ComponentProps<typeof ResizablePrimitiveHandle>",
      props: [
        {
          name: "withHandle",
          type: "boolean",
          required: false,
          description: "Render a centered grip affordance on the divider. Defaults to `false`.",
          default: "false",
        },
      ],
    },
  ],
  "date-picker": [
    {
      interfaceName: "DatePickerProps",
      props: [
        {
          name: "value",
          type: "Date",
          required: false,
        },
        {
          name: "onChange",
          type: "(date: Date | undefined) => void",
          required: false,
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
        },
      ],
    },
  ],
  "date-range-picker": [
    {
      interfaceName: "DateRangePickerProps",
      props: [
        {
          name: "value",
          type: "DateRange",
          required: false,
          description: "Controlled value. Pair with `onValueChange`.",
        },
        {
          name: "defaultValue",
          type: "DateRange",
          required: false,
          description: "Initial value for uncontrolled usage.",
        },
        {
          name: "onValueChange",
          type: "(range: DateRange | undefined) => void",
          required: false,
          description: "Called with the new range whenever the selection changes.",
        },
        {
          name: "presets",
          type: "DateRangePreset[]",
          required: false,
          description: "Optional shortcuts shown in a column beside the calendar.",
        },
        {
          name: "placeholder",
          type: "string",
          required: false,
          description: "Text shown on the trigger when no range is selected.",
          default: '"Pick a date range"',
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disables the trigger entirely.",
          default: "false",
        },
        {
          name: "min",
          type: "Date",
          required: false,
          description: "Earliest selectable day (inclusive).",
        },
        {
          name: "max",
          type: "Date",
          required: false,
          description: "Latest selectable day (inclusive).",
        },
        {
          name: "disabledDates",
          type: "Matcher | Matcher[]",
          required: false,
          description: "Extra non-selectable days, merged with `min`/`max`.",
        },
        {
          name: "dateFormat",
          type: "string",
          required: false,
          description: "`date-fns` format token for each end of the range.",
          default: '"LLL dd, y"',
        },
        {
          name: "align",
          type: 'ComponentPropsWithoutRef<typeof PopoverContent>["align"]',
          required: false,
          description: "Alignment of the popover against the trigger.",
          default: '"start"',
        },
        {
          name: "numberOfMonths",
          type: "number",
          required: false,
          description: "Number of months shown on wider viewports.",
          default: "2",
        },
        {
          name: "className",
          type: "string",
          required: false,
          description: "Extra classes for the trigger button.",
        },
        {
          name: "contentClassName",
          type: "string",
          required: false,
          description: "Extra classes for the popover content.",
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name for the trigger when there is no visible label.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "ID of an element labelling the trigger.",
        },
      ],
    },
  ],
  "gradient-border": [
    {
      interfaceName: "GradientBorderProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "innerClassName",
          type: "string",
          required: false,
        },
        {
          name: "glow",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  "gradient-text": [
    {
      interfaceName: "GradientTextProps",
      extends: "Extends HTMLAttributes<HTMLSpanElement>",
      props: [
        {
          name: "asChild",
          type: "boolean",
          required: false,
          default: "false",
        },
      ],
    },
  ],
  "logo-carousel": [
    {
      interfaceName: "LogoCarouselProps",
      extends: "Extends HTMLAttributes<HTMLUListElement>",
      props: [
        {
          name: "items",
          type: "LogoCarouselItem[]",
          required: true,
        },
        {
          name: "columns",
          type: "number",
          required: false,
        },
        {
          name: "columnCount",
          type: "number",
          required: false,
          description: "Alias kept for snippets that call this pattern `columnCount`.",
        },
        {
          name: "interval",
          type: "number",
          required: false,
          default: "2200",
        },
        {
          name: "staggerDelay",
          type: "number",
          required: false,
          default: "0.07",
        },
        {
          name: "pauseOnHover",
          type: "boolean",
          required: false,
          default: "true",
        },
        {
          name: "ariaLabel",
          type: "string",
          required: false,
          default: '"Logo carousel"',
        },
        {
          name: "variant",
          type: "LogoCarouselVariant",
          required: false,
          default: '"ghost"',
        },
        {
          name: "size",
          type: "LogoCarouselSize",
          required: false,
          default: '"lg"',
        },
        {
          name: "motionPreference",
          type: "LogoCarouselMotionPreference",
          required: false,
          default: '"user"',
        },
        {
          name: "itemClassName",
          type: "string",
          required: false,
        },
        {
          name: "logoClassName",
          type: "string",
          required: false,
        },
      ],
    },
  ],
  "morphing-popover": [
    {
      interfaceName: "MorphingPopoverProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "open",
          type: "boolean",
          required: false,
          description: "Controlled open state. When provided, the component is fully controlled.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          required: false,
          description: "Initial open state for the uncontrolled case.",
          default: "false",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          required: false,
          description: "Called whenever the open state should change (controlled or not).",
        },
        {
          name: "transition",
          type: "Transition",
          required: false,
          description: "Override the morph spring (advanced — defaults to the Cooud morph spring).",
          default: "MORPHING_POPOVER_TRANSITION",
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"`: users who opt out get a fade instead of the layout morph. Pass `"never"` to always play the morph (e.g. a showcase that must demonstrate the animation), or `"always"` to force the reduced variant for everyone.',
          default: '"user"',
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "MorphingPopoverTriggerProps",
      extends:
        'Extends Omit< React.ComponentPropsWithoutRef<typeof motion.button>, "ref" | "children" | "onClick" >',
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
        {
          name: "onClick",
          type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
          required: false,
          description: "Extra click handler; runs alongside the open toggle.",
        },
      ],
    },
    {
      interfaceName: "MorphingPopoverContentProps",
      extends:
        'Extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, "ref" | "children">',
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
        {
          name: "aria-label",
          type: "string",
          required: false,
          description: "Accessible name when the content has no visible heading to point at.",
        },
        {
          name: "aria-labelledby",
          type: "string",
          required: false,
          description: "Id of a visible heading element (e.g. a ).",
        },
      ],
    },
    {
      interfaceName: "MorphingPopoverCloseProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
    {
      interfaceName: "MorphingPopoverHeaderProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
    {
      interfaceName: "MorphingPopoverBodyProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
    {
      interfaceName: "MorphingPopoverFooterProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
    {
      interfaceName: "MorphingPopoverButtonProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
  ],
  reveal: [
    {
      interfaceName: "RevealProps",
      extends: "Extends React.HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "delay",
          type: "number",
          required: false,
        },
        {
          name: "once",
          type: "boolean",
          required: false,
        },
      ],
    },
  ],
  "animated-number": [
    {
      interfaceName: "AnimatedNumberProps",
      extends: 'Extends Omit<React.ComponentPropsWithoutRef<typeof motion.span>, "children">',
      props: [
        {
          name: "value",
          type: "number",
          required: true,
          description:
            "Target value. Whenever it changes, the number tweens from its current displayed value to here.",
        },
        {
          name: "format",
          type: "(n: number) => string",
          required: false,
          description:
            "Custom formatter for the displayed string. When omitted, the value is formatted with `Intl.NumberFormat(locale, formatOptions)`.",
        },
        {
          name: "locale",
          type: "string",
          required: false,
          description:
            "Locale passed to the default `Intl.NumberFormat` formatter (ignored if `format` is set).",
        },
        {
          name: "formatOptions",
          type: "Intl.NumberFormatOptions",
          required: false,
          description:
            "Options passed to the default `Intl.NumberFormat` formatter (ignored if `format` is set).",
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description:
            "Tween length in seconds. Defaults to ~0.8s; overrides the spring's natural duration.",
          default: "0.8",
        },
        {
          name: "spring",
          type: "AnimatedNumberSpring",
          required: false,
          description:
            "Override the settle spring (advanced — defaults to the Cooud count spring).",
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"` (snap for users who opt out). Pass `"never"` to always animate the count — e.g. a showcase that must demonstrate it — or `"always"` to force the snap.',
          default: '"user"',
        },
        {
          name: "announce",
          type: "boolean",
          required: false,
          description:
            'Announce the **settled** value to screen readers via a visually-hidden `aria-live="polite"` sibling. Defaults to `false`. Only the final value (once the tween completes / snaps) is announced — never the ~97 interpolated frames — so opting in stays quiet.',
          default: "false",
        },
      ],
    },
  ],
  carousel: [
    {
      interfaceName: "CarouselProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onScroll">',
      props: [
        {
          name: "opts",
          type: "CarouselOptions",
          required: false,
          description: "Tuning for snap alignment and looping.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "CarouselContentProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "CarouselItemProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "CarouselPreviousProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
    {
      interfaceName: "CarouselNextProps",
      extends: "Extends ButtonHTMLAttributes<HTMLButtonElement>",
      props: [],
    },
    {
      interfaceName: "CarouselDotsProps",
      extends: "Extends HTMLAttributes<HTMLDivElement>",
      props: [],
    },
  ],
  "segmented-control": [
    {
      interfaceName: "SegmentedControlProps",
      extends: 'Extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">',
      props: [
        {
          name: "value",
          type: "string",
          required: false,
          description:
            "Controlled selected value. When provided the component is fully controlled.",
        },
        {
          name: "defaultValue",
          type: "string",
          required: false,
          description: "Initial selected value for the uncontrolled case.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          required: false,
          description: "Called whenever the selection should change (controlled or not).",
        },
        {
          name: "size",
          type: "SegmentedControlSize",
          required: false,
          description: 'Density of the items. Defaults to `"md"`.',
          default: '"md"',
        },
        {
          name: "transition",
          type: "Transition",
          required: false,
          description: "Override the thumb spring (advanced — defaults to the Cooud thumb spring).",
          default: "SEGMENTED_THUMB_TRANSITION",
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"` (snap the thumb for users who opt out). Pass `"never"` to always slide it — e.g. a showcase that must demonstrate it — or `"always"` to force the snap.',
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
        },
      ],
    },
    {
      interfaceName: "SegmentedControlItemProps",
      extends: 'Extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange">',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "The value this option selects. Required and unique within a group.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: false,
          description: "Visible label (text and/or icon).",
        },
        {
          name: "disabled",
          type: "boolean",
          required: false,
          description: "Disable selection + skip in keyboard navigation.",
          default: "false",
        },
      ],
    },
  ],
  "text-effect": [
    {
      interfaceName: "TextEffectProps",
      extends: 'Extends Omit<React.HTMLAttributes<HTMLElement>, "children">',
      props: [
        {
          name: "children",
          type: "string",
          required: true,
          description:
            "The text to reveal. Must be a plain string so it can be split into words or characters — pass interpolated values as a single template string, not as child nodes.",
        },
        {
          name: "per",
          type: "TextEffectPer",
          required: false,
          description:
            'Split granularity. `"word"` (default) staggers words; `"char"` staggers letters.',
          default: '"word"',
        },
        {
          name: "preset",
          type: "TextEffectPreset",
          required: false,
          description: 'Which enter animation each unit plays. Defaults to `"blur"`.',
          default: '"blur"',
        },
        {
          name: "as",
          type: "React.ElementType",
          required: false,
          description:
            'The rendered wrapper element/tag (e.g. `"h1"`, `"span"`). Defaults to `"p"`. The wrapper itself is not animated — it carries the accessible label while inner `motion.span`s do the animating.',
        },
        {
          name: "delay",
          type: "number",
          required: false,
          description: "Delay (seconds) before the first unit animates. Defaults to `0`.",
          default: "0",
        },
        {
          name: "stagger",
          type: "number",
          required: false,
          description:
            "Time (seconds) between consecutive units. Defaults to `0.04` for words and `0.02` for characters.",
        },
        {
          name: "duration",
          type: "number",
          required: false,
          description: "Per-unit animation duration (seconds). Defaults to `0.4`.",
          default: "0.4",
        },
        {
          name: "trigger",
          type: "TextEffectTrigger",
          required: false,
          description:
            '`"inView"` (default) animates once when the element scrolls into view; `"mount"` animates immediately on mount.',
          default: '"inView"',
        },
        {
          name: "reducedMotion",
          type: '"user" | "always" | "never"',
          required: false,
          description:
            'How `prefers-reduced-motion` is honoured. Defaults to `"user"` (render the text statically for users who opt out). Pass `"never"` to always play the stagger — e.g. a showcase that must demonstrate it — or `"always"` to force the static render.',
          default: '"user"',
        },
      ],
    },
  ],
};
