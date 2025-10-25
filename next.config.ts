import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.ko-fi.com",
        port: "",
        pathname: "/cdn/**",
      },
    ],
  },
};

export default nextConfig;
