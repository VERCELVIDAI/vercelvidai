/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Avoid deployment bails if ESLint is unconfigured or strict in cloud CI
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.mixkit.co' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
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
