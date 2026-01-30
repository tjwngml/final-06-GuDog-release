import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fesp-api.koyeb.app",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ddedslqvv/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/mypage",
        destination: "/mypage/profile",
      },
    ];
  },
};

export default nextConfig;
