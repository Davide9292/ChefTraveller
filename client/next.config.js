// client/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 
  images: {
    domains: ['randomuser.me'], // Add any other domains you're using for images
  },
};

module.exports = nextConfig;