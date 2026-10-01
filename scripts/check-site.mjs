import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { launchBrowser, root } from "./browser.mjs";

const site = resolve(root, "_site");
const artifacts = resolve(root, "artifacts");
const papers = JSON.parse(await readFile(resolve(root, "data/publications.json"), "utf8"));
const selectedCount = papers.filter((paper) => paper.selected).length;
mkdirSync(artifacts, { recursive: true });
const mime = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".pdf": "application/pdf",
};

// Exercise the same output at both a user-site root and a project-site subpath.
const server = createServer(async (request, response) => {
  try {
    let path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (path.startsWith("/homepage/")) path = path.slice("/homepage".length);
    if (path.endsWith("/")) path += "index.html";
    const file = resolve(site, `.${path}`);
    if (!file.startsWith(`${site}${sep}`)) throw new Error("Invalid path");
    response.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
    response.end(await readFile(file));
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];

try {
  browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push(response.url());
  });
  page.on("requestfailed", (request) => errors.push(request.url()));

  for (const path of ["/", "/homepage/"]) {
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    assert.equal(await page.title(), "Chuan Zhou | Statistics & Causal Learning");
    assert.equal(await page.locator("h1").innerText(), "Chuan Zhou.");
    assert.equal(await page.locator(".publication:visible").count(), selectedCount);
    assert(await page.locator(".portrait").evaluate((image) => image.complete && image.naturalWidth > 0));
    for (const [filter, expected] of [
      ["all", papers.length],
      ["causal", papers.filter((paper) => paper.topic.split(" ").includes("causal")).length],
      ["llm", papers.filter((paper) => paper.topic.split(" ").includes("llm")).length],
      ["selected", selectedCount],
    ]) {
      await page.locator(`[data-filter="${filter}"]`).click();
      assert.equal(await page.locator(".publication:visible").count(), expected);
      assert.equal(await page.locator(`[data-filter="${filter}"]`).getAttribute("aria-pressed"), "true");
    }
    await page.locator(".view-all-button").click();
    assert.equal(await page.locator(".publication:visible").count(), papers.length);
    assert.equal(await page.locator(".view-all-button").isVisible(), false);
    await page.locator('[data-filter="selected"]').click();
    const localLinks = await page.locator('a[href]').evaluateAll((links) =>
      [...new Set(links.map((link) => link.href).filter((href) =>
        href.startsWith(location.origin) && !href.includes("#")))],
    );
    for (const url of localLinks) {
      const response = await page.request.get(url);
      assert.equal(response.status(), 200, `Broken local link: ${url}`);
    }
    assert.equal(await page.locator('a[href="#"]').count(), 0);
    const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll((links) =>
      links.filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash),
    );
    assert.deepEqual(brokenAnchors, []);
  }

  await page.goto(base, { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(artifacts, "desktop.png") });
  await page.screenshot({ path: resolve(artifacts, "desktop-full.png"), fullPage: true });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    assert(await page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth),
      `Horizontal overflow at ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: resolve(artifacts, "mobile.png"), fullPage: true });
  await page.locator(".menu-toggle").click();
  assert.equal(await page.locator("#mobile-nav").isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#mobile-nav").isVisible(), false);
  await page.locator(".menu-toggle").click();
  await page.locator('#mobile-nav a[href="#education"]').click();
  assert.equal(await page.locator("#mobile-nav").isVisible(), false);
  assert.equal(new URL(page.url()).hash, "#education");
  await page.locator(".thesis summary").first().click();
  assert.equal(await page.locator(".thesis").first().getAttribute("open"), "");

  const noJsContext = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(base);
  assert.equal(await noJsPage.locator(".publication:visible").count(), papers.length);
  assert.equal(await noJsPage.locator(".publication-toolbar").isVisible(), false);
  assert.equal(await noJsPage.locator(".menu-toggle").isVisible(), false);
  await noJsContext.close();
  assert.deepEqual(errors, []);
  console.log("PASS: root and project paths; publication filters; local links.");
  console.log("PASS: 320–1440px layouts; mobile navigation; keyboard dismissal; thesis details.");
  console.log("PASS: no-JavaScript content; no missing assets or browser errors.");
  console.log(`Screenshots: ${artifacts}`);
} finally {
  if (browser) await browser.close();
  server.close();
}
