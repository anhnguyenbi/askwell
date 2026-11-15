// Bundles the widget into one minified IIFE and fails if it exceeds the size budget (project.md §3).
import { build } from "esbuild";
import console from "node:console";
import { statSync } from "node:fs";
import process from "node:process";

const OUTFILE = "dist/widget.js";
const MAX_BYTES = 5 * 1024;

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2018",
  outfile: OUTFILE,
});

const size = statSync(OUTFILE).size;
if (size > MAX_BYTES) {
  console.error(`${OUTFILE} is ${size} bytes, over the ${MAX_BYTES}-byte budget.`);
  process.exit(1);
}
console.log(`${OUTFILE}: ${size} bytes (budget ${MAX_BYTES}).`);
