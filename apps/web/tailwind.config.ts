import type { Config } from "tailwindcss";

import baseConfig from "@interflex-app/ui/tailwind-config";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
} satisfies Config;
