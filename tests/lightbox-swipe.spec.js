import { test, expect, devices } from '@playwright/test';

// Mobile-like chromium context (avoid WebKit which isn't installed).
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
});

async function openFirstTile(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('#work').scrollIntoViewIfNeeded();
  const firstTile = page.locator('.portfolio .tile').first();
  await firstTile.click();
  const lightbox = page.locator('.lightbox.open');
  await expect(lightbox).toBeVisible();
  // wait for iris-open class so swipe handlers are wired and frame is interactive
  await expect(lightbox).toHaveClass(/iris-open/);
  return lightbox;
}

async function swipeDown(page, { startX = 200, startY = 200, distance = 200, steps = 12, holdMs = 0 } = {}) {
  await page.touchscreen.tap(startX, startY).catch(() => {});
  // touchscreen.tap doesn't keep finger down; use low-level dispatchEvent
  const handle = await page.evaluateHandle(() => document.querySelector('.lightbox'));
  // simulate touchstart -> touchmove -> touchend via CDP-style touch events
  await page.evaluate(({ startX, startY, distance, steps, holdMs }) => {
    return new Promise(async (resolve) => {
      const el = document.querySelector('.lightbox');
      if (!el) return resolve(null);
      const mk = (type, x, y) => new TouchEvent(type, {
        bubbles: true,
        cancelable: type !== 'touchend',
        touches: type === 'touchend' ? [] : [new Touch({ identifier: 1, target: el, clientX: x, clientY: y })],
        targetTouches: type === 'touchend' ? [] : [new Touch({ identifier: 1, target: el, clientX: x, clientY: y })],
        changedTouches: [new Touch({ identifier: 1, target: el, clientX: x, clientY: y })],
      });
      el.dispatchEvent(mk('touchstart', startX, startY));
      for (let i = 1; i <= steps; i++) {
        const y = startY + (distance * i) / steps;
        el.dispatchEvent(mk('touchmove', startX, y));
        await new Promise(r => setTimeout(r, 8));
      }
      if (holdMs) await new Promise(r => setTimeout(r, holdMs));
      el.dispatchEvent(mk('touchend', startX, startY + distance));
      resolve('done');
    });
  }, { startX, startY, distance, steps, holdMs });
  await handle.dispose();
}

test.describe('Lightbox swipe-to-dismiss (mobile)', () => {
  test('A. drag down past threshold closes the lightbox', async ({ page }) => {
    const lightbox = await openFirstTile(page);
    await swipeDown(page, { startX: 180, startY: 220, distance: 260, steps: 18 });
    // After dismiss animation (~280ms), lightbox should unmount.
    await expect(lightbox).toBeHidden({ timeout: 2000 });
  });

  test('B. short drag snaps back, lightbox stays open', async ({ page }) => {
    const lightbox = await openFirstTile(page);
    const frame = lightbox.locator('.lightbox-frame');
    await swipeDown(page, { startX: 180, startY: 220, distance: 60, steps: 10 });
    // Snap-back transition lasts ~220ms; afterwards transform should be cleared.
    await page.waitForTimeout(420);
    await expect(lightbox).toBeVisible();
    const transform = await frame.evaluate(el => getComputedStyle(el).transform);
    // Identity (no translate) is matrix(1,0,0,1,0,0) or 'none'
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
  });

  test('C. drag starting inside meta sidebar does NOT dismiss', async ({ page }) => {
    const lightbox = await openFirstTile(page);
    // Dispatch the touch events directly on the .lightbox-meta element so that
    // event.target is unambiguously inside the sidebar (independent of layout
    // / scroll position on mobile, which can put meta below the viewport).
    await page.evaluate(async () => {
      const meta = document.querySelector('.lightbox-meta');
      const lightbox = document.querySelector('.lightbox');
      if (!meta || !lightbox) throw new Error('missing nodes');
      const rect = meta.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y0 = Math.max(rect.top + 30, 100);
      const mk = (type, target, x, y) => new TouchEvent(type, {
        bubbles: true,
        cancelable: type !== 'touchend',
        touches: type === 'touchend' ? [] : [new Touch({ identifier: 1, target, clientX: x, clientY: y })],
        targetTouches: type === 'touchend' ? [] : [new Touch({ identifier: 1, target, clientX: x, clientY: y })],
        changedTouches: [new Touch({ identifier: 1, target, clientX: x, clientY: y })],
      });
      // Dispatch on meta itself (target = meta); listener is on .lightbox so it still receives via bubbling.
      meta.dispatchEvent(mk('touchstart', meta, x, y0));
      for (let i = 1; i <= 14; i++) {
        const y = y0 + (220 * i) / 14;
        meta.dispatchEvent(mk('touchmove', meta, x, y));
        await new Promise(r => setTimeout(r, 8));
      }
      meta.dispatchEvent(mk('touchend', meta, x, y0 + 220));
    });
    await page.waitForTimeout(420);
    await expect(lightbox).toBeVisible();
  });

  test('D. fast flick down closes via velocity branch', async ({ page }) => {
    const lightbox = await openFirstTile(page);
    // ~90px in a very short window: dy > 60 and velocity > 0.6 px/ms
    await swipeDown(page, { startX: 180, startY: 220, distance: 100, steps: 4 });
    await expect(lightbox).toBeHidden({ timeout: 2000 });
  });

  test('E. upward drag is a no-op (no transform)', async ({ page }) => {
    const lightbox = await openFirstTile(page);
    const frame = lightbox.locator('.lightbox-frame');
    await swipeDown(page, { startX: 180, startY: 400, distance: -150, steps: 10 });
    await page.waitForTimeout(300);
    await expect(lightbox).toBeVisible();
    const transform = await frame.evaluate(el => getComputedStyle(el).transform);
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
  });
});
