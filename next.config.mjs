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
      {
        protocol: 'https',
        hostname: 'static.asianpaints.com',
      },
      {
        protocol: 'https',
        hostname: 'northsolarscreen.com',
      },
      {
        protocol: 'https',
        hostname: 'tse4.mm.bing.net',
      },
    ],
  },
  // Allow tunneling services to access Next.js HMR safely
  allowedDevOrigins: [
    'transmitted-references-newman-leslie.trycloudflare.com',
    '7c87ec6caa249137-152-59-40-250.serveousercontent.com',
    'slimy-bobcats-dance.loca.lt'
  ],
};

export default nextConfig;
