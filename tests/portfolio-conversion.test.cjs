const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const messages = (locale) => JSON.parse(read(`messages/${locale}.json`));

test('project listing replaces generic placeholders with an honest branded architecture-brief visual', () => {
  const catalog = read('utils/data/project-catalog.js');
  const card = read('app/components/homepage/projects/project-card.jsx');
  const visual = read('app/components/homepage/projects/project-visual.jsx');

  assert.doesNotMatch(catalog, /\/png\/placeholder\.png/);
  assert.match(card, /ProjectVisual/);
  assert.match(card, /data-project-media-state/);
  assert.match(visual, /architectureBrief/);
  assert.match(visual, /aria-hidden="true"/);
});

test('project listing starts focused and can reveal the complete portfolio accessibly', () => {
  const listing = read('app/components/homepage/projects/index.jsx');

  assert.match(listing, /featuredProjectCount\s*=\s*3/);
  assert.match(listing, /expanded \? projects : projects\.slice\(0, featuredProjectCount\)/);
  assert.match(listing, /aria-expanded=\{expanded\}/);
  assert.match(listing, /aria-controls="project-list"/);
  assert.match(listing, /min-h-\[44px\]/);

  for (const locale of ['en', 'fa']) {
    const projectCopy = messages(locale).projects;
    assert.ok(projectCopy.viewAllProjects);
    assert.ok(projectCopy.showFewerProjects);
    assert.ok(projectCopy.caseStudy);
    assert.ok(projectCopy.architectureBrief);
  }
});

test('every public project has a bilingual evidence route and sitemap entry', () => {
  const page = read('app/[locale]/projects/[slug]/page.js');
  const sitemap = read('app/sitemap.js');
  const card = read('app/components/homepage/projects/project-card.jsx');

  assert.match(page, /generateStaticParams/);
  assert.match(page, /generateMetadata/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /project_case_study_view/);
  assert.match(page, /ProjectPage/);
  assert.match(page, /confidentialityNote/);
  assert.match(page, /brand-case-study-grid/);
  assert.match(page, /relatedWriting/);
  assert.match(sitemap, /project-catalog/);
  assert.match(sitemap, /project\.slug/);
  assert.match(card, /\/projects\/\$\{project\.slug\}/);
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
  assert.match(metadata, /title:\s*\{\s*absolute:\s*`\$\{project\.name\}\s*\|\s*Yousef Kakhki`/);
  assert.doesNotMatch(metadata, /title:\s*project\.name/);
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
