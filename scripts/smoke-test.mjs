/**
 * Browser smoke test for the built site: navigation, accordion, language switch, map facade,
 * mobile menu and no-JS rendering.
 *
 *   npm run build && npm run preview     # Astro keeps the preview server running in the background
 *   npm run test:smoke
 *   npx astro preview stop
 *
 * SMOKE_URL overrides the base URL. Browser selection works like scripts/generate-images.mjs.
 */
import { chromium } from 'playwright-core';

const base = process.env.SMOKE_URL ?? 'http://127.0.0.1:4321';

try {
  await fetch(base);
} catch {
  console.error(`No server at ${base}. Run "npm run build && npm run preview" first.`);
  process.exit(1);
}

const browser = await chromium.launch({
  channel: process.env.PW_EXECUTABLE_PATH ? undefined : (process.env.PW_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : 'chrome')),
  executablePath: process.env.PW_EXECUTABLE_PATH,
});

let failed = 0;
const pageErrors = [];
const check = (label, passed) => {
  if (!passed) failed += 1;
  console.log(`${passed ? 'PASS' : 'FAIL'}  ${label}`);
};
const topOf = (page, id) =>
  page.evaluate((target) => Math.round(document.getElementById(target).getBoundingClientRect().top), id);

async function newPage(options) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && pageErrors.push(message.text()));
  return { context, page };
}

try {
  {
    const { context, page } = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3500);

    await page.click('.nav a[href="#calisma-alanlari"]');
    await page.waitForTimeout(2200);
    check('desktop nav scrolls to the practice section', Math.abs(await topOf(page, 'calisma-alanlari')) < 5);
    check(
      'active nav link follows scroll',
      await page.evaluate(() => document.querySelector('.nav a.is-active')?.getAttribute('href') === '#calisma-alanlari'),
    );

    await page.click('#area-head-2');
    await page.waitForTimeout(900);
    check('accordion opens the clicked area', (await page.getAttribute('#area-head-2', 'aria-expanded')) === 'true');
    check('accordion closes the previously open area', (await page.getAttribute('#area-head-0', 'aria-expanded')) === 'false');

    // The header hides while scrolling down, so trigger links programmatically from here on.
    await page.evaluate(() => document.querySelector('.header-actions [data-lang-link][hreflang="en"]').click());
    await page.waitForURL('**/en/**');
    await page.waitForTimeout(1500);
    check('language switch keeps the current section', page.url().endsWith('/en/#practice'));
    check('English page lands on that section', Math.abs(await topOf(page, 'practice')) < 40);
    check(
      'intro is skipped on the second page view',
      await page.evaluate(() => document.documentElement.classList.contains('intro-seen')),
    );

    await page.evaluate(() => document.querySelector('.nav a[href="#contact"]').click());
    await page.waitForTimeout(2000);
    check('Google Maps is not loaded before consent', (await page.locator('[data-map] iframe').count()) === 0);
    await page.click('[data-map-load]');
    await page.waitForTimeout(1500);
    check('map loads on request', (await page.locator('[data-map] iframe').count()) === 1);
    await context.close();
  }

  {
    const { context, page } = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3500);
    await page.click('[data-menu-toggle]');
    await page.waitForTimeout(900);
    await page.click('#mobile-menu a[href="#ekibimiz"]');
    await page.waitForTimeout(2500);
    check('mobile menu closes after choosing a link', (await page.getAttribute('[data-menu-toggle]', 'aria-expanded')) === 'false');
    check('mobile menu link scrolls to the team section', Math.abs(await topOf(page, 'ekibimiz')) < 5);
    check(
      'no horizontal overflow on mobile',
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    );
    await context.close();
  }

  {
    const { context, page } = await newPage({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false });
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    check(
      'without JavaScript the headline is visible and the preloader hidden',
      await page.evaluate(() => {
        const line = document.querySelector('.hero-title .line-inner').getBoundingClientRect();
        const mask = document.querySelector('.hero-title .line').getBoundingClientRect();
        return line.top >= mask.top - 2 && getComputedStyle(document.querySelector('.preloader')).display === 'none';
      }),
    );
    await context.close();
  }
} finally {
  await browser.close();
}

check(`no page errors${pageErrors.length ? `: ${pageErrors.join(' | ')}` : ''}`, pageErrors.length === 0);
process.exit(failed ? 1 : 0);
