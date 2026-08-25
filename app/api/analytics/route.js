import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { apiJson } from '@/utils/api-response';
import { rateLimit } from '@/utils/rate-limiter';
import { getClientIP } from '@/utils/validation';

export const runtime = 'nodejs';

const BODY_LIMIT = 2048;
const ALLOWED_EVENTS = new Set([
  'resume_download',
  'contact_submit',
  'contact_email_click',
  'linkedin_click',
  'github_click',
  'work_with_me_view',
  'work_with_me_contact',
  'article_work_with_me',
  'project_case_study_view',
  'project_case_study_contact',
]);
const ANALYTICS_DIR = process.env.ANALYTICS_DIR || '/app/data/analytics';
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, 'events.jsonl');

function clean(value, maxLength, pattern) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim().slice(0, maxLength);
  return pattern.test(trimmed) ? trimmed : '';
}

export async function POST(request) {
  try {
    const clientIP = getClientIP(request);
    if (!rateLimit(`analytics:${clientIP}`, 60, 60 * 1000).allowed) {
      return apiJson({ accepted: false }, { status: 429 });
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > BODY_LIMIT) {
      return apiJson({ accepted: false }, { status: 413 });
    }

    const raw = await request.text();
    if (!raw || Buffer.byteLength(raw, 'utf8') > BODY_LIMIT) {
      return apiJson({ accepted: false }, { status: 413 });
    }

    const body = JSON.parse(raw);
    const event = clean(body.event, 48, /^[a-z][a-z0-9_]*$/);
    if (!ALLOWED_EVENTS.has(event)) {
      return apiJson({ accepted: false }, { status: 400 });
    }

    const rawPath = clean(body.path, 180, /^\/[A-Za-z0-9/_-]*$/);
    const locale = clean(body.locale, 2, /^(en|fa)$/);
    const source = clean(body.source, 64, /^[A-Za-z0-9_-]*$/);
    const referrerHost = clean(body.referrerHost, 120, /^[A-Za-z0-9.-]*$/);
    const record = {
      timestamp: new Date().toISOString(),
      event,
      path: rawPath || '/',
      locale: locale || 'en',
      ...(source && { source }),
      ...(referrerHost && { referrerHost }),
    };

    await mkdir(ANALYTICS_DIR, { recursive: true });
    await appendFile(ANALYTICS_FILE, `${JSON.stringify(record)}\n`, 'utf8');
    return apiJson({ accepted: true }, { status: 202 });
  } catch {
    return apiJson({ accepted: false }, { status: 400 });
  }
}
