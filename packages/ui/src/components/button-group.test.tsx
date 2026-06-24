import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./button.js";
import { ButtonGroup } from "./button-group.js";

describe("ButtonGroup", () => {
  it("renders its Button children", () => {
    render(
      <ButtonGroup aria-label="Pagination">
        <Button>Prev</Button>
        <Button>Next</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "Prev" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("exposes a group role and defaults to horizontal orientation", () => {
    render(
      <ButtonGroup aria-label="Toolbar">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group", { name: "Toolbar" });
    expect(group).toHaveAttribute("data-slot", "button-group");
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(group).toHaveClass("flex-row");
  });

  it("applies the vertical classes when orientation is vertical", () => {
    render(
      <ButtonGroup orientation="vertical" aria-label="Stacked">
        <Button>Top</Button>
        <Button>Bottom</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group", { name: "Stacked" });
    expect(group).toHaveAttribute("data-orientation", "vertical");
    expect(group).toHaveClass("flex-col");
    expect(group.className).toContain("[&>*:not(:first-child)]:-mt-px");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ButtonGroup aria-label="Actions">
        <Button>Save</Button>
        <Button>Cancel</Button>
      </ButtonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
