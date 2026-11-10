import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: [
    "firebase-admin",
    "@google-cloud/firestore",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edukyu.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
