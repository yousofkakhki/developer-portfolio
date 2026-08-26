const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const load = file => JSON.parse(fs.readFileSync(path.join(root, 'content/blogs', file), 'utf8'));

const honar = load('honar-amoozesh-5000-concurrent-webrtc-case-study.json');
const aiSfu = load('ai-enhanced-sfu-for-low-latency-streaming.json');
const euCluster = load('eu-scale-livekit-sfu-clustering-in-frankfurt.json');
const ebpf = load('ebpf-probes-for-faster-ota-fault-detection.json');

function assertFallbackMentionsAreQualified(copy) {
  const mentions = copy
    .split(/\n|(?<=[.!?])\s+/)
    .filter(sentence => /HLS fallback/i.test(sentence));
  for (const sentence of mentions) {
    assert.match(
      sentence,
      /not|does not|without|hypothetical|proposed/i,
      `unqualified HLS fallback wording: ${sentence}`
    );
  }
}

test('the definitive HonarAmoozesh article preserves the verified media boundary in both locales', () => {
  assert.equal(honar.articleType, 'production-case-study');
  for (const field of ['title', 'description', 'seoTitle', 'seoDescription', 'content']) {
    assert.ok(honar[field].en.trim(), `${field}.en`);
    assert.ok(honar[field].fa.trim(), `${field}.fa`);
  }

  assert.match(honar.title.en, /platform/i);
  assert.match(honar.seoTitle.en, /platform/i);
  assert.match(honar.content.en, /does not mean 5,000 simultaneous publishers/i);
  assert.match(honar.content.en, /HLS was not a fallback for current-session viewers/i);
  assert.match(honar.content.en, /Nor am I claiming that live switching between WebRTC and HLS was implemented/i);
  assert.match(honar.content.fa, /همزمانی در سطح پلتفرم/);
  assert.match(honar.content.fa, /ادعا نمی‌کنم جابه‌جایی زنده میان WebRTC و HLS پیاده‌سازی شده بود/);
  assert.doesNotMatch(honar.content.en, /transparent switching|WebRTC for interaction and HLS for scale/i);
  assertFallbackMentionsAreQualified(honar.content.en);
});

test('the AI and EU pieces are visibly proposed and cannot inherit production outcomes', () => {
  assert.equal(aiSfu.articleType, 'architecture-essay');
  assert.match(aiSfu.content.en.slice(0, 500), /proposed control-plane architecture/i);
  assert.match(aiSfu.content.en, /more than 5,000 users at platform level/i);
  assert.match(aiSfu.content.en, /did not provide evidence for live audience switching between WebRTC and HLS/i);
  assert.doesNotMatch(aiSfu.content.en, /hybrid system controlled cost|WebRTC for interaction and HLS for scale|achieved cost/i);
  assert.match(aiSfu.content.en, /https:\/\/www\.w3\.org\/TR\/webrtc\//);
  assert.match(aiSfu.content.en, /https:\/\/docs\.livekit\.io\/home\//);

  assert.equal(euCluster.articleType, 'reference-architecture');
  assert.match(euCluster.content.en.slice(0, 250), /Hypothetical reference architecture/i);
  assert.match(euCluster.content.en, /No result from that proposed path should be attributed to HonarAmoozesh/i);
  assert.match(euCluster.content.en, /\| Session need \| Proposed path \| Decision boundary \|/);
  assert.match(euCluster.content.en, /This table is a design artifact, not evidence/i);
  assert.doesNotMatch(euCluster.content.en, /we achieved|we deployed|reduced cost by|300 passive viewers/i);
  assertFallbackMentionsAreQualified(euCluster.content.en);
});

test('the eBPF article remains a conditional design hypothesis with primary references', () => {
  assert.equal(ebpf.articleType, 'design-hypothesis');
  assert.match(ebpf.content.en.slice(0, 700), /This is a design hypothesis/i);
  assert.match(ebpf.content.en, /depends on the target kernel, attachment point, event rate, and device workload/i);
  assert.doesNotMatch(ebpf.content.en, /perf or ftrace would be prohibitive/i);
  assert.match(ebpf.content.en, /https:\/\/docs\.kernel\.org\/bpf\//);
  assert.match(ebpf.content.en, /https:\/\/docs\.kernel\.org\/trace\/index\.html/);
});
