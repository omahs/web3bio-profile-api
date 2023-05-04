/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  redirects: async () => [
    {
      source: "/api/:path*",
      destination: "/:path*",
      permanent: true,
    },
  ],
  rewrites: async () => ({
    beforeFiles: [
      {
        source: "/:path*",
        destination: "/api/:path*",
      },
    ],
  }),
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: "*" },
      ],
    },
  ],
}

module.exports = nextConfig
