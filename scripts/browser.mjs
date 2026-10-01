import { existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Keep automated browsers inside this project, separate from personal profiles.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= resolve(root, "node_modules/.cache/ms-playwright");
const { chromium } = await import("playwright");

export async function launchBrowser() {
  let executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  // An existing standalone Playwright shell is also suitable for offline checks.
  // This never launches the user's personal Chrome application or profile.
  if (!executablePath && !existsSync(chromium.executablePath()) && process.platform === "darwin") {
    const cache = resolve(homedir(), "Library/Caches/ms-playwright");
    const arch = process.arch === "arm64" ? "arm64" : "x64";
    if (existsSync(cache)) {
      executablePath = readdirSync(cache)
        .filter((name) => /^chromium_headless_shell-\d+$/.test(name))
        .sort((a, b) => Number(b.split("-").at(-1)) - Number(a.split("-").at(-1)))
        .map((name) => resolve(cache, name, `chrome-headless-shell-mac-${arch}`, "chrome-headless-shell"))
        .find((path) => existsSync(path));
    }
  }
  if (!executablePath && !existsSync(chromium.executablePath())) {
    throw new Error("Browser not installed. Run npm run browser:install first.");
  }
  return chromium.launch({ executablePath, headless: true });
}
