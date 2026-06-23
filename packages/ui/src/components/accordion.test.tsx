import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion.js";

function Basic({
  type = "single" as "single" | "multiple",
  collapsible = true,
}: {
  type?: "single" | "multiple";
  collapsible?: boolean;
}) {
  return (
    // biome-ignore lint/suspicious/noExplicitAny: the union of single/multiple props is awkward to type for a test harness.
    <Accordion type={type as any} collapsible={collapsible}>
      <AccordionItem value="a">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Ships in 2 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>30 day returns.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("renders each trigger as a collapsed button", () => {
    render(<Basic />);
    const triggers = screen.getAllByRole("button");
    expect(triggers).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands a panel on click and toggles aria-expanded", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Shipping" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Ships in 2 days.")).toBeVisible();
  });

  it("collapses an open panel when clicked again (collapsible single)", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Shipping" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("only keeps one panel open at a time in single mode", async () => {
    render(<Basic />);
    const shipping = screen.getByRole("button", { name: "Shipping" });
    const returns = screen.getByRole("button", { name: "Returns" });
    await userEvent.click(shipping);
    await userEvent.click(returns);
    expect(shipping).toHaveAttribute("aria-expanded", "false");
    expect(returns).toHaveAttribute("aria-expanded", "true");
  });

  it("allows several panels open at once in multiple mode", async () => {
    render(<Basic type="multiple" />);
    const shipping = screen.getByRole("button", { name: "Shipping" });
    const returns = screen.getByRole("button", { name: "Returns" });
    await userEvent.click(shipping);
    await userEvent.click(returns);
    expect(shipping).toHaveAttribute("aria-expanded", "true");
    expect(returns).toHaveAttribute("aria-expanded", "true");
  });

  it("has no axe violations when expanded", async () => {
    const { container } = render(<Basic />);
    await userEvent.click(screen.getByRole("button", { name: "Shipping" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
