import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // expo-sqlite@14 (installed peer) lacks ./kv-store subpath — stub it so
      // Vite can resolve it; vi.mock() in tests overrides it at runtime.
      "expo-sqlite/kv-store": path.resolve(__dirname, "tests/__mocks__/expo-sqlite-kv-store.ts"),
    },
  },
});
