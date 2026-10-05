import { test, expect, type Page } from "@playwright/test";

async function openLocation(page: Page, name: string) {
  const menu = page.locator(".village-topbar").getByRole("button", { name: "Daftar Lokasi", exact: true });
  if (await menu.getAttribute("aria-expanded") !== "true") await menu.click();
  await page.getByRole("navigation", { name: "Daftar lokasi portofolio" }).getByRole("button", { name: new RegExp(name) }).click();
  await expect(page.getByRole("dialog").first()).toBeVisible();
}

test("routing, lazy loading, all content, media and dialog focus", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
  const gameRequests: string[] = []; page.on("request", (request) => { if (/assets\/GamePage-/.test(request.url())) gameRequests.push(request.url()); });
  await page.goto("/"); await expect(page.getByRole("heading", { name: "Fullstack Developer", exact: true })).toBeVisible();
  expect(gameRequests).toHaveLength(0);
  await page.getByRole("link", { name: "Jelajahi Dunia" }).click();
  await expect(page).toHaveURL(/\/3d$/); await expect(page.locator("canvas")).toBeVisible(); await expect(page.locator(".village-loading")).toHaveCount(0);
  await expect(page.locator(".village-error")).toHaveCount(0); await expect.poll(() => gameRequests.length).toBeGreaterThan(0);
  await openLocation(page, "Rumah Karakter"); await expect(page.getByRole("heading", { name: "Darfian Ardiansyah", exact: true })).toBeVisible();
  // Focus must stay within the active modal when cycling backwards.
  for (let i = 0; i < 8; i++) await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("navigation").getByRole("button", { name: /Rumah Karakter/ })).toBeFocused();
  await openLocation(page, "Balai Proyek");
  await expect(page.getByRole("heading", { name: "Satu Data Kota Malang", exact: true })).toBeVisible();
  const shot = page.getByRole("button", { name: "Lihat screenshot Satu Data Kota Malang 1", exact: true });
  await shot.click(); await expect(page.getByRole("dialog", { includeHidden: true })).toHaveCount(2);
  await expect.poll(() => page.locator(".village-media > img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Gambar berikutnya" }).click(); await expect(page.locator(".village-media-nav")).toContainText("2 / 3");
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).toHaveCount(1); await expect(shot).toBeFocused();
  await page.keyboard.press("Escape");
  await openLocation(page, "Kebun Keahlian"); await expect(page.getByRole("heading", { name: "Backend", exact: true })).toBeVisible(); await page.keyboard.press("Escape");
  await openLocation(page, "Museum Sertifikasi"); await expect(page.locator(".village-certificate")).toHaveCount(7);
  await page.locator(".village-certificate").first().click(); await expect(page.getByRole("dialog", { includeHidden: true })).toHaveCount(2);
  await expect.poll(() => page.locator(".village-media > img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await expect(page.locator(".village-media")).toHaveCount(0);
  await expect(page.locator(".village-certificate").first()).toBeFocused();
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).toHaveCount(0);
  await openLocation(page, "Kantor Pos"); await expect(page.getByRole("link", { name: /darfianardiansyah@gmail.com/ })).toHaveAttribute("href", "mailto:darfianardiansyah@gmail.com"); await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Kembali ke Portofolio" }).click(); await expect(page).toHaveURL(/\/$/);
  await page.goBack(); await expect(page).toHaveURL(/\/3d$/); await page.reload(); await expect(page.locator(".village-error")).toHaveCount(0);
  await page.goto("/missing"); await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("renderer fallback retains HTML information", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type: string, ...args: unknown[]) {
      if (type.startsWith("webgl")) return null;
      return original.apply(this, [type, ...args] as never);
    } as typeof original;
  });
  await page.goto("/3d"); await expect(page.getByRole("heading", { name: "Dunia sedang beristirahat" })).toBeVisible();
  await openLocation(page, "Rumah Karakter"); await expect(page.getByRole("heading", { name: "Darfian Ardiansyah", exact: true })).toBeVisible();
});

test("context loss, repeated mounting and responsive layout", async ({ page }, testInfo) => {
  await page.goto("/3d"); await expect(page.locator(".village-loading")).toHaveCount(0);
  await page.locator("canvas").evaluate((canvas: HTMLCanvasElement) => canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext());
  await expect(page.locator(".village-error")).toBeVisible(); await openLocation(page, "Kebun Keahlian"); await page.keyboard.press("Escape");
  await page.locator(".village-topbar").getByRole("button", { name: "Daftar Lokasi", exact: true }).click();
  await page.getByRole("button", { name: "Muat ulang dunia" }).click(); await expect(page.locator(".village-error")).toHaveCount(0);
  for (let i = 0; i < 3; i++) {
    await page.getByRole("link", { name: "Kembali ke Portofolio" }).click(); await page.getByRole("link", { name: "Jelajahi Dunia" }).click();
    await expect(page.locator("canvas")).toHaveCount(1); await expect(page.locator(".village-error")).toHaveCount(0);
  }
  await page.screenshot({ path: testInfo.outputPath("village.png") });
  await page.setViewportSize({ width: 844, height: 390 });
  await openLocation(page, "Kantor Pos");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const panel = await page.locator(".village-panel").boundingBox(); expect(panel!.y).toBeGreaterThanOrEqual(0); expect(panel!.y + panel!.height).toBeLessThanOrEqual(390);
});

test("keyboard walking and blur reset", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Keyboard walking uses desktop viewport");
  await page.clock.install();
  await page.goto("/3d"); await expect(page.locator("canvas")).toBeVisible(); await expect(page.locator(".village-loading")).toHaveCount(0); await page.locator("canvas").focus();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
  // Follow a clear route around the central flower bed and the skill garden.
  await page.keyboard.down("a"); await page.clock.runFor(800); await page.keyboard.up("a");
  await page.keyboard.down("w"); await page.clock.runFor(1600); await page.keyboard.up("w");
  await page.keyboard.down("a"); await page.clock.runFor(1600); await page.keyboard.up("a");
  await expect(page.locator(".village-near")).toContainText("Rumah Karakter");
  await page.keyboard.press("e"); await page.clock.runFor(100); await expect(page.getByRole("dialog")).toBeVisible(); await page.keyboard.press("Escape"); await page.clock.runFor(100); await expect(page.locator("canvas")).toBeFocused();
  await page.keyboard.down("s"); await page.evaluate(() => window.dispatchEvent(new Event("blur"))); await page.clock.runFor(1100); await page.keyboard.up("s");
  await expect(page.locator(".village-near")).toContainText("Rumah Karakter");
});

test("touch directions, multi-touch, cancel and interaction", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Touch input uses the mobile project");
  await page.clock.install(); await page.goto("/3d"); await expect(page.locator("canvas")).toBeVisible(); await expect(page.locator(".village-loading")).toHaveCount(0);
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
  const session = await page.context().newCDPSession(page);
  const buttonPoint = async (label: string, id: number) => {
    const rect = (await page.getByRole("button", { name: label, exact: true }).boundingBox())!;
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, id };
  };
  const right = await buttonPoint("Berjalan ke kanan", 1), up = await buttonPoint("Berjalan ke atas", 2), left = await buttonPoint("Berjalan ke kiri", 3);
  const hold = async (points: typeof right[], duration: number, cancel = false) => {
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: points });
    await page.clock.runFor(duration);
    await session.send("Input.dispatchTouchEvent", { type: cancel ? "touchCancel" : "touchEnd", touchPoints: [] });
  };
  await hold([right], 800); await hold([right, up], 200); await page.clock.runFor(200);
  await hold([up], 2100); await hold([left], 900, true);
  await expect(page.locator(".village-near")).toContainText("Balai Proyek");
  await page.clock.runFor(1100); await expect(page.locator(".village-near")).toContainText("Balai Proyek");
  await page.getByRole("button", { name: "Berinteraksi dengan lokasi terdekat" }).click(); await page.clock.runFor(100);
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("failed media has a readable fallback", async ({ page }) => {
  await page.route("**/screenshots/satu-data-kota-malang-landing.png", (route) => route.abort());
  await page.goto("/3d"); await openLocation(page, "Balai Proyek");
  await page.getByRole("button", { name: "Lihat screenshot Satu Data Kota Malang 1", exact: true }).click();
  await expect(page.locator(".village-media")).toContainText("Gambar belum dapat dimuat");
});

test("failed game module provides retry and home navigation", async ({ page }) => {
  await page.route(/\/assets\/GamePage-.*\.js$/, (route) => route.abort());
  await page.goto("/3d"); await expect(page.getByRole("heading", { name: "Dunia belum dapat dibuka" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Coba lagi" })).toBeVisible();
  await page.getByRole("link", { name: "Kembali ke Portofolio" }).click(); await expect(page.getByRole("heading", { name: "Fullstack Developer", exact: true })).toBeVisible();
});

test("reduced motion and measured frame rate", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/3d");
  await expect(page.locator("canvas")).toBeVisible(); await expect(page.locator(".village-loading")).toHaveCount(0);
  await page.waitForTimeout(500);
  const sample = await page.evaluate(() => new Promise<{ fps: number; frames: number; renderer: string; width: number; height: number }>((resolve) => {
    const canvas = document.querySelector("canvas")!;
    const gl = canvas.getContext("webgl2")!;
    const extension = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = extension ? String(gl.getParameter(extension.UNMASKED_RENDERER_WEBGL)) : "unknown";
    let start = 0, frames = 0;
    function sampleFrame(now: number) {
      if (!start) start = now;
      frames++;
      if (now - start < 2000) requestAnimationFrame(sampleFrame);
      else resolve({ fps: Math.round((frames - 1) / ((now - start) / 1000) * 10) / 10, frames, renderer, width: innerWidth, height: innerHeight });
    }
    requestAnimationFrame(sampleFrame);
  }));
  console.log(`FRAME_SAMPLE ${testInfo.project.name}: ${JSON.stringify(sample)}`);
  await testInfo.attach("frame-sample", { body: JSON.stringify(sample, null, 2), contentType: "application/json" });
  expect(sample.frames).toBeGreaterThan(1);
});
