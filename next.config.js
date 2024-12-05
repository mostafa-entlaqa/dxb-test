const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['rchwvfwjkxwivxsebmhd.supabase.co'], // Add your Supabase project URL here
  },
  output: 'export', // For static export
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ignore specific errors during build
  webpack: (config, { isServer }) => {
    config.optimization.minimize = false;
    config.optimization.minimizer = [];
    return config;
  },
}

module.exports = nextConfig

