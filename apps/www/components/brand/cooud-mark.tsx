import { cn } from "@cooud/ui";
import type { CSSProperties } from "react";

const MARK_MASK_STYLE: CSSProperties = {
  WebkitMaskImage: "url(/brand/cooud-mark.png)",
  maskImage: "url(/brand/cooud-mark.png)",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

export function CooudMark({ className, title }: { className?: string; title?: string }) {
  if (title) {
    return (
      <span
        role="img"
        aria-label={title}
        className={cn("inline-block shrink-0 bg-current", className)}
        style={MARK_MASK_STYLE}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={MARK_MASK_STYLE}
    />
  );
}
