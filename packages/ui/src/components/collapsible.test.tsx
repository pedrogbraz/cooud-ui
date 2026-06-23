import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";

function Basic({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
      <CollapsibleContent>Hidden body copy.</CollapsibleContent>
    </Collapsible>
  );
}

describe("Collapsible", () => {
  it("starts collapsed with the trigger marked unexpanded", () => {
    render(<Basic />);
    expect(screen.getByRole("button", { name: "Toggle details" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("reveals content and flips aria-expanded on click", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Toggle details" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden body copy.")).toBeVisible();
  });

  it("hides content again on a second click", async () => {
    render(<Basic defaultOpen />);
    const trigger = screen.getByRole("button", { name: "Toggle details" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("respects defaultOpen by rendering the content visible", () => {
    render(<Basic defaultOpen />);
    expect(screen.getByText("Hidden body copy.")).toBeVisible();
  });

  it("has no axe violations when open", async () => {
    const { container } = render(<Basic defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
