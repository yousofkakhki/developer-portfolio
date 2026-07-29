function hasCompleteTranslation(blog, locale) {
  return ['title', 'description', 'content'].every(
    field => typeof blog?.[field]?.[locale] === 'string' && blog[field][locale].trim().length > 0
  );
}

function availableBlogLocales(blog, locales) {
  if (blog?.published === false) return [];
  return locales.filter(locale => hasCompleteTranslation(blog, locale));
}

module.exports = { availableBlogLocales, hasCompleteTranslation };
