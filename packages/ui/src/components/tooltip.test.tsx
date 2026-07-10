import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

// delayDuration=0 so the tooltip opens immediately under fake-free timers.
function BasicTooltip() {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>More info</TooltipTrigger>
      <TooltipContent>Helpful hint</TooltipContent>
    </Tooltip>
  );
}

describe("Tooltip", () => {
  it("renders closed by default", () => {
    render(<BasicTooltip />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByText("More info")).toBeInTheDocument();
  });

  it("is self-contained: opens on hover without a wrapping TooltipProvider", async () => {
    const user = userEvent.setup();
    render(<BasicTooltip />);

    await user.hover(screen.getByText("More info"));
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Helpful hint");
  });

  it("opens on keyboard focus of the trigger", async () => {
    const user = userEvent.setup();
    render(<BasicTooltip />);

    await user.tab(); // focus the trigger
    expect(screen.getByText("More info")).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<BasicTooltip />);
    await user.hover(screen.getByText("More info"));
    await screen.findByRole("tooltip");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("associates the open tooltip with its trigger via aria-describedby", async () => {
    const user = userEvent.setup();
    render(<BasicTooltip />);
    const trigger = screen.getByText("More info");
    await user.hover(trigger);
    const tooltip = await screen.findByRole("tooltip");

    // While open, the trigger is described by the tooltip content for AT.
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    // jsdom NOTE: close-on-pointer-leave is NOT asserted here — Radix drives it
    // with timers + pointer tracking and keeps a visually-hidden a11y copy of the
    // content, so unhover does not remove role="tooltip" in jsdom. The Escape
    // close path (covered above) is the reliable dismissal assertion.
  });

  it("shares a single provider across multiple tooltips", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>First</TooltipTrigger>
          <TooltipContent>First tip</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>Second</TooltipTrigger>
          <TooltipContent>Second tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByText("Second"));
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Second tip");
  });

  describe("delay config (fake timers)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    // userEvent hangs under Vitest fake timers (Testing Library's asyncWrapper
    // drains "next tick" via a faked setTimeout and only auto-advances jest
    // clocks), so these tests dispatch Radix's real open trigger directly:
    // a non-touch pointermove on the trigger starts the delay timer.
    function hoverTrigger() {
      fireEvent.pointerMove(screen.getByText("More info"));
    }

    it("honors an app-level TooltipProvider delayDuration", () => {
      render(
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger>More info</TooltipTrigger>
            <TooltipContent>Helpful hint</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );

      hoverTrigger();
      // Regression guard: the old inner per-tooltip provider (200ms) would
      // have opened here already, silently overriding the app-level 500ms.
      act(() => vi.advanceTimersByTime(450));
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      act(() => vi.advanceTimersByTime(50));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("lets a per-tooltip delayDuration override the provider config", () => {
      render(
        <TooltipProvider delayDuration={500}>
          <Tooltip delayDuration={100}>
            <TooltipTrigger>More info</TooltipTrigger>
            <TooltipContent>Helpful hint</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );

      hoverTrigger();
      act(() => vi.advanceTimersByTime(50));
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      act(() => vi.advanceTimersByTime(50));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("falls back to the 200ms house default without any provider", () => {
      render(
        <Tooltip>
          <TooltipTrigger>More info</TooltipTrigger>
          <TooltipContent>Helpful hint</TooltipContent>
        </Tooltip>,
      );

      hoverTrigger();
      act(() => vi.advanceTimersByTime(150));
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      act(() => vi.advanceTimersByTime(50));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<BasicTooltip />);
    await user.hover(screen.getByText("More info"));
    await screen.findByRole("tooltip");
    // The tooltip portals to <body> outside any landmark; "region" is a
    // page-structure rule that does not apply to an isolated component mount.
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
