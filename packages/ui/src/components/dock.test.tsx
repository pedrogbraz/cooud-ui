import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Dock } from "./dock.js";

const Home = () => <svg data-testid="home" />;
const Search = () => <svg data-testid="search" />;
const Settings = () => <svg data-testid="settings" />;

describe("Dock", () => {
  it("renders one item per entry, each named by its label", () => {
    render(
      <Dock
        items={[
          { icon: <Home />, label: "Home" },
          { icon: <Search />, label: "Search" },
          { icon: <Settings />, label: "Settings" },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
  });

  it("fires onClick for a button item", async () => {
    const onClick = vi.fn();
    render(<Dock items={[{ icon: <Home />, label: "Home", onClick }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an item with href as a link", () => {
    render(<Dock items={[{ icon: <Home />, label: "Docs", href: "/docs" }]} />);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/docs");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Dock
        items={[
          { icon: <Home />, label: "Home" },
          { icon: <Search />, label: "Search", href: "/search" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
