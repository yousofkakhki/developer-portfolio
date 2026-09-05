const LTR_ISOLATE = '\u2066';
const POP_DIRECTIONAL_ISOLATE = '\u2069';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizedTerms(terms = []) {
  return [...new Set(terms.filter(term => typeof term === 'string' && term.trim()))]
    .sort((left, right) => right.length - left.length);
}

function segmentBidiText(text, terms = []) {
  const identifiers = normalizedTerms(terms);
  if (!identifiers.length || typeof text !== 'string' || !text) {
    return text ? [{ text, direction: null }] : [];
  }
  const pattern = new RegExp(`(${identifiers.map(escapeRegExp).join('|')})`, 'g');
  return text.split(pattern)
    .filter(Boolean)
    .map(part => ({
      text: part,
      direction: identifiers.includes(part) ? 'ltr' : null,
    }));
}

function isolateBidiText(text, terms = []) {
  return segmentBidiText(text, terms)
    .map(segment => segment.direction === 'ltr'
      ? `${LTR_ISOLATE}${segment.text}${POP_DIRECTIONAL_ISOLATE}`
      : segment.text)
    .join('');
}

module.exports = { isolateBidiText, segmentBidiText };
