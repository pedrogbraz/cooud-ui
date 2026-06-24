import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ColorPicker } from "./color-picker.js";

// Radix Popover measures its content with ResizeObserver, which jsdom lacks.
// Stub it (plus the pointer-capture helpers Radix probes) at file scope so the
// shared setup is untouched.
beforeAll(() => {
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
});

const BLUE = "oklch(0.62 0.21 256)";

async function openPanel(name = "Brand color") {
  await userEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
}

describe("ColorPicker", () => {
  it("renders a trigger labelled with the current value", () => {
    render(<ColorPicker aria-label="Brand color" defaultValue={BLUE} />);
    const trigger = screen.getByRole("button", { name: /Brand color/ });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveTextContent(BLUE);
  });

  it("opens the panel revealing the hue control, L/C/H inputs, and swatches", async () => {
    render(<ColorPicker aria-label="Brand color" defaultValue={BLUE} />);
    await openPanel();

    // Two role=slider controls: the 2D area + the hue track.
    expect(screen.getByRole("slider", { name: "Saturation and lightness" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Hue" })).toBeInTheDocument();

    // L / C / H numeric inputs.
    expect(screen.getByLabelText("L")).toHaveValue(0.62);
    expect(screen.getByLabelText("C")).toHaveValue(0.21);
    expect(screen.getByLabelText("H")).toHaveValue(256);

    // The full read-write oklch string.
    expect(screen.getByLabelText("Value")).toHaveValue(BLUE);

    // Preset swatches group.
    expect(screen.getByRole("group", { name: "Preset colors" })).toBeInTheDocument();
  });

  it("fires onValueChange with an oklch() string when an L input is edited", async () => {
    const onValueChange = vi.fn();
    render(
      <ColorPicker aria-label="Brand color" defaultValue={BLUE} onValueChange={onValueChange} />,
    );
    await openPanel();

    const lInput = screen.getByLabelText("L");
    await userEvent.clear(lInput);
    await userEvent.type(lInput, "0.8");

    expect(onValueChange).toHaveBeenCalled();
    const last = onValueChange.mock.calls.at(-1)?.[0] as string;
    expect(last).toMatch(/^oklch\(/);
    // Lightness moved to 0.8; chroma/hue preserved.
    expect(last).toContain("0.8");
    expect(last).toContain("256");
  });

  it("fires onValueChange with an oklch() string when the H input is edited", async () => {
    const onValueChange = vi.fn();
    render(
      <ColorPicker aria-label="Brand color" defaultValue={BLUE} onValueChange={onValueChange} />,
    );
    await openPanel();

    const hInput = screen.getByLabelText("H");
    await userEvent.clear(hInput);
    await userEvent.type(hInput, "120");

    const last = onValueChange.mock.calls.at(-1)?.[0] as string;
    expect(last).toMatch(/^oklch\(.*120\)$/);
  });

  it("clamps an out-of-range channel on blur (chroma capped at 0.37)", async () => {
    const onValueChange = vi.fn();
    render(
      <ColorPicker aria-label="Brand color" defaultValue={BLUE} onValueChange={onValueChange} />,
    );
    await openPanel();

    const cInput = screen.getByLabelText("C");
    await userEvent.clear(cInput);
    await userEvent.type(cInput, "0.9");
    await userEvent.tab(); // commit on blur

    const last = onValueChange.mock.calls.at(-1)?.[0] as string;
    // 0.9 is clamped to the 0.37 ceiling.
    expect(last).toContain("0.37");
    expect(last).not.toContain("0.9");
  });

  it("selects a preset swatch, firing onValueChange with that color", async () => {
    const onValueChange = vi.fn();
    render(
      <ColorPicker
        aria-label="Brand color"
        defaultValue={BLUE}
        swatches={["oklch(0.72 0.19 145)", "oklch(0.65 0.24 24)"]}
        onValueChange={onValueChange}
      />,
    );
    await openPanel();

    const group = screen.getByRole("group", { name: "Preset colors" });
    await userEvent.click(within(group).getByRole("button", { name: "oklch(0.72 0.19 145)" }));
    expect(onValueChange).toHaveBeenLastCalledWith("oklch(0.72 0.19 145)");
  });

  it("moves hue with the arrow keys on the hue slider", async () => {
    const onValueChange = vi.fn();
    render(
      <ColorPicker aria-label="Brand color" defaultValue={BLUE} onValueChange={onValueChange} />,
    );
    await openPanel();

    const hue = screen.getByRole("slider", { name: "Hue" });
    hue.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalled();
    const last = onValueChange.mock.calls.at(-1)?.[0] as string;
    expect(last).toMatch(/^oklch\(/);
    // Default step is 3deg: 256 -> 259.
    expect(last).toContain("259");
  });

  it("falls back gracefully for a non-oklch value (uses it as the tile, defaults sliders)", async () => {
    render(<ColorPicker aria-label="Brand color" defaultValue="#ff0000" />);
    const trigger = screen.getByRole("button", { name: /Brand color/ });
    expect(trigger).toHaveTextContent("#ff0000");

    await openPanel();
    // Sliders fall back to the default oklch channels rather than throwing.
    expect(screen.getByLabelText("H")).toHaveValue(256);
    // The text field still shows the raw value verbatim.
    expect(screen.getByLabelText("Value")).toHaveValue("#ff0000");
  });

  it("supports controlled usage", async () => {
    function Controlled() {
      const [value, setValue] = useState(BLUE);
      return <ColorPicker aria-label="Brand color" value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    await openPanel();

    const group = screen.getByRole("group", { name: "Preset colors" });
    const firstSwatch = within(group).getAllByRole("button")[0];
    const swatchColor = firstSwatch.getAttribute("aria-label") as string;
    await userEvent.click(firstSwatch);

    // The trigger reflects the controlled update.
    expect(screen.getByRole("button", { name: /Brand color/ })).toHaveTextContent(swatchColor);
  });

  it("disables the trigger when disabled", () => {
    render(<ColorPicker aria-label="Brand color" defaultValue={BLUE} disabled />);
    expect(screen.getByRole("button", { name: /Brand color/ })).toBeDisabled();
  });

  it("has no axe violations on the open panel", async () => {
    const { baseElement } = render(<ColorPicker aria-label="Brand color" defaultValue={BLUE} />);
    await openPanel();
    // Popover content portals to document.body, so audit the whole baseElement.
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
