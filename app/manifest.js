export default function manifest() {
  return {
    name: 'Yousef Kakhki — System Architect & Technical Lead',
    short_name: 'Yousef Kakhki',
    description: 'Systems architecture, real-time platforms, AI systems, and infrastructure.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#071018',
    theme_color: '#071018',
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/brand/app-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  };
}
