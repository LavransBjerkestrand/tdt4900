/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ['dockerode'],
  },
}

module.exports = nextConfig
