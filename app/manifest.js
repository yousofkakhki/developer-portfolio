export default function manifest() {
  return {
    name: 'Yousef Kakhki — Senior Backend Engineer & Technical Lead',
    short_name: 'Yousef Kakhki',
    description: 'Distributed systems, real-time media, and backend platforms.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#08111F',
    theme_color: '#08111F',
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
