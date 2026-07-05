import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SplitButton, type SplitButtonItem } from "./split-button.js";

const items: SplitButtonItem[] = [
  { id: "duplicate", label: "Duplicate", onSelect: () => {} },
  { id: "delete", label: "Delete", destructive: true, onSelect: () => {} },
];

describe("SplitButton", () => {
  it("renders the primary label and a labelled menu trigger", () => {
    render(
      <SplitButton onClick={() => {}} items={items}>
        Save
      </SplitButton>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More actions" })).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("fires the primary onClick without opening the menu", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <SplitButton onClick={onClick} items={items}>
        Save
      </SplitButton>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens the menu from the trigger and runs a secondary action", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <SplitButton onClick={() => {}} items={[{ id: "duplicate", label: "Duplicate", onSelect }]}>
        Save
      </SplitButton>,
    );
    await user.click(screen.getByRole("button", { name: "More actions" }));
    const menu = await screen.findByRole("menu");
    await user.click(within(menu).getByRole("menuitem", { name: "Duplicate" }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("disables both segments while loading", () => {
    render(
      <SplitButton loading items={items}>
        Save
      </SplitButton>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "More actions" })).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SplitButton onClick={() => {}} items={items}>
        Save
      </SplitButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
