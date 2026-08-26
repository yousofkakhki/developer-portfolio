const CRYPTO_FIAT_PROJECT_SLUG = 'crypto-fiat-payment-gateway';
const HISTORICAL_CRYPTO_FIAT_ARTICLE_SLUGS = Object.freeze([
  'fivenines-cryptofiat-gateway-with-idempotency-keys',
  'idempotent-cryptofiat-gateway-in-frankfurt',
]);

const historicalArticleRedirects = Object.freeze(
  ['en', 'fa'].flatMap(locale => HISTORICAL_CRYPTO_FIAT_ARTICLE_SLUGS.map(slug => ({
    source: `/${locale}/blog/${slug}`,
    destination: `/${locale}/projects/${CRYPTO_FIAT_PROJECT_SLUG}`,
    permanent: true,
  }))),
);

module.exports = {
  CRYPTO_FIAT_PROJECT_SLUG,
  HISTORICAL_CRYPTO_FIAT_ARTICLE_SLUGS,
  historicalArticleRedirects,
};
