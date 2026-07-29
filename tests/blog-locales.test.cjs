const test = require('node:test');
const assert = require('node:assert/strict');

const { availableBlogLocales, hasCompleteTranslation } = require('../utils/data/blog-locales.cjs');

const englishOnly = {
  title: { en: 'English title', fa: '' },
  description: { en: 'English description', fa: '' },
  content: { en: 'English body', fa: '' },
};

const bilingual = {
  title: { en: 'English title', fa: 'عنوان فارسی' },
  description: { en: 'English description', fa: 'توضیح فارسی' },
  content: { en: 'English body', fa: 'متن فارسی' },
};

test('requires title, description, and body for a translated locale', () => {
  assert.equal(hasCompleteTranslation(englishOnly, 'fa'), false);
  assert.equal(hasCompleteTranslation(bilingual, 'fa'), true);
});

test('publishes only locales with complete content', () => {
  assert.deepEqual(availableBlogLocales(englishOnly, ['en', 'fa']), ['en']);
  assert.deepEqual(availableBlogLocales(bilingual, ['en', 'fa']), ['en', 'fa']);
});

test('unpublished articles expose no locale routes', () => {
  assert.deepEqual(availableBlogLocales({ ...bilingual, published: false }, ['en', 'fa']), []);
});
