import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Empty, EmptyContent, EmptyDescription, EmptyIcon, EmptyTitle } from "./empty.js";

describe("Empty", () => {
  it("renders its composed empty-state content", () => {
    render(
      <Empty>
        <EmptyIcon>
          <svg aria-hidden="true" viewBox="0 0 24 24" />
        </EmptyIcon>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>Try a different search.</EmptyDescription>
        <EmptyContent>
          <button type="button">Reset</button>
        </EmptyContent>
      </Empty>,
    );
    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.getByText("Try a different search.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Empty>
        <EmptyTitle>Empty</EmptyTitle>
        <EmptyDescription>Nothing here yet.</EmptyDescription>
      </Empty>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
