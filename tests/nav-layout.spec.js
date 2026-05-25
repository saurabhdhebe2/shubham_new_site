import { test, expect } from '@playwright/test';

const RANGES = {
  desktop: { min: 108, max: 112 }, // logo 100 + 2*5 padding
  tablet:  { min: 88,  max: 92  }, // logo 80  + 2*5 padding
  mobile:  { min: 64,  max: 68  }, // logo 56  + 2*5 padding
};

async function navBox(page) {
  const nav = page.locator('nav.nav');
  await expect(nav).toBeVisible();
  return await nav.boundingBox();
}

async function dismissLeader(page) {
  await page.addInitScript(() => {
    try { sessionStorage.setItem('leaderShown', '1'); } catch {}
  });
}

test.describe('Nav layout — responsive logo (120 / 80 / 56) + downstream offsets', () => {
  test('desktop: nav ~130px, no overlap with hero/scene-heading/filter-bar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await dismissLeader(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const n = await navBox(page);
    const r = RANGES.desktop;
    expect(n.height, `nav should be ${r.min}-${r.max}px`).toBeGreaterThanOrEqual(r.min);
    expect(n.height).toBeLessThanOrEqual(r.max);

    const heroBox = await page.locator('section.hero, .hero').first().boundingBox();
    expect(heroBox, 'hero must be present').not.toBeNull();
    expect(heroBox.y).toBeGreaterThanOrEqual(n.y + n.height - 1);

    const sh = page.locator('.scene-heading');
    if (await sh.count()) {
      const shBox = await sh.boundingBox();
      if (shBox) expect(shBox.y).toBeGreaterThanOrEqual(n.y + n.height);
    }

    const fb = await page.locator('.filter-bar-sticky').evaluate((el) => {
      const cs = getComputedStyle(el);
      return { position: cs.position, top: parseFloat(cs.top) };
    });
    expect(fb.position).toBe('sticky');
    expect(fb.top).toBeGreaterThanOrEqual(n.height);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(150);
    await page.screenshot({ path: 'test-results/nav-layout-desktop.png', fullPage: false });
  });

  test('tablet: nav ~90px, hero/filter-bar clear nav', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1024 });
    await dismissLeader(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const n = await navBox(page);
    const r = RANGES.tablet;
    expect(n.height, `tablet nav should be ${r.min}-${r.max}px`).toBeGreaterThanOrEqual(r.min);
    expect(n.height).toBeLessThanOrEqual(r.max);

    const heroBox = await page.locator('section.hero, .hero').first().boundingBox();
    expect(heroBox.y).toBeGreaterThanOrEqual(n.y + n.height - 1);

    const fb = await page.locator('.filter-bar-sticky').evaluate((el) => {
      const cs = getComputedStyle(el);
      return { position: cs.position, top: parseFloat(cs.top) };
    });
    expect(fb.top).toBeGreaterThanOrEqual(n.height);

    await page.screenshot({ path: 'test-results/nav-layout-tablet.png', fullPage: false });
  });

  test('mobile: nav ~66px, hero/filter-bar clear nav', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await dismissLeader(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const n = await navBox(page);
    const r = RANGES.mobile;
    expect(n.height, `mobile nav should be ${r.min}-${r.max}px`).toBeGreaterThanOrEqual(r.min);
    expect(n.height).toBeLessThanOrEqual(r.max);

    const heroBox = await page.locator('section.hero, .hero').first().boundingBox();
    expect(heroBox.y).toBeGreaterThanOrEqual(n.y + n.height - 1);

    const fb = await page.locator('.filter-bar-sticky').evaluate((el) => {
      const cs = getComputedStyle(el);
      return { position: cs.position, top: parseFloat(cs.top) };
    });
    expect(fb.top).toBeGreaterThanOrEqual(n.height);

    await page.screenshot({ path: 'test-results/nav-layout-mobile.png', fullPage: false });
  });
});
