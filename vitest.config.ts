import { defineConfig } from "vitest/config";

export default defineConfig({ test: { include: ["src/app/game/**/*.test.ts"], environment: "node" } });
