/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone" is used for Docker (Cloud Run)
  ...(process.env.DOCKER === "true" ? { output: "standalone" } : {}),
  // API proxy is handled in middleware.ts (not here)
  // to ensure /api/auth/* always reaches Next.js API routes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
