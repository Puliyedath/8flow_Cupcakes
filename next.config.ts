import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v2/:path*',
        destination: '/api/:path*', // Maps requests from /api/v1 to /api
      }
    ]
  }
};

export default nextConfig;
