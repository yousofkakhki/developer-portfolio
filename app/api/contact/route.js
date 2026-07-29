import { apiJson } from '@/utils/api-response';
import nodemailer from 'nodemailer';
import { rateLimit } from '@/utils/rate-limiter';
import {
  getClientIP,
  sanitizeString,
  validateEmail,
  validateMessage,
  validateName,
} from '@/utils/validation';

export const runtime = 'nodejs';

const BODY_LIMIT = 4096;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function escapeHtml(value) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return value.replace(/[&<>"']/g, character => entities[character]);
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const receivingEmail = process.env.RECEIVING_EMAIL;
  const port = Number(process.env.SMTP_PORT || 587);
  const isMailcowInternalRelay = process.env.SMTP_AUTH_DISABLED === 'true'
    && process.env.SMTP_HOST === 'postfix-mailcow'
    && process.env.SMTP_PORT === '25';

  if (!host || !user || !validateEmail(receivingEmail)) return null;
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;
  if (!isMailcowInternalRelay && !password) return null;

  return {
    host,
    user,
    password,
    receivingEmail,
    port,
    auth: !isMailcowInternalRelay,
    mailcowInternalRelay: isMailcowInternalRelay,
  };
}

async function sendEmail(config, payload) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.auth && config.port !== 465,
    auth: config.auth ? { user: config.user, pass: config.password } : undefined,
    tls: {
      minVersion: 'TLSv1.2',
      servername: config.mailcowInternalRelay ? 'mail.kakhki.ir' : undefined,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br>');
  const text = `New message from ${payload.name}\n\nEmail: ${payload.email}\n\n${payload.message}`;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${config.user}>`,
    to: config.receivingEmail,
    replyTo: payload.email,
    subject: `New message from ${payload.name}`,
    text,
    html: `<h2>New portfolio message</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p>${safeMessage}</p>`,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  transporter.close();
  return true;
}

async function sendTelegram(token, chatId, payload) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `New message from ${payload.name}\n\nEmail: ${payload.email}\n\n${payload.message}`,
    }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result.ok === true;
}

function response(body, status, rate) {
  const headers = rate?.resetTime ? {
    'X-RateLimit-Limit': String(RATE_LIMIT),
    'X-RateLimit-Remaining': String(rate.remaining),
    'X-RateLimit-Reset': new Date(rate.resetTime).toISOString(),
  } : undefined;
  return apiJson(body, { status, headers });
}

export async function POST(request) {
  const clientIP = getClientIP(request);
  const rate = rateLimit(`contact:${clientIP}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rate.resetTime - Date.now()) / 1000));
    return apiJson(
      { success: false, message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rate.resetTime).toISOString(),
        },
      },
    );
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > BODY_LIMIT) {
    return response({ success: false, message: 'Request is too large.' }, 413, rate);
  }

  let payload;
  try {
    const raw = await request.text();
    if (!raw || Buffer.byteLength(raw, 'utf8') > BODY_LIMIT) {
      return response({ success: false, message: 'Request is too large.' }, 413, rate);
    }
    payload = JSON.parse(raw);
  } catch {
    return response({ success: false, message: 'Invalid request format.' }, 400, rate);
  }

  const { name, email, message, honeypot } = payload || {};
  if (honeypot || !validateName(name) || !validateEmail(email) || !validateMessage(message)) {
    return response({ success: false, message: 'Invalid contact details.' }, 400, rate);
  }

  const cleanPayload = {
    name: sanitizeString(name, 100),
    email: sanitizeString(email, 254).toLowerCase(),
    message: sanitizeString(message, 2000),
  };
  const deliveries = [];
  const smtp = getSmtpConfig();
  if (smtp) deliveries.push(sendEmail(smtp, cleanPayload));
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    deliveries.push(sendTelegram(process.env.TELEGRAM_BOT_TOKEN, process.env.TELEGRAM_CHAT_ID, cleanPayload));
  }

  if (deliveries.length === 0) {
    console.error('Contact delivery is not configured');
    return response({ success: false, message: 'Contact delivery is temporarily unavailable.' }, 503, rate);
  }

  const results = await Promise.allSettled(deliveries);
  if (results.some(result => result.status === 'fulfilled' && result.value === true)) {
    return response({ success: true, message: 'Message sent successfully!' }, 200, rate);
  }

  console.error('All configured contact delivery channels failed');
  return response({ success: false, message: 'Failed to send message. Please try again later.' }, 502, rate);
}
