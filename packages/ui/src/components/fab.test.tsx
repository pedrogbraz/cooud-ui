import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Fab } from "./fab.js";

const Plus = () => <svg data-testid="plus" />;
const Pencil = () => <svg data-testid="pencil" />;
const Share = () => <svg data-testid="share" />;

describe("Fab", () => {
  it("renders the main button with the right accessible name", () => {
    render(<Fab icon={<Plus />} label="Create" />);
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("fires onClick when activated without actions", async () => {
    const onClick = vi.fn();
    render(<Fab icon={<Plus />} label="Create" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("starts collapsed when given actions", () => {
    render(
      <Fab
        icon={<Plus />}
        label="Actions"
        actions={[
          { icon: <Pencil />, label: "Edit" },
          { icon: <Share />, label: "Share" },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Share" })).not.toBeInTheDocument();
  });

  it("expands the speed-dial on click and reveals the actions", async () => {
    render(
      <Fab
        icon={<Plus />}
        label="Actions"
        actions={[
          { icon: <Pencil />, label: "Edit" },
          { icon: <Share />, label: "Share" },
        ]}
      />,
    );
    const main = screen.getByRole("button", { name: "Actions" });
    await userEvent.click(main);
    expect(main).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("invokes an action's onClick when activated", async () => {
    const onEdit = vi.fn();
    render(
      <Fab
        icon={<Plus />}
        label="Actions"
        actions={[{ icon: <Pencil />, label: "Edit", onClick: onEdit }]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Fab icon={<Plus />} label="Create" actions={[{ icon: <Pencil />, label: "Edit" }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
