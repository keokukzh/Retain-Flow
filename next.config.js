/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages Functions configuration
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Remove static export - use Cloudflare Pages Functions
  trailingSlash: true,
  images: {
    domains: ['localhost', 'aidevelo.ai'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // Required for Cloudflare Pages
  },
  // Optimize for Cloudflare Pages Functions
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        assert: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
    }
    
    return config;
  },
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // CORS headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
