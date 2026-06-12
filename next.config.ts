import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://www.pyhgoshift.com';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/proxy/:path*',
        destination: `${backendUrl}/proxy/:path*`,
      },
    ]
  },
};

export default nextConfig;
