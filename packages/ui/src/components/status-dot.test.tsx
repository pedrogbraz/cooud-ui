import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { StatusDot } from "./status-dot.js";

/** The visual dot element (the root is the `role="status"` live region). */
function indicator(container: HTMLElement): HTMLElement {
  const dot = container.querySelector<HTMLElement>('[data-slot="status-dot-indicator"]');
  if (!dot) throw new Error("status-dot indicator not found");
  return dot;
}

/** The visually-hidden live-region text rendered in dot-only mode. */
function srLabel(container: HTMLElement): HTMLElement {
  const el = container.querySelector<HTMLElement>('[data-slot="status-dot-sr-label"]');
  if (!el) throw new Error("status-dot sr-only label not found");
  return el;
}

describe("StatusDot", () => {
  it("renders a status region with sr-only text for the default status", () => {
    const { container } = render(<StatusDot />);
    const region = screen.getByRole("status");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("data-slot", "status-dot");
    expect(region).toHaveAttribute("data-status", "online");
    expect(region).not.toHaveAttribute("aria-label");
    expect(indicator(container)).toHaveAttribute("aria-hidden", "true");
    expect(srLabel(container)).toHaveClass("sr-only");
    expect(srLabel(container)).toHaveTextContent("Online");
  });

  it("derives the default sr-only text from `status`", () => {
    const { container } = render(<StatusDot status="away" />);
    expect(srLabel(container)).toHaveTextContent("Away");
  });

  it("uses `label` as the sr-only live-region text when there is no visible label", () => {
    const { container } = render(<StatusDot status="busy" label="Do not disturb" />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("data-status", "busy");
    expect(srLabel(container)).toHaveTextContent("Do not disturb");
    expect(srLabel(container)).toHaveClass("sr-only");
  });

  it("announces status changes by updating the live-region text", () => {
    const { container, rerender } = render(<StatusDot status="online" />);
    expect(srLabel(container)).toHaveTextContent("Online");

    rerender(<StatusDot status="busy" />);
    expect(srLabel(container)).toHaveTextContent("Busy");
    expect(screen.getByRole("status")).toHaveAttribute("data-status", "busy");

    // A custom `label` swap announces too — the text IS the region content.
    rerender(<StatusDot status="busy" label="In a meeting" />);
    expect(srLabel(container)).toHaveTextContent("In a meeting");
  });

  it("keeps an explicit aria-label as the accessible-name override", () => {
    render(<StatusDot status="online" label="Online" aria-label="Ada is online" />);
    expect(screen.getByRole("status", { name: "Ada is online" })).toBeInTheDocument();
  });

  it("applies the semantic fill for each status", () => {
    const fills = [
      ["online", "bg-success"],
      ["busy", "bg-error"],
      ["away", "bg-warning"],
      ["success", "bg-success"],
      ["warning", "bg-warning"],
      ["error", "bg-error"],
      ["info", "bg-info"],
      ["neutral", "bg-fg-muted"],
    ] as const;
    for (const [status, fill] of fills) {
      const { container, unmount } = render(<StatusDot status={status} />);
      expect(indicator(container)).toHaveClass(fill);
      unmount();
    }
  });

  it("renders offline as a hollow outline instead of a fill", () => {
    const { container } = render(<StatusDot status="offline" />);
    const dot = indicator(container);
    expect(dot).toHaveClass("border-fg-muted");
    expect(dot).toHaveClass("bg-transparent");
  });

  it("applies each size preset to the dot", () => {
    const sizes = [
      ["xs", "size-1.5"],
      ["sm", "size-2"],
      ["md", "size-2.5"],
      ["lg", "size-3"],
    ] as const;
    for (const [size, sizeClass] of sizes) {
      const { container, unmount } = render(<StatusDot size={size} />);
      expect(indicator(container)).toHaveClass(sizeClass);
      unmount();
    }
  });

  it("adds a surface-colored ring with `ring` and omits it by default", () => {
    const { container, unmount } = render(<StatusDot ring />);
    expect(indicator(container)).toHaveClass("ring-2", "ring-surface-base");
    unmount();

    const { container: plain } = render(<StatusDot />);
    expect(indicator(plain)).not.toHaveClass("ring-2");
  });

  it("renders a reduced-motion-safe ping halo only when `pulse` is set", () => {
    const { container, unmount } = render(<StatusDot pulse />);
    const ping = container.querySelector('[data-slot="status-dot-ping"]');
    expect(ping).toHaveClass("motion-safe:animate-ping", "bg-inherit");
    unmount();

    const { container: still } = render(<StatusDot />);
    expect(still.querySelector('[data-slot="status-dot-ping"]')).not.toBeInTheDocument();
  });

  it("draws a visible outline halo for pulse on the hollow offline dot", () => {
    const { container } = render(<StatusDot status="offline" pulse />);
    const ping = container.querySelector('[data-slot="status-dot-ping"]');
    // `bg-inherit` would inherit the offline dot's transparent fill and ping
    // invisibly — the outline halo keeps the animation perceivable.
    expect(ping).toHaveClass("motion-safe:animate-ping", "border-2", "border-fg-muted");
    expect(ping).not.toHaveClass("bg-inherit");
  });

  it("renders the visible label with `withLabel` and no duplicate sr-only text", () => {
    const { container } = render(<StatusDot status="online" withLabel />);
    const region = screen.getByRole("status");
    expect(region).not.toHaveAttribute("aria-label");
    const label = screen.getByText("Online");
    expect(label).toHaveAttribute("data-slot", "status-dot-label");
    expect(label).toHaveClass("text-fg-secondary");
    expect(container.querySelector('[data-slot="status-dot-sr-label"]')).not.toBeInTheDocument();
  });

  it("shows a custom `label` when visible", () => {
    render(<StatusDot status="busy" withLabel label="In a meeting" />);
    expect(screen.getByText("In a meeting")).toBeInTheDocument();
  });

  it("scales the visible label text and root gap with the size preset", () => {
    const cases = [
      ["xs", "text-xs", "gap-1"],
      ["sm", "text-xs", "gap-1.5"],
      ["md", "text-sm", "gap-1.5"],
      ["lg", "text-base", "gap-2"],
    ] as const;
    for (const [size, textClass, gapClass] of cases) {
      const { container, unmount } = render(<StatusDot size={size} withLabel />);
      const label = container.querySelector('[data-slot="status-dot-label"]');
      expect(label).toHaveClass(textClass);
      expect(container.querySelector('[data-slot="status-dot"]')).toHaveClass(gapClass);
      unmount();
    }
  });

  it("keeps aria-label as the accessible name while the `withLabel` text stays visible", () => {
    render(<StatusDot status="online" withLabel label="Online" aria-label="Ada is online" />);
    const region = screen.getByRole("status", { name: "Ada is online" });
    expect(region).toBeInTheDocument();
    expect(screen.getByText("Online")).toHaveAttribute("data-slot", "status-dot-label");
  });

  it("forwards its ref to the root span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<StatusDot ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toBe(screen.getByRole("status"));
  });

  it("passes arbitrary HTML attributes through to the root", () => {
    render(<StatusDot id="ada-presence" title="Presence" data-testid="presence-root" />);
    const region = screen.getByTestId("presence-root");
    expect(region).toBe(screen.getByRole("status"));
    expect(region).toHaveAttribute("id", "ada-presence");
    expect(region).toHaveAttribute("title", "Presence");
  });

  it("anchors to a corner via `position` and stays static by default", () => {
    const { unmount } = render(<StatusDot position="bottom-right" />);
    const region = screen.getByRole("status");
    expect(region).toHaveClass("absolute", "bottom-0", "end-0");
    unmount();

    render(<StatusDot position="top-right" aria-label="Top" />);
    expect(screen.getByRole("status", { name: "Top" })).toHaveClass("absolute", "top-0", "end-0");
  });

  it("does not position absolutely with the default `position`", () => {
    render(<StatusDot />);
    expect(screen.getByRole("status")).not.toHaveClass("absolute");
  });

  it("merges a custom className on the root", () => {
    render(<StatusDot className="mt-2" />);
    expect(screen.getByRole("status")).toHaveClass("mt-2");
  });

  it("has no axe violations (dot only)", async () => {
    const { container } = render(<StatusDot status="online" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (visible label + pulse)", async () => {
    const { container } = render(<StatusDot status="error" withLabel label="Live" pulse />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (overlaid on an avatar)", async () => {
    const { container } = render(
      <span className="relative inline-flex">
        <span aria-hidden="true" className="size-10 rounded-full bg-surface-overlay" />
        <StatusDot status="online" position="bottom-right" ring aria-label="Ada is online" />
      </span>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
