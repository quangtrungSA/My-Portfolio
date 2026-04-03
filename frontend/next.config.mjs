/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone" is used for Docker only, Vercel ignores it
  ...(process.env.DOCKER === "true" ? { output: "standalone" } : {}),
  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    return [
      {
        // Proxy all /api/* to backend EXCEPT /api/auth/* (handled by Next.js API routes)
        source: "/api/:path((?!auth/).*)",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
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
