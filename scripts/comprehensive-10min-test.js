const puppeteer = require('puppeteer');
const http = require('http');
const { URL } = require('url');

const BASE_URL = 'http://localhost:3000';
const TEST_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const visitedUrls = new Set();
const errors = {
  page: [],
  console: [],
  image: [],
  request: [],
  navigation: [],
  interaction: [],
  form: [],
  translation: [],
};
const warnings = {
  accessibility: [],
  layout: [],
  visual: [],
  performance: [],
  i18n: [],
  content: [],
};

let testStartTime = Date.now();

// Function to check if the dev server is running
async function checkServer(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      // Accept 200 (OK) or 307 (redirect) as valid responses
      resolve(res.statusCode === 200 || res.statusCode === 307);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Function to wait for animations/transitions
async function waitForAnimations(page, duration = 1000) {
  await page.evaluate((duration) => {
    return new Promise(resolve => setTimeout(resolve, duration));
  }, duration);
}

// Function to test navigation
async function testNavigation(page, locale) {
  console.log(`  🔗 Testing navigation...`);
  const navLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('nav a[href^="#"]'))
      .map(a => ({
        href: a.getAttribute('href'),
        text: a.textContent.trim(),
        visible: a.offsetParent !== null
      }));
  });

  for (const link of navLinks) {
    try {
      const targetId = link.href.substring(1);
      const beforeScroll = await page.evaluate(() => window.scrollY);
      
      await page.evaluate((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, targetId);
      
      await waitForAnimations(page, 2000);
      
      const afterScroll = await page.evaluate(() => window.scrollY);
      const targetElement = await page.$(`#${targetId}`);
      
      if (!targetElement) {
        errors.navigation.push(`Navigation link "${link.text}" points to non-existent section: #${targetId}`);
      } else if (beforeScroll === afterScroll && beforeScroll > 0) {
        warnings.navigation.push(`Navigation scroll may not work for: ${link.text}`);
      }
    } catch (e) {
      errors.navigation.push(`Error testing navigation link "${link.text}": ${e.message}`);
    }
  }
}

// Function to test language switcher
async function testLanguageSwitcher(page, currentLocale) {
  console.log(`  🌐 Testing language switcher...`);
  try {
    const switcher = await page.$('button[aria-label*="Switch"]');
    if (switcher) {
      const targetLocale = currentLocale === 'en' ? 'fa' : 'en';
      await switcher.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
      await waitForAnimations(page, 2000);
      
      const newUrl = page.url();
      if (!newUrl.includes(`/${targetLocale}`)) {
        errors.i18n.push(`Language switcher failed: Expected /${targetLocale}, got ${newUrl}`);
      }
    }
  } catch (e) {
    errors.i18n.push(`Language switcher error: ${e.message}`);
  }
}

// Function to test contact form
async function testContactForm(page, locale) {
  console.log(`  📝 Testing contact form...`);
  try {
    // Scroll to contact section
    await page.evaluate(() => {
      const section = document.getElementById('contact');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    await waitForAnimations(page, 2000);
    
    // Fill form fields
    const nameField = await page.$('#contact-name');
    const emailField = await page.$('#contact-email');
    const messageField = await page.$('#contact-message');
    
    if (nameField && emailField && messageField) {
      await nameField.type('Test User', { delay: 50 });
      await emailField.type('test@example.com', { delay: 50 });
      await messageField.type('This is a test message from automated testing.', { delay: 50 });
      
      await waitForAnimations(page, 500);
      
      // Check if submit button exists and is enabled
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        const isDisabled = await page.evaluate((btn) => btn.disabled, submitButton);
        if (isDisabled) {
          warnings.form.push('Submit button is disabled after filling form');
        }
      }
      
      // Clear form (don't actually submit to avoid spam)
      await page.evaluate(() => {
        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const message = document.getElementById('contact-message');
        if (name) name.value = '';
        if (email) email.value = '';
        if (message) message.value = '';
      });
    } else {
      errors.form.push('Contact form fields not found');
    }
  } catch (e) {
    errors.form.push(`Contact form test error: ${e.message}`);
  }
}

// Function to test project cards
async function testProjectCards(page) {
  console.log(`  🎨 Testing project cards...`);
  try {
    await page.evaluate(() => {
      const section = document.getElementById('projects');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    await waitForAnimations(page, 2000);
    
    const cards = await page.$$('[class*="glass-strong"]');
    console.log(`    Found ${cards.length} project cards`);
    
    for (let i = 0; i < Math.min(cards.length, 3); i++) {
      const card = cards[i];
      
      // Hover over card
      await card.hover();
      await waitForAnimations(page, 1000);
      
      // Check for role and tools
      const cardInfo = await page.evaluate((cardEl) => {
        const roleLabel = Array.from(cardEl.querySelectorAll('span')).find(s => 
          s.textContent.includes('My Role:') || s.textContent.includes('نقش من:')
        );
        const roleValue = roleLabel ? roleLabel.nextElementSibling : null;
        const roleText = roleValue ? roleValue.textContent.trim() : '';
        
        const toolsLabel = Array.from(cardEl.querySelectorAll('span')).find(s => 
          s.textContent.includes('Tools:') || s.textContent.includes('ابزارها:')
        );
        const toolsContainer = toolsLabel ? toolsLabel.parentElement : null;
        const toolSpans = toolsContainer ? Array.from(toolsContainer.querySelectorAll('span')).filter(s => 
          s.className.includes('bg-[#1a1443]')
        ) : [];
        
        return { role: roleText, toolsCount: toolSpans.length };
      }, card);
      
      if (!cardInfo.role) {
        if (!errors.content) errors.content = [];
        errors.content.push(`Project card ${i + 1}: Role is empty`);
      }
      if (cardInfo.toolsCount === 0) {
        if (!errors.content) errors.content = [];
        errors.content.push(`Project card ${i + 1}: Tools are empty`);
      }
      
      // Check for code/demo links
      const links = await card.$$('a[href]');
      for (const link of links) {
        const href = await page.evaluate(el => el.href, link);
        if (href && !href.startsWith('http')) {
          if (!warnings.content) warnings.content = [];
          warnings.content.push(`Project card ${i + 1}: Link may be broken: ${href}`);
        }
      }
    }
  } catch (e) {
    errors.interaction.push(`Project cards test error: ${e.message}`);
  }
}

// Function to test all sections
async function testAllSections(page) {
  console.log(`  📑 Testing all sections...`);
  const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'education', 'testimonials', 'contact'];
  
  for (const sectionId of sections) {
    try {
      await page.evaluate((id) => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, sectionId);
      
      await waitForAnimations(page, 1500);
      
      const sectionInfo = await page.evaluate((id) => {
        const section = document.getElementById(id);
        if (!section) return { exists: false };
        
        const rect = section.getBoundingClientRect();
        const styles = window.getComputedStyle(section);
        
        return {
          exists: true,
          visible: rect.width > 0 && rect.height > 0 && parseFloat(styles.opacity) > 0,
          opacity: styles.opacity,
          display: styles.display,
          hasContent: section.textContent.trim().length > 0
        };
      }, sectionId);
      
      if (!sectionInfo.exists) {
        warnings.content.push(`Section #${sectionId} not found`);
      } else if (!sectionInfo.visible) {
        warnings.visual.push(`Section #${sectionId} is not visible (opacity: ${sectionInfo.opacity})`);
      } else if (!sectionInfo.hasContent) {
        warnings.content.push(`Section #${sectionId} appears to be empty`);
      }
    } catch (e) {
      errors.interaction.push(`Error testing section #${sectionId}: ${e.message}`);
    }
  }
}

// Function to test responsive behavior
async function testResponsive(page) {
  console.log(`  📱 Testing responsive behavior...`);
  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' }
  ];
  
  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height });
    await waitForAnimations(page, 1000);
    
    const layoutIssues = await page.evaluate(() => {
      const issues = [];
      const elements = Array.from(document.querySelectorAll('*'));
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        
        // Check for horizontal overflow
        if (rect.right > window.innerWidth + 10) {
          issues.push(`Element ${el.tagName} overflows horizontally`);
        }
        
        // Check for elements with opacity 0 that should be visible
        if (parseFloat(styles.opacity) === 0 && 
            rect.width > 200 && rect.height > 200 &&
            rect.top < window.innerHeight && rect.bottom > 0 &&
            styles.display !== 'none') {
          issues.push(`Large hidden element: ${el.tagName}${el.id ? `#${el.id}` : ''}`);
        }
      });
      
      return issues;
    });
    
    if (layoutIssues.length > 0) {
      warnings.layout.push(`${viewport.name} viewport: ${layoutIssues.length} layout issues`);
    }
  }
  
  // Reset to desktop
  await page.setViewport({ width: 1920, height: 1080 });
}

// Function to test footer links
async function testFooterLinks(page) {
  console.log(`  🔗 Testing footer links...`);
  const footerLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('footer a[href]'))
      .map(a => ({
        href: a.href,
        text: a.textContent.trim(),
        hasAriaLabel: !!a.getAttribute('aria-label')
      }));
  });
  
  for (const link of footerLinks) {
    if (!link.hasAriaLabel && !link.text) {
      warnings.accessibility.push(`Footer link without aria-label or text: ${link.href}`);
    }
  }
}

// Main crawl function
async function crawlPage(browser, url, depth = 0) {
  if (visitedUrls.has(url) || depth > 3 || (Date.now() - testStartTime) > TEST_DURATION) {
    return;
  }

  visitedUrls.add(url);
  const locale = url.includes('/fa') ? 'fa' : 'en';
  console.log(`\n🔍 Testing: ${url} (${locale})`);

  let page;
  try {
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    // Capture errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.console.push(`${url}: ${msg.text()}`);
      }
    });

    page.on('pageerror', (err) => {
      errors.page.push(`${url}: ${err.message}`);
    });

    page.on('requestfailed', (request) => {
      if (!request.url().includes('/_next/')) {
        errors.request.push(`${url}: Failed to load ${request.resourceType()}: ${request.url()}`);
      }
    });

    await page.setViewport({ width: 1920, height: 1080 });
    await page.setCacheEnabled(false);
    await page.goto(url, { waitUntil: 'networkidle0' });
    await waitForAnimations(page, 3000);

    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => !img.complete || img.naturalHeight === 0 || img.naturalWidth === 0)
        .filter(img => !img.src.includes('/_next/image'))
        .map(img => ({ src: img.src, alt: img.alt || 'No alt text' }));
    });
    brokenImages.forEach(img => errors.image.push(`${url}: Broken image: ${img.src} (alt: ${img.alt})`));

    // Check for missing alt text
    const imagesWithoutAlt = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => !img.alt || img.alt.trim() === '')
        .filter(img => !img.getAttribute('aria-hidden'))
        .map(img => img.src);
    });
    imagesWithoutAlt.forEach(src => warnings.accessibility.push(`${url}: Image missing alt text: ${src}`));

    // Test all interactions
    await testNavigation(page, locale);
    await testLanguageSwitcher(page, locale);
    await testContactForm(page, locale);
    await testProjectCards(page);
    await testAllSections(page);
    await testFooterLinks(page);
    
    if (depth === 0) {
      await testResponsive(page);
    }

    // Check for visual issues
    const visualIssues = await page.evaluate(() => {
      const issues = [];
      const elements = Array.from(document.querySelectorAll('*'));
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        if (parseFloat(styles.opacity) === 0 && 
            rect.width > 200 && rect.height > 200 &&
            rect.top < window.innerHeight && rect.bottom > 0 &&
            styles.display !== 'none' &&
            !el.hasAttribute('aria-hidden')) {
          issues.push(`${el.tagName}${el.id ? `#${el.id}` : ''}${el.className ? `.${el.className.split(' ')[0]}` : ''}`);
        }
      });
      
      return issues;
    });
    
    if (visualIssues.length > 0) {
      warnings.visual.push(`${url}: ${visualIssues.length} hidden elements in viewport`);
    }

    // Check translation keys
    try {
      const translationKeys = await page.evaluate(() => {
        const text = document.body.textContent || '';
        const keys = [];
        // Look for common translation key patterns
        const suspiciousPatterns = [
          'testimonials.title',
          'projects.title',
          'nav.contact',
          'projects.projects.title'
        ];
        
        suspiciousPatterns.forEach(pattern => {
          if (text.includes(pattern)) {
            keys.push(pattern);
          }
        });
        
        return [...new Set(keys)];
      });
      
      if (translationKeys && translationKeys.length > 0) {
        translationKeys.forEach(key => {
          errors.translation.push(`${url}: Translation key displayed: ${key}`);
        });
      }
    } catch (e) {
      // Ignore translation key detection errors
    }

    // Extract and crawl other pages
    if (depth < 2) {
      const links = await page.evaluate((baseUrl) => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.href)
          .filter(href => href.startsWith(baseUrl) || href.startsWith('/'))
          .filter(href => !href.includes('#'))
          .filter(href => !href.includes('mailto:'))
          .filter(href => !href.includes('tel:'));
      }, BASE_URL);

      for (const link of links.slice(0, 5)) { // Limit to 5 links per page
        const absoluteUrl = new URL(link, BASE_URL).href;
        if (!visitedUrls.has(absoluteUrl) && (Date.now() - testStartTime) < TEST_DURATION) {
          await crawlPage(browser, absoluteUrl, depth + 1);
        }
      }
    }

  } catch (e) {
    errors.page.push(`Error crawling ${url}: ${e.message}`);
  } finally {
    if (page) {
      await page.close();
    }
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starting 10-minute comprehensive website test...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Duration: 10 minutes\n`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    // Test root redirect
    const rootPage = await browser.newPage();
    await rootPage.goto(BASE_URL, { waitUntil: 'networkidle0' });
    const finalUrl = rootPage.url();
    if (!finalUrl.includes('/en') && !finalUrl.includes('/fa')) {
      errors.navigation.push(`Root redirect failed: ${finalUrl}`);
    }
    await rootPage.close();

    // Start comprehensive crawling
    testStartTime = Date.now();
    await crawlPage(browser, `${BASE_URL}/en`, 0);
    await crawlPage(browser, `${BASE_URL}/fa`, 0);
    
    // Continue testing until time is up
    while ((Date.now() - testStartTime) < TEST_DURATION) {
      const remainingTime = TEST_DURATION - (Date.now() - testStartTime);
      if (remainingTime < 30000) break; // Less than 30 seconds left
      
      // Re-test main pages with different interactions
      const pages = [`${BASE_URL}/en`, `${BASE_URL}/fa`];
      for (const url of pages) {
        if ((Date.now() - testStartTime) >= TEST_DURATION) break;
        await crawlPage(browser, url, 0);
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

  } finally {
    await browser.close();
  }

  const elapsed = ((Date.now() - testStartTime) / 1000 / 60).toFixed(2);
  console.log(`\n\n============================================================`);
  console.log(`📊 COMPREHENSIVE TEST SUMMARY (${elapsed} minutes)`);
  console.log(`============================================================\n`);

  if (Object.values(errors).flat().length > 0) {
    console.log(`❌ ERRORS (${Object.values(errors).flat().length}):\n`);
    for (const type in errors) {
      if (errors[type].length > 0) {
        console.log(`  ${type.toUpperCase()} (${errors[type].length}):`);
        errors[type].slice(0, 10).forEach(err => console.log(`    - ${err}`));
        if (errors[type].length > 10) {
          console.log(`    ... and ${errors[type].length - 10} more`);
        }
      }
    }
    console.log('\n');
  } else {
    console.log('✅ No errors found!');
  }

  if (Object.values(warnings).flat().length > 0) {
    console.log(`⚠️  WARNINGS (${Object.values(warnings).flat().length}):\n`);
    for (const type in warnings) {
      if (warnings[type].length > 0) {
        console.log(`  ${type.toUpperCase()} (${warnings[type].length}):`);
        warnings[type].slice(0, 10).forEach(warn => console.log(`    - ${warn}`));
        if (warnings[type].length > 10) {
          console.log(`    ... and ${warnings[type].length - 10} more`);
        }
      }
    }
    console.log('\n');
  } else {
    console.log('✅ No warnings found!');
  }

  console.log(`============================================================`);
  if (Object.values(errors).flat().length === 0 && Object.values(warnings).flat().length === 0) {
    console.log('✅✅✅ PERFECT! NO ISSUES FOUND! ✅✅✅');
  } else {
    console.log(`Found ${Object.values(errors).flat().length} error(s) and ${Object.values(warnings).flat().length} warning(s)`);
  }
  console.log(`============================================================`);

  if (Object.values(errors).flat().length > 0) {
    process.exit(1);
  }
}

// Check if server is running
checkServer(BASE_URL).then(isRunning => {
  if (isRunning) {
    runComprehensiveTest().catch(console.error);
  } else {
    console.error(`Server not running at ${BASE_URL}. Please start the Next.js development server first.`);
    process.exit(1);
  }
});

