import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { JsonViewer } from "./json-viewer.js";

const payload = {
  name: "Ada",
  age: 36,
  active: true,
  nickname: null,
  tags: ["math", "pioneer"],
  address: { city: "London" },
};

describe("JsonViewer", () => {
  it("colors primitive values and keys with semantic tokens", () => {
    render(<JsonViewer data={payload} defaultExpandedDepth={Number.POSITIVE_INFINITY} />);

    expect(screen.getByText('"Ada"')).toHaveClass("text-success");
    expect(screen.getByText("36")).toHaveClass("text-info", "tabular-nums");
    expect(screen.getByText("true")).toHaveClass("text-warning");
    expect(screen.getByText("null")).toHaveClass("text-fg-muted");
    expect(screen.getByText('"name"')).toHaveClass("text-fg-secondary");
  });

  it("collapses branches beyond defaultExpandedDepth and shows a child-count summary", () => {
    render(<JsonViewer data={payload} defaultExpandedDepth={1} />);

    // Depth-1 branches start collapsed: children unmounted, summary visible.
    expect(screen.queryByText('"math"')).not.toBeInTheDocument();
    expect(screen.queryByText('"London"')).not.toBeInTheDocument();
    expect(screen.getByText(/2 items/)).toBeInTheDocument();
    expect(screen.getByText(/1 key/)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Toggle root" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Toggle tags" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands and collapses via the chevron button with mouse and keyboard", async () => {
    const user = userEvent.setup();
    render(<JsonViewer data={payload} defaultExpandedDepth={1} />);

    const toggle = screen.getByRole("button", { name: "Toggle tags" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText('"math"')).toBeInTheDocument();

    // The chevron is a native button, so Enter toggles it back closed.
    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText('"math"')).not.toBeInTheDocument();
  });

  it("copies raw strings for string leaves and pretty JSON for branches", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    // `userEvent.setup()` installs its own getter-only clipboard stub on the
    // shared jsdom navigator, so replace it afterwards via defineProperty.
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<JsonViewer data={payload} defaultExpandedDepth={Number.POSITIVE_INFINITY} />);

    await user.click(screen.getByRole("button", { name: "Copy value of name" }));
    expect(writeText).toHaveBeenCalledWith("Ada");

    await user.click(screen.getByRole("button", { name: "Copy value of address" }));
    expect(writeText).toHaveBeenCalledWith(JSON.stringify({ city: "London" }, null, 2));
  });

  it("renders circular references as a muted token instead of recursing", () => {
    const cyclic: Record<string, unknown> = { id: 1 };
    cyclic.self = cyclic;
    render(<JsonViewer data={cyclic} defaultExpandedDepth={Number.POSITIVE_INFINITY} />);

    expect(screen.getByText("[Circular]")).toHaveClass("text-fg-muted");
  });

  it("renders empty containers as a single leaf row without a chevron", () => {
    render(<JsonViewer data={{ empty: {}, none: [] }} defaultExpandedDepth={1} />);

    expect(screen.getByText("{}")).toBeInTheDocument();
    expect(screen.getByText("[]")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Toggle empty" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Toggle none" })).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    const { container } = render(
      <JsonViewer
        aria-label="Order payload"
        data={payload}
        defaultExpandedDepth={Number.POSITIVE_INFINITY}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
