export const projectCatalog = [
  {
    id: 1,
    slug: 'ai-hologram-realtime-backend',
    images: ['/ai-1.jpg', '/ai-2.jpg', '/ai-3.jpg'],
    visualKind: 'ai',
    featured: true,
  },
  {
    id: 2,
    slug: 'investment-analytics-platform',
    images: [],
    visualKind: 'analytics',
    featured: true,
  },
  {
    id: 3,
    slug: 'crypto-fiat-payment-gateway',
    images: [],
    visualKind: 'payments',
    featured: true,
  },
  {
    id: 4,
    slug: 'realtime-game-platform',
    images: ['/game-1.jpg'],
    visualKind: 'realtime',
  },
  {
    id: 5,
    slug: 'embedded-linux-ota',
    images: ['/ota-1.jpg', '/ota-2.jpg', '/ota-3.jpg'],
    visualKind: 'embedded',
  },
  {
    id: 6,
    slug: 'learning-platform',
    images: [],
    visualKind: 'learning',
  },
  {
    id: 7,
    slug: 'transaction-ledger-system',
    images: [],
    visualKind: 'ledger',
  },
  {
    id: 8,
    slug: 'blockchain-backend-platform',
    images: [],
    visualKind: 'blockchain',
  },
];

export const getProjectById = (id) => projectCatalog.find(project => project.id === Number(id));
export const getProjectBySlug = (slug) => projectCatalog.find(project => project.slug === slug);
