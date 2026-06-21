import { CooudUIProvider } from "@cooud/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cooud UI — Design System",
  description: "The Cooud design system: themeable, accessible React components. Aurora + Neutral.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-cooud-theme="aurora" data-cooud-mode="dark" className="dark">
      <body>
        <CooudUIProvider
          asRoot
          defaultThemeName="aurora"
          defaultModeName="dark"
          storageKey="cooud-ui-theme"
        >
          {children}
        </CooudUIProvider>
      </body>
    </html>
  );
}
