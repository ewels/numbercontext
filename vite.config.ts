import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Served from the domain root (custom domain numbercontext.com), so base "/".
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
});
