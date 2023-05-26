await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@interflex-app/ui", "interflex-internal"],
};
export default config;
