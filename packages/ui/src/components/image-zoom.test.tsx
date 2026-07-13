import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ImageZoom } from "./image-zoom.js";

/** jsdom has no layout, so the frame geometry the pan math reads is mocked. */
function mockRect(
  element: HTMLElement,
  { left = 0, top = 0, width = 200, height = 100 } = {},
): void {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
}

/** The transformed layer that carries `scale` and `transform-origin`. */
function getContent(container: HTMLElement): HTMLElement {
  const content = container.querySelector('[data-slot="image-zoom-content"]');
  if (!(content instanceof HTMLElement)) throw new Error("content layer not found");
  return content;
}

describe("ImageZoom", () => {
  it("renders an unzoomed toggle with the default label, image, and indicator", () => {
    const { container } = render(<ImageZoom src="/product.png" alt="Product photo" />);
    const button = screen.getByRole("button", { name: "Zoom image: Product photo" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("data-state", "idle");
    expect(screen.getByAltText("Product photo")).toHaveAttribute("src", "/product.png");
    expect(getContent(container).style.transform).toBe("scale(1)");
    expect(container.querySelector('[data-slot="image-zoom-indicator"]')).toBeInTheDocument();
  });

  it("renders a custom label and hides the indicator when showIndicator is false", () => {
    const { container } = render(
      <ImageZoom src="/p.png" labels={{ zoom: "Ampliar imagem" }} showIndicator={false} />,
    );
    expect(screen.getByRole("button", { name: "Ampliar imagem" })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="image-zoom-indicator"]')).not.toBeInTheDocument();
  });

  it("composes the image description into the accessible name so alt reaches AT", () => {
    // The root is a button, so a plain img alt would be swallowed by its
    // aria-label; the name must carry both the action and the description.
    const { rerender } = render(<ImageZoom src="/p.png" alt="Studio product photo" />);
    expect(
      screen.getByRole("button", { name: "Zoom image: Studio product photo" }),
    ).toBeInTheDocument();

    rerender(<ImageZoom src="/p.png" alt="Foto do produto" labels={{ zoom: "Ampliar imagem" }} />);
    expect(
      screen.getByRole("button", { name: "Ampliar imagem: Foto do produto" }),
    ).toBeInTheDocument();
  });

  it("zooms a child image instead of the built-in one", () => {
    const { container } = render(
      <ImageZoom>
        <img src="/custom.png" alt="Custom shot" />
      </ImageZoom>,
    );
    expect(getContent(container)).toContainElement(screen.getByAltText("Custom shot"));
  });

  it("toggles zoom with the keyboard and applies the scale", async () => {
    const onZoomChange = vi.fn();
    const { container } = render(<ImageZoom src="/p.png" zoom={3} onZoomChange={onZoomChange} />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    const content = getContent(container);

    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-state", "zoomed");
    // No pointer was recorded, so the zoom stays centered.
    expect(content.style.transform).toBe("scale(3)");
    expect(content.style.transformOrigin).toBe("50% 50%");
    expect(onZoomChange).toHaveBeenLastCalledWith(true);

    await userEvent.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(content.style.transform).toBe("scale(1)");
    expect(onZoomChange).toHaveBeenLastCalledWith(false);

    // Space activates the native button too.
    await userEvent.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(onZoomChange).toHaveBeenCalledTimes(3);
  });

  it("collapses the zoom with Escape", async () => {
    render(<ImageZoom src="/p.png" />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("scopes Escape to the zoom: stopped while zoomed, propagated when idle", async () => {
    // Stands in for an enclosing Dialog/Lightbox dismiss listener: the first
    // Escape must only collapse the zoom, not dismiss the host surface.
    const wrapperEscapes = vi.fn();
    render(
      // biome-ignore lint/a11y/noStaticElementInteractions: test scaffolding — an ancestor listener observing bubbled keydowns, not a control.
      <div
        onKeyDown={(event) => {
          if (event.key === "Escape") wrapperEscapes();
        }}
      >
        <ImageZoom src="/p.png" />
      </div>,
    );
    const button = screen.getByRole("button", { name: "Zoom image" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");

    await userEvent.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(wrapperEscapes).not.toHaveBeenCalled();

    // Once idle, Escape bubbles through to the host untouched.
    await userEvent.keyboard("{Escape}");
    expect(wrapperEscapes).toHaveBeenCalledTimes(1);
  });

  it("toggles zoom centered on the tap point for coarse pointers", () => {
    const { container } = render(<ImageZoom src="/p.png" />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    mockRect(button);
    const content = getContent(container);

    // Real taps produce clicks with detail >= 1, exercising the press-type path.
    fireEvent.pointerDown(button, { pointerType: "touch", clientX: 150, clientY: 75 });
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(content.style.transform).toBe("scale(2)");
    expect(content.style.transformOrigin).toBe("75% 75%");

    fireEvent.pointerDown(button, { pointerType: "touch", clientX: 150, clientY: 75 });
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(content.style.transform).toBe("scale(1)");
  });

  it("zooms on fine-pointer hover and tracks the cursor via transform-origin", () => {
    const { container } = render(<ImageZoom src="/p.png" />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    mockRect(button);
    const content = getContent(container);

    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 50, clientY: 25 });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(content.style.transform).toBe("scale(2)");
    expect(content.style.transformOrigin).toBe("25% 25%");

    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 200, clientY: 100 });
    expect(content.style.transformOrigin).toBe("100% 100%");

    // Coordinates outside the frame clamp to the edges.
    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 400, clientY: -40 });
    expect(content.style.transformOrigin).toBe("100% 0%");

    // React synthesizes onPointerLeave from the native pointerout event.
    fireEvent.pointerOut(button, { pointerType: "mouse" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(content.style.transform).toBe("scale(1)");
  });

  it("pans a sticky touch zoom as the finger drags, and touch leave keeps it", () => {
    const { container } = render(<ImageZoom src="/p.png" />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    mockRect(button);
    const content = getContent(container);

    fireEvent.pointerDown(button, { pointerType: "touch", clientX: 100, clientY: 50 });
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(content.style.transformOrigin).toBe("50% 50%");

    // A drag across the zoomed frame re-anchors the pan mid-zoom.
    fireEvent.pointerMove(button, { pointerType: "touch", clientX: 180, clientY: 90 });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(content.style.transformOrigin).toBe("90% 90%");

    // Only mouse leave ends the zoom; the sticky touch zoom survives it.
    fireEvent.pointerOut(button, { pointerType: "touch" });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("treats pen like touch: tap toggles at the point, pen hover does not zoom", () => {
    const { container } = render(<ImageZoom src="/p.png" />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    mockRect(button);
    const content = getContent(container);

    // Pen hover must not enter the mouse hover-zoom path.
    fireEvent.pointerMove(button, { pointerType: "pen", clientX: 50, clientY: 25 });
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.pointerDown(button, { pointerType: "pen", clientX: 150, clientY: 75 });
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(content.style.transformOrigin).toBe("75% 75%");
  });

  it("does not re-fire onZoomChange on repeated hover moves or an idle Escape", () => {
    const onZoomChange = vi.fn();
    render(<ImageZoom src="/p.png" onZoomChange={onZoomChange} />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    mockRect(button);

    // Escape while idle is a no-op, not an onZoomChange(false).
    fireEvent.keyDown(button, { key: "Escape" });
    expect(onZoomChange).not.toHaveBeenCalled();

    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 50, clientY: 25 });
    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 60, clientY: 30 });
    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 70, clientY: 35 });
    expect(onZoomChange).toHaveBeenCalledTimes(1);
    expect(onZoomChange).toHaveBeenLastCalledWith(true);
  });

  it("keeps the origin centered when the frame reports a zero-size rect", () => {
    const { container } = render(<ImageZoom src="/p.png" />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    mockRect(button, { width: 0, height: 0 });
    const content = getContent(container);

    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 40, clientY: 20 });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(content.style.transformOrigin).toBe("50% 50%");
  });

  it("invokes consumer handlers and lets a spread aria-label win", () => {
    const onClick = vi.fn();
    const onPointerMove = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <ImageZoom
        src="/p.png"
        alt="Product photo"
        aria-label="Inspect fabric"
        onClick={onClick}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      />,
    );
    // The consumer aria-label spreads after the composed name and overrides it.
    const button = screen.getByRole("button", { name: "Inspect fabric" });
    mockRect(button);

    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 10, clientY: 10 });
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "a" });
    expect(onPointerMove).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("does not let a mouse click toggle the hover-driven zoom", () => {
    render(<ImageZoom src="/p.png" />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    mockRect(button);

    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 100, clientY: 50 });
    expect(button).toHaveAttribute("aria-pressed", "true");

    // Real mouse clicks carry detail >= 1 (detail 0 means keyboard activation).
    fireEvent.pointerDown(button, { pointerType: "mouse", clientX: 100, clientY: 50 });
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps keyboard activation working after an abandoned mouse press", async () => {
    render(<ImageZoom src="/p.png" />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    mockRect(button);

    // Press the mouse, drag off, and release elsewhere: no click reaches the
    // button, so nothing consumes the recorded press pointer type.
    fireEvent.pointerDown(button, { pointerType: "mouse", clientX: 100, clientY: 50 });
    fireEvent.pointerOut(button, { pointerType: "mouse" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    // The next keyboard activation must not be swallowed by the stale press.
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");

    // And a real mouse click right after still defers to hover-driven zoom.
    fireEvent.pointerDown(button, { pointerType: "mouse", clientX: 100, clientY: 50 });
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("clamps zoom values below 1 to 1 and falls back to 2 on non-finite zoom", () => {
    const { container, rerender } = render(<ImageZoom src="/p.png" zoom={0.5} />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(getContent(container).style.transform).toBe("scale(1)");

    rerender(<ImageZoom src="/p.png" zoom={Number.NaN} />);
    expect(getContent(container).style.transform).toBe("scale(2)");
  });

  it("starts zoomed with defaultZoomed and still toggles uncontrolled", () => {
    const { container } = render(<ImageZoom src="/p.png" defaultZoomed />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-state", "zoomed");
    expect(getContent(container).style.transform).toBe("scale(2)");

    fireEvent.pointerDown(button, { pointerType: "touch", clientX: 0, clientY: 0 });
    fireEvent.click(button, { detail: 1 });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(getContent(container).style.transform).toBe("scale(1)");
  });

  it("follows the controlled zoomed prop and reports intent without self-toggling", () => {
    const onZoomChange = vi.fn();
    const { container, rerender } = render(
      <ImageZoom src="/p.png" zoomed={false} onZoomChange={onZoomChange} />,
    );
    const button = screen.getByRole("button", { name: "Zoom image" });

    // Activation reports the intent; the state itself stays with the parent.
    fireEvent.pointerDown(button, { pointerType: "touch", clientX: 0, clientY: 0 });
    fireEvent.click(button, { detail: 1 });
    expect(onZoomChange).toHaveBeenLastCalledWith(true);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(getContent(container).style.transform).toBe("scale(1)");

    rerender(<ImageZoom src="/p.png" zoomed onZoomChange={onZoomChange} />);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(getContent(container).style.transform).toBe("scale(2)");

    // Escape on a controlled instance reports false; the parent decides.
    fireEvent.keyDown(button, { key: "Escape" });
    expect(onZoomChange).toHaveBeenLastCalledWith(false);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("scopes will-change promotion to hover/zoom instead of idle instances", () => {
    const { container } = render(<ImageZoom src="/p.png" />);
    const className = getContent(container).className;
    expect(className).toContain("group-data-[state=zoomed]/image-zoom:will-change-transform");
    expect(className).toContain("group-hover/image-zoom:will-change-transform");
    // No unconditional promotion: the bare utility must not be present.
    expect(className.split(/\s+/)).not.toContain("will-change-transform");
  });

  it("ignores all interaction when disabled", () => {
    const onZoomChange = vi.fn();
    render(<ImageZoom src="/p.png" disabled onZoomChange={onZoomChange} />);
    const button = screen.getByRole("button", { name: "Zoom image" });
    expect(button).toBeDisabled();

    fireEvent.pointerMove(button, { pointerType: "mouse", clientX: 10, clientY: 10 });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(onZoomChange).not.toHaveBeenCalled();
  });

  it("has no axe violations (idle)", async () => {
    const { container } = render(<ImageZoom src="/p.png" alt="Product photo" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (zoomed)", async () => {
    const { container } = render(<ImageZoom src="/p.png" alt="Product photo" />);
    fireEvent.click(screen.getByRole("button", { name: "Zoom image: Product photo" }));
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(await axe(container)).toHaveNoViolations();
  });
});
