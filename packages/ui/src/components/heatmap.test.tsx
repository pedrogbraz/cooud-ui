import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { getHeatmapLevel, Heatmap, type HeatmapDay } from "./heatmap.js";

const sample: HeatmapDay[] = [
  { date: "2026-06-01", value: 0 },
  { date: "2026-06-02", value: 2 },
  { date: "2026-06-03", value: 5 },
  { date: "2026-06-04", value: 8 },
  { date: "2026-06-05", value: 10 },
];

describe("Heatmap", () => {
  it("renders one cell per data item", () => {
    render(<Heatmap data={sample} />);
    const cells = document.querySelectorAll('[data-slot="heatmap-day"]');
    expect(cells).toHaveLength(sample.length);
  });

  it("renders the cell tooltip from value and date", () => {
    render(<Heatmap data={[{ date: "2026-06-02", value: 2 }]} />);
    const cell = document.querySelector('[data-slot="heatmap-day"]');
    expect(cell).toHaveAttribute("title", "2 on 2026-06-02");
  });

  it("exposes the aria-label on the graph", () => {
    render(<Heatmap data={sample} aria-label="Commits" />);
    expect(screen.getByRole("img", { name: "Commits" })).toBeInTheDocument();
  });

  it("renders a legend with five swatches", () => {
    render(<Heatmap data={sample} />);
    const swatches = document.querySelectorAll('[data-slot="heatmap-legend-swatch"]');
    expect(swatches).toHaveLength(5);
  });

  describe("getHeatmapLevel", () => {
    it("returns 0 for a zero value", () => {
      expect(getHeatmapLevel(0, 10, 5)).toBe(0);
    });

    it("returns 0 for a non-positive max", () => {
      expect(getHeatmapLevel(5, 0, 5)).toBe(0);
    });

    it("returns the top level when value equals max", () => {
      expect(getHeatmapLevel(10, 10, 5)).toBe(4);
    });

    it("buckets intermediate values between 1 and the top level", () => {
      const level = getHeatmapLevel(5, 10, 5);
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThan(4);
    });

    it("keeps the smallest positive value at level 1", () => {
      expect(getHeatmapLevel(1, 100, 5)).toBe(1);
    });
  });

  it("has no axe violations", async () => {
    const { container } = render(<Heatmap data={sample} aria-label="Activity" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
