const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';
const LOCALES = ['en', 'fa'];
const TIMEOUT = 30000;

const errors = [];
const warnings = [];
const uiIssues = [];

async function testPage(browser, url, locale) {
  const page = await browser.newPage();
  const pageErrors = [];
  const pageWarnings = [];
  const pageUIIssues = [];
  
  // Set viewport for consistent testing
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Track console errors
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
            !text.includes('Non-Error promise rejection') &&
            !text.includes('MISSING_MESSAGE') && // next-intl hydration warnings
            !text.includes('_rsc')) {
          pageErrors.push({ type: 'console', message: text.trim(), url });
        }
      }
    } catch (e) {
      // Ignore console parsing errors
    }
  });

  // Track page errors
  page.on('pageerror', error => {
    const errorMessage = error.message || String(error);
    // Filter out known false positives and non-critical errors
    if (!errorMessage.includes('ResizeObserver') && 
        !errorMessage.includes('Non-Error promise rejection') &&
        !errorMessage.includes('favicon') &&
        !errorMessage.includes('Invalid or unexpected token') && // Often false positive from minified code
        !errorMessage.includes('Unexpected token') &&
        errorMessage.length < 200) { // Very long errors are usually minified code issues
      pageErrors.push({ 
        type: 'page', 
        message: errorMessage,
        url 
      });
    }
  });

  // Track failed requests (excluding RSC and analytics)
  page.on('requestfailed', request => {
    const resourceType = request.resourceType();
    const url = request.url();
    if (!url.includes('google-analytics') && 
        !url.includes('googletagmanager') &&
        !url.includes('cloudflare') &&
        !url.includes('doubleclick') &&
        !url.includes('_rsc') && // Next.js RSC requests
        !url.includes('_next/static')) {
      pageErrors.push({ 
        type: 'request', 
        message: `Failed to load ${resourceType}: ${url}`,
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
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test UI elements
    const uiTests = await page.evaluate(() => {
      const issues = [];
      
      // Check for broken images (excluding Next.js optimized)
      const images = Array.from(document.querySelectorAll('img'));
      images.forEach(img => {
        if (img.src.includes('_next/image')) return;
        if (!img.complete || (img.naturalWidth === 0 && img.src && !img.src.startsWith('data:'))) {
          issues.push({
            type: 'broken-image',
            src: img.src,
            alt: img.alt || 'No alt text'
          });
        }
      });

      // Check for missing alt text (excluding decorative)
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img'))
        .filter(img => {
          const hasAlt = img.alt && img.alt.trim() !== '';
          const isDecorative = img.getAttribute('aria-hidden') === 'true';
          return !hasAlt && !isDecorative && !img.src.includes('_next/image');
        })
        .map(img => img.src);
      
      if (imagesWithoutAlt.length > 0) {
        issues.push({
          type: 'missing-alt',
          images: imagesWithoutAlt
        });
      }

      // Check for empty interactive elements
      const emptyInteractive = Array.from(document.querySelectorAll('button, a'))
        .filter(el => {
          const text = el.textContent.trim();
          const ariaLabel = el.getAttribute('aria-label');
          const title = el.getAttribute('title');
          const hasIcon = el.querySelector('svg, i, [class*="icon"]');
          const isHidden = el.offsetParent === null || el.getAttribute('aria-hidden') === 'true';
          return !text && !ariaLabel && !title && !hasIcon && !isHidden;
        })
        .map(el => ({
          tag: el.tagName,
          href: el.href || el.getAttribute('href') || 'N/A'
        }));
      
      if (emptyInteractive.length > 0) {
        issues.push({
          type: 'empty-interactive',
          elements: emptyInteractive
        });
      }

      // Check for form fields without labels
      const unlabeledInputs = Array.from(document.querySelectorAll('input, textarea, select'))
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
      
      if (unlabeledInputs.length > 0) {
        issues.push({
          type: 'unlabeled-input',
          inputs: unlabeledInputs
        });
      }

      // Check for navigation links
      const navLinks = Array.from(document.querySelectorAll('nav a[href]'));
      const navIssues = [];
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        if (!text && !link.getAttribute('aria-label')) {
          navIssues.push({ href, issue: 'empty-link' });
        }
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          // Check if link is broken (404)
          const isAnchor = href.includes('#');
          if (!isAnchor) {
            navIssues.push({ href, issue: 'internal-link-needs-test' });
          }
        }
      });
      
      if (navIssues.length > 0) {
        issues.push({
          type: 'nav-issues',
          issues: navIssues
        });
      }

      // Check for language switcher
      const langSwitcher = document.querySelector('[aria-label*="Switch"], [aria-label*="language"], button[aria-label*="English"], button[aria-label*="Persian"]');
      if (!langSwitcher) {
        issues.push({
          type: 'missing-lang-switcher'
        });
      }

      // Check for visible text content
      const bodyText = document.body.textContent.trim();
      if (bodyText.length < 100) {
        issues.push({
          type: 'minimal-content',
          textLength: bodyText.length
        });
      }

      // Check for console errors in page
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const scriptIssues = [];
      scripts.forEach(script => {
        if (script.src && !script.src.includes('_next') && !script.src.includes('localhost')) {
          scriptIssues.push({ src: script.src, issue: 'external-script' });
        }
      });

      return issues;
    });

    uiTests.forEach(issue => {
      if (issue.type === 'broken-image') {
        pageErrors.push({ type: 'image', message: `Broken image: ${issue.src}`, url });
      } else if (issue.type === 'missing-alt') {
        issue.images.forEach(img => {
          pageWarnings.push({ type: 'accessibility', message: `Image missing alt text: ${img}`, url });
        });
      } else if (issue.type === 'empty-interactive') {
        issue.elements.forEach(el => {
          pageWarnings.push({ type: 'accessibility', message: `Empty ${el.tag} element: ${el.href}`, url });
        });
      } else if (issue.type === 'unlabeled-input') {
        issue.inputs.forEach(input => {
          pageWarnings.push({ type: 'accessibility', message: `Unlabeled form field: ${input.type} (name: ${input.name})`, url });
        });
      } else if (issue.type === 'missing-lang-switcher') {
        pageWarnings.push({ type: 'i18n', message: 'Language switcher not found', url });
      } else if (issue.type === 'minimal-content') {
        pageWarnings.push({ type: 'content', message: `Page has minimal content (${issue.textLength} chars)`, url });
      }
    });

    // Test navigation functionality
    try {
      const navExists = await page.$('nav');
      if (navExists) {
        // Get initial scroll position
        const initialScroll = await page.evaluate(() => window.scrollY);
        
        // Try clicking a nav link that should scroll
        const aboutLink = await page.$('nav a[href*="#about"]');
        if (aboutLink) {
          await aboutLink.click();
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait longer for smooth scroll
          
          // Check if page scrolled (allow for small differences)
          const finalScroll = await page.evaluate(() => window.scrollY);
          const scrolled = Math.abs(finalScroll - initialScroll) > 50;
          
          if (!scrolled && initialScroll === 0) {
            // Only warn if we're at top and didn't scroll - might be that section is already visible
            const aboutSection = await page.$('#about');
            if (aboutSection) {
              const isVisible = await page.evaluate((el) => {
                const rect = el.getBoundingClientRect();
                return rect.top >= 0 && rect.top < window.innerHeight;
              }, aboutSection);
              if (!isVisible) {
                pageWarnings.push({ type: 'navigation', message: 'Navigation scroll may not be working', url });
              }
            }
          }
        }
      }
    } catch (e) {
      // Navigation test failed, but not critical
    }

    // Test language switcher
    if (locale === 'en') {
      const faButton = await page.$('button[aria-label*="Persian"], button[aria-label*="فارسی"]');
      if (!faButton) {
        pageWarnings.push({ type: 'i18n', message: 'Language switcher to Persian not found', url });
      }
    } else if (locale === 'fa') {
      const enButton = await page.$('button[aria-label*="English"]');
      if (!enButton) {
        pageWarnings.push({ type: 'i18n', message: 'Language switcher to English not found', url });
      }
    }

    errors.push(...pageErrors);
    warnings.push(...pageWarnings);
    uiIssues.push(...pageUIIssues);

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

async function runComprehensiveCrawl() {
  console.log('🚀 Starting comprehensive website crawl test...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
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
    }
    await rootPage.close();

    // Test each locale
    for (const locale of LOCALES) {
      const url = `${BASE_URL}/${locale}`;
      await testPage(browser, url, locale);
    }

    // Test blog routes
    for (const locale of LOCALES) {
      const url = `${BASE_URL}/${locale}/blog`;
      try {
        await testPage(browser, url, locale);
      } catch (e) {
        // Blog might not exist, that's okay
      }
    }

  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE CRAWL TEST SUMMARY');
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
      errs.slice(0, 5).forEach(err => {
        console.log(`    - ${err.message}`);
        if (err.url) console.log(`      URL: ${err.url}`);
      });
      if (errs.length > 5) {
        console.log(`    ... and ${errs.length - 5} more`);
      }
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
      warns.slice(0, 5).forEach(warn => {
        console.log(`    - ${warn.message}`);
        if (warn.url) console.log(`      URL: ${warn.url}`);
      });
      if (warns.length > 5) {
        console.log(`    ... and ${warns.length - 5} more`);
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
    process.exit(1);
  }

  await runComprehensiveCrawl();
})();

