const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));

test('production dependencies exclude dead and vulnerable runtime packages', () => {
  const { dependencies } = JSON.parse(read('package.json'));
  for (const dependency of [
    '@next/third-parties',
    '@emailjs/browser',
    'axios',
    'express-rate-limit',
    'rate-limiter-flexible',
    'react-fast-marquee',
    'react-google-recaptcha',
    'react-toastify',
    'swiper',
  ]) {
    assert.equal(dependencies[dependency], undefined, `${dependency} should not ship`);
  }
});

test('contact delivery fails closed and uses bounded native transports', () => {
  const route = read('app/api/contact/route.js');
  assert.doesNotMatch(route, /qweOP123|rejectUnauthorized\s*:\s*false|debug\s*:\s*true|logger\s*:\s*true/);
  assert.doesNotMatch(route, /axios/);
  assert.match(route, /process\.env\.SMTP_PASSWORD/);
  assert.match(route, /disableFileAccess\s*:\s*true/);
  assert.match(route, /disableUrlAccess\s*:\s*true/);
  assert.match(route, /content-length/i);
  assert.match(route, /},\s*413,\s*rate\)/);
  assert.match(route, /fetch\(url/);
});

test('contact relay mode is explicit and constrained to the Mailcow internal relay', () => {
  const route = read('app/api/contact/route.js');
  const compose = read('docker-compose.yml');
  assert.match(route, /SMTP_AUTH_DISABLED\s*===\s*'true'/);
  assert.match(route, /process\.env\.SMTP_HOST\s*===\s*'postfix-mailcow'/);
  assert.match(route, /process\.env\.SMTP_PORT\s*===\s*'25'/);
  assert.match(route, /servername:\s*config\.mailcowInternalRelay\s*\?\s*'mail\.kakhki\.ir'/);
  assert.match(route, /auth:\s*config\.auth/);
  assert.match(compose, /mailcowdockerized_mailcow-network/);
  assert.match(compose, /NODE_EXTRA_CA_CERTS=\/app\/certs\/mailcow\.pem/);
  assert.match(compose, /\/opt\/mailcow-dockerized\/data\/assets\/ssl\/cert\.pem:\/app\/certs\/mailcow\.pem:ro/);
});

test('unused legacy endpoints and components are removed', () => {
  for (const file of [
    'app/api/google/route.js',
    'app/api/data/route.js',
    'app/components/homepage/contact/contact-form.jsx',
    'app/components/homepage/projects/project-card-swiper.jsx',
    'app/components/helper/animation-lottie.jsx',
  ]) {
    assert.equal(exists(file), false, `${file} should be removed`);
  }
});

test('public write endpoints enforce bounded requests and rate limits', () => {
  const analytics = read('app/api/analytics/route.js');
  const revalidate = read('app/api/revalidate/route.js');
  assert.match(analytics, /content-length/i);
  assert.match(analytics, /rateLimit/);
  assert.match(revalidate, /content-length/i);
  assert.match(revalidate, /rateLimit/);
  assert.match(revalidate, /SLUG_PATTERN/);
  assert.match(revalidate, /timingSafeEqual/);
});

test('production container is loopback-only and runs as a non-root user', () => {
  const dockerfile = read('Dockerfile.prod');
  const compose = read('docker-compose.yml');
  assert.match(dockerfile, /^USER node$/m);
  assert.match(dockerfile, /COPY --chown=node:node/);
  assert.match(compose, /127\.0\.0\.1:3000:3000/);
});

test('client IP selection prefers the trusted reverse-proxy header', () => {
  const validation = read('utils/validation.js');
  assert.ok(validation.indexOf("x-real-ip") < validation.indexOf("x-forwarded-for"));
});

test('CSP retains only the documented static-rendering inline exception', () => {
  const middleware = read('middleware-security.js');
  assert.match(middleware, /Next\.js emits inline hydration data/);
  assert.match(middleware, /script-src 'self' 'unsafe-inline'/);
  assert.match(middleware, /style-src 'self' 'unsafe-inline'/);
  assert.doesNotMatch(middleware, /script-src[^\n]*unsafe-eval/);
  assert.match(middleware, /object-src 'none'/);
  assert.match(middleware, /base-uri 'self'/);
  assert.match(middleware, /form-action 'self'/);
  assert.match(middleware, /frame-ancestors 'none'/);
});
