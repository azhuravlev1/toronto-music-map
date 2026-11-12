// Checks that the mobile card closes via the × button and via swipe-down.
import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--enable-gpu", "--use-angle=metal"] });
const p = await b.newPage();
await p.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" });
p.on("pageerror", (e) => console.log("pageerror:", e.message));
await p.goto("file://" + path.join(root, "index.html"));
await new Promise((r) => setTimeout(r, 3000));
const visible = () => p.evaluate(() => getComputedStyle(document.getElementById("card")).display !== "none");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await p.evaluate(() => window.__tmm.focus("massey-hall", 15));
await wait(800);
console.log("opened:", await visible());
await p.tap(".card .close");
await wait(500);
console.log("after × tap, visible:", await visible());

await p.evaluate(() => window.__tmm.focus("massey-hall", 15));
await wait(800);
const box = await p.$eval(".card .head", (el) => { const r = el.getBoundingClientRect(); return { x: r.x + 60, y: r.y + 40 }; });
await p.touchscreen.touchStart(box.x, box.y);
for (let i = 1; i <= 10; i++) { await p.touchscreen.touchMove(box.x, box.y + i * 20); await wait(16); }
await p.touchscreen.touchEnd();
await wait(600);
console.log("after swipe down, visible:", await visible());

await p.evaluate(() => window.__tmm.focus("massey-hall", 15));
await wait(800);
await p.touchscreen.touchStart(box.x, box.y);
for (let i = 1; i <= 3; i++) { await p.touchscreen.touchMove(box.x, box.y + i * 15); await wait(16); }
await p.touchscreen.touchEnd();
await wait(600);
console.log("after short drag (should stay open):", await visible());
await b.close();
