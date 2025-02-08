/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' cdnjs.cloudflare.com;",
              "style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com;",
              "img-src 'self' data: blob: cdnjs.cloudflare.com res.cloudinary.com;",
              "connect-src 'self' blob: cdnjs.cloudflare.com res.cloudinary.com localhost:* api.opensignlabs.com;",
              "worker-src 'self' blob: cdnjs.cloudflare.com;",
              "object-src 'self' data: blob:;",
              "frame-ancestors 'none';",
              "base-uri 'self';",
              "form-action 'self';",
            ].join(" "),
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  images: {
    domains: ["cdnjs.cloudflare.com", "res.cloudinary.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
