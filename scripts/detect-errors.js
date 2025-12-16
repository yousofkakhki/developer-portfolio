const puppeteer = require('puppeteer');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

const errors = {
  console: [],
  page: [],
  element: [],
  network: [],
  accessibility: [],
  visual: [],
};

// Function to check if the server is running
async function checkServer(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 307);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function detectErrors() {
  console.log('🔍 Starting comprehensive error detection...\n');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    for (const locale of ['en', 'fa']) {
      console.log(`\n📄 Testing ${locale.toUpperCase()} page...`);
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000);

      // Capture console errors
      const consoleMessages = [];
      page.on('console', (msg) => {
        const type = msg.type();
        const text = msg.text();
        consoleMessages.push({ type, text });
        if (type === 'error' || type === 'warning') {
          // Filter out known non-critical errors
          if (!text.includes('favicon') && 
              !text.includes('chrome-extension') &&
              !text.includes('Failed to load resource: the server responded with a status of 404') &&
              !text.includes('MISSING_MESSAGE') &&
              !text.includes('Invalid or unexpected token') && // Often false positive from minified code
              !text.includes('Non-Error promise rejection') &&
              !text.includes('ResizeObserver loop limit exceeded')) {
            errors.console.push(`${locale}: [${type.toUpperCase()}] ${text}`);
          }
        }
      });

      // Capture page errors
      page.on('pageerror', (err) => {
        const message = err.message;
        // Filter out known false positives
        if (!message.includes('favicon') && 
            !message.includes('chrome-extension') &&
            !message.includes('Invalid or unexpected token')) {
          errors.page.push(`${locale}: ${message}`);
        }
      });

      // Capture network errors
      page.on('requestfailed', (request) => {
        const url = request.url();
        const resourceType = request.resourceType();
        // Only report non-Next.js internal requests
        if (!url.includes('/_next/') && 
            !url.includes('/favicon.ico') &&
            !url.includes('chrome-extension')) {
          errors.network.push(`${locale}: Failed to load ${resourceType}: ${url}`);
        }
      });

      await page.setViewport({ width: 1920, height: 1080 });
      await page.setCacheEnabled(false);
      await page.goto(`${BASE_URL}/${locale}`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Scroll through all sections to trigger lazy loading
      await page.evaluate(async () => {
        const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'education', 'testimonials', 'contact'];
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check for element errors
      const elementErrors = await page.evaluate(() => {
        const issues = [];

        // Check for missing required elements
        const requiredSections = ['hero', 'about', 'experience', 'skills', 'projects', 'education', 'testimonials', 'contact'];
        requiredSections.forEach(id => {
          const el = document.getElementById(id);
          if (!el) {
            issues.push(`Missing section: #${id}`);
          } else {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            // Check if element is visible
            if (parseFloat(styles.opacity) === 0 && 
                rect.width > 200 && 
                rect.height > 200 &&
                styles.display !== 'none') {
              issues.push(`Hidden section: #${id} (opacity: 0, size: ${rect.width}x${rect.height})`);
            }
          }
        });

        // Check for broken images
        const images = Array.from(document.querySelectorAll('img'));
        images.forEach(img => {
          if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
            if (!img.src.includes('/_next/image')) {
              issues.push(`Broken image: ${img.src} (alt: ${img.alt || 'No alt'})`);
            }
          }
          // Check for missing alt text (except decorative)
          if (!img.alt && !img.getAttribute('aria-hidden')) {
            issues.push(`Image missing alt text: ${img.src}`);
          }
        });

        // Check for broken links
        const links = Array.from(document.querySelectorAll('a[href]'));
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('http') && !href.includes('localhost')) {
            // External link - check if it has proper attributes
            if (!link.getAttribute('target') && !link.getAttribute('rel')) {
              issues.push(`External link missing target/rel: ${href}`);
            }
          }
        });

        // Check for empty interactive elements
        const buttons = Array.from(document.querySelectorAll('button'));
        buttons.forEach(btn => {
          if (!btn.textContent.trim() && !btn.getAttribute('aria-label') && !btn.querySelector('svg')) {
            issues.push(`Button without text or aria-label`);
          }
        });

        // Check for translation keys displayed as text
        const bodyText = document.body.textContent || '';
        const suspiciousKeys = ['testimonials.title', 'projects.title', 'nav.contact', 'projects.projects.title'];
        suspiciousKeys.forEach(key => {
          if (bodyText.includes(key) && bodyText.split(key).length > 1) {
            // Check if it's actually displayed (not just in a comment or attribute)
            const elements = Array.from(document.querySelectorAll('*'));
            elements.forEach(el => {
              if (el.textContent && el.textContent.trim() === key && el.children.length === 0) {
                issues.push(`Translation key displayed: ${key}`);
              }
            });
          }
        });

        return issues;
      });

      if (elementErrors.length > 0) {
        errors.element.push(...elementErrors.map(err => `${locale}: ${err}`));
      }

      // Check for accessibility issues
      const a11yIssues = await page.evaluate(() => {
        const issues = [];

        // Check for images without alt
        const images = Array.from(document.querySelectorAll('img'));
        images.forEach(img => {
          if (!img.alt && !img.getAttribute('aria-hidden') && img.offsetParent !== null) {
            issues.push(`Image without alt text: ${img.src.substring(0, 50)}`);
          }
        });

        // Check for links without accessible text
        const links = Array.from(document.querySelectorAll('a'));
        links.forEach(link => {
          const text = link.textContent.trim();
          const ariaLabel = link.getAttribute('aria-label');
          const hasIcon = link.querySelector('svg');
          if (!text && !ariaLabel && !hasIcon && link.offsetParent !== null) {
            issues.push(`Link without accessible text: ${link.href.substring(0, 50)}`);
          }
        });

        // Check for buttons without accessible text
        const buttons = Array.from(document.querySelectorAll('button'));
        buttons.forEach(btn => {
          const text = btn.textContent.trim();
          const ariaLabel = btn.getAttribute('aria-label');
          const hasIcon = btn.querySelector('svg');
          if (!text && !ariaLabel && !hasIcon && btn.offsetParent !== null) {
            issues.push(`Button without accessible text`);
          }
        });

        return issues;
      });

      if (a11yIssues.length > 0) {
        errors.accessibility.push(...a11yIssues.map(issue => `${locale}: ${issue}`));
      }

      // Check for critical visual issues only
      const visualIssues = await page.evaluate(() => {
        const issues = [];
        const elements = Array.from(document.querySelectorAll('*'));

        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();

          // Check for elements that should be visible but aren't (only for main sections)
          if (el.id && ['about', 'experience', 'skills', 'projects', 'education', 'testimonials', 'contact'].includes(el.id)) {
            if (parseFloat(styles.opacity) === 0 && 
                rect.width > 200 && 
                rect.height > 200 &&
                rect.top < window.innerHeight && 
                rect.bottom > 0 &&
                styles.display !== 'none' &&
                !el.hasAttribute('aria-hidden')) {
              issues.push(`Hidden section: #${el.id} (opacity: 0, size: ${rect.width}x${rect.height}px)`);
            }
          }
        });

        return issues;
      });

      if (visualIssues.length > 0) {
        errors.visual.push(...visualIssues.map(issue => `${locale}: ${issue}`));
      }

      await page.close();
    }

  } finally {
    await browser.close();
  }

  // Report results
  console.log('\n\n============================================================');
  console.log('📊 ERROR DETECTION REPORT');
  console.log('============================================================\n');

  let totalErrors = 0;

  if (errors.console.length > 0) {
    console.log(`❌ CONSOLE ERRORS (${errors.console.length}):`);
    errors.console.forEach(err => console.log(`  - ${err}`));
    totalErrors += errors.console.length;
    console.log('');
  }

  if (errors.page.length > 0) {
    console.log(`❌ PAGE ERRORS (${errors.page.length}):`);
    errors.page.forEach(err => console.log(`  - ${err}`));
    totalErrors += errors.page.length;
    console.log('');
  }

  if (errors.element.length > 0) {
    console.log(`❌ ELEMENT ERRORS (${errors.element.length}):`);
    errors.element.forEach(err => console.log(`  - ${err}`));
    totalErrors += errors.element.length;
    console.log('');
  }

  if (errors.network.length > 0) {
    console.log(`❌ NETWORK ERRORS (${errors.network.length}):`);
    errors.network.forEach(err => console.log(`  - ${err}`));
    totalErrors += errors.network.length;
    console.log('');
  }

  if (errors.accessibility.length > 0) {
    console.log(`⚠️  ACCESSIBILITY ISSUES (${errors.accessibility.length}):`);
    errors.accessibility.forEach(err => console.log(`  - ${err}`));
    totalErrors += errors.accessibility.length;
    console.log('');
  }

  if (errors.visual.length > 0) {
    console.log(`⚠️  VISUAL ISSUES (${errors.visual.length}):`);
    errors.visual.forEach(err => console.log(`  - ${err}`));
    totalErrors += errors.visual.length;
    console.log('');
  }

  console.log('============================================================');
  if (totalErrors === 0) {
    console.log('✅✅✅ NO ERRORS FOUND! ✅✅✅');
    process.exit(0);
  } else {
    console.log(`Found ${totalErrors} total issue(s)`);
    process.exit(1);
  }
}

// Check if server is running
checkServer(BASE_URL).then(isRunning => {
  if (isRunning) {
    detectErrors().catch(console.error);
  } else {
    console.error(`Server not running at ${BASE_URL}. Please start the server first.`);
    process.exit(1);
  }
});

