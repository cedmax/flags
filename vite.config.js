import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
    manifest: true,
    // modules/set-redirects.js needs every flag SVG to be emitted as its own
    // hashed file (so it can look each one up in the manifest); inlining
    // small ones as data URIs would silently break those redirects.
    assetsInlineLimit: 0,
  },
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.spec.js"],
    exclude: ["node_modules", "build"],
  },
});
