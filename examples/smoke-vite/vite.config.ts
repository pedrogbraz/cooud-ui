import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Tailwind v4 via the first-party Vite plugin (no PostCSS config needed).
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
