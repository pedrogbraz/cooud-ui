import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Sparkline } from "./sparkline.js";

const DATA = [4, 8, 2, 10, 6, 12, 5];

describe("Sparkline", () => {
  it("renders a line path for the default type", () => {
    const { container } = render(<Sparkline data={DATA} />);
    const line = container.querySelector('[data-slot="sparkline-line"]');
    expect(line).toBeInTheDocument();
    // One M command + (n-1) L commands for n points.
    const d = line?.getAttribute("d") ?? "";
    expect((d.match(/[ML]/g) ?? []).length).toBe(DATA.length);
    expect(container.querySelector('[data-slot="sparkline-area"]')).not.toBeInTheDocument();
  });

  it("renders one bar per data point for type='bar'", () => {
    const { container } = render(<Sparkline data={DATA} type="bar" />);
    const bars = container.querySelectorAll('[data-slot="sparkline-bar"]');
    expect(bars).toHaveLength(DATA.length);
    expect(container.querySelector('[data-slot="sparkline-line"]')).not.toBeInTheDocument();
  });

  it("renders an area fill when area is set", () => {
    const { container } = render(<Sparkline data={DATA} area />);
    const areaPath = container.querySelector('[data-slot="sparkline-area"]');
    expect(areaPath).toBeInTheDocument();
    // The fill references the in-SVG gradient, keeping it token-driven.
    expect(areaPath?.getAttribute("fill")).toMatch(/^url\(#/);
    // Line is still drawn on top of the fill.
    expect(container.querySelector('[data-slot="sparkline-line"]')).toBeInTheDocument();
  });

  it("exposes role=img with a default aria-label and a matching title", () => {
    render(<Sparkline data={DATA} />);
    const img = screen.getByRole("img", { name: `Trend, ${DATA.length} points` });
    expect(img.tagName.toLowerCase()).toBe("svg");
    // role="img" collapses the subtree to a single node; the <title> mirrors
    // the accessible name for SVG renderers that prefer it.
    expect(img.querySelector("title")?.textContent).toBe(`Trend, ${DATA.length} points`);
  });

  it("honors a custom aria-label", () => {
    render(<Sparkline data={DATA} aria-label="Revenue last 7 days" />);
    expect(screen.getByRole("img", { name: "Revenue last 7 days" })).toBeInTheDocument();
  });

  it("uses the singular label for a single point", () => {
    render(<Sparkline data={[42]} />);
    expect(screen.getByRole("img", { name: "Trend, 1 point" })).toBeInTheDocument();
  });

  it("draws a flat midline when all values are equal (min === max)", () => {
    const { container } = render(<Sparkline data={[5, 5, 5, 5]} height={28} />);
    const d = container.querySelector('[data-slot="sparkline-line"]')?.getAttribute("d") ?? "";
    // Every Y coordinate collapses to the vertical midpoint (height / 2 = 14).
    const ys = [...d.matchAll(/[ML]\s[\d.]+\s([\d.]+)/g)].map((m) => Number(m[1]));
    expect(ys.length).toBeGreaterThan(0);
    for (const y of ys) {
      expect(y).toBeCloseTo(14, 5);
    }
  });

  it("renders a single-point line gracefully as a horizontal stub", () => {
    const { container } = render(<Sparkline data={[7]} />);
    const line = container.querySelector('[data-slot="sparkline-line"]');
    expect(line).toBeInTheDocument();
    // A move + a line: a horizontal segment, not an empty path.
    expect(line?.getAttribute("d")).toMatch(/^M .+ L /);
  });

  it("renders an empty series without drawing line, area, or bars", () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(screen.getByRole("img", { name: "Trend, 0 points" })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sparkline-line"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="sparkline-area"]')).not.toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="sparkline-bar"]')).toHaveLength(0);
  });

  it("ignores non-finite values in the series", () => {
    const { container } = render(<Sparkline data={[1, Number.NaN, 3, Number.POSITIVE_INFINITY]} />);
    // NaN/Infinity are dropped → 2 valid points → label reflects the count.
    expect(screen.getByRole("img", { name: "Trend, 2 points" })).toBeInTheDocument();
    const d = container.querySelector('[data-slot="sparkline-line"]')?.getAttribute("d") ?? "";
    expect(d).not.toMatch(/NaN|Infinity/);
  });

  it("applies the tone class for color", () => {
    const { container } = render(<Sparkline data={DATA} tone="success" />);
    const svg = container.querySelector('[data-slot="sparkline"]');
    expect(svg).toHaveClass("text-success");
    expect(svg).toHaveAttribute("data-tone", "success");
  });

  it("defaults to the primary tone", () => {
    const { container } = render(<Sparkline data={DATA} />);
    expect(container.querySelector('[data-slot="sparkline"]')).toHaveClass("text-primary");
  });

  it("respects width, height, and viewBox", () => {
    const { container } = render(<Sparkline data={DATA} width={120} height={40} />);
    const svg = container.querySelector('[data-slot="sparkline"]');
    expect(svg).toHaveAttribute("width", "120");
    expect(svg).toHaveAttribute("height", "40");
    expect(svg).toHaveAttribute("viewBox", "0 0 120 40");
  });

  it("forwards a ref to the svg element", () => {
    let node: SVGSVGElement | null = null;
    render(
      <Sparkline
        data={DATA}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(SVGSVGElement);
  });

  it("has no axe violations (line)", async () => {
    const { container } = render(<Sparkline data={DATA} aria-label="Weekly revenue trend" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (bar)", async () => {
    const { container } = render(
      <Sparkline data={DATA} type="bar" tone="info" aria-label="Daily active users" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (area)", async () => {
    const { container } = render(
      <Sparkline data={DATA} area tone="success" aria-label="Usage this month" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
