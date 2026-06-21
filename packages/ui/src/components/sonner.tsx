"use client";

import { Toaster as Sonner, toast } from "sonner";

export interface ToasterProps extends React.ComponentProps<typeof Sonner> {}

export const Toaster = ({ theme = "dark", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--cooud-surface-floating)",
          "--normal-text": "var(--cooud-fg)",
          "--normal-border": "var(--cooud-border)",
          "--border-radius": "var(--cooud-radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};
Toaster.displayName = "Toaster";

export { toast };
