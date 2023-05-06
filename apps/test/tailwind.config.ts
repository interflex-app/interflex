import type { Config } from "tailwindcss";

import baseConfig from "tailwindcss-config";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
} satisfies Config;
