/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone" is used for Docker only, Vercel ignores it
  ...(process.env.DOCKER === "true" ? { output: "standalone" } : {}),
  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    return {
      // afterFiles: checked AFTER Next.js pages/API routes
      // so /api/auth/* will be handled by app/api/auth/*/route.ts first
      afterFiles: [
        {
          source: "/api/auth/:path*",
          destination: "/api/auth/:path*", // keep local — handled by Next.js API routes
        },
      ],
      // fallback: only applied if no page/route AND no afterFiles match
      fallback: [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/api/:path*`,
        },
      ],
    };
  },
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
