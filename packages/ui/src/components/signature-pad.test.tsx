import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SignaturePad, type SignaturePadHandle } from "./signature-pad.js";

// jsdom has no 2D canvas backend, so the tests observe the component through a
// recording context stub: every path call lands in a spy, and property writes
// (strokeStyle, lineWidth…) are captured on the plain object.
function createContextStub() {
  return {
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    lineWidth: 0,
    lineCap: "butt",
    lineJoin: "miter",
    strokeStyle: "",
    fillStyle: "",
  };
}

const DATA_URL = "data:image/png;base64,stub";

let ctx: ReturnType<typeof createContextStub>;

beforeEach(() => {
  ctx = createContextStub();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(DATA_URL);
  // Run paint frames synchronously so pointer moves are observable immediately.
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function getCanvas() {
  return screen.getByRole("img", { name: "Signature pad" });
}

/** Simulates a full pointer stroke: down → moves → up. */
function drawStroke(
  canvas: HTMLElement,
  points: ReadonlyArray<readonly [number, number]>,
  pointerId = 1,
) {
  const [first, ...rest] = points;
  if (!first) throw new Error("drawStroke needs at least one point");
  fireEvent.pointerDown(canvas, {
    pointerId,
    clientX: first[0],
    clientY: first[1],
    button: 0,
  });
  for (const [x, y] of rest) {
    fireEvent.pointerMove(canvas, { pointerId, clientX: x, clientY: y });
  }
  const last = points[points.length - 1] ?? first;
  fireEvent.pointerUp(canvas, { pointerId, clientX: last[0], clientY: last[1] });
}

describe("SignaturePad", () => {
  it("renders a labelled drawing surface with Undo/Clear actions disabled while empty", () => {
    const { container } = render(<SignaturePad />);
    expect(getCanvas()).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo last stroke" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clear signature" })).toBeDisabled();
    const root = container.querySelector('[data-slot="signature-pad"]');
    expect(root).toHaveAttribute("data-empty", "true");
  });

  it("draws a stroke with midpoint quadratic smoothing and reports a data URL", () => {
    const onChange = vi.fn();
    const { container } = render(<SignaturePad onChange={onChange} />);
    drawStroke(getCanvas(), [
      [10, 10],
      [30, 20],
      [50, 12],
    ]);
    // The anchor dot for the first sample…
    expect(ctx.arc).toHaveBeenCalledWith(10, 10, 1, 0, Math.PI * 2);
    // …then the samples become control points of quadratic segments.
    expect(ctx.quadraticCurveTo).toHaveBeenCalledWith(10, 10, 20, 15);
    expect(ctx.quadraticCurveTo).toHaveBeenCalledWith(30, 20, 40, 16);
    // The trailing midpoint is capped through to the final sample.
    expect(ctx.lineTo).toHaveBeenCalledWith(50, 12);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(DATA_URL);
    const root = container.querySelector('[data-slot="signature-pad"]');
    expect(root).toHaveAttribute("data-empty", "false");
  });

  it("fades the 'Sign here' hint once drawing starts", () => {
    const { container } = render(<SignaturePad />);
    const hint = container.querySelector('[data-slot="signature-pad-hint"]');
    expect(hint).toHaveClass("opacity-100");
    fireEvent.pointerDown(getCanvas(), { pointerId: 1, clientX: 5, clientY: 5, button: 0 });
    expect(hint).toHaveClass("opacity-0");
  });

  it("resolves the stroke color from the wrapper's computed CSS color", () => {
    render(<SignaturePad style={{ color: "rgb(1, 2, 3)" }} />);
    fireEvent.pointerDown(getCanvas(), { pointerId: 1, clientX: 5, clientY: 5, button: 0 });
    expect(ctx.strokeStyle).toBe("rgb(1, 2, 3)");
    expect(ctx.fillStyle).toBe("rgb(1, 2, 3)");
  });

  it("undoes the last stroke and reports null once the pad is empty again", () => {
    const onChange = vi.fn();
    render(<SignaturePad onChange={onChange} />);
    drawStroke(getCanvas(), [
      [10, 10],
      [20, 20],
    ]);
    const undoButton = screen.getByRole("button", { name: "Undo last stroke" });
    expect(undoButton).toBeEnabled();
    fireEvent.click(undoButton);
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(undoButton).toBeDisabled();
  });

  it("undo removes only the most recent of several strokes", () => {
    const onChange = vi.fn();
    render(<SignaturePad onChange={onChange} />);
    drawStroke(getCanvas(), [
      [10, 10],
      [20, 20],
    ]);
    drawStroke(getCanvas(), [
      [40, 40],
      [60, 60],
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Undo last stroke" }));
    // One stroke remains, so the change payload is still a data URL.
    expect(onChange).toHaveBeenLastCalledWith(DATA_URL);
    expect(screen.getByRole("button", { name: "Undo last stroke" })).toBeEnabled();
  });

  it("clears every stroke at once", () => {
    const onChange = vi.fn();
    render(<SignaturePad onChange={onChange} />);
    drawStroke(getCanvas(), [
      [10, 10],
      [20, 20],
    ]);
    drawStroke(getCanvas(), [
      [40, 40],
      [60, 60],
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Clear signature" }));
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole("button", { name: "Undo last stroke" })).toBeDisabled();
    expect(ctx.clearRect).toHaveBeenCalled();
  });

  it("exposes the imperative handle: isEmpty / toDataURL / undo / clear", () => {
    const handle = createRef<SignaturePadHandle>();
    render(<SignaturePad ref={handle} />);
    expect(handle.current?.isEmpty()).toBe(true);
    expect(handle.current?.toDataURL()).toBeNull();

    drawStroke(getCanvas(), [
      [10, 10],
      [20, 20],
    ]);
    expect(handle.current?.isEmpty()).toBe(false);
    expect(handle.current?.toDataURL()).toBe(DATA_URL);

    handle.current?.undo();
    expect(handle.current?.isEmpty()).toBe(true);

    drawStroke(getCanvas(), [
      [10, 10],
      [20, 20],
    ]);
    handle.current?.clear();
    expect(handle.current?.isEmpty()).toBe(true);
    expect(handle.current?.toDataURL()).toBeNull();
  });

  it("ignores pointer input while disabled", () => {
    const onChange = vi.fn();
    const handle = createRef<SignaturePadHandle>();
    const { container } = render(<SignaturePad ref={handle} onChange={onChange} disabled />);
    drawStroke(screen.getByRole("img", { name: "Signature pad" }), [
      [10, 10],
      [20, 20],
    ]);
    expect(onChange).not.toHaveBeenCalled();
    expect(handle.current?.isEmpty()).toBe(true);
    const root = container.querySelector('[data-slot="signature-pad"]');
    expect(root).toHaveAttribute("data-disabled", "true");
    expect(screen.getByRole("button", { name: "Clear signature" })).toBeDisabled();
  });

  it("ignores moves from a different pointer than the one drawing", () => {
    const onChange = vi.fn();
    render(<SignaturePad onChange={onChange} />);
    const canvas = getCanvas();
    fireEvent.pointerDown(canvas, { pointerId: 1, clientX: 10, clientY: 10, button: 0 });
    const movesBefore = ctx.quadraticCurveTo.mock.calls.length;
    fireEvent.pointerMove(canvas, { pointerId: 2, clientX: 90, clientY: 90 });
    expect(ctx.quadraticCurveTo.mock.calls.length).toBe(movesBefore);
    // Ending the foreign pointer must not commit the stroke either.
    fireEvent.pointerUp(canvas, { pointerId: 2, clientX: 90, clientY: 90 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports a custom accessible name", () => {
    render(<SignaturePad aria-label="Contract signature" />);
    expect(screen.getByRole("img", { name: "Contract signature" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<SignaturePad />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations after drawing and while disabled", async () => {
    const { container, rerender } = render(<SignaturePad />);
    drawStroke(getCanvas(), [
      [10, 10],
      [20, 20],
    ]);
    expect(await axe(container)).toHaveNoViolations();
    rerender(<SignaturePad disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
