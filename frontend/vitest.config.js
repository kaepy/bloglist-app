import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true, // Enable global test APIs like `describe`, `test`, and `expect`
    environment: "jsdom", // Use jsdom for testing React components
    setupFiles: ["./testSetup.js"],
    css: true, // Enable CSS support in tests
    isolate: true, // Ensure test isolation
    mockReset: true, // Reset mocks between tests
  },
});
