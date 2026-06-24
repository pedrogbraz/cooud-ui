import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  type ComponentProps,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn.js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";

const avatarGroupItemVariants = cva(
  // A ring in the surface color makes overlapping avatars read as a stack.
  "ring-2 ring-surface-base",
  {
    variants: {
      size: {
        sm: "size-7",
        md: "size-9",
        lg: "size-11",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const avatarGroupOverflowVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-full bg-surface-overlay font-medium text-fg-secondary ring-2 ring-surface-base",
  {
    variants: {
      size: {
        sm: "size-7 text-xs",
        md: "size-9 text-sm",
        lg: "size-11 text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface AvatarGroupAvatar {
  /** Image source for the avatar. */
  src?: string;
  /** Alt text for the image; also used as the fallback's accessible context. */
  alt?: string;
  /** Text shown when the image is missing or still loading (e.g. initials). */
  fallback: ReactNode;
}

export interface AvatarGroupProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarGroupItemVariants> {
  /**
   * Avatars to stack. Compose `<Avatar>` children, or pass `avatars` for the
   * data-driven shorthand. `avatars` takes precedence when both are provided.
   */
  avatars?: AvatarGroupAvatar[];
  /** Show the first `max` avatars, then a "+N" overflow chip for the rest. */
  max?: number;
  /**
   * Horizontal overlap between avatars as a Tailwind negative-margin class
   * (e.g. `-space-x-2`). Defaults to a tasteful offset.
   */
  spacing?: string;
}

type AvatarChild = ReactElement<ComponentProps<typeof Avatar>>;

/**
 * Overlapping stack of avatars with an optional "+N" overflow chip — for teams
 * or social proof ("loved by 9,000+"). The `size` prop drives both the avatars
 * and the chip, overriding any size set on individual children for a uniform
 * row.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      children,
      avatars,
      max,
      size,
      spacing = "-space-x-2",
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const items: AvatarChild[] = avatars
      ? avatars.map((avatar, index) => (
          // Data-driven items are positional and stable within a render.
          // biome-ignore lint/suspicious/noArrayIndexKey: positional list with no stable id
          <Avatar key={index}>
            {avatar.src ? <AvatarImage src={avatar.src} alt={avatar.alt} /> : null}
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ))
      : (Children.toArray(children).filter(isValidElement) as AvatarChild[]);

    const total = items.length;
    const limit = max != null && max >= 0 && max < total ? max : total;
    const visible = items.slice(0, limit);
    const overflow = total - limit;

    return (
      // biome-ignore lint/a11y/useSemanticElements: a <fieldset> implies form-control grouping; this is a decorative avatar stack that just needs a labelled group role.
      <div
        ref={ref}
        data-slot="avatar-group"
        role="group"
        aria-label={ariaLabel ?? "Avatar group"}
        className={cn("flex items-center", spacing, className)}
        {...props}
      >
        {visible.map((child, index) =>
          cloneElement(child, {
            // Overlap order: each avatar sits above the one before it.
            style: { zIndex: index, ...child.props.style },
            className: cn(avatarGroupItemVariants({ size }), child.props.className),
          }),
        )}
        {overflow > 0 ? (
          <span
            data-slot="avatar-group-overflow"
            role="img"
            aria-label={`${overflow} more`}
            style={{ zIndex: visible.length }}
            className={avatarGroupOverflowVariants({ size })}
          >
            +{overflow}
          </span>
        ) : null}
      </div>
    );
  },
);
AvatarGroup.displayName = "AvatarGroup";

export { avatarGroupItemVariants, avatarGroupOverflowVariants };
