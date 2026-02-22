/**
 * Vite configuration for the frontend application.
 *
 * - Registers the React plugin for JSX/TSX support.
 * - Proxies API requests to the backend during development.
 *
 * Vitest configuration lives in vitest.config.js — when vitest.config.js
 * exists it takes full priority over any `test:` block here.
 *
 * @type {import('vite').UserConfig}
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
