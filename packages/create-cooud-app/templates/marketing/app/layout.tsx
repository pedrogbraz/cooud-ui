import { CooudThemeScript, CooudUIProvider } from "@cooud-ui/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "__APP_NAME__",
  description: "A landing site built with Cooud UI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      // CooudThemeScript mutates <html> (theme/mode/dark class) before hydration
      // to prevent a flash of the wrong theme, so React must not warn about the
      // resulting attribute mismatch.
      suppressHydrationWarning
    >
      <head>
        <CooudThemeScript
          storageKey="theme"
          defaultThemeName="__THEME__"
          defaultModeName="__MODE__"
        />
      </head>
      <body>
        <CooudUIProvider
          asRoot
          defaultThemeName="__THEME__"
          defaultModeName="__MODE__"
          storageKey="theme"
        >
          {children}
        </CooudUIProvider>
      </body>
    </html>
  );
}
