function buildImageObject({ id, url, width, height, name, caption, thumbnailUrl }) {
  if (!/^https?:\/\//i.test(url || '')) throw new Error('ImageObject URL must be absolute.');
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    throw new Error('ImageObject dimensions must be positive integers.');
  }
  if (typeof name !== 'string' || !name.trim()) throw new Error('ImageObject name is required.');
  if (typeof caption !== 'string' || !caption.trim()) throw new Error('ImageObject caption is required.');

  return {
    '@type': 'ImageObject',
    ...(id && { '@id': id }),
    url,
    contentUrl: url,
    width,
    height,
    name,
    caption,
    ...(thumbnailUrl && { thumbnailUrl }),
  };
}

module.exports = { buildImageObject };
