import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { type TreeNode, TreeView } from "./tree-view.js";

const DATA: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "index", label: "index.ts" },
      {
        id: "components",
        label: "components",
        children: [
          { id: "button", label: "button.tsx" },
          { id: "tree", label: "tree-view.tsx" },
        ],
      },
    ],
  },
  { id: "readme", label: "README.md" },
];

describe("TreeView", () => {
  it("renders a tree with top-level treeitems and group structure", () => {
    render(<TreeView data={DATA} aria-label="Files" />);
    expect(screen.getByRole("tree", { name: "Files" })).toBeInTheDocument();
    // Root items are visible; collapsed children are not rendered.
    expect(screen.getByRole("treeitem", { name: /src/ })).toBeInTheDocument();
    expect(screen.getByRole("treeitem", { name: "README.md" })).toBeInTheDocument();
    expect(screen.queryByRole("treeitem", { name: "index.ts" })).not.toBeInTheDocument();
  });

  it("sets aria-expanded on branches and aria-level by depth", () => {
    render(<TreeView data={DATA} defaultExpandedIds={["src"]} />);
    const src = screen.getByRole("treeitem", { name: /src/ });
    expect(src).toHaveAttribute("aria-expanded", "true");
    expect(src).toHaveAttribute("aria-level", "1");
    // Leaf has no aria-expanded.
    expect(screen.getByRole("treeitem", { name: "README.md" })).not.toHaveAttribute(
      "aria-expanded",
    );
    expect(screen.getByRole("treeitem", { name: "index.ts" })).toHaveAttribute("aria-level", "2");
  });

  it("expands a branch on click, revealing children and toggling aria-expanded", async () => {
    render(<TreeView data={DATA} />);
    const src = screen.getByRole("treeitem", { name: /src/ });
    expect(src).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(src);
    expect(src).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("treeitem", { name: "index.ts" })).toBeInTheDocument();
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("collapses an expanded branch when clicked again", async () => {
    render(<TreeView data={DATA} defaultExpandedIds={["src"]} />);
    const src = screen.getByRole("treeitem", { name: /src/ });
    expect(src).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(src);
    expect(src).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("treeitem", { name: "index.ts" })).not.toBeInTheDocument();
  });

  it("fires onValueChange and sets aria-selected when a node is selected", async () => {
    const onValueChange = vi.fn();
    render(<TreeView data={DATA} onValueChange={onValueChange} />);
    const readme = screen.getByRole("treeitem", { name: "README.md" });
    await userEvent.click(readme);
    expect(onValueChange).toHaveBeenCalledWith("readme");
    expect(readme).toHaveAttribute("aria-selected", "true");
  });

  it("fires onExpandedChange with the new expanded set", async () => {
    const onExpandedChange = vi.fn();
    render(<TreeView data={DATA} onExpandedChange={onExpandedChange} />);
    await userEvent.click(screen.getByRole("treeitem", { name: /src/ }));
    expect(onExpandedChange).toHaveBeenCalledWith(["src"]);
  });

  it("uses a single roving tab stop on the first item", () => {
    render(<TreeView data={DATA} defaultExpandedIds={["src"]} />);
    expect(screen.getByRole("treeitem", { name: /src/ })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("treeitem", { name: "index.ts" })).toHaveAttribute("tabindex", "-1");
  });

  it("expands a collapsed branch with ArrowRight (keyboard)", async () => {
    render(<TreeView data={DATA} />);
    const src = screen.getByRole("treeitem", { name: /src/ });
    src.focus();
    expect(src).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard("{ArrowRight}");
    expect(src).toHaveAttribute("aria-expanded", "true");
  });

  it("moves focus down with ArrowDown and collapses to parent with ArrowLeft", async () => {
    render(<TreeView data={DATA} defaultExpandedIds={["src"]} />);
    const src = screen.getByRole("treeitem", { name: /src/ });
    src.focus();
    await userEvent.keyboard("{ArrowDown}");
    const index = screen.getByRole("treeitem", { name: "index.ts" });
    expect(index).toHaveFocus();
    // ArrowLeft on a leaf moves focus back to the parent branch.
    await userEvent.keyboard("{ArrowLeft}");
    expect(src).toHaveFocus();
    // ArrowLeft again collapses the now-focused open branch.
    await userEvent.keyboard("{ArrowLeft}");
    expect(src).toHaveAttribute("aria-expanded", "false");
  });

  it("selects the focused node with Enter", async () => {
    const onValueChange = vi.fn();
    render(<TreeView data={DATA} onValueChange={onValueChange} />);
    const readme = screen.getByRole("treeitem", { name: "README.md" });
    readme.focus();
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("readme");
    expect(readme).toHaveAttribute("aria-selected", "true");
  });

  it("does not select a disabled node", async () => {
    const onValueChange = vi.fn();
    const data: TreeNode[] = [{ id: "locked", label: "locked", disabled: true }];
    render(<TreeView data={data} onValueChange={onValueChange} />);
    const locked = screen.getByRole("treeitem", { name: "locked" });
    expect(locked).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(locked);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("has no axe violations when expanded", async () => {
    const { container } = render(
      <TreeView data={DATA} defaultExpandedIds={["src", "components"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
