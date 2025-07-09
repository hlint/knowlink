import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/integrations/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.OUTPUT_MODE as "standalone" | "export" | undefined,
  images: {
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

export default withNextIntl(nextConfig);
