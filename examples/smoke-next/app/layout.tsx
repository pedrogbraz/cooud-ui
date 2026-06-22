import { CooudUIProvider } from "@cooud/theme";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Cooud UI — Next.js smoke",
  description: "External-consumer smoke fixture for @cooud/ui.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CooudUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
          {children}
        </CooudUIProvider>
      </body>
    </html>
  );
}
