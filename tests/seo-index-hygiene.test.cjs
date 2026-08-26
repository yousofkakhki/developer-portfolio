const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const {
  CRYPTO_FIAT_PROJECT_SLUG,
  HISTORICAL_CRYPTO_FIAT_ARTICLE_SLUGS,
  historicalArticleRedirects,
} = require('../utils/data/legacy-route-manifest.cjs');
const { siteRouteManifest } = require('../utils/data/site-route-manifest.cjs');

test('historical unsupported crypto-fiat articles have localized permanent redirects', () => {
  assert.equal(historicalArticleRedirects.length, HISTORICAL_CRYPTO_FIAT_ARTICLE_SLUGS.length * 2);
  for (const locale of ['en', 'fa']) {
    for (const slug of HISTORICAL_CRYPTO_FIAT_ARTICLE_SLUGS) {
      assert.deepEqual(
        historicalArticleRedirects.find(redirect => redirect.source === `/${locale}/blog/${slug}`),
        {
          source: `/${locale}/blog/${slug}`,
          destination: `/${locale}/projects/${CRYPTO_FIAT_PROJECT_SLUG}`,
          permanent: true,
        },
      );
      assert.equal(fs.existsSync(path.join(root, 'content/blogs', `${slug}.json`)), false);
    }
  }

  const nextConfig = read('next.config.js');
  assert.match(nextConfig, /historicalArticleRedirects/);
});

test('route modification dates are explicit stable content data', () => {
  assert.deepEqual(siteRouteManifest.map(route => route.path), ['', '/blog', '/projects', '/work-with-me']);
  for (const route of siteRouteManifest) {
    assert.match(route.lastModified, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(Number.isNaN(Date.parse(route.lastModified)), false);
  }
  const sitemap = read('app/sitemap.js');
  assert.match(sitemap, /project\.updatedAt/);
  assert.match(sitemap, /blog\.updated_at \|\| blog\.published_at/);
  assert.doesNotMatch(sitemap, /new Date\(\)/);
});

test('metadata titles use one locale-appropriate brand suffix', () => {
  const layout = read('app/[locale]/layout.js');
  const work = read('app/[locale]/work-with-me/page.js');
  const projects = read('app/[locale]/projects/[slug]/page.js');
  const blogIndex = read('app/[locale]/blog/page.js');
  const pillar = read('app/[locale]/blog/pillar/[pillar]/page.js');

  assert.match(layout, /localized\(careerFacts\.identity\.localizedName, locale\)/);
  assert.match(layout, /template:\s*`%s \| \$\{ownerName\}`/);
  assert.match(work, /metadataTitle:/);
  assert.match(work, /title:\s*text\.metadataTitle/);
  assert.match(projects, /title:\s*`\$\{project\.name\} \| \$\{ownerName\}`/);
  assert.match(blogIndex, /'x-default':\s*`\$\{siteUrl\}\/en\/blog`/);
  assert.match(pillar, /locale:\s*'en_US'/);
});

test('published article SEO titles remain unique and within the rendered title limit', () => {
  const blogDirectory = path.join(root, 'content/blogs');
  const titles = [];
  for (const file of fs.readdirSync(blogDirectory).filter(file => file.endsWith('.json'))) {
    const blog = JSON.parse(fs.readFileSync(path.join(blogDirectory, file), 'utf8'));
    if (blog.published === false || blog.draft) continue;
    for (const locale of ['en', 'fa']) {
      const title = blog.seoTitle?.[locale];
      const content = blog.content?.[locale];
      if (!title || !content) continue;
      const owner = locale === 'fa' ? 'یوسف کاخکی' : 'Yousef Kakhki';
      const renderedTitle = `${title} | ${owner}`;
      assert.ok(renderedTitle.length <= 80, `${blog.slug}:${locale} is ${renderedTitle.length} characters`);
      titles.push(renderedTitle);
    }
  }
  assert.equal(new Set(titles).size, titles.length);
});

test('SEO health check audits titles, alternate targets, schema language, and stale routes', () => {
  const source = read('scripts/seo-health-check.cjs');
  for (const marker of [
    'duplicate_title_brand',
    'mixed_title_brand',
    'title_length',
    'duplicate_titles',
    'hreflang_status',
    'structured_data_language',
    'sitemap_historical_url',
    'sitemap_snapshot_url',
    'historical_redirect',
  ]) assert.match(source, new RegExp(marker));
});
