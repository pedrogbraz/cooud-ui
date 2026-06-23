import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ScrollArea } from "./scroll-area.js";

describe("ScrollArea", () => {
  it("renders its children inside the viewport", () => {
    render(
      <ScrollArea className="h-32">
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });

  it("tags the root with its data-slot", () => {
    const { container } = render(
      <ScrollArea>
        <div>x</div>
      </ScrollArea>,
    );
    expect(container.querySelector('[data-slot="scroll-area"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ScrollArea className="h-32">
        <p>content</p>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
