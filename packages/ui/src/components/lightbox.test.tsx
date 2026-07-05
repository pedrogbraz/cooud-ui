import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Lightbox } from "./lightbox.js";

const images = [
  { src: "/a.jpg", alt: "First image", caption: "Caption one" },
  { src: "/b.jpg", alt: "Second image" },
  { src: "/c.jpg", alt: "Third image" },
];

describe("Lightbox", () => {
  it("shows the current image's alt", () => {
    render(<Lightbox open images={images} index={0} />);
    expect(screen.getByAltText("First image")).toBeInTheDocument();
  });

  it("advances to the next image when Next is clicked (controlled)", async () => {
    const onIndexChange = vi.fn();
    render(<Lightbox open images={images} index={0} onIndexChange={onIndexChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("advances the counter on Next (uncontrolled)", async () => {
    render(<Lightbox open images={images} defaultIndex={0} />);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("advances on ArrowRight", async () => {
    render(<Lightbox open images={images} defaultIndex={0} />);
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("sets the index when a thumbnail is clicked", async () => {
    const onIndexChange = vi.fn();
    render(<Lightbox open images={images} index={0} onIndexChange={onIndexChange} />);
    await userEvent.click(screen.getByRole("button", { name: "View image 3" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("calls onOpenChange(false) when the close button is clicked", async () => {
    const onOpenChange = vi.fn();
    render(<Lightbox open images={images} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables Previous at the first image", () => {
    render(<Lightbox open images={images} index={0} />);
    expect(screen.getByRole("button", { name: "Previous image" })).toBeDisabled();
  });

  it("has no axe violations when open", async () => {
    const { baseElement } = render(<Lightbox open images={images} index={0} />);
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
