await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@interflex-app/ui", "@interflex-app/shared"],
};
export default config;
