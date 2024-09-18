/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io"],
  },
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
