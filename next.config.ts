import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.20.10.4"],
  webpack: (config, { isServer }) => {
    // Add path aliases for Turbopack compatibility
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@"] = "./";

    return config;
  },
};

// Only apply PWA wrapper when not using Turbopack
export default process.env.TURBOPACK
  ? nextConfig
  : withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === "development",
    })(nextConfig);
