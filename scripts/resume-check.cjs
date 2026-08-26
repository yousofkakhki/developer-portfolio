const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { loadCareerFacts } = require('./load-career-facts.cjs');

const root = path.resolve(__dirname, '..');

function normalize(value) {
  return String(value)
    .normalize('NFKC')
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function requireText(haystack, value, label) {
  if (!normalize(haystack).includes(normalize(value))) {
    throw new Error(`résumé extraction does not match canonical ${label}: ${value}`);
  }
}

function run() {
  const facts = loadCareerFacts(root);
  const resumePath = path.join(root, 'public', facts.resume.publicUrl.replace(/^\//, ''));
  if (!fs.existsSync(resumePath)) throw new Error('stable résumé PDF is missing');

  const info = execFileSync('pdfinfo', [resumePath], { encoding: 'utf8' });
  const pages = Number(info.match(/^Pages:\s+(\d+)/m)?.[1] || 0);
  if (pages !== 1) throw new Error(`expected one recruiter résumé page, received ${pages}`);

  const text = execFileSync('pdftotext', ['-layout', resumePath, '-'], { encoding: 'utf8' });
  const normalized = normalize(text);
  for (const word of ['crypto-to-fiat', 'financial', 'modified', 'firmware', 'postgresql', 'webrtc', 'jetstream']) {
    if (!normalized.includes(word)) throw new Error(`résumé extraction lost ${word}`);
  }
  if (text.replace(/\f/g, '').match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/)) {
    throw new Error('résumé extraction contains unexpected control characters');
  }

  requireText(text, facts.identity.primaryTitle.en, 'primary title');
  requireText(text, `${facts.metrics.backendExperience.value} years`, 'experience metric');
  requireText(text, facts.relocation.statement.en, 'relocation statement');
  for (const role of facts.roles.filter(item => item.publish?.resume)) {
    requireText(text, role.company, `${role.id} company`);
    requireText(text, role.title.en, `${role.id} title`);
    requireText(text, role.publicDate.en, `${role.id} date`);
  }
  for (const education of facts.education.filter(item => item.publish?.resume)) {
    requireText(text, education.degree, `${education.degree} degree`);
    requireText(text, education.publicDate, `${education.degree} date`);
  }

  const bannedPatterns = [
    /78%/i,
    /99[.]9+%/i,
    /hls\s+fallback/i,
    /transparent(?:ly)?\s+switch/i,
    /iran['’]s\s+#1/i,
    /evidence[- ]bounded/i,
    /conservatively\s+suppressed/i,
    /publicly\s+verified/i,
    /unsupported\s+(?:performance|latency)/i,
    /public\s+production\s+and\s+regulatory\s+status/i,
    /tensorflow\s+for\s+artificial\s+intelligence/i,
    /research[- ]level\s+study/i,
    /hyperledger\s+sawtooth\s+architecture/i,
    /github[.]com/i,
  ];
  for (const pattern of bannedPatterns) {
    if (pattern.test(text)) throw new Error(`unsupported or internal résumé wording remains: ${pattern}`);
  }

  process.stdout.write(`resume integrity: passed (${pages} page, canonical facts and ATS text intact)\n`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = run();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { normalize, run };
