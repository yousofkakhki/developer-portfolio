const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const bannedPublicPatterns = [
  /Architecting solutions\. Leading transformation\./i,
  /If you have any questions or concerns/i,
  /\b1 months ago\b/i,
  /\b78%\b/,
  /\b99\.9%\b/,
  /sub-100\s*ms/i,
  /transparent(?:ly)?\s+(?:switching|switch)/i,
  /HLS fallback/i,
  /Jul 2025 - Nov 2025/i,
  /Sep 2025 - Present/i,
  /\bReact 18\b/i,
  /This portfolio is open source/i,
  /این پورتفولیو متن‌باز است/,
];

const bannedRepositoryPatterns = [
  /under\s+80\s*ms/i,
  /کمتر از\s*۸۰\s*میلی[‌\s-]*ثانیه/,
  /200\+\s*exhibitors/i,
  /unsupported latency figures are intentionally omitted/i,
  /this is an award claim/i,
  /selected public facts are evidence-bounded/i,
  /10\+\s+across/i,
  /(?:10|۱۰)\+\s*تجربه/,
  /System Architect & Technical Lead/i,
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function checkText(relativePath, text, violations, patterns = bannedPublicPatterns) {
  for (const pattern of patterns) {
    if (pattern.test(text)) violations.push(`${relativePath}: ${pattern}`);
  }
}

function checkDirectory(relativePath, extensions, violations, patterns = bannedPublicPatterns) {
  const directory = path.join(root, relativePath);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const child = path.join(relativePath, entry.name);
    if (entry.isDirectory()) {
      checkDirectory(child, extensions, violations, patterns);
    } else if (extensions.some(extension => entry.name.endsWith(extension))) {
      if (child === 'utils/data/career-facts.js') continue;
      checkText(child, read(child), violations, patterns);
    }
  }
}

function checkPublishedBlogs(violations) {
  const directory = path.join(root, 'content/blogs');
  for (const filename of fs.readdirSync(directory).filter(name => name.endsWith('.json'))) {
    const relativePath = path.join('content/blogs', filename);
    const article = JSON.parse(read(relativePath));
    if (article.draft || article.published === false) continue;
    checkText(relativePath, [article.title?.en, article.description?.en, article.content?.en].filter(Boolean).join('\n'), violations);
  }
}

function run() {
  const violations = [];
  const careerFacts = read('utils/data/career-facts.js');
  const factCheck = read('docs/content-fact-check.md');

  checkDirectory('app', ['.js', '.jsx', '.ts', '.tsx', '.json'], violations);
  checkDirectory('messages', ['.json'], violations);
  checkDirectory('utils/data', ['.js', '.jsx', '.json'], violations);
  checkPublishedBlogs(violations);

  checkDirectory('app', ['.js', '.jsx', '.ts', '.tsx', '.json'], violations, bannedRepositoryPatterns);
  checkDirectory('messages', ['.json'], violations, bannedRepositoryPatterns);
  checkDirectory('utils', ['.js', '.jsx', '.ts', '.tsx', '.json'], violations, bannedRepositoryPatterns);
  checkDirectory('content', ['.json', '.md'], violations, bannedRepositoryPatterns);
  checkDirectory('public', ['.svg', '.txt', '.xml', '.json', '.webmanifest'], violations, bannedRepositoryPatterns);
  checkText('utils/data/career-facts.js', careerFacts, violations, bannedRepositoryPatterns);

  if (!careerFacts.includes("en: 'Senior Backend Engineer & Technical Lead'")) {
    violations.push('canonical primary title is missing');
  }
  if (!careerFacts.includes('HLS playback was a separate post-session path available hours later')) {
    violations.push('canonical delayed-HLS wording is missing');
  }
  if (!factCheck.includes('HonarAmoozesh engagement dates')) {
    violations.push('unresolved HonarAmoozesh date record is missing');
  }
  if (!read('public/blog/webrtc-scale.svg').includes('available hours later')) {
    violations.push('WebRTC cover does not state delayed playback');
  }

  if (violations.length > 0) {
    process.stderr.write(`${violations.join('\n')}\n`);
    return 1;
  }

  process.stdout.write('content integrity: passed\n');
  return 0;
}

if (require.main === module) process.exitCode = run();
module.exports = { run };
