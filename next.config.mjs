/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['rambunctiously-uncorroborative-timika.ngrok-free.dev', 'indexes-measures-chevy-molecular.trycloudflare.com'],
  images: {
    qualities: [75, 80, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
