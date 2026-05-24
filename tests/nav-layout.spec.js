import { test, expect } from '@playwright/test';

const NAV_MIN = 128;
const NAV_MAX = 132;

async function navBox(page) {
  const nav = page.locator('nav.nav');
  await expect(nav).toBeVisible();
  return await nav.boundingBox();
}

async function dismissLeader(page) {
  // FilmLeader uses sessionStorage to suppress itself on repeat visits; set it
  // before any other navigation so screenshots show the actual nav, not the intro.
  await page.addInitScript(() => {
    try { sessionStorage.setItem('leaderShown', '1'); } catch {}
  });
}

test.describe('Nav layout — 120px logo, 5px padding, downstream offsets', () => {
  test('desktop: nav ~130px, no overlap with hero/scene-heading/filter-bar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await dismissLeader(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Let scene-heading flash in
    await page.waitForTimeout(400);

    const n = await navBox(page);
    expect(n.height, `nav height should be ${NAV_MIN}-${NAV_MAX}px`).toBeGreaterThanOrEqual(NAV_MIN);
    expect(n.height).toBeLessThanOrEqual(NAV_MAX);

    const heroBox = await page.locator('section.hero, .hero').first().boundingBox();
    expect(heroBox, 'hero must be present').not.toBeNull();
    expect(heroBox.y, 'hero top should sit at/below nav bottom').toBeGreaterThanOrEqual(n.y + n.height - 1);

    const sh = page.locator('.scene-heading');
    if (await sh.count()) {
      const shBox = await sh.boundingBox();
      if (shBox) {
        expect(shBox.y, 'scene-heading top should sit below nav bottom').toBeGreaterThanOrEqual(n.y + n.height);
      }
    }

    // Confirm the sticky filter bar is configured to stick *below* the nav.
    // (Asserting the CSS contract directly is more reliable than trying to
    // engage sticky in a long section across timing-dependent scrolls.)
    const fbStickyTop = await page.locator('.filter-bar-sticky').evaluate((el) => {
      const cs = getComputedStyle(el);
      return { position: cs.position, top: parseFloat(cs.top) };
    });
    expect(fbStickyTop.position).toBe('sticky');
    expect(fbStickyTop.top, 'filter-bar-sticky top must be >= nav height').toBeGreaterThanOrEqual(n.height);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(150);
    await page.screenshot({ path: 'test-results/nav-layout-desktop.png', fullPage: false });
  });

  test('mobile: nav ~130px, no overlap with hero', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await dismissLeader(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const n = await navBox(page);
    expect(n.height, `mobile nav height should be ${NAV_MIN}-${NAV_MAX}px`).toBeGreaterThanOrEqual(NAV_MIN);
    expect(n.height).toBeLessThanOrEqual(NAV_MAX);

    const heroBox = await page.locator('section.hero, .hero').first().boundingBox();
    expect(heroBox.y, 'hero top should sit at/below nav bottom on mobile').toBeGreaterThanOrEqual(n.y + n.height - 1);

    await page.screenshot({ path: 'test-results/nav-layout-mobile.png', fullPage: false });
  });
});
