import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AnimatedNumber } from "./animated-number.js";

describe("AnimatedNumber", () => {
  it("renders the formatted value on first paint", () => {
    const { container } = render(<AnimatedNumber value={1234} locale="en-US" data-testid="num" />);
    expect(container.querySelector('[data-slot="animated-number"]')).toHaveTextContent("1,234");
  });

  it("uses a custom format function when provided", () => {
    const { container } = render(
      <AnimatedNumber value={42} format={(n) => `R$ ${n.toFixed(2)}`} />,
    );
    expect(container.querySelector('[data-slot="animated-number"]')).toHaveTextContent("R$ 42.00");
  });

  it("still renders a value with reducedMotion='never'", () => {
    const { container } = render(
      <AnimatedNumber value={999} locale="en-US" reducedMotion="never" />,
    );
    // The component must not blank out / show 0 when forced to always animate.
    expect(container.querySelector('[data-slot="animated-number"]')).toHaveTextContent("999");
  });

  it("sanitizes a NaN value to a real number (never the literal 'NaN') and does not crash", () => {
    const { container } = render(
      <AnimatedNumber value={Number.NaN} locale="en-US" reducedMotion="always" />,
    );
    const node = container.querySelector('[data-slot="animated-number"]');
    expect(node).toBeInTheDocument();
    expect(node?.textContent).not.toContain("NaN");
    // Non-finite is sanitized to 0 per the component contract.
    expect(node).toHaveTextContent("0");
  });

  it("sanitizes Infinity to a finite number (never '∞') and does not crash", () => {
    const { container } = render(
      <AnimatedNumber value={Number.POSITIVE_INFINITY} locale="en-US" reducedMotion="always" />,
    );
    const node = container.querySelector('[data-slot="animated-number"]');
    expect(node).toBeInTheDocument();
    expect(node?.textContent).not.toContain("∞");
    expect(node).toHaveTextContent("0");
  });

  it("keeps a live status region and writes the settled value to it when announce is set", () => {
    // The per-frame writer targets the inner value span, so the aria-live status
    // region survives in the committed DOM and carries the settled value for
    // screen readers (regression guard for the announce sibling being stripped).
    const { container } = render(
      <AnimatedNumber value={10} announce reducedMotion="always" locale="en-US" />,
    );
    const node = container.querySelector('[data-slot="animated-number"]');
    expect(node).toHaveTextContent("10");
    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent("10");
  });

  it("updates the displayed text when value changes (reduced motion snaps)", () => {
    const { container, rerender } = render(
      <AnimatedNumber value={100} locale="en-US" reducedMotion="always" />,
    );
    const node = container.querySelector('[data-slot="animated-number"]');
    expect(node).toHaveTextContent("100");
    rerender(<AnimatedNumber value={250} locale="en-US" reducedMotion="always" />);
    expect(node).toHaveTextContent("250");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AnimatedNumber value={1000} locale="en-US" announce reducedMotion="always" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
