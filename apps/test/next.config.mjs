import defineNextInterflexConfig from "./i18n/next-interflex-config.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@interflex-app/ui", "interflex"],
};

export default nextConfig;
