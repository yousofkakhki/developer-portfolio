const PUBLIC_REPOSITORY = 'public-repository';
const REPOSITORY = 'repository';
const PRODUCTION_SOURCE = 'production-source';

function absoluteUrl(siteUrl, value) {
  if (/^https?:\/\//i.test(value || '')) return value;
  return new URL(value, `${siteUrl.replace(/\/$/, '')}/`).toString();
}

function getApprovedPrimaryMedia(project) {
  return (project?.media || []).find(media => (
    media.primary === true &&
    media.publicApproved === true &&
    media.sensitive !== true &&
    media.src &&
    Number.isFinite(media.width) &&
    Number.isFinite(media.height) &&
    media.alt &&
    media.caption
  ));
}

function getApprovedProductionRepository(project) {
  if (project?.sourceAvailability !== PUBLIC_REPOSITORY) return null;
  return (project.artifacts || []).find(artifact => (
    artifact.ownerApproved === true &&
    artifact.type === REPOSITORY &&
    artifact.relationship === PRODUCTION_SOURCE &&
    /^https?:\/\//i.test(artifact.url || '')
  )) || null;
}

function buildProjectCaseStudyGraph({ project, category, locale, siteUrl, projectsLabel }) {
  const baseUrl = siteUrl.replace(/\/$/, '');
  const pageUrl = `${baseUrl}/${locale}/projects/${project.slug}`;
  const imageId = `${pageUrl}#primary-image`;
  const socialImageUrl = `${pageUrl}/opengraph-image`;
  const primary = getApprovedPrimaryMedia(project);
  if (!primary) throw new Error(`${project.slug}: approved primary media is required for project schema.`);

  const article = {
    '@type': 'TechArticle',
    '@id': `${pageUrl}#case-study`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    name: project.name,
    headline: project.name,
    description: project.description,
    url: pageUrl,
    inLanguage: locale === 'fa' ? 'fa-IR' : 'en-US',
    author: { '@id': `${baseUrl}/#person` },
    publisher: { '@id': `${baseUrl}/#person` },
    keywords: (project.tools || []).join(', '),
    about: category,
    image: { '@id': imageId },
    thumbnailUrl: socialImageUrl,
    isPartOf: { '@id': `${baseUrl}/#website` },
  };

  const image = {
    '@type': 'ImageObject',
    '@id': imageId,
    url: absoluteUrl(baseUrl, primary.src),
    contentUrl: absoluteUrl(baseUrl, primary.src),
    width: primary.width,
    height: primary.height,
    name: primary.alt,
    caption: primary.caption,
    thumbnailUrl: socialImageUrl,
  };

  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'fa' ? 'خانه' : 'Home',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: projectsLabel,
        item: `${baseUrl}/${locale}/projects`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.name,
        item: pageUrl,
      },
    ],
  };

  const graph = [article, image, breadcrumbs];
  const repository = getApprovedProductionRepository(project);
  if (repository) {
    graph.push({
      '@type': 'SoftwareSourceCode',
      '@id': `${pageUrl}#source-code`,
      name: repository.label || project.name,
      description: repository.description || project.description,
      codeRepository: repository.url,
      url: repository.url,
      author: { '@id': `${baseUrl}/#person` },
      isPartOf: { '@id': `${pageUrl}#case-study` },
      ...(repository.license && { license: repository.license }),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

module.exports = {
  buildProjectCaseStudyGraph,
  getApprovedPrimaryMedia,
  getApprovedProductionRepository,
};
