const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = relativePath => fs.existsSync(path.join(root, relativePath));

const expectedArticleFiles = [
  'ai-enhanced-sfu-for-low-latency-streaming.json',
  'building-bilingual-portfolio.json',
  'ebpf-probes-for-faster-ota-fault-detection.json',
  'eu-scale-livekit-sfu-clustering-in-frankfurt.json',
  'honar-amoozesh-5000-concurrent-webrtc-case-study.json',
  'hybrid-room-scalability-blog.json',
];

test('current public source tree contains only eligible evidence-bounded articles and no client screenshot', () => {
  const files = fs.readdirSync(path.join(root, 'content/blogs'))
    .filter(file => file.endsWith('.json'))
    .sort();
  assert.deepEqual(files, expectedArticleFiles);

  for (const file of files) {
    const article = JSON.parse(read(`content/blogs/${file}`));
    assert.notEqual(article.published, false, `${file} must be publication eligible`);
    assert.notEqual(article.draft, true, `${file} must not be a draft`);
    assert.equal(typeof article.articleType, 'string', `${file} requires an explicit article type`);
  }

  const copy = files.map(file => read(`content/blogs/${file}`)).join('\n');
  assert.doesNotMatch(copy, /I will deliver a complete technical blog post|in Yousef Kakhki.?s voice/i);
  assert.doesNotMatch(copy, /job offer is for|Blue Card|7,000 EU job listings|78% cost reduction|10,000 concurrent viewers/i);
  assert.equal(exists('Pasted image.png'), false);
});

test('canonical contact data has no dormant template identities or placeholder social fields', () => {
  assert.equal(exists('utils/data/contactsData.js'), false);
  assert.equal(exists('utils/data/personal-data.js'), false);

  const consumers = [
    'app/components/footer.jsx',
    'app/components/homepage/contact/index.jsx',
    'app/[locale]/work-with-me/page.js',
  ].map(read).join('\n');
  assert.match(consumers, /careerFacts\.contact\.email/);
  assert.doesNotMatch(consumers, /personalData|contactsData/);

  const currentTree = [
    'app', 'utils', 'messages',
  ].flatMap(entry => {
    const absolute = path.join(root, entry);
    if (!fs.existsSync(absolute)) return [];
    if (fs.statSync(absolute).isFile()) return [read(entry)];
    const stack = [absolute];
    const content = [];
    while (stack.length) {
      const directory = stack.pop();
      for (const name of fs.readdirSync(directory)) {
        const target = path.join(directory, name);
        const stat = fs.statSync(target);
        if (stat.isDirectory()) stack.push(target);
        else if (/\.(?:js|jsx|cjs|mjs|json|md)$/.test(name)) content.push(fs.readFileSync(target, 'utf8'));
      }
    }
    return content;
  }).join('\n');
  assert.doesNotMatch(currentTree, /abusaid7388|said7388|github\.com\/yourusername|stackOverflow:\s*['"]asdf|leetcode:\s*['"]asdf|devUsername:\s*['"]josef/i);
});

test('README accurately presents the current portfolio without unsupported badges or template claims', () => {
  const readme = read('README.md');
  for (const required of [
    'https://kakhki.me',
    'Senior Backend Engineer & Technical Lead',
    'Next.js 15',
    'React 19',
    'App Router',
    'canonical evidence model',
    'case studies',
    'project snapshots',
    'npm test',
    'npm run lint',
    'npm run content:integrity',
    'npm run resume:check',
    'npm run build',
    'npm run links:check',
    'npm run seo:health',
    'npm run viewport:check',
    'npm run a11y:check',
    'scripts/audit-public-assets.cjs',
    'Docker Compose',
    '127.0.0.1:3000',
    'said7388/developer-portfolio',
    'no top-level `LICENSE`',
  ]) assert.match(readme, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

  assert.doesNotMatch(readme, /kakhki\.ir|yourusername|WCAG AA compliant|Lighthouse Score:\s*\d|Lighthouse[^\n]*90\+|Core Web Vitals:\s*All green|First Load JS:\s*~?463KB|Vercel compatible|Netlify compatible/i);
  assert.doesNotMatch(readme, /both proprietary and open|open[- ]source template/i);
});

test('companion repository plan defines three substantive no-URL specifications and publication gate', () => {
  const plan = read('docs/public-engineering-artifacts-plan.md');
  for (const repository of [
    'WebRTC role-transition control plane',
    'Idempotent payment workflow',
    'Atomic A/B OTA reference',
  ]) assert.match(plan, new RegExp(repository, 'i'));

  for (const heading of [
    'Scope', 'Exclusions', 'Architecture', 'Test plan', 'Security considerations',
    'License recommendation', 'README structure', 'CI checks',
    'Portfolio relationship', 'Owner approvals required before publishing',
  ]) assert.equal((plan.match(new RegExp(`^### ${heading}$`, 'gmi')) || []).length, 3, `${heading} must appear for all three specifications`);

  assert.doesNotMatch(plan, /https?:\/\/(?:www\.)?github\.com\//i);
  assert.match(plan, /at least two repositories/i);
  assert.match(plan, /substantive code/i);
  assert.match(plan, /pass CI/i);
  assert.match(plan, /clear licenses/i);
  assert.match(plan, /owner-approved/i);
  assert.match(plan, /externally verified/i);
  assert.match(plan, /Sanitized reference implementation — not client production source/);
});

test('owner actions capture external-profile, companion-publication, and Git-history decisions', () => {
  const actions = read('docs/owner-actions.md');
  for (const requirement of [
    'Yousef Kakhki',
    'Senior Backend Engineer & Technical Lead',
    'Remove the `Studying` status',
    'remove generated citation artifacts',
    'publish at least two approved companion repositories',
    'review the profile image and bio',
    'approvedForGlobalBranding',
    'deleting files from the current tree does not remove them from Git history',
    'keep the repository private',
    'sanitize Git history',
  ]) assert.match(actions, new RegExp(requirement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
});

test('fact register reflects removed testimonial imagery and continued non-publication', () => {
  const facts = read('docs/content-fact-check.md');
  assert.doesNotMatch(facts, /testimonial assets are retained/i);
  assert.match(facts, /testimonial images were removed from the current public tree/i);
  assert.match(facts, /exact issuer, date, wording, and permitted attribution/i);
});

test('security documentation describes implemented controls without unsupported compliance claims', () => {
  const security = read('SECURITY.md');
  assert.match(security, /implemented/i);
  assert.match(security, /not a penetration test|not a compliance certification/i);
  assert.match(security, /SMTP_AUTH_DISABLED/);
  assert.match(security, /timingSafeEqual/);
  assert.match(security, /microphone=\(self\)/);
  assert.doesNotMatch(security, /RFC 5322 compliant|Parameterized queries \(Nodemailer handles this\)|SameSite cookies \(if using cookies\)|Honeypot field support \(ready for implementation\)/i);
  assert.doesNotMatch(security, /contact@kakhki\.ir|your_password/);
});
