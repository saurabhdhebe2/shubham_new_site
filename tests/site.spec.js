import { test, expect } from '@playwright/test';

test.describe('Shubham Film Productions basic UI', () => {
  test('hero renders headline and primary actions', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Shubham');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Productions');
    await expect(page.getByRole('button', { name: /view work/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /contact/i }).first()).toBeVisible();
  });

  test('hero loads the local background video', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const video = page.locator('video.hero-bg-video');
    await expect(video).toBeAttached();
    await expect(video).toHaveAttribute('src', '/herosection.mp4');
    await expect(video).toHaveJSProperty('autoplay', true);
    await expect(video).toHaveJSProperty('muted', true);
    await expect(video).toHaveJSProperty('loop', true);
  });

  test('clicking nav link scrolls to Work section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Work', exact: true }).click();
    await expect(page.locator('#work')).toBeInViewport();
  });

  test('portfolio shows all six category filters', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#work').scrollIntoViewIfNeeded();
    const filterBar = page.locator('#work .filter-bar');
    for (const cat of ['All', 'Reels', 'Documentary', 'Music Films', 'Podcast', 'Commercial']) {
      await expect(filterBar.getByRole('button', { name: cat, exact: true })).toBeVisible();
    }
  });

  test('Documentary filter activates and updates active pill', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#work').scrollIntoViewIfNeeded();
    const docButton = page.locator('#work .filter-bar').getByRole('button', { name: 'Documentary', exact: true });
    await docButton.click();
    await expect(docButton).toHaveClass(/active/);
  });

  test('contact drawer opens, accepts input, and closes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /start a project/i }).first().click();
    const drawer = page.locator('aside.drawer.open');
    await expect(drawer).toBeVisible();
    await drawer.locator('input').first().fill('Test User');
    await expect(drawer.locator('input').first()).toHaveValue('Test User');
    await page.locator('.drawer-close').click();
    await expect(page.locator('aside.drawer.open')).toHaveCount(0);
  });

  test('CTA email button triggers toast', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('.cta-email').click();
    await expect(page.locator('.toast.show')).toBeVisible();
    await expect(page.locator('.toast.show')).toContainText(/copied/i);
  });

  test('mobile nav: hamburger toggles overlay', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const overlay = page.locator('.mob-overlay');
    await expect(overlay).not.toHaveClass(/open/);
    await page.locator('.mob-toggle').click();
    await expect(overlay).toHaveClass(/open/);
  });
});

/* ─── YouTube playlist data + per-video playback verification ─── */
test.describe('YouTube videos fetched from playlists and playable', () => {
  let videos = [];

  test.beforeAll(async ({ request }) => {
    const res = await request.get('http://localhost:3000/api/youtube?category=all');
    expect(res.ok(), 'YouTube API route should return 200').toBeTruthy();
    videos = await res.json();
    console.log(`Fetched ${videos.length} videos across all categories`);
  });

  test('API returns at least one video per configured category', async ({ request }) => {
    const cats = ['reels', 'documentary', 'music', 'podcast', 'commercial'];
    for (const c of cats) {
      const res = await request.get(`http://localhost:3000/api/youtube?category=${c}`);
      expect(res.ok(), `Category "${c}" should return 200`).toBeTruthy();
      const data = await res.json();
      expect(Array.isArray(data), `Category "${c}" should return an array`).toBeTruthy();
      expect(data.length, `Category "${c}" should have at least one video`).toBeGreaterThan(0);
      console.log(`  ${c}: ${data.length} videos`);
    }
  });

  test('every video has the required fields (id, title, youtubeId, cat, thumbnail)', async () => {
    expect(videos.length, 'should have fetched videos').toBeGreaterThan(0);
    for (const v of videos) {
      expect(v.youtubeId, `video "${v.title}" must have a youtubeId`).toBeTruthy();
      expect(v.title, 'video must have a title').toBeTruthy();
      expect(v.cat, 'video must have a cat').toBeTruthy();
      expect(v.thumbnail, `video "${v.title}" should have a thumbnail`).toBeTruthy();
      expect(['Reels', 'Documentary', 'Music Films', 'Podcast', 'Commercial']).toContain(v.cat);
    }
  });

  test('first tile in portfolio opens lightbox with a YouTube iframe', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#work').scrollIntoViewIfNeeded();
    const firstTile = page.locator('article.tile').first();
    await expect(firstTile).toBeVisible();
    await firstTile.click();

    const lightbox = page.locator('.lightbox.open');
    await expect(lightbox).toBeVisible();

    const playerIframe = lightbox.locator('iframe').first();
    await expect(playerIframe).toBeAttached();
    const src = await playerIframe.getAttribute('src');
    expect(src, 'lightbox iframe should point at youtube.com/embed/').toContain('youtube.com/embed/');
    expect(src).toContain('autoplay=1');

    // Verify the iframe responds (network-level YouTube embed returns content)
    const matches = src.match(/embed\/([^?]+)/);
    expect(matches?.[1], 'iframe src must contain a videoId').toBeTruthy();

    await page.keyboard.press('Escape');
    await expect(page.locator('.lightbox.open')).toHaveCount(0);
  });

  test('lightbox shows project details (title, category, year)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.locator('article.tile').first().click();
    const meta = page.locator('.lightbox-meta');
    await expect(meta).toBeVisible();
    await expect(meta.locator('h3')).not.toBeEmpty();
    // Year and Category rows should be present
    await expect(meta.locator('.row', { hasText: 'Year' })).toBeVisible();
    await expect(meta.locator('.row', { hasText: 'Category' })).toBeVisible();
  });

  test('navigating with arrow key advances to next video in lightbox', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.locator('article.tile').first().click();
    const title1 = await page.locator('.lightbox-meta h3').textContent();
    await page.keyboard.press('ArrowRight');
    // Wait for the iframe src to change (new video loaded)
    await page.waitForTimeout(500);
    const title2 = await page.locator('.lightbox-meta h3').textContent();
    expect(title2, 'title should change on arrow-right').not.toEqual(title1);
  });

  test('every tile opens a lightbox with a unique playable YouTube embed', async ({ page }) => {
    test.setTimeout(120_000); // Allow more time we'll iterate through every tile
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#work').scrollIntoViewIfNeeded();
    const tileCount = await page.locator('article.tile').count();
    expect(tileCount, 'should render at least one tile').toBeGreaterThan(0);

    const seenIds = new Set();
    const max = Math.min(tileCount, 10); // Sample up to 10 tiles to keep the run reasonable
    for (let i = 0; i < max; i++) {
      const tile = page.locator('article.tile').nth(i);
      await tile.scrollIntoViewIfNeeded();
      await tile.click();
      const lb = page.locator('.lightbox.open');
      await expect(lb).toBeVisible();

      const iframe = lb.locator('iframe').first();
      await expect(iframe).toBeAttached();
      const src = await iframe.getAttribute('src');
      const id = src.match(/embed\/([^?]+)/)?.[1];
      expect(id, `tile #${i} should have a videoId in its iframe`).toBeTruthy();
      seenIds.add(id);

      // Verify project meta is filled in
      await expect(lb.locator('.lightbox-meta h3')).not.toBeEmpty();

      await page.keyboard.press('Escape');
      await expect(page.locator('.lightbox.open')).toHaveCount(0);
    }
    expect(seenIds.size, 'should have seen distinct YouTube IDs').toBeGreaterThan(0);
    console.log(`Verified ${seenIds.size} unique YouTube embeds across ${max} tiles`);
  });

  test('each YouTube videoId returns a valid oEmbed response (video is public/exists)', async ({ request }) => {
    test.setTimeout(120_000);
    const failed = [];
    // Sample up to 15 videos to keep runtime reasonable
    const sample = videos.slice(0, 15);
    for (const v of sample) {
      const res = await request.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.youtubeId}&format=json`);
      if (!res.ok()) failed.push({ title: v.title, id: v.youtubeId, status: res.status() });
    }
    expect(failed, `Videos that don't exist or aren't embeddable: ${JSON.stringify(failed, null, 2)}`).toEqual([]);
    console.log(`All ${sample.length} sampled videos are public and embeddable on YouTube`);
  });

  test('mixed-category grid packs tightly - no giant empty bands between tile rows', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const tiles = page.locator('article.tile');
    const count = await tiles.count();
    expect(count, 'should have tiles to inspect').toBeGreaterThan(4);

    // Collect bounding boxes for the first ~20 tiles
    const boxes = [];
    for (let i = 0; i < Math.min(count, 20); i++) {
      const box = await tiles.nth(i).boundingBox();
      if (box) boxes.push({ ...box, bottom: box.y + box.height });
    }

    // Bucket tiles into "rows" by similar top position (60px tolerance)
    const rows = {};
    for (const b of boxes) {
      const key = Math.round(b.y / 60) * 60;
      (rows[key] = rows[key] || []).push(b);
    }
    const rowTops = Object.keys(rows).map(Number).sort((a, b) => a - b);
    const rowMaxBottoms = rowTops.map(t => Math.max(...rows[t].map(b => b.bottom)));

    // For each pair of adjacent rows, the vertical gap should be reasonable.
    // gap = nextRow.top - currentRow.maxBottom. Allowable gap ≈ grid gap (16px) + small slop.
    let maxGap = 0;
    for (let i = 0; i < rowTops.length - 1; i++) {
      const gap = rowTops[i + 1] - rowMaxBottoms[i];
      if (gap > maxGap) maxGap = gap;
    }
    expect(maxGap, `Largest vertical gap between tile rows: ${maxGap}px (should be under 80px)`).toBeLessThan(80);
    console.log(`Layout packing OK - max inter-row gap: ${maxGap}px across ${rowTops.length} rows`);
  });
});
