import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ScrollProgress } from "./scroll-progress.js";

describe("ScrollProgress", () => {
  it("renders a progressbar with an initial aria-valuenow", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("progressbar", { name: "Scroll progress" });
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("updates aria-valuenow as the target scrolls", () => {
    const target = createRef<HTMLDivElement>();
    render(
      <>
        <ScrollProgress target={target} />
        <div ref={target} />
      </>,
    );

    const el = target.current as HTMLDivElement;
    // jsdom does not lay out, so drive the scroll metrics directly.
    Object.defineProperty(el, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(el, "clientHeight", { configurable: true, value: 200 });
    el.scrollTop = 400;

    fireEvent.scroll(el);

    const bar = screen.getByRole("progressbar");
    // 400 / (1000 - 200) = 0.5 → 50.
    expect(bar).toHaveAttribute("aria-valuenow", "50");
  });

  it("renders an svg in the circle variant", () => {
    const { container } = render(<ScrollProgress variant="circle" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("honors a custom aria-label", () => {
    render(<ScrollProgress aria-label="Reading progress" />);
    expect(screen.getByRole("progressbar", { name: "Reading progress" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ScrollProgress aria-label="Reading progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
