const path = require('path')
const createNextIntlPlugin = require('next-intl/plugin');
const { PROJECT_PUBLICATION_TYPES, projectPublicationManifest } = require('./utils/data/project-publication-manifest.cjs');
const { historicalArticleRedirects } = require('./utils/data/legacy-route-manifest.cjs');
 
const withNextIntl = createNextIntlPlugin('./i18n.js');

module.exports = withNextIntl({
  async redirects() {
    const locales = ['en', 'fa'];
    const projectRedirects = locales.flatMap(locale => projectPublicationManifest.flatMap(project => {
      const destination = project.publicationType === PROJECT_PUBLICATION_TYPES.caseStudy
        ? `/${locale}/projects/${project.slug}`
        : `/${locale}/projects#project-${project.slug}`;
      const redirects = [
        { source: `/${locale}/projects/${project.id}`, destination, permanent: true },
      ];
      if (project.publicationType === PROJECT_PUBLICATION_TYPES.projectSnapshot) {
        redirects.push({ source: `/${locale}/projects/${project.slug}`, destination, permanent: true });
      }
      return redirects;
    }));
    const thinPillarRedirects = locales.flatMap(locale => [
      { source: `/${locale}/blog/pillar/pwa-product`, destination: `/${locale}/blog`, permanent: true },
      { source: `/${locale}/blog/pillar/systems-edge`, destination: `/${locale}/blog`, permanent: true },
      { source: `/${locale}/blog/pillar/site-engineering`, destination: `/${locale}/blog`, permanent: true },
    ]);
    return [...projectRedirects, ...thinPillarRedirects, ...historicalArticleRedirects];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.dev.to',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media2.dev.to',
        pathname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Performance optimizations
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Keep canonical SEO metadata in <head> for every crawler and audit user agent.
  htmlLimitedBots: /.*/,
  // Performance optimizations
  // Note: swcMinify is enabled by default in Next.js 15+
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn logs
    } : false,
  },
  // Optimize production builds
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Tree shaking optimizations
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Keep the heavy 3D runtime out of the initial shared vendor bundle.
            avatarVrm: {
              name: 'avatar-vrm',
              chunks: 'async',
              test: /[\\/]node_modules[\\/](three|@pixiv)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Vendor chunk for large libraries
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
})
