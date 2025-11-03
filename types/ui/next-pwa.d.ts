declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: unknown[];
    buildExcludes?: string[];
    publicExcludes?: string[];
    fallbacks?: Record<string, string>;
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    swcMinify?: boolean;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    workboxOptions?: unknown;
  }

  function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
