import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '43.202.82.239',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lernix-bucket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
