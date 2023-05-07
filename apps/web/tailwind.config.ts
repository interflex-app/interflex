import type { Config } from "tailwindcss";
import path from "path";

import baseConfig from "@interflex-app/ui/tailwind-config";

export default {
  content: [
    "./src/**/*.tsx",
    path.join(
      path.dirname(require.resolve("@interflex-app/ui")),
      "**/*.{ts,tsx}"
    ),
  ],
  presets: [baseConfig],
  theme: {
    extend: {
      backgroundImage: {
        pattern: "url('/assets/background.svg')",
      },
    },
  },
} satisfies Config;
