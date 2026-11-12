// Usage: node shot.mjs [venueId] [zoom]
import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const mobile = process.argv.includes("--mobile");
const [venue, zoom] = process.argv.slice(2).filter((a) => a !== "--mobile");

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--enable-gpu", "--use-angle=metal", "--window-size=1440,900"],
});
const page = await browser.newPage();
if (mobile) {
  await page.emulate({
    viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  });
} else {
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
}
page.on("console", (m) => { if (m.type() === "error") console.log("console:", m.text()); });
page.on("pageerror", (e) => console.log("pageerror:", e.message));
await page.goto("file://" + path.join(root, "index.html"));
await new Promise((r) => setTimeout(r, 6000));
if (venue) {
  await page.evaluate((id, z) => window.__tmm.focus(id, z ? Number(z) : undefined), venue, zoom);
  await new Promise((r) => setTimeout(r, 4000));
}
const out = path.join(root, "tools", "shots", (venue || "overview") + (mobile ? "-mobile" : "") + ".png");
await page.screenshot({ path: out });
console.log("saved", out);
await browser.close();
