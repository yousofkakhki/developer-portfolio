const test = require('node:test');
const assert = require('node:assert/strict');

const { availableBlogLocales, hasCompleteTranslation } = require('../utils/data/blog-locales.cjs');

const englishOnly = {
  title: { en: 'English title', fa: '' },
  description: { en: 'English description', fa: '' },
  seoTitle: { en: 'English SEO title', fa: '' },
  seoDescription: { en: 'English SEO description', fa: '' },
  content: { en: 'English body', fa: '' },
};

const bilingual = {
  title: { en: 'English title', fa: 'عنوان فارسی' },
  description: { en: 'English description', fa: 'توضیح فارسی' },
  seoTitle: { en: 'English SEO title', fa: 'عنوان سئوی فارسی' },
  seoDescription: { en: 'English SEO description', fa: 'توضیح سئوی فارسی' },
  content: { en: 'English body', fa: 'متن فارسی' },
};

test('requires display copy, SEO copy, and body for a translated locale', () => {
  assert.equal(hasCompleteTranslation(englishOnly, 'fa'), false);
  assert.equal(hasCompleteTranslation(bilingual, 'fa'), true);
});

test('does not publish a locale with body copy but incomplete localized SEO metadata', () => {
  assert.equal(hasCompleteTranslation({
    ...bilingual,
    seoDescription: { en: 'English SEO description', fa: '' },
  }, 'fa'), false);
});

test('publishes only locales with complete content', () => {
  assert.deepEqual(availableBlogLocales(englishOnly, ['en', 'fa']), ['en']);
  assert.deepEqual(availableBlogLocales(bilingual, ['en', 'fa']), ['en', 'fa']);
});

test('unpublished articles expose no locale routes', () => {
  assert.deepEqual(availableBlogLocales({ ...bilingual, published: false }, ['en', 'fa']), []);
});
