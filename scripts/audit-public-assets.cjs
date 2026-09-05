const fs = require('node:fs');
const path = require('node:path');
const {
  PUBLIC_ASSET_STATUSES,
  publicAssetManifest,
} = require('../utils/data/public-asset-manifest.cjs');

const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');
const imageExtensions = new Set(['.avif', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const prohibitedStatuses = new Set([
  PUBLIC_ASSET_STATUSES.draftPrivate,
  PUBLIC_ASSET_STATUSES.remove,
  PUBLIC_ASSET_STATUSES.unreferenced,
]);
const validStatuses = new Set(Object.values(PUBLIC_ASSET_STATUSES));
const performancePatterns = [
  { label: 'percentage', pattern: /\b\d[\d,.]*\s*%/gi },
  { label: 'plus-quantity', pattern: /\b\d[\d,.]*\s*\+/gi },
  { label: 'latency', pattern: /(?:sub-|under\s*)\d[\d,.]*\s*(?:ms|milliseconds?|seconds?)/gi },
  { label: 'audience-capacity', pattern: /\b\d[\d,.]*\s*\+?\s*(?:concurrent\s+(?:publishers?|viewers?|students?|users?)|publishers?|viewers?|students?|users?)/gi },
  { label: 'availability', pattern: /\b\d{2,3}(?:\.\d+)?\s*%\s*(?:uptime|availability)/gi },
  { label: 'cost', pattern: /(?:€|\$|£)\s*\d[\d,.]*|\b\d[\d,.]*\s*(?:EUR|USD|GBP)\b/gi },
];

function walkImages(directory = publicRoot) {
  const paths = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...walkImages(absolute));
    else if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      paths.push(path.relative(publicRoot, absolute).split(path.sep).join('/'));
    }
  }
  return paths.sort();
}

function svgDimensions(buffer) {
  const source = buffer.toString('utf8', 0, Math.min(buffer.length, 8192));
  const viewBox = source.match(/viewBox=["'][^"']*?[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)["']/i);
  if (viewBox) return { width: Math.round(Number(viewBox[1])), height: Math.round(Number(viewBox[2])) };
  const width = source.match(/\bwidth=["']([\d.]+)/i);
  const height = source.match(/\bheight=["']([\d.]+)/i);
  return { width: Math.round(Number(width?.[1] || 0)), height: Math.round(Number(height?.[1] || 0)) };
}

function jpegDimensions(buffer) {
  let offset = 2;
  const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    if (sof.has(marker)) return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) break;
    offset += 2 + length;
  }
  return { width: 0, height: 0 };
}

function webpDimensions(buffer) {
  const type = buffer.toString('ascii', 12, 16);
  if (type === 'VP8X') {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }
  if (type === 'VP8 ') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (type === 'VP8L') {
    const b1 = buffer[21], b2 = buffer[22], b3 = buffer[23], b4 = buffer[24];
    return {
      width: 1 + (((b2 & 0x3f) << 8) | b1),
      height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)),
    };
  }
  return { width: 0, height: 0 };
}

function imageDimensions(relativePath, buffer) {
  const extension = path.extname(relativePath).toLowerCase();
  if (extension === '.svg') return svgDimensions(buffer);
  if (extension === '.png' && buffer.length >= 24) return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  if (extension === '.gif' && buffer.length >= 10) return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  if (extension === '.jpg' || extension === '.jpeg') return jpegDimensions(buffer);
  if (extension === '.webp') return webpDimensions(buffer);
  return { width: 0, height: 0 };
}

function findEmbeddedPerformanceClaims(relativePath, buffer) {
  if (path.extname(relativePath).toLowerCase() !== '.svg') return [];
  const source = buffer.toString('utf8');
  const visibleText = [...source.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)]
    .map(match => match[1].replace(/<[^>]+>/g, ' '))
    .join(' ')
    .replace(/&(?:nbsp|#160);/gi, ' ')
    .replace(/&amp;/gi, '&');
  return performancePatterns.flatMap(({ label, pattern }) =>
    [...visibleText.matchAll(pattern)].map(match => `${label}: ${match[0].trim()}`)
  );
}

function auditPublicAssets({ write = false } = {}) {
  const errors = [];
  const scannedPaths = walkImages();
  const manifestPaths = Object.keys(publicAssetManifest).sort();
  const scannedSet = new Set(scannedPaths);

  for (const relativePath of scannedPaths) {
    if (!publicAssetManifest[relativePath]) errors.push(`${relativePath}: missing explicit classification.`);
  }
  for (const relativePath of manifestPaths) {
    if (!scannedSet.has(relativePath)) errors.push(`${relativePath}: classified asset is missing from public/.`);
  }

  const assets = manifestPaths.flatMap(relativePath => {
    const absolute = path.join(publicRoot, relativePath);
    const classification = publicAssetManifest[relativePath];
    if (!fs.existsSync(absolute)) return [];
    const buffer = fs.readFileSync(absolute);
    const dimensions = imageDimensions(relativePath, buffer);
    const claims = findEmbeddedPerformanceClaims(relativePath, buffer);

    if (!validStatuses.has(classification.status)) errors.push(`${relativePath}: invalid status ${classification.status}.`);
    if (prohibitedStatuses.has(classification.status)) errors.push(`${relativePath}: ${classification.status} assets cannot remain public.`);
    if (!dimensions.width || !dimensions.height) errors.push(`${relativePath}: dimensions could not be read.`);
    if (!classification.publishedReferences?.length) errors.push(`${relativePath}: no published route reference.`);
    if (classification.containsRecognizablePeople && !classification.approvalEvidence?.kind) {
      errors.push(`${relativePath}: recognizable people require explicit approval evidence.`);
    }
    for (const referenceFile of classification.referenceFiles || []) {
      const sourcePath = path.join(root, referenceFile);
      if (!fs.existsSync(sourcePath)) errors.push(`${relativePath}: missing reference file ${referenceFile}.`);
      else if (!fs.readFileSync(sourcePath, 'utf8').includes(`/${relativePath}`)) {
        errors.push(`${relativePath}: ${referenceFile} does not reference the asset.`);
      }
    }
    for (const claim of claims) errors.push(`${relativePath}: embedded performance claim (${claim}).`);

    return [{
      path: relativePath,
      status: classification.status,
      purpose: classification.purpose,
      format: path.extname(relativePath).slice(1).toLowerCase(),
      byteSize: buffer.length,
      ...dimensions,
      publishedReferences: [...(classification.publishedReferences || [])],
      containsRecognizablePeople: classification.containsRecognizablePeople === true,
      approvalEvidence: classification.approvalEvidence || null,
      provenance: classification.provenance || null,
      embeddedPerformanceClaims: claims,
    }];
  });

  const summary = assets.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
    return counts;
  }, {});
  const result = { scannedPaths, assets, summary, errors };

  if (write) {
    const reportPath = path.join(root, 'artifacts/public-asset-audit.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(result, null, 2)}\n`);
  }
  return result;
}

if (require.main === module) {
  const write = process.argv.includes('--write');
  const result = auditPublicAssets({ write });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.errors.length) process.exitCode = 1;
}

module.exports = { auditPublicAssets, findEmbeddedPerformanceClaims };
