import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CodeBlock } from "./code-block.js";

describe("CodeBlock", () => {
  beforeEach(() => {
    // CodeBlock embeds a CopyButton which reaches for the Clipboard API.
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it("renders the source and a copy control", () => {
    render(<CodeBlock code="const x = 1;" language="ts" />);
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("names the scroll region with the filename and labels the language", () => {
    render(<CodeBlock code="print('hi')" language="python" filename="app.py" />);
    expect(screen.getByRole("region", { name: "Code block, app.py" })).toBeInTheDocument();
    expect(screen.getByText("python")).toBeInTheDocument();
    expect(screen.getByText("app.py")).toBeInTheDocument();
  });

  it("renders a line-number gutter when requested", () => {
    const { container } = render(<CodeBlock code={"a\nb\nc"} showLineNumbers />);
    expect(container.querySelectorAll('[data-slot="code-block-line"]')).toHaveLength(3);
  });

  it("has no axe violations", async () => {
    const { container } = render(<CodeBlock code="const x = 1;" language="ts" filename="x.ts" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
