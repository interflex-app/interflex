/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@interflex-app/ui", "interflex"],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pl"],
  },
};

module.exports = nextConfig;
