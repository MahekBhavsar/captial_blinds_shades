/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ashwoodblinds.com.au',
      },
      {
        protocol: 'https',
        hostname: 'www.norwichsunblinds.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'tse1.mm.bing.net',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
      {
        protocol: 'https',
        hostname: 'usshuttersandblinds.com',
      },
    ],
  },
};

export default nextConfig;
