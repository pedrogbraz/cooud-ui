import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
  type AnchorHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type OlHTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

export const Breadcrumb = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ ...props }, ref) => {
    return <nav ref={ref} aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
  },
);
Breadcrumb.displayName = "Breadcrumb";

export const BreadcrumbList = forwardRef<HTMLOListElement, OlHTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        data-slot="breadcrumb-list"
        className={cn("flex flex-wrap items-center gap-1.5 text-sm text-fg-tertiary", className)}
        {...props}
      />
    );
  },
);
BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        data-slot="breadcrumb-item"
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
      />
    );
  },
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        data-slot="breadcrumb-link"
        className={cn("transition-colors hover:text-fg", className)}
        {...props}
      />
    );
  },
);
BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbPage = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-current="page"
        data-slot="breadcrumb-page"
        className={cn("font-normal text-fg", className)}
        {...props}
      />
    );
  },
);
BreadcrumbPage.displayName = "BreadcrumbPage";

export const BreadcrumbSeparator = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        role="presentation"
        aria-hidden="true"
        data-slot="breadcrumb-separator"
        className={cn("[&_svg]:size-3.5", className)}
        {...props}
      >
        {children ?? <ChevronRight />}
      </li>
    );
  },
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="presentation"
        aria-hidden="true"
        data-slot="breadcrumb-ellipsis"
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">More</span>
      </span>
    );
  },
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
