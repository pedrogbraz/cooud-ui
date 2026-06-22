"use client";

import { Check, Copy } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn.js";
import { Button, type ButtonProps } from "./button.js";

/**
 * Write `text` to the clipboard, returning whether it succeeded. Prefers the
 * async Clipboard API and falls back to a temporary textarea + `execCommand`
 * for insecure (http) contexts or browsers without `navigator.clipboard`.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or insecure context — fall through to execCommand.
    }
  }
  if (typeof document === "undefined") return false;
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    // Keep it out of view and out of the layout/scroll flow.
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

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
        const ok = await copyToClipboard(value);
        // Only enter the "copied" state when the write actually succeeded, so we
        // never announce success in an insecure context or when the API is
        // missing and the fallback also fails.
        if (!ok) return;
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), timeout);
      },
      [onClick, value, timeout],
    );

    return (
      <Button
        ref={ref}
        type="button"
        data-slot="copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size}
        // The button keeps a single, stable accessible name. State changes are
        // announced once via the polite live region below — not by mutating this
        // label — to avoid the double announcement.
        aria-label={ariaLabel ?? copyLabel}
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
