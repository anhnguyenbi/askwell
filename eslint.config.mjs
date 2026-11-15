import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  globalIgnores([".agents/**", ".claude/**", ".jsmhq/**", "**/node_modules/**", "**/.next/**", "**/dist/**", "**/coverage/**", "**/next-env.d.ts"]),
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ["apps/web/**/*.{ts,tsx,js,jsx,mjs}"],
    extends: [...nextVitals, ...nextTs],
    settings: { next: { rootDir: "apps/web" } },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);
