/** @type {import('next').NextConfig} */

const nextConfig = {
  images: { domains: ["localhost"] },
  images: {
    remotePatterns: [{ hostname: "crm.homepapa.ca" }],
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.externals.push({ canvas: "commonjs canvas" });
    return config;
  },
};

export default nextConfig;

