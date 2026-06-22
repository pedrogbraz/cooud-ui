"use client";

import { Check, Copy } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn.js";
import { Button, type ButtonProps } from "./button.js";

export interface CopyButtonProps extends Omit<ButtonProps, "value" | "children"> {
  /** Text written to the clipboard when the button is pressed. */
  value: string;
  /** Milliseconds the "copied" state stays visible before reverting. Defaults to 1500. */
  timeout?: number;
  /** Accessible label shown to assistive tech in the idle state. Defaults to "Copy". */
  copyLabel?: string;
  /** Accessible label announced after a successful copy. Defaults to "Copied". */
  copiedLabel?: string;
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      timeout = 1500,
      copyLabel = "Copy",
      copiedLabel = "Copied",
      variant = "ghost",
      size = "icon",
      className,
      onClick,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const handleClick = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setCopied(false), timeout);
        } catch {
          // Clipboard access can be denied (no permission / insecure context); stay idle.
        }
      },
      [onClick, value, timeout],
    );

    const label = copied ? copiedLabel : (ariaLabel ?? copyLabel);

    return (
      <Button
        ref={ref}
        type="button"
        data-slot="copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size}
        aria-label={label}
        className={cn(className)}
        onClick={handleClick}
        {...props}
      >
        {copied ? (
          <Check className="text-success" aria-hidden="true" />
        ) : (
          <Copy aria-hidden="true" />
        )}
        <span aria-live="polite" className="sr-only">
          {copied ? copiedLabel : ""}
        </span>
      </Button>
    );
  },
);
CopyButton.displayName = "CopyButton";
