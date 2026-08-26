const BLOG_TRANSLATION_AVAILABILITY = Object.freeze({
  'honar-amoozesh-5000-concurrent-webrtc-case-study': Object.freeze(['en', 'fa']),
  'hybrid-room-scalability-nats-livekit': Object.freeze(['en', 'fa']),
  'building-bilingual-portfolio-nextjs': Object.freeze(['en', 'fa']),
  'ai-enhanced-sfu-for-low-latency-streaming': Object.freeze(['en']),
  'eu-scale-livekit-sfu-clustering-in-frankfurt': Object.freeze(['en']),
  'ebpf-probes-for-faster-ota-fault-detection': Object.freeze(['en']),
});

function getDeclaredBlogLocales(slug) {
  return BLOG_TRANSLATION_AVAILABILITY[slug] || [];
}

function getLocaleSwitchTarget(pathname, currentLocale, targetLocale) {
  const normalizedPath = String(pathname || '/').split(/[?#]/, 1)[0] || '/';
  if (currentLocale === targetLocale) {
    return { href: normalizedPath, exact: true, reason: null };
  }

  const pathWithoutLocale = normalizedPath.replace(/^\/(?:en|fa)(?=\/|$)/, '') || '/';
  const articleMatch = pathWithoutLocale.match(/^\/blog\/([^/]+)\/?$/);
  if (articleMatch) {
    const slug = articleMatch[1];
    if (getDeclaredBlogLocales(slug).includes(targetLocale)) {
      return { href: `/${targetLocale}/blog/${slug}`, exact: true, reason: null };
    }
    return {
      href: `/${targetLocale}/blog`,
      exact: false,
      reason: 'article-translation-unavailable',
    };
  }

  if (/^\/blog\/pillar(?:\/|$)/.test(pathWithoutLocale) && targetLocale !== 'en') {
    return {
      href: `/${targetLocale}/blog`,
      exact: false,
      reason: 'topic-translation-unavailable',
    };
  }

  return {
    href: `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
    exact: true,
    reason: null,
  };
}

module.exports = {
  BLOG_TRANSLATION_AVAILABILITY,
  getDeclaredBlogLocales,
  getLocaleSwitchTarget,
};
