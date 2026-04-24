import type { NextConfig } from 'next'

const nextConfig = {
  images: {
    // This tells Next.js NOT to optimize images and just use the URL as-is
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}
export default nextConfig;