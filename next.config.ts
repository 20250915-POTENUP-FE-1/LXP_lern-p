// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: '3.34.122.45',
//         port: '8080',
//         pathname: '/uploads/**',
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '3.34.122.45',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
    ],
    domains: ['example.com'],
  },
};

export default nextConfig;
