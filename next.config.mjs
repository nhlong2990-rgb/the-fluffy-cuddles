/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    outputFileTracingIncludes: {
      "/api/admin/seed": ["./prisma/seed-data.json", "./prisma/seed-images/**/*"],
    },
  },
};

export default nextConfig;
