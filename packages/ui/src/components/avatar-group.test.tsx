import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Avatar, AvatarFallback } from "./avatar.js";
import { AvatarGroup } from "./avatar-group.js";

function makeAvatars(count: number) {
  return Array.from({ length: count }, (_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static fixture list with no stable id
    <Avatar key={index}>
      <AvatarFallback>{`U${index}`}</AvatarFallback>
    </Avatar>
  ));
}

describe("AvatarGroup", () => {
  it("renders only `max` avatars and a '+N' overflow chip", () => {
    const { container } = render(<AvatarGroup max={4}>{makeAvatars(6)}</AvatarGroup>);
    expect(container.querySelectorAll('[data-slot="avatar"]')).toHaveLength(4);
    const overflow = container.querySelector('[data-slot="avatar-group-overflow"]');
    expect(overflow).not.toBeNull();
    expect(overflow).toHaveTextContent("+2");
    expect(overflow).toHaveAttribute("aria-label", "2 more");
  });

  it("renders no overflow chip when the count is at or below `max`", () => {
    const { container } = render(<AvatarGroup max={4}>{makeAvatars(3)}</AvatarGroup>);
    expect(container.querySelectorAll('[data-slot="avatar"]')).toHaveLength(3);
    expect(container.querySelector('[data-slot="avatar-group-overflow"]')).toBeNull();
  });

  it("exposes the group role and a default label", () => {
    render(<AvatarGroup>{makeAvatars(2)}</AvatarGroup>);
    expect(screen.getByRole("group", { name: "Avatar group" })).toBeInTheDocument();
  });

  it("applies the size variant to both avatars and the overflow chip", () => {
    const { container } = render(
      <AvatarGroup size="lg" max={1}>
        {makeAvatars(3)}
      </AvatarGroup>,
    );
    expect(container.querySelector('[data-slot="avatar"]')).toHaveClass("size-11");
    expect(container.querySelector('[data-slot="avatar-group-overflow"]')).toHaveClass("size-11");
  });

  it("supports the data-driven `avatars` prop", () => {
    const { container } = render(
      <AvatarGroup
        max={2}
        avatars={[
          { fallback: "AB", alt: "Ada" },
          { fallback: "CD", alt: "Carl" },
          { fallback: "EF", alt: "Eve" },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-slot="avatar"]')).toHaveLength(2);
    expect(container.querySelector('[data-slot="avatar-group-overflow"]')).toHaveAttribute(
      "aria-label",
      "1 more",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<AvatarGroup max={3}>{makeAvatars(5)}</AvatarGroup>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
