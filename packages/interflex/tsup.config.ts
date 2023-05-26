import { defineConfig } from "tsup";

const isDev = process.env.npm_lifecycle_event === "dev";

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    "src/bin/index.ts",
    "src/lib/index.ts",
    "src/lib/next.ts",
    "src/lib/react.ts",
  ],
  format: ["esm"],
  minify: !isDev,
  metafile: !isDev,
  sourcemap: true,
  target: "esnext",
  outDir: "dist",
  onSuccess: isDev
    ? "node dist/index.js"
    : "tsc --emitDeclarationOnly --declaration",
});
