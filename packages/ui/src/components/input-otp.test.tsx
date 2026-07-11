import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./input-otp.js";

// The input-otp package observes its container size via ResizeObserver and
// probes the caret position with document.elementFromPoint — neither exists in
// jsdom, so shim them to no-ops before any slot renders.
beforeAll(() => {
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (!document.elementFromPoint) {
    document.elementFromPoint = () => null;
  }
});

// input-otp's internal selection-sync scheduler queues setTimeout(0/10/50ms)
// callbacks that call setState and are never cleared on unmount. Drain them
// while this file's jsdom environment is still alive, otherwise under load a
// straggler fires after teardown and crashes the run with an unhandled
// "window is not defined" from react-dom.
afterEach(async () => {
  await new Promise((resolve) => setTimeout(resolve, 60));
});

function Otp(props: Partial<React.ComponentProps<typeof InputOTP>>) {
  return (
    <InputOTP maxLength={4} aria-label="One-time code" {...props}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
}

describe("InputOTP", () => {
  it("renders an accessible text input behind the slots", () => {
    render(<Otp />);
    expect(screen.getByRole("textbox", { name: "One-time code" })).toBeInTheDocument();
  });

  it("falls back to a default accessible name when no aria-label is given", () => {
    render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>,
    );
    // The internal input is never nameless — axe `label` would fail otherwise.
    expect(screen.getByRole("textbox", { name: "One-time passcode" })).toBeInTheDocument();
  });

  it("fills the slots as the user types", async () => {
    render(<Otp />);
    const input = screen.getByRole("textbox", { name: "One-time code" });
    await userEvent.type(input, "1234");
    expect(input).toHaveValue("1234");
    // Each typed character is rendered into a slot.
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("does not accept more than maxLength characters", async () => {
    render(<Otp />);
    const input = screen.getByRole("textbox", { name: "One-time code" });
    await userEvent.type(input, "123456");
    expect(input).toHaveValue("1234");
  });

  it("fires onChange with the current value", async () => {
    const onChange = vi.fn();
    render(<Otp onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox", { name: "One-time code" }), "9");
    expect(onChange).toHaveBeenCalledWith("9");
  });

  it("honors a controlled value", () => {
    function Controlled() {
      const [value] = useState("42");
      return <Otp value={value} onChange={() => {}} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("textbox", { name: "One-time code" })).toHaveValue("42");
  });

  it("is not editable while disabled", async () => {
    render(<Otp disabled />);
    const input = screen.getByRole("textbox", { name: "One-time code" });
    expect(input).toBeDisabled();
    await userEvent.type(input, "12");
    expect(input).toHaveValue("");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Otp />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
