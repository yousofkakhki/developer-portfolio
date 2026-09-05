const ARTICLE_TYPES = Object.freeze({
  productionCaseStudy: 'production-case-study',
  designGuide: 'design-guide',
  referenceArchitecture: 'reference-architecture',
  architectureEssay: 'architecture-essay',
  designHypothesis: 'design-hypothesis',
  siteEngineering: 'site-engineering',
});

const ARTICLE_TYPE_VALUES = Object.freeze(Object.values(ARTICLE_TYPES));

function isArticleType(value) {
  return ARTICLE_TYPE_VALUES.includes(value);
}

function getArticleSchemaType(value) {
  return value === ARTICLE_TYPES.siteEngineering ? 'BlogPosting' : 'TechArticle';
}

module.exports = {
  ARTICLE_TYPES,
  ARTICLE_TYPE_VALUES,
  getArticleSchemaType,
  isArticleType,
};
