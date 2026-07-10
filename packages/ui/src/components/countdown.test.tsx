import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Countdown } from "./countdown.js";

/** The four visible digit cells, in DOM (days → seconds) order. */
function digits(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('[data-slot="countdown-value"]')).map(
    (node) => node.textContent ?? "",
  );
}

// A fixed "now" so every remaining-time assertion is deterministic.
const NOW = new Date("2026-07-08T12:00:00.000Z");

function inMs(ms: number): Date {
  return new Date(NOW.getTime() + ms);
}

describe("Countdown", () => {
  describe("with a controlled clock", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(NOW);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("renders the split remaining time after mount", () => {
      // 1 day, 2 hours, 3 minutes, 4 seconds from "now".
      const { container } = render(<Countdown target={inMs((86_400 + 7_200 + 180 + 4) * 1_000)} />);
      expect(digits(container)).toEqual(["01", "02", "03", "04"]);
    });

    it("accepts an epoch-ms number and an ISO string target", () => {
      const { container, unmount } = render(<Countdown target={NOW.getTime() + 5_000} />);
      expect(digits(container)).toEqual(["00", "00", "00", "05"]);
      unmount();

      const iso = render(<Countdown target={inMs(65_000).toISOString()} />);
      expect(digits(iso.container)).toEqual(["00", "00", "01", "05"]);
    });

    it("ticks once per second, re-deriving from the clock", () => {
      const { container } = render(<Countdown target={inMs(3_000)} />);
      expect(digits(container)).toEqual(["00", "00", "00", "03"]);
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(digits(container)).toEqual(["00", "00", "00", "02"]);
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(digits(container)).toEqual(["00", "00", "00", "01"]);
    });

    it("stops at zero and fires onComplete exactly once", () => {
      const onComplete = vi.fn();
      const { container } = render(<Countdown target={inMs(2_000)} onComplete={onComplete} />);
      act(() => {
        vi.advanceTimersByTime(2_000);
      });
      expect(digits(container)).toEqual(["00", "00", "00", "00"]);
      expect(onComplete).toHaveBeenCalledTimes(1);
      // No further scheduling: nothing changes and onComplete never re-fires.
      act(() => {
        vi.advanceTimersByTime(10_000);
      });
      expect(digits(container)).toEqual(["00", "00", "00", "00"]);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("completes immediately (once) when the target is already in the past", () => {
      const onComplete = vi.fn();
      const { container } = render(<Countdown target={inMs(-5_000)} onComplete={onComplete} />);
      expect(digits(container)).toEqual(["00", "00", "00", "00"]);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("re-arms when the target moves back into the future", () => {
      const onComplete = vi.fn();
      const { container, rerender } = render(
        <Countdown target={inMs(1_000)} onComplete={onComplete} />,
      );
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(onComplete).toHaveBeenCalledTimes(1);

      // Deadline extended: the timer restarts and can complete again.
      rerender(<Countdown target={inMs(3_000)} onComplete={onComplete} />);
      expect(digits(container)).toEqual(["00", "00", "00", "02"]);
      act(() => {
        vi.advanceTimersByTime(2_000);
      });
      expect(onComplete).toHaveBeenCalledTimes(2);
    });

    it("keeps the placeholder and never completes for an unparsable target", () => {
      const onComplete = vi.fn();
      const { container } = render(<Countdown target="not a date" onComplete={onComplete} />);
      expect(digits(container)).toEqual(["--", "--", "--", "--"]);
      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      expect(digits(container)).toEqual(["--", "--", "--", "--"]);
      expect(onComplete).not.toHaveBeenCalled();
    });

    it("merges custom labels over the defaults and uses them in the summary", () => {
      render(<Countdown target={inMs(60_000)} labels={{ days: "dias", seconds: "seg" }} />);
      expect(screen.getByText("dias")).toBeInTheDocument();
      expect(screen.getByText("seg")).toBeInTheDocument();
      // Unspecified units keep their defaults.
      expect(screen.getByText("hours")).toBeInTheDocument();
      expect(screen.getByText("min")).toBeInTheDocument();
      expect(screen.getByRole("timer")).toHaveTextContent("0 dias, 0 hours, 1 min, 0 seg");
    });

    it("uses the timer role without live announcements, and hides the ticking tiles from AT", () => {
      const { container } = render(<Countdown target={inMs(90_000)} aria-label="Sale ends in" />);
      const root = screen.getByRole("timer");
      expect(root).toHaveAttribute("aria-live", "off");
      expect(root).toHaveAccessibleName("Sale ends in");
      for (const tile of container.querySelectorAll('[data-slot="countdown-unit"]')) {
        expect(tile).toHaveAttribute("aria-hidden", "true");
      }
    });

    it("marks compact mode on the root and wires the reduced-motion-safe digit transition", () => {
      const { container } = render(<Countdown target={inMs(30_000)} compact />);
      expect(container.querySelector('[data-slot="countdown"]')).toHaveAttribute("data-compact");
      const digit = container.querySelector('[data-slot="countdown-value"] > span');
      expect(digit?.className).toContain("starting:opacity-0");
      expect(digit?.className).toContain("motion-reduce:transition-none");
    });
  });

  it("server-renders a stable -- placeholder (no wall-clock in SSR markup)", () => {
    const html = renderToString(<Countdown target={new Date(Date.now() + 90_000)} />);
    expect(html).toContain("--");
    expect(html).not.toContain("01");
  });

  it("has no axe violations", async () => {
    // A past target: the timer settles instantly, so no ticks race the axe run.
    const { container } = render(
      <Countdown target={new Date(Date.now() - 1_000)} aria-label="Launch countdown" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
