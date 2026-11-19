/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  eslint: {
    // Avoid deployment bails if ESLint is unconfigured or strict in cloud CI
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'pdf-lib',
      '@supabase/supabase-js',
      '@supabase/ssr',
      'clsx',
      'tailwind-merge',
      'zustand',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.mixkit.co' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2|ttf|otf|mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },
  env: {
    PAYU_MERCHANT_KEY: process.env.PAYU_MERCHANT_KEY || 'wogXBT',
    PAYU_MERCHANT_SALT: process.env.PAYU_MERCHANT_SALT || 'FBM1jRW3CHwOtrdXELuunFFbAyy2IZlF',
    PAYU_KEY: process.env.PAYU_KEY || 'wogXBT',
    PAYU_SALT: process.env.PAYU_SALT || 'FBM1jRW3CHwOtrdXELuunFFbAyy2IZlF',
    PAYU_ENV: process.env.PAYU_ENV || 'production',
    NEXT_PUBLIC_PAYU_ENV: process.env.NEXT_PUBLIC_PAYU_ENV || 'production',
  },
};

export default nextConfig;
