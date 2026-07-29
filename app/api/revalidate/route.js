import { timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { apiJson } from '@/utils/api-response';
import { rateLimit } from '@/utils/rate-limiter';
import { getClientIP } from '@/utils/validation';

export const runtime = 'nodejs';

const BODY_LIMIT = 2048;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function secretsMatch(received) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || typeof received !== 'string') return false;
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > BODY_LIMIT) {
    return apiJson({ error: 'Request is too large' }, { status: 413 });
  }

  let body;
  try {
    const raw = await request.text();
    if (!raw || Buffer.byteLength(raw, 'utf8') > BODY_LIMIT) {
      return apiJson({ error: 'Request is too large' }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return apiJson({ error: 'Invalid request' }, { status: 400 });
  }

  if (!secretsMatch(body.secret)) {
    return apiJson({ error: 'Invalid secret' }, { status: 401 });
  }

  const clientIP = getClientIP(request);
  if (!rateLimit(`revalidate:${clientIP}`, 10, 15 * 60 * 1000).allowed) {
    return apiJson({ error: 'Too many requests' }, { status: 429 });
  }

  if (body.slug !== undefined && (typeof body.slug !== 'string' || !SLUG_PATTERN.test(body.slug))) {
    return apiJson({ error: 'Invalid slug' }, { status: 400 });
  }

  revalidatePath('/[locale]/blog', 'page');
  if (body.slug) {
    revalidatePath(`/en/blog/${body.slug}`);
    revalidatePath(`/fa/blog/${body.slug}`);
  }

  return apiJson({ revalidated: true, slug: body.slug || null });
}
