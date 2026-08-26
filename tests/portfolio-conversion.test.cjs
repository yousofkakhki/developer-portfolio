const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const messages = (locale) => JSON.parse(read(`messages/${locale}.json`));

test('project publication manifest distinguishes three case studies from five snapshots', () => {
  const { PROJECT_PUBLICATION_TYPES, projectPublicationManifest } = require('../utils/data/project-publication-manifest.cjs');
  const caseStudies = projectPublicationManifest.filter(project => project.publicationType === PROJECT_PUBLICATION_TYPES.caseStudy);
  const snapshots = projectPublicationManifest.filter(project => project.publicationType === PROJECT_PUBLICATION_TYPES.projectSnapshot);
  const catalog = read('utils/data/project-catalog.js');
  const card = read('app/components/homepage/projects/project-card.jsx');
  const visual = read('app/components/homepage/projects/project-visual.jsx');

  assert.equal(caseStudies.length, 3);
  assert.equal(snapshots.length, 5);
  assert.doesNotMatch(catalog, /\/png\/placeholder\.png/);
  assert.match(card, /ProjectVisual/);
  assert.match(card, /data-project-media-state/);
  assert.match(visual, /data-project-visual="case-study"/);
  assert.match(visual, /aria-hidden="true"/);
});

test('homepage features only genuine case studies and links to the server-rendered work index', () => {
  const listing = read('app/components/homepage/projects/index.jsx');
  const card = read('app/components/homepage/projects/project-card.jsx');

  assert.match(listing, /caseStudyProjects\.map/);
  assert.doesNotMatch(listing, /useState|aria-expanded|t\.raw/);
  assert.match(listing, /href=\{`\/\$\{language\}\/projects`\}/);
  assert.match(listing, /min-h-\[44px\]/);
  assert.match(card, /<ul[^>]+aria-label=\{t\('technology'\)\}/);
  assert.match(card, /<li/);

  for (const locale of ['en', 'fa']) {
    const projectCopy = messages(locale).projects;
    assert.ok(projectCopy.viewAllProjects);
    assert.ok(projectCopy.caseStudyLabel);
    assert.ok(projectCopy.snapshotLabel);
    assert.ok(projectCopy.readCaseStudy);
  }
});

test('only case studies have detail routes and sitemap entries; snapshots remain index entries', () => {
  const page = read('app/[locale]/projects/[slug]/page.js');
  const index = read('app/[locale]/projects/page.js');
  const sitemap = read('app/sitemap.js');
  const nextConfig = read('next.config.js');

  assert.match(page, /generateStaticParams/);
  assert.match(page, /dynamicParams\s*=\s*false/);
  assert.match(page, /caseStudyProjects\.map/);
  assert.match(page, /generateMetadata/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /project_case_study_view/);
  assert.doesNotMatch(page, /fallbackSections|confidentialityNote|permanentRedirect/);
  assert.match(page, /brand-case-study-grid/);
  assert.match(page, /'@type': 'CreativeWork'/);
  assert.match(index, /projectCatalog\.map/);
  assert.match(index, /isCaseStudyProject/);
  assert.match(index, /<article className="brand-project-index__link brand-project-index__link--snapshot">/);
  assert.match(index, /id=\{`project-\$\{project\.slug\}`\}/);
  assert.match(sitemap, /caseStudyProjects/);
  assert.doesNotMatch(sitemap, /projectCatalog\.flatMap/);
  assert.match(sitemap, /project\.slug/);
  assert.match(nextConfig, /project-publication-manifest\.cjs/);
  assert.match(nextConfig, /projects#project-\$\{project\.slug\}/);
});

test('recruiter page provides role discussion and résumé actions in its opening header', () => {
  const page = read('app/[locale]/work-with-me/page.js');
  const headerStart = page.indexOf('<header');
  const headerEnd = page.indexOf('</header>');
  const header = page.slice(headerStart, headerEnd);

  assert.match(header, /text\.topCta/);
  assert.match(header, /careerFacts\.resume\.publicUrl/);
  assert.match(header, /work_with_me_contact/);
  assert.match(header, /resume_download/);
  assert.match(header, /min-h-\[44px\]/);
  for (const marker of ['topCta', 'downloadResume', 'availability']) assert.match(page, new RegExp(`\\b${marker}\\b`));
});

test('portfolio evidence views and contact actions are allowlisted for first-party measurement', () => {
  const analytics = read('app/api/analytics/route.js');
  assert.match(analytics, /'project_case_study_view'/);
  assert.match(analytics, /'project_case_study_contact'/);
});

test('project metadata emits exactly one branded document-title suffix', () => {
  const page = read('app/[locale]/projects/[slug]/page.js');
  const metadata = page.slice(page.indexOf('return {'), page.indexOf('openGraph:'));
  assert.match(metadata, /title:\s*project\.name/);
  assert.doesNotMatch(metadata, /title:\s*\{\s*absolute/);
});

test('experience stays recruiter-focused while earlier roles remain available accessibly', () => {
  const experience = read('app/components/homepage/experience/index.jsx');

  assert.match(experience, /featuredExperienceCount\s*=\s*3/);
  assert.match(experience, /expanded \? experiences : experiences\.slice\(0, featuredExperienceCount\)/);
  assert.match(experience, /aria-expanded=\{expanded\}/);
  assert.match(experience, /aria-controls="experience-list"/);
  assert.match(experience, /min-h-\[44px\]/);

  for (const locale of ['en', 'fa']) {
    const copy = messages(locale).experience;
    assert.ok(copy.viewEarlierRoles);
    assert.ok(copy.showFewerRoles);
  }
});
