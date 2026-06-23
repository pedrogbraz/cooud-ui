import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";

describe("Avatar", () => {
  it("renders the fallback when no image has loaded", () => {
    render(
      <Avatar>
        <AvatarImage src="/missing.png" alt="Jane Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    // jsdom never fires the image's load event, so Radix shows the fallback.
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("forwards data-slot to the root", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(container.querySelector('[data-slot="avatar"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
