const rateLimitMap = new Map();
const MAX_KEYS = 10000;

function removeExpired(now) {
  for (const [key, record] of rateLimitMap) {
    if (now >= record.resetTime) rateLimitMap.delete(key);
  }
}

export function rateLimit(key, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || now >= existing.resetTime) {
    if (!existing && rateLimitMap.size >= MAX_KEYS) removeExpired(now);
    if (!existing && rateLimitMap.size >= MAX_KEYS) {
      return { allowed: false, remaining: 0, resetTime: now + windowMs };
    }

    const resetTime = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: existing.resetTime };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    resetTime: existing.resetTime,
  };
}

const cleanupTimer = setInterval(() => removeExpired(Date.now()), 60 * 1000);
cleanupTimer.unref?.();
