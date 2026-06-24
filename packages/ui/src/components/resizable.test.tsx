import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable.js";

function Basic({
  direction = "horizontal" as "horizontal" | "vertical",
  withHandle = false,
}: {
  direction?: "horizontal" | "vertical";
  withHandle?: boolean;
}) {
  return (
    <ResizablePanelGroup direction={direction}>
      <ResizablePanel defaultSize={50}>One</ResizablePanel>
      <ResizableHandle withHandle={withHandle} />
      <ResizablePanel defaultSize={50}>Two</ResizablePanel>
    </ResizablePanelGroup>
  );
}

describe("Resizable", () => {
  it("renders the panel group with both panels", () => {
    const { container } = render(<Basic />);
    expect(container.querySelector('[data-slot="resizable-panel-group"]')).toBeInTheDocument();
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("renders a focusable separator handle between panels", () => {
    render(<Basic />);
    // react-resizable-panels exposes the handle as role="separator".
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("data-slot", "resizable-handle");
    expect(handle).toHaveAttribute("tabindex", "0");
  });

  it("propagates the group direction to the group for axis-aware styling", () => {
    const { container } = render(<Basic direction="vertical" />);
    const group = container.querySelector('[data-slot="resizable-panel-group"]');
    expect(group).toHaveAttribute("data-panel-group-direction", "vertical");
  });

  it("renders the grip affordance only when withHandle is set", () => {
    const { container, rerender } = render(<Basic withHandle={false} />);
    expect(container.querySelector('[data-slot="resizable-handle-grip"]')).toBeNull();
    rerender(<Basic withHandle />);
    expect(container.querySelector('[data-slot="resizable-handle-grip"]')).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Basic withHandle />);
    // The handle gets role="separator" + tabindex from react-resizable-panels,
    // but its aria-valuenow is only populated once the group measures a real
    // layout — which jsdom never does — so "aria-required-attr" is an
    // environment artifact of the isolated mount, not a defect in the wrapper.
    expect(
      await axe(container, { rules: { "aria-required-attr": { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
