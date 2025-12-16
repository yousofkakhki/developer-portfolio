const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';
const LOCALES = ['en', 'fa'];
const TIMEOUT = 30000;

const errors = [];
const warnings = [];

async function crawlPage(browser, url, locale) {
  const page = await browser.newPage();
  const pageErrors = [];
  const pageWarnings = [];
  
  // Track console errors with better error extraction
  page.on('console', async msg => {
    const type = msg.type();
    try {
      const args = msg.args();
      let text = '';
      for (let i = 0; i < args.length; i++) {
        try {
          const argText = await args[i].jsonValue();
          text += (typeof argText === 'object' ? JSON.stringify(argText) : String(argText)) + ' ';
        } catch (e) {
          text += await args[i].toString() + ' ';
        }
      }
      if (!text) {
        text = msg.text();
      }
      
      if (type === 'error') {
        // Filter out known non-critical errors
        if (!text.includes('favicon') && 
            !text.includes('Failed to fetch dynamically imported module') &&
            !text.includes('ResizeObserver') &&
            !text.includes('Non-Error promise rejection')) {
          pageErrors.push({ type: 'console', message: text.trim(), url });
        }
      } else if (type === 'warning') {
        pageWarnings.push({ type: 'console', message: text.trim(), url });
      }
    } catch (e) {
      // Fallback to simple text
      const text = msg.text();
      if (type === 'error' && text && !text.includes('favicon')) {
        pageErrors.push({ type: 'console', message: text, url });
      }
    }
  });

  // Track page errors with full details
  page.on('pageerror', error => {
    const errorMessage = error.message || String(error);
    // Filter out known non-critical errors
    if (!errorMessage.includes('ResizeObserver') && 
        !errorMessage.includes('Non-Error promise rejection') &&
        !errorMessage.includes('favicon')) {
      pageErrors.push({ 
        type: 'page', 
        message: errorMessage,
        stack: error.stack ? error.stack.split('\n')[0] : undefined,
        url 
      });
    }
  });

  // Track failed requests
  page.on('requestfailed', request => {
    const resourceType = request.resourceType();
    const url = request.url();
    // Ignore analytics and external resources
    if (!url.includes('google-analytics') && 
        !url.includes('googletagmanager') &&
        !url.includes('cloudflare') &&
        !url.includes('doubleclick')) {
      pageErrors.push({ 
        type: 'request', 
        message: `Failed to load ${resourceType}: ${url}`,
        url: page.url()
      });
    }
  });

  // Track response errors
  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400 && 
        !url.includes('google-analytics') && 
        !url.includes('googletagmanager') &&
        !url.includes('cloudflare')) {
      pageErrors.push({ 
        type: 'response', 
        message: `HTTP ${status}: ${url}`,
        url: page.url()
      });
    }
  });

  try {
    console.log(`\n🔍 Testing: ${url}`);
    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: TIMEOUT 
    });

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check for missing images (exclude Next.js optimized images that load asynchronously)
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken = [];
      images.forEach(img => {
        // Skip Next.js optimized images (_next/image) - they load asynchronously
        if (img.src.includes('_next/image')) {
          return;
        }
        // Only check images that should be loaded immediately
        if (!img.complete || (img.naturalWidth === 0 && img.src && !img.src.startsWith('data:'))) {
          broken.push({
            src: img.src,
            alt: img.alt || 'No alt text'
          });
        }
      });
      return broken;
    });

    brokenImages.forEach(img => {
      pageErrors.push({ 
        type: 'image', 
        message: `Broken image: ${img.src} (alt: ${img.alt})`,
        url 
      });
    });

    // Check for missing alt text (exclude decorative images with aria-hidden)
    const imagesWithoutAlt = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .filter(img => {
          const hasAlt = img.alt && img.alt.trim() !== '';
          const isDecorative = img.getAttribute('aria-hidden') === 'true';
          return !hasAlt && !isDecorative;
        })
        .map(img => img.src);
    });

    imagesWithoutAlt.forEach(src => {
      pageWarnings.push({ 
        type: 'accessibility', 
        message: `Image missing alt text: ${src}`,
        url 
      });
    });

    // Check for broken internal links
    const brokenLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'));
      const broken = [];
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          // Check if link element is visible and clickable
          const rect = link.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) {
            broken.push({ href, text: link.textContent.trim() });
          }
        }
      });
      return broken;
    });

    // Check for empty buttons/links (exclude those with aria-labels or icons)
    const emptyInteractive = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a'));
      return elements
        .filter(el => {
          const text = el.textContent.trim();
          const ariaLabel = el.getAttribute('aria-label');
          const title = el.getAttribute('title');
          const hasIcon = el.querySelector('svg, i, [class*="icon"]');
          const isHidden = el.offsetParent === null || el.getAttribute('aria-hidden') === 'true';
          // Only flag if no text, no aria-label, no title, no icon, and is visible
          return !text && !ariaLabel && !title && !hasIcon && !isHidden;
        })
        .map(el => ({
          tag: el.tagName,
          href: el.href || el.getAttribute('href') || 'N/A'
        }));
    });

    emptyInteractive.forEach(el => {
      pageWarnings.push({ 
        type: 'accessibility', 
        message: `Empty ${el.tag} element: ${el.href}`,
        url 
      });
    });

    // Check for form fields without labels
    const unlabeledInputs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      return inputs
        .filter(input => {
          const id = input.id;
          const name = input.name;
          const ariaLabel = input.getAttribute('aria-label');
          const placeholder = input.getAttribute('placeholder');
          const label = id ? document.querySelector(`label[for="${id}"]`) : null;
          return !label && !ariaLabel && !placeholder && input.offsetParent !== null;
        })
        .map(input => ({
          type: input.type || input.tagName,
          name: input.name || 'unnamed',
          id: input.id || 'no-id'
        }));
    });

    unlabeledInputs.forEach(input => {
      pageWarnings.push({ 
        type: 'accessibility', 
        message: `Unlabeled form field: ${input.type} (name: ${input.name}, id: ${input.id})`,
        url 
      });
    });

    // Check for layout issues (elements outside viewport)
    const layoutIssues = await page.evaluate(() => {
      const issues = [];
      const elements = Array.from(document.querySelectorAll('*'));
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (rect.width > window.innerWidth * 1.5 || rect.height > window.innerHeight * 1.5) {
          if (style.position !== 'fixed' && style.position !== 'absolute') {
            issues.push({
              tag: el.tagName,
              width: rect.width,
              height: rect.height,
              class: el.className || 'no-class'
            });
          }
        }
      });
      return issues;
    });

    if (layoutIssues.length > 0) {
      pageWarnings.push({ 
        type: 'layout', 
        message: `Potential layout issues: ${layoutIssues.length} elements with unusual dimensions`,
        url,
        details: layoutIssues
      });
    }

    // Check page title
    const title = await page.title();
    if (!title || title.trim() === '') {
      pageErrors.push({ 
        type: 'seo', 
        message: 'Page has no title',
        url 
      });
    }

    // Check meta description
    const metaDescription = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      return meta ? meta.content : null;
    });

    if (!metaDescription || metaDescription.trim() === '') {
      pageWarnings.push({ 
        type: 'seo', 
        message: 'Page has no meta description',
        url 
      });
    }

    // Test navigation
    try {
      await page.waitForSelector('nav', { timeout: 5000 });
      const navLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('nav a[href]'));
        return links.map(link => ({
          href: link.getAttribute('href'),
          text: link.textContent.trim()
        }));
      });
      
      console.log(`  ✓ Found ${navLinks.length} navigation links`);
    } catch (e) {
      pageWarnings.push({ 
        type: 'navigation', 
        message: 'Navigation not found or not accessible',
        url 
      });
    }

    // Test language switching - check for language switcher button/links
    if (locale === 'en') {
      try {
        // Check for any link that goes to /fa (could be button with onClick or actual link)
        const faLink = await page.$('a[href*="/fa"], button[aria-label*="Farsi"], button[aria-label*="Persian"]');
        if (!faLink) {
          // Check if language switcher component exists
          const langSwitcher = await page.$('[class*="language"], [class*="lang"], [aria-label*="language"]');
          if (!langSwitcher) {
            pageWarnings.push({ 
              type: 'i18n', 
              message: 'Language switcher link to /fa not found',
              url 
            });
          }
        }
      } catch (e) {
        // Ignore
      }
    } else if (locale === 'fa') {
      try {
        const enLink = await page.$('a[href*="/en"], button[aria-label*="English"]');
        if (!enLink) {
          const langSwitcher = await page.$('[class*="language"], [class*="lang"], [aria-label*="language"]');
          if (!langSwitcher) {
            pageWarnings.push({ 
              type: 'i18n', 
              message: 'Language switcher link to /en not found',
              url 
            });
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    errors.push(...pageErrors);
    warnings.push(...pageWarnings);

    if (pageErrors.length > 0) {
      console.log(`  ❌ Found ${pageErrors.length} error(s)`);
    }
    if (pageWarnings.length > 0) {
      console.log(`  ⚠️  Found ${pageWarnings.length} warning(s)`);
    }
    if (pageErrors.length === 0 && pageWarnings.length === 0) {
      console.log(`  ✅ No issues found`);
    }

  } catch (error) {
    errors.push({ 
      type: 'navigation', 
      message: `Failed to load page: ${error.message}`,
      url 
    });
    console.log(`  ❌ Failed to load: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function runCrawl() {
  console.log('🚀 Starting website crawl test...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Try to find system Chromium
  let executablePath;
  const { execSync } = require('child_process');
  try {
    executablePath = execSync('which chromium-browser', { encoding: 'utf-8' }).trim();
  } catch (e) {
    try {
      executablePath = execSync('which chromium', { encoding: 'utf-8' }).trim();
    } catch (e2) {
      executablePath = null;
    }
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath || undefined,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer'
    ]
  });

  try {
    // Test root redirect
    console.log('🔍 Testing root redirect...');
    const rootPage = await browser.newPage();
    try {
      const response = await rootPage.goto(BASE_URL, { 
        waitUntil: 'networkidle2', 
        timeout: TIMEOUT 
      });
      const finalUrl = rootPage.url();
      console.log(`  ✓ Root redirects to: ${finalUrl}`);
    } catch (error) {
      errors.push({ 
        type: 'navigation', 
        message: `Root redirect failed: ${error.message}`,
        url: BASE_URL 
      });
      console.log(`  ❌ Root redirect failed: ${error.message}`);
    }
    await rootPage.close();

    // Test each locale
    for (const locale of LOCALES) {
      const url = `${BASE_URL}/${locale}`;
      await crawlPage(browser, url, locale);
    }

    // Test blog route if it exists
    for (const locale of LOCALES) {
      const url = `${BASE_URL}/${locale}/blog`;
      try {
        await crawlPage(browser, url, locale);
      } catch (e) {
        // Blog might not exist, that's okay
      }
    }

  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CRAWL TEST SUMMARY');
  console.log('='.repeat(60));

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ No issues found! Website is clean.\n');
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):\n`);
    const groupedErrors = {};
    errors.forEach(error => {
      const key = error.type || 'unknown';
      if (!groupedErrors[key]) {
        groupedErrors[key] = [];
      }
      groupedErrors[key].push(error);
    });

    Object.entries(groupedErrors).forEach(([type, errs]) => {
      console.log(`  ${type.toUpperCase()} (${errs.length}):`);
      errs.forEach(err => {
        console.log(`    - ${err.message}`);
        if (err.url) console.log(`      URL: ${err.url}`);
        if (err.stack && err.stack.split('\n').length > 1) {
          console.log(`      Stack: ${err.stack.split('\n')[0]}`);
        }
      });
      console.log('');
    });
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):\n`);
    const groupedWarnings = {};
    warnings.forEach(warning => {
      const key = warning.type || 'unknown';
      if (!groupedWarnings[key]) {
        groupedWarnings[key] = [];
      }
      groupedWarnings[key].push(warning);
    });

    Object.entries(groupedWarnings).forEach(([type, warns]) => {
      console.log(`  ${type.toUpperCase()} (${warns.length}):`);
      warns.slice(0, 10).forEach(warn => {
        console.log(`    - ${warn.message}`);
        if (warn.url) console.log(`      URL: ${warn.url}`);
      });
      if (warns.length > 10) {
        console.log(`    ... and ${warns.length - 10} more`);
      }
      console.log('');
    });
  }

  console.log('='.repeat(60) + '\n');

  process.exit(errors.length > 0 ? 1 : 0);
}

// Check if server is running
async function checkServer() {
  const http = require('http');
  return new Promise((resolve) => {
    const url = new URL(BASE_URL);
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 3000,
      path: '/',
      method: 'HEAD',
      timeout: 3000
    }, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ Server is not running!');
    console.error(`Please start the server with: npm run dev`);
    console.error(`Or ensure the server is running on ${BASE_URL}`);
    process.exit(1);
  }

  await runCrawl();
})();

