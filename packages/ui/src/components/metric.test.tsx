import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Metric, MetricDelta, MetricLabel, MetricValue } from "./metric.js";

describe("Metric", () => {
  it("renders its label, value and delta", () => {
    render(
      <Metric>
        <MetricLabel>Revenue</MetricLabel>
        <MetricValue>R$ 12.430</MetricValue>
        <MetricDelta trend="up">+12%</MetricDelta>
      </Metric>,
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("R$ 12.430")).toBeInTheDocument();
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("applies the down-trend styling on the delta", () => {
    render(<MetricDelta trend="down">-4%</MetricDelta>);
    expect(screen.getByText("-4%")).toHaveClass("text-error-strong");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Metric>
        <MetricLabel>Users</MetricLabel>
        <MetricValue>1.204</MetricValue>
        <MetricDelta trend="neutral">0%</MetricDelta>
      </Metric>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
