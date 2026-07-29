const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publicProfileFiles = [
  'messages/en.json',
  'messages/fa.json',
  'utils/data/experience.js',
  'app/components/homepage/hero-section/index.jsx',
];

test('public profile does not publish contradicted scale or payment-volume claims', () => {
  const profile = publicProfileFiles.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  assert.doesNotMatch(profile, /1,200|۱[،,]۲۰۰/);
  assert.doesNotMatch(profile, /\$2M|2M\/month|۲ میلیون دلار در ماه/);
  assert.doesNotMatch(profile, /99\.999%/);

  const blogDir = path.join(root, 'content/blogs');
  const publishedMetadata = fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.json'))
    .map(file => JSON.parse(fs.readFileSync(path.join(blogDir, file), 'utf8')))
    .filter(blog => blog.published !== false)
    .map(blog => JSON.stringify({ title: blog.title, description: blog.description, content: blog.content }))
    .join('\n');
  assert.doesNotMatch(publishedMetadata, /1,200|99\.999%|\$2M/);
});

test('public profile uses the verified WebRTC concurrency figure', () => {
  const english = fs.readFileSync(path.join(root, 'messages/en.json'), 'utf8');
  const persian = fs.readFileSync(path.join(root, 'messages/fa.json'), 'utf8');
  assert.match(english, /5,000\+? concurrent users/);
  assert.match(persian, /۵[٬،,]?۰۰۰ کاربر همزمان/);
});
