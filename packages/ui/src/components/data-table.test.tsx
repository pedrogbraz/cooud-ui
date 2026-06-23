import type { ColumnDef } from "@tanstack/react-table";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  DataTable,
  DataTableColumnHeader,
  fuzzyTextFilter,
  SELECTION_COLUMN_ID,
  tableRowsToCsv,
} from "./data-table.js";

interface Person {
  id: number;
  name: string;
  email: string;
  amount: number;
}

const DATA: Person[] = [
  { id: 1, name: "Charlie", email: "charlie@cooud.com", amount: 30 },
  { id: 2, name: "Alice", email: "alice@cooud.com", amount: 10 },
  { id: 3, name: "Bob", email: "bob@cooud.com", amount: 20 },
];

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => row.original.name,
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "amount", header: "Amount" },
];

/** Read the body rows' first data column (Name) in DOM order. */
function nameColumnOrder(): string[] {
  const rows = screen.getAllByRole("row").slice(1); // drop the header row
  return rows
    .map((r) => within(r).queryAllByRole("cell")[0]?.textContent ?? "")
    .filter((t) => t === "Alice" || t === "Bob" || t === "Charlie");
}

describe("DataTable — rendering", () => {
  it("renders the column headers", () => {
    render(<DataTable columns={columns} data={DATA} />);
    expect(screen.getByRole("columnheader", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Amount" })).toBeInTheDocument();
  });

  it("renders one body row per record", () => {
    render(<DataTable columns={columns} data={DATA} />);
    // 1 header row + 3 data rows.
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByRole("cell", { name: "alice@cooud.com" })).toBeInTheDocument();
  });

  it("shows the empty state when there is no data", () => {
    render(<DataTable columns={columns} data={[]} emptyState="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders an error state with a retry button", () => {
    render(<DataTable columns={columns} data={[]} error="Failed to load" onRetry={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load");
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});

describe("DataTable — sorting", () => {
  it("toggles ascending order when a sortable header is activated", async () => {
    render(<DataTable columns={columns} data={DATA} />);
    expect(nameColumnOrder()).toEqual(["Charlie", "Alice", "Bob"]);
    await userEvent.click(screen.getByRole("button", { name: /sort by name/i }));
    expect(nameColumnOrder()).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("reverses to descending on a second activation and updates the header label", async () => {
    render(<DataTable columns={columns} data={DATA} />);
    await userEvent.click(screen.getByRole("button", { name: /sort by name/i }));
    // After ascending, the accessible name advertises the next action (descending).
    const ascHeader = screen.getByRole("button", { name: /sorted by name ascending/i });
    await userEvent.click(ascHeader);
    expect(nameColumnOrder()).toEqual(["Charlie", "Bob", "Alice"]);
    expect(screen.getByRole("button", { name: /sorted by name descending/i })).toBeInTheDocument();
  });
});

describe("DataTable — search / filter", () => {
  it("narrows the visible rows to matches of the global search", async () => {
    render(<DataTable columns={columns} data={DATA} searchable />);
    expect(nameColumnOrder()).toHaveLength(3);
    const search = screen.getByRole("searchbox");
    await userEvent.type(search, "ali");
    expect(nameColumnOrder()).toEqual(["Alice"]);
  });

  it("restores all rows when the search is cleared", async () => {
    render(<DataTable columns={columns} data={DATA} searchable />);
    const search = screen.getByRole("searchbox");
    await userEvent.type(search, "bob");
    expect(nameColumnOrder()).toEqual(["Bob"]);
    await userEvent.clear(search);
    expect(nameColumnOrder()).toHaveLength(3);
  });
});

describe("DataTable — row selection", () => {
  it("prepends a selection column with a header select-all checkbox", () => {
    render(<DataTable columns={columns} data={DATA} enableRowSelection />);
    expect(
      screen.getByRole("checkbox", { name: /select all rows on this page/i }),
    ).toBeInTheDocument();
    // One select-all + one per row.
    expect(screen.getAllByRole("checkbox", { name: /select row/i })).toHaveLength(3);
  });

  it("toggles a single row and reports the selected count", async () => {
    render(<DataTable columns={columns} data={DATA} enableRowSelection />);
    const [firstRowCheckbox] = screen.getAllByRole("checkbox", { name: /select row/i });
    await userEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).toBeChecked();
    expect(screen.getByText(/1 of 3 row\(s\) selected/i)).toBeInTheDocument();
  });

  it("select-all toggles every row and shows the bulk-actions bar", async () => {
    render(
      <DataTable
        columns={columns}
        data={DATA}
        enableRowSelection
        bulkActions={(rows) => <button type="button">Delete {rows.length}</button>}
      />,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: /select all rows on this page/i }));
    for (const cb of screen.getAllByRole("checkbox", { name: /select row/i })) {
      expect(cb).toBeChecked();
    }
    const bulkBar = screen.getByRole("region", { name: "Bulk actions" });
    expect(within(bulkBar).getByText("3 selected")).toBeInTheDocument();
    expect(within(bulkBar).getByRole("button", { name: "Delete 3" })).toBeInTheDocument();
  });
});

describe("DataTable — pagination", () => {
  const many: Person[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Person ${String.fromCharCode(65 + i)}`,
    email: `p${i}@cooud.com`,
    amount: i,
  }));

  it("limits rows to the page size and disables previous on the first page", () => {
    render(<DataTable columns={columns} data={many} pagination initialPageSize={5} />);
    // header + 5 data rows.
    expect(screen.getAllByRole("row")).toHaveLength(6);
    expect(screen.getByRole("button", { name: /go to previous page/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /go to next page/i })).toBeEnabled();
    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
  });

  it("advances to the next page and disables next on the last page", async () => {
    render(<DataTable columns={columns} data={many} pagination initialPageSize={5} />);
    await userEvent.click(screen.getByRole("button", { name: /go to next page/i }));
    expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to previous page/i })).toBeEnabled();
    await userEvent.click(screen.getByRole("button", { name: /go to last page/i }));
    expect(screen.getByText(/page 3 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to next page/i })).toBeDisabled();
  });
});

describe("DataTable — helpers", () => {
  it("fuzzyTextFilter matches case-insensitively", () => {
    const row = { getValue: () => "Cooud Checkout" } as never;
    expect(fuzzyTextFilter(row, "name", "checkout", () => {})).toBe(true);
    expect(fuzzyTextFilter(row, "name", "stripe", () => {})).toBe(false);
  });

  it("exposes a stable selection column id", () => {
    expect(SELECTION_COLUMN_ID).toBe("__select__");
  });

  it("tableRowsToCsv is exported for server-side reuse", () => {
    expect(typeof tableRowsToCsv).toBe("function");
  });
});

describe("DataTable — a11y", () => {
  it("has no axe violations for a plain table", async () => {
    const { container } = render(<DataTable columns={columns} data={DATA} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with search + selection enabled", async () => {
    const { container } = render(
      <DataTable columns={columns} data={DATA} searchable enableRowSelection />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
