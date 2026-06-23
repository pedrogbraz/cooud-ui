import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

function Basic({ defaultValue = "account" }: { defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account panel</TabsContent>
      <TabsContent value="billing">Billing panel</TabsContent>
      <TabsContent value="team">Team panel</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("exposes a tablist with one tab per trigger", () => {
    render(<Basic />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("shows only the active tabpanel", () => {
    render(<Basic />);
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Account panel")).toBeVisible();
    // Inactive panels are unmounted/hidden by Radix, so they are not queryable as visible text.
    expect(screen.queryByText("Billing panel")).not.toBeInTheDocument();
  });

  it("switches panels when another tab is clicked", async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Billing panel")).toBeVisible();
    expect(screen.queryByText("Account panel")).not.toBeInTheDocument();
  });

  it("moves selection with the arrow keys (roving focus)", async () => {
    render(<Basic />);
    const account = screen.getByRole("tab", { name: "Account" });
    account.focus();
    await userEvent.keyboard("{ArrowRight}");
    const billing = screen.getByRole("tab", { name: "Billing" });
    expect(billing).toHaveFocus();
    expect(billing).toHaveAttribute("aria-selected", "true");
  });

  it("keeps only the active tab in the tab order once focus enters (roving tabindex)", async () => {
    render(<Basic />);
    // Radix wires roving tabindex on focus: tab into the list, then the active
    // tab becomes the single tab-stop and inactive tabs drop out of the order.
    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tab", { name: "Team" })).toHaveAttribute("tabindex", "-1");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Basic />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
