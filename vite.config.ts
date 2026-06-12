import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Served as a GitHub Pages project site at ewels.github.io/numbercontext/,
// so assets must be resolved under that sub-path.
// When the numbercontext.com custom domain is set up, change this back to "/"
// and re-add public/CNAME with the domain.
export default defineConfig({
  base: "/numbercontext/",
  plugins: [react(), tailwindcss()],
});
