import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";

const PEOPLE = [
  { name: "Ada Lovelace", role: "Engineer" },
  { name: "Alan Turing", role: "Researcher" },
];

function Basic() {
  return (
    <Table>
      <TableCaption>Team members</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PEOPLE.map((p) => (
          <TableRow key={p.name}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>2</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe("Table", () => {
  it("renders an accessible table with its caption", () => {
    render(<Basic />);
    expect(screen.getByRole("table", { name: "Team members" })).toBeInTheDocument();
  });

  it("renders the column headers", () => {
    render(<Basic />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Role" })).toBeInTheDocument();
  });

  it("renders one row per record plus header and footer rows", () => {
    render(<Basic />);
    // 1 header row + 2 body rows + 1 footer row.
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByRole("cell", { name: "Ada Lovelace" })).toBeInTheDocument();
  });

  it("groups cells under their row", () => {
    render(<Basic />);
    const adaRow = screen.getByRole("cell", { name: "Ada Lovelace" }).closest("tr");
    expect(adaRow).not.toBeNull();
    if (adaRow) expect(within(adaRow).getByText("Engineer")).toBeInTheDocument();
  });

  it("wraps the table in a keyboard-focusable scroll region", () => {
    const { container } = render(<Basic />);
    const region = container.querySelector('[data-slot="table-container"]');
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toHaveAttribute("aria-label", "Table");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Basic />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
