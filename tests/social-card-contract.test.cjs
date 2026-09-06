const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const routeFiles = [
  'app/[locale]/opengraph-image.js',
  'app/[locale]/projects/opengraph-image.js',
  'app/[locale]/projects/[slug]/opengraph-image.js',
  'app/[locale]/blog/opengraph-image.js',
  'app/[locale]/blog/[slug]/opengraph-image.js',
  'app/[locale]/blog/pillar/[pillar]/opengraph-image.js',
  'app/[locale]/work-with-me/opengraph-image.js',
];

test('locale, project, and article social cards are generated from canonical data at 1200 by 630', () => {
  for (const file of routeFiles) {
    const source = read(file);
    assert.match(source, /ImageResponse/);
    assert.match(source, /width:\s*1200/);
    assert.match(source, /height:\s*630/);
    assert.match(source, /contentType\s*=\s*['"]image\/png['"]/);
  }
  const project = read('app/[locale]/projects/[slug]/opengraph-image.js');
  const article = read('app/[locale]/blog/[slug]/opengraph-image.js');
  assert.match(project, /getProjectBySlug/);
  assert.match(article, /getLocalBlogBySlug/);
  assert.match(article, /article_type/);
});

test('social-card implementation is locale aware and contains no prohibited hardcoded claim', () => {
  const component = read('app/components/social-card.jsx');
  assert.match(component, /locale === 'fa'/);
  assert.match(component, /dir=/);
  assert.match(component, /safeTitleSize/);
  assert.doesNotMatch(component, /78%|99\.99|99\.999|10,000 viewers|1,000\+|LOWER COST|Blue Card without|under 80 ms/i);
});

test('metadata uses generated route images and no old public social PNG', () => {
  const sources = [
    'app/[locale]/layout.js',
    'app/[locale]/blog/[slug]/page.js',
    'app/[locale]/blog/page.js',
    'app/[locale]/blog/pillar/[pillar]/page.js',
    'app/[locale]/projects/[slug]/page.js',
    'app/[locale]/projects/page.js',
    'app/[locale]/work-with-me/page.js',
  ].map(read).join('\n');
  assert.doesNotMatch(sources, /\/og-default\.png|\/og-en\.png|\/og-fa\.png|\/blog\/og\//);
  assert.match(sources, /opengraph-image/);
});

test('technical article schema agrees with the visible technical article type', () => {
  const article = read('app/[locale]/blog/[slug]/page.js');
  const articleTypes = require('../utils/data/article-types.cjs');
  assert.match(article, /getArticleSchemaType/);
  assert.equal(articleTypes.getArticleSchemaType(articleTypes.ARTICLE_TYPES.productionCaseStudy), 'TechArticle');
  assert.equal(articleTypes.getArticleSchemaType(articleTypes.ARTICLE_TYPES.referenceArchitecture), 'TechArticle');
  assert.equal(articleTypes.getArticleSchemaType(articleTypes.ARTICLE_TYPES.siteEngineering), 'BlogPosting');
});
