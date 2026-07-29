import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml; charset=utf-8',
};

export async function GET(_request, { params }) {
  const { path: segments = [] } = await params;
  const base = path.resolve(process.cwd(), 'public', 'blog');
  const requested = path.resolve(base, ...segments);

  if (!requested.startsWith(`${base}${path.sep}`)) {
    return new Response('Not found', { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(requested).toLowerCase()];
  if (!contentType) return new Response('Not found', { status: 404 });

  try {
    const body = await readFile(requested);
    return new Response(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
