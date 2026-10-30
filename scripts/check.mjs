// Verifies the remake in a real browser and writes REPORT.md.
// The report ends with "REMAKE COMPLETE" only when every check passes.
// Usage: node scripts/check.mjs
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = ["index.html", "data-centres.html", "services.html", "sustainability.html", "about.html", "contact.html"];
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png" };

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = join(root, path === "/" ? "index.html" : path);
  if (!file.startsWith(root) || !existsSync(file)) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;

const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });

const browser = await chromium.launch();
const shots = join(root, "screenshots");
mkdirSync(shots, { recursive: true });

try {
  for (const p of PAGES) {
    for (const [label, viewport] of [["desktop", { width: 1366, height: 900 }], ["mobile", { width: 375, height: 800 }]]) {
      const ctx = await browser.newContext({ viewport });
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => { if (m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text())) errors.push(m.text()); });
      page.on("requestfailed", (r) => { if (r.url().startsWith(base)) errors.push(`failed ${r.url()}`); });
      const resp = await page.goto(base + p, { waitUntil: "load" });
      check(`${p} [${label}] loads with 200`, resp && resp.status() === 200);
      check(`${p} [${label}] no JS/console errors`, errors.length === 0, errors.join("; "));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      check(`${p} [${label}] no horizontal scroll`, overflow <= 0, `overflow ${overflow}px`);
      if (label === "desktop") {
        const meta = await page.evaluate(() => ({
          title: document.title,
          desc: document.querySelector('meta[name="description"]')?.content || "",
          h1: document.querySelectorAll("h1").length,
          lang: document.documentElement.lang,
          header: !!document.querySelector("header.site-header nav"),
          footer: !!document.querySelector("footer.site-footer"),
          links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
        }));
        check(`${p} has title and meta description`, meta.title && meta.desc.length > 40, meta.title);
        check(`${p} has exactly one h1`, meta.h1 === 1, `${meta.h1} h1`);
        check(`${p} has lang, header nav and footer`, meta.lang && meta.header && meta.footer);
        const internal = [...new Set(meta.links.filter((h) => !/^(https?:|mailto:|tel:|#)/.test(h)).map((h) => h.split("#")[0]))];
        const broken = internal.filter((h) => !existsSync(join(root, h)));
        check(`${p} internal links resolve`, broken.length === 0, broken.join(", "));
      }
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")));
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(shots, `${p.replace(".html", "")}-${label}.png`), fullPage: true });

      if (label === "mobile" && p === "index.html") {
        const before = await page.isVisible("#site-nav");
        await page.click(".menu-toggle");
        const after = await page.isVisible("#site-nav");
        check("Mobile menu opens on tap", !before && after);
      }
      await ctx.close();
    }
  }

  // Data centres page interactions
  {
    const page = await browser.newPage();
    await page.goto(base + "data-centres.html");
    const all = await page.locator("#campus-grid .campus").count();
    check("Data centres grid renders all 11 facilities", all === 11, `${all} cards`);
    await page.click('.filter[data-region="Stockley Park"]');
    const sp = await page.locator("#campus-grid .campus").count();
    const spOnly = await page.$$eval("#campus-grid .campus", (els) => els.every((e) => e.dataset.region === "Stockley Park"));
    check("Campus filter shows only Stockley Park (4)", sp === 4 && spOnly, `${sp} cards`);
    await page.click('.filter[data-region="All"]');
    check("Campus filter resets to all", (await page.locator("#campus-grid .campus").count()) === 11);
    for (const id of ["stockley-park", "slough", "hayes", "enfield"]) {
      check(`Campus anchor #${id} exists`, (await page.locator(`#${id}`).count()) === 1);
    }
    await page.close();
  }

  // Contact form
  {
    const page = await browser.newPage();
    await page.goto(base + "contact.html");
    await page.click('form.contact button[type="submit"]');
    const err = await page.textContent(".form-status");
    check("Contact form rejects empty submission", /required/i.test(err), err);
    await page.fill("#name", "Test User");
    await page.fill("#company", "Example Ltd");
    await page.fill("#email", "test@example.com");
    await page.fill("#message", "We need 2MW in west London.");
    await page.click('form.contact button[type="submit"]');
    const ok = await page.textContent(".form-status");
    check("Contact form accepts valid submission", /thanks/i.test(ok), ok);
    const unlabeled = await page.$$eval("form.contact input, form.contact select, form.contact textarea",
      (els) => els.filter((e) => !document.querySelector(`label[for="${e.id}"]`)).length);
    check("All form fields have labels", unlabeled === 0, `${unlabeled} unlabeled`);
    await page.close();
  }

  // Homepage content sections expected from the original site's structure
  {
    const page = await browser.newPage();
    await page.goto(base + "index.html");
    const text = await page.evaluate(() => document.body.innerText);
    for (const k of ["Colocation", "Hyperscale", "Stockley Park", "Slough", "Hayes", "Enfield", "Sustainability", "ST Telemedia"]) {
      check(`Homepage covers "${k}"`, text.includes(k));
    }
    check("Homepage has stats band", (await page.locator(".stats .stat").count()) >= 4);
    check("Homepage has primary CTA to contact", (await page.locator('a[href="contact.html"]').count()) >= 2);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

const failed = results.filter((r) => !r.ok);
const lines = [
  "# Remake verification report",
  "",
  "Target: https://virtusdatacentres.com/ (unofficial redesign concept)",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `**${results.length - failed.length}/${results.length} checks passed**`,
  "",
  "| Check | Result | Detail |",
  "|---|---|---|",
  ...results.map((r) => `| ${r.name} | ${r.ok ? "PASS" : "FAIL"} | ${r.detail.replace(/\|/g, "\\|")} |`),
  "",
  "Screenshots of every page at desktop (1366px) and mobile (375px) widths are in `screenshots/`.",
  "",
  failed.length ? `REMAKE INCOMPLETE — ${failed.length} check(s) failing` : "REMAKE COMPLETE",
  "",
];
writeFileSync(join(root, "REPORT.md"), lines.join("\n"));
console.log(lines.slice(6).join("\n"));
process.exit(failed.length ? 1 : 0);
