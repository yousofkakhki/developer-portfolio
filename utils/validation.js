// Input validation and sanitization utilities

export function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  
  // Remove null bytes and control characters
  let sanitized = str
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email regex (RFC 5322 simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Additional checks
  if (email.length > 254) return false; // RFC 5321 limit
  if (email.includes('..')) return false; // No consecutive dots
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  return emailRegex.test(email);
}

export function validateName(name) {
  if (!name || typeof name !== 'string') return false;
  
  const sanitized = sanitizeString(name, 100);
  
  // Name should be at least 2 characters and not just whitespace
  if (sanitized.length < 2) return false;
  
  // Check for suspicious patterns (SQL injection, XSS attempts)
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+set/i,
    /exec\s*\(/i,
    /eval\s*\(/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      return false;
    }
  }
  
  return true;
}

export function validateMessage(message) {
  if (!message || typeof message !== 'string') return false;
  
  const sanitized = sanitizeString(message, 2000);
  
  // Message should be at least 10 characters
  if (sanitized.length < 10) return false;
  
  // Check for suspicious patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+set/i,
    /exec\s*\(/i,
    /eval\s*\(/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      return false;
    }
  }
  
  return true;
}

export function getClientIP(request) {
  // Try various headers (for proxies, load balancers, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  
  // Fallback (may not work in all environments)
  return request.ip || 'unknown';
}

