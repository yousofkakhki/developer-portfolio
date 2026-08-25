const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const resumePath = path.join(root, 'public/files/yousef-kakhki-resume.pdf');

function run() {
  if (!fs.existsSync(resumePath)) throw new Error('stable résumé PDF is missing');

  const info = execFileSync('pdfinfo', [resumePath], { encoding: 'utf8' });
  const pages = Number(info.match(/^Pages:\s+(\d+)/m)?.[1] || 0);
  if (pages !== 2) throw new Error(`expected two résumé pages, received ${pages}`);

  const text = execFileSync('pdftotext', ['-layout', resumePath, '-'], { encoding: 'utf8' });
  const normalized = text.toLowerCase();
  for (const word of ['crypto-to-fiat', 'financial', 'modified', 'firmware', 'postgresql', 'webrtc', 'jetstream']) {
    if (!normalized.includes(word)) throw new Error(`résumé extraction lost ${word}`);
  }
  if (text.replace(/\f/g, '').match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/)) {
    throw new Error('résumé extraction contains unexpected control characters');
  }
  for (const phrase of ['99.9%', '99.999%', 'eu blue card eligible', 'transparently switched', '78% cost']) {
    if (normalized.includes(phrase)) throw new Error(`unsupported résumé claim remains: ${phrase}`);
  }

  process.stdout.write('resume integrity: passed\n');
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

module.exports = { run };
